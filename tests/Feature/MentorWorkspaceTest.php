<?php

use App\Enums\ApplicationStatus;
use App\Enums\AvailabilityStatus;
use App\Enums\DocumentReviewPriority;
use App\Enums\DocumentReviewStatus;
use App\Enums\MentorSessionStatus;
use App\Enums\MentorshipStatus;
use App\Enums\SessionAttendance;
use App\Enums\VerificationStatus;
use App\Models\Application;
use App\Models\ApplicationDocument;
use App\Models\DocumentReview;
use App\Models\MentorProfile;
use App\Models\MentorReview;
use App\Models\MentorSession;
use App\Models\Mentorship;
use App\Models\Scholarship;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

/**
 * Create a verified mentor who owns the given profile.
 *
 * @return array{0: User, 1: MentorProfile}
 */
function mentorWorkspaceMentor(string $name = 'Dr. Maya Chen', array $attributes = []): array
{
    $mentor = User::factory()->mentor()->create(['name' => $name]);
    $profile = MentorProfile::factory()->create([
        'user_id' => $mentor->id,
        'verification_status' => VerificationStatus::Verified,
        'availability_status' => AvailabilityStatus::Available,
        ...$attributes,
    ]);

    return [$mentor, $profile];
}

/**
 * Create a student with an active mentorship for the given mentor profile.
 *
 * @return array{0: User, 1: Mentorship}
 */
function mentorWorkspaceLearner(MentorProfile $profile, string $name = 'Amina Yusuf'): array
{
    $student = User::factory()->create(['name' => $name]);
    $mentorship = Mentorship::factory()->create([
        'mentor_profile_id' => $profile->id,
        'student_id' => $student->id,
        'status' => MentorshipStatus::Active,
        'started_at' => now()->subDays(5),
        'goals' => 'Chevening Scholarship',
    ]);

    return [$student, $mentorship];
}

