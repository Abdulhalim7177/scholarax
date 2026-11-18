<?php

namespace App\Support;

use App\Enums\AvailabilityStatus;
use App\Models\Country;
use App\Models\ExpertiseTag;
use App\Models\MentorAvailabilitySlot;
use App\Models\MentorProfile;
use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Storage;

final class MentorData
{
    /**
     * Transform a mentor profile into the directory card payload.
     *
     * @return array<string, mixed>
     */
    public static function summary(MentorProfile $profile): array
    {
        $profile->loadMissing(['user', 'country', 'expertiseTags']);
        $user = $profile->user;

        return [
            'id' => $profile->id,
            'name' => $user->name,
            'headline' => $profile->headline,
            'role' => $profile->current_role,
            'organization' => $profile->organization,
            'country' => $profile->country->name ?? 'Remote',
            'countryCode' => $profile->country?->iso2,
            'expertise' => $profile->expertiseTags->pluck('name')->values()->all(),
            'languages' => $profile->languages ?? [],
            'rating' => number_format((float) $profile->rating_avg, 1),
            'reviews' => $profile->reviews_count,
            'sessions' => $profile->sessions_count,
            'learners' => $profile->learners_count,
            'responseTime' => $profile->responseTimeLabel(),
            'availability' => $profile->availability_status->value,
            'availabilityLabel' => $profile->availability_status->label(),
            'accent' => self::accent($profile),
            'avatarUrl' => $user->avatar_url,
            'featured' => $profile->is_featured,
            'verified' => $profile->verification_status->isVerified(),
        ];
    }

    /**
     * Transform a mentor profile into the public profile payload.
     *
     * @return array<string, mixed>
     */
    public static function detail(MentorProfile $profile): array
    {
        $profile->loadMissing(['user', 'country', 'expertiseTags', 'availabilitySlots']);

        return [
            ...self::summary($profile),
            'bio' => $profile->bio,
            'yearsExperience' => $profile->years_experience,
            'linkedinUrl' => $profile->linkedin_url,
            'websiteUrl' => $profile->website_url,
            'introVideoUrl' => $profile->intro_video_path === null
                ? null
                : Storage::disk('public')->url($profile->intro_video_path),
            'verifiedAt' => $profile->verified_at?->toIso8601String(),
            'slots' => $profile->availabilitySlots
                ->map(fn (MentorAvailabilitySlot $slot) => self::slot($slot))
                ->values()
                ->all(),
        ];
    }

    /**
     * Build the payload used by the mentor's own profile editor.
     *
     * @return array<string, mixed>
     */
    public static function ownProfile(User $user, MentorProfile $profile): array
    {
        $profile->loadMissing(['expertiseTags', 'availabilitySlots']);
        $attachedTags = $profile->expertiseTags;
        $attachedIds = $attachedTags->pluck('id')->all();

        return [
            'profile' => [
                'name' => $user->name,
                'headline' => $profile->headline ?? '',
                'current_role' => $profile->current_role ?? '',
                'organization' => $profile->organization ?? '',
                'country_id' => $profile->country_id === null ? '' : (string) $profile->country_id,
                'bio' => $profile->bio ?? '',
                'languages' => implode(', ', $profile->languages ?? []),
                'years_experience' => $profile->years_experience === null ? '' : (string) $profile->years_experience,
                'linkedin_url' => $profile->linkedin_url ?? '',
                'website_url' => $profile->website_url ?? '',
                'availability_status' => $profile->availability_status->value,
                'avatar_url' => $user->avatar_url,
                'intro_video_url' => $profile->intro_video_path === null
                    ? null
                    : Storage::disk('public')->url($profile->intro_video_path),
            ],
            'verification' => [
                'status' => $profile->verification_status->value,
                'label' => $profile->verification_status->label(),
                'verifiedAt' => $profile->verified_at?->toIso8601String(),
            ],
            'expertise' => self::tags($attachedTags),
            'availableExpertise' => self::tags(
                ExpertiseTag::query()
                    ->whereNotIn('id', $attachedIds)
                    ->orderBy('name')
                    ->get(),
            ),
            'slots' => $profile->availabilitySlots
                ->map(fn (MentorAvailabilitySlot $slot) => self::slot($slot))
                ->values()
                ->all(),
            'options' => [
                'countries' => Country::query()
                    ->where('is_active', true)
                    ->orderBy('name')
                    ->get()
                    ->map(fn (Country $country) => [
                        'value' => (string) $country->id,
                        'label' => $country->name,
                    ])
                    ->values()
                    ->all(),
                'availabilityStatuses' => array_map(
                    fn (AvailabilityStatus $status) => [
                        'value' => $status->value,
                        'label' => $status->label(),
                    ],
                    AvailabilityStatus::cases(),
                ),
                'weekdays' => self::weekdayOptions(),
            ],
            'completion' => self::completion($profile),
            'publicUrl' => route('mentors.show', $profile),
        ];
    }

    /**
     * Get the filter options for the public directory.
     *
     * @return array<string, array<int, array{value: string, label: string}>>
     */
    public static function directoryOptions(): array
    {
        return [
            'expertise' => [
                ['value' => '', 'label' => 'All expertise'],
                ...ExpertiseTag::query()
                    ->orderBy('name')
                    ->get()
                    ->map(fn (ExpertiseTag $tag) => [
                        'value' => $tag->slug,
                        'label' => $tag->name,
                    ])
                    ->values()
                    ->all(),
            ],
            'countries' => [
                ['value' => '', 'label' => 'All locations'],
                ...Country::query()
                    ->where('is_active', true)
                    ->orderBy('name')
                    ->get()
                    ->map(fn (Country $country) => [
                        'value' => $country->iso2,
                        'label' => $country->name,
                    ])
                    ->values()
                    ->all(),
            ],
        ];
    }

