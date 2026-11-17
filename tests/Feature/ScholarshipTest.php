<?php

use App\Enums\FundingType;
use App\Enums\ScholarshipStatus;
use App\Models\Country;
use App\Models\FieldOfStudy;
use App\Models\Scholarship;
use App\Models\StudyLevel;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

/**
 * Create a country with a stable ISO code for scholarship tests.
 */
function testCountry(string $name, string $iso2): Country
{
    return Country::query()->firstOrCreate(
        ['iso2' => $iso2],
        ['name' => $name, 'iso3' => null],
    );
}

/**
 * Create a study level with a stable slug for scholarship tests.
 */
function testStudyLevel(string $slug): StudyLevel
{
    $names = [
        'bachelors' => "Bachelor's",
        'masters' => "Master's",
        'phd' => 'PhD',
    ];

    return StudyLevel::query()->firstOrCreate(
        ['slug' => $slug],
        ['name' => $names[$slug] ?? ucfirst($slug), 'sort_order' => 0],
    );
}

/**
 * Create a field of study with a stable slug for scholarship tests.
 */
function testFieldOfStudy(string $slug): FieldOfStudy
{
    $names = [
        'all-fields' => 'All fields',
        'multiple-fields' => 'Multiple fields',
        'public-policy' => 'Public policy',
        'engineering' => 'Engineering',
    ];

    return FieldOfStudy::query()->firstOrCreate(
        ['slug' => $slug],
        ['name' => $names[$slug] ?? ucfirst($slug), 'sort_order' => 0],
    );
}

/**
 * Create a scholarship with the given relationships for tests.
 *
 * @param  array<string, mixed>  $attributes
 * @param  array<int, string>  $levels
 * @param  array<int, string>  $fields
 */
function testScholarship(array $attributes = [], array $levels = ['masters'], array $fields = ['all-fields']): Scholarship
{
    $country = testCountry('United Kingdom', 'GB');

    $scholarship = Scholarship::factory()->create([
        'host_country_id' => $country->id,
        ...$attributes,
    ]);

    $scholarship->studyLevels()->sync(
        collect($levels)->map(fn (string $slug) => testStudyLevel($slug)->id)->all(),
    );

    $scholarship->fieldsOfStudy()->sync(
        collect($fields)->map(fn (string $slug) => testFieldOfStudy($slug)->id)->all(),
    );

    return $scholarship;
}

test('the scholarship index lists only live scholarships', function () {
    $student = User::factory()->create();

    testScholarship(['title' => 'Live Scholarship']);
    testScholarship([
        'title' => 'Draft Scholarship',
        'status' => ScholarshipStatus::Draft,
    ]);

    $this->actingAs($student)
        ->get(route('scholarships.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('scholarships')
            ->has('scholarships.data', 1)
            ->where('scholarships.data.0.title', 'Live Scholarship')
            ->where('scholarships.data.0.saved', false)
            ->where('filters.sort', 'soonest')
            ->has('options.countries')
            ->has('options.levels')
            ->has('options.fields'));
});

test('the scholarship index applies database filters', function () {
    $student = User::factory()->create();

    $germany = testCountry('Germany', 'DE');
    testScholarship(['title' => 'Fully Funded UK Masters'], [], ['all-fields']);
    testScholarship([
        'title' => 'Partial German PhD',
        'host_country_id' => $germany->id,
        'funding_type' => FundingType::Partial,
    ], ['phd'], ['public-policy']);

    $this->actingAs($student)
        ->get(route('scholarships.index', ['country' => $germany->id]))
        ->assertInertia(fn (Assert $page) => $page
            ->has('scholarships.data', 1)
            ->where('scholarships.data.0.title', 'Partial German PhD'));

    $this->actingAs($student)
        ->get(route('scholarships.index', ['level' => 'phd']))
        ->assertInertia(fn (Assert $page) => $page
            ->has('scholarships.data', 1)
            ->where('scholarships.data.0.title', 'Partial German PhD'));

    $this->actingAs($student)
        ->get(route('scholarships.index', ['field' => 'public-policy']))
        ->assertInertia(fn (Assert $page) => $page
            ->has('scholarships.data', 1)
            ->where('scholarships.data.0.title', 'Partial German PhD'));

    $this->actingAs($student)
        ->get(route('scholarships.index', ['funding' => 1]))
        ->assertInertia(fn (Assert $page) => $page
            ->has('scholarships.data', 1)
            ->where('scholarships.data.0.title', 'Fully Funded UK Masters'));

    $this->actingAs($student)
        ->get(route('scholarships.index', ['q' => 'German']))
        ->assertInertia(fn (Assert $page) => $page
            ->has('scholarships.data', 1)
            ->where('scholarships.data.0.title', 'Partial German PhD'));
});

test('students can view a live scholarship detail page', function () {
    $student = User::factory()->create();
    $scholarship = testScholarship(['title' => 'Detailed Scholarship']);

    $this->actingAs($student)
        ->get(route('scholarships.show', $scholarship))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('scholarship-detail')
            ->where('scholarship.title', 'Detailed Scholarship')
            ->where('scholarship.slug', $scholarship->slug)
            ->where('scholarship.saved', false)
            ->has('scholarship.requiredDocuments'));
});

