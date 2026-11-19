<?php

namespace App\Http\Controllers;

use App\Enums\MentorshipStatus;
use App\Http\Requests\Student\MentorshipRequest;
use App\Models\MentorProfile;
use App\Models\Mentorship;
use App\Support\ActivityLogger;
use Carbon\CarbonImmutable;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class MentorshipController extends Controller
{
    /**
     * Request a mentorship with a verified mentor.
     */
    public function store(MentorshipRequest $request): RedirectResponse
    {
        Gate::authorize('create', Mentorship::class);

        $student = $request->user();
        $data = $request->validated();

        $profile = MentorProfile::query()
            ->verified()
            ->with('user')
            ->findOrFail((int) $data['mentor_profile_id']);

        $existing = Mentorship::query()
            ->where('mentor_profile_id', $profile->id)
            ->where('student_id', $student->id)
            ->first();

        if ($existing instanceof Mentorship) {
            Inertia::flash('toast', [
                'type' => 'info',
                'message' => __('You already have a mentorship with this mentor.'),
            ]);

            return back();
        }

        $mentorship = Mentorship::query()->create([
            'mentor_profile_id' => $profile->id,
            'student_id' => $student->id,
            'status' => MentorshipStatus::Active,
            'started_at' => CarbonImmutable::now(),
            'goals' => $data['goals'] ?? null,
        ]);

        ActivityLogger::log(
            $profile->user,
            'mentorship_requested',
            'New mentorship request',
            $student->name.' would like your guidance.',
            $mentorship,
        );

        ActivityLogger::log(
            $student,
            'mentorship_requested',
            'You requested a mentor',
            $profile->user->name,
            $mentorship,
        );

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Mentorship requested. You can now message your mentor.'),
        ]);

        return back();
    }
}
