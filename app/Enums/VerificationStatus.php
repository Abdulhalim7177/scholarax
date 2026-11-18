<?php

namespace App\Enums;

enum VerificationStatus: string
{
    case Pending = 'pending';
    case Verified = 'verified';
    case Rejected = 'rejected';

    /**
     * Get the human-readable label for the verification status.
     */
    public function label(): string
    {
        return match ($this) {
            self::Pending => 'Verification pending',
            self::Verified => 'Verified mentor',
            self::Rejected => 'Verification rejected',
        };
    }

    /**
     * Determine whether the mentor has been verified.
     */
    public function isVerified(): bool
    {
        return $this === self::Verified;
    }
}
