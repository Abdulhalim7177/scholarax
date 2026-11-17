<?php

namespace App\Http\Requests\Admin;

use App\Enums\FundingType;
use App\Enums\ScholarshipStatus;
use App\Enums\UserRole;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ScholarshipRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->role === UserRole::Admin;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'provider' => ['required', 'string', 'max:255'],
            'summary' => ['nullable', 'string', 'max:500'],
            'description' => ['required', 'string'],
            'host_country_id' => ['nullable', 'integer', 'exists:countries,id'],
            'funding_type' => ['required', Rule::enum(FundingType::class)],
            'deadline_at' => ['required', 'date'],
            'application_url' => ['nullable', 'url', 'max:2048'],
            'eligibility' => ['nullable', 'string'],
            'required_documents' => ['nullable', 'array'],
            'required_documents.*' => ['string', 'max:255'],
            'status' => ['required', Rule::enum(ScholarshipStatus::class)],
            'is_featured' => ['boolean'],
            'study_level_ids' => ['required', 'array', 'min:1'],
            'study_level_ids.*' => ['integer', 'exists:study_levels,id'],
            'field_of_study_ids' => ['required', 'array', 'min:1'],
            'field_of_study_ids.*' => ['integer', 'exists:fields_of_study,id'],
            'eligible_country_ids' => ['nullable', 'array'],
            'eligible_country_ids.*' => ['integer', 'exists:countries,id'],
        ];
    }
}
