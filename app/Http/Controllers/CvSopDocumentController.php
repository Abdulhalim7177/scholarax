<?php

namespace App\Http\Controllers;

use App\Enums\ApplicationDocumentStatus;
use App\Enums\ApplicationDocumentType;
use App\Enums\BuilderTemplateType;
use App\Http\Requests\Student\BuilderAttachmentRequest;
use App\Http\Requests\Student\BuilderDocumentRequest;
use App\Models\Application;
use App\Models\ApplicationDocument;
use App\Models\BuilderTemplate;
use App\Models\CvSopDocument;
use App\Support\ActivityLogger;
use App\Support\BuilderData;
use Carbon\CarbonImmutable;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class CvSopDocumentController extends Controller
{
    /**
     * Persist the document, its sections, or an autosaved draft.
     */
    public function update(
        BuilderDocumentRequest $request,
        CvSopDocument $document,
    ): JsonResponse|RedirectResponse {
        Gate::authorize('update', $document);

        $data = $request->validated();
        $autosave = $request->boolean('autosave');

        DB::transaction(function () use ($document, $data): void {
            $document->fill(Arr::only($data, ['title', 'headline', 'summary']));

            if (array_key_exists('builder_template_id', $data)) {
                $document->builder_template_id = $this->templateId(
                    $document,
                    $data['builder_template_id'],
                );
            }

            if (isset($data['sections'])) {
                $this->updateSections($document, $data['sections']);
            }

            $document->last_saved_at = CarbonImmutable::now();
            $document->status = $document->deriveStatus();
            $document->save();
        });

        $document->refresh()->load([
            'sections',
            'template',
            'applicationDocuments.application.scholarship',
        ]);

        if (! $autosave) {
            ActivityLogger::log(
                $request->user(),
                'builder_saved',
                sprintf('Saved your %s', $document->type->shortLabel()),
                $document->title,
                $document,
            );
        }

        if ($autosave || $request->expectsJson()) {
            return response()->json(BuilderData::document($document));
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Draft saved.')]);

        return back();
    }

    /**
     * Attach the builder document to one of the student's applications.
     */
    public function attach(
        BuilderAttachmentRequest $request,
        CvSopDocument $document,
    ): RedirectResponse {
        Gate::authorize('attach', $document);

        $application = Application::query()->findOrFail(
            (int) $request->validated('application_id'),
        );

        $type = $document->type === BuilderTemplateType::Cv
            ? ApplicationDocumentType::Cv
            : ApplicationDocumentType::Sop;

        $applicationDocument = $application->documents()
            ->where('builder_document_id', $document->id)
            ->first();

        if ($applicationDocument instanceof ApplicationDocument) {
            $applicationDocument->update([
                'type' => $type,
                'title' => $document->title,
            ]);
        } else {
            $application->documents()->create([
                'builder_document_id' => $document->id,
                'type' => $type,
                'title' => $document->title,
                'version' => 1,
                'status' => ApplicationDocumentStatus::Draft,
            ]);
        }

        $application->recalculateProgress();

        ActivityLogger::log(
            $request->user(),
            'builder_attached',
            'Attached a builder document',
            $document->title,
            $application,
        );

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Document attached to your application.'),
        ]);

        return back();
    }

    /**
     * Detach the builder document from an application.
     */
    public function detach(
        Request $request,
        CvSopDocument $document,
        Application $application,
    ): RedirectResponse {
        Gate::authorize('attach', $document);

        abort_unless($application->student_id === $request->user()->id, 403);

        $applicationDocument = $application->documents()
            ->where('builder_document_id', $document->id)
            ->first();

        if ($applicationDocument instanceof ApplicationDocument) {
            if ($applicationDocument->hasFile()) {
                $applicationDocument->builder_document_id = null;
                $applicationDocument->save();
            } else {
                $applicationDocument->delete();
            }

            $application->recalculateProgress();
        }

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Document detached from your application.'),
        ]);

        return back();
    }

    /**
     * Resolve and validate the template id for the document type.
     */
    private function templateId(CvSopDocument $document, mixed $templateId): ?int
    {
        if ($templateId === null) {
            return null;
        }

        $template = BuilderTemplate::query()->findOrFail((int) $templateId);

        if ($template->type !== $document->type) {
            throw ValidationException::withMessages([
                'builder_template_id' => __('Choose a template for this document type.'),
            ]);
        }

        return $template->id;
    }

    /**
     * Persist editable section content for the document.
     *
     * @param  array<int, array{id: int|string, content: string|null}>  $sections
     */
    private function updateSections(CvSopDocument $document, array $sections): void
    {
        $owned = $document->sections()->get()->keyBy('id');

        foreach ($sections as $row) {
            $section = $owned->get((int) $row['id']);

            if ($section === null) {
                throw ValidationException::withMessages([
                    'sections' => __('One of the sections does not belong to this document.'),
                ]);
            }

            $content = trim((string) ($row['content'] ?? '')) === ''
                ? null
                : (string) $row['content'];

            $section->content = $content;
            $section->completed_at = $content === null
                ? null
                : ($section->completed_at ?? CarbonImmutable::now());
            $section->save();
        }
    }
}
