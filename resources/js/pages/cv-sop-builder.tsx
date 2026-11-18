import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowRight, FileText, Link2, Sparkles, Unlink } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import DocumentWorkspace from '@/layouts/builder/document-workspace';
import TemplateCard from '@/layouts/builder/template-card';
import type {
    BuilderDocument,
    BuilderDraft,
    BuilderMode,
    CvSopBuilderProps,
} from '@/types/domain';

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

/**
 * Build the editable draft state from a persisted document.
 */
function buildDraft(document: BuilderDocument): BuilderDraft {
    return {
        title: document.title,
        headline: document.headline ?? '',
        summary: document.summary ?? '',
        templateId: document.templateId,
        sections: Object.fromEntries(
            document.sections.map((section) => [
                section.id,
                section.content ?? '',
            ]),
        ) as Record<number, string>,
    };
}

/**
 * Read a cookie value used for the CSRF header.
 */
function readCookie(name: string): string {
    const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));

    return match ? decodeURIComponent(match[1]) : '';
}

/**
 * Format an ISO timestamp as a short relative label.
 */
function relativeTime(iso: string): string {
    const seconds = Math.max(
        0,
        Math.round((Date.now() - new Date(iso).getTime()) / 1000),
    );

    if (seconds < 60) {
        return 'just now';
    }

    const minutes = Math.round(seconds / 60);

    if (minutes < 60) {
        return `${minutes} min ago`;
    }

    const hours = Math.round(minutes / 60);

    if (hours < 24) {
        return `${hours} hr ago`;
    }

    return new Date(iso).toLocaleDateString();
}

/**
 * Resolve the next action for the current document draft.
 */
function nextActionFor(document: BuilderDocument, draft: BuilderDraft): string {
    if (draft.headline.trim() === '') {
        return 'Add a professional headline.';
    }

    if (draft.summary.trim() === '') {
        return document.type === 'cv'
            ? 'Write your profile summary.'
            : 'Write your opening response.';
    }

    const section = document.sections.find(
        (item) => (draft.sections[item.id] ?? '').trim() === '',
    );

    if (section) {
        return `Complete your “${section.title}” section.`;
    }

    return `Attach this ${document.type === 'cv' ? 'CV' : 'SOP'} to an application.`;
}

/**
 * Describe the document strength score.
 */
function strengthLabel(score: number): string {
    if (score >= 85) {
        return 'Strong foundation';
    }

    if (score >= 60) {
        return 'Good direction';
    }

    if (score > 0) {
        return 'Getting started';
    }

    return 'Fresh start';
}

