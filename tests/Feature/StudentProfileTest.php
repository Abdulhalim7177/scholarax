<?php

use App\Models\Country;
use App\Models\Education;
use App\Models\FieldOfStudy;
use App\Models\StudyLevel;
use App\Models\TestScore;
use App\Models\User;
use App\Models\WorkExperience;
use Inertia\Testing\AssertableInertia as Assert;

test('the student profile page returns completion data and options', function () {
    $student = User::factory()->create();

    Country::factory()->create(['name' => 'Nigeria', 'iso2' => 'NG']);
    StudyLevel::factory()->create(['slug' => 'masters', 'name' => "Master's"]);
    FieldOfStudy::factory()->create(['slug' => 'public-policy', 'name' => 'Public policy']);

    $this->actingAs($student)
        ->get(route('student-profile.edit'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('student-profile')
            ->where('profile', null)
            ->has('educations', 0)
            ->has('workExperiences', 0)
            ->has('testScores', 0)
            ->has('options.countries', 1)
            ->has('options.levels', 1)
            ->has('options.fields', 1)
            ->where('completion.score', 0)
            ->where('completion.total', 8)
            ->has('completion.checks', 8));
});

test('a student can update their scholarship profile', function () {
    $student = User::factory()->create();
    $country = Country::factory()->create(['name' => 'Nigeria', 'iso2' => 'NG']);
    $level = StudyLevel::factory()->create(['slug' => 'masters', 'name' => "Master's"]);
    $field = FieldOfStudy::factory()->create(['slug' => 'public-policy', 'name' => 'Public policy']);

    $this->actingAs($student)
        ->patch(route('student-profile.update'), [
            'headline' => 'Aspiring policy analyst',
            'bio' => 'Focused on education access.',
            'city' => 'Lagos',
            'country_id' => $country->id,
            'target_level_id' => $level->id,
            'target_field_id' => $field->id,
            'linkedin_url' => 'https://www.linkedin.com/in/test-student',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('student_profiles', [
        'user_id' => $student->id,
        'headline' => 'Aspiring policy analyst',
        'city' => 'Lagos',
        'country_id' => $country->id,
        'target_level_id' => $level->id,
        'target_field_id' => $field->id,
    ]);

    $this->assertDatabaseHas('activity_events', [
        'user_id' => $student->id,
        'type' => 'profile_updated',
    ]);
});

test('profile completion reflects persisted profile details and records', function () {
    $student = User::factory()->create();
    $country = Country::factory()->create(['name' => 'Nigeria', 'iso2' => 'NG']);
    $level = StudyLevel::factory()->create(['slug' => 'masters', 'name' => "Master's"]);
    $field = FieldOfStudy::factory()->create(['slug' => 'public-policy', 'name' => 'Public policy']);

    $this->actingAs($student)->patch(route('student-profile.update'), [
        'headline' => 'Aspiring policy analyst',
        'bio' => 'Focused on education access.',
        'city' => 'Lagos',
        'country_id' => $country->id,
        'target_level_id' => $level->id,
        'target_field_id' => $field->id,
    ]);

    $student->educations()->create([
        'institution' => 'University of Lagos',
        'degree' => 'BSc',
        'field' => 'Political Science',
    ]);

    $student->testScores()->create([
        'type' => 'IELTS',
        'score' => '8.0',
    ]);

    $this->actingAs($student)
        ->get(route('student-profile.edit'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('completion.score', 100)
            ->where('completion.completed', 8)
            ->where('profile.headline', 'Aspiring policy analyst')
            ->has('educations', 1)
            ->has('testScores', 1));
});

test('a student can manage education records', function () {
    $student = User::factory()->create();

    $this->actingAs($student)
        ->post(route('student-profile.educations.store'), [
            'institution' => 'University of Lagos',
            'degree' => 'BSc',
            'field' => 'Political Science',
            'started_at' => '2020-09-01',
            'ended_at' => '2024-06-30',
            'is_current' => false,
        ])
        ->assertRedirect();

    $education = Education::query()->firstOrFail();

    expect($education->user_id)->toBe($student->id);

    $this->actingAs($student)
        ->patch(route('student-profile.educations.update', $education), [
            'institution' => 'University of Lagos',
            'degree' => 'MSc',
            'field' => 'Public Policy',
            'is_current' => true,
        ])
        ->assertRedirect();

    $education->refresh();

    expect($education->degree)->toBe('MSc')
        ->and($education->is_current)->toBeTrue()
        ->and($education->ended_at)->toBeNull();

    $this->actingAs($student)
        ->delete(route('student-profile.educations.destroy', $education))
        ->assertRedirect();

    $this->assertDatabaseMissing('educations', ['id' => $education->id]);
});

test('a student cannot manage another students education record', function () {
    $owner = User::factory()->create();
    $intruder = User::factory()->create();
    $education = Education::factory()->create(['user_id' => $owner->id]);

    $this->actingAs($intruder)
        ->patch(route('student-profile.educations.update', $education), [
            'institution' => 'Hijacked University',
            'degree' => 'BSc',
        ])
        ->assertForbidden();

    $this->actingAs($intruder)
        ->delete(route('student-profile.educations.destroy', $education))
        ->assertForbidden();
});

test('a student can manage work experiences and test scores', function () {
    $student = User::factory()->create();

    $this->actingAs($student)
        ->post(route('student-profile.work-experiences.store'), [
            'organization' => 'Teach for Nigeria',
            'role' => 'Programme Associate',
            'started_at' => '2024-01-15',
            'is_current' => true,
        ])
        ->assertRedirect();

    $experience = WorkExperience::query()->firstOrFail();

    expect($experience->user_id)->toBe($student->id)
        ->and($experience->is_current)->toBeTrue()
        ->and($experience->ended_at)->toBeNull();

    $this->actingAs($student)
        ->delete(route('student-profile.work-experiences.destroy', $experience))
        ->assertRedirect();

    $this->assertDatabaseMissing('work_experiences', ['id' => $experience->id]);

    $this->actingAs($student)
        ->post(route('student-profile.test-scores.store'), [
            'type' => 'IELTS',
            'score' => '8.0',
            'tested_at' => '2025-01-10',
            'expires_at' => '2027-01-10',
        ])
        ->assertRedirect();

    $score = TestScore::query()->firstOrFail();

    $this->actingAs($student)
        ->patch(route('student-profile.test-scores.update', $score), [
            'type' => 'IELTS',
            'score' => '8.5',
        ])
        ->assertRedirect();

    expect($score->refresh()->score)->toBe('8.5');

    $this->actingAs($student)
        ->delete(route('student-profile.test-scores.destroy', $score))
        ->assertRedirect();

    $this->assertDatabaseMissing('test_scores', ['id' => $score->id]);
});

test('profile writes validate their input', function () {
    $student = User::factory()->create();

    $this->actingAs($student)
        ->patch(route('student-profile.update'), [
            'linkedin_url' => 'not-a-url',
        ])
        ->assertSessionHasErrors('linkedin_url');

    $this->actingAs($student)
        ->post(route('student-profile.educations.store'), [
            'institution' => '',
            'degree' => '',
        ])
        ->assertSessionHasErrors(['institution', 'degree']);
});
