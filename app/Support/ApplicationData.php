<?php

namespace App\Support;

use App\Enums\ApplicationDocumentStatus;
use App\Enums\ApplicationDocumentType;
use App\Enums\ApplicationStatus;
use App\Models\Application;
use App\Models\ApplicationDocument;
use App\Models\ApplicationStatusHistory;
use App\Models\ApplicationTask;

final class ApplicationData
{
    /**
     * Transform an application into the summary shape used by listings.
     *
     * @return array<string, mixed>
     */
    public static function summary(Application $application): array
    {
        $scholarship = $application->scholarship;
        $hostCountry = $scholarship->hostCountry;
        $deadline = $application->deadline_at;
        $daysLeft = $deadline === null
            ? null
            : (int) now()->startOfDay()->diffInDays($deadline->copy()->startOfDay(), false);
        $nextTask = $application->nextIncompleteTask();

        return [
            'id' => $application->id,
            'status' => $application->status->value,
            'statusLabel' => $application->status->label(),
            'progress' => $application->progress,
            'nextStep' => self::nextStep($application, $nextTask),
            'deadline' => $deadline?->format('j M Y'),
            'deadlineAt' => $deadline?->toIso8601String(),
            'deadlineLabel' => ScholarshipData::deadlineLabel($daysLeft),
            'daysLeft' => $daysLeft,
            'submittedAt' => $application->submitted_at?->toIso8601String(),
            'decisionAt' => $application->decision_at?->toIso8601String(),
            'updatedAt' => $application->updated_at?->toIso8601String(),
            'scholarship' => [
                'id' => $scholarship->id,
                'slug' => $scholarship->slug,
                'title' => $scholarship->title,
                'provider' => $scholarship->provider,
                'summary' => $scholarship->summary,
                'country' => $hostCountry->name ?? 'Multiple countries',
                'countryCode' => $hostCountry->iso2 ?? 'EU',
                'level' => $scholarship->studyLevels->pluck('name')->implode(' / '),
                'funding' => $scholarship->funding_type->label(),
            ],
        ];
    }

    /**
     * Transform an application into the shape used by the detail page.
     *
     * @return array<string, mixed>
     */
    public static function detail(Application $application): array
    {
        $application->loadMissing([
            'scholarship.studyLevels',
            'scholarship.fieldsOfStudy',
            'scholarship.hostCountry',
            'tasks',
            'documents',
            'statusHistories.changedBy',
        ]);

        $tasks = $application->tasks;
        $documents = $application->documents;
        $scholarship = $application->scholarship;
        $hostCountry = $scholarship->hostCountry;

        return [
            ...self::summary($application),
            'scholarship' => [
                'id' => $scholarship->id,
                'slug' => $scholarship->slug,
                'title' => $scholarship->title,
                'provider' => $scholarship->provider,
                'summary' => $scholarship->summary,
                'country' => $hostCountry->name ?? 'Multiple countries',
                'countryCode' => $hostCountry->iso2 ?? 'EU',
                'level' => $scholarship->studyLevels->pluck('name')->implode(' / '),
                'field' => $scholarship->fieldsOfStudy->pluck('name')->implode(' / '),
                'funding' => $scholarship->funding_type->label(),
                'description' => $scholarship->description,
                'eligibility' => $scholarship->eligibility,
                'requiredDocuments' => $scholarship->required_documents ?? [],
                'applicationUrl' => $scholarship->application_url,
            ],
            'tasks' => $tasks->map(fn (ApplicationTask $task) => self::task($task))->values()->all(),
            'documents' => $documents->map(fn (ApplicationDocument $document) => self::document($document))->values()->all(),
            'history' => $application->statusHistories
                ->map(fn (ApplicationStatusHistory $history) => self::history($history))
                ->values()
                ->all(),
            'taskSummary' => [
                'total' => $tasks->count(),
                'completed' => $tasks->filter(fn (ApplicationTask $task) => $task->isComplete())->count(),
            ],
            'documentSummary' => [
                'total' => $documents->count(),
                'complete' => $documents
                    ->filter(fn (ApplicationDocument $document) => $document->status->isComplete())
                    ->count(),
            ],
        ];
    }

