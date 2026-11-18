<?php

namespace App\Support;

use App\Models\Country;
use App\Models\Education;
use App\Models\FieldOfStudy;
use App\Models\StudentProfile;
use App\Models\StudyLevel;
use App\Models\TestScore;
use App\Models\User;
use App\Models\WorkExperience;

final class StudentProfileData
{
    /**
     * Build the payload used by the student profile page.
     *
     * @return array<string, mixed>
     */
    public static function forUser(User $user): array
    {
        $user->loadMissing(['educations', 'workExperiences', 'testScores', 'studentProfile']);

        return [
            'profile' => $user->studentProfile instanceof StudentProfile
                ? self::profile($user->studentProfile)
                : null,
            'educations' => $user->educations
                ->map(fn (Education $education) => self::education($education))
                ->values()
                ->all(),
            'workExperiences' => $user->workExperiences
                ->map(fn (WorkExperience $experience) => self::workExperience($experience))
                ->values()
                ->all(),
            'testScores' => $user->testScores
                ->map(fn (TestScore $score) => self::testScore($score))
                ->values()
                ->all(),
            'options' => self::options(),
            'completion' => self::completion($user),
        ];
    }

    /**
     * Calculate profile completion from persisted fields and records.
     *
     * @return array{score: int, completed: int, total: int, checks: array<int, array{key: string, label: string, complete: bool}>}
     */
    public static function completion(User $user): array
    {
        $profile = $user->studentProfile;

        $checks = [
            ['key' => 'headline', 'label' => 'Add a headline', 'complete' => self::filled($profile?->headline)],
            ['key' => 'bio', 'label' => 'Write a short bio', 'complete' => self::filled($profile?->bio)],
            ['key' => 'city', 'label' => 'Add your city', 'complete' => self::filled($profile?->city)],
            ['key' => 'country', 'label' => 'Select your country', 'complete' => $profile?->country_id !== null],
            ['key' => 'target_level', 'label' => 'Choose a target study level', 'complete' => $profile?->target_level_id !== null],
            ['key' => 'target_field', 'label' => 'Choose a target field', 'complete' => $profile?->target_field_id !== null],
            ['key' => 'education', 'label' => 'Add an education record', 'complete' => $user->educations()->exists()],
            ['key' => 'test_score', 'label' => 'Add a test score', 'complete' => $user->testScores()->exists()],
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
     * Transform a student profile into a form-friendly payload.
     *
     * @return array<string, mixed>
     */
    public static function profile(StudentProfile $profile): array
    {
        return [
            'headline' => $profile->headline ?? '',
            'bio' => $profile->bio ?? '',
            'date_of_birth' => $profile->date_of_birth?->format('Y-m-d') ?? '',
            'city' => $profile->city ?? '',
            'country_id' => $profile->country_id === null ? '' : (string) $profile->country_id,
            'linkedin_url' => $profile->linkedin_url ?? '',
            'website_url' => $profile->website_url ?? '',
            'target_level_id' => $profile->target_level_id === null ? '' : (string) $profile->target_level_id,
            'target_field_id' => $profile->target_field_id === null ? '' : (string) $profile->target_field_id,
        ];
    }

    /**
     * Transform an education record into a payload.
     *
     * @return array<string, mixed>
     */
    public static function education(Education $education): array
    {
        return [
            'id' => $education->id,
            'institution' => $education->institution,
            'degree' => $education->degree,
            'field' => $education->field ?? '',
            'started_at' => $education->started_at?->format('Y-m-d') ?? '',
            'ended_at' => $education->ended_at?->format('Y-m-d') ?? '',
            'grade' => $education->grade ?? '',
            'is_current' => $education->is_current,
        ];
    }

    /**
     * Transform a work experience record into a payload.
     *
     * @return array<string, mixed>
     */
    public static function workExperience(WorkExperience $experience): array
    {
        return [
            'id' => $experience->id,
            'organization' => $experience->organization,
            'role' => $experience->role,
            'started_at' => $experience->started_at?->format('Y-m-d') ?? '',
            'ended_at' => $experience->ended_at?->format('Y-m-d') ?? '',
            'description' => $experience->description ?? '',
            'is_current' => $experience->is_current,
        ];
    }

    /**
     * Transform a test score record into a payload.
     *
     * @return array<string, mixed>
     */
    public static function testScore(TestScore $score): array
    {
        return [
            'id' => $score->id,
            'type' => $score->type,
            'score' => $score->score,
            'tested_at' => $score->tested_at?->format('Y-m-d') ?? '',
            'expires_at' => $score->expires_at?->format('Y-m-d') ?? '',
        ];
    }

    /**
     * Get the select options used by the student profile forms.
     *
     * @return array<string, array<int, array<string, string>>>
     */
    public static function options(): array
    {
        return [
            'countries' => Country::query()
                ->where('is_active', true)
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
        ];
    }

    /**
     * Determine whether a text value has meaningful content.
     */
    private static function filled(?string $value): bool
    {
        return $value !== null && trim($value) !== '';
    }
}
