<?php

namespace App\Http\Controllers;

use App\Enums\MentorSessionStatus;
use App\Enums\SessionAttendance;
use App\Http\Controllers\Concerns\EnsuresMentorProfile;
use App\Http\Requests\Mentor\SessionStoreRequest;
use App\Http\Requests\Mentor\SessionUpdateRequest;
use App\Models\MentorSession;
use App\Models\Mentorship;
use App\Support\ActivityLogger;
use App\Support\MentorWorkspaceData;
use Carbon\CarbonImmutable;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class MentorSessionController extends Controller
{
    use EnsuresMentorProfile;

    /**
     * Display the mentor's sessions.
     */
    public function index(Request $request): Response
    {
        $profile = $this->mentorProfileFor($request->user());
        $profile->loadMissing('user');

        return Inertia::render('mentor-sessions', MentorWorkspaceData::sessions($profile));
    }

    /**
     * Schedule a session for one of the mentor's learners.
     */
    public function store(SessionStoreRequest $request): RedirectResponse
    {
        $profile = $this->mentorProfileFor($request->user());
        $data = $request->validated();

        $mentorship = Mentorship::query()
            ->where('mentor_profile_id', $profile->id)
            ->with('student')
            ->findOrFail((int) $data['mentorship_id']);

        $session = $mentorship->sessions()->create([
            'requested_by' => $request->user()->id,
            'topic' => (string) $data['topic'],
            'scheduled_at' => CarbonImmutable::parse((string) $data['scheduled_at']),
            'duration_minutes' => (int) $data['duration_minutes'],
            'meeting_url' => $data['meeting_url'] ?? null,
            'notes' => $data['notes'] ?? null,
            'status' => MentorSessionStatus::Confirmed,
            'attendance_status' => SessionAttendance::Pending,
        ]);

        ActivityLogger::log(
            $mentorship->student,
            'session_scheduled',
            'A session was scheduled',
            $session->topic,
            $session,
        );

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Session scheduled.')]);

        return back();
    }

    /**
     * Update the status of a session.
     */
    public function update(SessionUpdateRequest $request, MentorSession $session): RedirectResponse
    {
        $profile = $this->mentorProfileFor($request->user());

        Gate::authorize('update', $session);
        abort_unless($session->mentorship->mentor_profile_id === $profile->id, 404);

        $data = $request->validated();
        $status = MentorSessionStatus::from((string) $data['status']);

        $session->fill([
            'status' => $status,
            'notes' => $data['notes'] ?? $session->notes,
            'meeting_url' => $data['meeting_url'] ?? $session->meeting_url,
        ]);

        if ($status === MentorSessionStatus::Completed) {
            $session->completed_at = CarbonImmutable::now();
            $session->attendance_status = isset($data['attendance_status'])
                ? SessionAttendance::from((string) $data['attendance_status'])
                : SessionAttendance::Attended;
        } elseif ($status === MentorSessionStatus::NoShow) {
            $session->attendance_status = SessionAttendance::Missed;
        }

        $session->save();

        ActivityLogger::log(
            $session->mentorship->student,
            'session_'.$status->value,
            match ($status) {
                MentorSessionStatus::Confirmed => 'Your session was confirmed',
                MentorSessionStatus::Completed => 'Your session was completed',
                MentorSessionStatus::Cancelled => 'Your session was cancelled',
                MentorSessionStatus::NoShow => 'A session was marked as missed',
                default => 'Your session was updated',
            },
            $session->topic,
            $session,
        );

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Session updated.')]);

        return back();
    }
}
