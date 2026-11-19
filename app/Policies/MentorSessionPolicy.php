<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\MentorSession;
use App\Models\Mentorship;
use App\Models\User;

class MentorSessionPolicy
{
    /**
     * Determine whether the user can request a session for the mentorship.
     */
    public function create(User $user, Mentorship $mentorship): bool
    {
        return $mentorship->isStudent($user) || $mentorship->isMentoredBy($user);
    }

    /**
     * Determine whether the user can update the session.
     */
    public function update(User $user, MentorSession $session): bool
    {
        return $session->mentorship->isStudent($user)
            || $session->mentorship->isMentoredBy($user)
            || $user->role === UserRole::Admin;
    }
}
