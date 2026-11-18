import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowRight,
    MessageCircle,
    Search,
    Sparkles,
    Star,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import MentorCard from '@/layouts/mentors/mentor-card';
import MentorFilters from '@/layouts/mentors/mentor-filters';
import Pagination from '@/layouts/scholarships/pagination';
import type { MentorDirectoryProps, MentorFilterState } from '@/types/domain';

export default function Mentors({
    mentors,
    filters,
    options,
    stats,
    recommended,
}: MentorDirectoryProps) {
    const [query, setQuery] = useState(filters.q);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        setQuery(filters.q);
    }, [filters.q]);

    const applyFilters = useCallback(
        (next: Partial<MentorFilterState>) => {
            const merged = { ...filters, ...next };

            router.get(
                '/mentors',
                {
                    q: merged.q || undefined,
                    expertise: merged.expertise || undefined,
                    country: merged.country || undefined,
                    availability: merged.availability ? 1 : undefined,
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

    const resetFilters = () => {
        setQuery('');
        applyFilters({
            q: '',
            expertise: '',
            country: '',
            availability: false,
        });
    };

    const filterProps = {
        expertise: filters.expertise,
        country: filters.country,
        availabilityOnly: filters.availability,
        expertiseOptions: options.expertise,
        countryOptions: options.countries,
        onExpertiseChange: (value: string) =>
            applyFilters({ expertise: value }),
        onCountryChange: (value: string) => applyFilters({ country: value }),
        onAvailabilityChange: (value: boolean) =>
            applyFilters({ availability: value }),
        onReset: resetFilters,
    };

    return (
        <>
            <Head title="Mentors" />
            <div className="min-h-screen bg-scholarly-blue-white p-4 text-scholarly-navy sm:p-6 lg:p-8">
                <div className="mx-auto max-w-7xl space-y-8">
                    <header className="flex flex-col gap-6 border-b border-scholarly-border pb-6 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-scholarly-blue">
                                <Sparkles className="size-4" /> Guidance for
                                your next step
                            </p>
                            <h1 className="font-display text-4xl tracking-[-0.03em] text-scholarly-navy sm:text-5xl">
                                Meet your mentors
                            </h1>
                            <p className="mt-3 max-w-2xl text-sm leading-6 text-scholarly-slate sm:text-base">
                                Connect with people who have walked the
                                scholarship journey and can help you move
                                forward with confidence.
                            </p>
                        </div>
                        <div className="flex w-full gap-2 lg:max-w-md">
                            <label className="relative block flex-1">
                                <span className="sr-only">Search mentors</span>
                                <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-scholarly-slate-light" />
                                <input
                                    value={query}
                                    onChange={(event) =>
                                        setQuery(event.target.value)
                                    }
                                    placeholder="Search by name or expertise"
                                    className="h-12 w-full rounded-xl border border-scholarly-border bg-white pr-4 pl-11 text-sm text-scholarly-navy transition outline-none placeholder:text-scholarly-slate-light focus:border-scholarly-blue focus:ring-4 focus:ring-scholarly-blue-soft"
                                />
                            </label>
                            <button
                                type="button"
                                onClick={() => setShowFilters(true)}
                                className="inline-flex h-12 shrink-0 items-center rounded-xl border border-scholarly-border bg-white px-4 text-sm font-semibold text-scholarly-navy lg:hidden"
                            >
                                Filter
                            </button>
                        </div>
                    </header>

                    <section className="grid gap-4 md:grid-cols-[1.5fr_1fr_1fr]">
                        <div className="rounded-2xl border border-scholarly-blue bg-scholarly-navy p-5 text-white shadow-sm">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-xs font-bold tracking-[0.14em] text-scholarly-sky uppercase">
                                        {recommended?.featured
                                            ? 'Recommended mentor'
                                            : 'Top rated mentor'}
                                    </p>
                                    <h2 className="mt-2 font-display text-2xl">
                                        {recommended?.name ??
                                            'Mentors joining soon'}
                                    </h2>
                                    <p className="mt-2 text-xs leading-5 text-white/65">
                                        {recommended?.headline ??
                                            'Verified mentors will appear here as soon as they join the directory.'}
                                    </p>
                                </div>
                                <div className="flex size-11 items-center justify-center rounded-xl bg-white/10">
                                    <MessageCircle className="size-5 text-scholarly-gold" />
                                </div>
                            </div>
                            {recommended ? (
                                <Link
                                    href={`/mentors/${recommended.id}`}
                                    className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-white hover:text-scholarly-gold"
                                >
                                    View {recommended.name.split(' ')[0]}’s
                                    profile <ArrowRight className="size-3.5" />
                                </Link>
                            ) : (
                                <span className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-white/60">
                                    Check back soon
                                </span>
                            )}
                        </div>
                        <div className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm">
                            <p className="text-3xl font-bold tracking-[-0.04em] text-scholarly-navy">
                                {stats.sessions}
                            </p>
                            <p className="mt-1 text-sm font-semibold">
                                Mentor sessions
                            </p>
                            <p className="mt-1 text-xs text-scholarly-slate">
                                Delivered by {stats.mentors} verified{' '}
                                {stats.mentors === 1 ? 'mentor' : 'mentors'}
                            </p>
                        </div>
                        <div className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm">
                            <p className="text-3xl font-bold tracking-[-0.04em] text-scholarly-navy">
                                {stats.rating}
                                <span className="text-lg text-scholarly-gold">
                                    {' '}
                                    ★
                                </span>
                            </p>
                            <p className="mt-1 text-sm font-semibold">
                                Average mentor rating
                            </p>
                            <p className="mt-1 text-xs text-scholarly-slate">
                                From {stats.reviews} learner{' '}
                                {stats.reviews === 1 ? 'review' : 'reviews'}
                            </p>
                        </div>
                    </section>

                    {showFilters && (
                        <div
                            className="fixed inset-0 z-50 flex items-end bg-scholarly-navy/30 p-4 backdrop-blur-sm lg:hidden"
                            onClick={() => setShowFilters(false)}
                        >
                            <div
                                className="w-full"
                                onClick={(event) => event.stopPropagation()}
                            >
                                <MentorFilters {...filterProps} />
                                <button
                                    type="button"
                                    onClick={() => setShowFilters(false)}
                                    className="mt-3 h-11 w-full rounded-xl bg-scholarly-blue text-sm font-bold text-white"
                                >
                                    Show {mentors.total} mentors
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
                        <div className="hidden lg:block">
                            <MentorFilters {...filterProps} />
                        </div>
                        <main>
                            <div className="mb-5 flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold">
                                        Mentors for you
                                    </h2>
                                    <p className="mt-1 text-sm text-scholarly-slate">
                                        <span className="font-bold text-scholarly-navy">
                                            {mentors.total}{' '}
                                            {mentors.total === 1
                                                ? 'mentor'
                                                : 'mentors'}
                                        </span>{' '}
                                        ready to help with your next step.
                                    </p>
                                </div>
                            </div>
                            {mentors.data.length > 0 ? (
                                <>
                                    <div className="grid gap-5 md:grid-cols-2">
                                        {mentors.data.map((mentor) => (
                                            <MentorCard
                                                key={mentor.id}
                                                mentor={mentor}
                                            />
                                        ))}
                                    </div>
                                    <Pagination
                                        paginator={mentors}
                                        label="Mentor pages"
                                    />
                                </>
                            ) : (
                                <div className="rounded-2xl border border-dashed border-scholarly-border-strong bg-white px-6 py-16 text-center">
                                    <Star className="mx-auto size-7 fill-scholarly-gold-soft text-scholarly-gold" />
                                    <p className="mt-3 font-display text-2xl">
                                        No mentors found yet.
                                    </p>
                                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-scholarly-slate">
                                        Try another expertise or location, or
                                        show all available mentors.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={resetFilters}
                                        className="mt-5 rounded-lg bg-scholarly-blue px-4 py-2.5 text-sm font-bold text-white hover:bg-scholarly-blue-dark"
                                    >
                                        Clear filters
                                    </button>
                                </div>
                            )}
                        </main>
                    </div>
                </div>
            </div>
        </>
    );
}

Mentors.layout = () => ({
    breadcrumbs: [{ title: 'Mentors', href: '/mentors' }],
});
