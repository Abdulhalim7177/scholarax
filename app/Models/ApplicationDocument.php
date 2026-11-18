<?php

namespace App\Models;

use App\Enums\ApplicationDocumentStatus;
use App\Enums\ApplicationDocumentType;
use Carbon\CarbonImmutable;
use Database\Factories\ApplicationDocumentFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $application_id
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
 */
#[Fillable([
    'application_id',
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
     * Determine whether the document has a stored file.
     */
    public function hasFile(): bool
    {
        return $this->file_path !== null && $this->file_path !== '';
    }
}
