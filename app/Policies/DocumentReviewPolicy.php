<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\DocumentReview;
use App\Models\User;

class DocumentReviewPolicy
{
    /**
     * Determine whether the user can update the document review.
     */
    public function update(User $user, DocumentReview $review): bool
    {
        return $review->mentor_id === $user->id || $user->role === UserRole::Admin;
    }
}
