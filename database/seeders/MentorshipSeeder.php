<?php

namespace Database\Seeders;

use App\Enums\ApplicationDocumentStatus;
use App\Enums\ApplicationDocumentType;
use App\Enums\ApplicationStatus;
use App\Enums\DocumentReviewPriority;
use App\Enums\DocumentReviewStatus;
use App\Enums\MentorSessionStatus;
use App\Enums\MentorshipStatus;
use App\Enums\SessionAttendance;
use App\Enums\UserRole;
use App\Models\Application;
use App\Models\ApplicationDocument;
use App\Models\Country;
use App\Models\DocumentReview;
use App\Models\FieldOfStudy;
use App\Models\MentorProfile;
use App\Models\MentorSession;
use App\Models\Mentorship;
use App\Models\Scholarship;
use App\Models\StudentProfile;
use App\Models\StudyLevel;
use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Database\Seeder;
use Illuminate\Support\Collection;

class MentorshipSeeder extends Seeder
{
    /**
     * Seed demo mentorships, sessions, messages, reviews, and document reviews.
     */
    public function run(): void
    {
        $mentorProfile = MentorProfile::query()
            ->whereHas('user', fn ($query) => $query->where('email', 'mentor@scholarly.test'))
            ->with('user')
            ->first();

        if (! $mentorProfile instanceof MentorProfile) {
            return;
        }

        $mentor = $mentorProfile->user;
        $countries = Country::query()->pluck('id', 'iso2');
        $levels = StudyLevel::query()->pluck('id', 'slug');
        $fields = FieldOfStudy::query()->pluck('id', 'slug');
        $scholarships = Scholarship::query()->pluck('id', 'slug');

        $learners = [
            [
                'email' => 'student@scholarly.test',
                'name' => 'Amina Yusuf',
                'headline' => 'Aspiring policy analyst and future Chevening scholar',
                'city' => 'Lagos',
                'country' => 'NG',
                'field' => 'public-policy',
                'goal' => 'Chevening Scholarship',
                'started_at' => CarbonImmutable::now()->subWeeks(6),
                'applications' => [],
                'sessions' => [
                    [
                        'topic' => 'Statement of purpose deep dive',
                        'scheduled_at' => CarbonImmutable::now()->addDay()->setTime(10, 30),
                        'status' => MentorSessionStatus::Confirmed,
                        'notes' => 'Bring the latest draft and the Chevening essay questions.',
                        'meeting_url' => 'https://meet.example.com/amina-sop',
                    ],
                    [
                        'topic' => 'Interview practice: Chevening panel',
                        'scheduled_at' => CarbonImmutable::now()->addDays(5)->setTime(14, 0),
                        'status' => MentorSessionStatus::Requested,
                        'notes' => null,
                        'meeting_url' => null,
                    ],
                    [
                        'topic' => 'Goal setting and application timeline',
                        'scheduled_at' => CarbonImmutable::now()->subWeeks(5)->setTime(11, 0),
                        'status' => MentorSessionStatus::Completed,
                        'notes' => 'Agreed a weekly writing schedule.',
                        'meeting_url' => null,
                    ],
                ],
                'messages' => [
                    ['from' => 'mentor', 'body' => 'Hi Amina — I have read the opening of your statement. The reading-class story is strong. Let us tighten the link to policy in our next session.', 'minutes_ago' => 2880, 'read' => true],
                    ['from' => 'student', 'body' => 'Thank you! I have added two paragraphs about the financing research. Could you look at the transition before tomorrow?', 'minutes_ago' => 190, 'read' => false],
                ],
                'review' => [
                    'rating' => 5,
                    'comment' => 'Maya helped me turn a vague ambition into a clear, evidence-led story. I finally understand what my statement is arguing.',
                ],
            ],
            [
                'email' => 'david.mensah@scholarly.test',
                'name' => 'David Mensah',
                'headline' => 'Engineer preparing for a DAAD development masters',
                'city' => 'Accra',
                'country' => 'GH',
                'field' => 'engineering',
                'goal' => 'DAAD Development Scholarship',
                'started_at' => CarbonImmutable::now()->subWeeks(4),
                'applications' => [
                    'daad-development-related-postgraduate-courses' => ApplicationStatus::InReview,
                ],
                'sessions' => [
                    [
                        'topic' => 'CV structure feedback',
                        'scheduled_at' => CarbonImmutable::now()->addDay()->setTime(15, 0),
                        'status' => MentorSessionStatus::Confirmed,
                        'notes' => 'Review the two-page academic CV before submission.',
                        'meeting_url' => 'https://meet.example.com/david-cv',
                    ],
                    [
                        'topic' => 'DAAD motivation letter',
                        'scheduled_at' => CarbonImmutable::now()->subDays(4)->setTime(16, 0),
                        'status' => MentorSessionStatus::Completed,
                        'notes' => 'Restructured the motivation letter around development impact.',
                        'meeting_url' => null,
                    ],
                ],
                'messages' => [
                    ['from' => 'student', 'body' => 'I have uploaded the revised CV. The research section is now on page one.', 'minutes_ago' => 120, 'read' => false],
                ],
                'review' => [
                    'rating' => 5,
                    'comment' => 'Clear, practical feedback that made my technical work legible to a non-engineer reviewer.',
                ],
            ],
            [
                'email' => 'lucia.rossi@scholarly.test',
                'name' => 'Lucia Rossi',
                'headline' => 'Social science graduate exploring Erasmus Mundus programmes',
                'city' => 'Milan',
                'country' => 'IT',
                'field' => 'public-policy',
                'goal' => 'Erasmus Mundus Joint Masters',
                'started_at' => CarbonImmutable::now()->subWeeks(8),
                'applications' => [
                    'erasmus-mundus-joint-masters' => ApplicationStatus::Submitted,
                ],
                'sessions' => [
                    [
                        'topic' => 'Programme shortlist discussion',
                        'scheduled_at' => CarbonImmutable::now()->addDays(3)->setTime(9, 30),
                        'status' => MentorSessionStatus::Requested,
                        'notes' => null,
                        'meeting_url' => null,
                    ],
                    [
                        'topic' => 'Motivation letter review',
                        'scheduled_at' => CarbonImmutable::now()->subDays(10)->setTime(13, 0),
                        'status' => MentorSessionStatus::Completed,
                        'notes' => 'Focused the letter on comparative social policy.',
                        'meeting_url' => null,
                    ],
                ],
                'messages' => [
                    ['from' => 'mentor', 'body' => 'Your shortlist looks balanced. I would add one programme with a stronger research methods track.', 'minutes_ago' => 4320, 'read' => true],
                    ['from' => 'student', 'body' => 'That makes sense. I will compare the methods modules and send an updated list.', 'minutes_ago' => 1500, 'read' => true],
                ],
                'review' => [
                    'rating' => 4,
                    'comment' => 'Thoughtful guidance on programme fit. I would have liked more time on interview preparation.',
                ],
            ],
            [
                'email' => 'sam.okoro@scholarly.test',
                'name' => 'Sam Okoro',
                'headline' => 'First-time Commonwealth applicant building a study plan',
                'city' => 'Abuja',
                'country' => 'NG',
                'field' => 'development-studies',
                'goal' => 'Commonwealth Scholarship',
                'started_at' => CarbonImmutable::now()->subDays(3),
                'applications' => [
                    'commonwealth-masters-scholarships' => ApplicationStatus::Draft,
                ],
                'sessions' => [
                    [
                        'topic' => 'Set application goals',
                        'scheduled_at' => CarbonImmutable::now()->addDays(2)->setTime(17, 0),
                        'status' => MentorSessionStatus::Requested,
                        'notes' => 'First conversation — map out the next six weeks.',
                        'meeting_url' => null,
                    ],
                ],
                'messages' => [
                    ['from' => 'student', 'body' => 'Hello Maya, thank you for agreeing to mentor me. I am not sure where to start with the development impact statement.', 'minutes_ago' => 60, 'read' => false],
                ],
                'review' => null,
            ],
            [
                'email' => 'nadia.rahman@scholarly.test',
                'name' => 'Nadia Rahman',
                'headline' => 'Public health researcher preparing a Fulbright application',
                'city' => 'Dhaka',
                'country' => 'BD',
                'field' => 'social-sciences',
                'goal' => 'Fulbright Foreign Student Program',
                'started_at' => CarbonImmutable::now()->subWeeks(12),
                'applications' => [
                    'fulbright-foreign-student-program' => ApplicationStatus::Submitted,
                ],
                'sessions' => [
                    [
                        'topic' => 'Fulbright interview preparation',
                        'scheduled_at' => CarbonImmutable::now()->addDays(4)->setTime(12, 0),
                        'status' => MentorSessionStatus::Confirmed,
                        'notes' => 'Run through the panel questions and the study objective.',
                        'meeting_url' => 'https://meet.example.com/nadia-interview',
                    ],
                    [
                        'topic' => 'Study objective review',
                        'scheduled_at' => CarbonImmutable::now()->subDays(6)->setTime(10, 0),
                        'status' => MentorSessionStatus::Completed,
                        'notes' => 'Sharpened the link between field work and the proposed programme.',
                        'meeting_url' => null,
                    ],
                ],
                'messages' => [
                    ['from' => 'mentor', 'body' => 'Your study objective is much clearer now. For the interview, prepare one concrete field story for each question.', 'minutes_ago' => 7200, 'read' => true],
                    ['from' => 'student', 'body' => 'I have three stories ready. Could we do a timed run-through next week?', 'minutes_ago' => 300, 'read' => false],
                ],
                'review' => [
                    'rating' => 5,
                    'comment' => 'Maya knows exactly which details matter. My study objective is sharper and my interview confidence is much higher.',
                ],
            ],
        ];

        foreach ($learners as $learner) {
            $student = User::query()->where('email', $learner['email'])->first();

            if (! $student instanceof User) {
                $student = User::factory()->create([
                    'name' => $learner['name'],
                    'email' => $learner['email'],
                ]);
            } elseif ($student->role !== UserRole::Student) {
                $student->forceFill(['role' => UserRole::Student])->save();
            }

            StudentProfile::query()->firstOrCreate(
                ['user_id' => $student->id],
                [
                    'headline' => $learner['headline'],
                    'bio' => null,
                    'date_of_birth' => null,
                    'city' => $learner['city'],
                    'country_id' => $countries[$learner['country']] ?? null,
                    'linkedin_url' => null,
                    'website_url' => null,
                    'target_level_id' => $levels['masters'] ?? null,
                    'target_field_id' => $fields[$learner['field']] ?? null,
                ],
            );

            $this->seedApplications($student, $learner['applications'], $scholarships);

            $mentorship = Mentorship::query()->updateOrCreate(
                [
                    'mentor_profile_id' => $mentorProfile->id,
                    'student_id' => $student->id,
                ],
                [
                    'status' => MentorshipStatus::Active,
                    'started_at' => $learner['started_at'],
                    'ended_at' => null,
                    'goals' => $learner['goal'],
                ],
            );

            $mentorship->sessions()->delete();
            $mentorship->messages()->delete();
            $mentorship->review()->delete();

            $this->seedSessions($mentorship, $student, $mentor, $learner['sessions']);
            $this->seedMessages($mentorship, $student, $mentor, $learner['messages']);

            if ($learner['review'] !== null) {
                $mentorship->review()->create([
                    'student_id' => $student->id,
                    'mentor_profile_id' => $mentorProfile->id,
                    'rating' => $learner['review']['rating'],
                    'comment' => $learner['review']['comment'],
                    'is_published' => true,
                ]);
            }
        }

        $this->seedDocumentReviews($mentor);
    }

