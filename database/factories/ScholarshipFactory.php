<?php

namespace Database\Factories;

use App\Enums\FundingType;
use App\Enums\ScholarshipStatus;
use App\Models\Country;
use App\Models\Scholarship;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Scholarship>
 */
class ScholarshipFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = Str::title(fake()->unique()->sentence(3));

        return [
            'slug' => Str::slug($title).'-'.Str::lower(Str::random(6)),
            'title' => $title,
            'provider' => fake()->company(),
            'summary' => fake()->sentence(18),
            'description' => fake()->paragraphs(3, true),
            'host_country_id' => Country::factory(),
            'funding_type' => FundingType::FullyFunded,
            'funding_amount' => null,
            'currency' => null,
            'deadline_at' => now()->addDays(30),
            'application_url' => fake()->url(),
            'eligibility' => fake()->sentence(20),
            'required_documents' => ['Statement of purpose', 'Academic transcript'],
            'status' => ScholarshipStatus::Live,
            'is_featured' => false,
            'verified_at' => now(),
            'published_at' => now(),
            'created_by' => null,
            'approved_by' => null,
            'views_count' => 0,
        ];
    }

    /**
     * Indicate that the scholarship is featured.
     */
    public function featured(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_featured' => true,
        ]);
    }

    /**
     * Indicate that the scholarship is pending review.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => ScholarshipStatus::Pending,
            'verified_at' => null,
            'published_at' => null,
        ]);
    }

    /**
     * Indicate that the scholarship is a draft.
     */
    public function draft(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => ScholarshipStatus::Draft,
            'verified_at' => null,
            'published_at' => null,
        ]);
    }
}
