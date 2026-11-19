<?php

namespace Database\Factories;

use App\Enums\ReportExportStatus;
use App\Models\ReportExport;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ReportExport>
 */
class ReportExportFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory()->admin(),
            'status' => ReportExportStatus::Pending,
            'path' => null,
            'rows' => 0,
            'error' => null,
            'completed_at' => null,
        ];
    }

    /**
     * Indicate that the export finished successfully.
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => ReportExportStatus::Completed,
            'path' => 'reports/platform-report.csv',
            'rows' => 12,
            'completed_at' => now(),
        ]);
    }
}