    /**
     * Seed applications and their tasks and documents for a demo learner.
     *
     * @param  array<string, ApplicationStatus>  $applications
     * @param  Collection<string, int>  $scholarships
     */
    private function seedApplications(User $student, array $applications, $scholarships): void
    {
        foreach ($applications as $slug => $status) {
            $scholarshipId = $scholarships[$slug] ?? null;

            if ($scholarshipId === null) {
                continue;
            }

            $application = Application::query()->updateOrCreate(
                [
                    'student_id' => $student->id,
                    'scholarship_id' => $scholarshipId,
                ],
                [
                    'status' => $status,
                    'progress' => 0,
                    'next_step' => null,
                    'deadline_at' => CarbonImmutable::now()->addWeeks(6),
                    'submitted_at' => $status === ApplicationStatus::Submitted ? CarbonImmutable::now()->subDays(4) : null,
                    'decision_at' => null,
                ],
            );

            $application->tasks()->delete();
            $application->documents()->delete();

            $this->seedTasks($application, $status);
            $this->seedDocuments($application, $status);

            $application->refresh();
            $application->recalculateProgress();
        }
    }

    /**
     * Seed the tasks for a learner application.
     */
    private function seedTasks(Application $application, ApplicationStatus $status): void
    {
        $tasks = match ($status) {
            ApplicationStatus::Draft => [
                ['Review eligibility requirements', true],
                ['Draft your development impact statement', false],
                ['Request a recommendation letter', false],
                ['Upload academic transcripts', false],
            ],
            default => [
                ['Review eligibility requirements', true],
                ['Draft your motivation letter', true],
                ['Request a recommendation letter', true],
                ['Upload academic transcripts', false],
            ],
        };

        foreach ($tasks as $index => [$title, $completed]) {
            $application->tasks()->create([
                'title' => $title,
                'description' => 'Required for this application.',
                'due_at' => CarbonImmutable::now()->addDays(7 * ($index + 1)),
                'completed_at' => $completed ? CarbonImmutable::now()->subDays(3) : null,
                'sort_order' => $index,
                'type' => 'document',
            ]);
        }
    }

