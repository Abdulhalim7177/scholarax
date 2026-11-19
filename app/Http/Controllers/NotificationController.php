<?php

namespace App\Http\Controllers;

use App\Models\ActivityEvent;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NotificationController extends Controller
{
    /**
     * Display the signed-in user's activity notifications.
     */
    public function __invoke(Request $request): Response
    {
        $notifications = $request->user()
            ->activityEvents()
            ->paginate(20)
            ->withQueryString()
            ->through(fn (ActivityEvent $event) => [
                'id' => $event->id,
                'type' => $event->type,
                'title' => $event->title,
                'body' => $event->body,
                'createdAt' => $event->created_at?->toIso8601String(),
            ]);

        return Inertia::render('notifications', [
            'notifications' => $notifications,
        ]);
    }
}
