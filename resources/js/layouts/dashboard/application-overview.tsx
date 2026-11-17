import {
    ArrowRight,
    CalendarDays,
    Check,
    ChevronRight,
    GraduationCap,
    MapPin,
    MessageCircle,
    UsersRound,
} from 'lucide-react';

import { ActionLink, comingSoon } from './action-link';

export default function ApplicationOverview() {
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
                    <ActionLink
                        href={comingSoon('View application')}
                        className="hidden items-center gap-1 text-sm font-bold text-scholarly-blue sm:inline-flex"
                    >
                        View application <ArrowRight className="size-4" />
                    </ActionLink>
                </div>
                <div className="mt-8 grid grid-cols-3 gap-3">
                    {['Discover', 'Prepare', 'Apply'].map((step, index) => (
                        <div key={step} className="relative text-center">
                            <div
                                className={`mx-auto flex size-9 items-center justify-center rounded-full ${index < 2 ? 'bg-scholarly-blue text-white' : 'bg-scholarly-sky text-scholarly-navy'}`}
                            >
                                {index < 2 ? <Check className="size-4" /> : '3'}
                            </div>
                            {index < 2 ? (
                                <div className="absolute top-4 left-[calc(50%+22px)] h-0.5 w-[calc(100%-12px)] bg-scholarly-blue" />
                            ) : null}
                            <p className="mt-3 text-sm font-bold">{step}</p>
                            <p className="mt-1 text-xs text-scholarly-slate">
                                {index === 0
                                    ? 'Find the right opportunities'
                                    : index === 1
                                      ? 'Build strong applications'
                                      : 'Submit and track'}
                            </p>
                        </div>
                    ))}
                </div>
                <div className="mt-8 rounded-2xl bg-scholarly-sky/60 p-5">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                        <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-white text-scholarly-blue shadow-sm">
                            <GraduationCap className="size-7" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-lg font-bold">
                                    Chevening Scholarships
                                </h3>
                                <span className="rounded-full bg-scholarly-blue-soft px-3 py-1 text-xs font-bold text-scholarly-blue">
                                    Draft in progress
                                </span>
                            </div>
                            <p className="mt-1 text-sm text-scholarly-slate">
                                Fully funded master’s degrees in the UK for
                                future leaders.
                            </p>
                            <div className="mt-4 flex flex-wrap gap-4 text-sm text-scholarly-slate">
                                <span className="inline-flex items-center gap-1.5">
                                    <MapPin className="size-4" /> United Kingdom
                                </span>
                                <span className="inline-flex items-center gap-1.5 font-bold text-scholarly-navy">
                                    <CalendarDays className="size-4" /> 18 Nov
                                    2026
                                </span>
                            </div>
                        </div>
                        <ActionLink
                            href={comingSoon('Continue application')}
                            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-scholarly-blue px-4 py-3 text-sm font-bold text-white transition hover:bg-scholarly-blue-dark"
                        >
                            Continue application{' '}
                            <ArrowRight className="size-4" />
                        </ActionLink>
                    </div>
                </div>
            </div>
            <div className="space-y-6">
                <div className="rounded-2xl border border-scholarly-border bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold">
                            Upcoming deadlines
                        </h2>
                        <ActionLink
                            href={comingSoon('All deadlines')}
                            className="text-sm font-bold text-scholarly-blue"
                        >
                            View all
                        </ActionLink>
                    </div>
                    <div className="mt-4 divide-y divide-scholarly-border">
                        {[
                            [
                                'NOV',
                                '18',
                                'Chevening Scholarships',
                                'Deadline soon',
                            ],
                            ['DEC', '5', 'DAAD Scholarships', '32 days left'],
                            ['JAN', '14', 'Erasmus Mundus', '72 days left'],
                        ].map(([month, day, name, label]) => (
                            <ActionLink
                                key={name}
                                href={comingSoon(name)}
                                className="flex items-center gap-3 py-3"
                            >
                                <div className="w-12 rounded-lg border border-scholarly-border text-center">
                                    <p className="bg-scholarly-gold-soft py-1 text-[10px] font-bold text-scholarly-gold-dark">
                                        {month}
                                    </p>
                                    <p className="py-1 text-lg font-bold">
                                        {day}
                                    </p>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-bold">
                                        {name}
                                    </p>
                                    <p className="mt-1 text-xs text-scholarly-slate">
                                        {label}
                                    </p>
                                </div>
                                <ChevronRight className="size-4 text-scholarly-slate-light" />
                            </ActionLink>
                        ))}
                    </div>
                </div>
                <div className="rounded-2xl border border-scholarly-border bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold">Mentor activity</h2>
                        <ActionLink
                            href={comingSoon('Mentor activity')}
                            className="text-sm font-bold text-scholarly-blue"
                        >
                            View all
                        </ActionLink>
                    </div>
                    <div className="mt-5 flex items-center gap-3">
                        <div className="flex size-12 items-center justify-center rounded-full bg-scholarly-coral-soft text-scholarly-coral-dark">
                            <UsersRound className="size-6" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="font-bold">Dr. Maya Chen</p>
                            <p className="mt-1 truncate text-sm text-scholarly-slate">
                                Your SOP feedback is ready
                            </p>
                        </div>
                    </div>
                    <ActionLink
                        href={comingSoon('View mentor message')}
                        className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-scholarly-blue"
                    >
                        View message <MessageCircle className="size-4" />
                    </ActionLink>
                </div>
            </div>
        </section>
    );
}
