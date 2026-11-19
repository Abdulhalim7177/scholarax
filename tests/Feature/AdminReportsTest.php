<?php

use App\Enums\ApplicationStatus;
use App\Enums\ReportExportStatus;
use App\Models\ActivityEvent;
use App\Models\Application;
use App\Models\Country;
use App\Models\MentorReview;
use App\Models\ReportExport;
use App\Models\Scholarship;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

/**
 * Create an admin and a small dataset for report tests.
 */
function adminReportsDataset(): array
{
    $admin = User::factory()->admin()->create();
    $student = User::factory()->create(['name' => 'Amina Yusuf']);
    $country = Country::factory()->create(['name' => 'United Kingdom']);
    $scholarship = Scholarship::factory()->create(['host_country_id' => $country->id]);
    $application = Application::factory()->create([
        'student_id' => $student->id,
        'scholarship_id' => $scholarship->id,
        'status' => ApplicationStatus::InReview,
        'progress' => 80,
    ]);
    ActivityEvent::factory()->create([
        'user_id' => $student->id,
        'created_at' => now()->subDays(3),
    ]);
    MentorReview::factory()->create([
        'rating' => 5,
        'is_published' => true,
    ]);

    return [$admin, $student, $application];
}

test('the reports page is built from platform aggregates', function () {
    [$admin] = adminReportsDataset();

    $this->actingAs($admin)
        ->get('/admin-reports')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin-reports')
            ->where('stats.activeUsers.value', 1)
            ->where('stats.completion.value', 80)
            ->where('stats.satisfaction.value', 100)
            ->where('stats.satisfaction.responses', 1)
            ->has('series', 6)
            ->has('destinations', 1)
            ->where('destinations.0.country', 'United Kingdom')
            ->where('destinations.0.count', 1)
            ->where('destinations.0.percent', 100)
            ->has('exports', 0));
});

test('admins can generate and download a platform export', function () {
    Storage::fake('local');

    [$admin] = adminReportsDataset();

    $this->actingAs($admin)
        ->post('/admin-reports/export')
        ->assertRedirect();

    $export = ReportExport::query()->latest('id')->first();

    expect($export)->not->toBeNull()
        ->and($export->status)->toBe(ReportExportStatus::Completed)
        ->and($export->rows)->toBeGreaterThan(0)
        ->and($export->path)->not->toBeNull();

    Storage::disk('local')->assertExists((string) $export->path);

    $response = $this->actingAs($admin)
        ->get("/admin-reports/exports/{$export->id}/download")
        ->assertOk();

    expect($response->headers->get('content-disposition'))
        ->toContain('scholarax-platform-report.csv');

    $this->actingAs($admin)
        ->get('/admin-reports')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->has('exports', 1));
});

test('incomplete exports cannot be downloaded', function () {
    Storage::fake('local');

    $admin = User::factory()->admin()->create();
    $export = ReportExport::factory()->create([
        'user_id' => $admin->id,
        'status' => ReportExportStatus::Pending,
        'path' => null,
    ]);

    $this->actingAs($admin)
        ->get("/admin-reports/exports/{$export->id}/download")
        ->assertForbidden();
});
