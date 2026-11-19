<?php

namespace App\Jobs;

use App\Enums\ReportExportStatus;
use App\Models\ReportExport;
use App\Support\AdminData;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Throwable;

class GenerateReportExport implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(public ReportExport $export) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $this->export->forceFill([
            'status' => ReportExportStatus::Processing,
            'error' => null,
        ])->save();

        try {
            AdminData::storeExportFile($this->export);
        } catch (Throwable $exception) {
            report($exception);

            $this->export->forceFill([
                'status' => ReportExportStatus::Failed,
                'error' => $exception->getMessage(),
            ])->save();
        }
    }
}
