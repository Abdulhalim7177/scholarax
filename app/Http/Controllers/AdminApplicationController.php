<?php

namespace App\Http\Controllers;

use App\Enums\ApplicationStatus;
use App\Models\Application;
use App\Support\AdminData;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminApplicationController extends Controller
{
    /**
     * Display the platform application monitor.
     */
    public function index(Request $request): Response
    {
        $filters = [
            'q' => trim((string) $request->input('q', '')),
            'stage' => (string) $request->input('stage', ''),
        ];

        $query = Application::query()
            ->with(['student:id,name,email', 'scholarship:id,title,slug']);

        $status = ApplicationStatus::tryFrom($filters['stage']);

        if ($status !== null) {
            $query->where('status', $status);
        }

        if ($filters['q'] !== '') {
            $like = '%'.$filters['q'].'%';

            $query->where(function (Builder $query) use ($like): void {
                $query
                    ->whereHas('student', fn (Builder $student) => $student
                        ->where('name', 'like', $like)
                        ->orWhere('email', 'like', $like))
                    ->orWhereHas('scholarship', fn (Builder $scholarship) => $scholarship
                        ->where('title', 'like', $like));
            });
        }

        $applications = $query
            ->latest('updated_at')
            ->paginate(10)
            ->withQueryString()
            ->through(fn (Application $application) => [
                'id' => $application->id,
                'learner' => $application->student->name,
                'learnerEmail' => $application->student->email,
                'scholarship' => $application->scholarship->title,
                'stage' => $application->status->value,
                'stageLabel' => $application->status->label(),
                'progress' => $application->progress,
                'risk' => $this->needsAttention($application) ? 'needs_check' : 'normal',
                'submittedAt' => ($application->submitted_at ?? $application->updated_at)?->toIso8601String(),
                'deadlineAt' => $application->deadline_at?->toIso8601String(),
                'initials' => AdminData::initials($application->student->name),
                'tone' => AdminData::accent($application->id),
            ]);

        $attentionWindow = CarbonImmutable::now()->addDays(14);

        return Inertia::render('admin-applications', [
            'applications' => $applications,
            'filters' => $filters,
            'stages' => [
                ['value' => '', 'label' => 'All applications'],
                ...collect(ApplicationStatus::cases())
                    ->map(fn (ApplicationStatus $status) => [
                        'value' => $status->value,
                        'label' => $status->label(),
                    ])
                    ->all(),
            ],
            'stats' => [
                'tracked' => Application::query()->count(),
                'submittedThisWeek' => Application::query()
                    ->where('submitted_at', '>=', now()->subWeek())
                    ->count(),
                'needsAttention' => Application::query()
                    ->whereIn('status', [ApplicationStatus::Draft, ApplicationStatus::InReview])
                    ->whereNotNull('deadline_at')
                    ->where('deadline_at', '<=', $attentionWindow)
                    ->where('progress', '<', 100)
                    ->count(),
            ],
        ]);
    }

    /**
     * Determine whether an application needs an admin look.
     */
    private function needsAttention(Application $application): bool
    {
        if (! $application->status->isActive() || $application->progress >= 100) {
            return false;
        }

        return $application->deadline_at !== null
            && $application->deadline_at->lessThanOrEqualTo(CarbonImmutable::now()->addDays(14));
    }
}
