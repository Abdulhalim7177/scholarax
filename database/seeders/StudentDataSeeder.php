<?php

namespace Database\Seeders;

use App\Enums\ApplicationDocumentStatus;
use App\Enums\ApplicationDocumentType;
use App\Enums\ApplicationStatus;
use App\Models\Application;
use App\Models\Country;
use App\Models\FieldOfStudy;
use App\Models\Scholarship;
use App\Models\StudentProfile;
use App\Models\StudyLevel;
use App\Models\User;
use App\Support\ActivityLogger;
use Illuminate\Database\Seeder;

class StudentDataSeeder extends Seeder
{
    /**
     * Seed a demo student profile, applications, and activity.
     */
    public function run(): void
    {
        $student = User::query()->where('email', 'student@scholarly.test')->first();

        if (! $student instanceof User) {
            return;
        }

        $countries = Country::query()->pluck('id', 'iso2');
        $levels = StudyLevel::query()->pluck('id', 'slug');
        $fields = FieldOfStudy::query()->pluck('id', 'slug');

        StudentProfile::query()->updateOrCreate(
            ['user_id' => $student->id],
            [
                'headline' => 'Aspiring policy analyst and future Chevening scholar',
                'bio' => 'Public policy graduate focused on education access and community-led development across West Africa.',
                'date_of_birth' => now()->subYears(24)->toDateString(),
                'city' => 'Lagos',
                'country_id' => $countries['NG'] ?? null,
                'linkedin_url' => 'https://www.linkedin.com/in/amina-yusuf',
                'website_url' => null,
                'target_level_id' => $levels['masters'] ?? null,
                'target_field_id' => $fields['public-policy'] ?? null,
            ],
        );

        $student->educations()->updateOrCreate(
            ['institution' => 'University of Lagos'],
            [
                'degree' => 'BSc',
                'field' => 'Political Science',
                'started_at' => now()->subYears(4)->toDateString(),
                'ended_at' => now()->subYear()->toDateString(),
                'grade' => 'First class',
                'is_current' => false,
            ],
        );

        $student->workExperiences()->updateOrCreate(
            ['organization' => 'Teach for Nigeria', 'role' => 'Programme Associate'],
            [
                'started_at' => now()->subMonths(14)->toDateString(),
                'ended_at' => null,
                'description' => 'Coordinates literacy programmes across 12 partner schools.',
                'is_current' => true,
            ],
        );

        $student->testScores()->updateOrCreate(
            ['type' => 'IELTS'],
            [
                'score' => '8.0',
                'tested_at' => now()->subMonths(6)->toDateString(),
                'expires_at' => now()->addMonths(18)->toDateString(),
            ],
        );

        $this->seedApplications($student);
        $this->seedSavedScholarships($student);
        $this->seedActivity($student);
    }

    /**
     * Seed the demo student's applications.
     */
    private function seedApplications(User $student): void
    {
        $statuses = [
            'chevening-scholarships' => ApplicationStatus::Draft,
            'daad-development-related-postgraduate-courses' => ApplicationStatus::InReview,
            'erasmus-mundus-joint-masters' => ApplicationStatus::Submitted,
            'fulbright-foreign-student-program' => ApplicationStatus::OfferReceived,
        ];

        foreach ($statuses as $slug => $status) {
            $scholarship = Scholarship::query()->where('slug', $slug)->first();

            if (! $scholarship instanceof Scholarship) {
                continue;
            }

            $application = Application::query()->updateOrCreate(
                [
                    'student_id' => $student->id,
                    'scholarship_id' => $scholarship->id,
                ],
                [
                    'status' => $status,
                    'progress' => 0,
                    'next_step' => null,
                    'deadline_at' => $scholarship->deadline_at,
                    'submitted_at' => in_array($status, [ApplicationStatus::Submitted, ApplicationStatus::OfferReceived], true)
                        ? now()->subDays(4)
                        : null,
                    'decision_at' => $status === ApplicationStatus::OfferReceived
                        ? now()->subDays(2)
                        : null,
                ],
            );

            $application->tasks()->delete();
            $application->documents()->delete();
            $application->statusHistories()->delete();

            $this->seedTasks($application, $scholarship, $status);
            $this->seedDocuments($application, $status);
            $this->seedHistory($application, $student, $status);

            $application->refresh();
            $application->recalculateProgress();
        }
    }

