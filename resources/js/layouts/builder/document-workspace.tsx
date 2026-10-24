import { Link } from '@inertiajs/react';
import { ArrowUpRight, Eye, Lightbulb, Save } from 'lucide-react';

import type { BuilderMode } from './data';

type DocumentWorkspaceProps = {
    mode: BuilderMode;
    activeSection: string;
    onSectionChange: (section: string) => void;
    sections: string[];
    profileName: string;
    headline: string;
    statement: string;
    onProfileNameChange: (value: string) => void;
    onHeadlineChange: (value: string) => void;
    onStatementChange: (value: string) => void;
};

export default function DocumentWorkspace({
    mode,
    activeSection,
    onSectionChange,
    sections,
    profileName,
    headline,
    statement,
    onProfileNameChange,
    onHeadlineChange,
    onStatementChange,
}: DocumentWorkspaceProps) {
    const isCv = mode === 'CV';

    return (
        <section className="rounded-2xl border border-scholarly-border bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-scholarly-border p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div>
                    <p className="text-xs font-bold tracking-[0.14em] text-scholarly-blue uppercase">
                        {isCv ? 'CV draft' : 'Statement draft'}
                    </p>
                    <h2 className="mt-1 text-xl font-bold text-scholarly-navy">
                        {isCv
                            ? 'Shape your academic story'
                            : 'Write a statement that sounds like you'}
                    </h2>
                </div>
                <div className="flex gap-2">
                    <Link
                        href={`/coming-soon?feature=Preview ${mode}`}
                        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-scholarly-border px-3 text-xs font-bold text-scholarly-navy hover:border-scholarly-blue hover:text-scholarly-blue"
                    >
                        <Eye className="size-3.5" /> Preview
                    </Link>
                    <Link
                        href={`/coming-soon?feature=Save ${mode}`}
                        className="hover:bg-scholarly-blue-dark inline-flex h-9 items-center gap-1.5 rounded-lg bg-scholarly-blue px-3 text-xs font-bold text-white"
                    >
                        <Save className="size-3.5" /> Save draft
                    </Link>
                </div>
            </div>
            <div className="grid lg:grid-cols-[180px_minmax(0,1fr)]">
                <nav className="border-b border-scholarly-border p-3 lg:border-r lg:border-b-0">
                    <p className="px-2 pb-2 text-[10px] font-bold tracking-[0.14em] text-scholarly-slate uppercase">
                        Sections
                    </p>
                    <div className="flex gap-1 overflow-x-auto lg:block lg:space-y-1">
                        {sections.map((section, index) => (
                            <button
                                key={section}
                                type="button"
                                onClick={() => onSectionChange(section)}
                                className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-semibold transition lg:w-full ${activeSection === section ? 'bg-scholarly-blue-soft text-scholarly-blue' : 'text-scholarly-slate hover:bg-scholarly-blue-white hover:text-scholarly-navy'}`}
                            >
                                <span
                                    className={`flex size-5 items-center justify-center rounded-full text-[10px] ${activeSection === section ? 'bg-scholarly-blue text-white' : 'bg-scholarly-blue-white'}`}
                                >
                                    {index + 1}
                                </span>
                                {section}
                            </button>
                        ))}
                    </div>
                </nav>
                <div className="grid xl:grid-cols-[minmax(0,1fr)_240px]">
                    <div className="p-5 sm:p-6">
                        {isCv ? (
                            <div className="space-y-5">
                                <label className="block">
                                    <span className="mb-2 block text-xs font-bold text-scholarly-navy">
                                        Full name
                                    </span>
                                    <input
                                        value={profileName}
                                        onChange={(event) =>
                                            onProfileNameChange(
                                                event.target.value,
                                            )
                                        }
                                        className="focus:ring-scholarly-blue-soft h-11 w-full rounded-lg border border-scholarly-border bg-scholarly-blue-white px-3 text-sm outline-none focus:border-scholarly-blue focus:ring-4"
                                    />
                                </label>
                                <label className="block">
                                    <span className="mb-2 block text-xs font-bold text-scholarly-navy">
                                        Professional headline
                                    </span>
                                    <input
                                        value={headline}
                                        onChange={(event) =>
                                            onHeadlineChange(event.target.value)
                                        }
                                        className="focus:ring-scholarly-blue-soft h-11 w-full rounded-lg border border-scholarly-border bg-scholarly-blue-white px-3 text-sm outline-none focus:border-scholarly-blue focus:ring-4"
                                    />
                                </label>
                                <label className="block">
                                    <span className="mb-2 block text-xs font-bold text-scholarly-navy">
                                        Profile summary
                                    </span>
                                    <textarea
                                        value={statement}
                                        onChange={(event) =>
                                            onStatementChange(
                                                event.target.value,
                                            )
                                        }
                                        rows={7}
                                        className="focus:ring-scholarly-blue-soft w-full resize-none rounded-lg border border-scholarly-border bg-scholarly-blue-white p-3 text-sm leading-6 outline-none focus:border-scholarly-blue focus:ring-4"
                                    />
                                </label>
                            </div>
                        ) : (
                            <div className="space-y-5">
                                <div className="rounded-xl bg-scholarly-blue-white p-4">
                                    <p className="text-xs font-bold text-scholarly-blue">
                                        Writing prompt
                                    </p>
                                    <p className="mt-2 text-sm leading-6 text-scholarly-navy">
                                        Tell us about a moment that shaped your
                                        academic direction and the change you
                                        hope to create.
                                    </p>
                                </div>
                                <label className="block">
                                    <span className="mb-2 block text-xs font-bold text-scholarly-navy">
                                        Your response
                                    </span>
                                    <textarea
                                        value={statement}
                                        onChange={(event) =>
                                            onStatementChange(
                                                event.target.value,
                                            )
                                        }
                                        rows={13}
                                        className="focus:ring-scholarly-blue-soft w-full resize-none rounded-lg border border-scholarly-border bg-scholarly-blue-white p-3 text-sm leading-6 outline-none focus:border-scholarly-blue focus:ring-4"
                                    />
                                </label>
                                <div className="flex items-center justify-between text-xs text-scholarly-slate">
                                    <span>
                                        {
                                            statement
                                                .trim()
                                                .split(/\s+/)
                                                .filter(Boolean).length
                                        }{' '}
                                        words
                                    </span>
                                    <span>Recommended: 650–900 words</span>
                                </div>
                            </div>
                        )}
                    </div>
                    <aside className="border-t border-scholarly-border bg-scholarly-blue-white/60 p-5 xl:border-t-0 xl:border-l">
                        <div className="bg-scholarly-gold-soft text-scholarly-gold-dark flex size-9 items-center justify-center rounded-lg">
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
                            href={`/coming-soon?feature=Improve my ${mode}`}
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
