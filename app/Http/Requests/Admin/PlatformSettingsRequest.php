<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class PlatformSettingsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->role->value === 'admin';
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'require_mentor_verification' => ['required', 'boolean'],
            'review_new_scholarships' => ['required', 'boolean'],
            'report_notifications' => ['required', 'boolean'],
            'weekly_platform_digest' => ['required', 'boolean'],
            'default_timezone' => ['required', 'string', 'in:Europe/London,UTC,Africa/Lagos,America/New_York,Asia/Singapore'],
            'application_data_retention_months' => ['required', 'integer', 'in:12,24,36'],
        ];
    }
}
