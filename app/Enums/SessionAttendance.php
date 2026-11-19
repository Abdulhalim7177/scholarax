<?php

namespace App\Enums;

enum SessionAttendance: string
{
    case Pending = 'pending';
    case Attended = 'attended';
    case Missed = 'missed';

    /**
     * Get the human-readable label for the attendance status.
     */
    public function label(): string
    {
        return match ($this) {
            self::Pending => 'Not recorded',
            self::Attended => 'Attended',
            self::Missed => 'Missed',
        };
    }
}
