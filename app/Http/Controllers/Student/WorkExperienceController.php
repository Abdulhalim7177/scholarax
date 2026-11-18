<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Http\Requests\Student\WorkExperienceRequest;
use App\Models\WorkExperience;
use App\Support\ActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WorkExperienceController extends Controller
{
    /**
     * Add a work experience record for the current user.
     */
    public function store(WorkExperienceRequest $request): RedirectResponse
    {
        $user = $request->user();
        $data = $request->validated();

        if ((bool) ($data['is_current'] ?? false)) {
            $data['ended_at'] = null;
        }

        $experience = $user->workExperiences()->create($data);

        ActivityLogger::log(
            $user,
            'profile_updated',
            'Added work experience',
            $experience->role.' at '.$experience->organization,
            $experience,
        );

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Work experience added.')]);

        return back();
    }

    /**
     * Update a work experience record owned by the current user.
     */
    public function update(WorkExperienceRequest $request, WorkExperience $workExperience): RedirectResponse
    {
        $this->ensureOwnership($request, $workExperience);

        $data = $request->validated();

        if ((bool) ($data['is_current'] ?? false)) {
            $data['ended_at'] = null;
        }

        $workExperience->update($data);

        ActivityLogger::log(
            $request->user(),
            'profile_updated',
            'Updated work experience',
            $workExperience->role.' at '.$workExperience->organization,
            $workExperience,
        );

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Work experience updated.')]);

        return back();
    }

    /**
     * Remove a work experience record owned by the current user.
     */
    public function destroy(Request $request, WorkExperience $workExperience): RedirectResponse
    {
        $this->ensureOwnership($request, $workExperience);

        $workExperience->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Work experience removed.')]);

        return back();
    }

    /**
     * Ensure the work experience belongs to the current user.
     */
    private function ensureOwnership(Request $request, WorkExperience $workExperience): void
    {
        abort_unless($workExperience->user_id === $request->user()?->id, 403);
    }
}
