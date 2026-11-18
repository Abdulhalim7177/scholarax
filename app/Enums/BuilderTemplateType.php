<?php

namespace App\Enums;

enum BuilderTemplateType: string
{
    case Cv = 'cv';
    case Sop = 'sop';

    /**
     * Get the human-readable label for the builder type.
     */
    public function label(): string
    {
        return match ($this) {
            self::Cv => 'CV',
            self::Sop => 'Statement of purpose',
        };
    }

    /**
     * Get the short label used for mode switches.
     */
    public function shortLabel(): string
    {
        return match ($this) {
            self::Cv => 'CV',
            self::Sop => 'SOP',
        };
    }

    /**
     * Get the default document title for new documents.
     */
    public function defaultTitle(): string
    {
        return match ($this) {
            self::Cv => 'My CV',
            self::Sop => 'My statement of purpose',
        };
    }
}
