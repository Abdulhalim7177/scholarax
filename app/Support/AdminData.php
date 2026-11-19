<?php

namespace App\Support;

use App\Enums\MentorshipStatus;
use App\Enums\ReportExportStatus;
use App\Enums\ReportStatus;
use App\Enums\ScholarshipStatus;
use App\Enums\VerificationStatus;
use App\Models\Application;
use App\Models\ContentReport;
use App\Models\MentorProfile;
use App\Models\Mentorship;
use App\Models\ReportExport;
use App\Models\Scholarship;
use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Throwable;

final class AdminData
{
    /**
     * Build the admin dashboard payload from live records.
     *
     * @return array<string, mixed>
     */
    public static function dashboard(): array
    {
        $now = CarbonImmutable::now();
        $monthStart = $now->startOfMonth();
        $previousMonthStart = $monthStart->subMonthNoOverflow();

        $totalUsers = User::query()->count();
        $usersThisMonth = User::query()->where('created_at', '>=', $monthStart)->count();
        $usersLastMonth = User::query()
            ->where('created_at', '>=', $previousMonthStart)
            ->where('created_at', '<', $monthStart)
            ->count();

        $liveScholarships = Scholarship::query()->live()->count();
        $scholarshipsThisMonth = Scholarship::query()->where('created_at', '>=', $monthStart)->count();
        $applications = Application::query()->count();
        $submittedThisWeek = Application::query()->where('submitted_at', '>=', $now->subWeek())->count();
        $activeMentorships = Mentorship::query()->active()->count();
        $verifiedMentors = MentorProfile::query()->verified()->count();

        $pendingScholarships = Scholarship::query()
            ->where('status', ScholarshipStatus::Pending)
            ->count();
        $pendingMentors = MentorProfile::query()
            ->where('verification_status', VerificationStatus::Pending)
            ->count();
        $openReports = ContentReport::query()
            ->where('status', ReportStatus::Open)
            ->count();

        return [
            'stats' => [
                'totalUsers' => $totalUsers,
                'usersThisMonth' => $usersThisMonth,
                'usersGrowth' => self::growth($usersThisMonth, $usersLastMonth),
                'liveScholarships' => $liveScholarships,
                'scholarshipsThisMonth' => $scholarshipsThisMonth,
                'applicationsTracked' => $applications,
                'submittedThisWeek' => $submittedThisWeek,
                'activeMentorships' => $activeMentorships,
                'verifiedMentors' => $verifiedMentors,
            ],
            'moderation' => [
                'openTasks' => $pendingScholarships + $pendingMentors + $openReports,
                'items' => [
                    [
                        'key' => 'scholarships',
                        'label' => 'Scholarship submissions',
                        'count' => $pendingScholarships,
                        'note' => 'New opportunities waiting for review',
                        'href' => '/admin-scholarships?status=pending',
                        'tone' => 'blue',
                    ],
                    [
                        'key' => 'mentors',
                        'label' => 'Mentor applications',
                        'count' => $pendingMentors,
                        'note' => 'Profiles awaiting verification',
                        'href' => '/admin-mentors?status=pending',
                        'tone' => 'teal',
                    ],
                    [
                        'key' => 'reports',
                        'label' => 'Reported content',
                        'count' => $openReports,
                        'note' => 'Reports need an admin decision',
                        'href' => '/admin-moderation',
                        'tone' => 'coral',
                    ],
                ],
            ],
            'recentUsers' => User::query()
                ->latest()
                ->take(4)
                ->get()
                ->map(fn (User $user) => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role->value,
                    'roleLabel' => $user->role->label(),
                    'initials' => self::initials($user->name),
                    'tone' => self::accent($user->id),
                    'joinedAt' => $user->created_at?->toIso8601String(),
                ])
                ->all(),
            'checks' => self::checks(),
            'checkedAt' => $now->toIso8601String(),
        ];
    }

    /**
     * Build the platform report aggregates.
     *
     * @return array<string, mixed>
     */
    public static function reports(): array
    {
        $now = CarbonImmutable::now();
        $windowStart = $now->subDays(30);
        $previousWindowStart = $now->subDays(60);

        $activeNow = DB::table('activity_events')
            ->where('created_at', '>=', $windowStart)
            ->distinct()
            ->count('user_id');
        $activeBefore = DB::table('activity_events')
            ->where('created_at', '>=', $previousWindowStart)
            ->where('created_at', '<', $windowStart)
            ->distinct()
            ->count('user_id');

        $averageProgress = (int) round((float) (Application::query()->avg('progress') ?? 0));
        $previousProgress = (int) round((float) (Application::query()
            ->where('created_at', '<', $now->startOfMonth())
            ->avg('progress') ?? 0));

        $mentorships = Mentorship::query()->count();
        $activeMentorships = Mentorship::query()->where('status', MentorshipStatus::Active)->count();
        $matchRate = $mentorships === 0 ? 0 : (int) round($activeMentorships / $mentorships * 100);

        $reviews = DB::table('mentor_reviews')
            ->where('is_published', true);
        $reviewCount = (clone $reviews)->count();
        $averageRating = (float) ((clone $reviews)->avg('rating') ?? 0);
        $satisfaction = (int) round($averageRating / 5 * 100);

        $series = [];
        $maxValue = 0;

        for ($index = 5; $index >= 0; $index--) {
            $start = $now->startOfMonth()->subMonthsNoOverflow($index);
            $end = $start->addMonthNoOverflow();

            $users = User::query()
                ->where('created_at', '>=', $start)
                ->where('created_at', '<', $end)
                ->count();
            $applications = Application::query()
                ->where('created_at', '>=', $start)
                ->where('created_at', '<', $end)
                ->count();

            $maxValue = max($maxValue, $users, $applications);

            $series[] = [
                'label' => $start->format('M'),
                'users' => $users,
                'applications' => $applications,
            ];
        }

        $series = array_map(function (array $point) use ($maxValue): array {
            return [
                ...$point,
                'usersHeight' => self::height($point['users'], $maxValue),
                'applicationsHeight' => self::height($point['applications'], $maxValue),
            ];
        }, $series);

        $destinations = self::destinations();

        return [
            'stats' => [
                'activeUsers' => [
                    'value' => $activeNow,
                    'change' => self::growth($activeNow, $activeBefore),
                ],
                'completion' => [
                    'value' => $averageProgress,
                    'change' => $previousProgress === 0 ? 0 : $averageProgress - $previousProgress,
                ],
                'matchRate' => [
                    'value' => $matchRate,
                    'change' => 0,
                ],
                'satisfaction' => [
                    'value' => $satisfaction,
                    'responses' => $reviewCount,
                ],
            ],
            'series' => $series,
            'destinations' => $destinations,
            'exports' => self::exports(),
            'generatedAt' => $now->toIso8601String(),
        ];
    }

    /**
     * Build the CSV contents for a platform export.
     */
    public static function reportCsv(): string
    {
        $report = self::reports();
        $lines = [
            ['Metric', 'Value'],
            ['Monthly active users', $report['stats']['activeUsers']['value']],
            ['Application completion', $report['stats']['completion']['value'].'%'],
            ['Mentor match success', $report['stats']['matchRate']['value'].'%'],
            ['Platform satisfaction', $report['stats']['satisfaction']['value'].'%'],
            ['Satisfaction responses', $report['stats']['satisfaction']['responses']],
            [],
            ['Month', 'New users', 'Applications'],
        ];

        foreach ($report['series'] as $point) {
            $lines[] = [$point['label'], $point['users'], $point['applications']];
        }

        $lines[] = [];
        $lines[] = ['Destination', 'Applications', 'Share'];

        foreach ($report['destinations'] as $destination) {
            $lines[] = [
                $destination['country'],
                $destination['count'],
                $destination['percent'].'%',
            ];
        }

        $handle = fopen('php://temp', 'r+');
        assert($handle !== false);

        foreach ($lines as $line) {
            fputcsv($handle, $line);
        }

        rewind($handle);
        $csv = (string) stream_get_contents($handle);
        fclose($handle);

        return $csv;
    }

    /**
     * Store a generated report export on the private disk.
     */
    public static function storeExportFile(ReportExport $export): int
    {
        $path = 'reports/platform-report-'.$export->id.'-'.now()->format('Ymd-His').'.csv';
        $csv = self::reportCsv();

        Storage::disk('local')->put($path, $csv);

        $rows = max(0, substr_count($csv, "\n") - 1);

        $export->forceFill([
            'status' => ReportExportStatus::Completed,
            'path' => $path,
            'rows' => $rows,
            'error' => null,
            'completed_at' => now(),
        ])->save();

        return $rows;
    }

    /**
     * Build the recent export queue entries.
     *
     * @return array<int, array<string, mixed>>
     */
    private static function exports(): array
    {
        return ReportExport::query()
            ->latest()
            ->take(5)
            ->get()
            ->map(fn (ReportExport $export) => [
                'id' => $export->id,
                'status' => $export->status->value,
                'statusLabel' => $export->status->label(),
                'rows' => $export->rows,
                'requestedAt' => $export->created_at?->toIso8601String(),
                'completedAt' => $export->completed_at?->toIso8601String(),
                'downloadUrl' => $export->status === ReportExportStatus::Completed && $export->path !== null
                    ? route('admin-reports.exports.download', $export)
                    : null,
            ])
            ->all();
    }

    /**
     * Build the top application destinations.
     *
     * @return array<int, array<string, mixed>>
     */
    private static function destinations(): array
    {
        $rows = DB::table('applications')
            ->join('scholarships', 'applications.scholarship_id', '=', 'scholarships.id')
            ->leftJoin('countries', 'scholarships.host_country_id', '=', 'countries.id')
            ->whereNull('applications.deleted_at')
            ->selectRaw("COALESCE(countries.name, 'Multiple countries') as country, COUNT(*) as total")
            ->groupBy('country')
            ->orderByDesc('total')
            ->limit(4)
            ->get();

        $total = (int) $rows->sum('total');

        if ($total === 0) {
            return [];
        }

        return $rows->map(fn (object $row) => [
            'country' => (string) $row->country,
            'count' => (int) $row->total,
            'percent' => (int) round((int) $row->total / $total * 100),
        ])->all();
    }

    /**
     * Run lightweight platform health checks.
     *
     * @return array<int, array{label: string, ok: bool, note: string}>
     */
    private static function checks(): array
    {
        try {
            DB::connection()->getPdo();
            $database = true;
        } catch (Throwable) {
            $database = false;
        }

        return [
            [
                'label' => 'Database',
                'ok' => $database,
                'note' => $database ? 'Connected' : 'Unavailable',
            ],
            [
                'label' => 'Document storage',
                'ok' => is_writable(storage_path('app')),
                'note' => is_writable(storage_path('app')) ? 'Writable' : 'Read only',
            ],
            [
                'label' => 'Queue',
                'ok' => config('queue.default') !== null,
                'note' => (string) config('queue.default'),
            ],
            [
                'label' => 'Mail delivery',
                'ok' => config('mail.default') !== null,
                'note' => (string) config('mail.default'),
            ],
        ];
    }

    /**
     * Calculate percentage growth between two periods.
     */
    private static function growth(int $current, int $previous): float
    {
        if ($previous === 0) {
            return $current > 0 ? 100.0 : 0.0;
        }

        return round((($current - $previous) / $previous) * 100, 1);
    }

    /**
     * Scale a value into a chart height percentage.
     */
    private static function height(int $value, int $max): int
    {
        if ($max <= 0 || $value <= 0) {
            return 0;
        }

        return max(4, (int) round($value / $max * 100));
    }

    /**
     * Get initials for a display name.
     */
    public static function initials(string $name): string
    {
        $parts = preg_split('/\s+/', trim($name)) ?: [];

        return strtoupper(
            substr($parts[0] ?? 'U', 0, 1).substr($parts[1] ?? '', 0, 1),
        );
    }

    /**
     * Pick a stable accent tone for a record.
     */
    public static function accent(int $id): string
    {
        return ['blue', 'teal', 'coral', 'gold'][$id % 4];
    }
}
