<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\Scholarship;
use App\Models\User;

class ScholarshipPolicy
{
    /**
     * Determine whether the user can view any scholarships.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the scholarship.
     */
    public function view(?User $user, Scholarship $scholarship): bool
    {
        return $scholarship->isLive() || $user?->role === UserRole::Admin;
    }

    /**
     * Determine whether the user can create scholarships.
     */
    public function create(User $user): bool
    {
        return $user->role === UserRole::Admin;
    }

    /**
     * Determine whether the user can update the scholarship.
     */
    public function update(User $user, Scholarship $scholarship): bool
    {
        return $user->role === UserRole::Admin;
    }

    /**
     * Determine whether the user can approve the scholarship.
     */
    public function approve(User $user, Scholarship $scholarship): bool
    {
        return $user->role === UserRole::Admin;
    }

    /**
     * Determine whether the user can delete the scholarship.
     */
    public function delete(User $user, Scholarship $scholarship): bool
    {
        return $user->role === UserRole::Admin;
    }
}
