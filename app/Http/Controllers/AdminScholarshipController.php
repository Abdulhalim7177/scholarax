<?php

namespace App\Http\Controllers;

use App\Enums\FundingType;
use App\Enums\ScholarshipStatus;
use App\Http\Requests\Admin\ScholarshipRequest;
use App\Models\Country;
use App\Models\FieldOfStudy;
use App\Models\Scholarship;
use App\Models\StudyLevel;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AdminScholarshipController extends Controller
{
    /**
     * Display the scholarship catalogue for administrators.
     */
    public function index(Request $request): Response
    {
        $filters = [
            'q' => trim((string) $request->input('q', '')),
            'status' => (string) $request->input('status', ''),
        ];

        $query = Scholarship::query()->with(['hostCountry', 'studyLevels', 'fieldsOfStudy']);

        if ($filters['status'] !== '' && ScholarshipStatus::tryFrom($filters['status']) !== null) {
            $query->where('status', $filters['status']);
        }

        if ($filters['q'] !== '') {
            $like = '%'.$filters['q'].'%';

            $query->where(function (Builder $query) use ($like): void {
                $query
                    ->where('title', 'like', $like)
                    ->orWhere('provider', 'like', $like)
                    ->orWhereHas('hostCountry', fn (Builder $query) => $query->where('name', 'like', $like));
            });
        }

        $scholarships = $query
            ->orderByDesc('updated_at')
            ->paginate(10)
            ->withQueryString()
            ->through(fn (Scholarship $scholarship) => [
                'id' => $scholarship->id,
                'slug' => $scholarship->slug,
                'title' => $scholarship->title,
                'provider' => $scholarship->provider,
                'country' => $scholarship->hostCountry instanceof Country
                    ? $scholarship->hostCountry->name
                    : 'Multiple countries',
                'status' => $scholarship->status->value,
                'statusLabel' => $scholarship->status->label(),
                'deadline' => $scholarship->deadline_at?->format('j M Y'),
                'deadlineAt' => $scholarship->deadline_at?->toIso8601String(),
                'updatedAt' => $scholarship->updated_at?->toIso8601String(),
                'isFeatured' => $scholarship->is_featured,
            ]);

        return Inertia::render('admin-scholarships', [
            'scholarships' => $scholarships,
            'filters' => $filters,
            'statuses' => [
                ['value' => '', 'label' => 'All scholarships'],
                ...collect(ScholarshipStatus::cases())
                    ->map(fn (ScholarshipStatus $status) => [
                        'value' => $status->value,
                        'label' => $status->label(),
                    ])
                    ->all(),
            ],
            'stats' => [
                'live' => Scholarship::query()->live()->count(),
                'createdThisMonth' => Scholarship::query()
                    ->where('created_at', '>=', now()->startOfMonth())
                    ->count(),
                'pending' => Scholarship::query()
                    ->where('status', ScholarshipStatus::Pending)
                    ->count(),
            ],
        ]);
    }

    /**
     * Show the form for creating a scholarship.
     */
    public function create(): Response
    {
        Gate::authorize('create', Scholarship::class);

        return Inertia::render('admin-scholarships-form', [
            'scholarship' => null,
            'options' => $this->formOptions(),
        ]);
    }

    /**
     * Store a newly created scholarship.
     */
    public function store(ScholarshipRequest $request): RedirectResponse
    {
        Gate::authorize('create', Scholarship::class);

        $user = $request->user();
        $data = $request->validated();

        DB::transaction(function () use ($data, $user): void {
            $scholarship = Scholarship::query()->create($this->attributes($data, $user->id));

            $this->syncRelations($scholarship, $data);
        });

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Scholarship created.'),
        ]);

        return to_route('admin-scholarships.index');
    }

    /**
     * Show the form for editing a scholarship.
     */
    public function edit(Scholarship $scholarship): Response
    {
        Gate::authorize('update', $scholarship);

        return Inertia::render('admin-scholarships-form', [
            'scholarship' => $this->formData($scholarship),
            'options' => $this->formOptions(),
        ]);
    }

    /**
     * Update the specified scholarship.
     */
    public function update(ScholarshipRequest $request, Scholarship $scholarship): RedirectResponse
    {
        Gate::authorize('update', $scholarship);

        $user = $request->user();
        $data = $request->validated();

        DB::transaction(function () use ($data, $scholarship, $user): void {
            $scholarship->update($this->attributes($data, $user->id, $scholarship));

            $this->syncRelations($scholarship, $data);
        });

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Scholarship updated.'),
        ]);

        return to_route('admin-scholarships.edit', $scholarship);
    }

    /**
     * Approve a scholarship so it becomes visible to students.
     */
    public function approve(Request $request, Scholarship $scholarship): RedirectResponse
    {
        Gate::authorize('approve', $scholarship);

        $scholarship->update([
            'status' => ScholarshipStatus::Live,
            'verified_at' => now(),
            'published_at' => now(),
            'approved_by' => $request->user()->id,
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Scholarship approved and published.'),
        ]);

        return back();
    }

    /**
     * Remove the specified scholarship.
     */
    public function destroy(Scholarship $scholarship): RedirectResponse
    {
        Gate::authorize('delete', $scholarship);

        $scholarship->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Scholarship deleted.'),
        ]);

        return to_route('admin-scholarships.index');
    }

    /**
     * Map validated input to scholarship attributes.
     *
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    private function attributes(array $data, int $userId, ?Scholarship $scholarship = null): array
    {
        $status = ScholarshipStatus::from((string) $data['status']);
        $isLive = $status === ScholarshipStatus::Live;
        $hostCountryId = $data['host_country_id'] ?? null;

        return [
            ...($scholarship === null ? ['slug' => $this->uniqueSlug((string) $data['title'])] : []),
            'title' => (string) $data['title'],
            'provider' => (string) $data['provider'],
            'summary' => $data['summary'] ?? null,
            'description' => (string) $data['description'],
            'host_country_id' => $hostCountryId === null ? null : (int) $hostCountryId,
            'funding_type' => FundingType::from((string) $data['funding_type']),
            'deadline_at' => (string) $data['deadline_at'],
            'application_url' => $data['application_url'] ?? null,
            'eligibility' => $data['eligibility'] ?? null,
            'required_documents' => $data['required_documents'] ?? [],
            'status' => $status,
            'is_featured' => (bool) ($data['is_featured'] ?? false),
            'verified_at' => $isLive ? ($scholarship->verified_at ?? now()) : null,
            'published_at' => $isLive ? ($scholarship->published_at ?? now()) : null,
            'created_by' => $scholarship->created_by ?? $userId,
            'approved_by' => $isLive ? ($scholarship->approved_by ?? $userId) : null,
        ];
    }

    /**
     * Sync the scholarship's relationships.
     *
     * @param  array<string, mixed>  $data
     */
    private function syncRelations(Scholarship $scholarship, array $data): void
    {
        $levelIds = is_array($data['study_level_ids'] ?? null)
            ? $data['study_level_ids']
            : [];

        $fieldIds = is_array($data['field_of_study_ids'] ?? null)
            ? $data['field_of_study_ids']
            : [];

        $countryIds = is_array($data['eligible_country_ids'] ?? null)
            ? $data['eligible_country_ids']
            : [];

        $scholarship->studyLevels()->sync(
            array_map(fn ($id): int => (int) $id, $levelIds),
        );

        $scholarship->fieldsOfStudy()->sync(
            array_map(fn ($id): int => (int) $id, $fieldIds),
        );

        $scholarship->eligibleCountries()->sync(
            array_map(fn ($id): int => (int) $id, $countryIds),
        );
    }

    /**
     * Transform a scholarship into the admin form payload.
     *
     * @return array<string, mixed>
     */
    private function formData(Scholarship $scholarship): array
    {
        $scholarship->load(['studyLevels', 'fieldsOfStudy', 'eligibleCountries']);

        return [
            'id' => $scholarship->id,
            'slug' => $scholarship->slug,
            'title' => $scholarship->title,
            'provider' => $scholarship->provider,
            'summary' => $scholarship->summary ?? '',
            'description' => $scholarship->description,
            'host_country_id' => $scholarship->host_country_id === null
                ? ''
                : (string) $scholarship->host_country_id,
            'funding_type' => $scholarship->funding_type->value,
            'deadline_at' => $scholarship->deadline_at?->format('Y-m-d') ?? '',
            'application_url' => $scholarship->application_url ?? '',
            'eligibility' => $scholarship->eligibility ?? '',
            'required_documents' => implode("\n", $scholarship->required_documents ?? []),
            'status' => $scholarship->status->value,
            'is_featured' => $scholarship->is_featured,
            'study_level_ids' => array_map('strval', $scholarship->studyLevels->pluck('id')->all()),
            'field_of_study_ids' => array_map('strval', $scholarship->fieldsOfStudy->pluck('id')->all()),
            'eligible_country_ids' => array_map('strval', $scholarship->eligibleCountries->pluck('id')->all()),
        ];
    }

    /**
     * Get the select options used by the scholarship form.
     *
     * @return array<string, array<int, array<string, string>>>
     */
    private function formOptions(): array
    {
        return [
            'countries' => Country::query()
                ->orderBy('name')
                ->get()
                ->map(fn (Country $country) => [
                    'value' => (string) $country->id,
                    'label' => $country->name,
                ])
                ->all(),
            'levels' => StudyLevel::query()
                ->orderBy('sort_order')
                ->orderBy('name')
                ->get()
                ->map(fn (StudyLevel $level) => [
                    'value' => (string) $level->id,
                    'label' => $level->name,
                ])
                ->all(),
            'fields' => FieldOfStudy::query()
                ->orderBy('sort_order')
                ->orderBy('name')
                ->get()
                ->map(fn (FieldOfStudy $field) => [
                    'value' => (string) $field->id,
                    'label' => $field->name,
                ])
                ->all(),
            'fundingTypes' => collect(FundingType::cases())
                ->map(fn (FundingType $fundingType) => [
                    'value' => $fundingType->value,
                    'label' => $fundingType->label(),
                ])
                ->all(),
            'statuses' => collect(ScholarshipStatus::cases())
                ->map(fn (ScholarshipStatus $status) => [
                    'value' => $status->value,
                    'label' => $status->label(),
                ])
                ->all(),
        ];
    }

    /**
     * Generate a unique slug for a scholarship title.
     */
    private function uniqueSlug(string $title): string
    {
        $base = Str::slug($title) ?: 'scholarship';
        $slug = $base;
        $suffix = 2;

        while (Scholarship::withTrashed()->where('slug', $slug)->exists()) {
            $slug = $base.'-'.$suffix;
            $suffix++;
        }

        return $slug;
    }
}
