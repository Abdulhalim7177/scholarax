<?php

namespace App\Enums;

enum FundingType: string
{
    case FullyFunded = 'fully_funded';
    case Partial = 'partial';
    case TuitionOnly = 'tuition_only';
    case StipendOnly = 'stipend_only';

    /**
     * Get the human-readable label for the funding type.
     */
    public function label(): string
    {
        return match ($this) {
            self::FullyFunded => 'Fully funded',
            self::Partial => 'Partial funding',
            self::TuitionOnly => 'Tuition only',
            self::StipendOnly => 'Stipend only',
        };
    }
}
