import { Head, router, useForm } from '@inertiajs/react';
import { CalendarDays, Check, Clock3, Plus, Video } from 'lucide-react';
import type { FormEvent } from 'react';

import InputError from '@/components/input-error';
import type { MentorSessionDetail, MentorSessionsProps } from '@/types/domain';

const toneClasses = {
    blue: 'bg-scholarly-blue-soft text-scholarly-blue',
    coral: 'bg-scholarly-coral-soft text-scholarly-coral-dark',
    gold: 'bg-scholarly-gold-soft text-scholarly-gold-dark',
    teal: 'bg-scholarly-teal-soft text-scholarly-teal-dark',
};

function SessionRow({ session }: { session: MentorSessionDetail }) {
    const update = (status: string, attendance?: string) => {
        router.patch(
            `/mentor-sessions/${session.id}`,
            {
                status,
                ...(attendance ? { attendance_status: attendance } : {}),
                notes: session.notes,
                meeting_url: session.meetingUrl,
            },
            { preserveScroll: true },
        );
    };

    return (
        <div className="flex flex-col gap-4 rounded-xl border border-scholarly-border-soft bg-scholarly-blue-white p-4 sm:flex-row sm:items-center">
            <div className="w-20 shrink-0">
                <p className="text-sm font-bold">{session.date}</p>
                <p className="mt-1 text-xs text-scholarly-slate">
                    {session.time}
                </p>
            </div>
            <div className="h-10 w-1 rounded-full bg-scholarly-blue" />
            <div
                className={`flex size-10 items-center justify-center rounded-full text-xs font-bold ${toneClasses[session.tone]}`}
            >
                {session.initials}
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-sm font-bold">{session.learner}</p>
                <p className="mt-1 text-xs text-scholarly-slate">
                    {session.topic} · {session.duration}
                </p>
                <p className="mt-1 text-[11px] text-scholarly-slate-light">
                    {session.statusLabel}
                    {session.requestedByStudent
                        ? ' · requested by learner'
                        : ''}
                </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
                {session.meetingUrl && (
                    <a
                        href={session.meetingUrl}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Open meeting link"
                        className="rounded-lg p-2 text-scholarly-blue hover:bg-scholarly-blue-soft"
                    >
                        <Video className="size-4" />
                    </a>
                )}
                {session.status === 'requested' && (
                    <button
                        type="button"
                        onClick={() => update('confirmed')}
                        className="rounded-lg bg-scholarly-blue px-3 py-2 text-xs font-bold text-white hover:bg-scholarly-blue-dark"
                    >
                        Confirm
                    </button>
                )}
                {session.status === 'confirmed' && (
                    <>
                        <button
                            type="button"
                            onClick={() => update('completed', 'attended')}
                            className="rounded-lg bg-scholarly-teal px-3 py-2 text-xs font-bold text-white hover:bg-scholarly-teal-dark"
                        >
                            Complete
                        </button>
                        <button
                            type="button"
                            onClick={() => update('cancelled')}
                            className="rounded-lg border border-scholarly-border px-3 py-2 text-xs font-bold text-scholarly-slate hover:border-scholarly-coral hover:text-scholarly-coral-dark"
                        >
                            Cancel
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default function MentorSessions({
    stats,
    weekLabel,
    upcoming,
    recent,
    availability,
    learners,
}: MentorSessionsProps) {
    const form = useForm({
        mentorship_id: learners[0]?.value ?? '',
        topic: '',
        scheduled_at: '',
        duration_minutes: '45',
        meeting_url: '',
        notes: '',
    });

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        form.post('/mentor-sessions', {
            preserveScroll: true,
            onSuccess: () => form.reset('topic', 'scheduled_at', 'notes'),
        });
    };

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
                        <a
                            href="#schedule"
                            className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-xl bg-scholarly-blue px-4 text-sm font-bold text-white hover:bg-scholarly-blue-dark sm:self-auto"
                        >
                            <Plus className="size-4" /> Schedule a session
                        </a>
                    </header>
                    <section className="grid gap-4 sm:grid-cols-3">
                        <div className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm">
                            <CalendarDays className="size-5 text-scholarly-blue" />
                            <p className="mt-5 text-3xl font-bold">
                                {stats.upcoming}
                            </p>
                            <p className="mt-1 text-sm font-semibold">
                                Upcoming sessions
                            </p>
                        </div>
                        <div className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm">
                            <Clock3 className="size-5 text-scholarly-teal" />
                            <p className="mt-5 text-3xl font-bold">
                                {stats.availableHours}
                            </p>
                            <p className="mt-1 text-sm font-semibold">
                                Available each week
                            </p>
                        </div>
                        <div className="rounded-2xl border border-scholarly-border bg-scholarly-navy p-5 text-white shadow-sm">
                            <Check className="size-5 text-scholarly-gold" />
                            <p className="mt-5 text-3xl font-bold">
                                {stats.attendanceRate}%
                            </p>
                            <p className="mt-1 text-sm font-semibold">
                                Attendance rate
                            </p>
                            <p className="mt-1 text-xs text-white/60">
                                {stats.attendanceSample} tracked sessions
                            </p>
                        </div>
                    </section>
                    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                        <div className="space-y-6">
                            <section className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm sm:p-6">
                                <div className="flex items-center justify-between border-b border-scholarly-border pb-4">
                                    <div>
                                        <h2 className="text-xl font-bold">
                                            Your week
                                        </h2>
                                        <p className="mt-1 text-sm text-scholarly-slate">
                                            {weekLabel}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-5 space-y-3">
                                    {upcoming.map((session) => (
                                        <SessionRow
                                            key={session.id}
                                            session={session}
                                        />
                                    ))}
                                    {upcoming.length === 0 && (
                                        <p className="rounded-xl bg-scholarly-blue-white p-8 text-center text-sm text-scholarly-slate">
                                            No upcoming sessions yet. Schedule
                                            one to get started.
                                        </p>
                                    )}
                                </div>
                            </section>

                            {recent.length > 0 && (
                                <section className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm sm:p-6">
                                    <h2 className="text-xl font-bold">
                                        Recent sessions
                                    </h2>
                                    <div className="mt-5 space-y-3">
                                        {recent.map((session) => (
                                            <SessionRow
                                                key={session.id}
                                                session={session}
                                            />
                                        ))}
                                    </div>
                                </section>
                            )}

                            <section
                                id="schedule"
                                className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm sm:p-6"
                            >
                                <h2 className="text-xl font-bold">
                                    Schedule a session
                                </h2>
                                <p className="mt-1 text-sm text-scholarly-slate">
                                    Book a conversation with one of your active
                                    learners.
                                </p>
                                <form
                                    onSubmit={submit}
                                    className="mt-5 grid gap-4 sm:grid-cols-2"
                                >
                                    <div>
                                        <label className="text-xs font-bold">
                                            Learner
                                        </label>
                                        <select
                                            value={form.data.mentorship_id}
                                            onChange={(event) =>
                                                form.setData(
                                                    'mentorship_id',
                                                    event.target.value,
                                                )
                                            }
                                            className="mt-1 h-10 w-full rounded-lg border border-scholarly-border bg-white px-3 text-sm outline-none focus:border-scholarly-blue"
                                        >
                                            {learners.map((learner) => (
                                                <option
                                                    key={learner.value}
                                                    value={learner.value}
                                                >
                                                    {learner.label}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError
                                            message={form.errors.mentorship_id}
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold">
                                            Topic
                                        </label>
                                        <input
                                            value={form.data.topic}
                                            onChange={(event) =>
                                                form.setData(
                                                    'topic',
                                                    event.target.value,
                                                )
                                            }
                                            placeholder="Statement of purpose review"
                                            className="mt-1 h-10 w-full rounded-lg border border-scholarly-border bg-white px-3 text-sm outline-none focus:border-scholarly-blue"
                                        />
                                        <InputError
                                            message={form.errors.topic}
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold">
                                            Date and time
                                        </label>
                                        <input
                                            type="datetime-local"
                                            value={form.data.scheduled_at}
                                            onChange={(event) =>
                                                form.setData(
                                                    'scheduled_at',
                                                    event.target.value,
                                                )
                                            }
                                            className="mt-1 h-10 w-full rounded-lg border border-scholarly-border bg-white px-3 text-sm outline-none focus:border-scholarly-blue"
                                        />
                                        <InputError
                                            message={form.errors.scheduled_at}
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold">
                                            Duration
                                        </label>
                                        <select
                                            value={form.data.duration_minutes}
                                            onChange={(event) =>
                                                form.setData(
                                                    'duration_minutes',
                                                    event.target.value,
                                                )
                                            }
                                            className="mt-1 h-10 w-full rounded-lg border border-scholarly-border bg-white px-3 text-sm outline-none focus:border-scholarly-blue"
                                        >
                                            <option value="30">
                                                30 minutes
                                            </option>
                                            <option value="45">
                                                45 minutes
                                            </option>
                                            <option value="60">
                                                60 minutes
                                            </option>
                                            <option value="90">
                                                90 minutes
                                            </option>
                                        </select>
                                        <InputError
                                            message={
                                                form.errors.duration_minutes
                                            }
                                            className="mt-1"
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="text-xs font-bold">
                                            Meeting link (optional)
                                        </label>
                                        <input
                                            value={form.data.meeting_url}
                                            onChange={(event) =>
                                                form.setData(
                                                    'meeting_url',
                                                    event.target.value,
                                                )
                                            }
                                            placeholder="https://meet.example.com/..."
                                            className="mt-1 h-10 w-full rounded-lg border border-scholarly-border bg-white px-3 text-sm outline-none focus:border-scholarly-blue"
                                        />
                                        <InputError
                                            message={form.errors.meeting_url}
                                            className="mt-1"
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="text-xs font-bold">
                                            Notes (optional)
                                        </label>
                                        <textarea
                                            value={form.data.notes}
                                            onChange={(event) =>
                                                form.setData(
                                                    'notes',
                                                    event.target.value,
                                                )
                                            }
                                            rows={3}
                                            className="mt-1 w-full rounded-lg border border-scholarly-border bg-white p-3 text-sm outline-none focus:border-scholarly-blue"
                                        />
                                        <InputError
                                            message={form.errors.notes}
                                            className="mt-1"
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <button
                                            type="submit"
                                            disabled={form.processing}
                                            className="inline-flex h-10 items-center justify-center rounded-lg bg-scholarly-blue px-5 text-sm font-bold text-white hover:bg-scholarly-blue-dark disabled:opacity-60"
                                        >
                                            Schedule session
                                        </button>
                                    </div>
                                </form>
                            </section>
                        </div>
                        <aside className="space-y-6">
                            <section className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm">
                                <h2 className="text-base font-bold">
                                    Availability
                                </h2>
                                <p className="mt-1 text-xs leading-5 text-scholarly-slate">
                                    Let learners know when they can request a
                                    conversation.
                                </p>
                                <div className="mt-5 space-y-3">
                                    {availability.length > 0 ? (
                                        availability.map((slot) => (
                                            <div
                                                key={slot.id}
                                                className="flex items-center gap-3 rounded-lg bg-scholarly-blue-white p-3"
                                            >
                                                <span className="flex size-6 items-center justify-center rounded-full bg-scholarly-teal-soft text-scholarly-teal-dark">
                                                    <Check className="size-3" />
                                                </span>
                                                <span className="text-xs font-semibold">
                                                    {slot.label}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="rounded-lg bg-scholarly-blue-white p-4 text-center text-xs text-scholarly-slate">
                                            No weekly availability published
                                            yet.
                                        </p>
                                    )}
                                </div>
                                <a
                                    href="/mentor-profile"
                                    className="mt-5 inline-flex text-xs font-bold text-scholarly-blue"
                                >
                                    Edit availability
                                </a>
                            </section>
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
