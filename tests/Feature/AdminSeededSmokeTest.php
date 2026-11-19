<?php

use App\Models\ReportExport;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Support\Facades\Storage;

test('seeded admin pages render with demo data', function () {
    Storage::fake('local');
    $this->seed(DatabaseSeeder::class);

    $admin = User::query()->where('email', 'admin@scholarly.test')->firstOrFail();

    foreach ([
        '/admin-dashboard',
        '/admin-users',
        '/admin-users?role=mentor&q=maya',
        '/admin-mentors',
        '/admin-mentors?status=pending',
        '/admin-applications',
        '/admin-applications?stage=draft',
        '/admin-moderation',
        '/admin-moderation?status=resolved',
        '/admin-reports',
        '/admin-settings',
    ] as $route) {
        $this->actingAs($admin)->get($route)->assertOk();
    }

    $this->actingAs($admin)->post('/admin-reports/export')->assertRedirect();

    $export = ReportExport::query()->latest('id')->firstOrFail();
    Storage::disk('local')->assertExists((string) $export->path);

    $this->actingAs($admin)
        ->get("/admin-reports/exports/{$export->id}/download")
        ->assertOk();
});
