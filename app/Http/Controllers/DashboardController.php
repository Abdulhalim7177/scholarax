<?php

namespace App\Http\Controllers;

use App\Enums\ApplicationDocumentStatus;
use App\Enums\ApplicationStatus;
use App\Models\ActivityEvent;
use App\Models\Application;
use App\Models\ApplicationDocument;
use App\Models\ApplicationTask;
use App\Models\Scholarship;
use App\Models\TeamInvitation;
use App\Support\ApplicationData;
use App\Support\ScholarshipData;
use App\Support\StudentProfileData;
use Carbon\CarbonInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();
        $completion = StudentProfileData::completion($user);

        $savedScholarships = $user->savedScholarships()
            ->with(['hostCountry', 'studyLevels', 'fieldsOfStudy'])
            ->orderByDesc('saved_scholarships.created_at')
            ->limit(4)
            ->get();

        $applications = $user->applications()
            ->with([
                'scholarship.hostCountry',
                'scholarship.studyLevels',
                'scholarship.fieldsOfStudy',
            ])
            ->orderByDesc('updated_at')
            ->get();

        $applicationIds = $applications->pluck('id')->all();

        $taskTotal = ApplicationTask::query()->whereIn('application_id', $applicationIds)->count();
        $taskDone = ApplicationTask::query()
            ->whereIn('application_id', $applicationIds)
            ->whereNotNull('completed_at')
            ->count();

        $documentTotal = ApplicationDocument::query()
            ->whereIn('application_id', $applicationIds)
            ->count();
        $documentDone = ApplicationDocument::query()
            ->whereIn('application_id', $applicationIds)
            ->whereIn('status', [
                ApplicationDocumentStatus::Submitted->value,
                ApplicationDocumentStatus::Approved->value,
            ])
            ->count();

        $activeApplications = $applications
            ->filter(fn (Application $application) => $application->status->isActive())
            ->values();

        $currentApplication = $activeApplications->first() ?? $applications->first();

        $tasks = ApplicationTask::query()
            ->whereIn('application_id', $applicationIds)
            ->whereNull('completed_at')
            ->with('application.scholarship')
            ->orderByRaw('due_at is null')
            ->orderBy('due_at')
            ->limit(4)
            ->get()
            ->map(fn (ApplicationTask $task) => [
                'id' => $task->id,
                'title' => $task->title,
                'description' => $task->description,
                'due' => $task->due_at?->format('j M Y'),
                'applicationId' => $task->application_id,
                'applicationTitle' => $task->application->scholarship->title,
                'updateUrl' => '/applications/'.$task->application_id.'/tasks/'.$task->id,
            ])
            ->values();

        $deadlines = $this->deadlines($savedScholarships, $activeApplications);
        $pendingInvitations = $this->pendingInvitations($user->email);

        $journey = [
            'discover' => $savedScholarships->isNotEmpty() || $applications->isNotEmpty(),
            'prepare' => $documentTotal > 0,
            'apply' => $applications->contains(
                fn (Application $application) => in_array(
                    $application->status,
                    [ApplicationStatus::Submitted, ApplicationStatus::OfferReceived, ApplicationStatus::Rejected],
                    true,
                ),
            ),
        ];

        $strength = [
            'profile' => [
                'score' => $completion['score'],
                'completed' => $completion['completed'],
                'total' => $completion['total'],
            ],
            'application' => [
                'score' => (int) round((float) ($applications->avg('progress') ?? 0)),
                'tasksCompleted' => $taskDone,
                'tasksTotal' => $taskTotal,
                'documentsComplete' => $documentDone,
                'documentsTotal' => $documentTotal,
            ],
        ];

        return Inertia::render('dashboard', [
            'pendingInvitations' => $pendingInvitations,
            'metrics' => [
                'savedScholarships' => $user->savedScholarships()->count(),
                'applicationsInProgress' => $activeApplications->count(),
                'profileCompletion' => $completion['score'],
                'upcomingDeadlines' => $deadlines->count(),
            ],
            'currentApplication' => $currentApplication instanceof Application
                ? ApplicationData::summary($currentApplication)
                : null,
            'journey' => $journey,
            'strength' => $strength,
            'savedScholarships' => $savedScholarships
                ->map(fn (Scholarship $scholarship) => ScholarshipData::summary($scholarship, true))
                ->values(),
            'deadlines' => $deadlines->take(3)->values(),
            'tasks' => $tasks,
            'activity' => $user->activityEvents()
                ->limit(4)
                ->get()
                ->map(fn (ActivityEvent $event) => [
                    'id' => $event->id,
                    'type' => $event->type,
                    'title' => $event->title,
                    'body' => $event->body,
                    'createdAt' => $event->created_at?->toIso8601String(),
                ])
                ->values(),
            'focus' => $this->focus($completion, $tasks, $currentApplication, $savedScholarships),
        ]);
    }

    /**
     * Build the upcoming deadline list from saved scholarships and applications.
     *
     * @param  Collection<int, Scholarship>  $savedScholarships
     * @param  Collection<int, Application>  $applications
     * @return Collection<int, array<string, mixed>>
     */
    private function deadlines(Collection $savedScholarships, Collection $applications): Collection
    {
        $deadlines = collect();

        foreach ($savedScholarships as $scholarship) {
            $deadline = $scholarship->deadline_at;

            if (! $deadline instanceof CarbonInterface || $deadline->isPast()) {
                continue;
            }

            $deadlines->push([
                'id' => 'scholarship-'.$scholarship->id,
                'title' => $scholarship->title,
                'label' => ScholarshipData::deadlineLabel(
                    (int) now()->startOfDay()->diffInDays($deadline->copy()->startOfDay(), false),
                ),
                'month' => $deadline->format('M'),
                'day' => $deadline->format('j'),
                'timestamp' => $deadline->getTimestamp(),
                'url' => '/scholarships/'.$scholarship->slug,
            ]);
        }

        foreach ($applications as $application) {
            $deadline = $application->deadline_at;

            if (! $deadline instanceof CarbonInterface || $deadline->isPast()) {
                continue;
            }

            $deadlines->push([
                'id' => 'application-'.$application->id,
                'title' => $application->scholarship->title,
                'label' => ScholarshipData::deadlineLabel(
                    (int) now()->startOfDay()->diffInDays($deadline->copy()->startOfDay(), false),
                ),
                'month' => $deadline->format('M'),
                'day' => $deadline->format('j'),
                'timestamp' => $deadline->getTimestamp(),
                'url' => '/applications/'.$application->id,
            ]);
        }

        return $deadlines->sortBy('timestamp')->values();
    }

    /**
     * Build the next recommended action for the student.
     *
     * @param  array{score: int, completed: int, total: int, checks: array<int, array<string, mixed>>}  $completion
     * @param  Collection<int, array{id: int, title: string, description: string|null, due: string|null, applicationId: int, applicationTitle: string, updateUrl: string}>  $tasks
     * @param  Collection<int, Scholarship>  $savedScholarships
     * @return array<string, string>
     */
    private function focus(
        array $completion,
        Collection $tasks,
        ?Application $application,
        Collection $savedScholarships,
    ): array {
        if ($completion['score'] < 100) {
            $nextCheck = collect($completion['checks'])->firstWhere('complete', false);

            return [
                'title' => 'Complete your profile',
                'body' => is_array($nextCheck) && isset($nextCheck['label'])
                    ? (string) $nextCheck['label']
                    : 'Add the remaining details to your scholarship profile.',
                'href' => '/profile',
                'action' => 'Complete profile',
            ];
        }

        $task = $tasks->first();

        if (is_array($task)) {
            return [
                'title' => (string) $task['title'],
                'body' => (string) $task['applicationTitle'],
                'href' => '/applications/'.$task['applicationId'],
                'action' => 'Open application',
            ];
        }

        if ($application instanceof Application) {
            return [
                'title' => $application->scholarship->title,
                'body' => 'Continue where you left off and keep your application moving.',
                'href' => '/applications/'.$application->id,
                'action' => 'Continue application',
            ];
        }

        if ($savedScholarships->isNotEmpty()) {
            return [
                'title' => 'Start an application',
                'body' => 'You have saved scholarships waiting for you.',
                'href' => '/scholarships',
                'action' => 'Browse scholarships',
            ];
        }

        return [
            'title' => 'Find your first scholarship',
            'body' => 'Explore funding opportunities that match your goals.',
            'href' => '/scholarships',
            'action' => 'Find scholarships',
        ];
    }

    /**
     * Get the pending team invitations for an email address.
     *
     * @return Collection<int, array{code: string, inviterName: string, team: array{name: string, slug: string}}>
     */
    private function pendingInvitations(string $email): Collection
    {
        return TeamInvitation::query()
            ->where('email', $email)
            ->whereNull('accepted_at')
            ->where(fn ($query) => $query->whereNull('expires_at')->orWhere('expires_at', '>', now()))
            ->with(['team', 'inviter'])
            ->get()
            ->map(fn (TeamInvitation $invitation) => [
                'code' => $invitation->code,
                'inviterName' => $invitation->inviter->name,
                'team' => [
                    'name' => $invitation->team->name,
                    'slug' => $invitation->team->slug,
                ],
            ]);
    }
}
