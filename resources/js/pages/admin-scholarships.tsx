import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowRight,
    BookOpen,
    CheckCircle2,
    Clock3,
    Plus,
    Search,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import Pagination from '@/layouts/scholarships/pagination';
import { relativeTime } from '@/lib/format';
import type {
    AdminScholarshipIndexProps,
    AdminScholarship,
} from '@/types/domain';

const statusClasses: Record<string, string> = {
    live: 'bg-scholarly-teal-soft text-scholarly-teal-dark',
    pending: 'bg-scholarly-gold-soft text-scholarly-gold-dark',
    draft: 'bg-scholarly-blue-soft text-scholarly-blue',
    closed: 'bg-scholarly-coral-soft text-scholarly-coral-dark',
    archived: 'bg-scholarly-blue-white text-scholarly-slate',
};

export default function AdminScholarships({
    scholarships,
    filters,
    statuses,
    stats,
}: AdminScholarshipIndexProps) {
    const [query, setQuery] = useState(filters.q);

    useEffect(() => {
        setQuery(filters.q);
    }, [filters.q]);

    const applyFilters = useCallback(
        (next: Partial<typeof filters>) => {
            const merged = { ...filters, ...next };

            router.get(
                '/admin-scholarships',
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

    const approve = (scholarship: AdminScholarship) => {
        router.post(
            `/admin-scholarships/${scholarship.id}/approve`,
            {},
            { preserveScroll: true },
        );
    };

    return (
        <>
            <Head title="Scholarships" />
            <div className="min-h-screen bg-scholarly-blue-white p-4 text-scholarly-navy sm:p-6 lg:p-8">
                <div className="mx-auto max-w-7xl space-y-7">
                    <header className="flex flex-col gap-5 border-b border-scholarly-border pb-6 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p className="text-sm font-semibold text-scholarly-blue">
                                Opportunity catalogue
                            </p>
                            <h1 className="mt-2 font-display text-4xl tracking-[-0.03em] sm:text-5xl">
                                Scholarships
                            </h1>
                            <p className="mt-3 text-sm leading-6 text-scholarly-slate">
                                Keep opportunities accurate, current, and worth
                                a learner’s time.
                            </p>
                        </div>
                        <Link
                            href="/admin-scholarships/create"
                            className="inline-flex h-11 items-center gap-2 self-start rounded-xl bg-scholarly-blue px-4 text-sm font-bold text-white hover:bg-scholarly-blue-dark lg:self-auto"
                        >
                            <Plus className="size-4" /> Add scholarship
                        </Link>
                    </header>

                    <section className="grid gap-4 sm:grid-cols-3">
                        <div className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm">
                            <BookOpen className="size-5 text-scholarly-blue" />
                            <p className="mt-5 text-3xl font-bold">
                                {stats.live}
                            </p>
                            <p className="mt-1 text-sm font-semibold">
                                Live scholarships
                            </p>
                        </div>
                        <div className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm">
                            <CheckCircle2 className="size-5 text-scholarly-teal" />
                            <p className="mt-5 text-3xl font-bold">
                                {stats.createdThisMonth}
                            </p>
                            <p className="mt-1 text-sm font-semibold">
                                Added this month
                            </p>
                        </div>
                        <div className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm">
                            <Clock3 className="size-5 text-scholarly-coral" />
                            <p className="mt-5 text-3xl font-bold">
                                {stats.pending}
                            </p>
                            <p className="mt-1 text-sm font-semibold">
                                Awaiting review
                            </p>
                        </div>
                    </section>

                    <section className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm sm:p-6">
                        <div className="flex flex-col gap-3 border-b border-scholarly-border pb-5 md:flex-row md:items-center md:justify-between">
                            <div className="flex gap-1 overflow-x-auto rounded-xl bg-scholarly-blue-white p-1">
                                {statuses.map((option) => (
                                    <button
                                        key={option.value || 'all'}
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
                                <span className="sr-only">
                                    Search scholarships
                                </span>
                                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-scholarly-slate-light" />
                                <input
                                    value={query}
                                    onChange={(event) =>
                                        setQuery(event.target.value)
                                    }
                                    placeholder="Search scholarships"
                                    className="h-10 w-full rounded-lg border border-scholarly-border bg-scholarly-blue-white pl-9 text-xs outline-none focus:border-scholarly-blue"
                                />
                            </label>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[820px] text-left">
                                <thead>
                                    <tr className="border-b border-scholarly-border text-[11px] font-bold tracking-[0.12em] text-scholarly-slate uppercase">
                                        <th className="py-4">Scholarship</th>
                                        <th>Region</th>
                                        <th>Status</th>
                                        <th>Deadline</th>
                                        <th>Updated</th>
                                        <th />
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-scholarly-border-soft">
                                    {scholarships.data.map((item) => (
                                        <tr key={item.id} className="text-sm">
                                            <td className="py-4">
                                                <p className="font-bold">
                                                    {item.title}
                                                </p>
                                                <p className="mt-1 text-xs text-scholarly-slate">
                                                    {item.provider}
                                                    {item.isFeatured && (
                                                        <span className="ml-2 rounded-full bg-scholarly-blue-soft px-2 py-0.5 text-[10px] font-bold text-scholarly-blue">
                                                            Featured
                                                        </span>
                                                    )}
                                                </p>
                                            </td>
                                            <td className="text-xs text-scholarly-slate">
                                                {item.country}
                                            </td>
                                            <td>
                                                <span
                                                    className={`rounded-full px-2.5 py-1 text-xs font-bold ${statusClasses[item.status] ?? 'bg-scholarly-blue-soft text-scholarly-blue'}`}
                                                >
                                                    {item.statusLabel}
                                                </span>
                                            </td>
                                            <td className="text-xs font-semibold">
                                                {item.deadline ?? 'Rolling'}
                                            </td>
                                            <td className="text-xs text-scholarly-slate">
                                                {relativeTime(item.updatedAt)}
                                            </td>
                                            <td className="text-right">
                                                <div className="inline-flex items-center gap-3">
                                                    {item.status ===
                                                        'pending' && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                approve(item)
                                                            }
                                                            className="text-xs font-bold text-scholarly-teal-dark hover:text-scholarly-teal"
                                                        >
                                                            Approve
                                                        </button>
                                                    )}
                                                    <Link
                                                        href={`/admin-scholarships/${item.id}/edit`}
                                                        className="inline-flex items-center gap-1 text-xs font-bold text-scholarly-blue"
                                                    >
                                                        Edit{' '}
                                                        <ArrowRight className="size-3.5" />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {scholarships.data.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="py-14 text-center text-sm text-scholarly-slate"
                                            >
                                                No scholarships match these
                                                filters yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <Pagination paginator={scholarships} />
                    </section>
                </div>
            </div>
        </>
    );
}

AdminScholarships.layout = () => ({
    breadcrumbs: [{ title: 'Scholarships', href: '/admin-scholarships' }],
});
