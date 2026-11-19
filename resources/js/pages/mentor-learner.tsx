import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowRight,
    CalendarDays,
    MessageCircle,
    TrendingUp,
} from 'lucide-react';

import type { MentorLearnerDetailProps } from '@/types/domain';

const toneClasses = {
    blue: 'bg-scholarly-blue-soft text-scholarly-blue',
    coral: 'bg-scholarly-coral-soft text-scholarly-coral-dark',
    gold: 'bg-scholarly-gold-soft text-scholarly-gold-dark',
    teal: 'bg-scholarly-teal-soft text-scholarly-teal-dark',
};

const statusClasses = {
    active: 'text-scholarly-slate',
    new: 'text-scholarly-teal-dark',
    warn: 'text-scholarly-coral-dark',
    muted: 'text-scholarly-slate-light',
};

/**
 * Format an ISO date as a readable deadline label.
 */
function deadlineLabel(value: string | null): string {
    if (value === null) {
        return 'No deadline set';
    }

    return new Date(value).toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

export default function MentorLearner({
    learner,
    applications,
    sessions,
    messageUrl,
}: MentorLearnerDetailProps) {
    return (
        <>
            <Head title={learner.name} />
            <div className="min-h-screen bg-scholarly-blue-white p-4 text-scholarly-navy sm:p-6 lg:p-8">
                <div className="mx-auto max-w-6xl space-y-7">
                    <header className="border-b border-scholarly-border pb-6">
                        <Link
                            href="/mentor-learners"
                            className="inline-flex items-center gap-2 text-sm font-bold text-scholarly-blue"
                        >
                            <ArrowLeft className="size-4" /> Back to learners
                        </Link>
                        <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-4">
                                <span
                                    className={`flex size-14 items-center justify-center rounded-2xl text-sm font-bold ${toneClasses[learner.tone]}`}
                                >
                                    {learner.initials}
                                </span>
                                <div>
                                    <h1 className="font-display text-4xl tracking-[-0.03em]">
                                        {learner.name}
                                    </h1>
                                    <p
                                        className={`mt-1 text-sm ${statusClasses[learner.statusTone]}`}
                                    >
                                        {learner.status} · {learner.email}
                                    </p>
                                </div>
                            </div>
                            <Link
                                href={messageUrl}
                                className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-xl bg-scholarly-blue px-4 text-sm font-bold text-white hover:bg-scholarly-blue-dark sm:self-auto"
                            >
                                <MessageCircle className="size-4" /> Message
                                learner
                            </Link>
                        </div>
                    </header>
                    <section className="grid gap-4 sm:grid-cols-3">
                        <div className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm">
                            <TrendingUp className="size-5 text-scholarly-blue" />
                            <p className="mt-5 text-3xl font-bold">
                                {learner.progress}%
                            </p>
                            <p className="mt-1 text-sm font-semibold">
                                Journey progress
                            </p>
                        </div>
                        <div className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm">
                            <CalendarDays className="size-5 text-scholarly-teal" />
                            <p className="mt-5 text-3xl font-bold">
                                {applications.length}
                            </p>
                            <p className="mt-1 text-sm font-semibold">
                                Tracked applications
                            </p>
                        </div>
                        <div className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm">
                            <MessageCircle className="size-5 text-scholarly-coral" />
                            <p className="mt-5 text-3xl font-bold">
                                {sessions.length}
                            </p>
                            <p className="mt-1 text-sm font-semibold">
                                Mentorship sessions
                            </p>
                        </div>
                    </section>
                    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.6fr)]">
                        <section className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm sm:p-6">
                            <h2 className="text-xl font-bold">Applications</h2>
                            <p className="mt-1 text-sm text-scholarly-slate">
                                Where this learner is in each application.
                            </p>
                            <div className="mt-5 divide-y divide-scholarly-border-soft">
                                {applications.map((application) => (
                                    <div
                                        key={application.id}
                                        className="py-4 first:pt-0 last:pb-0"
                                    >
                                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                            <p className="text-sm font-bold">
                                                {application.scholarship}
                                            </p>
                                            <span className="rounded-full bg-scholarly-blue-soft px-2.5 py-1 text-xs font-bold text-scholarly-blue">
                                                {application.statusLabel}
                                            </span>
                                        </div>
                                        <div className="mt-3 h-2 rounded-full bg-scholarly-blue-white">
                                            <div
                                                className="h-full rounded-full bg-scholarly-blue"
                                                style={{
                                                    width: `${application.progress}%`,
                                                }}
                                            />
                                        </div>
                                        <div className="mt-2 flex flex-wrap justify-between gap-2 text-xs text-scholarly-slate">
                                            <span>
                                                {application.progress}% complete
                                                · {application.openTasks} open
                                                tasks
                                            </span>
                                            <span>
                                                {deadlineLabel(
                                                    application.deadlineAt,
                                                )}
                                            </span>
                                        </div>
                                        {application.nextStep !== null && (
                                            <p className="mt-2 text-xs text-scholarly-slate">
                                                Next:{' '}
                                                <strong className="text-scholarly-navy">
                                                    {application.nextStep}
                                                </strong>
                                            </p>
                                        )}
                                    </div>
                                ))}
                                {applications.length === 0 && (
                                    <p className="py-10 text-center text-sm text-scholarly-slate">
                                        This learner has not started an
                                        application yet.
                                    </p>
                                )}
                            </div>
                        </section>
                        <aside className="space-y-6">
                            <section className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm">
                                <h2 className="text-lg font-bold">
                                    Mentorship
                                </h2>
                                <p className="mt-2 text-sm leading-6 text-scholarly-slate">
                                    {learner.goal}
                                </p>
                                <dl className="mt-4 space-y-3 text-xs">
                                    <div className="flex justify-between gap-3">
                                        <dt className="text-scholarly-slate">
                                            Started
                                        </dt>
                                        <dd className="font-semibold">
                                            {learner.started ?? 'Not started'}
                                        </dd>
                                    </div>
                                    <div className="flex justify-between gap-3">
                                        <dt className="text-scholarly-slate">
                                            Applications
                                        </dt>
                                        <dd className="font-semibold">
                                            {learner.applicationCount}
                                        </dd>
                                    </div>
                                </dl>
                            </section>
                            <section className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm">
                                <h2 className="text-lg font-bold">Sessions</h2>
                                <div className="mt-4 space-y-3">
                                    {sessions.map((session) => (
                                        <div
                                            key={session.id}
                                            className="rounded-xl bg-scholarly-blue-white p-3"
                                        >
                                            <p className="text-xs font-bold">
                                                {session.topic}
                                            </p>
                                            <p className="mt-1 text-xs text-scholarly-slate">
                                                {session.date} · {session.time}
                                            </p>
                                            <p className="mt-1 text-[11px] font-semibold text-scholarly-slate-light">
                                                {session.statusLabel}
                                            </p>
                                        </div>
                                    ))}
                                    {sessions.length === 0 && (
                                        <p className="text-xs text-scholarly-slate">
                                            No sessions booked yet.
                                        </p>
                                    )}
                                </div>
                                <Link
                                    href="/mentor-sessions"
                                    className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-scholarly-blue"
                                >
                                    Manage sessions{' '}
                                    <ArrowRight className="size-3.5" />
                                </Link>
                            </section>
                        </aside>
                    </div>
                </div>
            </div>
        </>
    );
}

MentorLearner.layout = () => ({
    breadcrumbs: [{ title: 'My learners', href: '/mentor-learners' }],
});
