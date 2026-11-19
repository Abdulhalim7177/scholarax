<?php

namespace App\Models;

use Carbon\CarbonImmutable;
use Database\Factories\ImpactStatFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $key
 * @property string $label
 * @property string $source
 * @property int $value
 * @property string $icon
 * @property bool $is_published
 * @property int $sort_order
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 */
#[Fillable([
    'key',
    'label',
    'source',
    'value',
    'icon',
    'is_published',
    'sort_order',
])]
class ImpactStat extends Model
{
    /** @use HasFactory<ImpactStatFactory> */
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'value' => 'integer',
            'is_published' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    /**
     * Limit the query to published impact stats.
     *
     * @param  Builder<ImpactStat>  $query
     */
    public function scopePublished(Builder $query): void
    {
        $query->where('is_published', true);
    }

    /**
     * Order impact stats by their configured position.
     *
     * @param  Builder<ImpactStat>  $query
     */
    public function scopeOrdered(Builder $query): void
    {
        $query->orderBy('sort_order')->orderBy('id');
    }
}
