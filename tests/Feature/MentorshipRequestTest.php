<?php

use App\Enums\MentorSessionStatus;
use App\Enums\MentorshipStatus;
use App\Enums\VerificationStatus;
use App\Models\MentorProfile;
use App\Models\MentorSession;
use App\Models\Mentorship;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

/**
 * Create a mentor profile with the requested verification state.
 */
function requestTestMentorProfile(
    VerificationStatus $status = VerificationStatus::Verified,
    string $name = 'Dr. Maya Chen',
): MentorProfile {
    $mentor = User::factory()->mentor()->create(['name' => $name]);

    return MentorProfile::factory()->create([
        'user_id' => $mentor->id,
        'verification_status' => $status,
        'verified_at' => $status->isVerified() ? now() : null,
    ]);
}

test('students can request a mentorship with a verified mentor', function () {
    $profile = requestTestMentorProfile();
    $student = User::factory()->create(['name' => 'Amina Yusuf']);

    $this->actingAs($student)
        ->post(route('mentorships.store'), [
            'mentor_profile_id' => $profile->id,
            'goals' => 'I am applying for Chevening and need help shaping my story.',
        ])
        ->assertRedirect();

    $mentorship = Mentorship::query()->firstOrFail();

    expect($mentorship->student_id)->toBe($student->id)
        ->and($mentorship->mentor_profile_id)->toBe($profile->id)
        ->and($mentorship->status)->toBe(MentorshipStatus::Active)
        ->and($mentorship->started_at)->not->toBeNull();

    $this->assertDatabaseHas('activity_events', [
        'user_id' => $profile->user_id,
        'type' => 'mentorship_requested',
    ]);
    $this->assertDatabaseHas('activity_events', [
        'user_id' => $student->id,
        'type' => 'mentorship_requested',
    ]);
});

test('students cannot request the same mentorship twice', function () {
    $profile = requestTestMentorProfile();
    $student = User::factory()->create();

    Mentorship::factory()->create([
        'mentor_profile_id' => $profile->id,
        'student_id' => $student->id,
    ]);

    $this->actingAs($student)
        ->post(route('mentorships.store'), [
            'mentor_profile_id' => $profile->id,
            'goals' => 'A second request.',
        ])
        ->assertRedirect();

    expect(Mentorship::query()->count())->toBe(1);
});

test('students cannot request an unverified mentor', function () {
    $profile = requestTestMentorProfile(VerificationStatus::Pending);
    $student = User::factory()->create();

    $this->actingAs($student)
        ->from(route('mentors.show', $profile))
        ->post(route('mentorships.store'), [
            'mentor_profile_id' => $profile->id,
            'goals' => 'Please mentor me.',
        ])
        ->assertRedirect(route('mentors.show', $profile))
        ->assertSessionHasErrors('mentor_profile_id');

    expect(Mentorship::query()->count())->toBe(0);
});

test('the mentor profile reflects the students mentorship state', function () {
    $profile = requestTestMentorProfile();
    $student = User::factory()->create(['name' => 'Amina Yusuf']);

    $mentorship = Mentorship::factory()->create([
        'mentor_profile_id' => $profile->id,
        'student_id' => $student->id,
        'status' => MentorshipStatus::Active,
        'goals' => 'Chevening Scholarship',
    ]);

    MentorSession::factory()->create([
        'mentorship_id' => $mentorship->id,
        'topic' => 'Statement of purpose review',
        'scheduled_at' => now()->addDays(2),
        'status' => MentorSessionStatus::Confirmed,
    ]);

    $this->actingAs($student)
        ->get(route('mentors.show', $profile))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('mentor-show')
            ->where('mentorship.id', $mentorship->id)
            ->where('mentorship.status', 'active')
            ->where('mentorship.canRequestSession', true)
            ->where('mentorship.hasPendingSession', false)
            ->where('mentorship.nextSession.topic', 'Statement of purpose review'));

    $this->actingAs(User::factory()->create())
        ->get(route('mentors.show', $profile))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->where('mentorship', null));
});
