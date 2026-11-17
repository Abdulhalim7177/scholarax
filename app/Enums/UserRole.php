<?php

namespace App\Enums;

enum UserRole: string
{
    case Student = 'student';
    case Mentor = 'mentor';
    case Admin = 'admin';

    /**
     * Get the human-readable label for the role.
     */
    public function label(): string
    {
        return match ($this) {
            self::Student => 'Student',
            self::Mentor => 'Mentor',
            self::Admin => 'Administrator',
        };
    }

    /**
     * Get the path the user should be redirected to after authentication.
     */
    public function homePath(): string
    {
        return match ($this) {
            self::Admin => '/admin-dashboard',
            self::Mentor => '/mentor-dashboard',
            self::Student => '/dashboard',
        };
    }
}
