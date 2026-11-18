<?php

namespace App\Support;

use App\Enums\BuilderTemplateType;
use App\Models\Application;
use App\Models\ApplicationDocument;
use App\Models\BuilderTemplate;
use App\Models\CvSopDocument;
use App\Models\CvSopSection;
use App\Models\User;

final class BuilderData
{
    /**
     * Build the payload used by the CV and SOP builder page.
     *
     * @return array<string, mixed>
     */
    public static function page(User $user): array
    {
        $documents = [];

        foreach (BuilderTemplateType::cases() as $type) {
            $documents[$type->value] = self::document(
                CvSopDocument::ensureFor($user, $type),
            );
        }

        return [
            'documents' => $documents,
            'templates' => BuilderTemplate::query()
                ->active()
                ->orderBy('type')
                ->orderBy('sort_order')
                ->orderBy('id')
                ->get()
                ->map(fn (BuilderTemplate $template) => self::template($template))
                ->values()
                ->all(),
            'applications' => $user->applications()
                ->with('scholarship')
                ->orderByDesc('updated_at')
                ->get()
                ->map(fn (Application $application) => self::application($application))
                ->values()
                ->all(),
        ];
    }

    /**
     * Transform a builder document into the page payload.
     *
     * @return array<string, mixed>
     */
    public static function document(CvSopDocument $document): array
    {
        $document->loadMissing([
            'sections',
            'template',
            'applicationDocuments.application.scholarship',
        ]);

        $sections = $document->sections;
        $completedSections = $sections
            ->filter(fn (CvSopSection $section): bool => $section->isFilled())
            ->count();

        $checks = [
            trim((string) $document->headline) !== '',
            trim((string) $document->summary) !== '',
            ...$sections->map(fn (CvSopSection $section): bool => $section->isFilled())->all(),
        ];

        $total = count($checks);
        $completed = count(array_filter($checks));

        return [
            'id' => $document->id,
            'type' => $document->type->value,
            'typeLabel' => $document->type->label(),
            'title' => $document->title,
            'headline' => $document->headline,
            'summary' => $document->summary,
            'status' => $document->status->value,
            'statusLabel' => $document->status->label(),
            'templateId' => $document->builder_template_id,
            'lastSavedAt' => $document->last_saved_at?->toIso8601String(),
            'lastSavedLabel' => $document->last_saved_at?->diffForHumans(),
            'updatedAt' => $document->updated_at?->toIso8601String(),
            'strength' => (int) round($completed / $total * 100),
            'completedSections' => $completedSections,
            'totalSections' => $sections->count(),
            'nextAction' => self::nextAction($document, $sections->all()),
            'sections' => $sections
                ->map(fn (CvSopSection $section) => self::section($section))
                ->values()
                ->all(),
            'attachments' => $document->applicationDocuments
                ->map(fn (ApplicationDocument $applicationDocument) => [
                    'applicationDocumentId' => $applicationDocument->id,
                    'applicationId' => $applicationDocument->application_id,
                    'applicationTitle' => $applicationDocument->application->scholarship->title,
                    'status' => $applicationDocument->status->value,
                    'statusLabel' => $applicationDocument->status->label(),
                    'hasFile' => $applicationDocument->hasFile(),
                ])
                ->values()
                ->all(),
        ];
    }

    /**
     * Transform a builder template into a card payload.
     *
     * @return array<string, mixed>
     */
    public static function template(BuilderTemplate $template): array
    {
        return [
            'id' => $template->id,
            'type' => $template->type->value,
            'name' => $template->name,
            'slug' => $template->slug,
            'description' => $template->description,
            'accent' => $template->accent,
            'recommended' => $template->is_recommended,
        ];
    }

    /**
     * Transform a section into a payload.
     *
     * @return array<string, mixed>
     */
    public static function section(CvSopSection $section): array
    {
        return [
            'id' => $section->id,
            'key' => $section->key,
            'title' => $section->title,
            'content' => $section->content,
            'sortOrder' => $section->sort_order,
            'completed' => $section->isFilled(),
            'completedAt' => $section->completed_at?->toIso8601String(),
        ];
    }

    /**
     * Transform an application into a select option.
     *
     * @return array<string, mixed>
     */
    public static function application(Application $application): array
    {
        return [
            'id' => $application->id,
            'title' => $application->scholarship->title,
            'deadline' => $application->deadline_at?->format('j M Y'),
        ];
    }

    /**
     * Resolve the next action for a document.
     *
     * @param  array<int, CvSopSection>  $sections
     */
    public static function nextAction(CvSopDocument $document, array $sections): string
    {
        if (trim((string) $document->headline) === '') {
            return 'Add a professional headline.';
        }

        if (trim((string) $document->summary) === '') {
            return $document->type === BuilderTemplateType::Cv
                ? 'Write your profile summary.'
                : 'Write your opening response.';
        }

        foreach ($sections as $section) {
            if (! $section->isFilled()) {
                return sprintf('Complete your “%s” section.', $section->title);
            }
        }

        return sprintf('Attach this %s to an application.', $document->type->shortLabel());
    }
}
