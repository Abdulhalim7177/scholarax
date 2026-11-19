<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Enums\VerificationStatus;
use App\Models\MentorProfile;
use App\Models\User;
use App\Support\PlatformSettings;

class MentorProfilePolicy
{
    /**
     * Determine whether the user can browse the mentor directory.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the mentor profile.
     */
    public function view(User $user, MentorProfile $profile): bool
    {
        if ($profile->isOwnedBy($user) || $user->role === UserRole::Admin) {
            return true;
        }

        if (PlatformSettings::enabled('require_mentor_verification')) {
            return $profile->verification_status->isVerified();
        }

        return $profile->verification_status !== VerificationStatus::Rejected;
    }

    /**
     * Determine whether the user can edit the mentor profile.
     */
    public function update(User $user, MentorProfile $profile): bool
    {
        return $profile->isOwnedBy($user) || $user->role === UserRole::Admin;
    }

    /**
     * Determine whether the user can verify mentor profiles.
     */
    public function verify(User $user): bool
    {
        return $user->role === UserRole::Admin;
    }
}
