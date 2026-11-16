import { Head, Link } from '@inertiajs/react';
import { CalendarDays, Check, Clock3, Plus, Video } from 'lucide-react';

import { sessions } from '@/layouts/mentor-dashboard/data';

export default function MentorSessions() {
    return (
        <>
            <Head title="Sessions" />
            <div className="min-h-screen bg-scholarly-blue-white p-4 text-scholarly-navy sm:p-6 lg:p-8">
                <div className="mx-auto max-w-6xl space-y-7">
                    <header className="flex flex-col gap-5 border-b border-scholarly-border pb-6 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-sm font-semibold text-scholarly-blue">
                                Make space for good conversations
                            </p>
                            <h1 className="mt-2 font-display text-4xl tracking-[-0.03em] sm:text-5xl">
                                Sessions
                            </h1>
                            <p className="mt-3 text-sm leading-6 text-scholarly-slate">
                                Manage your upcoming learner conversations and
                                availability.
                            </p>
                        </div>
                        <Link
                            href="/mentor-coming-soon?feature=Create%20mentor%20session"
                            className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-xl bg-scholarly-blue px-4 text-sm font-bold text-white hover:bg-scholarly-blue-dark sm:self-auto"
                        >
                            <Plus className="size-4" /> Add availability
                        </Link>
                    </header>
                    <section className="grid gap-4 sm:grid-cols-3">
                        <div className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm">
                            <CalendarDays className="size-5 text-scholarly-blue" />
                            <p className="mt-5 text-3xl font-bold">3</p>
                            <p className="mt-1 text-sm font-semibold">
                                Upcoming sessions
                            </p>
                        </div>
                        <div className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm">
                            <Clock3 className="size-5 text-scholarly-teal" />
                            <p className="mt-5 text-3xl font-bold">4 hrs</p>
                            <p className="mt-1 text-sm font-semibold">
                                Available this week
                            </p>
                        </div>
                        <div className="rounded-2xl border border-scholarly-border bg-scholarly-navy p-5 text-white shadow-sm">
                            <Check className="size-5 text-scholarly-gold" />
                            <p className="mt-5 text-3xl font-bold">96%</p>
                            <p className="mt-1 text-sm font-semibold">
                                Attendance rate
                            </p>
                        </div>
                    </section>
                    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                        <section className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm sm:p-6">
                            <div className="flex items-center justify-between border-b border-scholarly-border pb-4">
                                <div>
                                    <h2 className="text-xl font-bold">
                                        Your week
                                    </h2>
                                    <p className="mt-1 text-sm text-scholarly-slate">
                                        10–16 November 2026
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        className="rounded-lg border border-scholarly-border px-3 py-2 text-xs font-bold"
                                    >
                                        Today
                                    </button>
                                    <button
                                        type="button"
                                        className="rounded-lg bg-scholarly-blue px-3 py-2 text-xs font-bold text-white"
                                    >
                                        Week
                                    </button>
                                </div>
                            </div>
                            <div className="mt-5 space-y-3">
                                {sessions.map((session) => (
                                    <Link
                                        key={session.id}
                                        href={`/mentor-coming-soon?feature=Session%20with%20${encodeURIComponent(session.learner)}`}
                                        className="flex items-center gap-4 rounded-xl border border-scholarly-border-soft bg-scholarly-blue-white p-4 transition hover:border-scholarly-blue"
                                    >
                                        <div className="w-20 shrink-0">
                                            <p className="text-sm font-bold">
                                                {session.date}
                                            </p>
                                            <p className="mt-1 text-xs text-scholarly-slate">
                                                {session.time}
                                            </p>
                                        </div>
                                        <div className="h-10 w-1 rounded-full bg-scholarly-blue" />
                                        <div className="flex size-10 items-center justify-center rounded-full bg-scholarly-coral-soft text-xs font-bold text-scholarly-coral-dark">
                                            {session.initials}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-bold">
                                                {session.learner}
                                            </p>
                                            <p className="mt-1 text-xs text-scholarly-slate">
                                                {session.topic}
                                            </p>
                                        </div>
                                        <Video className="size-4 text-scholarly-blue" />
                                    </Link>
                                ))}
                            </div>
                        </section>
                        <aside className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm">
                            <h2 className="text-base font-bold">
                                Availability
                            </h2>
                            <p className="mt-1 text-xs leading-5 text-scholarly-slate">
                                Let learners know when they can request a
                                conversation.
                            </p>
                            <div className="mt-5 space-y-3">
                                {[
                                    'Monday · 9:00 AM – 12:00 PM',
                                    'Wednesday · 2:00 PM – 5:00 PM',
                                    'Saturday · 10:00 AM – 1:00 PM',
                                ].map((slot) => (
                                    <div
                                        key={slot}
                                        className="flex items-center gap-3 rounded-lg bg-scholarly-blue-white p-3"
                                    >
                                        <span className="flex size-6 items-center justify-center rounded-full bg-scholarly-teal-soft text-scholarly-teal-dark">
                                            <Check className="size-3" />
                                        </span>
                                        <span className="text-xs font-semibold">
                                            {slot}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <Link
                                href="/mentor-coming-soon?feature=Availability%20settings"
                                className="mt-5 inline-flex text-xs font-bold text-scholarly-blue"
                            >
                                Edit availability
                            </Link>
                        </aside>
                    </div>
                </div>
            </div>
        </>
    );
}

MentorSessions.layout = () => ({
    breadcrumbs: [{ title: 'Sessions', href: '/mentor-sessions' }],
});
