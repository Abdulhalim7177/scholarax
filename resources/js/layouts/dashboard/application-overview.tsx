import { Link } from '@inertiajs/react';
import {
    ArrowRight,
    CalendarDays,
    Check,
    ChevronRight,
    GraduationCap,
    MapPin,
} from 'lucide-react';

import type {
    ApplicationSummary,
    DashboardDeadline,
    DashboardJourney,
} from '@/types/domain';

type Props = {
    currentApplication: ApplicationSummary | null;
    deadlines: DashboardDeadline[];
    journey: DashboardJourney;
};

const steps = [
    {
        key: 'discover' as const,
        title: 'Discover',
        body: 'Find the right opportunities',
    },
    {
        key: 'prepare' as const,
        title: 'Prepare',
        body: 'Build strong applications',
    },
    { key: 'apply' as const, title: 'Apply', body: 'Submit and track' },
];

export default function ApplicationOverview({
    currentApplication,
    deadlines,
    journey,
}: Props) {
    return (
        <section className="grid gap-6 xl:grid-cols-[1.6fr_0.8fr]">
            <div className="rounded-2xl border border-scholarly-border bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold">
                            Application progress
                        </h2>
                        <p className="mt-1 text-sm text-scholarly-slate">
                            Your journey to a brighter future.
                        </p>
                    </div>
                    <Link
                        href="/applications"
                        className="hidden items-center gap-1 text-sm font-bold text-scholarly-blue sm:inline-flex"
                    >
                        View applications <ArrowRight className="size-4" />
                    </Link>
                </div>
                <div className="mt-8 grid grid-cols-3 gap-3">
                    {steps.map((step, index) => {
                        const complete = journey[step.key];

                        return (
                            <div
                                key={step.key}
                                className="relative text-center"
                            >
                                <div
                                    className={`mx-auto flex size-9 items-center justify-center rounded-full ${complete ? 'bg-scholarly-blue text-white' : 'bg-scholarly-sky text-scholarly-navy'}`}
                                >
                                    {complete ? (
                                        <Check className="size-4" />
                                    ) : (
                                        index + 1
                                    )}
                                </div>
                                {complete && index < steps.length - 1 ? (
                                    <div className="absolute top-4 left-[calc(50%+22px)] h-0.5 w-[calc(100%-12px)] bg-scholarly-blue" />
                                ) : null}
                                <p className="mt-3 text-sm font-bold">
                                    {step.title}
                                </p>
                                <p className="mt-1 text-xs text-scholarly-slate">
                                    {step.body}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {currentApplication?.scholarship ? (
                    <div className="mt-8 rounded-2xl bg-scholarly-sky/60 p-5">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                            <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-white text-scholarly-blue shadow-sm">
                                <GraduationCap className="size-7" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h3 className="text-lg font-bold">
                                        {currentApplication.scholarship.title}
                                    </h3>
                                    <span className="rounded-full bg-scholarly-blue-soft px-3 py-1 text-xs font-bold text-scholarly-blue">
                                        {currentApplication.statusLabel}
                                    </span>
                                </div>
                                <p className="mt-1 text-sm text-scholarly-slate">
                                    {currentApplication.scholarship.summary ??
                                        currentApplication.nextStep}
                                </p>
                                <div className="mt-4 flex flex-wrap gap-4 text-sm text-scholarly-slate">
                                    <span className="inline-flex items-center gap-1.5">
                                        <MapPin className="size-4" />
                                        {currentApplication.scholarship.country}
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 font-bold text-scholarly-navy">
                                        <CalendarDays className="size-4" />
                                        {currentApplication.deadline ??
                                            'Rolling deadline'}
                                    </span>
                                    <span className="font-bold text-scholarly-blue">
                                        {currentApplication.progress}% complete
                                    </span>
                                </div>
                            </div>
                            <Link
                                href={`/applications/${currentApplication.id}`}
                                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-scholarly-blue px-4 py-3 text-sm font-bold text-white transition hover:bg-scholarly-blue-dark"
                            >
                                Continue application{' '}
                                <ArrowRight className="size-4" />
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="mt-8 rounded-2xl border border-dashed border-scholarly-border-strong bg-scholarly-blue-white p-6 text-center">
                        <p className="font-bold text-scholarly-navy">
                            No applications yet
                        </p>
                        <p className="mx-auto mt-1 max-w-sm text-sm text-scholarly-slate">
                            Save a scholarship you like, then start an
                            application to track every step.
                        </p>
                        <Link
                            href="/scholarships"
                            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-scholarly-blue px-4 py-2.5 text-sm font-bold text-white"
                        >
                            Find a scholarship <ArrowRight className="size-4" />
                        </Link>
                    </div>
                )}
            </div>

            <div className="space-y-6">
                <div className="rounded-2xl border border-scholarly-border bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold">
                            Upcoming deadlines
                        </h2>
                        <Link
                            href="/applications"
                            className="text-sm font-bold text-scholarly-blue"
                        >
                            View all
                        </Link>
                    </div>
                    <div className="mt-4 divide-y divide-scholarly-border">
                        {deadlines.map((deadline) => (
                            <Link
                                key={deadline.id}
                                href={deadline.url}
                                className="flex items-center gap-3 py-3 transition hover:text-scholarly-blue"
                            >
                                <div className="w-12 rounded-lg border border-scholarly-border text-center">
                                    <p className="bg-scholarly-gold-soft py-1 text-[10px] font-bold text-scholarly-gold-dark">
                                        {deadline.month}
                                    </p>
                                    <p className="py-1 text-lg font-bold">
                                        {deadline.day}
                                    </p>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-bold">
                                        {deadline.title}
                                    </p>
                                    <p className="mt-1 text-xs text-scholarly-slate">
                                        {deadline.label}
                                    </p>
                                </div>
                                <ChevronRight className="size-4 text-scholarly-slate-light" />
                            </Link>
                        ))}
                        {deadlines.length === 0 && (
                            <p className="py-6 text-center text-sm text-scholarly-slate">
                                No upcoming deadlines right now.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
