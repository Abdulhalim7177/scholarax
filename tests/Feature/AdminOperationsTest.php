<?php

use App\Enums\ApplicationStatus;
use App\Enums\ReportReason;
use App\Enums\ReportStatus;
use App\Enums\UserRole;
use App\Enums\VerificationStatus;
use App\Models\ActivityEvent;
use App\Models\Application;
use App\Models\ContentReport;
use App\Models\MentorProfile;
use App\Models\Scholarship;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

/**
 * Create an admin for admin workspace tests.
 */
function adminOperationsAdmin(): User
{
    return User::factory()->admin()->create(['name' => 'Sarah Admin']);
}

test('the admin dashboard reports live platform aggregates', function () {
    $admin = adminOperationsAdmin();
    $student = User::factory()->create(['name' => 'Amina Yusuf']);
    $mentor = User::factory()->mentor()->create(['name' => 'Dr. Maya Chen']);
    $profile = MentorProfile::factory()->create([
        'user_id' => $mentor->id,
        'verification_status' => VerificationStatus::Pending,
    ]);
    $live = Scholarship::factory()->create();
    Scholarship::factory()->pending()->create();
    Application::factory()->create([
        'student_id' => $student->id,
        'scholarship_id' => $live->id,
        'status' => ApplicationStatus::Submitted,
        'submitted_at' => now()->subDay(),
    ]);
    ContentReport::factory()->create([
        'reporter_id' => $student->id,
        'reportable_type' => MentorProfile::class,
        'reportable_id' => $profile->id,
        'reason' => ReportReason::Spam,
        'status' => ReportStatus::Open,
    ]);

    $this->actingAs($admin)
        ->get('/admin-dashboard')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin-dashboard')
            ->where('stats.totalUsers', User::query()->count())
            ->where('stats.liveScholarships', 1)
            ->where('stats.applicationsTracked', 1)
            ->where('stats.submittedThisWeek', 1)
            ->where('moderation.items.0.count', 1)
            ->where('moderation.items.1.count', 1)
            ->where('moderation.items.2.count', 1)
            ->where('moderation.openTasks', 3)
            ->has('recentUsers', 3)
            ->has('checks', 4));
});

test('the admin user directory filters by search and role', function () {
    $admin = adminOperationsAdmin();
    User::factory()->create(['name' => 'Amina Yusuf', 'email' => 'amina@example.com']);
    User::factory()->mentor()->create(['name' => 'Dr. Maya Chen', 'email' => 'maya@example.com']);

    $this->actingAs($admin)
        ->get('/admin-users?q=Amina&role=student')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin-users')
            ->has('users.data', 1)
            ->where('users.data.0.name', 'Amina Yusuf')
            ->where('users.data.0.role', UserRole::Student->value)
            ->where('filters.q', 'Amina')
            ->where('filters.role', 'student')
            ->where('stats.total', 3));
});

test('the admin mentor directory filters by verification status', function () {
    $admin = adminOperationsAdmin();
    $verifiedUser = User::factory()->mentor()->create(['name' => 'Dr. Maya Chen']);
    MentorProfile::factory()->create([
        'user_id' => $verifiedUser->id,
        'verification_status' => VerificationStatus::Verified,
        'rating_avg' => 4.9,
    ]);
    $pendingUser = User::factory()->mentor()->create(['name' => 'James Okafor']);
    MentorProfile::factory()->create([
        'user_id' => $pendingUser->id,
        'verification_status' => VerificationStatus::Pending,
        'headline' => 'DAAD and STEM application strategist',
    ]);

    $this->actingAs($admin)
        ->get('/admin-mentors?status=pending')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin-mentors')
            ->has('mentors.data', 1)
            ->where('mentors.data.0.name', 'James Okafor')
            ->where('filters.status', 'pending')
            ->where('stats.verified', 1)
            ->where('stats.pending', 1));
});

test('the admin application monitor filters stages and flags risk', function () {
    $admin = adminOperationsAdmin();
    $student = User::factory()->create(['name' => 'Amina Yusuf']);
    $scholarship = Scholarship::factory()->create(['title' => 'Chevening Scholarships']);
    Application::factory()->create([
        'student_id' => $student->id,
        'scholarship_id' => $scholarship->id,
        'status' => ApplicationStatus::Draft,
        'progress' => 40,
        'deadline_at' => now()->addDays(5),
    ]);

    $this->actingAs($admin)
        ->get('/admin-applications?stage=draft')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin-applications')
            ->has('applications.data', 1)
            ->where('applications.data.0.learner', 'Amina Yusuf')
            ->where('applications.data.0.scholarship', 'Chevening Scholarships')
            ->where('applications.data.0.risk', 'needs_check')
            ->where('stats.tracked', 1)
            ->where('stats.needsAttention', 1));
});

test('admins can resolve and dismiss content reports', function () {
    $admin = adminOperationsAdmin();
    $reporter = User::factory()->create(['name' => 'Amina Yusuf']);
    $profile = MentorProfile::factory()->create();

    $resolved = ContentReport::factory()->create([
        'reporter_id' => $reporter->id,
        'reportable_type' => MentorProfile::class,
        'reportable_id' => $profile->id,
        'reason' => ReportReason::Misinformation,
        'status' => ReportStatus::Open,
    ]);
    $dismissed = ContentReport::factory()->create([
        'reporter_id' => $reporter->id,
        'reportable_type' => MentorProfile::class,
        'reportable_id' => $profile->id,
        'reason' => ReportReason::Spam,
        'status' => ReportStatus::Open,
    ]);

    $this->actingAs($admin)
        ->get('/admin-moderation')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin-moderation')
            ->has('reports.data', 2)
            ->where('stats.open', 2)
            ->where('filters.status', 'open'));

    $this->actingAs($admin)
        ->post("/admin-moderation/{$resolved->id}/resolve", [
            'resolution_note' => 'Asked the mentor to correct the profile.',
        ])
        ->assertRedirect();

    expect($resolved->refresh())
        ->status->toBe(ReportStatus::Resolved)
        ->resolved_by->toBe($admin->id)
        ->resolution_note->toBe('Asked the mentor to correct the profile.');

    expect(ActivityEvent::query()
        ->where('user_id', $reporter->id)
        ->where('type', 'moderation_decision')
        ->exists())->toBeTrue();

    $this->actingAs($admin)
        ->post("/admin-moderation/{$dismissed->id}/dismiss")
        ->assertRedirect();

    expect($dismissed->refresh()->status)->toBe(ReportStatus::Dismissed);
});

test('mentors cannot access admin operations', function (string $route) {
    $mentor = User::factory()->mentor()->create();

    $this->actingAs($mentor)->get($route)->assertForbidden();
})->with([
    '/admin-dashboard',
    '/admin-users',
    '/admin-mentors',
    '/admin-applications',
    '/admin-moderation',
    '/admin-reports',
    '/admin-settings',
]);
