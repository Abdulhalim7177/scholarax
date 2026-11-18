<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Http\Requests\Student\TestScoreRequest;
use App\Models\TestScore;
use App\Support\ActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TestScoreController extends Controller
{
    /**
     * Add a test score for the current user.
     */
    public function store(TestScoreRequest $request): RedirectResponse
    {
        $user = $request->user();

        $score = $user->testScores()->create($request->validated());

        ActivityLogger::log(
            $user,
            'profile_updated',
            'Added a test score',
            $score->type.' score: '.$score->score,
            $score,
        );

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Test score added.')]);

        return back();
    }

    /**
     * Update a test score owned by the current user.
     */
    public function update(TestScoreRequest $request, TestScore $testScore): RedirectResponse
    {
        $this->ensureOwnership($request, $testScore);

        $testScore->update($request->validated());

        ActivityLogger::log(
            $request->user(),
            'profile_updated',
            'Updated a test score',
            $testScore->type.' score: '.$testScore->score,
            $testScore,
        );

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Test score updated.')]);

        return back();
    }

    /**
     * Remove a test score owned by the current user.
     */
    public function destroy(Request $request, TestScore $testScore): RedirectResponse
    {
        $this->ensureOwnership($request, $testScore);

        $testScore->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Test score removed.')]);

        return back();
    }

    /**
     * Ensure the test score belongs to the current user.
     */
    private function ensureOwnership(Request $request, TestScore $testScore): void
    {
        abort_unless($testScore->user_id === $request->user()?->id, 403);
    }
}
