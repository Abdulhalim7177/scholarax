<?php

namespace App\Http\Controllers;

use App\Enums\ApplicationDocumentStatus;
use App\Enums\DocumentReviewStatus;
use App\Http\Controllers\Concerns\EnsuresMentorProfile;
use App\Http\Requests\Mentor\DocumentReviewRequest;
use App\Models\DocumentReview;
use App\Support\ActivityLogger;
use App\Support\MentorWorkspaceData;
use Carbon\CarbonImmutable;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class MentorReviewQueueController extends Controller
{
    use EnsuresMentorProfile;

    /**
     * Display the mentor review queue.
     */
    public function index(Request $request): Response
    {
        $profile = $this->mentorProfileFor($request->user());
        $profile->loadMissing('user');

        return Inertia::render('mentor-review-queue', MentorWorkspaceData::reviewQueue($profile));
    }

    /**
     * Start or complete a document review.
     */
    public function update(DocumentReviewRequest $request, DocumentReview $documentReview): RedirectResponse
    {
        Gate::authorize('update', $documentReview);

        $data = $request->validated();
        $action = (string) $data['action'];

        if ($action === 'start') {
            $documentReview->update([
                'status' => DocumentReviewStatus::InReview,
            ]);

            Inertia::flash('toast', ['type' => 'success', 'message' => __('Review started.')]);

            return back();
        }

        $decision = (string) ($data['decision'] ?? 'approve');
        $document = $documentReview->applicationDocument;

        $documentReview->update([
            'status' => DocumentReviewStatus::Completed,
            'feedback' => (string) $data['feedback'],
            'reviewed_at' => CarbonImmutable::now(),
        ]);

        $document->update([
            'status' => $decision === 'request_changes'
                ? ApplicationDocumentStatus::ChangesRequested
                : ApplicationDocumentStatus::Approved,
        ]);

        ActivityLogger::log(
            $document->application->student,
            'document_reviewed',
            $decision === 'request_changes'
                ? 'Your document needs a few changes'
                : 'Your document was approved',
            $document->title,
            $document,
        );

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => $decision === 'request_changes'
                ? __('Feedback sent with change requests.')
                : __('Review completed and document approved.'),
        ]);

        return back();
    }
}
