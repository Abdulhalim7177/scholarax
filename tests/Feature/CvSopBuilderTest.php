<?php

use App\Enums\ApplicationDocumentType;
use App\Enums\BuilderTemplateType;
use App\Models\Application;
use App\Models\ApplicationDocument;
use App\Models\BuilderTemplate;
use App\Models\CvSopDocument;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

/**
 * Create a builder template of the given type.
 *
 * @param  array<string, mixed>  $attributes
 */
function builderTestTemplate(BuilderTemplateType $type, array $attributes = []): BuilderTemplate
{
    $factory = BuilderTemplate::factory();

    if ($type === BuilderTemplateType::Sop) {
        $factory = $factory->sop();
    }

    return $factory->create($attributes);
}

/**
 * Create a document with sections matching its template.
 *
 * @param  array<string, mixed>  $attributes
 */
function builderTestDocument(
    User $student,
    BuilderTemplate $template,
    array $attributes = [],
): CvSopDocument {
    $document = CvSopDocument::factory()->create([
        'user_id' => $student->id,
        'type' => $template->type,
        'builder_template_id' => $template->id,
        ...$attributes,
    ]);

    foreach ($template->sectionDefinitions() as $index => $definition) {
        $document->sections()->create([
            'key' => $definition['key'],
            'title' => $definition['title'],
            'sort_order' => $index,
        ]);
    }

    return $document->load('sections');
}

/**
 * Create an application for the given student.
 *
 * @param  array<string, mixed>  $attributes
 */
function builderTestApplication(User $student, array $attributes = []): Application
{
    return Application::factory()->create([
        'student_id' => $student->id,
        ...$attributes,
    ]);
}

test('guests cannot view the builder', function () {
    $this->get(route('cv-sop-builder'))->assertRedirect(route('login'));
});

