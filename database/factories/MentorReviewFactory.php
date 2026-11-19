<?php

namespace Database\Factories;

use App\Models\MentorProfile;
use App\Models\MentorReview;
use App\Models\Mentorship;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<MentorReview>
 */
class MentorReviewFactory extends Factory
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
            'student_id' => User::factory(),
            'mentor_profile_id' => MentorProfile::factory(),
            'rating' => fake()->numberBetween(4, 5),
            'comment' => fake()->sentence(12),
            'is_published' => true,
        ];
    }

    /**
     * Indicate that the review is hidden from the mentor profile.
     */
    public function unpublished(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_published' => false,
        ]);
    }
}
