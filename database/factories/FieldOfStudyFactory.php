<?php

namespace Database\Factories;

use App\Models\FieldOfStudy;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<FieldOfStudy>
 */
class FieldOfStudyFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = Str::title(fake()->unique()->sentence(2));

        return [
            'name' => $name,
            'slug' => Str::slug($name),
            'sort_order' => fake()->numberBetween(0, 20),
        ];
    }
}
