<?php

namespace App\Models;

use App\Enums\ApplicationDocumentStatus;
use App\Enums\ApplicationStatus;
use Carbon\CarbonImmutable;
use Database\Factories\ApplicationFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property int $id
 * @property int $student_id
 * @property int $scholarship_id
 * @property ApplicationStatus $status
 * @property int $progress
 * @property string|null $next_step
 * @property CarbonImmutable|null $deadline_at
 * @property CarbonImmutable|null $submitted_at
 * @property CarbonImmutable|null $decision_at
 * @property array<string, mixed>|null $offer_details
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property CarbonImmutable|null $deleted_at
 * @property-read User $student
 * @property-read Scholarship $scholarship
 * @property-read Collection<int, ApplicationTask> $tasks
 * @property-read Collection<int, ApplicationDocument> $documents
 * @property-read Collection<int, ApplicationStatusHistory> $statusHistories
 */
#[Fillable([
    'student_id',
    'scholarship_id',
    'status',
    'progress',
    'next_step',
    'deadline_at',
    'submitted_at',
    'decision_at',
    'offer_details',
])]
class Application extends Model
{
    /** @use HasFactory<ApplicationFactory> */
    use HasFactory, SoftDeletes;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => ApplicationStatus::class,
            'progress' => 'integer',
            'deadline_at' => 'datetime',
            'submitted_at' => 'datetime',
            'decision_at' => 'datetime',
            'offer_details' => 'array',
        ];
    }

    /**
     * Get the student who owns the application.
     *
     * @return BelongsTo<User, $this>
     */
    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    /**
     * Get the scholarship being applied for.
     *
     * @return BelongsTo<Scholarship, $this>
     */
    public function scholarship(): BelongsTo
    {
        return $this->belongsTo(Scholarship::class);
    }

    /**
     * Get the application's tasks.
     *
     * @return HasMany<ApplicationTask, $this>
     */
    public function tasks(): HasMany
    {
        return $this->hasMany(ApplicationTask::class)->orderBy('sort_order')->orderBy('id');
    }

    /**
     * Get the application's documents.
     *
     * @return HasMany<ApplicationDocument, $this>
     */
    public function documents(): HasMany
    {
        return $this->hasMany(ApplicationDocument::class)->orderByDesc('created_at');
    }

    /**
     * Get the application's status history.
     *
     * @return HasMany<ApplicationStatusHistory, $this>
     */
    public function statusHistories(): HasMany
    {
        return $this->hasMany(ApplicationStatusHistory::class)->orderByDesc('created_at');
    }

    /**
     * Limit the query to applications that are still in progress.
     *
     * @param  Builder<Application>  $query
     */
    public function scopeActive(Builder $query): void
    {
        $query->whereIn('status', [
            ApplicationStatus::Draft,
            ApplicationStatus::InReview,
        ]);
    }

    /**
     * Determine whether the application belongs to the given user.
     */
    public function isOwnedBy(User $user): bool
    {
        return $this->student_id === $user->id;
    }

    /**
     * Get the next incomplete task, ordered by due date.
     */
    public function nextIncompleteTask(): ?ApplicationTask
    {
        return $this->tasks()
            ->whereNull('completed_at')
            ->orderByRaw('due_at is null')
            ->orderBy('due_at')
            ->orderBy('sort_order')
            ->first();
    }

    /**
     * Recalculate and persist the application progress.
     */
    public function recalculateProgress(): void
    {
        if (in_array($this->status, [ApplicationStatus::Submitted, ApplicationStatus::OfferReceived], true)) {
            $this->persistProgress(100);

            return;
        }

        if ($this->status->isClosed()) {
            return;
        }

        $taskTotal = $this->tasks()->count();
        $taskDone = $this->tasks()->whereNotNull('completed_at')->count();

        $documentTotal = $this->documents()->count();
        $documentDone = $this->documents()
            ->whereIn('status', [
                ApplicationDocumentStatus::Submitted->value,
                ApplicationDocumentStatus::Approved->value,
            ])
            ->count();

        $ratios = [];

        if ($taskTotal > 0) {
            $ratios[] = $taskDone / $taskTotal;
        }

        if ($documentTotal > 0) {
            $ratios[] = $documentDone / $documentTotal;
        }

        $progress = $ratios === []
            ? 0
            : (int) round(array_sum($ratios) / count($ratios) * 100);

        $this->persistProgress($progress);
    }

    /**
     * Persist a progress value without touching timestamps or events.
     */
    private function persistProgress(int $progress): void
    {
        if ($this->progress === $progress) {
            return;
        }

        $this->forceFill(['progress' => $progress])->saveQuietly();
        $this->setAttribute('progress', $progress);
    }
}
