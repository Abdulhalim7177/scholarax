<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\EnsuresMentorProfile;
use App\Models\Mentorship;
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

    /**
     * Display a learner's mentorship detail for their mentor.
     */
    public function show(Request $request, Mentorship $mentorship): Response
    {
        $profile = $this->mentorProfileFor($request->user());
        $profile->loadMissing('user');

        abort_unless($mentorship->mentor_profile_id === $profile->id, 404);

        return Inertia::render(
            'mentor-learner',
            MentorWorkspaceData::learner($profile, $mentorship),
        );
    }
}
