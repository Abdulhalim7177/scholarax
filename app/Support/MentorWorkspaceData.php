<?php

namespace App\Support;

use App\Enums\ApplicationStatus;
use App\Enums\DocumentReviewStatus;
use App\Enums\MentorSessionStatus;
use App\Enums\SessionAttendance;
use App\Models\Application;
use App\Models\DocumentReview;
use App\Models\MentorMessage;
use App\Models\MentorProfile;
use App\Models\MentorSession;
use App\Models\Mentorship;
use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Support\Str;

final class MentorWorkspaceData
{
    /**
     * Build the mentor dashboard payload.
     *
     * @return array<string, mixed>
     */
    public static function dashboard(MentorProfile $profile): array
    {
        $user = $profile->user;
        $mentorships = $profile->mentorships()
            ->with(['student', 'latestMessage'])
            ->get();

        $active = $mentorships->filter(
            fn (Mentorship $mentorship) => $mentorship->status->isActive(),
        );

        $reviewsCompleted = DocumentReview::query()
            ->where('mentor_id', $user->id)
            ->where('status', DocumentReviewStatus::Completed->value)
            ->where('reviewed_at', '>=', CarbonImmutable::now()->startOfMonth())
            ->count();

        $reviewsCount = $profile->reviews()->count();
        $rating = $profile->reviews()->avg('rating') ?? $profile->rating_avg;

        $sessions = MentorSession::query()
            ->whereIn('mentorship_id', $mentorships->pluck('id'))
            ->upcoming()
            ->with('mentorship.student')
            ->orderBy('scheduled_at')
            ->limit(3)
            ->get()
            ->map(fn (MentorSession $session) => self::sessionSummary($session))
            ->all();

        $messages = $active
            ->filter(fn (Mentorship $mentorship) => $mentorship->latestMessage !== null)
            ->sortByDesc(fn (Mentorship $mentorship) => $mentorship->latestMessage?->created_at->timestamp ?? 0)
            ->take(3)
            ->map(fn (Mentorship $mentorship) => self::messageSummary($mentorship))
            ->values()
            ->all();

        return [
            'mentor' => [
                'name' => $user->name,
                'firstName' => Str::before($user->name, ' '),
                'avatarUrl' => $user->avatar_url,
            ],
            'stats' => [
                'activeLearners' => $active->count(),
                'newLearners' => $active->filter(
                    fn (Mentorship $mentorship) => $mentorship->started_at !== null
                        && $mentorship->started_at->greaterThanOrEqualTo(CarbonImmutable::now()->subDays(30)),
                )->count(),
                'reviewsCompleted' => $reviewsCompleted,
                'rating' => number_format((float) $rating, 1),
                'reviews' => $reviewsCount,
                'responseTime' => self::durationLabel($profile->response_time_minutes),
            ],
            'reviews' => self::reviewItems($profile, 4),
            'sessions' => $sessions,
            'messages' => $messages,
            'impact' => [
                'learnersSupported' => $mentorships->pluck('student_id')->unique()->count(),
                'year' => CarbonImmutable::now()->year,
            ],
        ];
    }

    /**
     * Build the mentor learners payload.
     *
     * @return array<string, mixed>
     */
    public static function learners(MentorProfile $profile, string $query = ''): array
    {
        $search = Str::lower(trim($query));

        $mentorships = $profile->mentorships()
            ->with([
                'student.applications.scholarship',
                'student.applications.tasks',
                'latestMessage',
                'sessions' => fn ($query) => $query->upcoming()->orderBy('scheduled_at'),
            ])
            ->get();

        $learners = $mentorships
            ->map(fn (Mentorship $mentorship) => self::learnerSummary($mentorship))
            ->filter(function (array $learner) use ($search): bool {
                if ($search === '') {
                    return true;
                }

                return str_contains(Str::lower($learner['name'].' '.$learner['goal']), $search);
            })
            ->values();

        $unread = MentorMessage::query()
            ->where('recipient_id', $profile->user_id)
            ->whereNull('read_at')
            ->count();

        return [
            'stats' => [
                'activeLearners' => $mentorships->filter(
                    fn (Mentorship $mentorship) => $mentorship->status->isActive(),
                )->count(),
                'averageProgress' => (int) round((float) ($learners->avg('progress') ?? 0)),
                'unreadMessages' => $unread,
            ],
            'learners' => $learners->all(),
            'filters' => ['q' => $query],
        ];
    }

