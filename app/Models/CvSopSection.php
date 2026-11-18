<?php

namespace App\Models;

use Carbon\CarbonImmutable;
use Database\Factories\CvSopSectionFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $document_id
 * @property string $key
 * @property string $title
 * @property string|null $content
 * @property int $sort_order
 * @property CarbonImmutable|null $completed_at
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read CvSopDocument $document
 */
#[Fillable([
    'document_id',
    'key',
    'title',
    'content',
    'sort_order',
    'completed_at',
])]
class CvSopSection extends Model
{
    /** @use HasFactory<CvSopSectionFactory> */
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
            'completed_at' => 'datetime',
        ];
    }

    /**
     * Get the document that owns the section.
     *
     * @return BelongsTo<CvSopDocument, $this>
     */
    public function document(): BelongsTo
    {
        return $this->belongsTo(CvSopDocument::class, 'document_id');
    }

    /**
     * Determine whether the section has content.
     */
    public function isFilled(): bool
    {
        return trim((string) $this->content) !== '';
    }
}
