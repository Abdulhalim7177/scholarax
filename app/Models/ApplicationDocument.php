<?php

namespace App\Models;

use App\Enums\ApplicationDocumentStatus;
use App\Enums\ApplicationDocumentType;
use Carbon\CarbonImmutable;
use Database\Factories\ApplicationDocumentFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property int $application_id
 * @property int|null $builder_document_id
 * @property ApplicationDocumentType $type
 * @property string $title
 * @property int $version
 * @property string|null $file_path
 * @property string|null $original_name
 * @property ApplicationDocumentStatus $status
 * @property CarbonImmutable|null $submitted_at
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read Application $application
 * @property-read CvSopDocument|null $builderDocument
 * @property-read Collection<int, DocumentReview> $reviews
 */
#[Fillable([
    'application_id',
    'builder_document_id',
    'type',
    'title',
    'version',
    'file_path',
    'original_name',
    'status',
    'submitted_at',
])]
class ApplicationDocument extends Model
{
    /** @use HasFactory<ApplicationDocumentFactory> */
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'type' => ApplicationDocumentType::class,
            'status' => ApplicationDocumentStatus::class,
            'version' => 'integer',
            'submitted_at' => 'datetime',
        ];
    }

    /**
     * Get the application that owns the document.
     *
     * @return BelongsTo<Application, $this>
     */
    public function application(): BelongsTo
    {
        return $this->belongsTo(Application::class);
    }

    /**
     * Get the builder document this application document was created from.
     *
     * @return BelongsTo<CvSopDocument, $this>
     */
    public function builderDocument(): BelongsTo
    {
        return $this->belongsTo(CvSopDocument::class, 'builder_document_id');
    }

    /**
     * Get the mentor reviews for this document.
     *
     * @return HasMany<DocumentReview, $this>
     */
    public function reviews(): HasMany
    {
        return $this->hasMany(DocumentReview::class);
    }

    /**
     * Determine whether the document has a stored file.
     */
    public function hasFile(): bool
    {
        return $this->file_path !== null && $this->file_path !== '';
    }
}
