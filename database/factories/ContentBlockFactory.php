<?php

namespace Database\Factories;

use App\Models\ContentBlock;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ContentBlock>
 */
class ContentBlockFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'type' => 'feature',
            'eyebrow' => null,
            'title' => fake()->sentence(3),
            'body' => fake()->sentence(12),
            'badge' => null,
            'icon' => fake()->randomElement(['search', 'file-text', 'users']),
            'tone' => fake()->randomElement(['blue', 'teal', 'coral', 'gold']),
            'is_published' => true,
            'sort_order' => fake()->numberBetween(0, 10),
        ];
    }

    /**
     * Indicate the block belongs to a type.
     */
    public function type(string $type): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => $type,
        ]);
    }
}