test('students cannot view non-live scholarships but admins can', function () {
    $student = User::factory()->create();
    $admin = User::factory()->admin()->create();
    $scholarship = testScholarship([
        'title' => 'Hidden Scholarship',
        'status' => ScholarshipStatus::Draft,
    ]);

    $this->actingAs($student)
        ->get(route('scholarships.show', $scholarship))
        ->assertForbidden();

    $this->actingAs($admin)
        ->get(route('scholarships.show', $scholarship))
        ->assertOk();
});

test('students can save and unsave scholarships', function () {
    $student = User::factory()->create();
    $scholarship = testScholarship();

    $this->actingAs($student)
        ->post(route('saved-scholarships.store', $scholarship))
        ->assertRedirect();

    $this->assertDatabaseHas('saved_scholarships', [
        'user_id' => $student->id,
        'scholarship_id' => $scholarship->id,
    ]);

    $this->actingAs($student)
        ->get(route('scholarships.index'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('scholarships.data.0.saved', true)
            ->where('savedCount', 1));

    $this->actingAs($student)
        ->delete(route('saved-scholarships.destroy', $scholarship))
        ->assertRedirect();

    $this->assertDatabaseMissing('saved_scholarships', [
        'user_id' => $student->id,
        'scholarship_id' => $scholarship->id,
    ]);
});

test('the admin scholarship index is backed by database records', function () {
    $admin = User::factory()->admin()->create();

    testScholarship(['title' => 'Live Admin Scholarship']);
    testScholarship([
        'title' => 'Pending Admin Scholarship',
        'status' => ScholarshipStatus::Pending,
    ]);

    $this->actingAs($admin)
        ->get(route('admin-scholarships.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin-scholarships')
            ->has('scholarships.data', 2)
            ->where('stats.live', 1)
            ->where('stats.pending', 1)
            ->has('statuses'));
});

test('admins can create a scholarship with relationships', function () {
    $admin = User::factory()->admin()->create();
    $country = testCountry('Canada', 'CA');
    $level = testStudyLevel('masters');
    $field = testFieldOfStudy('public-policy');

    $this->actingAs($admin)
        ->post(route('admin-scholarships.store'), [
            'title' => 'New Scholarship',
            'provider' => 'Test Provider',
            'summary' => 'A short summary.',
            'description' => 'A full description for the new scholarship.',
            'host_country_id' => $country->id,
            'funding_type' => FundingType::FullyFunded->value,
            'deadline_at' => now()->addDays(30)->toDateString(),
            'application_url' => 'https://example.com/apply',
            'eligibility' => 'Open to all eligible applicants.',
            'required_documents' => ['Transcript', 'Passport'],
            'status' => ScholarshipStatus::Pending->value,
            'is_featured' => true,
            'study_level_ids' => [$level->id],
            'field_of_study_ids' => [$field->id],
            'eligible_country_ids' => [$country->id],
        ])
        ->assertRedirect(route('admin-scholarships.index'));

    $scholarship = Scholarship::query()->where('title', 'New Scholarship')->firstOrFail();

    expect($scholarship->slug)->toBe('new-scholarship')
        ->and($scholarship->status)->toBe(ScholarshipStatus::Pending)
        ->and($scholarship->is_featured)->toBeTrue()
        ->and($scholarship->created_by)->toBe($admin->id)
        ->and($scholarship->studyLevels()->pluck('study_levels.id')->all())->toBe([$level->id])
        ->and($scholarship->fieldsOfStudy()->pluck('fields_of_study.id')->all())->toBe([$field->id])
        ->and($scholarship->eligibleCountries()->pluck('countries.id')->all())->toBe([$country->id]);
});

test('non-admins cannot create scholarships', function () {
    $student = User::factory()->create();
    $level = testStudyLevel('masters');
    $field = testFieldOfStudy('public-policy');

    $this->actingAs($student)
        ->post(route('admin-scholarships.store'), [
            'title' => 'Unauthorized Scholarship',
            'provider' => 'Test Provider',
            'description' => 'Description',
            'funding_type' => FundingType::FullyFunded->value,
            'deadline_at' => now()->addDays(30)->toDateString(),
            'status' => ScholarshipStatus::Pending->value,
            'study_level_ids' => [$level->id],
            'field_of_study_ids' => [$field->id],
        ])
        ->assertForbidden();

    $this->assertDatabaseMissing('scholarships', [
        'title' => 'Unauthorized Scholarship',
    ]);
});

test('admins can approve a pending scholarship', function () {
    $admin = User::factory()->admin()->create();
    $scholarship = testScholarship([
        'status' => ScholarshipStatus::Pending,
        'verified_at' => null,
        'published_at' => null,
    ]);

    $this->actingAs($admin)
        ->post(route('admin-scholarships.approve', $scholarship))
        ->assertRedirect();

    $scholarship->refresh();

    expect($scholarship->status)->toBe(ScholarshipStatus::Live)
        ->and($scholarship->approved_by)->toBe($admin->id)
        ->and($scholarship->verified_at)->not->toBeNull()
        ->and($scholarship->published_at)->not->toBeNull();
});

test('admins can update and delete scholarships', function () {
    $admin = User::factory()->admin()->create();
    $level = testStudyLevel('phd');
    $field = testFieldOfStudy('engineering');
    $scholarship = testScholarship();

    $this->actingAs($admin)
        ->patch(route('admin-scholarships.update', $scholarship), [
            'title' => 'Updated Scholarship',
            'provider' => 'Updated Provider',
            'summary' => 'Updated summary.',
            'description' => 'Updated description.',
            'host_country_id' => null,
            'funding_type' => FundingType::Partial->value,
            'deadline_at' => now()->addDays(45)->toDateString(),
            'application_url' => null,
            'eligibility' => null,
            'required_documents' => [],
            'status' => ScholarshipStatus::Live->value,
            'is_featured' => false,
            'study_level_ids' => [$level->id],
            'field_of_study_ids' => [$field->id],
            'eligible_country_ids' => [],
        ])
        ->assertRedirect();

    $scholarship->refresh();

    expect($scholarship->title)->toBe('Updated Scholarship')
        ->and($scholarship->provider)->toBe('Updated Provider')
        ->and($scholarship->funding_type)->toBe(FundingType::Partial)
        ->and($scholarship->studyLevels()->pluck('study_levels.id')->all())->toBe([$level->id]);

    $this->actingAs($admin)
        ->delete(route('admin-scholarships.destroy', $scholarship))
        ->assertRedirect(route('admin-scholarships.index'));

    $this->assertSoftDeleted($scholarship);
});

test('the home page receives featured scholarships from the database', function () {
    $featured = testScholarship([
        'title' => 'Featured Home Scholarship',
        'is_featured' => true,
    ]);
    testScholarship(['title' => 'Regular Home Scholarship']);
    testScholarship([
        'title' => 'Draft Featured Scholarship',
        'is_featured' => true,
        'status' => ScholarshipStatus::Draft,
    ]);

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('welcome')
            ->has('featuredScholarships', 1)
            ->where('featuredScholarships.0.title', $featured->title)
            ->where('scholarshipCount', 2)
            ->has('countryCount')
            ->has('studentCount'));
});
