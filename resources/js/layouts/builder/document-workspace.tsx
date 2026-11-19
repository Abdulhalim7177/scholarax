import { Link } from '@inertiajs/react';
import {
    ArrowUpRight,
    Check,
    Eye,
    Lightbulb,
    Loader2,
    Save,
} from 'lucide-react';

import type {
    BuilderDocument,
    BuilderDraft,
    BuilderMode,
} from '@/types/domain';

type DocumentWorkspaceProps = {
    mode: BuilderMode;
    document: BuilderDocument;
    draft: BuilderDraft;
    userName: string;
    activeSectionId: number | null;
    saveLabel: string;
    saving: boolean;
    onSectionChange: (sectionId: number) => void;
    onHeadlineChange: (value: string) => void;
    onSummaryChange: (value: string) => void;
    onSectionContentChange: (sectionId: number, value: string) => void;
    onSave: () => void;
};

export default function DocumentWorkspace({
    mode,
    document,
    draft,
    userName,
    activeSectionId,
    saveLabel,
    saving,
    onSectionChange,
    onHeadlineChange,
    onSummaryChange,
    onSectionContentChange,
    onSave,
}: DocumentWorkspaceProps) {
    const isCv = mode === 'cv';
    const activeSection =
        document.sections.find((section) => section.id === activeSectionId) ??
        document.sections[0] ??
        null;
    const content = activeSection
        ? (draft.sections[activeSection.id] ?? '')
        : '';
    const words = content.trim().split(/\s+/).filter(Boolean).length;

    return (
        <section className="rounded-2xl border border-scholarly-border bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-scholarly-border p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div>
                    <p className="text-xs font-bold tracking-[0.14em] text-scholarly-blue uppercase">
                        {isCv ? 'CV draft' : 'Statement draft'}
                    </p>
                    <h2 className="mt-1 text-xl font-bold text-scholarly-navy">
                        {document.title}
                    </h2>
                    <p className="mt-1 text-xs text-scholarly-slate">
                        {saveLabel}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Link
                        href={`/cv-sop-builder/documents/${document.id}/preview`}
                        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-scholarly-border px-3 text-xs font-bold text-scholarly-navy hover:border-scholarly-blue hover:text-scholarly-blue"
                    >
                        <Eye className="size-3.5" /> Preview
                    </Link>
                    <button
                        type="button"
                        onClick={onSave}
                        disabled={saving}
                        className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-scholarly-blue px-3 text-xs font-bold text-white transition hover:bg-scholarly-blue-dark disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {saving ? (
                            <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                            <Save className="size-3.5" />
                        )}
                        Save draft
                    </button>
                </div>
            </div>
            <div className="grid lg:grid-cols-[180px_minmax(0,1fr)]">
                <nav className="border-b border-scholarly-border p-3 lg:border-r lg:border-b-0">
                    <p className="px-2 pb-2 text-[10px] font-bold tracking-[0.14em] text-scholarly-slate uppercase">
                        Sections
                    </p>
                    <div className="flex gap-1 overflow-x-auto lg:block lg:space-y-1">
                        {document.sections.map((section, index) => {
                            const filled = (
                                draft.sections[section.id] ?? ''
                            ).trim();

                            return (
                                <button
                                    key={section.id}
                                    type="button"
                                    onClick={() => onSectionChange(section.id)}
                                    className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-semibold transition lg:w-full ${activeSection?.id === section.id ? 'bg-scholarly-blue-soft text-scholarly-blue' : 'text-scholarly-slate hover:bg-scholarly-blue-white hover:text-scholarly-navy'}`}
                                >
                                    <span
                                        className={`flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] ${activeSection?.id === section.id ? 'bg-scholarly-blue text-white' : 'bg-scholarly-blue-white'}`}
                                    >
                                        {filled ? (
                                            <Check className="size-3" />
                                        ) : (
                                            index + 1
                                        )}
                                    </span>
                                    {section.title}
                                </button>
                            );
                        })}
                        {document.sections.length === 0 && (
                            <p className="px-2 py-3 text-xs text-scholarly-slate">
                                Choose a template to add sections.
                            </p>
                        )}
                    </div>
                </nav>
                <div className="grid xl:grid-cols-[minmax(0,1fr)_240px]">
                    <div className="space-y-5 p-5 sm:p-6">
                        {isCv && (
                            <label className="block">
                                <span className="mb-2 block text-xs font-bold text-scholarly-navy">
                                    Full name
                                </span>
                                <input
                                    value={userName}
                                    readOnly
                                    className="h-11 w-full rounded-lg border border-scholarly-border bg-scholarly-blue-white/60 px-3 text-sm text-scholarly-slate outline-none"
                                />
                                <span className="mt-1.5 block text-[11px] text-scholarly-slate">
                                    Taken from your profile settings.
                                </span>
                            </label>
                        )}
                        <label className="block">
                            <span className="mb-2 block text-xs font-bold text-scholarly-navy">
                                {isCv
                                    ? 'Professional headline'
                                    : 'Statement headline'}
                            </span>
                            <input
                                value={draft.headline}
                                onChange={(event) =>
                                    onHeadlineChange(event.target.value)
                                }
                                className="h-11 w-full rounded-lg border border-scholarly-border bg-scholarly-blue-white px-3 text-sm outline-none focus:border-scholarly-blue focus:ring-4 focus:ring-scholarly-blue-soft"
                            />
                        </label>
                        <label className="block">
                            <span className="mb-2 block text-xs font-bold text-scholarly-navy">
                                {isCv
                                    ? 'Profile summary'
                                    : 'Statement overview'}
                            </span>
                            <textarea
                                value={draft.summary}
                                onChange={(event) =>
                                    onSummaryChange(event.target.value)
                                }
                                rows={isCv ? 5 : 4}
                                className="w-full resize-none rounded-lg border border-scholarly-border bg-scholarly-blue-white p-3 text-sm leading-6 outline-none focus:border-scholarly-blue focus:ring-4 focus:ring-scholarly-blue-soft"
                            />
                        </label>
                        {activeSection ? (
                            <label className="block">
                                <span className="mb-2 flex items-center justify-between gap-3 text-xs font-bold text-scholarly-navy">
                                    {activeSection.title}
                                    <span className="text-[11px] font-semibold text-scholarly-slate">
                                        {content.trim()
                                            ? 'Section complete'
                                            : 'In progress'}
                                    </span>
                                </span>
                                <textarea
                                    value={content}
                                    onChange={(event) =>
                                        onSectionContentChange(
                                            activeSection.id,
                                            event.target.value,
                                        )
                                    }
                                    rows={isCv ? 10 : 13}
                                    className="w-full resize-none rounded-lg border border-scholarly-border bg-scholarly-blue-white p-3 text-sm leading-6 outline-none focus:border-scholarly-blue focus:ring-4 focus:ring-scholarly-blue-soft"
                                />
                                <span className="mt-2 flex items-center justify-between text-xs text-scholarly-slate">
                                    <span>{words} words</span>
                                    <span>
                                        {isCv
                                            ? 'Keep it specific and results-focused.'
                                            : 'Recommended: 650–900 words in total.'}
                                    </span>
                                </span>
                            </label>
                        ) : (
                            <div className="rounded-xl border border-dashed border-scholarly-border p-6 text-center text-sm text-scholarly-slate">
                                Pick a template above to create your sections.
                            </div>
                        )}
                    </div>
                    <aside className="border-t border-scholarly-border bg-scholarly-blue-white/60 p-5 xl:border-t-0 xl:border-l">
                        <div className="flex size-9 items-center justify-center rounded-lg bg-scholarly-gold-soft text-scholarly-gold-dark">
                            <Lightbulb className="size-4" />
                        </div>
                        <h3 className="mt-4 text-sm font-bold text-scholarly-navy">
                            A helpful nudge
                        </h3>
                        <p className="mt-2 text-xs leading-5 text-scholarly-slate">
                            {isCv
                                ? 'Use specific outcomes instead of listing duties. Numbers help your impact feel real.'
                                : 'Keep the focus on your journey. The best statement connects one clear story to your future goals.'}
                        </p>
                        <Link
                            href={
                                isCv
                                    ? '/mentors?expertise=cv-review'
                                    : '/mentors?expertise=sop-review'
                            }
                            className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-scholarly-blue"
                        >
                            Get guided feedback{' '}
                            <ArrowUpRight className="size-3.5" />
                        </Link>
                    </aside>
                </div>
            </div>
        </section>
    );
}
