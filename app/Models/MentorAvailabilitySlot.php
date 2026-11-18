<?php

namespace App\Models;

use Carbon\CarbonImmutable;
use Database\Factories\MentorAvailabilitySlotFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $mentor_profile_id
 * @property int $weekday
 * @property string $start_time
 * @property string $end_time
 * @property string $timezone
 * @property bool $is_active
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read MentorProfile $mentorProfile
 */
#[Fillable([
    'mentor_profile_id',
    'weekday',
    'start_time',
    'end_time',
    'timezone',
    'is_active',
])]
class MentorAvailabilitySlot extends Model
{
    /** @use HasFactory<MentorAvailabilitySlotFactory> */
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'weekday' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Get the mentor who owns the slot.
     *
     * @return BelongsTo<MentorProfile, $this>
     */
    public function mentorProfile(): BelongsTo
    {
        return $this->belongsTo(MentorProfile::class);
    }
}
