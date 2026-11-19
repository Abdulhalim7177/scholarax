<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\Mentorship;
use App\Models\User;

class MentorshipPolicy
{
    /**
     * Determine whether the user can view the mentorship.
     */
    public function view(User $user, Mentorship $mentorship): bool
    {
        return $mentorship->isStudent($user)
            || $mentorship->isMentoredBy($user)
            || $user->role === UserRole::Admin;
    }

    /**
     * Determine whether the user can request a mentor.
     */
    public function create(User $user): bool
    {
        return $user->role === UserRole::Student;
    }
}