export default function CvSopBuilder({
    documents,
    templates,
    applications,
}: CvSopBuilderProps) {
    const { auth } = usePage().props;

    const [mode, setMode] = useState<BuilderMode>('cv');
    const [drafts, setDrafts] = useState<Record<BuilderMode, BuilderDraft>>(
        () => ({
            cv: buildDraft(documents.cv),
            sop: buildDraft(documents.sop),
        }),
    );
    const savedSnapshots = useRef<Record<BuilderMode, string>>({
        cv: JSON.stringify(buildDraft(documents.cv)),
        sop: JSON.stringify(buildDraft(documents.sop)),
    });
    const [lastSavedAt, setLastSavedAt] = useState<
        Record<BuilderMode, string | null>
    >({
        cv: documents.cv.lastSavedAt,
        sop: documents.sop.lastSavedAt,
    });
    const [saveState, setSaveState] = useState<SaveState>('idle');
    const [activeSectionId, setActiveSectionId] = useState<number | null>(
        documents.cv.sections[0]?.id ?? null,
    );
    const [applicationId, setApplicationId] = useState('');

    useEffect(() => {
        const next = {
            cv: buildDraft(documents.cv),
            sop: buildDraft(documents.sop),
        };

        setDrafts(next);
        savedSnapshots.current = {
            cv: JSON.stringify(next.cv),
            sop: JSON.stringify(next.sop),
        };
        setLastSavedAt({
            cv: documents.cv.lastSavedAt,
            sop: documents.sop.lastSavedAt,
        });
    }, [documents]);

    const document = documents[mode];
    const draft = drafts[mode];
    const dirty = JSON.stringify(draft) !== savedSnapshots.current[mode];

    const persist = useCallback(
        async (
            target: BuilderMode,
            { autosave = false }: { autosave?: boolean } = {},
        ): Promise<boolean> => {
            const record = documents[target];
            const targetDraft = drafts[target];

            setSaveState('saving');

            try {
                const response = await fetch(
                    `/cv-sop-builder/documents/${record.id}`,
                    {
                        method: 'PATCH',
                        credentials: 'same-origin',
                        headers: {
                            'Content-Type': 'application/json',
                            Accept: 'application/json',
                            'X-Requested-With': 'XMLHttpRequest',
                            'X-XSRF-TOKEN': readCookie('XSRF-TOKEN'),
                        },
                        body: JSON.stringify({
                            title: targetDraft.title,
                            headline: targetDraft.headline,
                            summary: targetDraft.summary,
                            builder_template_id: targetDraft.templateId,
                            sections: record.sections.map((section) => ({
                                id: section.id,
                                content: targetDraft.sections[section.id] ?? '',
                            })),
                            autosave,
                        }),
                    },
                );

                if (!response.ok) {
                    setSaveState('error');

                    return false;
                }

                const payload = (await response.json()) as BuilderDocument;

                savedSnapshots.current[target] = JSON.stringify(targetDraft);
                setLastSavedAt((current) => ({
                    ...current,
                    [target]: payload.lastSavedAt,
                }));
                setSaveState('saved');

                return true;
            } catch {
                setSaveState('error');

                return false;
            }
        },
        [documents, drafts],
    );

    useEffect(() => {
        if (!dirty) {
            return;
        }

        const timer = window.setTimeout(() => {
            void persist(mode, { autosave: true });
        }, 1400);

        return () => window.clearTimeout(timer);
    }, [dirty, mode, persist]);

    const changeMode = (nextMode: BuilderMode) => {
        if (nextMode === mode) {
            return;
        }

        if (JSON.stringify(drafts[mode]) !== savedSnapshots.current[mode]) {
            void persist(mode, { autosave: true });
        }

        setMode(nextMode);
        setActiveSectionId(documents[nextMode].sections[0]?.id ?? null);
        setSaveState('idle');
    };

    const updateDraft = (updater: (draft: BuilderDraft) => BuilderDraft) => {
        setDrafts((current) => ({
            ...current,
            [mode]: updater(current[mode]),
        }));
    };

    const completion = useMemo(() => {
        const contents = document.sections.map((section) =>
            (draft.sections[section.id] ?? '').trim(),
        );
        const checks = [
            draft.headline.trim(),
            draft.summary.trim(),
            ...contents,
        ];
        const completed = checks.filter(Boolean).length;

        return {
            strength:
                checks.length === 0
                    ? 0
                    : Math.round((completed / checks.length) * 100),
            completedSections: contents.filter(Boolean).length,
            totalSections: contents.length,
            nextAction: nextActionFor(document, draft),
        };
    }, [document, draft]);

    const availableApplications = applications.filter(
        (application) =>
            !document.attachments.some(
                (attachment) => attachment.applicationId === application.id,
            ),
    );

    const selectedApplication =
        applicationId !== '' &&
        availableApplications.some(
            (application) => String(application.id) === applicationId,
        )
            ? applicationId
            : String(availableApplications[0]?.id ?? '');

    const attach = async () => {
        if (selectedApplication === '') {
            return;
        }

        const saved = await persist(mode, { autosave: false });

        if (!saved) {
            return;
        }

        router.post(
            `/cv-sop-builder/documents/${document.id}/applications`,
            { application_id: Number(selectedApplication) },
            { preserveScroll: true },
        );
    };

    const detach = (targetApplicationId: number) => {
        router.delete(
            `/cv-sop-builder/documents/${document.id}/applications/${targetApplicationId}`,
            { preserveScroll: true },
        );
    };

    const saveLabel =
        saveState === 'saving'
            ? 'Saving…'
            : saveState === 'error'
              ? 'Could not save. Try again.'
              : dirty
                ? 'Unsaved changes'
                : lastSavedAt[mode]
                  ? `Saved ${relativeTime(lastSavedAt[mode])}`
                  : 'Not saved yet';

    const modeLabel = mode === 'cv' ? 'CV' : 'SOP';
    const activeTemplates = templates.filter(
        (template) => template.type === mode,
    );

    return (
        <>
            <Head title="CV & SOP builder" />
            <div className="min-h-screen bg-scholarly-blue-white p-4 text-scholarly-navy sm:p-6 lg:p-8">
                <div className="mx-auto max-w-7xl space-y-8">
                    <header className="flex flex-col gap-5 border-b border-scholarly-border pb-6 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-scholarly-blue">
                                <Sparkles className="size-4" /> Build with
                                confidence
                            </p>
                            <h1 className="font-display text-4xl tracking-[-0.03em] sm:text-5xl">
                                CV & SOP builder
                            </h1>
                            <p className="mt-3 max-w-2xl text-sm leading-6 text-scholarly-slate sm:text-base">
                                Turn your experiences into a clear, compelling
                                application with guidance that still sounds like
                                you.
                            </p>
                        </div>
                        <Link
                            href="/mentors"
                            className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-xl border border-scholarly-border bg-white px-4 text-sm font-bold text-scholarly-navy transition hover:border-scholarly-blue hover:text-scholarly-blue lg:self-auto"
                        >
                            Ask a mentor <ArrowRight className="size-4" />
                        </Link>
                    </header>
                    <div className="flex rounded-xl border border-scholarly-border bg-white p-1 sm:w-fit">
                        <button
                            type="button"
                            onClick={() => changeMode('cv')}
                            className={`inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold transition ${mode === 'cv' ? 'bg-scholarly-blue text-white' : 'text-scholarly-slate hover:text-scholarly-navy'}`}
                        >
                            <FileText className="size-4" /> Build my CV
                        </button>
                        <button
                            type="button"
                            onClick={() => changeMode('sop')}
                            className={`inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold transition ${mode === 'sop' ? 'bg-scholarly-blue text-white' : 'text-scholarly-slate hover:text-scholarly-navy'}`}
                        >
                            <FileText className="size-4" /> Write my SOP
                        </button>
                    </div>
                    <section className="grid gap-4 sm:grid-cols-3">
                        <div className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm">
                            <p className="text-xs font-bold tracking-[0.12em] text-scholarly-slate uppercase">
                                {modeLabel} strength
                            </p>
                            <div className="mt-3 flex items-end gap-2">
                                <span className="text-4xl font-bold tracking-[-0.05em] text-scholarly-navy">
                                    {completion.strength}%
                                </span>
                                <span className="pb-1 text-xs font-bold text-scholarly-teal-dark">
                                    {strengthLabel(completion.strength)}
                                </span>
                            </div>
                            <div className="mt-4 h-2 overflow-hidden rounded-full bg-scholarly-blue-white">
                                <div
                                    className={`h-full rounded-full ${mode === 'cv' ? 'bg-scholarly-teal' : 'bg-scholarly-blue'}`}
                                    style={{
                                        width: `${completion.strength}%`,
                                    }}
                                />
                            </div>
                        </div>
                        <div className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm">
                            <p className="text-xs font-bold tracking-[0.12em] text-scholarly-slate uppercase">
                                Completion
                            </p>
                            <div className="mt-3 flex items-end gap-2">
                                <span className="text-4xl font-bold tracking-[-0.05em] text-scholarly-navy">
                                    {completion.completedSections}/
                                    {completion.totalSections}
                                </span>
                                <span className="pb-1 text-xs text-scholarly-slate">
                                    sections ready
                                </span>
                            </div>
                            <p className="mt-3 text-xs text-scholarly-slate">
                                Keep going—your next improvement is clear.
                            </p>
                        </div>
                        <div className="rounded-2xl border border-scholarly-border bg-scholarly-navy p-5 text-white shadow-sm">
                            <p className="text-xs font-bold tracking-[0.12em] text-scholarly-sky uppercase">
                                Next best action
                            </p>
                            <p className="mt-3 text-sm font-semibold">
                                {completion.nextAction}
                            </p>
                            <p className="mt-4 text-xs font-bold text-scholarly-gold">
                                {saveLabel}
                            </p>
                        </div>
                    </section>
                    <section>
                        <div className="mb-4 flex items-end justify-between">
                            <div>
                                <h2 className="text-xl font-bold">
                                    Choose a starting template
                                </h2>
                                <p className="mt-1 text-sm text-scholarly-slate">
                                    You can change the layout at any time.
                                </p>
                            </div>
                            <span className="hidden text-xs font-semibold text-scholarly-slate sm:block">
                                Step 1 of 2
                            </span>
                        </div>
                        <div className="grid gap-4 md:grid-cols-3">
                            {activeTemplates.map((template) => (
                                <TemplateCard
                                    key={template.id}
                                    template={template}
                                    selected={draft.templateId === template.id}
                                    onSelect={() =>
                                        updateDraft((current) => ({
                                            ...current,
                                            templateId: template.id,
                                        }))
                                    }
                                />
                            ))}
                            {activeTemplates.length === 0 && (
                                <p className="text-sm text-scholarly-slate">
                                    No templates are available yet.
                                </p>
                            )}
                        </div>
                    </section>
                    <DocumentWorkspace
                        mode={mode}
                        document={document}
                        draft={draft}
                        userName={auth.user.name}
                        activeSectionId={activeSectionId}
                        saveLabel={saveLabel}
                        saving={saveState === 'saving'}
                        onSectionChange={setActiveSectionId}
                        onHeadlineChange={(value) =>
                            updateDraft((current) => ({
                                ...current,
                                headline: value,
                            }))
                        }
                        onSummaryChange={(value) =>
                            updateDraft((current) => ({
                                ...current,
                                summary: value,
                            }))
                        }
                        onSectionContentChange={(sectionId, value) =>
                            updateDraft((current) => ({
                                ...current,
                                sections: {
                                    ...current.sections,
                                    [sectionId]: value,
                                },
                            }))
                        }
                        onSave={() => {
                            void persist(mode, { autosave: false });
                        }}
                    />
                    <section className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm sm:p-6">
                        <div>
                            <h2 className="text-xl font-bold">
                                Use it in an application
                            </h2>
                            <p className="mt-1 text-sm text-scholarly-slate">
                                Attach this {modeLabel} so it appears with your
                                application documents.
                            </p>
                        </div>
                        <div className="mt-5 space-y-3">
                            {document.attachments.map((attachment) => (
                                <div
                                    key={attachment.applicationDocumentId}
                                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-scholarly-border p-4"
                                >
                                    <div>
                                        <p className="text-sm font-bold">
                                            {attachment.applicationTitle}
                                        </p>
                                        <p className="mt-0.5 text-xs text-scholarly-slate">
                                            Application document ·{' '}
                                            {attachment.statusLabel}
                                            {attachment.hasFile
                                                ? ' · file attached'
                                                : ''}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Link
                                            href={`/applications/${attachment.applicationId}`}
                                            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-scholarly-border px-3 text-xs font-bold text-scholarly-slate transition hover:border-scholarly-blue hover:text-scholarly-blue"
                                        >
                                            <Link2 className="size-3.5" /> Open
                                            application
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                detach(attachment.applicationId)
                                            }
                                            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-scholarly-coral-dark/30 px-3 text-xs font-bold text-scholarly-coral-dark transition hover:bg-scholarly-coral-soft"
                                        >
                                            <Unlink className="size-3.5" />{' '}
                                            Detach
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {document.attachments.length === 0 && (
                                <p className="rounded-xl bg-scholarly-blue-white p-4 text-sm text-scholarly-slate">
                                    Not attached to an application yet.
                                </p>
                            )}
                        </div>
                        {availableApplications.length > 0 ? (
                            <div className="mt-5 flex flex-col gap-3 rounded-xl bg-scholarly-blue-white p-4 sm:flex-row sm:items-end">
                                <label className="flex-1">
                                    <span className="mb-2 block text-xs font-bold text-scholarly-navy">
                                        Application
                                    </span>
                                    <select
                                        value={selectedApplication}
                                        onChange={(event) =>
                                            setApplicationId(event.target.value)
                                        }
                                        className="h-10 w-full rounded-lg border border-scholarly-border bg-white px-3 text-sm outline-none focus:border-scholarly-blue"
                                    >
                                        {availableApplications.map(
                                            (application) => (
                                                <option
                                                    key={application.id}
                                                    value={application.id}
                                                >
                                                    {application.title}
                                                    {application.deadline
                                                        ? ` · due ${application.deadline}`
                                                        : ''}
                                                </option>
                                            ),
                                        )}
                                    </select>
                                </label>
                                <button
                                    type="button"
                                    onClick={() => {
                                        void attach();
                                    }}
                                    disabled={
                                        saveState === 'saving' ||
                                        selectedApplication === ''
                                    }
                                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-scholarly-blue px-4 text-sm font-bold text-white transition hover:bg-scholarly-blue-dark disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <Link2 className="size-4" /> Attach{' '}
                                    {modeLabel}
                                </button>
                            </div>
                        ) : (
                            <p className="mt-5 text-sm text-scholarly-slate">
                                Start an application to attach this document.{' '}
                                <Link
                                    href="/scholarships"
                                    className="font-bold text-scholarly-blue hover:text-scholarly-blue-dark"
                                >
                                    Browse scholarships
                                </Link>
                            </p>
                        )}
                    </section>
                </div>
            </div>
        </>
    );
}

CvSopBuilder.layout = () => ({
    breadcrumbs: [{ title: 'CV & SOP builder', href: '/cv-sop-builder' }],
});