    /**
     * Build the mentor sessions payload.
     *
     * @return array<string, mixed>
     */
    public static function sessions(MentorProfile $profile): array
    {
        $profile->loadMissing('availabilitySlots');

        $mentorships = $profile->mentorships()->with('student')->get();
        $mentorshipIds = $mentorships->pluck('id');

        $allSessions = MentorSession::query()
            ->whereIn('mentorship_id', $mentorshipIds)
            ->with('mentorship.student')
            ->orderBy('scheduled_at')
            ->get();

        $upcoming = $allSessions
            ->filter(fn (MentorSession $session) => $session->status->isUpcoming())
            ->map(fn (MentorSession $session) => self::sessionDetail($session))
            ->values()
            ->all();

        $recent = $allSessions
            ->filter(fn (MentorSession $session) => ! $session->status->isUpcoming())
            ->sortByDesc(fn (MentorSession $session) => $session->scheduled_at->timestamp)
            ->take(5)
            ->map(fn (MentorSession $session) => self::sessionDetail($session))
            ->values()
            ->all();

        $attendanceTracked = $allSessions->filter(
            fn (MentorSession $session) => in_array(
                $session->attendance_status,
                [SessionAttendance::Attended, SessionAttendance::Missed],
                true,
            ),
        );
        $attended = $attendanceTracked->filter(
            fn (MentorSession $session) => $session->attendance_status === SessionAttendance::Attended,
        )->count();

        $availableMinutes = $profile->availabilitySlots
            ->filter(fn ($slot) => $slot->is_active)
            ->sum(function ($slot): int {
                $start = CarbonImmutable::parse($slot->start_time);
                $end = CarbonImmutable::parse($slot->end_time);

                return max(0, (int) $start->diffInMinutes($end));
            });

        $learners = $mentorships
            ->filter(fn (Mentorship $mentorship) => $mentorship->status->isActive())
            ->map(fn (Mentorship $mentorship) => [
                'value' => (string) $mentorship->id,
                'label' => $mentorship->student->name,
            ])
            ->values()
            ->all();

        $startOfWeek = CarbonImmutable::now()->startOfWeek();
        $endOfWeek = CarbonImmutable::now()->endOfWeek();

        return [
            'stats' => [
                'upcoming' => count($upcoming),
                'availableHours' => self::hoursLabel($availableMinutes),
                'attendanceRate' => $attendanceTracked->isEmpty()
                    ? 0
                    : (int) round($attended / $attendanceTracked->count() * 100),
                'attendanceSample' => $attendanceTracked->count(),
            ],
            'weekLabel' => $startOfWeek->format('j M').' – '.$endOfWeek->format('j M Y'),
            'upcoming' => $upcoming,
            'recent' => $recent,
            'availability' => $profile->availabilitySlots
                ->map(fn ($slot) => [
                    'id' => $slot->id,
                    'label' => MentorData::slot($slot)['label'],
                    'isActive' => $slot->is_active,
                ])
                ->values()
                ->all(),
            'learners' => $learners,
        ];
    }

