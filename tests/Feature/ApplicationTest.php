<?php

use App\Enums\ApplicationDocumentStatus;
use App\Enums\ApplicationStatus;
use App\Enums\ScholarshipStatus;
use App\Models\Application;
use App\Models\ApplicationDocument;
use App\Models\ApplicationTask;
use App\Models\Scholarship;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

/**
 * Create a scholarship with predictable required documents for application tests.
 *
 * @param  array<string, mixed>  $attributes
 */
function applicationTestScholarship(array $attributes = []): Scholarship
{
    return Scholarship::factory()->create([
        'required_documents' => ['Curriculum vitae', 'Statement of purpose'],
        ...$attributes,
    ]);
}

/**
 * Create an application for the given student and scholarship.
 *
 * @param  array<string, mixed>  $attributes
 */
function applicationTestRecord(User $student, Scholarship $scholarship, array $attributes = []): Application
{
    return Application::factory()->create([
        'student_id' => $student->id,
        'scholarship_id' => $scholarship->id,
        ...$attributes,
    ]);
}

test('guests cannot view applications', function () {
    $this->get(route('applications.index'))->assertRedirect(route('login'));
});

test('the application index only lists the current user applications', function () {
    $student = User::factory()->create();
    $other = User::factory()->create();
    $scholarship = applicationTestScholarship();

    $own = applicationTestRecord($student, $scholarship);
    applicationTestRecord($other, applicationTestScholarship());

    $this->actingAs($student)
        ->get(route('applications.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('applications')
            ->has('applications.data', 1)
            ->where('applications.data.0.id', $own->id)
            ->where('applications.data.0.scholarship.title', $scholarship->title)
            ->where('stats.total', 1)
            ->where('filters.status', '')
            ->has('statuses')
            ->has('summary.checklist'));
});

test('the application index filters by status and search term', function () {
    $student = User::factory()->create();

    $draft = applicationTestRecord(
        $student,
        applicationTestScholarship(['title' => 'Chevening Scholarships']),
    );

    applicationTestRecord(
        $student,
        applicationTestScholarship(['title' => 'DAAD Masters']),
        ['status' => ApplicationStatus::InReview],
    );

    $this->actingAs($student)
        ->get(route('applications.index', ['status' => 'draft']))
        ->assertInertia(fn (Assert $page) => $page
            ->has('applications.data', 1)
            ->where('applications.data.0.id', $draft->id));

    $this->actingAs($student)
        ->get(route('applications.index', ['q' => 'DAAD']))
        ->assertInertia(fn (Assert $page) => $page
            ->has('applications.data', 1)
            ->where('applications.data.0.scholarship.title', 'DAAD Masters'));
});

test('a student can start an application with generated tasks', function () {
    $student = User::factory()->create();
    $scholarship = applicationTestScholarship();

    $this->actingAs($student)
        ->post(route('applications.store'), [
            'scholarship_id' => $scholarship->id,
            'create_default_tasks' => true,
        ])
        ->assertRedirect();

    $application = Application::query()->firstOrFail();

    expect($application->student_id)->toBe($student->id)
        ->and($application->scholarship_id)->toBe($scholarship->id)
        ->and($application->status)->toBe(ApplicationStatus::Draft)
        ->and($application->progress)->toBe(0)
        ->and($application->tasks()->orderBy('sort_order')->pluck('title')->all())
        ->toBe(['Curriculum vitae', 'Statement of purpose']);

    $this->assertDatabaseHas('application_status_histories', [
        'application_id' => $application->id,
        'to_status' => ApplicationStatus::Draft->value,
        'changed_by' => $student->id,
    ]);

    $this->assertDatabaseHas('activity_events', [
        'user_id' => $student->id,
        'type' => 'application_created',
        'subject_id' => $application->id,
    ]);
});

test('a student cannot apply for the same scholarship twice', function () {
    $student = User::factory()->create();
    $scholarship = applicationTestScholarship();

    applicationTestRecord($student, $scholarship);

    $this->actingAs($student)
        ->post(route('applications.store'), [
            'scholarship_id' => $scholarship->id,
        ])
        ->assertSessionHasErrors('scholarship_id');

    expect(Application::query()->count())->toBe(1);
});

test('a student cannot start an application for a scholarship that is not live', function () {
    $student = User::factory()->create();
    $scholarship = applicationTestScholarship([
        'status' => ScholarshipStatus::Draft,
    ]);

    $this->actingAs($student)
        ->post(route('applications.store'), [
            'scholarship_id' => $scholarship->id,
        ])
        ->assertSessionHasErrors('scholarship_id');

    expect(Application::query()->count())->toBe(0);
});

test('the application detail page exposes tasks, documents, and history', function () {
    $student = User::factory()->create();
    $application = applicationTestRecord(
        $student,
        applicationTestScholarship(),
    );

    $application->tasks()->create([
        'title' => 'Prepare CV',
        'due_at' => now()->addDays(5),
    ]);

    $application->documents()->create([
        'type' => 'cv',
        'title' => 'Curriculum vitae',
        'status' => ApplicationDocumentStatus::Draft,
    ]);

    $application->statusHistories()->create([
        'from_status' => null,
        'to_status' => ApplicationStatus::Draft,
        'changed_by' => $student->id,
    ]);

    $this->actingAs($student)
        ->get(route('applications.show', $application))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('application-detail')
            ->where('application.id', $application->id)
            ->has('application.tasks', 1)
            ->has('application.documents', 1)
            ->has('application.history', 1)
            ->where('application.taskSummary.total', 1)
            ->where('application.taskSummary.completed', 0)
            ->has('statuses')
            ->has('documentTypes')
            ->has('documentStatuses'));
});

