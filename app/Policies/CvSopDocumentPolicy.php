<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\CvSopDocument;
use App\Models\User;

class CvSopDocumentPolicy
{
    /**
     * Determine whether the user can view builder documents.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the document.
     */
    public function view(User $user, CvSopDocument $document): bool
    {
        return $document->isOwnedBy($user) || $user->role === UserRole::Admin;
    }

    /**
     * Determine whether the user can update the document.
     */
    public function update(User $user, CvSopDocument $document): bool
    {
        return $document->isOwnedBy($user) || $user->role === UserRole::Admin;
    }

    /**
     * Determine whether the user can attach the document to an application.
     */
    public function attach(User $user, CvSopDocument $document): bool
    {
        return $document->isOwnedBy($user) || $user->role === UserRole::Admin;
    }
}
