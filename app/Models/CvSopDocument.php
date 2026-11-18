<?php

namespace App\Models;

use App\Enums\BuilderTemplateType;
use App\Enums\CvSopDocumentStatus;
use Carbon\CarbonImmutable;
use Database\Factories\CvSopDocumentFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property int $user_id
 * @property BuilderTemplateType $type
 * @property string $title
 * @property int|null $builder_template_id
 * @property string|null $headline
 * @property string|null $summary
 * @property CvSopDocumentStatus $status
 * @property CarbonImmutable|null $last_saved_at
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read User $user
 * @property-read BuilderTemplate|null $template
 * @property-read Collection<int, CvSopSection> $sections
 * @property-read Collection<int, ApplicationDocument> $applicationDocuments
 */
#[Fillable([
    'user_id',
    'type',
    'title',
    'builder_template_id',
    'headline',
    'summary',
    'status',
    'last_saved_at',
])]
class CvSopDocument extends Model
{
    /** @use HasFactory<CvSopDocumentFactory> */
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
            'status' => CvSopDocumentStatus::class,
            'last_saved_at' => 'datetime',
        ];
    }

    /**
     * Get the student who owns the document.
     *
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the template the document was created from.
     *
     * @return BelongsTo<BuilderTemplate, $this>
     */
    public function template(): BelongsTo
    {
        return $this->belongsTo(BuilderTemplate::class, 'builder_template_id');
    }

    /**
     * Get the editable sections of the document.
     *
     * @return HasMany<CvSopSection, $this>
     */
    public function sections(): HasMany
    {
        return $this->hasMany(CvSopSection::class, 'document_id')
            ->orderBy('sort_order')
            ->orderBy('id');
    }

    /**
     * Get the application documents created from this builder document.
     *
     * @return HasMany<ApplicationDocument, $this>
     */
    public function applicationDocuments(): HasMany
    {
        return $this->hasMany(ApplicationDocument::class, 'builder_document_id');
    }

    /**
     * Load or create the document for the given user and builder type.
     */
    public static function ensureFor(User $user, BuilderTemplateType $type): self
    {
        $document = self::query()->firstOrCreate(
            [
                'user_id' => $user->id,
                'type' => $type,
            ],
            [
                'title' => $type->defaultTitle(),
                'status' => CvSopDocumentStatus::Draft,
            ],
        );

        if ($document->builder_template_id === null) {
            $template = BuilderTemplate::query()
                ->active()
                ->forType($type)
                ->orderByDesc('is_recommended')
                ->orderBy('sort_order')
                ->orderBy('id')
                ->first();

            if ($template instanceof BuilderTemplate) {
                $document->builder_template_id = $template->id;
                $document->saveQuietly();
            }
        }

        $document->syncSections();
        $document->load([
            'sections',
            'template',
            'applicationDocuments.application.scholarship',
        ]);

        return $document;
    }

    /**
     * Add any missing sections defined by the document template.
     */
    public function syncSections(): void
    {
        $this->loadMissing('template');

        $definitions = $this->template?->sectionDefinitions() ?? [];

        foreach ($definitions as $index => $definition) {
            $this->sections()->firstOrCreate(
                ['key' => $definition['key']],
                [
                    'title' => $definition['title'],
                    'sort_order' => $index,
                ],
            );
        }
    }

    /**
     * Determine whether the document belongs to the given user.
     */
    public function isOwnedBy(User $user): bool
    {
        return $this->user_id === $user->id;
    }

    /**
     * Derive the document status from its persisted content.
     */
    public function deriveStatus(): CvSopDocumentStatus
    {
        $sections = $this->sections()->get();
        $filledSections = $sections->filter(fn (CvSopSection $section): bool => $section->isFilled());

        $hasHeader = trim((string) $this->headline) !== '' || trim((string) $this->summary) !== '';

        if (! $hasHeader && $filledSections->isEmpty()) {
            return CvSopDocumentStatus::Draft;
        }

        if (
            trim((string) $this->headline) !== ''
            && trim((string) $this->summary) !== ''
            && $sections->isNotEmpty()
            && $filledSections->count() === $sections->count()
        ) {
            return CvSopDocumentStatus::Complete;
        }

        return CvSopDocumentStatus::InProgress;
    }
}
