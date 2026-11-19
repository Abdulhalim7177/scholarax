<?php

namespace App\Models;

use Carbon\CarbonImmutable;
use Database\Factories\ContentBlockFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $type
 * @property string|null $eyebrow
 * @property string $title
 * @property string|null $body
 * @property string|null $badge
 * @property string|null $icon
 * @property string $tone
 * @property bool $is_published
 * @property int $sort_order
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 */
#[Fillable([
    'type',
    'eyebrow',
    'title',
    'body',
    'badge',
    'icon',
    'tone',
    'is_published',
    'sort_order',
])]
class ContentBlock extends Model
{
    /** @use HasFactory<ContentBlockFactory> */
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_published' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    /**
     * Limit the query to published content blocks.
     *
     * @param  Builder<ContentBlock>  $query
     */
    public function scopePublished(Builder $query): void
    {
        $query->where('is_published', true);
    }

    /**
     * Limit the query to a content block type.
     *
     * @param  Builder<ContentBlock>  $query
     */
    public function scopeOfType(Builder $query, string $type): void
    {
        $query->where('type', $type);
    }

    /**
     * Order content blocks by their configured position.
     *
     * @param  Builder<ContentBlock>  $query
     */
    public function scopeOrdered(Builder $query): void
    {
        $query->orderBy('sort_order')->orderBy('id');
    }
}
