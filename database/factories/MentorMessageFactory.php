<?php

namespace Database\Factories;

use App\Models\MentorMessage;
use App\Models\Mentorship;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<MentorMessage>
 */
class MentorMessageFactory extends Factory
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
            'sender_id' => User::factory(),
            'recipient_id' => User::factory(),
            'body' => fake()->paragraph(),
            'read_at' => null,
        ];
    }

    /**
     * Indicate that the message has been read.
     */
    public function read(): static
    {
        return $this->state(fn (array $attributes) => [
            'read_at' => now()->subHour(),
        ]);
    }
}
