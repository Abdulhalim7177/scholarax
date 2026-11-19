<?php

namespace Database\Factories;

use App\Models\Testimonial;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Testimonial>
 */
class TestimonialFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->name();

        return [
            'quote' => fake()->paragraph(),
            'author_name' => $name,
            'author_detail' => fake()->sentence(6),
            'initials' => strtoupper(
                substr($name, 0, 1).substr(strrchr($name, ' ') ?: '', 1, 1),
            ),
            'tone' => fake()->randomElement(['blue', 'teal', 'coral', 'gold']),
            'is_published' => true,
            'sort_order' => fake()->numberBetween(0, 10),
        ];
    }

    /**
     * Indicate that the testimonial is hidden from the home page.
     */
    public function unpublished(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_published' => false,
        ]);
    }
}
