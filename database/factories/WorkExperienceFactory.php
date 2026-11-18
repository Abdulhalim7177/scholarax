<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\WorkExperience;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<WorkExperience>
 */
class WorkExperienceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startedAt = fake()->dateTimeBetween('-6 years', '-1 year');

        return [
            'user_id' => User::factory(),
            'organization' => fake()->company(),
            'role' => fake()->jobTitle(),
            'started_at' => $startedAt->format('Y-m-d'),
            'ended_at' => fake()->dateTimeBetween($startedAt, 'now')->format('Y-m-d'),
            'description' => fake()->sentence(18),
            'is_current' => false,
        ];
    }
}
