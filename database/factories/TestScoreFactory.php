<?php

namespace Database\Factories;

use App\Models\TestScore;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<TestScore>
 */
class TestScoreFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'type' => fake()->randomElement(['IELTS', 'TOEFL', 'GRE', 'Duolingo']),
            'score' => (string) fake()->randomFloat(1, 6, 9),
            'tested_at' => fake()->dateTimeBetween('-2 years', '-1 month')->format('Y-m-d'),
            'expires_at' => fake()->dateTimeBetween('+6 months', '+2 years')->format('Y-m-d'),
        ];
    }
}
