<?php

namespace App\Models;

use App\Enums\FundingType;
use App\Enums\ScholarshipStatus;
use Database\Factories\ScholarshipFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $slug
 * @property string $title
 * @property string $provider
 * @property string|null $summary
 * @property string $description
 * @property int|null $host_country_id
 * @property FundingType $funding_type
 * @property string|null $funding_amount
 * @property string|null $currency
 * @property Carbon|null $deadline_at
 * @property string|null $application_url
 * @property string|null $eligibility
 * @property array<int, string>|null $required_documents
 * @property ScholarshipStatus $status
 * @property bool $is_featured
 * @property Carbon|null $verified_at
 * @property Carbon|null $published_at
 * @property int|null $created_by
 * @property int|null $approved_by
 * @property int $views_count
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Carbon|null $deleted_at
 * @property bool|null $is_saved
 * @property-read Country|null $hostCountry
 * @property-read Collection<int, StudyLevel> $studyLevels
 * @property-read Collection<int, FieldOfStudy> $fieldsOfStudy
 * @property-read Collection<int, Country> $eligibleCountries
 * @property-read User|null $creator
 * @property-read User|null $approver
 * @property-read Collection<int, User> $savedByUsers
 */
#[Fillable([
    'slug',
    'title',
    'provider',
    'summary',
    'description',
    'host_country_id',
    'funding_type',
    'funding_amount',
    'currency',
    'deadline_at',
    'application_url',
    'eligibility',
    'required_documents',
    'status',
    'is_featured',
    'verified_at',
    'published_at',
    'created_by',
    'approved_by',
    'views_count',
])]
class Scholarship extends Model
{
    /** @use HasFactory<ScholarshipFactory> */
    use HasFactory, SoftDeletes;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'deadline_at' => 'datetime',
            'verified_at' => 'datetime',
            'published_at' => 'datetime',
            'funding_type' => FundingType::class,
            'status' => ScholarshipStatus::class,
            'is_featured' => 'boolean',
            'required_documents' => 'array',
            'views_count' => 'integer',
        ];
    }

    /**
     * Get the route key for the model.
     */
    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    /**
     * Get the country hosting the scholarship.
     *
     * @return BelongsTo<Country, $this>
     */
    public function hostCountry(): BelongsTo
    {
        return $this->belongsTo(Country::class, 'host_country_id');
    }

    /**
     * Get the study levels offered by the scholarship.
     *
     * @return BelongsToMany<StudyLevel, $this>
     */
    public function studyLevels(): BelongsToMany
    {
        return $this->belongsToMany(StudyLevel::class, 'scholarship_study_level')->withTimestamps();
    }

    /**
     * Get the fields of study accepted by the scholarship.
     *
     * @return BelongsToMany<FieldOfStudy, $this>
     */
    public function fieldsOfStudy(): BelongsToMany
    {
        return $this->belongsToMany(FieldOfStudy::class, 'scholarship_field_of_study')->withTimestamps();
    }

    /**
     * Get the countries whose applicants are eligible for the scholarship.
     *
     * @return BelongsToMany<Country, $this>
     */
    public function eligibleCountries(): BelongsToMany
    {
        return $this->belongsToMany(Country::class, 'scholarship_eligible_country')->withTimestamps();
    }

    /**
     * Get the user who created the scholarship.
     *
     * @return BelongsTo<User, $this>
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the user who approved the scholarship.
     *
     * @return BelongsTo<User, $this>
     */
    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    /**
     * Get the users who saved the scholarship.
     *
     * @return BelongsToMany<User, $this>
     */
    public function savedByUsers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'saved_scholarships')->withTimestamps();
    }

    /**
     * Limit the query to live scholarships.
     *
     * @param  Builder<Scholarship>  $query
     */
    public function scopeLive(Builder $query): void
    {
        $query->where('status', ScholarshipStatus::Live);
    }

    /**
     * Limit the query to featured scholarships.
     *
     * @param  Builder<Scholarship>  $query
     */
    public function scopeFeatured(Builder $query): void
    {
        $query->where('is_featured', true);
    }

    /**
     * Determine whether the scholarship is live.
     */
    public function isLive(): bool
    {
        return $this->status === ScholarshipStatus::Live;
    }

    /**
     * Determine whether the given user has saved the scholarship.
     */
    public function isSavedBy(User $user): bool
    {
        return $this->savedByUsers()->whereKey($user->id)->exists();
    }
}
