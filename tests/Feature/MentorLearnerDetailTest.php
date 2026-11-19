<?php

use App\Models\MentorProfile;
use App\Models\Mentorship;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('a mentor can view one of their learners', function () {
    $mentorUser = User::factory()->mentor()->create();
    $profile = MentorProfile::factory()->create([
        'user_id' => $mentorUser->id,
    ]);
    $student = User::factory()->create(['name' => 'Amina Yusuf']);
    $mentorship = Mentorship::factory()->create([
        'mentor_profile_id' => $profile->id,
        'student_id' => $student->id,
        'goals' => 'Earn a Chevening scholarship',
    ]);

    $this->actingAs($mentorUser)
        ->get("/mentor-learners/{$mentorship->id}")
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('mentor-learner')
            ->where('learner.id', $mentorship->id)
            ->where('learner.name', 'Amina Yusuf')
            ->where('learner.goal', 'Earn a Chevening scholarship')
            ->has('applications', 0)
            ->has('sessions', 0));
});

test('a mentor cannot view another mentors learner', function () {
    $mentorUser = User::factory()->mentor()->create();
    MentorProfile::factory()->create(['user_id' => $mentorUser->id]);

    $otherProfile = MentorProfile::factory()->create();
    $mentorship = Mentorship::factory()->create([
        'mentor_profile_id' => $otherProfile->id,
    ]);

    $this->actingAs($mentorUser)
        ->get("/mentor-learners/{$mentorship->id}")
        ->assertNotFound();
});

test('students cannot open the mentor learner detail', function () {
    $student = User::factory()->create();
    $mentorship = Mentorship::factory()->create();

    $this->actingAs($student)
        ->get("/mentor-learners/{$mentorship->id}")
        ->assertForbidden();
});
