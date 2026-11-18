<?php

namespace App\Enums;

enum CvSopDocumentStatus: string
{
    case Draft = 'draft';
    case InProgress = 'in_progress';
    case Complete = 'complete';

    /**
     * Get the human-readable label for the document status.
     */
    public function label(): string
    {
        return match ($this) {
            self::Draft => 'Draft',
            self::InProgress => 'In progress',
            self::Complete => 'Complete',
        };
    }

    /**
     * Determine whether the document is finished.
     */
    public function isComplete(): bool
    {
        return $this === self::Complete;
    }
}
