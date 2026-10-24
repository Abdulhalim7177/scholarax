import { Head, Link } from '@inertiajs/react';
import { ArrowRight, MessageCircle, Search, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';

import MentorCard from '@/layouts/mentors/mentor-card';
import MentorFilters from '@/layouts/mentors/mentor-filters';
import {
    mentorCountries,
    mentorExpertise,
    mentors,
} from '@/layouts/mentors/data';

export default function Mentors() {
    const [query, setQuery] = useState('');
    const [expertise, setExpertise] = useState(mentorExpertise[0]);
    const [country, setCountry] = useState(mentorCountries[0]);
    const [availabilityOnly, setAvailabilityOnly] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    const filteredMentors = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();
        return mentors.filter((mentor) => {
            const matchesQuery =
                !normalizedQuery ||
                [
                    mentor.name,
                    mentor.role,
                    mentor.organization,
                    ...mentor.expertise,
                ].some((value) =>
                    value.toLowerCase().includes(normalizedQuery),
                );
            const matchesExpertise =
                expertise === mentorExpertise[0] ||
                mentor.expertise.includes(expertise);
            const matchesCountry =
                country === mentorCountries[0] || mentor.country === country;
            const matchesAvailability =
                !availabilityOnly || mentor.availability === 'Available';
            return (
                matchesQuery &&
                matchesExpertise &&
                matchesCountry &&
                matchesAvailability
            );
        });
    }, [availabilityOnly, country, expertise, query]);

    const resetFilters = () => {
        setExpertise(mentorExpertise[0]);
        setCountry(mentorCountries[0]);
        setAvailabilityOnly(false);
    };

    const filterProps = {
        expertise,
        country,
        availabilityOnly,
        expertiseOptions: mentorExpertise,
        countryOptions: mentorCountries,
        onExpertiseChange: setExpertise,
        onCountryChange: setCountry,
        onAvailabilityChange: setAvailabilityOnly,
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
                                <Search className="text-scholarly-slate-light pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2" />
                                <input
                                    value={query}
                                    onChange={(event) =>
                                        setQuery(event.target.value)
                                    }
                                    placeholder="Search by name or expertise"
                                    className="placeholder:text-scholarly-slate-light focus:ring-scholarly-blue-soft h-12 w-full rounded-xl border border-scholarly-border bg-white pr-4 pl-11 text-sm text-scholarly-navy transition outline-none focus:border-scholarly-blue focus:ring-4"
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
                                        Your mentor match
                                    </p>
                                    <h2 className="mt-2 font-display text-2xl">
                                        Dr. Maya Chen
                                    </h2>
                                    <p className="mt-2 text-xs leading-5 text-white/65">
                                        A strong fit for your UK scholarship and
                                        personal statement goals.
                                    </p>
                                </div>
                                <div className="flex size-11 items-center justify-center rounded-xl bg-white/10">
                                    <MessageCircle className="size-5 text-scholarly-gold" />
                                </div>
                            </div>
                            <Link
                                href="/coming-soon?feature=Maya Chen mentor profile"
                                className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-white hover:text-scholarly-gold"
                            >
                                View recommended mentor{' '}
                                <ArrowRight className="size-3.5" />
                            </Link>
                        </div>
                        <div className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm">
                            <p className="text-3xl font-bold tracking-[-0.04em] text-scholarly-navy">
                                126
                            </p>
                            <p className="mt-1 text-sm font-semibold">
                                Mentor sessions
                            </p>
                            <p className="mt-1 text-xs text-scholarly-slate">
                                Completed by our community this month
                            </p>
                        </div>
                        <div className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm">
                            <p className="text-3xl font-bold tracking-[-0.04em] text-scholarly-navy">
                                4.9
                                <span className="text-lg text-scholarly-gold">
                                    {' '}
                                    ★
                                </span>
                            </p>
                            <p className="mt-1 text-sm font-semibold">
                                Average mentor rating
                            </p>
                            <p className="mt-1 text-xs text-scholarly-slate">
                                From 180+ learner reviews
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
                                    Show mentors
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
                                            {filteredMentors.length} mentors
                                        </span>{' '}
                                        ready to help with your next step.
                                    </p>
                                </div>
                            </div>
                            {filteredMentors.length > 0 ? (
                                <div className="grid gap-5 md:grid-cols-2">
                                    {filteredMentors.map((mentor) => (
                                        <MentorCard
                                            key={mentor.id}
                                            mentor={mentor}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="border-scholarly-border-strong rounded-2xl border border-dashed bg-white px-6 py-16 text-center">
                                    <p className="font-display text-2xl">
                                        No mentors found yet.
                                    </p>
                                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-scholarly-slate">
                                        Try another expertise or location, or
                                        show all available mentors.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setQuery('');
                                            resetFilters();
                                        }}
                                        className="hover:bg-scholarly-blue-hover mt-5 rounded-lg bg-scholarly-blue px-4 py-2.5 text-sm font-bold text-white"
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
