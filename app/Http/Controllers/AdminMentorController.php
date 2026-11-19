<?php

namespace App\Http\Controllers;

use App\Enums\MentorshipStatus;
use App\Enums\VerificationStatus;
use App\Models\Country;
use App\Models\ExpertiseTag;
use App\Models\MentorProfile;
use App\Support\AdminData;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminMentorController extends Controller
{
    /**
     * Display the mentor verification workspace.
     */
    public function index(Request $request): Response
    {
        $filters = [
            'q' => trim((string) $request->input('q', '')),
            'status' => (string) $request->input('status', ''),
        ];

        $query = MentorProfile::query()
            ->with(['user', 'country', 'expertiseTags'])
            ->withCount([
                'mentorships as active_learners_count' => fn (Builder $query) => $query
                    ->where('status', MentorshipStatus::Active),
            ]);

        $status = VerificationStatus::tryFrom($filters['status']);

        if ($status !== null) {
            $query->where('verification_status', $status);
        }

        if ($filters['q'] !== '') {
            $like = '%'.$filters['q'].'%';

            $query->where(function (Builder $query) use ($like): void {
                $query
                    ->whereHas('user', fn (Builder $user) => $user->where('name', 'like', $like))
                    ->orWhere('headline', 'like', $like)
                    ->orWhere('current_role', 'like', $like)
                    ->orWhere('organization', 'like', $like)
                    ->orWhereHas('expertiseTags', fn (Builder $tag) => $tag->where('name', 'like', $like));
            });
        }

        $mentors = $query
            ->orderByRaw("case when verification_status = 'pending' then 0 else 1 end")
            ->latest()
            ->paginate(10)
            ->withQueryString()
            ->through(function (MentorProfile $profile): array {
                $tag = $profile->expertiseTags->first();

                return [
                    'id' => $profile->id,
                    'name' => $profile->user->name,
                    'headline' => $profile->headline,
                    'specialty' => $tag instanceof ExpertiseTag ? $tag->name : $profile->current_role,
                    'organization' => $profile->organization,
                    'country' => $profile->country instanceof Country ? $profile->country->name : null,
                    'status' => $profile->verification_status->value,
                    'statusLabel' => match ($profile->verification_status) {
                        VerificationStatus::Verified => 'Verified',
                        VerificationStatus::Pending => 'Pending verification',
                        VerificationStatus::Rejected => 'Rejected',
                    },
                    'rating' => $profile->rating_avg > 0 ? number_format((float) $profile->rating_avg, 1) : null,
                    'reviews' => $profile->reviews_count,
                    'learners' => (int) ($profile->active_learners_count ?? 0),
                    'initials' => AdminData::initials($profile->user->name),
                    'tone' => AdminData::accent($profile->id),
                ];
            });

        return Inertia::render('admin-mentors', [
            'mentors' => $mentors,
            'filters' => $filters,
            'statuses' => [
                ['value' => '', 'label' => 'All mentors'],
                ['value' => VerificationStatus::Pending->value, 'label' => 'Pending verification'],
                ['value' => VerificationStatus::Verified->value, 'label' => 'Verified'],
                ['value' => VerificationStatus::Rejected->value, 'label' => 'Rejected'],
            ],
            'stats' => [
                'verified' => MentorProfile::query()->verified()->count(),
                'pending' => MentorProfile::query()
                    ->where('verification_status', VerificationStatus::Pending)
                    ->count(),
                'averageRating' => number_format(
                    (float) (MentorProfile::query()->verified()->avg('rating_avg') ?? 0),
                    1,
                ),
            ],
        ]);
    }
}