    /**
     * Build the mentor impact payload.
     *
     * @return array<string, mixed>
     */
    public static function impact(MentorProfile $profile): array
    {
        $mentorships = $profile->mentorships()
            ->with('student.applications')
            ->get();

        $studentIds = $mentorships->pluck('student_id')->unique()->values();
        $applications = Application::query()
            ->whereIn('student_id', $studentIds)
            ->get();

        $offers = $applications->filter(
            fn (Application $application) => $application->status === ApplicationStatus::OfferReceived,
        )->count();
        $rejected = $applications->filter(
            fn (Application $application) => $application->status === ApplicationStatus::Rejected,
        )->count();
        $decided = $offers + $rejected;

        $reviews = $profile->reviews()->get();
        $averageRating = $reviews->isEmpty() ? 0.0 : (float) $reviews->avg('rating');

        $months = collect(range(5, 0))->map(
            fn (int $offset) => CarbonImmutable::now()->startOfMonth()->subMonths($offset),
        );

        $completedSessions = MentorSession::query()
            ->whereIn('mentorship_id', $mentorships->pluck('id'))
            ->where('status', MentorSessionStatus::Completed->value)
            ->whereNotNull('completed_at')
            ->get();

        $series = $months->map(function (CarbonImmutable $month) use ($completedSessions): array {
            $value = $completedSessions
                ->filter(fn (MentorSession $session) => $session->completed_at !== null
                    && $session->completed_at->isSameMonth($month))
                ->count();

            return [
                'label' => $month->format('M'),
                'value' => $value,
            ];
        })->values();

        $maxValue = max(1, (int) $series->max('value'));

        $voices = $reviews
            ->filter(fn ($review) => $review->comment !== null && trim((string) $review->comment) !== '')
            ->take(3)
            ->map(fn ($review) => [
                'quote' => $review->comment,
                'learner' => self::displayName($review->student->name),
            ])
            ->values()
            ->all();

        return [
            'stats' => [
                'learners' => $studentIds->count(),
                'progress' => (int) round((float) ($applications->avg('progress') ?? 0)),
                'rating' => number_format($averageRating, 1),
                'reviews' => $reviews->count(),
                'offerRate' => $decided === 0 ? 0 : (int) round($offers / $decided * 100),
            ],
            'series' => $series
                ->map(fn (array $point) => [
                    ...$point,
                    'height' => (int) round($point['value'] / $maxValue * 100),
                ])
                ->all(),
            'helpfulness' => $reviews->isEmpty() ? 0 : (int) round($averageRating / 5 * 100),
            'voices' => $voices,
        ];
    }

    /**
     * Build the mentor review queue payload.
     *
     * @return array<string, mixed>
     */
    public static function reviewQueue(MentorProfile $profile): array
    {
        $items = self::reviewItems($profile, null);
        $today = CarbonImmutable::now()->startOfDay();

        $dueToday = DocumentReview::query()
            ->where('mentor_id', $profile->user_id)
            ->open()
            ->whereDate('due_at', $today->toDateString())
            ->count();

        $reviews = $profile->reviews()->get();
        $averageRating = $reviews->isEmpty() ? 0.0 : (float) $reviews->avg('rating');

        return [
            'stats' => [
                'waiting' => count($items),
                'dueToday' => $dueToday,
                'helpfulness' => $reviews->isEmpty() ? 0 : (int) round($averageRating / 5 * 100),
            ],
            'items' => $items,
        ];
    }

