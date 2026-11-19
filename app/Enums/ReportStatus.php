<?php

namespace App\Enums;

enum ReportStatus: string
{
    case Open = 'open';
    case Resolved = 'resolved';
    case Dismissed = 'dismissed';

    /**
     * Get the human-readable label for the status.
     */
    public function label(): string
    {
        return match ($this) {
            self::Open => 'Open',
            self::Resolved => 'Resolved',
            self::Dismissed => 'Dismissed',
        };
    }

    /**
     * Determine whether the report still needs an admin decision.
     */
    public function isOpen(): bool
    {
        return $this === self::Open;
    }
}
