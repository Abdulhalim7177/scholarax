<?php

namespace App\Http\Controllers;

use App\Enums\ReportStatus;
use App\Http\Requests\Admin\ModerationResolutionRequest;
use App\Models\ContentReport;
use App\Models\MentorMessage;
use App\Models\MentorProfile;
use App\Models\Scholarship;
use App\Models\User;
use App\Support\ActivityLogger;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AdminModerationController extends Controller
{
    /**
     * Display the moderation queue.
     */
    public function index(Request $request): Response
    {
        $filters = [
            'q' => trim((string) $request->input('q', '')),
            'status' => (string) $request->input('status', ReportStatus::Open->value),
        ];

        $query = ContentReport::query()->with(['reporter', 'resolver', 'reportable']);

        $status = ReportStatus::tryFrom($filters['status']);

        if ($status !== null) {
            $query->where('status', $status);
        }

        if ($filters['q'] !== '') {
            $like = '%'.$filters['q'].'%';

            $query->where(function (Builder $query) use ($like): void {
                $query
                    ->where('details', 'like', $like)
                    ->orWhere('reason', 'like', $like)
                    ->orWhereHas('reporter', fn (Builder $reporter) => $reporter
                        ->where('name', 'like', $like)
                        ->orWhere('email', 'like', $like));
            });
        }

        $reports = $query
            ->latest()
            ->paginate(10)
            ->withQueryString()
            ->through(fn (ContentReport $report) => $this->reportRow($report));

        return Inertia::render('admin-moderation', [
            'reports' => $reports,
            'filters' => $filters,
            'statuses' => [
                ['value' => ReportStatus::Open->value, 'label' => 'Open'],
                ['value' => ReportStatus::Resolved->value, 'label' => 'Resolved'],
                ['value' => ReportStatus::Dismissed->value, 'label' => 'Dismissed'],
            ],
            'stats' => [
                'open' => ContentReport::query()->where('status', ReportStatus::Open)->count(),
                'resolvedThisWeek' => ContentReport::query()
                    ->where('status', ReportStatus::Resolved)
                    ->where('resolved_at', '>=', now()->subWeek())
                    ->count(),
                'dismissed' => ContentReport::query()->where('status', ReportStatus::Dismissed)->count(),
            ],
        ]);
    }

    /**
     * Resolve a reported content item.
     */
    public function resolve(ModerationResolutionRequest $request, ContentReport $contentReport): RedirectResponse
    {
        Gate::authorize('resolve', $contentReport);

        $contentReport->forceFill([
            'status' => ReportStatus::Resolved,
            'resolved_by' => $request->user()->id,
            'resolved_at' => now(),
            'resolution_note' => $request->validated('resolution_note'),
        ])->save();

        $this->logDecision($contentReport, 'Your report was reviewed', 'The reported content was actioned.');

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Report resolved.')]);

        return back();
    }

    /**
     * Dismiss a reported content item.
     */
    public function dismiss(Request $request, ContentReport $contentReport): RedirectResponse
    {
        Gate::authorize('resolve', $contentReport);

        $contentReport->forceFill([
            'status' => ReportStatus::Dismissed,
            'resolved_by' => $request->user()->id,
            'resolved_at' => now(),
        ])->save();

        $this->logDecision($contentReport, 'Your report was closed', 'No action was needed this time.');

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Report dismissed.')]);

        return back();
    }

    /**
     * Build a single moderation row.
     *
     * @return array<string, mixed>
     */
    private function reportRow(ContentReport $report): array
    {
        $target = $report->reportable;

        [$targetType, $targetLabel, $targetUrl] = match (true) {
            $target instanceof MentorProfile => [
                'Mentor profile',
                $target->user->name,
                route('mentors.show', $target),
            ],
            $target instanceof Scholarship => [
                'Scholarship',
                $target->title,
                route('scholarships.show', $target),
            ],
            $target instanceof MentorMessage => [
                'Message',
                Str::limit($target->body, 60),
                null,
            ],
            default => [
                $target === null ? 'Deleted content' : class_basename($target),
                $target === null ? 'The reported record no longer exists' : 'Reported record',
                null,
            ],
        };

        return [
            'id' => $report->id,
            'targetType' => $targetType,
            'targetLabel' => $targetLabel,
            'targetUrl' => $targetUrl,
            'reason' => $report->reason->value,
            'reasonLabel' => $report->reason->label(),
            'details' => $report->details,
            'reporter' => $report->reporter instanceof User ? $report->reporter->name : 'Deleted user',
            'status' => $report->status->value,
            'statusLabel' => $report->status->label(),
            'resolutionNote' => $report->resolution_note,
            'resolvedAt' => $report->resolved_at?->toIso8601String(),
            'createdAt' => $report->created_at?->toIso8601String(),
        ];
    }

    /**
     * Notify the reporter about the moderation decision.
     */
    private function logDecision(ContentReport $report, string $title, string $body): void
    {
        $reporter = $report->reporter;

        if ($reporter === null) {
            return;
        }

        ActivityLogger::log(
            $reporter,
            'moderation_decision',
            $title,
            $body,
            $report,
        );
    }
}
