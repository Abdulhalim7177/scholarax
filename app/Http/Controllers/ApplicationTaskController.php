<?php

namespace App\Http\Controllers;

use App\Http\Requests\Student\ApplicationTaskRequest;
use App\Models\Application;
use App\Models\ApplicationTask;
use App\Support\ActivityLogger;
use Carbon\CarbonImmutable;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class ApplicationTaskController extends Controller
{
    /**
     * Add a task to an application.
     */
    public function store(ApplicationTaskRequest $request, Application $application): RedirectResponse
    {
        Gate::authorize('update', $application);

        $data = $request->validated();

        $application->tasks()->create([
            'title' => (string) $data['title'],
            'description' => $data['description'] ?? null,
            'due_at' => $data['due_at'] ?? null,
            'completed_at' => null,
            'sort_order' => (int) $application->tasks()->max('sort_order') + 1,
            'type' => $data['type'] ?? null,
        ]);

        $application->recalculateProgress();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Task added.')]);

        return back();
    }

    /**
     * Update or complete a task.
     */
    public function update(
        ApplicationTaskRequest $request,
        Application $application,
        ApplicationTask $task,
    ): RedirectResponse {
        Gate::authorize('update', $application);
        $this->ensureBelongsToApplication($task, $application);

        $data = $request->validated();

        if (array_key_exists('title', $data)) {
            $task->title = (string) $data['title'];
        }

        if (array_key_exists('description', $data)) {
            $task->description = $data['description'];
        }

        if (array_key_exists('due_at', $data)) {
            $task->due_at = $data['due_at'];
        }

        if (array_key_exists('completed', $data)) {
            $completed = (bool) $data['completed'];
            $task->completed_at = $completed ? ($task->completed_at ?? CarbonImmutable::now()) : null;
        }

        $task->save();
        $application->recalculateProgress();

        if (array_key_exists('completed', $data) && (bool) $data['completed']) {
            ActivityLogger::log(
                $request->user(),
                'task_completed',
                'Completed a task',
                $task->title,
                $application,
            );
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Task updated.')]);

        return back();
    }

    /**
     * Remove a task from an application.
     */
    public function destroy(Request $request, Application $application, ApplicationTask $task): RedirectResponse
    {
        Gate::authorize('update', $application);
        $this->ensureBelongsToApplication($task, $application);

        $task->delete();
        $application->recalculateProgress();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Task removed.')]);

        return back();
    }

    /**
     * Ensure the task belongs to the given application.
     */
    private function ensureBelongsToApplication(ApplicationTask $task, Application $application): void
    {
        abort_unless($task->application_id === $application->id, 404);
    }
}
