<?php

namespace App\Http\Requests\Student;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BuilderDocumentRequest extends FormRequest
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
        return [
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'headline' => ['sometimes', 'nullable', 'string', 'max:255'],
            'summary' => ['sometimes', 'nullable', 'string', 'max:20000'],
            'builder_template_id' => [
                'sometimes',
                'nullable',
                'integer',
                Rule::exists('builder_templates', 'id')->where('is_active', true),
            ],
            'sections' => ['sometimes', 'array'],
            'sections.*.id' => ['required', 'integer'],
            'sections.*.content' => ['present', 'nullable', 'string', 'max:50000'],
            'autosave' => ['boolean'],
        ];
    }
}
