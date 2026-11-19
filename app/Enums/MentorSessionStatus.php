<?php

namespace App\Enums;

enum MentorSessionStatus: string
{
    case Requested = 'requested';
    case Confirmed = 'confirmed';
    case Completed = 'completed';
    case Cancelled = 'cancelled';
    case NoShow = 'no_show';

    /**
     * Get the human-readable label for the status.
     */
    public function label(): string
    {
        return match ($this) {
            self::Requested => 'Awaiting confirmation',
            self::Confirmed => 'Confirmed',
            self::Completed => 'Completed',
            self::Cancelled => 'Cancelled',
            self::NoShow => 'No show',
        };
    }

    /**
     * Determine whether the session is still upcoming.
     */
    public function isUpcoming(): bool
    {
        return in_array($this, [self::Requested, self::Confirmed], true);
    }
}
