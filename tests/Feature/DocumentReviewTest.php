<?php

use App\Enums\ApplicationDocumentStatus;
use App\Enums\DocumentReviewPriority;
use App\Enums\DocumentReviewStatus;
use App\Models\Application;
use App\Models\ApplicationDocument;
use App\Models\DocumentReview;
use App\Models\User;

/**
 * Create a mentor, student, application document, and open review.
 *
 * @return array{0: User, 1: User, 2: ApplicationDocument, 3: DocumentReview}
 */
function documentReviewSetup(): array
{
    $mentor = User::factory()->mentor()->create(['name' => 'Dr. Maya Chen']);
    $student = User::factory()->create(['name' => 'Amina Yusuf']);

    $application = Application::factory()->create([
        'student_id' => $student->id,
    ]);
    $document = ApplicationDocument::factory()->submitted()->create([
        'application_id' => $application->id,
        'title' => 'Statement of purpose',
    ]);

    $review = DocumentReview::factory()->create([
        'application_document_id' => $document->id,
        'mentor_id' => $mentor->id,
        'status' => DocumentReviewStatus::Pending,
        'priority' => DocumentReviewPriority::High,
    ]);

    return [$mentor, $student, $document, $review];
}

test('mentors can start a document review', function () {
    [$mentor, , , $review] = documentReviewSetup();

    $this->actingAs($mentor)
        ->patch(route('mentor-review-queue.update', $review), [
            'action' => 'start',
        ])
        ->assertRedirect();

    expect($review->refresh()->status)->toBe(DocumentReviewStatus::InReview);
});

test('completing a review approves the document and notifies the student', function () {
    [$mentor, $student, $document, $review] = documentReviewSetup();

    $this->actingAs($mentor)
        ->patch(route('mentor-review-queue.update', $review), [
            'action' => 'complete',
            'decision' => 'approve',
            'feedback' => 'Clear narrative and a strong link to your policy goals.',
        ])
        ->assertRedirect();

    $review->refresh();
    $document->refresh();

    expect($review->status)->toBe(DocumentReviewStatus::Completed)
        ->and($review->feedback)->toBe('Clear narrative and a strong link to your policy goals.')
        ->and($review->reviewed_at)->not->toBeNull()
        ->and($document->status)->toBe(ApplicationDocumentStatus::Approved);

    $this->assertDatabaseHas('activity_events', [
        'user_id' => $student->id,
        'type' => 'document_reviewed',
    ]);
});

test('mentors can request changes on a document', function () {
    [$mentor, , $document, $review] = documentReviewSetup();

    $this->actingAs($mentor)
        ->patch(route('mentor-review-queue.update', $review), [
            'action' => 'complete',
            'decision' => 'request_changes',
            'feedback' => 'Please add a concrete example to the second paragraph.',
        ])
        ->assertRedirect();

    expect($document->refresh()->status)->toBe(ApplicationDocumentStatus::ChangesRequested)
        ->and($review->refresh()->status)->toBe(DocumentReviewStatus::Completed);
});

test('mentors cannot update another mentors document review', function () {
    [, , $document, $review] = documentReviewSetup();
    $intruder = User::factory()->mentor()->create();

    $this->actingAs($intruder)
        ->patch(route('mentor-review-queue.update', $review), [
            'action' => 'complete',
            'decision' => 'approve',
            'feedback' => 'Approved without reading.',
        ])
        ->assertForbidden();

    expect($review->refresh()->status)->toBe(DocumentReviewStatus::Pending)
        ->and($document->refresh()->status)->toBe(ApplicationDocumentStatus::Submitted);
});
