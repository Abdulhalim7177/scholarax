<?php

use App\Enums\UserRole;
use App\Models\Application;
use App\Models\ContentBlock;
use App\Models\Country;
use App\Models\ImpactStat;
use App\Models\MentorProfile;
use App\Models\Scholarship;
use App\Models\Testimonial;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('the home page renders database content and live records', function () {
    $country = Country::factory()->create(['name' => 'United Kingdom']);
    Country::factory()->inactive()->create();

    $student = User::factory()->create();
    $mentor = User::factory()->mentor()->create(['name' => 'Dr. Maya Chen']);
    MentorProfile::factory()->create([
        'user_id' => $mentor->id,
        'is_featured' => true,
    ]);

    $scholarship = Scholarship::factory()->featured()->create([
        'title' => 'Chevening Scholarships',
        'host_country_id' => $country->id,
        'deadline_at' => now()->addDays(12),
    ]);

    Application::factory()->create([
        'student_id' => $student->id,
        'scholarship_id' => $scholarship->id,
        'progress' => 60,
    ]);

    ImpactStat::factory()->create([
        'key' => 'students-supported',
        'label' => 'students supported',
        'source' => 'students',
        'icon' => 'users',
        'sort_order' => 1,
    ]);
    ImpactStat::factory()->create([
        'key' => 'countries-reached',
        'label' => 'countries',
        'source' => 'countries',
        'icon' => 'globe',
        'sort_order' => 2,
    ]);
    ImpactStat::factory()->create([
        'key' => 'scholarship-programs',
        'label' => 'scholarship programs',
        'source' => 'scholarships',
        'icon' => 'book',
        'sort_order' => 3,
    ]);

    ContentBlock::factory()->type('feature')->create([
        'title' => 'Discover scholarships',
        'sort_order' => 1,
    ]);
    ContentBlock::factory()->type('process_step')->create([
        'title' => 'Discover',
        'badge' => '01',
        'sort_order' => 1,
    ]);
    ContentBlock::factory()->type('application_step')->count(4)->sequence(
        ['title' => 'Step one'],
        ['title' => 'Step two'],
        ['title' => 'Step three'],
        ['title' => 'Step four'],
    )->create();

    Testimonial::factory()->create([
        'author_name' => 'Daniel Kim',
        'quote' => 'Scholarly made the whole process simpler.',
        'sort_order' => 1,
    ]);
    Testimonial::factory()->unpublished()->create(['sort_order' => 2]);

    $studentCount = User::query()
        ->where('role', UserRole::Student->value)
        ->count();

    $this->get('/')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('welcome')
            ->where('featuredScholarships.0.title', 'Chevening Scholarships')
            ->where('scholarshipCount', 1)
            ->where('countryCount', 1)
            ->where('impactStats.0.value', $studentCount)
            ->where('impactStats.1.value', 1)
            ->where('impactStats.2.value', 1)
            ->has('content.features', 1)
            ->where('content.features.0.title', 'Discover scholarships')
            ->has('content.processSteps', 1)
            ->has('content.applicationSteps', 4)
            ->where('applicationPreview.progress', 60)
            ->where('applicationPreview.completedSteps', 2)
            ->where('applicationPreview.totalSteps', 4)
            ->has('testimonials', 1)
            ->where('testimonials.0.authorName', 'Daniel Kim')
            ->where('nextDeadline.title', 'Chevening Scholarships')
            ->where('nextDeadline.daysLeft', 12));
});

test('home content follows database changes', function () {
    $testimonial = Testimonial::factory()->create([
        'author_name' => 'Before Update',
        'sort_order' => 1,
    ]);

    $this->get('/')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('testimonials.0.authorName', 'Before Update'));

    $testimonial->forceFill([
        'author_name' => 'After Update',
        'is_published' => false,
    ])->save();

    Testimonial::factory()->create([
        'author_name' => 'Fresh Voice',
        'sort_order' => 2,
    ]);

    $this->get('/')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('testimonials', 1)
            ->where('testimonials.0.authorName', 'Fresh Voice'));
});

test('the home page tolerates an empty content library', function () {
    $this->get('/')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('welcome')
            ->has('impactStats', 0)
            ->has('testimonials', 0)
            ->has('content.features', 0)
            ->has('content.processSteps', 0)
            ->has('content.applicationSteps', 0)
            ->where('applicationPreview.progress', 0)
            ->where('nextDeadline', null));
});
