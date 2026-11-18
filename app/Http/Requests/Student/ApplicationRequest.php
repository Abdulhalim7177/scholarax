<?php

namespace App\Http\Requests\Student;

use App\Enums\ApplicationStatus;
use App\Enums\ScholarshipStatus;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ApplicationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        if ($this->isMethod('post')) {
            return [
                'scholarship_id' => [
                    'required',
                    'integer',
                    Rule::exists('scholarships', 'id')
                        ->where('status', ScholarshipStatus::Live->value)
                        ->whereNull('deleted_at'),
                ],
                'deadline_at' => ['nullable', 'date'],
                'create_default_tasks' => ['boolean'],
            ];
        }

        return [
            'status' => ['sometimes', 'required', Rule::enum(ApplicationStatus::class)],
            'next_step' => ['nullable', 'string', 'max:255'],
            'deadline_at' => ['nullable', 'date'],
            'note' => ['nullable', 'string', 'max:255'],
        ];
    }
}
