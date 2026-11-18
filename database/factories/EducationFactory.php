<?php

namespace Database\Factories;

use App\Models\Education;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Education>
 */
class EducationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startedAt = fake()->dateTimeBetween('-8 years', '-2 years');

        return [
            'user_id' => User::factory(),
            'institution' => fake()->company().' University',
            'degree' => fake()->randomElement(['BSc', 'BA', 'MSc', 'MA']),
            'field' => fake()->randomElement(['Computer Science', 'Economics', 'Public Health', 'Engineering']),
            'started_at' => $startedAt->format('Y-m-d'),
            'ended_at' => fake()->dateTimeBetween($startedAt, '-1 year')->format('Y-m-d'),
            'grade' => fake()->randomElement(['First class', '3.8 GPA', 'Upper second class']),
            'is_current' => false,
        ];
    }
}
