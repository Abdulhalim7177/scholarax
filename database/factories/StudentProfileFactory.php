<?php

namespace Database\Factories;

use App\Models\StudentProfile;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<StudentProfile>
 */
class StudentProfileFactory extends Factory
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
            'headline' => fake()->sentence(4),
            'bio' => fake()->paragraph(),
            'date_of_birth' => fake()->dateTimeBetween('-32 years', '-19 years')->format('Y-m-d'),
            'city' => fake()->city(),
            'linkedin_url' => 'https://www.linkedin.com/in/'.fake()->slug(),
            'website_url' => null,
            'country_id' => null,
            'target_level_id' => null,
            'target_field_id' => null,
        ];
    }
}
