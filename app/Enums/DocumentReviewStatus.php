<?php

namespace App\Enums;

enum DocumentReviewStatus: string
{
    case Pending = 'pending';
    case InReview = 'in_review';
    case Completed = 'completed';
    case Overdue = 'overdue';

    /**
     * Get the human-readable label for the review status.
     */
    public function label(): string
    {
        return match ($this) {
            self::Pending => 'Waiting for review',
            self::InReview => 'In review',
            self::Completed => 'Completed',
            self::Overdue => 'Overdue',
        };
    }

    /**
     * Determine whether the review still needs attention.
     */
    public function isOpen(): bool
    {
        return in_array($this, [self::Pending, self::InReview, self::Overdue], true);
    }
}
