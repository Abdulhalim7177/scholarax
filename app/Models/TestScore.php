<?php

namespace App\Models;

use Carbon\CarbonImmutable;
use Database\Factories\TestScoreFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $user_id
 * @property string $type
 * @property string $score
 * @property CarbonImmutable|null $tested_at
 * @property CarbonImmutable|null $expires_at
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read User $user
 */
#[Fillable([
    'user_id',
    'type',
    'score',
    'tested_at',
    'expires_at',
])]
class TestScore extends Model
{
    /** @use HasFactory<TestScoreFactory> */
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'tested_at' => 'date',
            'expires_at' => 'date',
        ];
    }

    /**
     * Get the user that owns the test score.
     *
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