test('the mentor dashboard is built from mentorships and reviews', function () {
    [$mentor, $profile] = mentorWorkspaceMentor('Dr. Maya Chen', ['rating_avg' => 4.8]);
    [$student, $mentorship] = mentorWorkspaceLearner($profile);

    $application = Application::factory()->create([
        'student_id' => $student->id,
        'scholarship_id' => Scholarship::factory()->create(['title' => 'Chevening Scholarships'])->id,
        'status' => ApplicationStatus::InReview,
        'progress' => 60,
    ]);
    $document = ApplicationDocument::factory()->create([
        'application_id' => $application->id,
        'title' => 'Statement of purpose',
    ]);

    DocumentReview::factory()->create([
        'application_document_id' => $document->id,
        'mentor_id' => $mentor->id,
        'priority' => DocumentReviewPriority::High,
        'due_at' => now()->setTime(18, 0),
    ]);

    MentorSession::factory()->create([
        'mentorship_id' => $mentorship->id,
        'topic' => 'SOP feedback call',
        'scheduled_at' => now()->addDay()->setTime(10, 30),
        'status' => MentorSessionStatus::Confirmed,
        'attendance_status' => SessionAttendance::Pending,
    ]);

    $mentorship->messages()->create([
        'sender_id' => $student->id,
        'recipient_id' => $mentor->id,
        'body' => 'Could you look at my latest draft?',
    ]);

    MentorReview::factory()->create([
        'mentorship_id' => $mentorship->id,
        'student_id' => $student->id,
        'mentor_profile_id' => $profile->id,
        'rating' => 5,
        'is_published' => true,
    ]);

    $this->actingAs($mentor)
        ->get(route('mentor-dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('mentor-dashboard')
            ->where('mentor.name', 'Dr. Maya Chen')
            ->where('mentor.firstName', 'Dr.')
            ->where('stats.activeLearners', 1)
            ->where('stats.reviews', 1)
            ->where('stats.rating', '5.0')
            ->has('reviews', 1)
            ->where('reviews.0.learner', 'Amina Yusuf')
            ->where('reviews.0.priority', 'Needs attention')
            ->has('sessions', 1)
            ->where('sessions.0.topic', 'SOP feedback call')
            ->has('messages', 1)
            ->where('messages.0.unread', true)
            ->where('impact.learnersSupported', 1));
});

test('mentors only see their own learners and can search them', function () {
    [$mentor, $profile] = mentorWorkspaceMentor();
    [, $mentorship] = mentorWorkspaceLearner($profile, 'Amina Yusuf');

    [$otherMentor, $otherProfile] = mentorWorkspaceMentor('James Okafor');
    mentorWorkspaceLearner($otherProfile, 'David Mensah');

    $application = Application::factory()->create([
        'student_id' => $mentorship->student_id,
        'status' => ApplicationStatus::InReview,
        'progress' => 64,
    ]);
    $application->tasks()->create([
        'title' => 'Review personal statement',
        'due_at' => now()->addWeek(),
        'sort_order' => 0,
    ]);
    $application->tasks()->create([
        'title' => 'Upload transcripts',
        'completed_at' => now()->subDay(),
        'sort_order' => 1,
    ]);
    $application->recalculateProgress();

    $this->actingAs($mentor)
        ->get(route('mentor-learners'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('mentor-learners')
            ->where('stats.activeLearners', 1)
            ->has('learners', 1)
            ->where('learners.0.name', 'Amina Yusuf')
            ->where('learners.0.next', 'Review personal statement')
            ->where('learners.0.progress', 50));

    $this->actingAs($mentor)
        ->get(route('mentor-learners', ['q' => 'Mensah']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->has('learners', 0));

    $this->actingAs($otherMentor)
        ->get(route('mentor-learners'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('learners', 1)
            ->where('learners.0.name', 'David Mensah'));
});

test('the sessions page shows upcoming and recent sessions plus availability', function () {
    [$mentor, $profile] = mentorWorkspaceMentor();
    [, $mentorship] = mentorWorkspaceLearner($profile);

    $profile->availabilitySlots()->create([
        'weekday' => 1,
        'start_time' => '09:00',
        'end_time' => '12:00',
        'timezone' => 'UTC',
        'is_active' => true,
    ]);

    MentorSession::factory()->create([
        'mentorship_id' => $mentorship->id,
        'topic' => 'Upcoming call',
        'scheduled_at' => now()->addDays(2),
        'status' => MentorSessionStatus::Confirmed,
        'attendance_status' => SessionAttendance::Pending,
    ]);
    MentorSession::factory()->create([
        'mentorship_id' => $mentorship->id,
        'topic' => 'Past call',
        'status' => MentorSessionStatus::Completed,
        'scheduled_at' => now()->subDays(3),
        'completed_at' => now()->subDays(3),
        'attendance_status' => SessionAttendance::Attended,
    ]);

    $this->actingAs($mentor)
        ->get(route('mentor-sessions'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('mentor-sessions')
            ->where('stats.upcoming', 1)
            ->where('stats.attendanceRate', 100)
            ->where('stats.attendanceSample', 1)
            ->has('upcoming', 1)
            ->where('upcoming.0.topic', 'Upcoming call')
            ->has('recent', 1)
            ->where('recent.0.topic', 'Past call')
            ->has('availability', 1)
            ->has('learners', 1));
});

test('the impact page summarises learner outcomes and reviews', function () {
    [$mentor, $profile] = mentorWorkspaceMentor();
    [$student, $mentorship] = mentorWorkspaceLearner($profile);

    Application::factory()->offerReceived()->create([
        'student_id' => $student->id,
    ]);
    Application::factory()->create([
        'student_id' => $student->id,
        'status' => ApplicationStatus::Rejected,
        'progress' => 100,
    ]);

    MentorReview::factory()->create([
        'mentorship_id' => $mentorship->id,
        'student_id' => $student->id,
        'mentor_profile_id' => $profile->id,
        'rating' => 4,
        'comment' => 'The feedback was kind and useful.',
        'is_published' => true,
    ]);

    MentorSession::factory()->completed()->create([
        'mentorship_id' => $mentorship->id,
        'completed_at' => now(),
    ]);

    $this->actingAs($mentor)
        ->get(route('mentor-impact'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('mentor-impact')
            ->where('stats.learners', 1)
            ->where('stats.rating', '4.0')
            ->where('stats.reviews', 1)
            ->where('stats.offerRate', 50)
            ->has('series', 6)
            ->where('helpfulness', 80)
            ->has('voices', 1)
            ->where('voices.0.learner', 'Amina Y.'));
});

test('the review queue only lists open document reviews for the mentor', function () {
    [$mentor, $profile] = mentorWorkspaceMentor();
    [$student] = mentorWorkspaceLearner($profile);

    $application = Application::factory()->create([
        'student_id' => $student->id,
        'status' => ApplicationStatus::InReview,
    ]);
    $document = ApplicationDocument::factory()->create([
        'application_id' => $application->id,
        'title' => 'Academic CV',
    ]);

    DocumentReview::factory()->create([
        'application_document_id' => $document->id,
        'mentor_id' => $mentor->id,
        'status' => DocumentReviewStatus::Pending,
        'priority' => DocumentReviewPriority::High,
        'due_at' => now()->setTime(12, 0),
    ]);

    DocumentReview::factory()->completed()->create([
        'application_document_id' => ApplicationDocument::factory()->create([
            'application_id' => $application->id,
        ])->id,
        'mentor_id' => $mentor->id,
    ]);

    DocumentReview::factory()->create([
        'application_document_id' => ApplicationDocument::factory()->create([
            'application_id' => $application->id,
        ])->id,
        'mentor_id' => User::factory()->mentor()->create()->id,
    ]);

    $this->actingAs($mentor)
        ->get(route('mentor-review-queue'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('mentor-review-queue')
            ->where('stats.waiting', 1)
            ->where('stats.dueToday', 1)
            ->has('items', 1)
            ->where('items.0.learner', 'Amina Yusuf')
            ->where('items.0.document', 'Academic CV'));
});
