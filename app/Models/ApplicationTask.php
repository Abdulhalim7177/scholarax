<?php

namespace App\Models;

use Carbon\CarbonImmutable;
use Database\Factories\ApplicationTaskFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $application_id
 * @property string $title
 * @property string|null $description
 * @property CarbonImmutable|null $due_at
 * @property CarbonImmutable|null $completed_at
 * @property int $sort_order
 * @property string|null $type
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read Application $application
 */
#[Fillable([
    'application_id',
    'title',
    'description',
    'due_at',
    'completed_at',
    'sort_order',
    'type',
])]
class ApplicationTask extends Model
{
    /** @use HasFactory<ApplicationTaskFactory> */
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'due_at' => 'datetime',
            'completed_at' => 'datetime',
            'sort_order' => 'integer',
        ];
    }

    /**
     * Get the application that owns the task.
     *
     * @return BelongsTo<Application, $this>
     */
    public function application(): BelongsTo
    {
        return $this->belongsTo(Application::class);
    }

    /**
     * Determine whether the task is complete.
     */
    public function isComplete(): bool
    {
        return $this->completed_at !== null;
    }
}
