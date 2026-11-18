<?php

namespace Database\Factories;

use App\Models\MentorAvailabilitySlot;
use App\Models\MentorProfile;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<MentorAvailabilitySlot>
 */
class MentorAvailabilitySlotFactory extends Factory
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
            'weekday' => fake()->numberBetween(1, 7),
            'start_time' => '09:00',
            'end_time' => '12:00',
            'timezone' => 'UTC',
            'is_active' => true,
        ];
    }
}