test('a student cannot view another students application', function () {
    $owner = User::factory()->create();
    $intruder = User::factory()->create();
    $application = applicationTestRecord(
        $owner,
        applicationTestScholarship(),
    );

    $this->actingAs($intruder)
        ->get(route('applications.show', $application))
        ->assertForbidden();
});

test('updating the application status records history and completes progress', function () {
    $student = User::factory()->create();
    $application = applicationTestRecord(
        $student,
        applicationTestScholarship(),
    );

    $this->actingAs($student)
        ->patch(route('applications.update', $application), [
            'status' => ApplicationStatus::Submitted->value,
            'next_step' => 'Wait for the panel decision',
            'note' => 'Submitted all documents.',
        ])
        ->assertRedirect();

    $application->refresh();

    expect($application->status)->toBe(ApplicationStatus::Submitted)
        ->and($application->progress)->toBe(100)
        ->and($application->submitted_at)->not->toBeNull()
        ->and($application->next_step)->toBe('Wait for the panel decision');

    $this->assertDatabaseHas('application_status_histories', [
        'application_id' => $application->id,
        'from_status' => ApplicationStatus::Draft->value,
        'to_status' => ApplicationStatus::Submitted->value,
        'note' => 'Submitted all documents.',
    ]);

    $this->assertDatabaseHas('activity_events', [
        'user_id' => $student->id,
        'type' => 'status_changed',
        'subject_id' => $application->id,
    ]);
});

test('completing tasks recalculates application progress', function () {
    $student = User::factory()->create();
    $application = applicationTestRecord(
        $student,
        applicationTestScholarship(),
    );

    $first = $application->tasks()->create([
        'title' => 'Task one',
        'sort_order' => 0,
    ]);

    $application->tasks()->create([
        'title' => 'Task two',
        'sort_order' => 1,
    ]);

    $this->actingAs($student)
        ->patch(route('application-tasks.update', [$application, $first]), [
            'completed' => true,
        ])
        ->assertRedirect();

    expect($application->refresh()->progress)->toBe(50)
        ->and($first->refresh()->completed_at)->not->toBeNull();

    $this->assertDatabaseHas('activity_events', [
        'user_id' => $student->id,
        'type' => 'task_completed',
    ]);
});

test('a student cannot update tasks on another students application', function () {
    $owner = User::factory()->create();
    $intruder = User::factory()->create();
    $application = applicationTestRecord(
        $owner,
        applicationTestScholarship(),
    );
    $task = $application->tasks()->create(['title' => 'Private task']);

    $this->actingAs($intruder)
        ->patch(route('application-tasks.update', [$application, $task]), [
            'completed' => true,
        ])
        ->assertForbidden();

    expect($task->refresh()->completed_at)->toBeNull();
});

