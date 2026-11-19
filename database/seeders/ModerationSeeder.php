<?php

namespace Database\Seeders;

use App\Enums\ReportReason;
use App\Enums\ReportStatus;
use App\Enums\UserRole;
use App\Models\ContentReport;
use App\Models\MentorMessage;
use App\Models\MentorProfile;
use App\Models\Scholarship;
use App\Models\User;
use Illuminate\Database\Seeder;

class ModerationSeeder extends Seeder
{
    /**
     * Seed example content reports for the moderation queue.
     */
    public function run(): void
    {
        $admin = User::query()->where('email', 'admin@scholarly.test')->first();
        $student = User::query()->where('email', 'student@scholarly.test')->first();
        $learner = User::query()
            ->where('role', UserRole::Student)
            ->where('email', '!=', 'student@scholarly.test')
            ->first();

        $mentor = MentorProfile::query()->with('user')->first();
        $scholarship = Scholarship::query()->where('status', 'live')->first();
        $message = MentorMessage::query()->first();

        if (! $student instanceof User || ! $mentor instanceof MentorProfile) {
            return;
        }

        $reporter = $learner instanceof User ? $learner : $student;

        $reports = [
            [
                'reporter_id' => $reporter->id,
                'reportable_type' => MentorProfile::class,
                'reportable_id' => $mentor->id,
                'reason' => ReportReason::Misinformation,
                'details' => 'The profile claims credentials that do not match the listed university.',
                'status' => ReportStatus::Open,
            ],
            [
                'reporter_id' => $student->id,
                'reportable_type' => Scholarship::class,
                'reportable_id' => $scholarship?->id,
                'reason' => ReportReason::Other,
                'details' => 'The deadline on this listing looks out of date compared with the provider page.',
                'status' => ReportStatus::Open,
            ],
            [
                'reporter_id' => $reporter->id,
                'reportable_type' => MentorMessage::class,
                'reportable_id' => $message?->id,
                'reason' => ReportReason::Harassment,
                'details' => 'This message felt pushy and unrelated to the mentorship goal.',
                'status' => ReportStatus::Open,
            ],
            [
                'reporter_id' => $student->id,
                'reportable_type' => MentorProfile::class,
                'reportable_id' => $mentor->id,
                'reason' => ReportReason::Spam,
                'details' => 'Repeated promotional links in the profile bio.',
                'status' => ReportStatus::Resolved,
                'resolved_by' => $admin?->id,
                'resolved_at' => now()->subDays(3),
                'resolution_note' => 'Asked the mentor to remove the promotional links.',
            ],
            [
                'reporter_id' => $reporter->id,
                'reportable_type' => Scholarship::class,
                'reportable_id' => $scholarship?->id,
                'reason' => ReportReason::Inappropriate,
                'details' => 'The summary language seemed unprofessional.',
                'status' => ReportStatus::Dismissed,
                'resolved_by' => $admin?->id,
                'resolved_at' => now()->subWeek(),
            ],
        ];

        foreach ($reports as $report) {
            ContentReport::query()->firstOrCreate(
                [
                    'reporter_id' => $report['reporter_id'],
                    'reportable_type' => $report['reportable_type'],
                    'reportable_id' => $report['reportable_id'],
                    'reason' => $report['reason'],
                ],
                $report,
            );
        }
    }
}
