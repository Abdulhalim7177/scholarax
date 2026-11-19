<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\EnsuresMentorProfile;
use App\Http\Requests\Mentor\MessageRequest;
use App\Models\Mentorship;
use App\Support\MentorWorkspaceData;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MentorMessageController extends Controller
{
    use EnsuresMentorProfile;

    /**
     * Display the mentor inbox and the active conversation.
     */
    public function index(Request $request): Response
    {
        $profile = $this->mentorProfileFor($request->user());
        $profile->loadMissing('user');

        $mentorshipId = $request->filled('mentorship')
            ? $request->integer('mentorship')
            : null;

        return Inertia::render(
            'mentor-messages',
            MentorWorkspaceData::messages($profile, $mentorshipId),
        );
    }

    /**
     * Send a message to a learner.
     */
    public function store(MessageRequest $request): RedirectResponse
    {
        $profile = $this->mentorProfileFor($request->user());
        $data = $request->validated();

        $mentorship = Mentorship::query()
            ->where('mentor_profile_id', $profile->id)
            ->with('student')
            ->findOrFail((int) $data['mentorship_id']);

        abort_unless($mentorship->isMentoredBy($request->user()), 403);

        $mentorship->messages()->create([
            'sender_id' => $request->user()->id,
            'recipient_id' => $mentorship->student_id,
            'body' => (string) $data['body'],
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Message sent.')]);

        return to_route('mentor-messages', ['mentorship' => $mentorship->id]);
    }
}
