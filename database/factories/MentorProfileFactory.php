<?php

namespace Database\Factories;

use App\Enums\AvailabilityStatus;
use App\Enums\VerificationStatus;
use App\Models\MentorProfile;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<MentorProfile>
 */
class MentorProfileFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory()->mentor(),
            'headline' => fake()->sentence(6),
            'current_role' => fake()->jobTitle(),
            'organization' => fake()->company(),
            'country_id' => null,
            'bio' => fake()->paragraph(),
            'languages' => ['English'],
            'years_experience' => fake()->numberBetween(2, 15),
            'linkedin_url' => 'https://www.linkedin.com/in/'.fake()->slug(),
            'website_url' => null,
            'intro_video_path' => null,
            'verification_status' => VerificationStatus::Verified,
            'verified_at' => now()->subMonth(),
            'availability_status' => AvailabilityStatus::Available,
            'response_time_minutes' => 240,
            'rating_avg' => fake()->randomFloat(2, 4.5, 5),
            'reviews_count' => fake()->numberBetween(5, 60),
            'learners_count' => fake()->numberBetween(5, 40),
            'sessions_count' => fake()->numberBetween(10, 150),
            'is_featured' => false,
        ];
    }

    /**
     * Indicate that the mentor is awaiting verification.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'verification_status' => VerificationStatus::Pending,
            'verified_at' => null,
            'is_featured' => false,
        ]);
    }

    /**
     * Indicate that the mentor is featured.
     */
    public function featured(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_featured' => true,
        ]);
    }
}
