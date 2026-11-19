<?php

namespace App\Enums;

enum ReportReason: string
{
    case Spam = 'spam';
    case Harassment = 'harassment';
    case Misinformation = 'misinformation';
    case Inappropriate = 'inappropriate';
    case Other = 'other';

    /**
     * Get the human-readable label for the reason.
     */
    public function label(): string
    {
        return match ($this) {
            self::Spam => 'Spam or misleading',
            self::Harassment => 'Harassment',
            self::Misinformation => 'Incorrect information',
            self::Inappropriate => 'Inappropriate content',
            self::Other => 'Something else',
        };
    }
}
