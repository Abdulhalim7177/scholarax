<?php

namespace App\Support;

use App\Models\ActivityEvent;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

final class ActivityLogger
{
    /**
     * Record an activity event for a user.
     *
     * @param  array<string, mixed>  $metadata
     */
    public static function log(
        User $user,
        string $type,
        string $title,
        ?string $body = null,
        ?Model $subject = null,
        array $metadata = [],
    ): ActivityEvent {
        return $user->activityEvents()->create([
            'type' => $type,
            'title' => $title,
            'body' => $body,
            'subject_type' => $subject === null ? null : $subject::class,
            'subject_id' => $subject?->getKey(),
            'metadata' => $metadata === [] ? null : $metadata,
        ]);
    }
}
