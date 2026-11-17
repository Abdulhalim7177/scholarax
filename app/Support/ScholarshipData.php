<?php

namespace App\Support;

use App\Models\Country;
use App\Models\Scholarship;
use Illuminate\Support\Str;

final class ScholarshipData
{
    /**
     * Transform a scholarship into the summary shape used by listings.
     *
     * @return array<string, mixed>
     */
    public static function summary(Scholarship $scholarship, bool $saved = false): array
    {
        $deadline = $scholarship->deadline_at;
        $daysLeft = $deadline === null
            ? null
            : (int) now()->startOfDay()->diffInDays($deadline->copy()->startOfDay(), false);
        $hostCountry = $scholarship->hostCountry;

        return [
            'id' => $scholarship->id,
            'slug' => $scholarship->slug,
            'title' => $scholarship->title,
            'provider' => $scholarship->provider,
            'country' => $hostCountry instanceof Country ? $hostCountry->name : 'Multiple countries',
            'countryCode' => $hostCountry instanceof Country ? $hostCountry->iso2 : 'EU',
            'level' => self::joinNames($scholarship->studyLevels->pluck('name')->all(), 'All levels'),
            'field' => self::joinNames($scholarship->fieldsOfStudy->pluck('name')->all(), 'All fields'),
            'funding' => $scholarship->funding_type->label(),
            'fundingType' => $scholarship->funding_type->value,
            'deadline' => $deadline?->format('j M Y'),
            'deadlineLabel' => self::deadlineLabel($daysLeft),
            'daysLeft' => $daysLeft,
            'description' => $scholarship->summary
                ?? Str::limit(strip_tags($scholarship->description), 150),
            'featured' => $scholarship->is_featured,
            'saved' => $saved,
            'status' => $scholarship->status->value,
        ];
    }

    /**
     * Transform a scholarship into the shape used by the detail page.
     *
     * @return array<string, mixed>
     */
    public static function detail(Scholarship $scholarship, bool $saved = false): array
    {
        return [
            ...self::summary($scholarship, $saved),
            'summary' => $scholarship->summary,
            'description' => $scholarship->description,
            'eligibility' => $scholarship->eligibility,
            'requiredDocuments' => $scholarship->required_documents ?? [],
            'applicationUrl' => $scholarship->application_url,
            'publishedAt' => $scholarship->published_at?->toIso8601String(),
            'updatedAt' => $scholarship->updated_at?->toIso8601String(),
        ];
    }

    /**
     * Build a readable deadline label from the number of days remaining.
     */
    public static function deadlineLabel(?int $daysLeft): string
    {
        return match (true) {
            $daysLeft === null => 'Rolling deadline',
            $daysLeft < 0 => 'Deadline passed',
            $daysLeft === 0 => 'Deadline today',
            $daysLeft <= 14 => 'Deadline soon',
            default => $daysLeft.' days left',
        };
    }

    /**
     * Join a list of names into a single display value.
     *
     * @param  array<int, string>  $names
     */
    private static function joinNames(array $names, string $fallback): string
    {
        return $names === [] ? $fallback : implode(' / ', $names);
    }
}
