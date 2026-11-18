<?php

namespace App\Enums;

enum ApplicationDocumentType: string
{
    case Cv = 'cv';
    case Sop = 'sop';
    case Transcript = 'transcript';
    case Recommendation = 'recommendation';
    case TestScore = 'test_score';
    case Passport = 'passport';
    case Other = 'other';

    /**
     * Get the human-readable label for the document type.
     */
    public function label(): string
    {
        return match ($this) {
            self::Cv => 'CV',
            self::Sop => 'Statement of purpose',
            self::Transcript => 'Academic transcript',
            self::Recommendation => 'Recommendation letter',
            self::TestScore => 'Test score report',
            self::Passport => 'Passport',
            self::Other => 'Other document',
        };
    }
}