    /**
     * Build the mentor messages inbox payload.
     *
     * @return array<string, mixed>
     */
    public static function messages(MentorProfile $profile, ?int $mentorshipId): array
    {
        $user = $profile->user;

        $mentorships = $profile->mentorships()
            ->with(['student', 'latestMessage'])
            ->withCount(['messages as unread_count' => function ($query) use ($user): void {
                $query->where('recipient_id', $user->id)->whereNull('read_at');
            }])
            ->get()
            ->sortByDesc(fn (Mentorship $mentorship) => $mentorship->latestMessage?->created_at->timestamp ?? 0)
            ->values();

        $active = $mentorshipId === null
            ? $mentorships->first()
            : $mentorships->firstWhere('id', $mentorshipId);

        if ($active === null) {
            $active = $mentorships->first();
        }

        if ($active instanceof Mentorship) {
            MentorMessage::query()
                ->where('mentorship_id', $active->id)
                ->where('recipient_id', $user->id)
                ->whereNull('read_at')
                ->update(['read_at' => CarbonImmutable::now()]);
        }

        $thread = [];

        if ($active instanceof Mentorship) {
            $thread = $active->messages()
                ->with('sender')
                ->get()
                ->map(fn (MentorMessage $message) => [
                    'id' => $message->id,
                    'body' => $message->body,
                    'fromMentor' => $message->sender_id === $user->id,
                    'senderName' => $message->sender->name,
                    'time' => $message->created_at?->format('g:i A'),
                    'date' => $message->created_at?->isToday()
                        ? 'Today'
                        : $message->created_at?->format('j M Y'),
                    'read' => $message->read_at !== null,
                ])
                ->values()
                ->all();
        }

        return [
            'stats' => [
                'conversations' => $mentorships->count(),
                'unread' => MentorMessage::query()
                    ->where('recipient_id', $user->id)
                    ->whereNull('read_at')
                    ->count(),
            ],
            'conversations' => $mentorships
                ->map(fn (Mentorship $mentorship) => [
                    'mentorshipId' => $mentorship->id,
                    'learner' => $mentorship->student->name,
                    'initials' => self::initials($mentorship->student->name),
                    'avatarUrl' => $mentorship->student->avatar_url,
                    'goal' => $mentorship->goals,
                    'lastMessage' => $mentorship->latestMessage?->body,
                    'lastMessageAt' => $mentorship->latestMessage?->created_at?->diffForHumans(),
                    'unread' => (int) ($mentorship->unread_count ?? 0),
                    'tone' => self::accent($mentorship->id),
                    'active' => $active instanceof Mentorship && $active->id === $mentorship->id,
                ])
                ->all(),
            'active' => $active instanceof Mentorship
                ? [
                    'mentorshipId' => $active->id,
                    'learner' => $active->student->name,
                    'initials' => self::initials($active->student->name),
                    'avatarUrl' => $active->student->avatar_url,
                    'goal' => $active->goals,
                ]
                : null,
            'thread' => $thread,
        ];
    }

    /**
     * Build the mentorship state shown on a public mentor profile to a student.
     *
     * @return array<string, mixed>|null
     */
    public static function studentMentorship(MentorProfile $profile, User $student): ?array
    {
        $mentorship = Mentorship::query()
            ->where('mentor_profile_id', $profile->id)
            ->where('student_id', $student->id)
            ->with(['sessions' => fn ($query) => $query->upcoming()->orderBy('scheduled_at')])
            ->first();

        if (! $mentorship instanceof Mentorship) {
            return null;
        }

        $nextSession = $mentorship->sessions->first();

        return [
            'id' => $mentorship->id,
            'status' => $mentorship->status->value,
            'statusLabel' => $mentorship->status->label(),
            'goals' => $mentorship->goals,
            'startedAt' => $mentorship->started_at?->format('j M Y'),
            'canRequestSession' => $mentorship->status->isActive(),
            'hasPendingSession' => $mentorship->sessions->contains(
                fn (MentorSession $session) => $session->status === MentorSessionStatus::Requested,
            ),
            'nextSession' => $nextSession instanceof MentorSession
                ? [
                    'topic' => $nextSession->topic,
                    'date' => self::dateLabel($nextSession->scheduled_at),
                    'time' => $nextSession->scheduled_at->format('g:i A'),
                    'statusLabel' => $nextSession->status->label(),
                ]
                : null,
        ];
    }

    /**
     * Collect review queue items for a mentor.
     *
     * @return array<int, array<string, mixed>>
     */
    private static function reviewItems(MentorProfile $profile, ?int $limit = null): array
    {
        $query = DocumentReview::query()
            ->where('mentor_id', $profile->user_id)
            ->open()
            ->with([
                'applicationDocument.application.scholarship',
                'applicationDocument.application.student',
            ])
            ->orderByRaw('due_at is null')
            ->orderBy('due_at');

        if ($limit !== null) {
            $query->limit($limit);
        }

        return $query->get()
            ->map(fn (DocumentReview $review) => self::reviewSummary($review))
            ->values()
            ->all();
    }

