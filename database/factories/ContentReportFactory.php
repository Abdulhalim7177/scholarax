<?php

namespace Database\Factories;

use App\Enums\ReportReason;
use App\Enums\ReportStatus;
use App\Models\ContentReport;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ContentReport>
 */
class ContentReportFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'reporter_id' => User::factory(),
            'reportable_type' => null,
            'reportable_id' => null,
            'reason' => ReportReason::Other,
            'details' => fake()->sentence(14),
            'status' => ReportStatus::Open,
            'resolved_by' => null,
            'resolved_at' => null,
            'resolution_note' => null,
        ];
    }

    /**
     * Indicate that the report has been resolved.
     */
    public function resolved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => ReportStatus::Resolved,
            'resolved_at' => now(),
        ]);
    }

    /**
     * Indicate that the report was dismissed.
     */
    public function dismissed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => ReportStatus::Dismissed,
            'resolved_at' => now(),
        ]);
    }
}
