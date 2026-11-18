<?php

namespace Database\Factories;

use App\Models\Application;
use App\Models\ApplicationTask;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ApplicationTask>
 */
class ApplicationTaskFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'application_id' => Application::factory(),
            'title' => fake()->sentence(3),
            'description' => fake()->sentence(8),
            'due_at' => now()->addDays(fake()->numberBetween(3, 30)),
            'completed_at' => null,
            'sort_order' => fake()->numberBetween(0, 10),
            'type' => 'document',
        ];
    }

    /**
     * Indicate that the task is complete.
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'completed_at' => now()->subDay(),
        ]);
    }
}