    /**
     * Get aggregate directory statistics.
     *
     * @return array{mentors: int, sessions: int, rating: string, reviews: int}
     */
    public static function stats(): array
    {
        return [
            'mentors' => MentorProfile::query()->verified()->count(),
            'sessions' => (int) MentorProfile::query()->verified()->sum('sessions_count'),
            'rating' => number_format(
                (float) (MentorProfile::query()->verified()->avg('rating_avg') ?? 0),
                1,
            ),
            'reviews' => (int) MentorProfile::query()->verified()->sum('reviews_count'),
        ];
    }

    /**
     * Resolve the mentor featured on the home page.
     *
     * @return array<string, mixed>|null
     */
    public static function featured(): ?array
    {
        $profile = MentorProfile::query()
            ->verified()
            ->with(['user', 'country', 'expertiseTags'])
            ->orderByDesc('is_featured')
            ->orderByDesc('rating_avg')
            ->orderByDesc('reviews_count')
            ->first();

        return $profile instanceof MentorProfile ? self::summary($profile) : null;
    }

    /**
     * Calculate profile completion from persisted fields and records.
     *
     * @return array{score: int, completed: int, total: int, checks: array<int, array{key: string, label: string, complete: bool}>}
     */
    public static function completion(MentorProfile $profile): array
    {
        $checks = [
            ['key' => 'headline', 'label' => 'Add a profile headline', 'complete' => self::filled($profile->headline)],
            ['key' => 'current_role', 'label' => 'Add your current role', 'complete' => self::filled($profile->current_role)],
            ['key' => 'organization', 'label' => 'Add your organization', 'complete' => self::filled($profile->organization)],
            ['key' => 'country', 'label' => 'Select your country', 'complete' => $profile->country_id !== null],
            ['key' => 'bio', 'label' => 'Write your mentor bio', 'complete' => self::filled($profile->bio)],
            ['key' => 'languages', 'label' => 'List the languages you speak', 'complete' => ($profile->languages ?? []) !== []],
            ['key' => 'expertise', 'label' => 'Choose areas of expertise', 'complete' => $profile->expertiseTags()->exists()],
            ['key' => 'availability', 'label' => 'Add an availability slot', 'complete' => $profile->availabilitySlots()->exists()],
            ['key' => 'link', 'label' => 'Add a professional link', 'complete' => self::filled($profile->linkedin_url) || self::filled($profile->website_url)],
            ['key' => 'video', 'label' => 'Upload an introduction video', 'complete' => self::filled($profile->intro_video_path)],
        ];

        $completed = count(array_filter($checks, fn (array $check) => $check['complete']));
        $total = count($checks);

        return [
            'score' => (int) round($completed / $total * 100),
            'completed' => $completed,
            'total' => $total,
            'checks' => $checks,
        ];
    }

    /**
     * Transform an availability slot into a payload.
     *
     * @return array<string, mixed>
     */
    public static function slot(MentorAvailabilitySlot $slot): array
    {
        $weekday = self::weekdayLabel($slot->weekday);
        $start = CarbonImmutable::parse($slot->start_time)->format('g:i A');
        $end = CarbonImmutable::parse($slot->end_time)->format('g:i A');

        return [
            'id' => $slot->id,
            'weekday' => $slot->weekday,
            'weekdayLabel' => $weekday,
            'startTime' => substr($slot->start_time, 0, 5),
            'endTime' => substr($slot->end_time, 0, 5),
            'timezone' => $slot->timezone,
            'isActive' => $slot->is_active,
            'label' => sprintf('%s · %s – %s', $weekday, $start, $end),
        ];
    }

    /**
     * Transform expertise tags into payloads.
     *
     * @param  iterable<int, ExpertiseTag>  $tags
     * @return array<int, array{id: int, name: string, slug: string}>
     */
    public static function tags(iterable $tags): array
    {
        $payload = [];

        foreach ($tags as $tag) {
            $payload[] = [
                'id' => $tag->id,
                'name' => $tag->name,
                'slug' => $tag->slug,
            ];
        }

        return $payload;
    }

    /**
     * Get the weekday filter options.
     *
     * @return array<int, array{value: string, label: string}>
     */
    public static function weekdayOptions(): array
    {
        return array_map(
            fn (int $weekday) => [
                'value' => (string) $weekday,
                'label' => self::weekdayLabel($weekday),
            ],
            range(1, 7),
        );
    }

    /**
     * Get the label for a weekday number.
     */
    public static function weekdayLabel(int $weekday): string
    {
        return [
            1 => 'Monday',
            2 => 'Tuesday',
            3 => 'Wednesday',
            4 => 'Thursday',
            5 => 'Friday',
            6 => 'Saturday',
            7 => 'Sunday',
        ][$weekday] ?? 'Day '.$weekday;
    }

    /**
     * Pick a deterministic accent colour for the mentor.
     */
    private static function accent(MentorProfile $profile): string
    {
        return ['blue', 'teal', 'coral', 'gold'][$profile->id % 4];
    }

    /**
     * Determine whether a value contains meaningful text.
     */
    private static function filled(?string $value): bool
    {
        return $value !== null && trim($value) !== '';
    }
}
