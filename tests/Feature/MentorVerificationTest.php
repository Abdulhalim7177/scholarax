<?php

use App\Enums\VerificationStatus;
use App\Models\MentorProfile;
use App\Models\User;

/**
 * Create a pending mentor profile for verification tests.
 */
function mentorVerificationProfile(): MentorProfile
{
    return MentorProfile::factory()->create([
        'verification_status' => VerificationStatus::Pending,
        'verified_at' => null,
        'is_featured' => false,
    ]);
}

test('admins can verify a mentor profile', function () {
    $admin = User::factory()->admin()->create();
    $profile = mentorVerificationProfile();

    $this->actingAs($admin)
        ->post(route('admin-mentors.verify', $profile))
        ->assertRedirect();

    $profile->refresh();

    expect($profile->verification_status)->toBe(VerificationStatus::Verified)
        ->and($profile->verified_at)->not->toBeNull();

    $this->assertDatabaseHas('activity_events', [
        'user_id' => $profile->user_id,
        'type' => 'mentor_verified',
    ]);
});

test('admins can reject a mentor profile', function () {
    $admin = User::factory()->admin()->create();
    $profile = mentorVerificationProfile();

    $this->actingAs($admin)
        ->post(route('admin-mentors.reject', $profile))
        ->assertRedirect();

    $profile->refresh();

    expect($profile->verification_status)->toBe(VerificationStatus::Rejected)
        ->and($profile->verified_at)->toBeNull();

    $this->assertDatabaseHas('activity_events', [
        'user_id' => $profile->user_id,
        'type' => 'mentor_rejected',
    ]);
});

test('non administrators cannot verify mentor profiles', function () {
    $mentor = User::factory()->mentor()->create();
    $profile = mentorVerificationProfile();

    $this->actingAs($mentor)
        ->post(route('admin-mentors.verify', $profile))
        ->assertForbidden();

    expect($profile->refresh()->verification_status)->toBe(VerificationStatus::Pending);
});
