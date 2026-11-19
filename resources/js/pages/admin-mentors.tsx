import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowRight,
    Clock3,
    Search,
    ShieldCheck,
    Star,
    UserCheck,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import Pagination from '@/layouts/scholarships/pagination';
import { adminToneClasses } from '@/lib/admin-tones';
import type { AdminMentorRow, AdminMentorsProps } from '@/types/domain';

const statusClasses: Record<string, string> = {
    verified: 'bg-scholarly-teal-soft text-scholarly-teal-dark',
    pending: 'bg-scholarly-gold-soft text-scholarly-gold-dark',
    rejected: 'bg-scholarly-coral-soft text-scholarly-coral-dark',
};

export default function AdminMentors({
    mentors,
    filters,
    statuses,
    stats,
}: AdminMentorsProps) {
    const [query, setQuery] = useState(filters.q);

    useEffect(() => {
        setQuery(filters.q);
    }, [filters.q]);

    const applyFilters = useCallback(
        (next: Partial<typeof filters>) => {
            const merged = { ...filters, ...next };

            router.get(
                '/admin-mentors',
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

    const verify = (mentor: AdminMentorRow) => {
        router.post(
            `/admin-mentors/${mentor.id}/verify`,
            {},
            { preserveScroll: true },
        );
    };

    const reject = (mentor: AdminMentorRow) => {
        router.post(
            `/admin-mentors/${mentor.id}/reject`,
            {},
            { preserveScroll: true },
        );
    };

    return (
        <>
            <Head title="Mentors" />
            <div className="min-h-screen bg-scholarly-blue-white p-4 text-scholarly-navy sm:p-6 lg:p-8">
                <div className="mx-auto max-w-7xl space-y-7">
                    <header className="flex flex-col gap-5 border-b border-scholarly-border pb-6 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p className="text-sm font-semibold text-scholarly-blue">
                                People giving guidance
                            </p>
                            <h1 className="mt-2 font-display text-4xl tracking-[-0.03em] sm:text-5xl">
                                Mentors
                            </h1>
                            <p className="mt-3 text-sm leading-6 text-scholarly-slate">
                                Verify expertise, support quality, and help
                                learners find the right person.
                            </p>
                        </div>
                        <Link
                            href="/admin-mentors?status=pending"
                            className="inline-flex h-11 items-center gap-2 self-start rounded-xl bg-scholarly-blue px-4 text-sm font-bold text-white hover:bg-scholarly-blue-dark lg:self-auto"
                        >
                            <ShieldCheck className="size-4" /> Verification
                            queue
                        </Link>
                    </header>
                    <section className="grid gap-4 sm:grid-cols-3">
                        <div className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm">
                            <UserCheck className="size-5 text-scholarly-teal" />
                            <p className="mt-5 text-3xl font-bold">
                                {stats.verified.toLocaleString()}
                            </p>
                            <p className="mt-1 text-sm font-semibold">
                                Verified mentors
                            </p>
                        </div>
                        <div className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm">
                            <Clock3 className="size-5 text-scholarly-gold-dark" />
                            <p className="mt-5 text-3xl font-bold">
                                {stats.pending.toLocaleString()}
                            </p>
                            <p className="mt-1 text-sm font-semibold">
                                Awaiting verification
                            </p>
                        </div>
                        <div className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm">
                            <Star className="size-5 fill-scholarly-gold text-scholarly-gold" />
                            <p className="mt-5 text-3xl font-bold">
                                {stats.averageRating}
                            </p>
                            <p className="mt-1 text-sm font-semibold">
                                Average mentor rating
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
                                <span className="sr-only">Search mentors</span>
                                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-scholarly-slate-light" />
                                <input
                                    value={query}
                                    onChange={(event) =>
                                        setQuery(event.target.value)
                                    }
                                    placeholder="Search mentors"
                                    className="h-10 w-full rounded-lg border border-scholarly-border bg-scholarly-blue-white pl-9 text-xs outline-none focus:border-scholarly-blue"
                                />
                            </label>
                        </div>
                        <div className="mt-4 divide-y divide-scholarly-border-soft">
                            {mentors.data.map((mentor) => (
                                <div
                                    key={mentor.id}
                                    className="flex flex-col gap-4 py-4 first:pt-0 sm:flex-row sm:items-center"
                                >
                                    <span
                                        className={`flex size-11 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${adminToneClasses[mentor.tone]}`}
                                    >
                                        {mentor.initials}
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-bold">
                                            {mentor.name}
                                        </p>
                                        <p className="mt-1 text-sm text-scholarly-slate">
                                            {mentor.specialty ??
                                                mentor.headline ??
                                                'Mentor profile'}
                                        </p>
                                        {mentor.organization !== null && (
                                            <p className="mt-0.5 text-xs text-scholarly-slate-light">
                                                {mentor.organization}
                                                {mentor.country
                                                    ? ` · ${mentor.country}`
                                                    : ''}
                                            </p>
                                        )}
                                    </div>
                                    <div className="text-left sm:text-right">
                                        <p className="text-xs font-bold">
                                            {mentor.rating === null
                                                ? 'Not rated yet'
                                                : `${mentor.rating} rating`}
                                        </p>
                                        <p className="mt-1 text-xs text-scholarly-slate">
                                            {mentor.learners} active learners
                                        </p>
                                    </div>
                                    <span
                                        className={`rounded-full px-2.5 py-1 text-xs font-bold ${statusClasses[mentor.status] ?? 'bg-scholarly-blue-soft text-scholarly-blue'}`}
                                    >
                                        {mentor.statusLabel}
                                    </span>
                                    <div className="flex items-center gap-3">
                                        {mentor.status !== 'verified' && (
                                            <button
                                                type="button"
                                                onClick={() => verify(mentor)}
                                                className="text-xs font-bold text-scholarly-teal-dark hover:text-scholarly-teal"
                                            >
                                                Verify
                                            </button>
                                        )}
                                        {mentor.status !== 'rejected' && (
                                            <button
                                                type="button"
                                                onClick={() => reject(mentor)}
                                                className="text-xs font-bold text-scholarly-coral-dark hover:text-scholarly-coral"
                                            >
                                                Reject
                                            </button>
                                        )}
                                        <Link
                                            href={`/mentors/${mentor.id}`}
                                            className="inline-flex items-center gap-1 text-xs font-bold text-scholarly-blue"
                                        >
                                            View{' '}
                                            <ArrowRight className="size-3.5" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                            {mentors.data.length === 0 && (
                                <p className="py-14 text-center text-sm text-scholarly-slate">
                                    No mentors match these filters yet.
                                </p>
                            )}
                        </div>
                        <Pagination paginator={mentors} />
                    </section>
                </div>
            </div>
        </>
    );
}

AdminMentors.layout = () => ({
    breadcrumbs: [{ title: 'Mentors', href: '/admin-mentors' }],
});
