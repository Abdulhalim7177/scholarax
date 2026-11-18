<?php

namespace App\Http\Controllers;

use App\Enums\ApplicationDocumentStatus;
use App\Http\Requests\Student\ApplicationDocumentRequest;
use App\Models\Application;
use App\Models\ApplicationDocument;
use App\Support\ActivityLogger;
use Carbon\CarbonImmutable;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ApplicationDocumentController extends Controller
{
    /**
     * Add a document to an application.
     */
    public function store(
        ApplicationDocumentRequest $request,
        Application $application,
    ): RedirectResponse {
        Gate::authorize('create', [ApplicationDocument::class, $application]);

        $data = $request->validated();
        $file = $request->file('file');
        $status = ApplicationDocumentStatus::from((string) ($data['status'] ?? ApplicationDocumentStatus::Draft->value));
        $path = $file?->store('application-documents/'.$application->id, 'local');

        abort_if($path === false, 500, 'Unable to store the document.');

        $document = $application->documents()->create([
            'type' => $data['type'],
            'title' => (string) $data['title'],
            'version' => 1,
            'file_path' => $path,
            'original_name' => $file?->getClientOriginalName(),
            'status' => $status,
            'submitted_at' => $status->isComplete() ? CarbonImmutable::now() : null,
        ]);

        $application->recalculateProgress();

        ActivityLogger::log(
            $request->user(),
            'document_added',
            'Added an application document',
            $document->title,
            $application,
        );

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Document added.')]);

        return back();
    }

    /**
     * Update a document's metadata, status, or file.
     */
    public function update(
        ApplicationDocumentRequest $request,
        Application $application,
        ApplicationDocument $document,
    ): RedirectResponse {
        Gate::authorize('update', $document);
        $this->ensureBelongsToApplication($document, $application);

        $data = $request->validated();

        if (array_key_exists('title', $data)) {
            $document->title = (string) $data['title'];
        }

        if (array_key_exists('status', $data)) {
            $status = ApplicationDocumentStatus::from((string) $data['status']);
            $document->status = $status;
            $document->submitted_at = $status->isComplete()
                ? ($document->submitted_at ?? CarbonImmutable::now())
                : null;
        }

        $file = $request->file('file');

        if ($file !== null) {
            if ($document->file_path !== null) {
                Storage::disk('local')->delete($document->file_path);
            }

            $path = $file->store('application-documents/'.$application->id, 'local');

            abort_if($path === false, 500, 'Unable to store the document.');

            $document->file_path = $path;
            $document->original_name = $file->getClientOriginalName();
            $document->version++;
        }

        $document->save();
        $application->recalculateProgress();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Document updated.')]);

        return back();
    }

    /**
     * Remove a document from an application.
     */
    public function destroy(
        Request $request,
        Application $application,
        ApplicationDocument $document,
    ): RedirectResponse {
        Gate::authorize('delete', $document);
        $this->ensureBelongsToApplication($document, $application);

        if ($document->file_path !== null) {
            Storage::disk('local')->delete($document->file_path);
        }

        $document->delete();
        $application->recalculateProgress();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Document removed.')]);

        return back();
    }

    /**
     * Download a stored application document.
     */
    public function download(
        Application $application,
        ApplicationDocument $document,
    ): StreamedResponse {
        Gate::authorize('view', $document);
        $this->ensureBelongsToApplication($document, $application);

        abort_unless(
            $document->file_path !== null && Storage::disk('local')->exists($document->file_path),
            404,
        );

        return Storage::disk('local')->download($document->file_path, $document->original_name);
    }

    /**
     * Ensure the document belongs to the given application.
     */
    private function ensureBelongsToApplication(ApplicationDocument $document, Application $application): void
    {
        abort_unless($document->application_id === $application->id, 404);
    }
}