    /**
     * Summarize a document review for lists.
     *
     * @return array<string, mixed>
     */
    private static function reviewSummary(DocumentReview $review): array
    {
        $document = $review->applicationDocument;
        $application = $document->application;
        $learner = $application->student;
        $isOverdue = $review->due_at !== null
            && $review->due_at->isPast()
            && $review->status->isOpen();
        $needsAttention = $review->priority->needsAttention()
            || $isOverdue
            || ($review->due_at !== null && $review->due_at->lessThanOrEqualTo(CarbonImmutable::now()->addDay()));

        return [
            'id' => $review->id,
            'learner' => $learner->name,
            'initials' => self::initials($learner->name),
            'document' => $document->title,
            'documentType' => $document->type->label(),
            'scholarship' => $application->scholarship->title,
            'submitted' => $document->submitted_at === null
                ? 'Not submitted yet'
                : 'Submitted '.$document->submitted_at->diffForHumans(),
            'due' => self::dueLabel($review->due_at),
            'dueAt' => $review->due_at?->toIso8601String(),
            'priority' => $needsAttention ? 'Needs attention' : 'On track',
            'priorityValue' => $needsAttention ? 'high' : 'normal',
            'status' => $isOverdue ? DocumentReviewStatus::Overdue->value : $review->status->value,
            'statusLabel' => $isOverdue ? DocumentReviewStatus::Overdue->label() : $review->status->label(),
            'feedback' => $review->feedback,
            'tone' => self::accent($review->id),
        ];
    }

    /**
     * Summarize a mentorship for the learners list.
     *
     * @return array<string, mixed>
     */
    private static function learnerSummary(Mentorship $mentorship): array
    {
        $student = $mentorship->student;
        $applications = $student->applications;
        $progress = (int) round((float) ($applications->avg('progress') ?? 0));

        $nextTask = $applications
            ->flatMap(fn (Application $application) => $application->tasks)
            ->first(fn ($task) => $task->completed_at === null);

        $next = $nextTask->title
            ?? $applications->first()->next_step
            ?? 'Set application goals';

        $status = $mentorship->status->label();
        $statusTone = 'active';

        if (! $mentorship->status->isActive()) {
            $statusTone = 'muted';
        } elseif ($mentorship->started_at !== null
            && $mentorship->started_at->greaterThanOrEqualTo(CarbonImmutable::now()->subDays(14))) {
            $status = 'New learner';
            $statusTone = 'new';
        } elseif ($mentorship->latestMessage === null
            || $mentorship->latestMessage->created_at === null
            || $mentorship->latestMessage->created_at->lessThan(CarbonImmutable::now()->subDays(7))) {
            $status = 'Needs a check-in';
            $statusTone = 'warn';
        }

        $nextSession = $mentorship->sessions->first();

        return [
            'id' => $mentorship->id,
            'studentId' => $student->id,
            'name' => $student->name,
            'initials' => self::initials($student->name),
            'email' => $student->email,
            'avatarUrl' => $student->avatar_url,
            'goal' => $mentorship->goals ?? $applications->first()?->scholarship->title ?? 'Scholarship preparation',
            'progress' => $progress,
            'next' => $next,
            'status' => $status,
            'statusTone' => $statusTone,
            'tone' => self::accent($mentorship->id),
            'started' => $mentorship->started_at?->diffForHumans(),
            'applicationCount' => $applications->count(),
            'nextSession' => $nextSession instanceof MentorSession
                ? [
                    'topic' => $nextSession->topic,
                    'date' => self::dateLabel($nextSession->scheduled_at),
                    'time' => $nextSession->scheduled_at->format('g:i A'),
                ]
                : null,
            'messageUrl' => '/mentor-messages?mentorship='.$mentorship->id,
        ];
    }

    /**
     * Summarize a session for dashboard lists.
     *
     * @return array<string, mixed>
     */
    private static function sessionSummary(MentorSession $session): array
    {
        $student = $session->mentorship->student;

        return [
            'id' => $session->id,
            'learner' => $student->name,
            'initials' => self::initials($student->name),
            'topic' => $session->topic,
            'time' => $session->scheduled_at->format('g:i A'),
            'date' => self::dateLabel($session->scheduled_at),
            'status' => $session->status->value,
            'statusLabel' => $session->status->label(),
            'tone' => self::accent($session->id),
        ];
    }

