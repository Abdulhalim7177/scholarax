<?php

use App\Enums\AvailabilityStatus;
use App\Enums\VerificationStatus;
use App\Models\Country;
use App\Models\ExpertiseTag;
use App\Models\MentorProfile;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

test('mentors get a profile editor with their persisted details', function () {
    $mentor = User::factory()->mentor()->create(['name' => 'Dr. Maya Chen']);
    $country = Country::factory()->create(['name' => 'United Kingdom', 'iso2' => 'GB']);
    $tag = ExpertiseTag::factory()->create(['name' => 'SOP review', 'slug' => 'sop-review']);
    $availableTag = ExpertiseTag::factory()->create(['name' => 'CV review', 'slug' => 'cv-review']);

    $profile = MentorProfile::factory()->create([
        'user_id' => $mentor->id,
        'country_id' => $country->id,
        'verification_status' => VerificationStatus::Pending,
        'verified_at' => null,
    ]);
    $profile->expertiseTags()->attach($tag);
    $profile->availabilitySlots()->create([
        'weekday' => 2,
        'start_time' => '10:00',
        'end_time' => '13:00',
        'timezone' => 'UTC',
        'is_active' => true,
    ]);

    $this->actingAs($mentor)
        ->get(route('mentor-profile.edit'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('mentor-profile')
            ->where('profile.name', 'Dr. Maya Chen')
            ->where('profile.country_id', (string) $country->id)
            ->where('verification.status', 'pending')
            ->where('expertise.0.name', 'SOP review')
            ->where('availableExpertise.0.name', 'CV review')
            ->has('slots', 1)
            ->has('options.countries')
            ->has('options.availabilityStatuses', 3)
            ->has('options.weekdays', 7)
            ->has('completion.checks', 10));
});

test('the mentor profile editor creates a missing profile automatically', function () {
    $mentor = User::factory()->mentor()->create();

    $this->actingAs($mentor)
        ->get(route('mentor-profile.edit'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('mentor-profile')
            ->where('verification.status', 'pending')
            ->has('expertise', 0)
            ->has('slots', 0));

    $this->assertDatabaseHas('mentor_profiles', [
        'user_id' => $mentor->id,
        'verification_status' => VerificationStatus::Pending->value,
    ]);
});

test('mentors can update their profile details', function () {
    $mentor = User::factory()->mentor()->create();
    $country = Country::factory()->create(['name' => 'Germany', 'iso2' => 'DE']);
    $profile = MentorProfile::factory()->create([
        'user_id' => $mentor->id,
        'verification_status' => VerificationStatus::Pending,
    ]);

    $this->actingAs($mentor)
        ->patch(route('mentor-profile.update'), [
            'name' => 'Dr. Maya Chen',
            'headline' => 'UK scholarship mentor',
            'current_role' => 'Graduate Admissions Mentor',
            'organization' => 'University of Cambridge',
            'country_id' => $country->id,
            'bio' => 'I help learners shape scholarship applications.',
            'languages' => 'English, Mandarin',
            'years_experience' => 9,
            'linkedin_url' => 'https://www.linkedin.com/in/maya-chen',
            'website_url' => null,
            'availability_status' => AvailabilityStatus::Limited->value,
        ])
        ->assertRedirect(route('mentor-profile.edit'));

    $mentor->refresh();
    $profile->refresh();

    expect($mentor->name)->toBe('Dr. Maya Chen')
        ->and($profile->headline)->toBe('UK scholarship mentor')
        ->and($profile->current_role)->toBe('Graduate Admissions Mentor')
        ->and($profile->organization)->toBe('University of Cambridge')
        ->and($profile->country_id)->toBe($country->id)
        ->and($profile->languages)->toBe(['English', 'Mandarin'])
        ->and($profile->years_experience)->toBe(9)
        ->and($profile->availability_status)->toBe(AvailabilityStatus::Limited);
});

test('mentors can upload an avatar and introduction video', function () {
    Storage::fake('public');

    $mentor = User::factory()->mentor()->create();
    $profile = MentorProfile::factory()->create(['user_id' => $mentor->id]);

    $this->actingAs($mentor)
        ->patch(route('mentor-profile.update'), [
            'name' => $mentor->name,
            'availability_status' => AvailabilityStatus::Available->value,
            'avatar' => UploadedFile::fake()->create('avatar.jpg', 256, 'image/jpeg'),
            'intro_video' => UploadedFile::fake()->create('intro.mp4', 1024, 'video/mp4'),
        ])
        ->assertRedirect(route('mentor-profile.edit'));

    $mentor->refresh();
    $profile->refresh();

    expect($mentor->avatar)->not->toBeNull()
        ->and($profile->intro_video_path)->not->toBeNull();

    Storage::disk('public')->assertExists($mentor->avatar);
    Storage::disk('public')->assertExists($profile->intro_video_path);
});

test('mentors can manage expertise tags', function () {
    $mentor = User::factory()->mentor()->create();
    $profile = MentorProfile::factory()->create(['user_id' => $mentor->id]);
    $tag = ExpertiseTag::factory()->create(['name' => 'Interview prep', 'slug' => 'interview-prep']);

    $this->actingAs($mentor)
        ->post(route('mentor-profile.expertise.store'), [
            'expertise_tag_id' => $tag->id,
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('mentor_expertise', [
        'mentor_profile_id' => $profile->id,
        'expertise_tag_id' => $tag->id,
    ]);

    $this->actingAs($mentor)
        ->delete(route('mentor-profile.expertise.destroy', $tag))
        ->assertRedirect();

    $this->assertDatabaseMissing('mentor_expertise', [
        'mentor_profile_id' => $profile->id,
        'expertise_tag_id' => $tag->id,
    ]);
});

test('mentors can add, pause, and remove availability slots', function () {
    $mentor = User::factory()->mentor()->create();
    MentorProfile::factory()->create(['user_id' => $mentor->id]);

    $this->actingAs($mentor)
        ->post(route('mentor-profile.availability.store'), [
            'weekday' => 3,
            'start_time' => '09:00',
            'end_time' => '12:00',
            'timezone' => 'UTC',
            'is_active' => true,
        ])
        ->assertRedirect();

    $slot = MentorProfile::query()
        ->where('user_id', $mentor->id)
        ->firstOrFail()
        ->availabilitySlots()
        ->firstOrFail();

    expect($slot->weekday)->toBe(3)
        ->and(substr($slot->start_time, 0, 5))->toBe('09:00')
        ->and($slot->is_active)->toBeTrue();

    $this->actingAs($mentor)
        ->patch(route('mentor-profile.availability.update', $slot), [
            'weekday' => 4,
            'start_time' => '10:00',
            'end_time' => '13:00',
            'timezone' => 'Europe/London',
            'is_active' => false,
        ])
        ->assertRedirect();

    $slot->refresh();

    expect($slot->weekday)->toBe(4)
        ->and($slot->timezone)->toBe('Europe/London')
        ->and($slot->is_active)->toBeFalse();

    $this->actingAs($mentor)
        ->delete(route('mentor-profile.availability.destroy', $slot))
        ->assertRedirect();

    $this->assertDatabaseMissing('mentor_availability_slots', ['id' => $slot->id]);
});

test('mentors cannot manage another mentor availability slot', function () {
    $mentor = User::factory()->mentor()->create();
    MentorProfile::factory()->create(['user_id' => $mentor->id]);
    $otherProfile = MentorProfile::factory()->create();
    $slot = $otherProfile->availabilitySlots()->create([
        'weekday' => 1,
        'start_time' => '09:00',
        'end_time' => '10:00',
        'timezone' => 'UTC',
        'is_active' => true,
    ]);

    $this->actingAs($mentor)
        ->delete(route('mentor-profile.availability.destroy', $slot))
        ->assertNotFound();

    $this->assertDatabaseHas('mentor_availability_slots', ['id' => $slot->id]);
});

test('students cannot access the mentor profile editor', function () {
    $student = User::factory()->create();

    $this->actingAs($student)
        ->get(route('mentor-profile.edit'))
        ->assertForbidden();
});
