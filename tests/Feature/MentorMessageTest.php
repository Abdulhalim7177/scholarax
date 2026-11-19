<?php

use App\Models\MentorMessage;
use App\Models\MentorProfile;
use App\Models\Mentorship;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

/**
 * Create a mentor with a profile for message tests.
 *
 * @return array{0: User, 1: MentorProfile}
 */
function messageTestMentor(string $name = 'Dr. Maya Chen'): array
{
    $mentor = User::factory()->mentor()->create(['name' => $name]);
    $profile = MentorProfile::factory()->create(['user_id' => $mentor->id]);

    return [$mentor, $profile];
}

/**
 * Create an active mentorship for message tests.
 *
 * @return array{0: User, 1: Mentorship}
 */
function messageTestMentorship(MentorProfile $profile, string $name = 'Amina Yusuf'): array
{
    $student = User::factory()->create(['name' => $name]);

    $mentorship = Mentorship::factory()->create([
        'mentor_profile_id' => $profile->id,
        'student_id' => $student->id,
        'goals' => 'Chevening Scholarship',
    ]);

    return [$student, $mentorship];
}

test('the mentor inbox lists conversations and marks received messages as read', function () {
    [$mentor, $profile] = messageTestMentor();
    [$student, $mentorship] = messageTestMentorship($profile);

    $message = MentorMessage::factory()->create([
        'mentorship_id' => $mentorship->id,
        'sender_id' => $student->id,
        'recipient_id' => $mentor->id,
        'body' => 'Could you look at my latest draft?',
    ]);

    $this->actingAs($mentor)
        ->get(route('mentor-messages', ['mentorship' => $mentorship->id]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('mentor-messages')
            ->where('stats.conversations', 1)
            ->where('active.mentorshipId', $mentorship->id)
            ->where('active.learner', 'Amina Yusuf')
            ->has('thread', 1)
            ->where('thread.0.body', 'Could you look at my latest draft?')
            ->where('thread.0.fromMentor', false));

    expect($message->refresh()->read_at)->not->toBeNull();
});

test('mentors can send a message to their own learner', function () {
    [$mentor, $profile] = messageTestMentor();
    [$student, $mentorship] = messageTestMentorship($profile);

    $this->actingAs($mentor)
        ->post(route('mentor-messages.store'), [
            'mentorship_id' => $mentorship->id,
            'body' => 'I have read your draft — let us tighten the opening.',
        ])
        ->assertRedirect(route('mentor-messages', ['mentorship' => $mentorship->id]));

    $this->assertDatabaseHas('mentor_messages', [
        'mentorship_id' => $mentorship->id,
        'sender_id' => $mentor->id,
        'recipient_id' => $student->id,
        'body' => 'I have read your draft — let us tighten the opening.',
    ]);
});

test('mentors cannot message another mentors learner', function () {
    [$mentor] = messageTestMentor();
    [, $otherProfile] = messageTestMentor('James Okafor');
    [, $mentorship] = messageTestMentorship($otherProfile, 'David Mensah');

    $this->actingAs($mentor)
        ->post(route('mentor-messages.store'), [
            'mentorship_id' => $mentorship->id,
            'body' => 'Hello from the wrong mentor.',
        ])
        ->assertNotFound();

    expect(MentorMessage::query()->count())->toBe(0);
});
