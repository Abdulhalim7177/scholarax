<?php

use App\Enums\MentorSessionStatus;
use App\Enums\MentorshipStatus;
use App\Enums\SessionAttendance;
use App\Models\MentorProfile;
use App\Models\MentorSession;
use App\Models\Mentorship;
use App\Models\User;

/**
 * Create a mentor with a verified profile for session tests.
 *
 * @return array{0: User, 1: MentorProfile}
 */
function sessionTestMentor(string $name = 'Dr. Maya Chen'): array
{
    $mentor = User::factory()->mentor()->create(['name' => $name]);
    $profile = MentorProfile::factory()->create(['user_id' => $mentor->id]);

    return [$mentor, $profile];
}

/**
 * Create an active mentorship for the given profile.
 *
 * @return array{0: User, 1: Mentorship}
 */
function sessionTestMentorship(MentorProfile $profile, string $name = 'Amina Yusuf'): array
{
    $student = User::factory()->create(['name' => $name]);

    $mentorship = Mentorship::factory()->create([
        'mentor_profile_id' => $profile->id,
        'student_id' => $student->id,
        'status' => MentorshipStatus::Active,
        'started_at' => now()->subWeek(),
    ]);

    return [$student, $mentorship];
}

test('mentors can schedule a session for their own learner', function () {
    [$mentor, $profile] = sessionTestMentor();
    [$student, $mentorship] = sessionTestMentorship($profile);

    $this->actingAs($mentor)
        ->post(route('mentor-sessions.store'), [
            'mentorship_id' => $mentorship->id,
            'topic' => 'Statement of purpose review',
            'scheduled_at' => now()->addDays(2)->format('Y-m-d H:i:s'),
            'duration_minutes' => 45,
            'meeting_url' => 'https://meet.example.com/scholarax',
            'notes' => 'Bring the latest draft.',
        ])
        ->assertRedirect();

    $session = MentorSession::query()->firstOrFail();

    expect($session->mentorship_id)->toBe($mentorship->id)
        ->and($session->requested_by)->toBe($mentor->id)
        ->and($session->status)->toBe(MentorSessionStatus::Confirmed)
        ->and($session->attendance_status)->toBe(SessionAttendance::Pending);

    $this->assertDatabaseHas('activity_events', [
        'user_id' => $student->id,
        'type' => 'session_scheduled',
    ]);
});

test('mentors cannot schedule a session for another mentors learner', function () {
    [$mentor] = sessionTestMentor();
    [, $otherProfile] = sessionTestMentor('James Okafor');
    [, $mentorship] = sessionTestMentorship($otherProfile, 'David Mensah');

    $this->actingAs($mentor)
        ->post(route('mentor-sessions.store'), [
            'mentorship_id' => $mentorship->id,
            'topic' => 'Uninvited review',
            'scheduled_at' => now()->addDays(2)->format('Y-m-d H:i:s'),
            'duration_minutes' => 45,
        ])
        ->assertNotFound();

    expect(MentorSession::query()->count())->toBe(0);
});

test('mentors can complete a session and record attendance', function () {
    [$mentor, $profile] = sessionTestMentor();
    [$student, $mentorship] = sessionTestMentorship($profile);

    $session = MentorSession::factory()->create([
        'mentorship_id' => $mentorship->id,
        'status' => MentorSessionStatus::Confirmed,
        'attendance_status' => SessionAttendance::Pending,
    ]);

    $this->actingAs($mentor)
        ->patch(route('mentor-sessions.update', $session), [
            'status' => MentorSessionStatus::Completed->value,
            'attendance_status' => SessionAttendance::Attended->value,
            'notes' => 'Great progress on the personal statement.',
        ])
        ->assertRedirect();

    $session->refresh();

    expect($session->status)->toBe(MentorSessionStatus::Completed)
        ->and($session->attendance_status)->toBe(SessionAttendance::Attended)
        ->and($session->completed_at)->not->toBeNull();

    $this->assertDatabaseHas('activity_events', [
        'user_id' => $student->id,
        'type' => 'session_completed',
    ]);
});

test('students can request a session on their active mentorship', function () {
    [, $profile] = sessionTestMentor();
    [$student, $mentorship] = sessionTestMentorship($profile);

    $this->actingAs($student)
        ->post(route('student-sessions.store', $mentorship), [
            'topic' => 'Interview practice',
            'scheduled_at' => now()->addDays(4)->format('Y-m-d H:i:s'),
            'duration_minutes' => 45,
            'notes' => 'I would like to run through panel questions.',
        ])
        ->assertRedirect();

    $session = MentorSession::query()->firstOrFail();

    expect($session->status)->toBe(MentorSessionStatus::Requested)
        ->and($session->requested_by)->toBe($student->id)
        ->and($session->attendance_status)->toBe(SessionAttendance::Pending);

    $this->assertDatabaseHas('activity_events', [
        'user_id' => $profile->user_id,
        'type' => 'session_requested',
    ]);
});

test('students cannot request a session on another students mentorship', function () {
    [, $profile] = sessionTestMentor();
    [, $mentorship] = sessionTestMentorship($profile);
    $intruder = User::factory()->create();

    $this->actingAs($intruder)
        ->post(route('student-sessions.store', $mentorship), [
            'topic' => 'Interview practice',
            'scheduled_at' => now()->addDays(4)->format('Y-m-d H:i:s'),
            'duration_minutes' => 45,
        ])
        ->assertForbidden();

    expect(MentorSession::query()->count())->toBe(0);
});
