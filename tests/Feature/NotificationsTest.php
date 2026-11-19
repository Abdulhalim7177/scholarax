<?php

use App\Models\ActivityEvent;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('notifications lists the signed in user activity', function () {
    $user = User::factory()->create();
    $other = User::factory()->create();

    ActivityEvent::factory()->create([
        'user_id' => $user->id,
        'title' => 'Scholarship saved',
    ]);
    ActivityEvent::factory()->create([
        'user_id' => $other->id,
        'title' => 'Someone else activity',
    ]);

    $this->actingAs($user)
        ->get('/notifications')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('notifications')
            ->has('notifications.data', 1)
            ->where('notifications.data.0.title', 'Scholarship saved'));
});

test('guests cannot view notifications', function () {
    $this->get('/notifications')->assertRedirect('/login');
});