    /**
     * Seed the documents for a learner application.
     */
    private function seedDocuments(Application $application, ApplicationStatus $status): void
    {
        $submitted = $status !== ApplicationStatus::Draft;

        $documents = [
            [ApplicationDocumentType::Cv, 'Academic CV', $submitted],
            [ApplicationDocumentType::Sop, 'Statement of purpose', $submitted],
            [ApplicationDocumentType::Recommendation, 'Recommendation letter', $submitted],
        ];

        foreach ($documents as [$type, $title, $isSubmitted]) {
            $application->documents()->create([
                'type' => $type,
                'title' => $title,
                'version' => 1,
                'status' => $isSubmitted
                    ? ApplicationDocumentStatus::Submitted
                    : ApplicationDocumentStatus::Draft,
                'submitted_at' => $isSubmitted ? CarbonImmutable::now()->subDays(3) : null,
            ]);
        }
    }

    /**
     * Seed sessions for a demo mentorship.
     *
     * @param  array<int, array<string, mixed>>  $sessions
     */
    private function seedSessions(Mentorship $mentorship, User $student, User $mentor, array $sessions): void
    {
        foreach ($sessions as $session) {
            $isCompleted = $session['status'] === MentorSessionStatus::Completed;

            MentorSession::query()->create([
                'mentorship_id' => $mentorship->id,
                'requested_by' => $session['status'] === MentorSessionStatus::Requested
                    ? $student->id
                    : $mentor->id,
                'topic' => $session['topic'],
                'scheduled_at' => $session['scheduled_at'],
                'duration_minutes' => 45,
                'meeting_url' => $session['meeting_url'],
                'status' => $session['status'],
                'attendance_status' => $isCompleted ? SessionAttendance::Attended : SessionAttendance::Pending,
                'notes' => $session['notes'],
                'completed_at' => $isCompleted ? $session['scheduled_at'] : null,
            ]);
        }
    }

