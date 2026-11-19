<?php

namespace App\Http\Controllers;

use App\Models\MentorProfile;
use App\Support\MentorData;
use App\Support\MentorWorkspaceData;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class MentorDirectoryController extends Controller
{
    /**
     * Display the public mentor directory.
     */
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', MentorProfile::class);

        $filters = [
            'q' => trim((string) $request->input('q', '')),
            'expertise' => (string) $request->input('expertise', ''),
            'country' => (string) $request->input('country', ''),
            'availability' => $request->boolean('availability'),
        ];

        $query = MentorProfile::query()
            ->verified()
            ->with(['user', 'country', 'expertiseTags']);

        if ($filters['q'] !== '') {
            $like = '%'.$filters['q'].'%';

            $query->where(function (Builder $query) use ($like): void {
                $query->whereHas('user', function (Builder $user) use ($like): void {
                    $user->where('name', 'like', $like);
                })
                    ->orWhere('headline', 'like', $like)
                    ->orWhere('current_role', 'like', $like)
                    ->orWhere('organization', 'like', $like)
                    ->orWhereHas('expertiseTags', function (Builder $tag) use ($like): void {
                        $tag->where('name', 'like', $like);
                    });
            });
        }

        if ($filters['expertise'] !== '') {
            $query->whereHas('expertiseTags', function (Builder $tag) use ($filters): void {
                $tag->where('slug', $filters['expertise']);
            });
        }

        if ($filters['country'] !== '') {
            $query->whereHas('country', function (Builder $country) use ($filters): void {
                $country->where('iso2', $filters['country']);
            });
        }

        if ($filters['availability']) {
            $query->available();
        }

        $mentors = $query
            ->orderByDesc('is_featured')
            ->orderByDesc('rating_avg')
            ->orderByDesc('reviews_count')
            ->paginate(9)
            ->withQueryString()
            ->through(fn (MentorProfile $profile) => MentorData::summary($profile));

        $recommended = MentorProfile::query()
            ->verified()
            ->with(['user', 'country', 'expertiseTags'])
            ->orderByDesc('is_featured')
            ->orderByDesc('rating_avg')
            ->orderByDesc('reviews_count')
            ->first();

        return Inertia::render('mentors', [
            'mentors' => $mentors,
            'filters' => $filters,
            'options' => MentorData::directoryOptions(),
            'stats' => MentorData::stats(),
            'recommended' => $recommended instanceof MentorProfile
                ? MentorData::summary($recommended)
                : null,
        ]);
    }

    /**
     * Display a mentor's public profile.
     */
    public function show(Request $request, MentorProfile $mentorProfile): Response
    {
        Gate::authorize('view', $mentorProfile);

        $viewer = $request->user();

        return Inertia::render('mentor-show', [
            'mentor' => MentorData::detail($mentorProfile),
            'mentorship' => $viewer === null
                ? null
                : MentorWorkspaceData::studentMentorship($mentorProfile, $viewer),
        ]);
    }
}
