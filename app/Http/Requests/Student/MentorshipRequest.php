<?php

namespace App\Http\Requests\Student;

use App\Enums\UserRole;
use App\Enums\VerificationStatus;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MentorshipRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->role === UserRole::Student;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'mentor_profile_id' => [
                'required',
                'integer',
                Rule::exists('mentor_profiles', 'id')->where(
                    'verification_status',
                    VerificationStatus::Verified->value,
                ),
            ],
            'goals' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
