<?php

namespace App\Policies;

use App\Enums\ReportExportStatus;
use App\Enums\UserRole;
use App\Models\ReportExport;
use App\Models\User;

class ReportExportPolicy
{
    /**
     * Determine whether the user can download the generated export.
     */
    public function download(User $user, ReportExport $export): bool
    {
        return $user->role === UserRole::Admin
            && $export->status === ReportExportStatus::Completed
            && $export->path !== null;
    }
}
