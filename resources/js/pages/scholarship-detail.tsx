import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowUpRight,
    Bookmark,
    CalendarDays,
    CheckCircle2,
    ExternalLink,
    GraduationCap,
    MapPin,
} from 'lucide-react';

import type { ScholarshipShowProps } from '@/types/domain';

export default function ScholarshipDetail({
    scholarship,
}: ScholarshipShowProps) {
    const toggleSaved = () => {
        const requestOptions = {
            preserveScroll: true,
            preserveState: true,
        };

        if (scholarship.saved) {
            router.delete(
                `/saved-scholarships/${scholarship.id}`,
                requestOptions,
            );

            return;
        }

        router.post(
            `/saved-scholarships/${scholarship.id}`,
            {},
            requestOptions,
        );
    };

    return (
        <>
            <Head title={scholarship.title} />
            <div className="min-h-screen bg-scholarly-blue-white p-4 text-scholarly-navy sm:p-6 lg:p-8">
                <div className="mx-auto max-w-5xl space-y-6">
                    <Link
                        href="/scholarships"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-scholarly-blue hover:text-scholarly-blue-dark"
                    >
                        <ArrowLeft className="size-4" /> Back to scholarships
                    </Link>

                    <header className="rounded-2xl border border-scholarly-border bg-white p-6 shadow-sm sm:p-8">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <p className="text-sm font-semibold text-scholarly-blue">
                                    {scholarship.provider}
                                </p>
                                <h1 className="mt-2 font-display text-3xl tracking-[-0.03em] sm:text-4xl">
                                    {scholarship.title}
                                </h1>
                                <p className="mt-3 max-w-2xl text-sm leading-6 text-scholarly-slate">
                                    {scholarship.summary ??
                                        scholarship.description}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={toggleSaved}
                                className={`inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-bold transition ${
                                    scholarship.saved
                                        ? 'border-scholarly-gold-dark bg-scholarly-gold-soft text-scholarly-gold-dark'
                                        : 'border-scholarly-border text-scholarly-slate hover:border-scholarly-blue hover:text-scholarly-blue'
                                }`}
                            >
                                <Bookmark
                                    className={`size-4 ${scholarship.saved ? 'fill-current' : ''}`}
                                />
                                {scholarship.saved ? 'Saved' : 'Save'}
                            </button>
                        </div>

                        <div className="mt-6 flex flex-wrap gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-scholarly-teal-soft px-3 py-1.5 text-xs font-bold text-scholarly-teal-dark">
                                {scholarship.funding}
                            </span>
                            <span
                                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${
                                    (scholarship.daysLeft ?? 99) <= 14
                                        ? 'bg-scholarly-coral-soft text-scholarly-coral-dark'
                                        : 'bg-scholarly-blue-soft text-scholarly-blue'
                                }`}
                            >
                                <CalendarDays className="size-3.5" />
                                {scholarship.deadlineLabel}
                                {scholarship.deadline
                                    ? ` · ${scholarship.deadline}`
                                    : ''}
                            </span>
                        </div>

                        <dl className="mt-6 grid gap-4 border-t border-scholarly-border-soft pt-5 text-sm sm:grid-cols-3">
                            <div>
                                <dt className="flex items-center gap-2 text-xs font-bold tracking-[0.12em] text-scholarly-slate uppercase">
                                    <MapPin className="size-3.5 text-scholarly-blue" />
                                    Destination
                                </dt>
                                <dd className="mt-1.5 font-semibold">
                                    {scholarship.country}
                                </dd>
                            </div>
                            <div>
                                <dt className="flex items-center gap-2 text-xs font-bold tracking-[0.12em] text-scholarly-slate uppercase">
                                    <GraduationCap className="size-3.5 text-scholarly-blue" />
                                    Study level
                                </dt>
                                <dd className="mt-1.5 font-semibold">
                                    {scholarship.level}
                                </dd>
                            </div>
                            <div>
                                <dt className="flex items-center gap-2 text-xs font-bold tracking-[0.12em] text-scholarly-slate uppercase">
                                    <CheckCircle2 className="size-3.5 text-scholarly-blue" />
                                    Field of study
                                </dt>
                                <dd className="mt-1.5 font-semibold">
                                    {scholarship.field}
                                </dd>
                            </div>
                        </dl>
                    </header>

                    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.8fr)]">
                        <div className="space-y-6">
                            <section className="rounded-2xl border border-scholarly-border bg-white p-6 shadow-sm">
                                <h2 className="text-xl font-bold">
                                    About this scholarship
                                </h2>
                                <p className="mt-3 text-sm leading-7 whitespace-pre-line text-scholarly-slate">
                                    {scholarship.description}
                                </p>
                            </section>

                            {scholarship.eligibility && (
                                <section className="rounded-2xl border border-scholarly-border bg-white p-6 shadow-sm">
                                    <h2 className="text-xl font-bold">
                                        Eligibility
                                    </h2>
                                    <p className="mt-3 text-sm leading-7 text-scholarly-slate">
                                        {scholarship.eligibility}
                                    </p>
                                </section>
                            )}

                            {scholarship.requiredDocuments.length > 0 && (
                                <section className="rounded-2xl border border-scholarly-border bg-white p-6 shadow-sm">
                                    <h2 className="text-xl font-bold">
                                        Required documents
                                    </h2>
                                    <ul className="mt-4 space-y-2">
                                        {scholarship.requiredDocuments.map(
                                            (document) => (
                                                <li
                                                    key={document}
                                                    className="flex items-start gap-2 text-sm text-scholarly-slate"
                                                >
                                                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-scholarly-teal" />
                                                    {document}
                                                </li>
                                            ),
                                        )}
                                    </ul>
                                </section>
                            )}
                        </div>

                        <aside className="space-y-4">
                            <div className="rounded-2xl border border-scholarly-border bg-white p-6 shadow-sm">
                                <p className="text-xs font-bold tracking-[0.12em] text-scholarly-slate uppercase">
                                    Deadline
                                </p>
                                <p className="mt-2 text-2xl font-bold">
                                    {scholarship.deadline ?? 'Rolling'}
                                </p>
                                <p className="mt-1 text-sm text-scholarly-slate">
                                    {scholarship.deadlineLabel}
                                </p>

                                {scholarship.applicationUrl ? (
                                    <a
                                        href={scholarship.applicationUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-scholarly-blue px-4 text-sm font-bold text-white transition hover:bg-scholarly-blue-dark"
                                    >
                                        Apply on provider site
                                        <ArrowUpRight className="size-4" />
                                    </a>
                                ) : (
                                    <span className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-xl bg-scholarly-blue-soft px-4 text-sm font-bold text-scholarly-blue">
                                        Application details coming soon
                                    </span>
                                )}

                                {scholarship.applicationUrl && (
                                    <a
                                        href={scholarship.applicationUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-scholarly-slate hover:text-scholarly-blue"
                                    >
                                        <ExternalLink className="size-3.5" />
                                        Open provider website
                                    </a>
                                )}
                            </div>

                            <div className="rounded-2xl border border-scholarly-border bg-scholarly-blue-soft p-5 text-xs leading-6 text-scholarly-slate">
                                Always confirm requirements, deadlines, and
                                funding details on the provider’s official
                                website before applying.
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </>
    );
}

ScholarshipDetail.layout = (props: ScholarshipShowProps) => ({
    breadcrumbs: [
        { title: 'Find scholarships', href: '/scholarships' },
        {
            title: props.scholarship.title,
            href: `/scholarships/${props.scholarship.slug}`,
        },
    ],
});
