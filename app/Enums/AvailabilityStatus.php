<?php

namespace App\Enums;

enum AvailabilityStatus: string
{
    case Available = 'available';
    case Limited = 'limited';
    case Unavailable = 'unavailable';

    /**
     * Get the human-readable label for the availability status.
     */
    public function label(): string
    {
        return match ($this) {
            self::Available => 'Available',
            self::Limited => 'Limited availability',
            self::Unavailable => 'Unavailable',
        };
    }

    /**
     * Determine whether the mentor is accepting new requests.
     */
    public function isAvailable(): bool
    {
        return $this === self::Available;
    }
}