    /**
     * Seed messages for a demo mentorship.
     *
     * @param  array<int, array{from: string, body: string, minutes_ago: int, read: bool}>  $messages
     */
    private function seedMessages(Mentorship $mentorship, User $student, User $mentor, array $messages): void
    {
        foreach ($messages as $message) {
            $fromStudent = $message['from'] === 'student';
            $timestamp = CarbonImmutable::now()->subMinutes($message['minutes_ago']);

            $created = $mentorship->messages()->create([
                'sender_id' => $fromStudent ? $student->id : $mentor->id,
                'recipient_id' => $fromStudent ? $mentor->id : $student->id,
                'body' => $message['body'],
                'read_at' => $message['read'] ? $timestamp->addMinutes(5) : null,
            ]);

            $created->forceFill([
                'created_at' => $timestamp,
                'updated_at' => $timestamp,
            ])->saveQuietly();
        }
    }

    /**
     * Seed the mentor's document review queue.
     */
    private function seedDocumentReviews(User $mentor): void
    {
        DocumentReview::query()->where('mentor_id', $mentor->id)->delete();

        $reviews = [
            [
                'email' => 'student@scholarly.test',
                'scholarship' => 'chevening-scholarships',
                'type' => ApplicationDocumentType::Sop,
                'status' => DocumentReviewStatus::Pending,
                'priority' => DocumentReviewPriority::High,
                'due_at' => CarbonImmutable::now()->setTime(18, 0),
                'feedback' => null,
            ],
            [
                'email' => 'david.mensah@scholarly.test',
                'scholarship' => 'daad-development-related-postgraduate-courses',
                'type' => ApplicationDocumentType::Cv,
                'status' => DocumentReviewStatus::InReview,
                'priority' => DocumentReviewPriority::Normal,
                'due_at' => CarbonImmutable::now()->addDay()->setTime(17, 0),
                'feedback' => null,
            ],
            [
                'email' => 'lucia.rossi@scholarly.test',
                'scholarship' => 'erasmus-mundus-joint-masters',
                'type' => ApplicationDocumentType::Sop,
                'status' => DocumentReviewStatus::Pending,
                'priority' => DocumentReviewPriority::High,
                'due_at' => CarbonImmutable::now()->subDay()->setTime(12, 0),
                'feedback' => null,
            ],
            [
                'email' => 'sam.okoro@scholarly.test',
                'scholarship' => 'commonwealth-masters-scholarships',
                'type' => ApplicationDocumentType::Cv,
                'status' => DocumentReviewStatus::Pending,
                'priority' => DocumentReviewPriority::Normal,
                'due_at' => CarbonImmutable::now()->addDays(5)->setTime(12, 0),
                'feedback' => null,
            ],
            [
                'email' => 'nadia.rahman@scholarly.test',
                'scholarship' => 'fulbright-foreign-student-program',
                'type' => ApplicationDocumentType::Sop,
                'status' => DocumentReviewStatus::Completed,
                'priority' => DocumentReviewPriority::Normal,
                'due_at' => CarbonImmutable::now()->subDays(2)->setTime(12, 0),
                'feedback' => 'Strong narrative and a clear link to your public health research. Check the final paragraph for repetition before submission.',
            ],
        ];

        $scholarships = Scholarship::query()->pluck('id', 'slug');

        foreach ($reviews as $spec) {
            $scholarshipId = $scholarships[$spec['scholarship']] ?? null;

            if ($scholarshipId === null) {
                continue;
            }

            $document = ApplicationDocument::query()
                ->where('type', $spec['type']->value)
                ->whereHas('application', function ($query) use ($spec, $scholarshipId): void {
                    $query->where('scholarship_id', $scholarshipId)
                        ->whereHas('student', fn ($student) => $student->where('email', $spec['email']));
                })
                ->first();

            if (! $document instanceof ApplicationDocument) {
                continue;
            }

            DocumentReview::query()->create([
                'application_document_id' => $document->id,
                'mentor_id' => $mentor->id,
                'status' => $spec['status'],
                'priority' => $spec['priority'],
                'due_at' => $spec['due_at'],
                'feedback' => $spec['feedback'],
                'reviewed_at' => $spec['status'] === DocumentReviewStatus::Completed
                    ? CarbonImmutable::now()->subDay()
                    : null,
            ]);
        }
    }
}
