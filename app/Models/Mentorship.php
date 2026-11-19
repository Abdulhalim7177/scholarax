<?php

namespace App\Models;

use App\Enums\MentorshipStatus;
use Carbon\CarbonImmutable;
use Database\Factories\MentorshipFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * @property int $id
 * @property int $mentor_profile_id
 * @property int $student_id
 * @property MentorshipStatus $status
 * @property CarbonImmutable|null $started_at
 * @property CarbonImmutable|null $ended_at
 * @property string|null $goals
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read MentorProfile $mentorProfile
 * @property-read User $student
 * @property-read Collection<int, MentorSession> $sessions
 * @property-read Collection<int, MentorMessage> $messages
 * @property-read MentorReview|null $review
 * @property-read MentorMessage|null $latestMessage
 */
#[Fillable([
    'mentor_profile_id',
    'student_id',
    'status',
    'started_at',
    'ended_at',
    'goals',
])]
class Mentorship extends Model
{
    /** @use HasFactory<MentorshipFactory> */
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => MentorshipStatus::class,
            'started_at' => 'datetime',
            'ended_at' => 'datetime',
        ];
    }

    /**
     * Get the mentor profile guiding this mentorship.
     *
     * @return BelongsTo<MentorProfile, $this>
     */
    public function mentorProfile(): BelongsTo
    {
        return $this->belongsTo(MentorProfile::class);
    }

    /**
     * Get the student being mentored.
     *
     * @return BelongsTo<User, $this>
     */
    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    /**
     * Get the sessions booked for this mentorship.
     *
     * @return HasMany<MentorSession, $this>
     */
    public function sessions(): HasMany
    {
        return $this->hasMany(MentorSession::class)->orderBy('scheduled_at');
    }

    /**
     * Get the messages exchanged in this mentorship.
     *
     * @return HasMany<MentorMessage, $this>
     */
    public function messages(): HasMany
    {
        return $this->hasMany(MentorMessage::class)->orderBy('created_at');
    }

    /**
     * Get the most recent message in this mentorship.
     *
     * @return HasOne<MentorMessage, $this>
     */
    public function latestMessage(): HasOne
    {
        return $this->hasOne(MentorMessage::class)->latestOfMany();
    }

    /**
     * Get the review left for this mentorship.
     *
     * @return HasOne<MentorReview, $this>
     */
    public function review(): HasOne
    {
        return $this->hasOne(MentorReview::class);
    }

    /**
     * Limit the query to active mentorships.
     *
     * @param  Builder<Mentorship>  $query
     */
    public function scopeActive(Builder $query): void
    {
        $query->where('status', MentorshipStatus::Active->value);
    }

    /**
     * Determine whether the given user mentors this student.
     */
    public function isMentoredBy(User $user): bool
    {
        return $this->mentorProfile->user_id === $user->id;
    }

    /**
     * Determine whether the given user is the mentored student.
     */
    public function isStudent(User $user): bool
    {
        return $this->student_id === $user->id;
    }
}
