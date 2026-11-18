<?php

namespace App\Enums;

enum ApplicationStatus: string
{
    case Draft = 'draft';
    case InReview = 'in_review';
    case Submitted = 'submitted';
    case OfferReceived = 'offer_received';
    case Rejected = 'rejected';
    case Withdrawn = 'withdrawn';

    /**
     * Get the human-readable label for the status.
     */
    public function label(): string
    {
        return match ($this) {
            self::Draft => 'Draft',
            self::InReview => 'In review',
            self::Submitted => 'Submitted',
            self::OfferReceived => 'Offer received',
            self::Rejected => 'Not selected',
            self::Withdrawn => 'Withdrawn',
        };
    }

    /**
     * Determine whether the application is still being worked on.
     */
    public function isActive(): bool
    {
        return in_array($this, [self::Draft, self::InReview], true);
    }

    /**
     * Determine whether the application has reached a final decision.
     */
    public function isClosed(): bool
    {
        return in_array($this, [self::OfferReceived, self::Rejected, self::Withdrawn], true);
    }
}
