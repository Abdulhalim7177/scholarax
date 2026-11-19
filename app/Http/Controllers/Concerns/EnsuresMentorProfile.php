<?php

namespace App\Http\Controllers\Concerns;

use App\Enums\AvailabilityStatus;
use App\Enums\VerificationStatus;
use App\Models\MentorProfile;
use App\Models\User;

trait EnsuresMentorProfile
{
    /**
     * Get or create the mentor profile for the given user.
     */
    protected function mentorProfileFor(User $user): MentorProfile
    {
        return $user->mentorProfile()->firstOrCreate([], [
            'verification_status' => VerificationStatus::Pending,
            'availability_status' => AvailabilityStatus::Available,
            'response_time_minutes' => 240,
            'rating_avg' => 0,
            'reviews_count' => 0,
            'learners_count' => 0,
            'sessions_count' => 0,
            'is_featured' => false,
            'languages' => [],
        ]);
    }
}
