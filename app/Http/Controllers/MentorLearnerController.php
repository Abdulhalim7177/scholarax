<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\EnsuresMentorProfile;
use App\Support\MentorWorkspaceData;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MentorLearnerController extends Controller
{
    use EnsuresMentorProfile;

    /**
     * Display the mentor's learners.
     */
    public function index(Request $request): Response
    {
        $profile = $this->mentorProfileFor($request->user());
        $profile->loadMissing('user');

        return Inertia::render(
            'mentor-learners',
            MentorWorkspaceData::learners($profile, trim((string) $request->input('q', ''))),
        );
    }
}
