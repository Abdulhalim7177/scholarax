<?php

namespace App\Enums;

enum ReportExportStatus: string
{
    case Pending = 'pending';
    case Processing = 'processing';
    case Completed = 'completed';
    case Failed = 'failed';

    /**
     * Get the human-readable label for the status.
     */
    public function label(): string
    {
        return match ($this) {
            self::Pending => 'Queued',
            self::Processing => 'Preparing',
            self::Completed => 'Ready',
            self::Failed => 'Failed',
        };
    }
}
