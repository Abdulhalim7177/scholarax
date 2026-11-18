<?php

namespace Database\Factories;

use App\Models\ActivityEvent;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ActivityEvent>
 */
class ActivityEventFactory extends Factory
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
            'type' => 'profile_updated',
            'title' => 'Updated your profile',
            'body' => fake()->sentence(6),
            'subject_type' => null,
            'subject_id' => null,
            'metadata' => null,
        ];
    }
}
