<?php

namespace Database\Factories;

use App\Enums\DocumentReviewPriority;
use App\Enums\DocumentReviewStatus;
use App\Models\ApplicationDocument;
use App\Models\DocumentReview;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<DocumentReview>
 */
class DocumentReviewFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'application_document_id' => ApplicationDocument::factory(),
            'mentor_id' => User::factory()->mentor(),
            'status' => DocumentReviewStatus::Pending,
            'priority' => DocumentReviewPriority::Normal,
            'due_at' => now()->addDays(3),
            'feedback' => null,
            'reviewed_at' => null,
        ];
    }

    /**
     * Indicate that the review is due today.
     */
    public function dueToday(): static
    {
        return $this->state(fn (array $attributes) => [
            'priority' => DocumentReviewPriority::High,
            'due_at' => now()->setTime(18, 0),
        ]);
    }

    /**
     * Indicate that the review has been completed.
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => DocumentReviewStatus::Completed,
            'reviewed_at' => now()->subHour(),
            'feedback' => fake()->paragraph(),
        ]);
    }
}
