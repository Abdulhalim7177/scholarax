<?php

namespace App\Http\Controllers;

use App\Models\Scholarship;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class SavedScholarshipController extends Controller
{
    /**
     * Save a scholarship for the current user.
     */
    public function store(Request $request, Scholarship $scholarship): RedirectResponse
    {
        Gate::authorize('view', $scholarship);

        $request->user()->savedScholarships()->syncWithoutDetaching([$scholarship->id]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Scholarship saved.'),
        ]);

        return back();
    }

    /**
     * Remove a scholarship from the current user's saved list.
     */
    public function destroy(Request $request, Scholarship $scholarship): RedirectResponse
    {
        $request->user()->savedScholarships()->detach($scholarship->id);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Scholarship removed from your saved list.'),
        ]);

        return back();
    }
}
