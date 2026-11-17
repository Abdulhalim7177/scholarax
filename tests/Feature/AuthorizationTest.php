<?php

use App\Models\User;

test('guests are redirected from protected areas', function (string $route) {
    $this->get($route)->assertRedirect(route('login'));
})->with([
    '/dashboard',
    '/scholarships',
    '/applications',
    '/admin-dashboard',
    '/mentor-dashboard',
]);

test('students cannot access mentor or admin areas', function (string $route) {
    $student = User::factory()->create();

    $this->actingAs($student)->get($route)->assertForbidden();
})->with([
    '/admin-dashboard',
    '/admin-users',
    '/mentor-dashboard',
    '/mentor-learners',
]);

test('students can access student areas', function () {
    $student = User::factory()->create();

    $this->actingAs($student)->get('/dashboard')->assertOk();
    $this->actingAs($student)->get('/scholarships')->assertOk();
});

test('mentors can access mentor areas but not admin areas', function () {
    $mentor = User::factory()->mentor()->create();

    $this->actingAs($mentor)->get('/mentor-dashboard')->assertOk();
    $this->actingAs($mentor)->get('/mentor-learners')->assertOk();
    $this->actingAs($mentor)->get('/admin-dashboard')->assertForbidden();
});

test('admins can access both admin and mentor areas', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)->get('/admin-dashboard')->assertOk();
    $this->actingAs($admin)->get('/mentor-dashboard')->assertOk();
    $this->actingAs($admin)->get('/dashboard')->assertOk();
});
