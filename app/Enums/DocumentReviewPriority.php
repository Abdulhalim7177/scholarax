<?php

namespace App\Enums;

enum DocumentReviewPriority: string
{
    case Low = 'low';
    case Normal = 'normal';
    case High = 'high';

    /**
     * Get the human-readable label for the priority.
     */
    public function label(): string
    {
        return match ($this) {
            self::Low => 'Low priority',
            self::Normal => 'Normal priority',
            self::High => 'Needs attention',
        };
    }

    /**
     * Determine whether the review needs immediate attention.
     */
    public function needsAttention(): bool
    {
        return $this === self::High;
    }
}
