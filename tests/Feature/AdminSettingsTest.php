<?php

use App\Enums\VerificationStatus;
use App\Models\MentorProfile;
use App\Models\PlatformSetting;
use App\Models\User;
use App\Support\PlatformSettings;
use Inertia\Testing\AssertableInertia as Assert;

test('admins can view platform settings with defaults', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->get('/admin-settings')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin-settings')
            ->where('settings.require_mentor_verification', true)
            ->where('settings.review_new_scholarships', true)
            ->where('settings.report_notifications', true)
            ->where('settings.weekly_platform_digest', false)
            ->where('settings.default_timezone', 'Europe/London')
            ->where('settings.application_data_retention_months', 24)
            ->has('options.timezones', 5)
            ->has('options.retention', 3));
});

test('admins can persist platform settings', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->patch('/admin-settings', [
            'require_mentor_verification' => false,
            'review_new_scholarships' => true,
            'report_notifications' => false,
            'weekly_platform_digest' => true,
            'default_timezone' => 'UTC',
            'application_data_retention_months' => 36,
        ])
        ->assertRedirect(route('admin-settings.edit'));

    $settings = PlatformSettings::all();

    expect($settings['require_mentor_verification'])->toBe('0')
        ->and($settings['review_new_scholarships'])->toBe('1')
        ->and($settings['report_notifications'])->toBe('0')
        ->and($settings['weekly_platform_digest'])->toBe('1')
        ->and($settings['default_timezone'])->toBe('UTC')
        ->and($settings['application_data_retention_months'])->toBe('36');

    expect(PlatformSetting::query()->where('key', 'default_timezone')->value('updated_by'))
        ->toBe($admin->id);
});

test('platform settings reject invalid values', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->patch('/admin-settings', [
            'require_mentor_verification' => true,
            'review_new_scholarships' => true,
            'report_notifications' => true,
            'weekly_platform_digest' => false,
            'default_timezone' => 'Mars/Olympus',
            'application_data_retention_months' => 48,
        ])
        ->assertSessionHasErrors(['default_timezone', 'application_data_retention_months']);
});

test('the mentor directory respects the verification requirement setting', function () {
    $student = User::factory()->create();
    $mentor = User::factory()->mentor()->create(['name' => 'James Okafor']);
    $profile = MentorProfile::factory()->create([
        'user_id' => $mentor->id,
        'verification_status' => VerificationStatus::Pending,
    ]);

    $this->actingAs($student)
        ->get('/mentors')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->has('mentors.data', 0));

    $this->actingAs($student)->get("/mentors/{$profile->id}")->assertForbidden();

    PlatformSetting::query()->create([
        'key' => 'require_mentor_verification',
        'value' => '0',
    ]);

    $this->actingAs($student)
        ->get('/mentors')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('mentors.data', 1)
            ->where('mentors.data.0.name', 'James Okafor'));

    $this->actingAs($student)->get("/mentors/{$profile->id}")->assertOk();
});
