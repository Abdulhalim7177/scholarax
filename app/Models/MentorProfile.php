<?php

namespace App\Models;

use App\Enums\AvailabilityStatus;
use App\Enums\VerificationStatus;
use Carbon\CarbonImmutable;
use Database\Factories\MentorProfileFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property int $user_id
 * @property string|null $headline
 * @property string|null $current_role
 * @property string|null $organization
 * @property int|null $country_id
 * @property string|null $bio
 * @property array<int, string>|null $languages
 * @property int|null $years_experience
 * @property string|null $linkedin_url
 * @property string|null $website_url
 * @property string|null $intro_video_path
 * @property VerificationStatus $verification_status
 * @property CarbonImmutable|null $verified_at
 * @property AvailabilityStatus $availability_status
 * @property int $response_time_minutes
 * @property float $rating_avg
 * @property int $reviews_count
 * @property int $learners_count
 * @property int $sessions_count
 * @property bool $is_featured
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read User $user
 * @property-read Country|null $country
 * @property-read Collection<int, ExpertiseTag> $expertiseTags
 * @property-read Collection<int, MentorAvailabilitySlot> $availabilitySlots
 */
#[Fillable([
    'user_id',
    'headline',
    'current_role',
    'organization',
    'country_id',
    'bio',
    'languages',
    'years_experience',
    'linkedin_url',
    'website_url',
    'intro_video_path',
    'verification_status',
    'verified_at',
    'availability_status',
    'response_time_minutes',
    'rating_avg',
    'reviews_count',
    'learners_count',
    'sessions_count',
    'is_featured',
])]
class MentorProfile extends Model
{
    /** @use HasFactory<MentorProfileFactory> */
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'languages' => 'array',
            'verification_status' => VerificationStatus::class,
            'availability_status' => AvailabilityStatus::class,
            'verified_at' => 'datetime',
            'years_experience' => 'integer',
            'response_time_minutes' => 'integer',
            'rating_avg' => 'decimal:2',
            'reviews_count' => 'integer',
            'learners_count' => 'integer',
            'sessions_count' => 'integer',
            'is_featured' => 'boolean',
        ];
    }

    /**
     * Get the user behind the mentor profile.
     *
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the mentor's country.
     *
     * @return BelongsTo<Country, $this>
     */
    public function country(): BelongsTo
    {
        return $this->belongsTo(Country::class);
    }

    /**
     * Get the expertise tags attached to the mentor.
     *
     * @return BelongsToMany<ExpertiseTag, $this>
     */
    public function expertiseTags(): BelongsToMany
    {
        return $this->belongsToMany(ExpertiseTag::class, 'mentor_expertise')
            ->withTimestamps();
    }

    /**
     * Get the mentor's recurring availability.
     *
     * @return HasMany<MentorAvailabilitySlot, $this>
     */
    public function availabilitySlots(): HasMany
    {
        return $this->hasMany(MentorAvailabilitySlot::class)
            ->orderBy('weekday')
            ->orderBy('start_time');
    }

    /**
     * Limit the query to verified mentors.
     *
     * @param  Builder<MentorProfile>  $query
     */
    public function scopeVerified(Builder $query): void
    {
        $query->where('verification_status', VerificationStatus::Verified->value);
    }

    /**
     * Limit the query to featured mentors.
     *
     * @param  Builder<MentorProfile>  $query
     */
    public function scopeFeatured(Builder $query): void
    {
        $query->where('is_featured', true);
    }

    /**
     * Limit the query to mentors currently accepting requests.
     *
     * @param  Builder<MentorProfile>  $query
     */
    public function scopeAvailable(Builder $query): void
    {
        $query->where('availability_status', AvailabilityStatus::Available->value);
    }

    /**
     * Determine whether the profile belongs to the given user.
     */
    public function isOwnedBy(User $user): bool
    {
        return $this->user_id === $user->id;
    }

    /**
     * Get the human-readable response time for the mentor.
     */
    public function responseTimeLabel(): string
    {
        $minutes = $this->response_time_minutes;

        if ($minutes < 60) {
            return sprintf('Usually replies in %d min', max(1, $minutes));
        }

        $hours = (int) round($minutes / 60);

        if ($hours < 24) {
            return sprintf('Usually replies in %d %s', $hours, $hours === 1 ? 'hour' : 'hours');
        }

        return 'Usually replies within a day';
    }
}
