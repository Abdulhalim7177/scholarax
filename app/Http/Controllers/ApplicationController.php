<?php

namespace App\Http\Controllers;

use App\Enums\ApplicationDocumentType;
use App\Enums\ApplicationStatus;
use App\Http\Requests\Student\ApplicationRequest;
use App\Models\Application;
use App\Models\ApplicationDocument;
use App\Models\Scholarship;
use App\Support\ActivityLogger;
use App\Support\ApplicationData;
use App\Support\StudentProfileData;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class ApplicationController extends Controller
{
    /**
     * Display the current user's applications.
     */
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Application::class);

        $user = $request->user();

        $filters = [
            'q' => trim((string) $request->input('q', '')),
            'status' => (string) $request->input('status', ''),
        ];

        $query = Application::query()
            ->where('student_id', $user->id)
            ->with([
                'scholarship.hostCountry',
                'scholarship.studyLevels',
                'scholarship.fieldsOfStudy',
            ]);

        if ($filters['status'] !== '' && ApplicationStatus::tryFrom($filters['status']) !== null) {
            $query->where('status', $filters['status']);
        }

        if ($filters['q'] !== '') {
            $like = '%'.$filters['q'].'%';

            $query->whereHas('scholarship', function (Builder $query) use ($like): void {
                $query->where('title', 'like', $like)->orWhere('provider', 'like', $like);
            });
        }

        $applications = $query
            ->orderByDesc('updated_at')
            ->paginate(10)
            ->withQueryString()
            ->through(fn (Application $application) => ApplicationData::summary($application));

        $completion = StudentProfileData::completion($user);
        $documentTypes = ApplicationDocument::query()
            ->whereHas('application', fn (Builder $query) => $query->where('student_id', $user->id))
            ->pluck('type')
            ->map(fn (ApplicationDocumentType $type) => $type->value)
            ->unique()
            ->values();

        $checklist = [
            [
                'key' => 'profile',
                'label' => 'Complete your profile',
                'complete' => $completion['score'] === 100,
            ],
            [
                'key' => 'cv',
                'label' => 'Upload your CV',
                'complete' => $documentTypes->contains('cv'),
            ],
            [
                'key' => 'sop',
                'label' => 'Draft your SOP',
                'complete' => $documentTypes->contains('sop'),
            ],
            [
                'key' => 'recommendation',
                'label' => 'Request a recommendation',
                'complete' => $documentTypes->contains('recommendation'),
            ],
        ];

        return Inertia::render('applications', [
            'applications' => $applications,
            'filters' => $filters,
            'statuses' => [
                ['value' => '', 'label' => 'All'],
                ...array_map(
                    fn (ApplicationStatus $status) => [
                        'value' => $status->value,
                        'label' => $status->label(),
                    ],
                    ApplicationStatus::cases(),
                ),
            ],
            'stats' => [
                'total' => Application::query()->where('student_id', $user->id)->count(),
                'draft' => Application::query()
                    ->where('student_id', $user->id)
                    ->where('status', ApplicationStatus::Draft)
                    ->count(),
                'in_review' => Application::query()
                    ->where('student_id', $user->id)
                    ->where('status', ApplicationStatus::InReview)
                    ->count(),
                'offer_received' => Application::query()
                    ->where('student_id', $user->id)
                    ->where('status', ApplicationStatus::OfferReceived)
                    ->count(),
            ],
            'summary' => [
                'overallProgress' => (int) round(
                    (float) (Application::query()->where('student_id', $user->id)->avg('progress') ?? 0),
                ),
                'checklist' => $checklist,
                'completedChecks' => count(array_filter($checklist, fn (array $item) => $item['complete'])),
                'totalChecks' => count($checklist),
            ],
        ]);
    }

    /**
     * Show the form for starting a new application.
     */
    public function create(Request $request): Response
    {
        Gate::authorize('create', Application::class);

        $user = $request->user();
        $appliedScholarshipIds = $user->applications()->withTrashed()->pluck('scholarship_id');

        $scholarships = Scholarship::query()
            ->live()
            ->with(['hostCountry', 'studyLevels', 'fieldsOfStudy'])
            ->whereNotIn('id', $appliedScholarshipIds)
            ->orderBy('deadline_at')
            ->get()
            ->map(fn (Scholarship $scholarship) => [
                'id' => $scholarship->id,
                'title' => $scholarship->title,
                'provider' => $scholarship->provider,
                'country' => $scholarship->hostCountry->name ?? 'Multiple countries',
                'level' => $scholarship->studyLevels->pluck('name')->implode(' / '),
                'deadline' => $scholarship->deadline_at?->format('j M Y'),
                'summary' => $scholarship->summary,
                'requiredDocuments' => $scholarship->required_documents ?? [],
            ]);

        return Inertia::render('application-create', [
            'scholarships' => $scholarships,
            'selectedScholarshipId' => $request->integer('scholarship') ?: null,
        ]);
    }

    /**
     * Store a new application for the current user.
     */
    public function store(ApplicationRequest $request): RedirectResponse
    {
        Gate::authorize('create', Application::class);

        $user = $request->user();
        $data = $request->validated();

        $scholarship = Scholarship::query()
            ->live()
            ->findOrFail((int) $data['scholarship_id']);

        $alreadyApplied = $user->applications()
            ->withTrashed()
            ->where('scholarship_id', $scholarship->id)
            ->exists();

        if ($alreadyApplied) {
            throw ValidationException::withMessages([
                'scholarship_id' => __('You already have an application for this scholarship.'),
            ]);
        }

        $application = DB::transaction(function () use ($data, $request, $scholarship, $user): Application {
            $application = Application::query()->create([
                'student_id' => $user->id,
                'scholarship_id' => $scholarship->id,
                'status' => ApplicationStatus::Draft,
                'progress' => 0,
                'deadline_at' => $data['deadline_at'] ?? $scholarship->deadline_at,
            ]);

            if ($request->boolean('create_default_tasks', true)) {
                $this->createDefaultTasks($application, $scholarship);
            }

            $application->statusHistories()->create([
                'from_status' => null,
                'to_status' => ApplicationStatus::Draft,
                'changed_by' => $user->id,
                'note' => 'Application started.',
            ]);

            ActivityLogger::log(
                $user,
                'application_created',
                'Started an application',
                $scholarship->title,
                $application,
            );

            $application->recalculateProgress();

            return $application;
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Application started.')]);

        return to_route('applications.show', $application);
    }

    /**
     * Display a single application.
     */
    public function show(Request $request, Application $application): Response
    {
        Gate::authorize('view', $application);

        return Inertia::render('application-detail', [
            'application' => ApplicationData::detail($application),
            'statuses' => ApplicationData::statusOptions(),
            'documentTypes' => ApplicationData::documentTypeOptions(),
            'documentStatuses' => ApplicationData::documentStatusOptions(),
        ]);
    }

    /**
     * Update the application's status or next step.
     */
    public function update(ApplicationRequest $request, Application $application): RedirectResponse
    {
        Gate::authorize('update', $application);

        $data = $request->validated();

        $user = $request->user();
        $oldStatus = $application->status;

        DB::transaction(function () use ($application, $data, $oldStatus, $user): void {
            if (array_key_exists('next_step', $data)) {
                $application->next_step = $data['next_step'];
            }

            if (array_key_exists('deadline_at', $data)) {
                $application->deadline_at = $data['deadline_at'];
            }

            if (array_key_exists('status', $data)) {
                $newStatus = ApplicationStatus::from((string) $data['status']);
                $application->status = $newStatus;

                if (in_array($newStatus, [ApplicationStatus::Submitted, ApplicationStatus::OfferReceived], true)) {
                    $application->submitted_at ??= CarbonImmutable::now();
                }

                if ($newStatus === ApplicationStatus::OfferReceived) {
                    $application->decision_at ??= CarbonImmutable::now();
                }

                if ($newStatus === ApplicationStatus::Draft) {
                    $application->submitted_at = null;
                    $application->decision_at = null;
                }

                if ($newStatus !== $oldStatus) {
                    $application->statusHistories()->create([
                        'from_status' => $oldStatus,
                        'to_status' => $newStatus,
                        'changed_by' => $user->id,
                        'note' => $data['note'] ?? null,
                    ]);

                    ActivityLogger::log(
                        $user,
                        'status_changed',
                        'Application status updated',
                        $newStatus->label(),
                        $application,
                    );
                }
            }

            $application->save();
            $application->recalculateProgress();
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Application updated.')]);

        return back();
    }

    /**
     * Create starter tasks for a new application.
     */
    private function createDefaultTasks(Application $application, Scholarship $scholarship): void
    {
        $titles = collect($scholarship->required_documents ?? [])
            ->filter(fn (string $title) => trim($title) !== '')
            ->values();

        if ($titles->isEmpty()) {
            $titles = collect([
                'Review eligibility requirements',
                'Prepare your statement of purpose',
                'Request a recommendation letter',
                'Submit your application',
            ]);
        }

        $titles->each(function (string $title, int $index) use ($application): void {
            $application->tasks()->create([
                'title' => $title,
                'description' => 'Required for this application.',
                'due_at' => now()->addDays(min(7 * ($index + 1), 21)),
                'sort_order' => $index,
                'type' => 'document',
            ]);
        });
    }
}
