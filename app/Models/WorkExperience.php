<?php

namespace App\Models;

use Carbon\CarbonImmutable;
use Database\Factories\WorkExperienceFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $user_id
 * @property string $organization
 * @property string $role
 * @property CarbonImmutable|null $started_at
 * @property CarbonImmutable|null $ended_at
 * @property string|null $description
 * @property bool $is_current
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read User $user
 */
#[Fillable([
    'user_id',
    'organization',
    'role',
    'started_at',
    'ended_at',
    'description',
    'is_current',
])]
class WorkExperience extends Model
{
    /** @use HasFactory<WorkExperienceFactory> */
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'started_at' => 'date',
            'ended_at' => 'date',
            'is_current' => 'boolean',
        ];
    }

    /**
     * Get the user that owns the work experience.
     *
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
