<?php

namespace App\Models;

use Carbon\CarbonImmutable;
use Database\Factories\StudentProfileFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $user_id
 * @property string|null $headline
 * @property string|null $bio
 * @property CarbonImmutable|null $date_of_birth
 * @property string|null $city
 * @property int|null $country_id
 * @property string|null $linkedin_url
 * @property string|null $website_url
 * @property int|null $target_level_id
 * @property int|null $target_field_id
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read User $user
 * @property-read Country|null $country
 * @property-read StudyLevel|null $targetLevel
 * @property-read FieldOfStudy|null $targetField
 */
#[Fillable([
    'user_id',
    'headline',
    'bio',
    'date_of_birth',
    'city',
    'country_id',
    'linkedin_url',
    'website_url',
    'target_level_id',
    'target_field_id',
])]
class StudentProfile extends Model
{
    /** @use HasFactory<StudentProfileFactory> */
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'date_of_birth' => 'date',
        ];
    }

    /**
     * Get the user that owns the profile.
     *
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the country the student is based in.
     *
     * @return BelongsTo<Country, $this>
     */
    public function country(): BelongsTo
    {
        return $this->belongsTo(Country::class);
    }

    /**
     * Get the study level the student is targeting.
     *
     * @return BelongsTo<StudyLevel, $this>
     */
    public function targetLevel(): BelongsTo
    {
        return $this->belongsTo(StudyLevel::class, 'target_level_id');
    }

    /**
     * Get the field the student is targeting.
     *
     * @return BelongsTo<FieldOfStudy, $this>
     */
    public function targetField(): BelongsTo
    {
        return $this->belongsTo(FieldOfStudy::class, 'target_field_id');
    }
}
