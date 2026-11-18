<?php

namespace Database\Factories;

use App\Enums\ApplicationStatus;
use App\Models\Application;
use App\Models\Scholarship;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Application>
 */
class ApplicationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'student_id' => User::factory(),
            'scholarship_id' => Scholarship::factory(),
            'status' => ApplicationStatus::Draft,
            'progress' => 0,
            'next_step' => null,
            'deadline_at' => now()->addDays(30),
            'submitted_at' => null,
            'decision_at' => null,
            'offer_details' => null,
        ];
    }

    /**
     * Indicate that the application has been submitted.
     */
    public function submitted(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => ApplicationStatus::Submitted,
            'progress' => 100,
            'submitted_at' => now()->subDays(3),
        ]);
    }

    /**
     * Indicate that the application received an offer.
     */
    public function offerReceived(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => ApplicationStatus::OfferReceived,
            'progress' => 100,
            'submitted_at' => now()->subDays(20),
            'decision_at' => now()->subDays(2),
        ]);
    }
}
