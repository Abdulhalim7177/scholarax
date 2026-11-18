<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Http\Requests\Student\EducationRequest;
use App\Models\Education;
use App\Support\ActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EducationController extends Controller
{
    /**
     * Add an education record for the current user.
     */
    public function store(EducationRequest $request): RedirectResponse
    {
        $user = $request->user();
        $data = $request->validated();

        if ((bool) ($data['is_current'] ?? false)) {
            $data['ended_at'] = null;
        }

        $education = $user->educations()->create($data);

        ActivityLogger::log(
            $user,
            'profile_updated',
            'Added an education record',
            $education->degree.' at '.$education->institution,
            $education,
        );

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Education added.')]);

        return back();
    }

    /**
     * Update an education record owned by the current user.
     */
    public function update(EducationRequest $request, Education $education): RedirectResponse
    {
        $this->ensureOwnership($request, $education);

        $data = $request->validated();

        if ((bool) ($data['is_current'] ?? false)) {
            $data['ended_at'] = null;
        }

        $education->update($data);

        ActivityLogger::log(
            $request->user(),
            'profile_updated',
            'Updated an education record',
            $education->degree.' at '.$education->institution,
            $education,
        );

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Education updated.')]);

        return back();
    }

    /**
     * Remove an education record owned by the current user.
     */
    public function destroy(Request $request, Education $education): RedirectResponse
    {
        $this->ensureOwnership($request, $education);

        $education->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Education removed.')]);

        return back();
    }

    /**
     * Ensure the education record belongs to the current user.
     */
    private function ensureOwnership(Request $request, Education $education): void
    {
        abort_unless($education->user_id === $request->user()?->id, 403);
    }
}
