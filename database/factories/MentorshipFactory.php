<?php

namespace Database\Factories;

use App\Enums\MentorshipStatus;
use App\Models\MentorProfile;
use App\Models\Mentorship;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Mentorship>
 */
class MentorshipFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'mentor_profile_id' => MentorProfile::factory(),
            'student_id' => User::factory(),
            'status' => MentorshipStatus::Active,
            'started_at' => now()->subWeeks(3),
            'ended_at' => null,
            'goals' => fake()->sentence(6),
        ];
    }

    /**
     * Indicate that the mentorship has ended.
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => MentorshipStatus::Completed,
            'ended_at' => now()->subWeek(),
        ]);
    }
}
