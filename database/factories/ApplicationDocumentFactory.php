<?php

namespace Database\Factories;

use App\Enums\ApplicationDocumentStatus;
use App\Enums\ApplicationDocumentType;
use App\Models\Application;
use App\Models\ApplicationDocument;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ApplicationDocument>
 */
class ApplicationDocumentFactory extends Factory
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
            'type' => ApplicationDocumentType::Cv,
            'title' => 'Curriculum vitae',
            'version' => 1,
            'file_path' => null,
            'original_name' => null,
            'status' => ApplicationDocumentStatus::Draft,
            'submitted_at' => null,
        ];
    }

    /**
     * Indicate that the document has been submitted.
     */
    public function submitted(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => ApplicationDocumentStatus::Submitted,
            'submitted_at' => now()->subDay(),
        ]);
    }
}
