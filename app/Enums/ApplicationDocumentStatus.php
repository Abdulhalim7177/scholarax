<?php

namespace App\Enums;

enum ApplicationDocumentStatus: string
{
    case Draft = 'draft';
    case Submitted = 'submitted';
    case ChangesRequested = 'changes_requested';
    case Approved = 'approved';

    /**
     * Get the human-readable label for the document status.
     */
    public function label(): string
    {
        return match ($this) {
            self::Draft => 'Draft',
            self::Submitted => 'Submitted',
            self::ChangesRequested => 'Changes requested',
            self::Approved => 'Approved',
        };
    }

    /**
     * Determine whether the document counts towards application progress.
     */
    public function isComplete(): bool
    {
        return in_array($this, [self::Submitted, self::Approved], true);
    }
}
