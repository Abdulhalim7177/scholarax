<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\ContentReport;
use App\Models\User;

class ContentReportPolicy
{
    /**
     * Determine whether the user can triage content reports.
     */
    public function resolve(User $user, ContentReport $report): bool
    {
        return $user->role === UserRole::Admin && $report->status->isOpen();
    }
}
