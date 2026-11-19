import { Head, Link, router } from '@inertiajs/react';
import {
    CheckCircle2,
    ExternalLink,
    Flag,
    Search,
    ShieldCheck,
    XCircle,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import Pagination from '@/layouts/scholarships/pagination';
import { relativeTime } from '@/lib/format';
import type { AdminModerationProps } from '@/types/domain';

const statusClasses: Record<string, string> = {
    open: 'bg-scholarly-coral-soft text-scholarly-coral-dark',
    resolved: 'bg-scholarly-teal-soft text-scholarly-teal-dark',
    dismissed: 'bg-scholarly-blue-white text-scholarly-slate',
};

export default function AdminModeration({
    reports,
    filters,
    statuses,
    stats,
}: AdminModerationProps) {
    const [query, setQuery] = useState(filters.q);
    const [notes, setNotes] = useState<Record<number, string>>({});

    useEffect(() => {
        setQuery(filters.q);
    }, [filters.q]);

    const applyFilters = useCallback(
        (next: Partial<typeof filters>) => {
            const merged = { ...filters, ...next };

            router.get(
                '/admin-moderation',
                {
                    q: merged.q || undefined,
                    status: merged.status || undefined,
                },
                { preserveState: true, preserveScroll: true, replace: true },
            );
        },
        [filters],
    );

    useEffect(() => {
        if (query === filters.q) {
            return;
        }

        const timer = window.setTimeout(() => {
            applyFilters({ q: query });
        }, 350);

        return () => window.clearTimeout(timer);
    }, [applyFilters, filters.q, query]);

    const resolve = (id: number) => {
        router.post(
            `/admin-moderation/${id}/resolve`,
            { resolution_note: notes[id] || null },
            { preserveScroll: true },
        );
    };

    const dismiss = (id: number) => {
        router.post(
            `/admin-moderation/${id}/dismiss`,
            {},
            { preserveScroll: true },
        );
    };

    return (
        <>
            <Head title="Moderation" />
            <div className="min-h-screen bg-scholarly-blue-white p-4 text-scholarly-navy sm:p-6 lg:p-8">
                <div className="mx-auto max-w-7xl space-y-7">
                    <header>
                        <p className="text-sm font-semibold text-scholarly-blue">
                            Trust and safety
                        </p>
                        <h1 className="mt-2 font-display text-4xl tracking-[-0.03em] sm:text-5xl">
                            Moderation
                        </h1>
                        <p className="mt-3 max-w-2xl text-sm leading-6 text-scholarly-slate">
                            Review what the community has reported and keep
                            Scholarly a safe place to learn.
                        </p>
                    </header>
                    <section className="grid gap-4 sm:grid-cols-3">
                        <div className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm">
                            <Flag className="size-5 text-scholarly-coral-dark" />
                            <p className="mt-5 text-3xl font-bold">
                                {stats.open.toLocaleString()}
                            </p>
                            <p className="mt-1 text-sm font-semibold">
                                Open reports
                            </p>
                        </div>
                        <div className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm">
                            <ShieldCheck className="size-5 text-scholarly-teal" />
                            <p className="mt-5 text-3xl font-bold">
                                {stats.resolvedThisWeek.toLocaleString()}
                            </p>
                            <p className="mt-1 text-sm font-semibold">
                                Resolved this week
                            </p>
                        </div>
                        <div className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm">
                            <XCircle className="size-5 text-scholarly-slate" />
                            <p className="mt-5 text-3xl font-bold">
                                {stats.dismissed.toLocaleString()}
                            </p>
                            <p className="mt-1 text-sm font-semibold">
                                Dismissed
                            </p>
                        </div>
                    </section>
                    <section className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm sm:p-6">
                        <div className="flex flex-col gap-3 border-b border-scholarly-border pb-5 md:flex-row md:items-center md:justify-between">
                            <div className="flex gap-1 overflow-x-auto rounded-xl bg-scholarly-blue-white p-1">
                                {statuses.map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() =>
                                            applyFilters({
                                                status: option.value,
                                            })
                                        }
                                        className={`rounded-lg px-3 py-2 text-xs font-bold whitespace-nowrap ${filters.status === option.value ? 'bg-scholarly-blue text-white' : 'text-scholarly-slate'}`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                            <label className="relative block md:w-72">
                                <span className="sr-only">Search reports</span>
                                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-scholarly-slate-light" />
                                <input
                                    value={query}
                                    onChange={(event) =>
                                        setQuery(event.target.value)
                                    }
                                    placeholder="Search reports"
                                    className="h-10 w-full rounded-lg border border-scholarly-border bg-scholarly-blue-white pl-9 text-xs outline-none focus:border-scholarly-blue"
                                />
                            </label>
                        </div>
                        <div className="mt-4 divide-y divide-scholarly-border-soft">
                            {reports.data.map((report) => (
                                <article
                                    key={report.id}
                                    className="py-5 first:pt-0 last:pb-0"
                                >
                                    <div className="flex flex-col gap-4 lg:flex-row">
                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="rounded-full bg-scholarly-blue-soft px-2.5 py-1 text-[11px] font-bold text-scholarly-blue">
                                                    {report.targetType}
                                                </span>
                                                <span
                                                    className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${statusClasses[report.status] ?? 'bg-scholarly-blue-soft text-scholarly-blue'}`}
                                                >
                                                    {report.statusLabel}
                                                </span>
                                                <span className="text-xs text-scholarly-slate">
                                                    {report.reasonLabel} ·{' '}
                                                    {relativeTime(
                                                        report.createdAt,
                                                    )}
                                                </span>
                                            </div>
                                            <p className="mt-3 text-sm font-bold">
                                                {report.targetLabel}
                                            </p>
                                            {report.details !== null && (
                                                <p className="mt-1 text-sm leading-6 text-scholarly-slate">
                                                    “{report.details}”
                                                </p>
                                            )}
                                            <p className="mt-2 text-xs text-scholarly-slate">
                                                Reported by {report.reporter}
                                            </p>
                                            {report.resolutionNote !== null && (
                                                <p className="mt-2 rounded-lg bg-scholarly-blue-white px-3 py-2 text-xs text-scholarly-slate">
                                                    Resolution:&nbsp;
                                                    {report.resolutionNote}
                                                </p>
                                            )}
                                            {report.targetUrl !== null && (
                                                <Link
                                                    href={report.targetUrl}
                                                    className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-scholarly-blue"
                                                >
                                                    View content{' '}
                                                    <ExternalLink className="size-3.5" />
                                                </Link>
                                            )}
                                        </div>
                                        {report.status === 'open' && (
                                            <div className="w-full shrink-0 lg:w-72">
                                                <label className="block">
                                                    <span className="mb-2 block text-xs font-bold">
                                                        Resolution note
                                                        (optional)
                                                    </span>
                                                    <textarea
                                                        value={
                                                            notes[report.id] ??
                                                            ''
                                                        }
                                                        onChange={(event) =>
                                                            setNotes(
                                                                (current) => ({
                                                                    ...current,
                                                                    [report.id]:
                                                                        event
                                                                            .target
                                                                            .value,
                                                                }),
                                                            )
                                                        }
                                                        rows={2}
                                                        className="w-full rounded-lg border border-scholarly-border bg-scholarly-blue-white px-3 py-2 text-xs outline-none focus:border-scholarly-blue"
                                                        placeholder="What action was taken?"
                                                    />
                                                </label>
                                                <div className="mt-3 flex gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            resolve(report.id)
                                                        }
                                                        className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-scholarly-blue px-3 text-xs font-bold text-white hover:bg-scholarly-blue-dark"
                                                    >
                                                        <CheckCircle2 className="size-3.5" />
                                                        Resolve
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            dismiss(report.id)
                                                        }
                                                        className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border border-scholarly-border px-3 text-xs font-bold text-scholarly-slate hover:border-scholarly-blue hover:text-scholarly-blue"
                                                    >
                                                        <XCircle className="size-3.5" />
                                                        Dismiss
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </article>
                            ))}
                            {reports.data.length === 0 && (
                                <p className="py-14 text-center text-sm text-scholarly-slate">
                                    Nothing in the moderation queue for these
                                    filters.
                                </p>
                            )}
                        </div>
                        <Pagination paginator={reports} />
                    </section>
                </div>
            </div>
        </>
    );
}

AdminModeration.layout = () => ({
    breadcrumbs: [{ title: 'Moderation', href: '/admin-moderation' }],
});
