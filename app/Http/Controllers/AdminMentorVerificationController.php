<?php

namespace App\Http\Controllers;

use App\Enums\VerificationStatus;
use App\Models\MentorProfile;
use App\Support\ActivityLogger;
use Carbon\CarbonImmutable;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class AdminMentorVerificationController extends Controller
{
    /**
     * Mark a mentor profile as verified.
     */
    public function verify(MentorProfile $mentorProfile): RedirectResponse
    {
        Gate::authorize('verify', MentorProfile::class);

        $mentorProfile->forceFill([
            'verification_status' => VerificationStatus::Verified,
            'verified_at' => CarbonImmutable::now(),
        ])->save();

        ActivityLogger::log(
            $mentorProfile->user,
            'mentor_verified',
            'Your mentor profile was verified',
            $mentorProfile->headline,
            $mentorProfile,
        );

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Mentor verified.')]);

        return back();
    }

    /**
     * Reject a mentor's verification request.
     */
    public function reject(MentorProfile $mentorProfile): RedirectResponse
    {
        Gate::authorize('verify', MentorProfile::class);

        $mentorProfile->forceFill([
            'verification_status' => VerificationStatus::Rejected,
            'verified_at' => null,
        ])->save();

        ActivityLogger::log(
            $mentorProfile->user,
            'mentor_rejected',
            'Your mentor verification needs attention',
            $mentorProfile->headline,
            $mentorProfile,
        );

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Verification rejected.')]);

        return back();
    }
}