    /**
     * Transform a task into a payload.
     *
     * @return array<string, mixed>
     */
    public static function task(ApplicationTask $task): array
    {
        return [
            'id' => $task->id,
            'title' => $task->title,
            'description' => $task->description,
            'dueAt' => $task->due_at?->toIso8601String(),
            'due' => $task->due_at?->format('j M Y'),
            'completed' => $task->isComplete(),
            'completedAt' => $task->completed_at?->toIso8601String(),
            'type' => $task->type,
        ];
    }

    /**
     * Transform a document into a payload.
     *
     * @return array<string, mixed>
     */
    public static function document(ApplicationDocument $document): array
    {
        return [
            'id' => $document->id,
            'type' => $document->type->value,
            'typeLabel' => $document->type->label(),
            'title' => $document->title,
            'version' => $document->version,
            'status' => $document->status->value,
            'statusLabel' => $document->status->label(),
            'hasFile' => $document->hasFile(),
            'fileName' => $document->original_name,
            'downloadUrl' => $document->hasFile()
                ? route('application-documents.download', [
                    'application' => $document->application_id,
                    'document' => $document->id,
                ])
                : null,
            'submittedAt' => $document->submitted_at?->toIso8601String(),
            'createdAt' => $document->created_at?->toIso8601String(),
        ];
    }

    /**
     * Transform a status history entry into a payload.
     *
     * @return array<string, mixed>
     */
    public static function history(ApplicationStatusHistory $history): array
    {
        return [
            'id' => $history->id,
            'fromStatus' => $history->from_status?->value,
            'fromLabel' => $history->from_status?->label(),
            'toStatus' => $history->to_status->value,
            'toLabel' => $history->to_status->label(),
            'note' => $history->note,
            'changedBy' => $history->changedBy?->name,
            'createdAt' => $history->created_at?->toIso8601String(),
        ];
    }

    /**
     * Get the status filter options.
     *
     * @return array<int, array{value: string, label: string}>
     */
    public static function statusOptions(): array
    {
        return array_map(
            fn (ApplicationStatus $status) => [
                'value' => $status->value,
                'label' => $status->label(),
            ],
            ApplicationStatus::cases(),
        );
    }

    /**
     * Get the document type options.
     *
     * @return array<int, array{value: string, label: string}>
     */
    public static function documentTypeOptions(): array
    {
        return array_map(
            fn (ApplicationDocumentType $type) => [
                'value' => $type->value,
                'label' => $type->label(),
            ],
            ApplicationDocumentType::cases(),
        );
    }

    /**
     * Get the document status options.
     *
     * @return array<int, array{value: string, label: string}>
     */
    public static function documentStatusOptions(): array
    {
        return array_map(
            fn (ApplicationDocumentStatus $status) => [
                'value' => $status->value,
                'label' => $status->label(),
            ],
            ApplicationDocumentStatus::cases(),
        );
    }

    /**
     * Resolve the next step shown for an application.
     */
    private static function nextStep(Application $application, ?ApplicationTask $task): string
    {
        if ($application->next_step !== null && trim($application->next_step) !== '') {
            return $application->next_step;
        }

        if ($task instanceof ApplicationTask) {
            return $task->title;
        }

        return match ($application->status) {
            ApplicationStatus::Draft => 'Add your application tasks',
            ApplicationStatus::InReview => 'Waiting for review feedback',
            ApplicationStatus::Submitted => 'Track your application response',
            ApplicationStatus::OfferReceived => 'Review your offer details',
            ApplicationStatus::Rejected => 'Reflect and plan your next application',
            ApplicationStatus::Withdrawn => 'Application withdrawn',
        };
    }
}
