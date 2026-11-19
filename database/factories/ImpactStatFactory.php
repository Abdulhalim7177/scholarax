<?php

namespace Database\Factories;

use App\Models\ImpactStat;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<ImpactStat>
 */
class ImpactStatFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $label = fake()->word().' '.fake()->word();

        return [
            'key' => Str::slug($label).'-'.Str::lower(Str::random(4)),
            'label' => $label,
            'source' => 'static',
            'value' => fake()->numberBetween(1, 100),
            'icon' => fake()->randomElement(['users', 'globe', 'book']),
            'is_published' => true,
            'sort_order' => fake()->numberBetween(0, 10),
        ];
    }

    /**
     * Indicate that the stat is computed from live scholarship records.
     */
    public function scholarships(): static
    {
        return $this->state(fn (array $attributes) => [
            'source' => 'scholarships',
            'value' => 0,
        ]);
    }
}
