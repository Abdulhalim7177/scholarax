<?php

namespace App\Http\Controllers;

use App\Enums\ReportExportStatus;
use App\Jobs\GenerateReportExport;
use App\Models\ReportExport;
use App\Support\AdminData;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AdminReportController extends Controller
{
    /**
     * Display platform reports and insight aggregates.
     */
    public function index(): Response
    {
        return Inertia::render('admin-reports', AdminData::reports());
    }

    /**
     * Queue a fresh platform export.
     */
    public function export(Request $request): RedirectResponse
    {
        $export = ReportExport::query()->create([
            'user_id' => $request->user()->id,
            'status' => ReportExportStatus::Pending,
        ]);

        GenerateReportExport::dispatchSync($export);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Your report export is being prepared.'),
        ]);

        return back();
    }

    /**
     * Download a completed export.
     */
    public function download(ReportExport $reportExport): StreamedResponse
    {
        Gate::authorize('download', $reportExport);

        $disk = Storage::disk('local');

        abort_unless($reportExport->path !== null && $disk->exists($reportExport->path), 404);

        return $disk->download($reportExport->path, 'scholarax-platform-report.csv');
    }
}
