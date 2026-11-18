<?php

namespace Database\Factories;

use App\Models\CvSopDocument;
use App\Models\CvSopSection;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<CvSopSection>
 */
class CvSopSectionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'document_id' => CvSopDocument::factory(),
            'key' => fake()->unique()->slug(2),
            'title' => fake()->words(2, true),
            'content' => null,
            'sort_order' => 0,
            'completed_at' => null,
        ];
    }

    /**
     * Indicate that the section has content.
     */
    public function filled(): static
    {
        return $this->state(fn (array $attributes) => [
            'content' => fake()->paragraph(),
            'completed_at' => now()->subHour(),
        ]);
    }
}
