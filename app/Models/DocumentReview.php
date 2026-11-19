<?php

namespace App\Models;

use App\Enums\DocumentReviewPriority;
use App\Enums\DocumentReviewStatus;
use Carbon\CarbonImmutable;
use Database\Factories\DocumentReviewFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $application_document_id
 * @property int $mentor_id
 * @property DocumentReviewStatus $status
 * @property DocumentReviewPriority $priority
 * @property CarbonImmutable|null $due_at
 * @property string|null $feedback
 * @property CarbonImmutable|null $reviewed_at
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read ApplicationDocument $applicationDocument
 * @property-read User $mentor
 */
#[Fillable([
    'application_document_id',
    'mentor_id',
    'status',
    'priority',
    'due_at',
    'feedback',
    'reviewed_at',
])]
class DocumentReview extends Model
{
    /** @use HasFactory<DocumentReviewFactory> */
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => DocumentReviewStatus::class,
            'priority' => DocumentReviewPriority::class,
            'due_at' => 'datetime',
            'reviewed_at' => 'datetime',
        ];
    }

    /**
     * Get the application document being reviewed.
     *
     * @return BelongsTo<ApplicationDocument, $this>
     */
    public function applicationDocument(): BelongsTo
    {
        return $this->belongsTo(ApplicationDocument::class);
    }

    /**
     * Get the mentor responsible for the review.
     *
     * @return BelongsTo<User, $this>
     */
    public function mentor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'mentor_id');
    }

    /**
     * Limit the query to reviews that still need attention.
     *
     * @param  Builder<DocumentReview>  $query
     */
    public function scopeOpen(Builder $query): void
    {
        $query->whereIn('status', [
            DocumentReviewStatus::Pending->value,
            DocumentReviewStatus::InReview->value,
            DocumentReviewStatus::Overdue->value,
        ]);
    }
}