    /**
     * Seed tasks for a demo application.
     */
    private function seedTasks(
        Application $application,
        Scholarship $scholarship,
        ApplicationStatus $status,
    ): void {
        $titles = collect($scholarship->required_documents ?? [])
            ->filter(fn (string $title) => trim($title) !== '')
            ->values();

        if ($titles->isEmpty()) {
            $titles = collect([
                'Review eligibility requirements',
                'Prepare your statement of purpose',
                'Request a recommendation letter',
                'Submit your application',
            ]);
        }

        $completedCount = match ($status) {
            ApplicationStatus::Draft => 1,
            ApplicationStatus::InReview => 2,
            default => $titles->count(),
        };

        $titles->each(function (string $title, int $index) use ($application, $completedCount): void {
            $application->tasks()->create([
                'title' => $title,
                'description' => 'Required for this application.',
                'due_at' => now()->addDays(min(7 * ($index + 1), 21)),
                'completed_at' => $index < $completedCount ? now()->subDays(2) : null,
                'sort_order' => $index,
                'type' => 'document',
            ]);
        });
    }

    /**
     * Seed documents for a demo application.
     */
    private function seedDocuments(Application $application, ApplicationStatus $status): void
    {
        $documents = [
            [ApplicationDocumentType::Cv, 'Curriculum vitae', ApplicationDocumentStatus::Submitted],
            [ApplicationDocumentType::Sop, 'Statement of purpose', $status === ApplicationStatus::Draft
                ? ApplicationDocumentStatus::Draft
                : ApplicationDocumentStatus::Submitted],
            [ApplicationDocumentType::Recommendation, 'Recommendation letter', ApplicationDocumentStatus::Submitted],
        ];

        foreach ($documents as [$type, $title, $documentStatus]) {
            $application->documents()->create([
                'type' => $type,
                'title' => $title,
                'version' => 1,
                'file_path' => null,
                'original_name' => null,
                'status' => $documentStatus,
                'submitted_at' => $documentStatus->isComplete() ? now()->subDays(3) : null,
            ]);
        }
    }

    /**
     * Seed status history for a demo application.
     */
    private function seedHistory(
        Application $application,
        User $student,
        ApplicationStatus $status,
    ): void {
        $application->statusHistories()->create([
            'from_status' => null,
            'to_status' => ApplicationStatus::Draft,
            'changed_by' => $student->id,
            'note' => 'Application started.',
        ]);

        if ($status === ApplicationStatus::Draft) {
            return;
        }

        $application->statusHistories()->create([
            'from_status' => ApplicationStatus::Draft,
            'to_status' => $status,
            'changed_by' => $student->id,
            'note' => null,
        ]);
    }

    /**
     * Save a few scholarships for the demo student.
     */
    private function seedSavedScholarships(User $student): void
    {
        $ids = Scholarship::query()
            ->live()
            ->orderBy('deadline_at')
            ->limit(4)
            ->pluck('id')
            ->all();

        $student->savedScholarships()->syncWithoutDetaching($ids);
    }

    /**
     * Rebuild the demo student's activity feed.
     */
    private function seedActivity(User $student): void
    {
        $student->activityEvents()->delete();

        ActivityLogger::log(
            $student,
            'profile_updated',
            'Completed your education history',
            'University of Lagos · BSc Political Science',
        );

        $saved = $student->savedScholarships()->orderByDesc('saved_scholarships.created_at')->first();

        if ($saved !== null) {
            ActivityLogger::log(
                $student,
                'saved_scholarship',
                'Saved a scholarship',
                $saved->title,
                $saved,
            );
        }

        $offer = $student->applications()
            ->where('status', ApplicationStatus::OfferReceived)
            ->with('scholarship')
            ->first();

        if ($offer instanceof Application) {
            ActivityLogger::log(
                $student,
                'status_changed',
                'Offer received',
                $offer->scholarship->title,
                $offer,
            );
        }

        $completedTask = $student->applications()
            ->with('tasks')
            ->get()
            ->flatMap(fn (Application $application) => $application->tasks)
            ->first(fn ($task) => $task->completed_at !== null);

        if ($completedTask !== null) {
            ActivityLogger::log(
                $student,
                'task_completed',
                'Completed a task',
                $completedTask->title,
            );
        }
    }
}
