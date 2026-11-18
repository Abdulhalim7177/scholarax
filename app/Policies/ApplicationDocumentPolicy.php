<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\Application;
use App\Models\ApplicationDocument;
use App\Models\User;

class ApplicationDocumentPolicy
{
    /**
     * Determine whether the user can add a document to the application.
     */
    public function create(User $user, Application $application): bool
    {
        return $application->isOwnedBy($user) || $user->role === UserRole::Admin;
    }

    /**
     * Determine whether the user can view the document.
     */
    public function view(User $user, ApplicationDocument $document): bool
    {
        return $document->application->isOwnedBy($user) || $user->role === UserRole::Admin;
    }

    /**
     * Determine whether the user can update the document.
     */
    public function update(User $user, ApplicationDocument $document): bool
    {
        return $document->application->isOwnedBy($user) || $user->role === UserRole::Admin;
    }

    /**
     * Determine whether the user can delete the document.
     */
    public function delete(User $user, ApplicationDocument $document): bool
    {
        return $document->application->isOwnedBy($user) || $user->role === UserRole::Admin;
    }
}
