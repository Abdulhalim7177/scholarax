<?php

namespace App\Models;

use Carbon\CarbonImmutable;
use Database\Factories\MentorMessageFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $mentorship_id
 * @property int $sender_id
 * @property int $recipient_id
 * @property string $body
 * @property CarbonImmutable|null $read_at
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read Mentorship $mentorship
 * @property-read User $sender
 * @property-read User $recipient
 */
#[Fillable([
    'mentorship_id',
    'sender_id',
    'recipient_id',
    'body',
    'read_at',
])]
class MentorMessage extends Model
{
    /** @use HasFactory<MentorMessageFactory> */
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'read_at' => 'datetime',
        ];
    }

    /**
     * Get the mentorship the message belongs to.
     *
     * @return BelongsTo<Mentorship, $this>
     */
    public function mentorship(): BelongsTo
    {
        return $this->belongsTo(Mentorship::class);
    }

    /**
     * Get the message sender.
     *
     * @return BelongsTo<User, $this>
     */
    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    /**
     * Get the message recipient.
     *
     * @return BelongsTo<User, $this>
     */
    public function recipient(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recipient_id');
    }

    /**
     * Limit the query to unread messages.
     *
     * @param  Builder<MentorMessage>  $query
     */
    public function scopeUnread(Builder $query): void
    {
        $query->whereNull('read_at');
    }

    /**
     * Mark the message as read.
     */
    public function markAsRead(): void
    {
        if ($this->read_at !== null) {
            return;
        }

        $this->forceFill(['read_at' => CarbonImmutable::now()])->save();
    }
}
