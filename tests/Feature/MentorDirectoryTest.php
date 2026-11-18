<?php

use App\Enums\AvailabilityStatus;
use App\Enums\VerificationStatus;
use App\Models\Country;
use App\Models\ExpertiseTag;
use App\Models\MentorProfile;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

/**
 * Create a mentor profile for a named mentor user.
 *
 * @param  array<string, mixed>  $attributes
 */
function mentorTestProfile(string $name, array $attributes = []): MentorProfile
{
    $user = User::factory()->mentor()->create(['name' => $name]);

    return MentorProfile::factory()->create([
        'user_id' => $user->id,
        ...$attributes,
    ]);
}

test('the mentor directory lists verified mentors with stats and a recommendation', function () {
    $viewer = User::factory()->create();
    $profile = mentorTestProfile('Dr. Maya Chen', [
        'rating_avg' => 4.9,
        'reviews_count' => 48,
        'sessions_count' => 126,
        'is_featured' => true,
    ]);
    $profile->expertiseTags()->attach(
        ExpertiseTag::factory()->create(['name' => 'SOP review', 'slug' => 'sop-review']),
    );
    mentorTestProfile('Pending Mentor', [
        'verification_status' => VerificationStatus::Pending,
        'verified_at' => null,
    ]);

    $this->actingAs($viewer)
        ->get(route('mentors.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('mentors')
            ->where('mentors.total', 1)
            ->where('mentors.data.0.name', 'Dr. Maya Chen')
            ->where('mentors.data.0.expertise', ['SOP review'])
            ->where('mentors.data.0.rating', '4.9')
            ->where('mentors.data.0.verified', true)
            ->where('stats.mentors', 1)
            ->where('stats.sessions', 126)
            ->where('stats.rating', '4.9')
            ->where('stats.reviews', 48)
            ->where('recommended.name', 'Dr. Maya Chen')
            ->has('options.expertise', 2)
            ->has('options.countries', 1));
});

test('the mentor directory filters by expertise, country, availability, and search', function () {
    $viewer = User::factory()->create();
    $uk = Country::factory()->create(['name' => 'United Kingdom', 'iso2' => 'GB']);
    $germany = Country::factory()->create(['name' => 'Germany', 'iso2' => 'DE']);
    $sop = ExpertiseTag::factory()->create(['name' => 'SOP review', 'slug' => 'sop-review']);
    $cv = ExpertiseTag::factory()->create(['name' => 'CV review', 'slug' => 'cv-review']);

    $maya = mentorTestProfile('Dr. Maya Chen', [
        'country_id' => $uk->id,
        'availability_status' => AvailabilityStatus::Available,
    ]);
    $maya->expertiseTags()->attach($sop);

    $james = mentorTestProfile('James Okafor', [
        'country_id' => $germany->id,
        'availability_status' => AvailabilityStatus::Limited,
    ]);
    $james->expertiseTags()->attach($cv);

    $this->actingAs($viewer)
        ->get(route('mentors.index', ['expertise' => 'cv-review']))
        ->assertInertia(fn (Assert $page) => $page
            ->where('mentors.total', 1)
            ->where('mentors.data.0.name', 'James Okafor'));

    $this->actingAs($viewer)
        ->get(route('mentors.index', ['country' => 'GB']))
        ->assertInertia(fn (Assert $page) => $page
            ->where('mentors.total', 1)
            ->where('mentors.data.0.name', 'Dr. Maya Chen'));

    $this->actingAs($viewer)
        ->get(route('mentors.index', ['availability' => 1]))
        ->assertInertia(fn (Assert $page) => $page
            ->where('mentors.total', 1)
            ->where('mentors.data.0.name', 'Dr. Maya Chen'));

    $this->actingAs($viewer)
        ->get(route('mentors.index', ['q' => 'Okafor']))
        ->assertInertia(fn (Assert $page) => $page
            ->where('mentors.total', 1)
            ->where('mentors.data.0.name', 'James Okafor'));
});

test('a mentor public profile shows their detail and availability', function () {
    $viewer = User::factory()->create();
    $profile = mentorTestProfile('Dr. Maya Chen', [
        'headline' => 'UK scholarship mentor',
        'bio' => 'I help learners with UK scholarships.',
        'years_experience' => 9,
    ]);
    $profile->expertiseTags()->attach(
        ExpertiseTag::factory()->create(['name' => 'SOP review', 'slug' => 'sop-review']),
    );
    $profile->availabilitySlots()->create([
        'weekday' => 1,
        'start_time' => '09:00',
        'end_time' => '12:00',
        'timezone' => 'UTC',
        'is_active' => true,
    ]);

    $this->actingAs($viewer)
        ->get(route('mentors.show', $profile))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('mentor-show')
            ->where('mentor.name', 'Dr. Maya Chen')
            ->where('mentor.bio', 'I help learners with UK scholarships.')
            ->where('mentor.yearsExperience', 9)
            ->where('mentor.expertise', ['SOP review'])
            ->has('mentor.slots', 1)
            ->where('mentor.slots.0.weekdayLabel', 'Monday')
            ->where('mentor.slots.0.label', 'Monday · 9:00 AM – 12:00 PM'));
});

test('unverified mentor profiles are hidden from other users', function () {
    $viewer = User::factory()->create();
    $profile = mentorTestProfile('Pending Mentor', [
        'verification_status' => VerificationStatus::Pending,
        'verified_at' => null,
    ]);

    $this->actingAs($viewer)
        ->get(route('mentors.show', $profile))
        ->assertForbidden();

    $this->actingAs($profile->user)
        ->get(route('mentors.show', $profile))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('mentor-show')
            ->where('mentor.name', 'Pending Mentor'));
});
