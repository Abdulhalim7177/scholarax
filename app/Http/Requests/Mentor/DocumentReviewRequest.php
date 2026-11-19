<?php

namespace App\Http\Requests\Mentor;

use App\Enums\UserRole;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class DocumentReviewRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return in_array($this->user()?->role, [UserRole::Mentor, UserRole::Admin], true);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'action' => ['required', Rule::in(['start', 'complete'])],
            'feedback' => ['required_if:action,complete', 'nullable', 'string', 'max:5000'],
            'decision' => ['nullable', Rule::in(['approve', 'request_changes'])],
        ];
    }
}
