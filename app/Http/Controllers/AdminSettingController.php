<?php

namespace App\Http\Controllers;

use App\Http\Requests\Admin\PlatformSettingsRequest;
use App\Models\PlatformSetting;
use App\Support\PlatformSettings;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AdminSettingController extends Controller
{
    /**
     * Display the platform settings form.
     */
    public function edit(): Response
    {
        $values = PlatformSettings::all();
        $updatedAt = PlatformSetting::query()->latest('updated_at')->value('updated_at');

        return Inertia::render('admin-settings', [
            'settings' => [
                'require_mentor_verification' => filter_var($values['require_mentor_verification'], FILTER_VALIDATE_BOOL),
                'review_new_scholarships' => filter_var($values['review_new_scholarships'], FILTER_VALIDATE_BOOL),
                'report_notifications' => filter_var($values['report_notifications'], FILTER_VALIDATE_BOOL),
                'weekly_platform_digest' => filter_var($values['weekly_platform_digest'], FILTER_VALIDATE_BOOL),
                'default_timezone' => $values['default_timezone'],
                'application_data_retention_months' => (int) $values['application_data_retention_months'],
            ],
            'options' => [
                'timezones' => [
                    ['value' => 'Europe/London', 'label' => 'UTC +00:00 · London'],
                    ['value' => 'UTC', 'label' => 'UTC · Coordinated Universal Time'],
                    ['value' => 'Africa/Lagos', 'label' => 'UTC +01:00 · Lagos'],
                    ['value' => 'America/New_York', 'label' => 'UTC −05:00 · New York'],
                    ['value' => 'Asia/Singapore', 'label' => 'UTC +08:00 · Singapore'],
                ],
                'retention' => [
                    ['value' => '12', 'label' => '12 months'],
                    ['value' => '24', 'label' => '24 months'],
                    ['value' => '36', 'label' => '36 months'],
                ],
            ],
            'updatedAt' => $updatedAt === null ? null : (string) $updatedAt,
        ]);
    }

    /**
     * Persist platform settings.
     */
    public function update(PlatformSettingsRequest $request): RedirectResponse
    {
        PlatformSettings::setMany($request->validated(), $request->user()->id);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Platform settings saved.'),
        ]);

        return to_route('admin-settings.edit');
    }
}
