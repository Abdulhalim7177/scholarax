<?php

namespace App\Models;

use Carbon\CarbonImmutable;
use Database\Factories\MentorReviewFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $mentorship_id
 * @property int $student_id
 * @property int $mentor_profile_id
 * @property int $rating
 * @property string|null $comment
 * @property bool $is_published
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read Mentorship $mentorship
 * @property-read User $student
 * @property-read MentorProfile $mentorProfile
 */
#[Fillable([
    'mentorship_id',
    'student_id',
    'mentor_profile_id',
    'rating',
    'comment',
    'is_published',
])]
class MentorReview extends Model
{
    /** @use HasFactory<MentorReviewFactory> */
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'rating' => 'integer',
            'is_published' => 'boolean',
        ];
    }

    /**
     * Get the mentorship the review belongs to.
     *
     * @return BelongsTo<Mentorship, $this>
     */
    public function mentorship(): BelongsTo
    {
        return $this->belongsTo(Mentorship::class);
    }

    /**
     * Get the student who left the review.
     *
     * @return BelongsTo<User, $this>
     */
    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    /**
     * Get the mentor profile being reviewed.
     *
     * @return BelongsTo<MentorProfile, $this>
     */
    public function mentorProfile(): BelongsTo
    {
        return $this->belongsTo(MentorProfile::class);
    }
}
