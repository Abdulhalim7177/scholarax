<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\EnsuresMentorProfile;
use App\Support\MentorWorkspaceData;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MentorDashboardController extends Controller
{
    use EnsuresMentorProfile;

    /**
     * Display the mentor dashboard.
     */
    public function __invoke(Request $request): Response
    {
        $profile = $this->mentorProfileFor($request->user());
        $profile->loadMissing('user');

        return Inertia::render('mentor-dashboard', MentorWorkspaceData::dashboard($profile));
    }
}