    /**
     * Summarize a session for the sessions page.
     *
     * @return array<string, mixed>
     */
    private static function sessionDetail(MentorSession $session): array
    {
        $student = $session->mentorship->student;

        return [
            ...self::sessionSummary($session),
            'mentorshipId' => $session->mentorship_id,
            'scheduledAt' => $session->scheduled_at->toIso8601String(),
            'dateLabel' => $session->scheduled_at->format('D j M'),
            'duration' => $session->duration_minutes.' min',
            'meetingUrl' => $session->meeting_url,
            'notes' => $session->notes,
            'attendance' => $session->attendance_status?->value,
            'attendanceLabel' => $session->attendance_status?->label(),
            'requestedByStudent' => $session->requested_by === $student->id,
        ];
    }

    /**
     * Summarize the latest message in a mentorship.
     *
     * @return array<string, mixed>
     */
    private static function messageSummary(Mentorship $mentorship): array
    {
        $message = $mentorship->latestMessage;
        $student = $mentorship->student;

        return [
            'mentorshipId' => $mentorship->id,
            'learner' => $student->name,
            'initials' => self::initials($student->name),
            'message' => Str::limit((string) $message?->body, 60),
            'time' => $message?->created_at?->diffForHumans(),
            'tone' => self::accent($mentorship->id),
            'unread' => $message !== null && $message->read_at === null,
        ];
    }

    /**
     * Format a session date into a human label.
     */
    private static function dateLabel(CarbonImmutable $date): string
    {
        $days = (int) CarbonImmutable::now()->startOfDay()->diffInDays($date->startOfDay(), false);

        return match ($days) {
            -1 => 'Yesterday',
            0 => 'Today',
            1 => 'Tomorrow',
            default => $date->format('D j M'),
        };
    }

    /**
     * Format a review due date into a human label.
     */
    private static function dueLabel(?CarbonImmutable $due): string
    {
        if ($due === null) {
            return 'No due date';
        }

        $days = (int) CarbonImmutable::now()->startOfDay()->diffInDays($due->startOfDay(), false);

        if ($days < 0) {
            $count = abs($days);

            return 'Overdue by '.$count.' '.Str::plural('day', $count);
        }

        return match ($days) {
            0 => 'Due today',
            1 => 'Due tomorrow',
            default => 'Due in '.$days.' days',
        };
    }

    /**
     * Format a number of minutes as an hour label.
     */
    private static function durationLabel(int $minutes): string
    {
        $hours = (int) round($minutes / 60);

        if ($hours < 1) {
            return max(1, $minutes).' min';
        }

        return $hours.' '.($hours === 1 ? 'hr' : 'hrs');
    }

    /**
     * Format available minutes as an hour label.
     */
    private static function hoursLabel(int $minutes): string
    {
        $hours = $minutes / 60;

        if ($hours < 1) {
            return $minutes.' min';
        }

        return rtrim(rtrim(number_format($hours, 1), '0'), '.').' hrs';
    }

    /**
     * Get initials for a display name.
     */
    private static function initials(string $name): string
    {
        $parts = preg_split('/\s+/', trim($name)) ?: [];

        return strtoupper(
            substr($parts[0] ?? 'M', 0, 1).substr($parts[1] ?? '', 0, 1),
        );
    }

    /**
     * Get a short name for learner voices.
     */
    private static function displayName(string $name): string
    {
        $parts = preg_split('/\s+/', trim($name)) ?: [];

        if (count($parts) < 2) {
            return $parts[0] ?? 'Learner';
        }

        return $parts[0].' '.strtoupper(substr($parts[1], 0, 1)).'.';
    }

    /**
     * Pick a deterministic accent colour.
     */
    private static function accent(int $id): string
    {
        return ['blue', 'teal', 'coral', 'gold'][$id % 4];
    }
}
