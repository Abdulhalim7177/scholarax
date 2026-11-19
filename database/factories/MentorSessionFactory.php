<?php

namespace Database\Factories;

use App\Enums\MentorSessionStatus;
use App\Models\MentorSession;
use App\Models\Mentorship;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<MentorSession>
 */
class MentorSessionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'mentorship_id' => Mentorship::factory(),
            'requested_by' => User::factory(),
            'topic' => fake()->sentence(3),
            'scheduled_at' => now()->addDays(2)->setTime(10, 30),
            'duration_minutes' => 45,
            'meeting_url' => null,
            'status' => MentorSessionStatus::Confirmed,
            'attendance_status' => null,
            'notes' => null,
            'completed_at' => null,
        ];
    }

    /**
     * Indicate that the session is awaiting confirmation.
     */
    public function requested(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => MentorSessionStatus::Requested,
        ]);
    }

    /**
     * Indicate that the session has already taken place.
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => MentorSessionStatus::Completed,
            'scheduled_at' => now()->subDays(3),
            'completed_at' => now()->subDays(3),
        ]);
    }
}
