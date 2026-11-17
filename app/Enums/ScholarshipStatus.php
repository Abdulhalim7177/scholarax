<?php

namespace App\Enums;

enum ScholarshipStatus: string
{
    case Draft = 'draft';
    case Pending = 'pending';
    case Live = 'live';
    case Closed = 'closed';
    case Archived = 'archived';

    /**
     * Get the human-readable label for the status.
     */
    public function label(): string
    {
        return match ($this) {
            self::Draft => 'Draft',
            self::Pending => 'Pending review',
            self::Live => 'Live',
            self::Closed => 'Closed',
            self::Archived => 'Archived',
        };
    }
}
