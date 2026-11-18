<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\Application;
use App\Models\User;

class ApplicationPolicy
{
    /**
     * Determine whether the user can view any applications.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the application.
     */
    public function view(User $user, Application $application): bool
    {
        return $application->isOwnedBy($user) || $user->role === UserRole::Admin;
    }

    /**
     * Determine whether the user can create applications.
     */
    public function create(User $user): bool
    {
        return $user->role === UserRole::Student;
    }

    /**
     * Determine whether the user can update the application.
     */
    public function update(User $user, Application $application): bool
    {
        return $application->isOwnedBy($user) || $user->role === UserRole::Admin;
    }

    /**
     * Determine whether the user can delete the application.
     */
    public function delete(User $user, Application $application): bool
    {
        return $application->isOwnedBy($user) || $user->role === UserRole::Admin;
    }
}