test('the builder page creates a CV and statement draft for the user', function () {
    $student = User::factory()->create();
    $cvTemplate = builderTestTemplate(BuilderTemplateType::Cv, [
        'is_recommended' => true,
    ]);
    $sopTemplate = builderTestTemplate(BuilderTemplateType::Sop);

    $this->actingAs($student)
        ->get(route('cv-sop-builder'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('cv-sop-builder')
            ->where('documents.cv.type', 'cv')
            ->where('documents.cv.templateId', $cvTemplate->id)
            ->has('documents.cv.sections', 4)
            ->where('documents.sop.type', 'sop')
            ->where('documents.sop.templateId', $sopTemplate->id)
            ->has('documents.sop.sections', 4)
            ->has('templates', 2)
            ->has('applications', 0));

    $this->assertDatabaseHas('cv_sop_documents', [
        'user_id' => $student->id,
        'type' => 'cv',
    ]);

    $this->assertDatabaseHas('cv_sop_documents', [
        'user_id' => $student->id,
        'type' => 'sop',
    ]);

    $this->assertDatabaseCount('cv_sop_sections', 8);
});

test('the builder loads existing documents without duplicating them', function () {
    $student = User::factory()->create();
    $template = builderTestTemplate(BuilderTemplateType::Cv);
    $document = builderTestDocument($student, $template, [
        'title' => 'Senior policy CV',
    ]);

    $this->actingAs($student)
        ->get(route('cv-sop-builder'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('documents.cv.id', $document->id)
            ->where('documents.cv.title', 'Senior policy CV')
            ->has('documents.cv.sections', 4));

    $this->assertDatabaseCount('cv_sop_documents', 2);
});

test('a student can save their document and section content', function () {
    $student = User::factory()->create();
    $template = builderTestTemplate(BuilderTemplateType::Cv);
    $document = builderTestDocument($student, $template);

    $this->actingAs($student)
        ->patch(route('builder-documents.update', $document), [
            'headline' => 'Future education policymaker',
            'summary' => 'I build literacy programmes across West Africa.',
            'sections' => [
                ['id' => $document->sections[0]->id, 'content' => 'A profile summary.'],
            ],
        ])
        ->assertRedirect();

    $document->refresh();

    expect($document->headline)->toBe('Future education policymaker');
    expect($document->last_saved_at)->not->toBeNull();
    expect($document->status->value)->toBe('in_progress');
    expect($document->sections[0]->content)->toBe('A profile summary.');
    expect($document->sections[0]->completed_at)->not->toBeNull();

    $this->assertDatabaseHas('activity_events', [
        'user_id' => $student->id,
        'type' => 'builder_saved',
    ]);
});

test('a document becomes complete when every field is filled', function () {
    $student = User::factory()->create();
    $template = builderTestTemplate(BuilderTemplateType::Sop);
    $document = builderTestDocument($student, $template);

    $this->actingAs($student)
        ->patch(route('builder-documents.update', $document), [
            'headline' => 'Why education access matters',
            'summary' => 'A personal statement overview.',
            'sections' => $document->sections
                ->map(fn ($section) => [
                    'id' => $section->id,
                    'content' => 'Content for '.$section->title,
                ])
                ->values()
                ->all(),
        ])
        ->assertRedirect();

    expect($document->refresh()->status->value)->toBe('complete');
});

test('autosave returns the refreshed document payload as JSON', function () {
    $student = User::factory()->create();
    $template = builderTestTemplate(BuilderTemplateType::Cv);
    $document = builderTestDocument($student, $template);

    $this->actingAs($student)
        ->patchJson(route('builder-documents.update', $document), [
            'headline' => 'Autosaved headline',
            'sections' => [
                ['id' => $document->sections[0]->id, 'content' => 'Autosaved content'],
            ],
            'autosave' => true,
        ])
        ->assertOk()
        ->assertJsonPath('headline', 'Autosaved headline')
        ->assertJsonPath('status', 'in_progress')
        ->assertJsonStructure(['id', 'lastSavedAt', 'sections']);

    $this->assertDatabaseHas('cv_sop_sections', [
        'id' => $document->sections[0]->id,
        'content' => 'Autosaved content',
    ]);

    $this->assertDatabaseMissing('activity_events', [
        'type' => 'builder_saved',
        'subject_id' => $document->id,
    ]);
});

test('a student cannot update another students document', function () {
    $owner = User::factory()->create();
    $other = User::factory()->create();
    $template = builderTestTemplate(BuilderTemplateType::Cv);
    $document = builderTestDocument($owner, $template);

    $this->actingAs($other)
        ->patch(route('builder-documents.update', $document), [
            'headline' => 'Hijacked headline',
        ])
        ->assertForbidden();

    expect($document->refresh()->headline)->toBeNull();
});

test('a document only accepts a template of its own type', function () {
    $student = User::factory()->create();
    $cvTemplate = builderTestTemplate(BuilderTemplateType::Cv);
    $sopTemplate = builderTestTemplate(BuilderTemplateType::Sop);
    $document = builderTestDocument($student, $cvTemplate);

    $this->actingAs($student)
        ->patch(route('builder-documents.update', $document), [
            'builder_template_id' => $sopTemplate->id,
        ])
        ->assertSessionHasErrors('builder_template_id');

    expect($document->refresh()->builder_template_id)->toBe($cvTemplate->id);
});

test('a document rejects sections that belong to another document', function () {
    $student = User::factory()->create();
    $template = builderTestTemplate(BuilderTemplateType::Cv);
    $document = builderTestDocument($student, $template);
    $otherDocument = builderTestDocument(User::factory()->create(), $template);

    $this->actingAs($student)
        ->patch(route('builder-documents.update', $document), [
            'sections' => [
                ['id' => $otherDocument->sections[0]->id, 'content' => 'Wrong document'],
            ],
        ])
        ->assertSessionHasErrors('sections');
});

test('a student can attach a builder document to an application', function () {
    $student = User::factory()->create();
    $template = builderTestTemplate(BuilderTemplateType::Cv);
    $document = builderTestDocument($student, $template, [
        'title' => 'Policy CV',
    ]);
    $application = builderTestApplication($student);

    $this->actingAs($student)
        ->post(route('builder-documents.attach', $document), [
            'application_id' => $application->id,
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('application_documents', [
        'application_id' => $application->id,
        'builder_document_id' => $document->id,
        'type' => ApplicationDocumentType::Cv->value,
        'title' => 'Policy CV',
    ]);

    $this->assertDatabaseHas('activity_events', [
        'user_id' => $student->id,
        'type' => 'builder_attached',
    ]);
});

test('attaching the same document twice does not duplicate the application document', function () {
    $student = User::factory()->create();
    $template = builderTestTemplate(BuilderTemplateType::Sop);
    $document = builderTestDocument($student, $template);
    $application = builderTestApplication($student);

    $this->actingAs($student)
        ->post(route('builder-documents.attach', $document), [
            'application_id' => $application->id,
        ])
        ->assertRedirect();

    $this->actingAs($student)
        ->post(route('builder-documents.attach', $document), [
            'application_id' => $application->id,
        ])
        ->assertRedirect();

    $this->assertDatabaseCount('application_documents', 1);
});

test('a student cannot attach a document to another students application', function () {
    $student = User::factory()->create();
    $other = User::factory()->create();
    $template = builderTestTemplate(BuilderTemplateType::Cv);
    $document = builderTestDocument($student, $template);
    $application = builderTestApplication($other);

    $this->actingAs($student)
        ->post(route('builder-documents.attach', $document), [
            'application_id' => $application->id,
        ])
        ->assertSessionHasErrors('application_id');

    $this->assertDatabaseCount('application_documents', 0);
});

test('detaching removes a builder document created without a file', function () {
    $student = User::factory()->create();
    $template = builderTestTemplate(BuilderTemplateType::Cv);
    $document = builderTestDocument($student, $template);
    $application = builderTestApplication($student);

    $applicationDocument = ApplicationDocument::factory()->create([
        'application_id' => $application->id,
        'builder_document_id' => $document->id,
        'type' => ApplicationDocumentType::Cv,
        'file_path' => null,
    ]);

    $this->actingAs($student)
        ->delete(route('builder-documents.detach', [
            'document' => $document,
            'application' => $application,
        ]))
        ->assertRedirect();

    $this->assertDatabaseMissing('application_documents', [
        'id' => $applicationDocument->id,
    ]);
});

test('detaching keeps a file-backed application document and only removes the link', function () {
    Storage::fake('local');

    $student = User::factory()->create();
    $template = builderTestTemplate(BuilderTemplateType::Cv);
    $document = builderTestDocument($student, $template);
    $application = builderTestApplication($student);

    $applicationDocument = ApplicationDocument::factory()->create([
        'application_id' => $application->id,
        'builder_document_id' => $document->id,
        'type' => ApplicationDocumentType::Cv,
        'file_path' => 'application-documents/'.$application->id.'/cv.pdf',
        'original_name' => 'cv.pdf',
    ]);

    $this->actingAs($student)
        ->delete(route('builder-documents.detach', [
            'document' => $document,
            'application' => $application,
        ]))
        ->assertRedirect();

    $this->assertDatabaseHas('application_documents', [
        'id' => $applicationDocument->id,
        'builder_document_id' => null,
    ]);
});
