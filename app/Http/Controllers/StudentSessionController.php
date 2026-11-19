<?php

namespace App\Http\Controllers;

use App\Enums\MentorSessionStatus;
use App\Enums\SessionAttendance;
use App\Http\Requests\Student\SessionRequest;
use App\Models\Mentorship;
use App\Support\ActivityLogger;
use Carbon\CarbonImmutable;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class StudentSessionController extends Controller
{
    /**
     * Request a session with the student's mentor.
     */
    public function store(SessionRequest $request, Mentorship $mentorship): RedirectResponse
    {
        $student = $request->user();

        abort_unless($mentorship->isStudent($student), 403);
        abort_unless($mentorship->status->isActive(), 403);

        $data = $request->validated();

        $session = $mentorship->sessions()->create([
            'requested_by' => $student->id,
            'topic' => (string) $data['topic'],
            'scheduled_at' => CarbonImmutable::parse((string) $data['scheduled_at']),
            'duration_minutes' => (int) $data['duration_minutes'],
            'notes' => $data['notes'] ?? null,
            'status' => MentorSessionStatus::Requested,
            'attendance_status' => SessionAttendance::Pending,
        ]);

        ActivityLogger::log(
            $mentorship->mentorProfile->user,
            'session_requested',
            'New session request',
            $student->name.' · '.$session->topic,
            $session,
        );

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Session requested. Your mentor will confirm shortly.'),
        ]);

        return back();
    }
}
