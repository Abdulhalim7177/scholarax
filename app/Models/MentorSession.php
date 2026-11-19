<?php

namespace App\Models;

use App\Enums\MentorSessionStatus;
use App\Enums\SessionAttendance;
use Carbon\CarbonImmutable;
use Database\Factories\MentorSessionFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $mentorship_id
 * @property int $requested_by
 * @property string $topic
 * @property CarbonImmutable $scheduled_at
 * @property int $duration_minutes
 * @property string|null $meeting_url
 * @property MentorSessionStatus $status
 * @property SessionAttendance|null $attendance_status
 * @property string|null $notes
 * @property CarbonImmutable|null $completed_at
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read Mentorship $mentorship
 * @property-read User $requestedBy
 */
#[Fillable([
    'mentorship_id',
    'requested_by',
    'topic',
    'scheduled_at',
    'duration_minutes',
    'meeting_url',
    'status',
    'attendance_status',
    'notes',
    'completed_at',
])]
class MentorSession extends Model
{
    /** @use HasFactory<MentorSessionFactory> */
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'scheduled_at' => 'datetime',
            'duration_minutes' => 'integer',
            'status' => MentorSessionStatus::class,
            'attendance_status' => SessionAttendance::class,
            'completed_at' => 'datetime',
        ];
    }

    /**
     * Get the mentorship this session belongs to.
     *
     * @return BelongsTo<Mentorship, $this>
     */
    public function mentorship(): BelongsTo
    {
        return $this->belongsTo(Mentorship::class);
    }

    /**
     * Get the user who requested the session.
     *
     * @return BelongsTo<User, $this>
     */
    public function requestedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'requested_by');
    }

    /**
     * Limit the query to sessions that are still upcoming.
     *
     * @param  Builder<MentorSession>  $query
     */
    public function scopeUpcoming(Builder $query): void
    {
        $query->whereIn('status', [
            MentorSessionStatus::Requested->value,
            MentorSessionStatus::Confirmed->value,
        ]);
    }
}
