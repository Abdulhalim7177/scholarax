<?php

namespace Database\Factories;

use App\Enums\BuilderTemplateType;
use App\Models\BuilderTemplate;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<BuilderTemplate>
 */
class BuilderTemplateFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'type' => BuilderTemplateType::Cv,
            'name' => fake()->unique()->words(2, true),
            'slug' => fake()->unique()->slug(),
            'description' => fake()->sentence(10),
            'accent' => 'blue',
            'sections' => [
                ['key' => 'profile', 'title' => 'Profile'],
                ['key' => 'education', 'title' => 'Education'],
                ['key' => 'experience', 'title' => 'Experience'],
                ['key' => 'skills', 'title' => 'Skills'],
            ],
            'is_recommended' => false,
            'is_active' => true,
            'sort_order' => 0,
        ];
    }

    /**
     * Indicate that the template is for a statement of purpose.
     */
    public function sop(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => BuilderTemplateType::Sop,
            'sections' => [
                ['key' => 'opening-story', 'title' => 'Opening story'],
                ['key' => 'academic-journey', 'title' => 'Academic journey'],
                ['key' => 'why-this-program', 'title' => 'Why this program'],
                ['key' => 'future-impact', 'title' => 'Future impact'],
            ],
        ]);
    }

    /**
     * Indicate that the template is recommended.
     */
    public function recommended(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_recommended' => true,
        ]);
    }
}
