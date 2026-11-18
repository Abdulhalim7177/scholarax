<?php

namespace App\Http\Requests\Student;

use App\Enums\ApplicationDocumentStatus;
use App\Enums\ApplicationDocumentType;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ApplicationDocumentRequest extends FormRequest
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
        $fileRules = ['nullable', 'file', 'mimes:pdf,doc,docx,jpg,jpeg,png', 'max:10240'];

        if ($this->isMethod('post')) {
            return [
                'type' => ['required', Rule::enum(ApplicationDocumentType::class)],
                'title' => ['required', 'string', 'max:255'],
                'status' => ['sometimes', Rule::enum(ApplicationDocumentStatus::class)],
                'file' => $fileRules,
            ];
        }

        return [
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'status' => ['sometimes', Rule::enum(ApplicationDocumentStatus::class)],
            'file' => $fileRules,
        ];
    }
}
