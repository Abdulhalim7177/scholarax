<?php

namespace App\Support;

use App\Enums\UserRole;
use App\Models\Application;
use App\Models\ContentBlock;
use App\Models\Country;
use App\Models\ImpactStat;
use App\Models\Scholarship;
use App\Models\Testimonial;
use App\Models\User;
use Carbon\CarbonImmutable;

final class HomeData
{
    /**
     * Build the public home page payload from live records.
     *
     * @return array<string, mixed>
     */
    public static function page(): array
    {
        $scholarshipCount = Scholarship::query()->live()->count();
        $countryCount = Country::query()->where('is_active', true)->count();
        $studentCount = User::query()
            ->where('role', UserRole::Student->value)
            ->count();

        return [
            'featuredScholarships' => self::featuredScholarships(),
            'scholarshipCount' => $scholarshipCount,
            'countryCount' => $countryCount,
            'studentCount' => $studentCount,
            'featuredMentor' => MentorData::featured(),
            'impactStats' => self::impactStats($studentCount, $countryCount, $scholarshipCount),
            'testimonials' => self::testimonials(),
            'content' => self::content(),
            'applicationPreview' => self::applicationPreview(),
            'nextDeadline' => self::nextDeadline(),
        ];
    }

    /**
     * Pick the scholarships highlighted on the home page.
     *
     * @return array<int, array<string, mixed>>
     */
    public static function featuredScholarships(): array
    {
        $featured = Scholarship::query()
            ->live()
            ->featured()
            ->with(['hostCountry', 'studyLevels', 'fieldsOfStudy'])
            ->orderBy('deadline_at')
            ->limit(3)
            ->get();

        if ($featured->isEmpty()) {
            $featured = Scholarship::query()
                ->live()
                ->with(['hostCountry', 'studyLevels', 'fieldsOfStudy'])
                ->orderBy('deadline_at')
                ->limit(3)
                ->get();
        }

        return $featured
            ->map(fn (Scholarship $scholarship) => ScholarshipData::summary($scholarship))
            ->values()
            ->all();
    }

    /**
     * Resolve the published impact metrics with live counts.
     *
     * @return array<int, array<string, mixed>>
     */
    public static function impactStats(
        ?int $studentCount = null,
        ?int $countryCount = null,
        ?int $scholarshipCount = null,
    ): array {
        $studentCount ??= User::query()->where('role', UserRole::Student->value)->count();
        $countryCount ??= Country::query()->where('is_active', true)->count();
        $scholarshipCount ??= Scholarship::query()->live()->count();

        return ImpactStat::query()
            ->published()
            ->ordered()
            ->get()
            ->map(fn (ImpactStat $stat) => [
                'key' => $stat->key,
                'label' => $stat->label,
                'icon' => $stat->icon,
                'value' => match ($stat->source) {
                    'students' => $studentCount,
                    'countries' => $countryCount,
                    'scholarships' => $scholarshipCount,
                    default => $stat->value,
                },
            ])
            ->values()
            ->all();
    }

    /**
     * Resolve published learner testimonials.
     *
     * @return array<int, array<string, mixed>>
     */
    public static function testimonials(): array
    {
        return Testimonial::query()
            ->published()
            ->ordered()
            ->get()
            ->map(fn (Testimonial $testimonial) => [
                'id' => $testimonial->id,
                'quote' => $testimonial->quote,
                'authorName' => $testimonial->author_name,
                'authorDetail' => $testimonial->author_detail,
                'initials' => $testimonial->initials,
                'tone' => $testimonial->tone,
            ])
            ->values()
            ->all();
    }

    /**
     * Group published editorial blocks by the section that renders them.
     *
     * @return array<string, array<int, array<string, mixed>>>
     */
    public static function content(): array
    {
        return [
            'features' => self::blocks('feature'),
            'processSteps' => self::blocks('process_step'),
            'applicationSteps' => self::blocks('application_step'),
        ];
    }

    /**
     * Resolve published content blocks for one section.
     *
     * @return array<int, array<string, mixed>>
     */
    private static function blocks(string $type): array
    {
        return ContentBlock::query()
            ->published()
            ->ofType($type)
            ->ordered()
            ->get()
            ->map(fn (ContentBlock $block) => [
                'id' => $block->id,
                'eyebrow' => $block->eyebrow,
                'title' => $block->title,
                'body' => $block->body,
                'badge' => $block->badge,
                'icon' => $block->icon,
                'tone' => $block->tone,
            ])
            ->values()
            ->all();
    }

    /**
     * Summarize live application progress for the home page preview.
     *
     * @return array<string, int>
     */
    public static function applicationPreview(): array
    {
        $progress = (int) round((float) (Application::query()->avg('progress') ?? 0));
        $totalSteps = ContentBlock::query()
            ->published()
            ->ofType('application_step')
            ->count();

        return [
            'progress' => $progress,
            'completedSteps' => $totalSteps === 0
                ? 0
                : (int) floor($totalSteps * $progress / 100),
            'totalSteps' => $totalSteps,
        ];
    }

    /**
     * Resolve the nearest upcoming scholarship deadline.
     *
     * @return array<string, mixed>|null
     */
    public static function nextDeadline(): ?array
    {
        $scholarship = Scholarship::query()
            ->live()
            ->whereNotNull('deadline_at')
            ->where('deadline_at', '>=', CarbonImmutable::now())
            ->orderBy('deadline_at')
            ->first();

        if (! $scholarship instanceof Scholarship || $scholarship->deadline_at === null) {
            return null;
        }

        $deadline = $scholarship->deadline_at;
        $daysLeft = (int) CarbonImmutable::now()
            ->startOfDay()
            ->diffInDays($deadline->startOfDay());

        return [
            'id' => $scholarship->id,
            'title' => $scholarship->title,
            'url' => route('scholarships.show', $scholarship),
            'date' => $deadline->toIso8601String(),
            'monthLabel' => $deadline->format('F Y'),
            'day' => $deadline->day,
            'daysLeft' => $daysLeft,
        ];
    }
}
