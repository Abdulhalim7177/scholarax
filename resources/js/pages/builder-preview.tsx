import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, FileText } from 'lucide-react';

import type { BuilderPreviewProps } from '@/types/domain';

export default function BuilderPreview({ document }: BuilderPreviewProps) {
    return (
        <>
            <Head title={`Preview: ${document.title}`} />
            <div className="min-h-screen bg-scholarly-blue-white p-4 text-scholarly-navy sm:p-6 lg:p-8">
                <div className="mx-auto max-w-3xl space-y-7">
                    <header className="flex flex-col gap-4 border-b border-scholarly-border pb-6 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <Link
                                href="/cv-sop-builder"
                                className="inline-flex items-center gap-2 text-sm font-bold text-scholarly-blue"
                            >
                                <ArrowLeft className="size-4" /> Back to builder
                            </Link>
                            <p className="mt-4 text-xs font-bold tracking-[0.14em] text-scholarly-blue uppercase">
                                {document.typeLabel} preview
                            </p>
                            <h1 className="mt-2 font-display text-4xl tracking-[-0.03em]">
                                {document.title}
                            </h1>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-scholarly-blue">
                                {document.strength}%
                            </p>
                            <p className="text-xs font-semibold text-scholarly-slate">
                                {document.statusLabel}
                            </p>
                        </div>
                    </header>
                    <article className="rounded-2xl border border-scholarly-border bg-white p-6 shadow-sm sm:p-10">
                        {document.headline !== null &&
                            document.headline.trim() !== '' && (
                                <p className="text-lg font-bold text-scholarly-navy">
                                    {document.headline}
                                </p>
                            )}
                        {document.summary !== null &&
                            document.summary.trim() !== '' && (
                                <p className="mt-4 text-sm leading-7 text-scholarly-slate">
                                    {document.summary}
                                </p>
                            )}
                        <div className="mt-8 space-y-8">
                            {document.sections.map((section) => (
                                <section key={section.id}>
                                    <h2 className="flex items-center gap-2 text-sm font-bold tracking-[0.12em] text-scholarly-blue uppercase">
                                        <FileText className="size-4" />
                                        {section.title}
                                    </h2>
                                    {section.content !== null &&
                                    section.content.trim() !== '' ? (
                                        <p className="mt-3 text-sm leading-7 whitespace-pre-line text-scholarly-navy">
                                            {section.content}
                                        </p>
                                    ) : (
                                        <p className="mt-3 text-sm text-scholarly-slate-light italic">
                                            This section is still empty.
                                        </p>
                                    )}
                                </section>
                            ))}
                        </div>
                    </article>
                    <p className="text-center text-xs text-scholarly-slate">
                        This preview shows your last saved draft.
                    </p>
                </div>
            </div>
        </>
    );
}

BuilderPreview.layout = () => ({
    breadcrumbs: [
        { title: 'CV & SOP builder', href: '/cv-sop-builder' },
        { title: 'Preview', href: '#' },
    ],
});
