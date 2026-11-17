<?php

namespace App\Http\Controllers;

use App\Models\Country;
use App\Models\FieldOfStudy;
use App\Models\Scholarship;
use App\Models\StudyLevel;
use App\Support\ScholarshipData;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ScholarshipController extends Controller
{
    /**
     * Display a filterable list of live scholarships.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        $filters = [
            'q' => trim((string) $request->input('q', '')),
            'country' => (string) $request->input('country', ''),
            'level' => (string) $request->input('level', ''),
            'field' => (string) $request->input('field', ''),
            'funding' => $request->boolean('funding'),
            'sort' => $request->input('sort') === 'latest' ? 'latest' : 'soonest',
        ];

        $query = Scholarship::query()
            ->live()
            ->with(['hostCountry', 'studyLevels', 'fieldsOfStudy'])
            ->withExists([
                'savedByUsers as is_saved' => fn (Builder $query) => $query->where('users.id', $user->id),
            ]);

        if ($filters['q'] !== '') {
            $like = '%'.$filters['q'].'%';

            $query->where(function (Builder $query) use ($like): void {
                $query
                    ->where('title', 'like', $like)
                    ->orWhere('provider', 'like', $like)
                    ->orWhere('summary', 'like', $like)
                    ->orWhere('description', 'like', $like)
                    ->orWhereHas('hostCountry', fn (Builder $query) => $query->where('name', 'like', $like))
                    ->orWhereHas('studyLevels', fn (Builder $query) => $query->where('name', 'like', $like))
                    ->orWhereHas('fieldsOfStudy', fn (Builder $query) => $query->where('name', 'like', $like));
            });
        }

        if ($filters['country'] !== '') {
            $query->where(function (Builder $query) use ($filters): void {
                $query
                    ->where('host_country_id', $filters['country'])
                    ->orWhereHas(
                        'eligibleCountries',
                        fn (Builder $query) => $query->whereKey($filters['country']),
                    );
            });
        }

        if ($filters['level'] !== '') {
            $query->whereHas(
                'studyLevels',
                fn (Builder $query) => $query->where('slug', $filters['level']),
            );
        }

        if ($filters['field'] !== '') {
            $query->whereHas(
                'fieldsOfStudy',
                fn (Builder $query) => $query->where('slug', $filters['field']),
            );
        }

        if ($filters['funding']) {
            $query->where('funding_type', 'fully_funded');
        }

        $scholarships = $query
            ->orderByRaw('deadline_at is null')
            ->orderBy('deadline_at', $filters['sort'] === 'latest' ? 'desc' : 'asc')
            ->paginate(9)
            ->withQueryString()
            ->through(fn (Scholarship $scholarship) => ScholarshipData::summary(
                $scholarship,
                (bool) $scholarship->is_saved,
            ));

        return Inertia::render('scholarships', [
            'scholarships' => $scholarships,
            'filters' => $filters,
            'options' => $this->filterOptions(),
            'savedCount' => $user->savedScholarships()->count(),
        ]);
    }

    /**
     * Display a single scholarship.
     */
    public function show(Request $request, Scholarship $scholarship): Response
    {
        Gate::authorize('view', $scholarship);

        $scholarship->load(['hostCountry', 'studyLevels', 'fieldsOfStudy', 'eligibleCountries']);

        $saved = $request->user()->savedScholarships()
            ->whereKey($scholarship->id)
            ->exists();

        return Inertia::render('scholarship-detail', [
            'scholarship' => ScholarshipData::detail($scholarship, $saved),
        ]);
    }

    /**
     * Get the filter options shown on the scholarship index.
     *
     * @return array<string, array<int, array<string, string>>>
     */
    private function filterOptions(): array
    {
        return [
            'countries' => [
                ['value' => '', 'label' => 'All countries'],
                ...Country::query()
                    ->where('is_active', true)
                    ->orderBy('name')
                    ->get()
                    ->map(fn (Country $country) => [
                        'value' => (string) $country->id,
                        'label' => $country->name,
                    ])
                    ->all(),
            ],
            'levels' => [
                ['value' => '', 'label' => 'All study levels'],
                ...StudyLevel::query()
                    ->orderBy('sort_order')
                    ->orderBy('name')
                    ->get()
                    ->map(fn (StudyLevel $level) => [
                        'value' => $level->slug,
                        'label' => $level->name,
                    ])
                    ->all(),
            ],
            'fields' => [
                ['value' => '', 'label' => 'All fields'],
                ...FieldOfStudy::query()
                    ->orderBy('sort_order')
                    ->orderBy('name')
                    ->get()
                    ->map(fn (FieldOfStudy $field) => [
                        'value' => $field->slug,
                        'label' => $field->name,
                    ])
                    ->all(),
            ],
        ];
    }
}
