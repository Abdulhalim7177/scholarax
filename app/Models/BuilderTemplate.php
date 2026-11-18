<?php

namespace App\Models;

use App\Enums\BuilderTemplateType;
use Carbon\CarbonImmutable;
use Database\Factories\BuilderTemplateFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property BuilderTemplateType $type
 * @property string $name
 * @property string $slug
 * @property string $description
 * @property string $accent
 * @property array<int, mixed> $sections
 * @property bool $is_recommended
 * @property bool $is_active
 * @property int $sort_order
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read Collection<int, CvSopDocument> $documents
 */
#[Fillable([
    'type',
    'name',
    'slug',
    'description',
    'accent',
    'sections',
    'is_recommended',
    'is_active',
    'sort_order',
])]
class BuilderTemplate extends Model
{
    /** @use HasFactory<BuilderTemplateFactory> */
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'type' => BuilderTemplateType::class,
            'sections' => 'array',
            'is_recommended' => 'boolean',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    /**
     * Get the documents created from the template.
     *
     * @return HasMany<CvSopDocument, $this>
     */
    public function documents(): HasMany
    {
        return $this->hasMany(CvSopDocument::class);
    }

    /**
     * Limit the query to active templates.
     *
     * @param  Builder<BuilderTemplate>  $query
     */
    public function scopeActive(Builder $query): void
    {
        $query->where('is_active', true);
    }

    /**
     * Limit the query to templates for a builder type.
     *
     * @param  Builder<BuilderTemplate>  $query
     */
    public function scopeForType(Builder $query, BuilderTemplateType $type): void
    {
        $query->where('type', $type->value);
    }

    /**
     * Get the section definitions from the template.
     *
     * @return array<int, array{key: string, title: string}>
     */
    public function sectionDefinitions(): array
    {
        return array_values(array_filter(
            $this->sections,
            fn (mixed $section): bool => is_array($section)
                && is_string($section['key'] ?? null)
                && is_string($section['title'] ?? null),
        ));
    }
}
