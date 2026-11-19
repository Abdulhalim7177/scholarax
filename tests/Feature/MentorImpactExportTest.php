<?php

use App\Models\MentorProfile;
use App\Models\User;

test('a mentor can download their impact report', function () {
    $mentorUser = User::factory()->mentor()->create();
    MentorProfile::factory()->create(['user_id' => $mentorUser->id]);

    $response = $this->actingAs($mentorUser)
        ->get('/mentor-impact/export')
        ->assertOk()
        ->assertHeader('content-type', 'text/csv; charset=UTF-8');

    $csv = $response->streamedContent();

    expect($csv)
        ->toContain('Metric,Value')
        ->toContain('Learners supported')
        ->toContain('Application progress');
});

test('students cannot download mentor impact reports', function () {
    $student = User::factory()->create();

    $this->actingAs($student)
        ->get('/mentor-impact/export')
        ->assertForbidden();
});
