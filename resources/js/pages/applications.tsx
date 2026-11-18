import { Head, Link, router } from '@inertiajs/react';
import { ArrowRight, FileText, Plus, Search, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

import ApplicationCard from '@/layouts/applications/application-card';
import ApplicationSummary from '@/layouts/applications/application-summary';
import Pagination from '@/layouts/scholarships/pagination';
import type { ApplicationIndexProps } from '@/types/domain';

export default function Applications({
    applications,
    filters,
    statuses,
    stats,
    summary,
}: ApplicationIndexProps) {
    const [query, setQuery] = useState(filters.q);

    useEffect(() => {
        setQuery(filters.q);
    }, [filters.q]);

    const applyFilters = (next: { q?: string; status?: string }) => {
        router.get(
            '/applications',
            {
                q: next.q || undefined,
                status: next.status || undefined,
            },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    useEffect(() => {
        if (query === filters.q) {
            return;
        }

        const timer = window.setTimeout(() => {
            applyFilters({ q: query, status: filters.status });
        }, 350);

        return () => window.clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query, filters.q, filters.status]);

    const statCards = [
        {
            value: stats.total,
            label: 'Total applications',
            note: 'Every opportunity you are tracking',
            tone: 'bg-scholarly-blue-soft text-scholarly-blue',
        },
        {
            value: stats.draft,
            label: 'Draft in progress',
            note: 'Ready for your next step',
            tone: 'bg-scholarly-blue-soft text-scholarly-blue',
        },
        {
            value: stats.in_review,
            label: 'Being reviewed',
            note: 'Your work is moving',
            tone: 'bg-scholarly-teal-soft text-scholarly-teal-dark',
        },
        {
            value: stats.offer_received,
            label: 'Offer received',
            note: 'A moment worth celebrating',
            tone: 'bg-scholarly-gold-soft text-scholarly-gold-dark',
        },
    ];

    return (
        <>
            <Head title="My applications" />
            <div className="min-h-screen bg-scholarly-blue-white p-4 text-scholarly-navy sm:p-6 lg:p-8">
                <div className="mx-auto max-w-7xl space-y-8">
                    <header className="flex flex-col gap-5 border-b border-scholarly-border pb-6 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-scholarly-blue">
                                <Sparkles className="size-4" /> Your scholarship
                                journey
                            </p>
                            <h1 className="font-display text-4xl tracking-[-0.03em] text-scholarly-navy sm:text-5xl">
                                My applications
                            </h1>
                            <p className="mt-3 max-w-2xl text-sm leading-6 text-scholarly-slate sm:text-base">
                                Keep every opportunity moving forward, from your
                                first draft to the final decision.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <Link
                                href="/scholarships"
                                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-scholarly-border bg-white px-4 text-sm font-bold text-scholarly-slate transition hover:border-scholarly-blue hover:text-scholarly-blue"
                            >
                                Find a scholarship{' '}
                                <ArrowRight className="size-4" />
                            </Link>
                            <Link
                                href="/applications/create"
                                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-scholarly-blue px-4 text-sm font-bold text-white transition hover:bg-scholarly-blue-dark"
                            >
                                <Plus className="size-4" /> Add application
                            </Link>
                        </div>
                    </header>

                    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {statCards.map((card) => (
                            <div
                                key={card.label}
                                className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm"
                            >
                                <div
                                    className={`mb-5 flex size-10 items-center justify-center rounded-xl ${card.tone}`}
                                >
                                    <FileText className="size-5" />
                                </div>
                                <p className="text-3xl font-bold tracking-[-0.04em] text-scholarly-navy">
                                    {card.value}
                                </p>
                                <p className="mt-1 text-sm font-semibold text-scholarly-navy">
                                    {card.label}
                                </p>
                                <p className="mt-1 text-xs text-scholarly-slate">
                                    {card.note}
                                </p>
                            </div>
                        ))}
                    </section>

                    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
                        <main>
                            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-scholarly-navy">
                                        Your applications
                                    </h2>
                                    <p className="mt-1 text-sm text-scholarly-slate">
                                        Pick up where you left off.
                                    </p>
                                </div>
                                <label className="relative self-start sm:self-auto">
                                    <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-scholarly-slate-light" />
                                    <input
                                        value={query}
                                        onChange={(event) =>
                                            setQuery(event.target.value)
                                        }
                                        placeholder="Search applications"
                                        className="h-10 w-full rounded-lg border border-scholarly-border bg-white pr-3 pl-9 text-xs font-semibold text-scholarly-navy outline-none focus:border-scholarly-blue focus:ring-4 focus:ring-scholarly-blue-soft sm:w-64"
                                    />
                                </label>
                            </div>

                            <div className="mb-6 flex gap-1 overflow-x-auto rounded-xl border border-scholarly-border bg-white p-1">
                                {statuses.map((filter) => (
                                    <button
                                        key={filter.value || 'all'}
                                        type="button"
                                        onClick={() =>
                                            applyFilters({
                                                q: filters.q,
                                                status: filter.value,
                                            })
                                        }
                                        className={`rounded-lg px-3 py-2 text-xs font-bold whitespace-nowrap transition sm:px-4 ${filters.status === filter.value ? 'bg-scholarly-blue text-white' : 'text-scholarly-slate hover:bg-scholarly-blue-soft hover:text-scholarly-blue'}`}
                                    >
                                        {filter.label}
                                    </button>
                                ))}
                            </div>

                            <div className="space-y-5">
                                {applications.data.map((application) => (
                                    <ApplicationCard
                                        key={application.id}
                                        application={application}
                                    />
                                ))}
                            </div>

                            {applications.data.length === 0 && (
                                <div className="rounded-2xl border border-dashed border-scholarly-border-strong bg-white p-10 text-center">
                                    <p className="text-lg font-bold text-scholarly-navy">
                                        No applications found
                                    </p>
                                    <p className="mx-auto mt-2 max-w-md text-sm text-scholarly-slate">
                                        {filters.q || filters.status
                                            ? 'Try adjusting your search or status filter.'
                                            : 'Start your first application to track documents, tasks, and deadlines in one place.'}
                                    </p>
                                    <Link
                                        href="/applications/create"
                                        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-scholarly-blue px-4 py-2.5 text-sm font-bold text-white"
                                    >
                                        <Plus className="size-4" /> Start an
                                        application
                                    </Link>
                                </div>
                            )}

                            <Pagination paginator={applications} />
                        </main>
                        <ApplicationSummary summary={summary} />
                    </div>
                </div>
            </div>
        </>
    );
}

Applications.layout = () => ({
    breadcrumbs: [{ title: 'My applications', href: '/applications' }],
});