test('a student can add and remove a task', function () {
    $student = User::factory()->create();
    $application = applicationTestRecord(
        $student,
        applicationTestScholarship(),
    );

    $this->actingAs($student)
        ->post(route('application-tasks.store', $application), [
            'title' => 'Book a test date',
            'due_at' => now()->addWeek()->toDateString(),
        ])
        ->assertRedirect();

    $task = ApplicationTask::query()->firstOrFail();

    expect($task->title)->toBe('Book a test date')
        ->and($task->application_id)->toBe($application->id);

    $this->actingAs($student)
        ->delete(route('application-tasks.destroy', [$application, $task]))
        ->assertRedirect();

    $this->assertDatabaseMissing('application_tasks', ['id' => $task->id]);
});

test('a student can upload, update, download, and delete a document', function () {
    Storage::fake('local');

    $student = User::factory()->create();
    $application = applicationTestRecord(
        $student,
        applicationTestScholarship(),
    );

    $this->actingAs($student)
        ->post(route('application-documents.store', $application), [
            'type' => 'cv',
            'title' => 'Curriculum vitae',
            'file' => UploadedFile::fake()->create('cv.pdf', 120, 'application/pdf'),
        ])
        ->assertRedirect();

    $document = ApplicationDocument::query()->firstOrFail();

    expect($document->application_id)->toBe($application->id)
        ->and($document->hasFile())->toBeTrue();

    Storage::disk('local')->assertExists($document->file_path);

    $this->actingAs($student)
        ->patch(route('application-documents.update', [$application, $document]), [
            'status' => ApplicationDocumentStatus::Submitted->value,
        ])
        ->assertRedirect();

    $document->refresh();

    expect($document->status)->toBe(ApplicationDocumentStatus::Submitted)
        ->and($document->submitted_at)->not->toBeNull();

    $this->actingAs($student)
        ->get(route('application-documents.download', [$application, $document]))
        ->assertOk()
        ->assertDownload('cv.pdf');

    $this->actingAs($student)
        ->delete(route('application-documents.destroy', [$application, $document]))
        ->assertRedirect();

    Storage::disk('local')->assertMissing($document->file_path);

    $this->assertDatabaseMissing('application_documents', ['id' => $document->id]);
});

test('a student cannot download another students document', function () {
    Storage::fake('local');

    $owner = User::factory()->create();
    $intruder = User::factory()->create();
    $application = applicationTestRecord(
        $owner,
        applicationTestScholarship(),
    );

    $path = UploadedFile::fake()
        ->create('cv.pdf', 20, 'application/pdf')
        ->store('application-documents/'.$application->id, 'local');

    $document = $application->documents()->create([
        'type' => 'cv',
        'title' => 'Curriculum vitae',
        'file_path' => $path,
        'original_name' => 'cv.pdf',
        'status' => ApplicationDocumentStatus::Submitted,
    ]);

    $this->actingAs($intruder)
        ->get(route('application-documents.download', [$application, $document]))
        ->assertForbidden();
});

test('the application create page excludes scholarships the student already applied to', function () {
    $student = User::factory()->create();
    $applied = applicationTestScholarship(['title' => 'Already applied']);
    $available = applicationTestScholarship(['title' => 'Still available']);

    applicationTestRecord($student, $applied);

    $this->actingAs($student)
        ->get(route('applications.create'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('application-create')
            ->has('scholarships', 1)
            ->where('scholarships.0.id', $available->id));
});

test('the application checklist reflects uploaded document types', function () {
    $student = User::factory()->create();
    $application = applicationTestRecord(
        $student,
        applicationTestScholarship(),
    );

    $application->documents()->create([
        'type' => 'cv',
        'title' => 'Curriculum vitae',
        'status' => ApplicationDocumentStatus::Submitted,
    ]);

    $this->actingAs($student)
        ->get(route('applications.index'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('summary.checklist.1.key', 'cv')
            ->where('summary.checklist.1.complete', true)
            ->where('summary.checklist.2.key', 'sop')
            ->where('summary.checklist.2.complete', false)
            ->where('summary.checklist.3.key', 'recommendation')
            ->where('summary.checklist.3.complete', false));
});
