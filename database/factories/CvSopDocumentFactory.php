<?php

namespace Database\Factories;

use App\Enums\BuilderTemplateType;
use App\Enums\CvSopDocumentStatus;
use App\Models\CvSopDocument;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<CvSopDocument>
 */
class CvSopDocumentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'type' => BuilderTemplateType::Cv,
            'title' => 'My CV',
            'builder_template_id' => null,
            'headline' => null,
            'summary' => null,
            'status' => CvSopDocumentStatus::Draft,
            'last_saved_at' => null,
        ];
    }

    /**
     * Indicate that the document is a statement of purpose.
     */
    public function sop(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => BuilderTemplateType::Sop,
            'title' => 'My statement of purpose',
        ]);
    }

    /**
     * Indicate that the document has been edited.
     */
    public function inProgress(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => CvSopDocumentStatus::InProgress,
            'last_saved_at' => now()->subHours(2),
        ]);
    }
}
