<?php

namespace Database\Factories;

use App\Models\ExpertiseTag;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ExpertiseTag>
 */
class ExpertiseTagFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->unique()->jobTitle();

        return [
            'name' => ucfirst($name),
            'slug' => str($name)->slug()->value(),
        ];
    }
}
