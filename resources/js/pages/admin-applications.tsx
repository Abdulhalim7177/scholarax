import { Head, Link, router } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowRight,
    CheckCircle2,
    Clock3,
    FileCheck2,
    Search,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import Pagination from '@/layouts/scholarships/pagination';
import { adminToneClasses } from '@/lib/admin-tones';
import { relativeTime } from '@/lib/format';
import type { AdminApplicationsProps } from '@/types/domain';

export default function AdminApplications({
    applications,
    filters,
    stages,
    stats,
}: AdminApplicationsProps) {
    const [query, setQuery] = useState(filters.q);

    useEffect(() => {
        setQuery(filters.q);
    }, [filters.q]);

    const applyFilters = useCallback(
        (next: Partial<typeof filters>) => {
            const merged = { ...filters, ...next };

            router.get(
                '/admin-applications',
                {
                    q: merged.q || undefined,
                    stage: merged.stage || undefined,
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

    return (
        <>
            <Head title="Applications" />
            <div className="min-h-screen bg-scholarly-blue-white p-4 text-scholarly-navy sm:p-6 lg:p-8">
                <div className="mx-auto max-w-7xl space-y-7">
                    <header>
                        <p className="text-sm font-semibold text-scholarly-blue">
                            Platform activity
                        </p>
                        <h1 className="mt-2 font-display text-4xl tracking-[-0.03em] sm:text-5xl">
                            Applications
                        </h1>
                        <p className="mt-3 max-w-2xl text-sm leading-6 text-scholarly-slate">
                            Monitor application flow and surface anything that
                            needs an admin decision.
                        </p>
                    </header>
                    <section className="grid gap-4 sm:grid-cols-3">
                        <div className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm">
                            <FileCheck2 className="size-5 text-scholarly-blue" />
                            <p className="mt-5 text-3xl font-bold">
                                {stats.tracked.toLocaleString()}
                            </p>
                            <p className="mt-1 text-sm font-semibold">
                                Tracked applications
                            </p>
                        </div>
                        <div className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm">
                            <Clock3 className="size-5 text-scholarly-gold-dark" />
                            <p className="mt-5 text-3xl font-bold">
                                {stats.submittedThisWeek.toLocaleString()}
                            </p>
                            <p className="mt-1 text-sm font-semibold">
                                Submitted this week
                            </p>
                        </div>
                        <div className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm">
                            <AlertTriangle className="size-5 text-scholarly-coral-dark" />
                            <p className="mt-5 text-3xl font-bold">
                                {stats.needsAttention.toLocaleString()}
                            </p>
                            <p className="mt-1 text-sm font-semibold">
                                Need a closer look
                            </p>
                        </div>
                    </section>
                    <section className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm sm:p-6">
                        <div className="flex flex-col gap-3 border-b border-scholarly-border pb-5 md:flex-row md:items-center md:justify-between">
                            <div className="flex gap-1 overflow-x-auto rounded-xl bg-scholarly-blue-white p-1">
                                {stages.map((option) => (
                                    <button
                                        key={option.value || 'all'}
                                        type="button"
                                        onClick={() =>
                                            applyFilters({
                                                stage: option.value,
                                            })
                                        }
                                        className={`rounded-lg px-3 py-2 text-xs font-bold whitespace-nowrap ${filters.stage === option.value ? 'bg-scholarly-blue text-white' : 'text-scholarly-slate'}`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                            <label className="relative block md:w-72">
                                <span className="sr-only">
                                    Search applications
                                </span>
                                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-scholarly-slate-light" />
                                <input
                                    value={query}
                                    onChange={(event) =>
                                        setQuery(event.target.value)
                                    }
                                    placeholder="Search applications"
                                    className="h-10 w-full rounded-lg border border-scholarly-border bg-scholarly-blue-white pl-9 text-xs outline-none focus:border-scholarly-blue"
                                />
                            </label>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[720px] text-left">
                                <thead>
                                    <tr className="border-b border-scholarly-border text-[11px] font-bold tracking-[0.12em] text-scholarly-slate uppercase">
                                        <th className="py-4">Learner</th>
                                        <th>Scholarship</th>
                                        <th>Stage</th>
                                        <th>Updated</th>
                                        <th>Signal</th>
                                        <th />
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-scholarly-border-soft">
                                    {applications.data.map((item) => (
                                        <tr key={item.id} className="text-sm">
                                            <td className="py-4">
                                                <div className="flex items-center gap-3">
                                                    <span
                                                        className={`flex size-9 items-center justify-center rounded-full text-xs font-bold ${adminToneClasses[item.tone]}`}
                                                    >
                                                        {item.initials}
                                                    </span>
                                                    <span>
                                                        <span className="block font-bold">
                                                            {item.learner}
                                                        </span>
                                                        <span className="mt-1 block text-xs text-scholarly-slate">
                                                            {item.learnerEmail}
                                                        </span>
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="text-xs text-scholarly-slate">
                                                {item.scholarship}
                                                <span className="mt-1 block text-[11px] text-scholarly-slate-light">
                                                    {item.progress}% complete
                                                </span>
                                            </td>
                                            <td>
                                                <span className="rounded-full bg-scholarly-blue-soft px-2.5 py-1 text-xs font-bold text-scholarly-blue">
                                                    {item.stageLabel}
                                                </span>
                                            </td>
                                            <td className="text-xs text-scholarly-slate">
                                                {relativeTime(item.submittedAt)}
                                            </td>
                                            <td>
                                                <span
                                                    className={`inline-flex items-center gap-1.5 text-xs font-bold ${item.risk === 'normal' ? 'text-scholarly-teal-dark' : 'text-scholarly-coral-dark'}`}
                                                >
                                                    {item.risk === 'normal' ? (
                                                        <CheckCircle2 className="size-3.5" />
                                                    ) : (
                                                        <AlertTriangle className="size-3.5" />
                                                    )}
                                                    {item.risk === 'normal'
                                                        ? 'Normal'
                                                        : 'Needs check'}
                                                </span>
                                            </td>
                                            <td className="text-right">
                                                <Link
                                                    href={`/applications/${item.id}`}
                                                    className="inline-flex items-center gap-1 text-xs font-bold text-scholarly-blue"
                                                >
                                                    Inspect{' '}
                                                    <ArrowRight className="size-3.5" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                    {applications.data.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="py-14 text-center text-sm text-scholarly-slate"
                                            >
                                                No applications match these
                                                filters yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <Pagination paginator={applications} />
                    </section>
                </div>
            </div>
        </>
    );
}

AdminApplications.layout = () => ({
    breadcrumbs: [{ title: 'Applications', href: '/admin-applications' }],
});
