import { Head, Link, useForm, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    BadgeCheck,
    CalendarClock,
    CheckCircle2,
    Globe2,
    GraduationCap,
    Languages,
    Linkedin,
    MessageCircle,
    Star,
    UsersRound,
    Video,
} from 'lucide-react';
import type { FormEvent } from 'react';

import InputError from '@/components/input-error';
import type { User } from '@/types';
import type { MentorShowProps } from '@/types/domain';

export default function MentorShow({ mentor, mentorship }: MentorShowProps) {
    const { auth } = usePage().props as { auth?: { user?: User } };
    const isStudent = auth?.user?.role === 'student';

    const mentorshipForm = useForm({
        mentor_profile_id: mentor.id,
        goals: '',
    });

    const sessionForm = useForm({
        topic: '',
        scheduled_at: '',
        duration_minutes: '45',
        notes: '',
    });

    const requestMentorship = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        mentorshipForm.post('/mentorships', {
            preserveScroll: true,
            onSuccess: () => mentorshipForm.reset('goals'),
        });
    };

    const requestSession = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!mentorship) {
            return;
        }

        sessionForm.post(`/mentorships/${mentorship.id}/sessions`, {
            preserveScroll: true,
            onSuccess: () =>
                sessionForm.reset('topic', 'scheduled_at', 'notes'),
        });
    };

    const initials = mentor.name
        .split(' ')
        .map((part) => part[0])
        .filter(Boolean)
        .slice(0, 2)
        .join('')
        .toUpperCase();

    return (
        <>
            <Head title={`${mentor.name} · Mentor`} />
            <div className="min-h-screen bg-scholarly-blue-white p-4 text-scholarly-navy sm:p-6 lg:p-8">
                <div className="mx-auto max-w-6xl space-y-6">
                    <Link
                        href="/mentors"
                        className="inline-flex items-center gap-2 text-xs font-bold text-scholarly-slate transition hover:text-scholarly-blue"
                    >
                        <ArrowLeft className="size-3.5" /> Back to mentors
                    </Link>

                    <section className="overflow-hidden rounded-3xl border border-scholarly-border bg-white shadow-sm">
                        <div className="h-24 bg-gradient-to-r from-scholarly-navy via-scholarly-blue-dark to-scholarly-blue" />
                        <div className="px-6 pb-6 sm:px-8">
                            <div className="-mt-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                                <div className="flex items-end gap-4">
                                    {mentor.avatarUrl ? (
                                        <img
                                            src={mentor.avatarUrl}
                                            alt={mentor.name}
                                            className="size-24 rounded-3xl border-4 border-white object-cover shadow-sm"
                                        />
                                    ) : (
                                        <div className="flex size-24 items-center justify-center rounded-3xl border-4 border-white bg-scholarly-blue text-2xl font-bold text-white shadow-sm">
                                            {initials}
                                        </div>
                                    )}
                                    <div className="pb-1">
                                        <div className="flex items-center gap-2">
                                            <h1 className="font-display text-3xl tracking-[-0.03em] sm:text-4xl">
                                                {mentor.name}
                                            </h1>
                                            {mentor.verified && (
                                                <BadgeCheck className="size-5 text-scholarly-blue" />
                                            )}
                                        </div>
                                        <p className="mt-1 text-sm text-scholarly-slate">
                                            {[mentor.role, mentor.organization]
                                                .filter(Boolean)
                                                .join(' · ')}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2 pb-1">
                                    {isStudent && (
                                        <a
                                            href="#mentorship"
                                            className="inline-flex h-11 items-center gap-2 rounded-xl bg-scholarly-blue px-5 text-sm font-bold text-white transition hover:bg-scholarly-blue-dark"
                                        >
                                            <MessageCircle className="size-4" />{' '}
                                            {mentorship
                                                ? 'Request a session'
                                                : 'Request mentorship'}
                                        </a>
                                    )}
                                    <a
                                        href="#availability"
                                        className="inline-flex h-11 items-center gap-2 rounded-xl border border-scholarly-border px-5 text-sm font-bold text-scholarly-navy transition hover:border-scholarly-blue hover:text-scholarly-blue"
                                    >
                                        <CalendarClock className="size-4" />{' '}
                                        Availability
                                    </a>
                                </div>
                            </div>

                            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-scholarly-border pt-5 text-xs text-scholarly-slate">
                                <span className="inline-flex items-center gap-1.5 font-bold text-scholarly-navy">
                                    <Star className="size-3.5 fill-scholarly-gold text-scholarly-gold" />{' '}
                                    {mentor.rating}
                                    <span className="font-normal text-scholarly-slate">
                                        ({mentor.reviews} reviews)
                                    </span>
                                </span>
                                <span className="inline-flex items-center gap-1.5">
                                    <UsersRound className="size-3.5 text-scholarly-blue" />{' '}
                                    {mentor.sessions} sessions ·{' '}
                                    {mentor.learners} learners
                                </span>
                                <span className="inline-flex items-center gap-1.5">
                                    <Globe2 className="size-3.5 text-scholarly-blue" />{' '}
                                    {mentor.country}
                                </span>
                                <span
                                    className={`inline-flex items-center gap-1.5 font-bold ${mentor.availability === 'available' ? 'text-scholarly-teal-dark' : 'text-scholarly-gold-dark'}`}
                                >
                                    <span
                                        className={`size-2 rounded-full ${mentor.availability === 'available' ? 'bg-scholarly-teal' : 'bg-scholarly-gold'}`}
                                    />
                                    {mentor.availabilityLabel}
                                </span>
                            </div>
                        </div>
                    </section>

                    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
                        <div className="space-y-6">
                            <section className="rounded-2xl border border-scholarly-border bg-white p-6 shadow-sm">
                                <h2 className="text-xl font-bold">About</h2>
                                <p className="mt-3 text-sm leading-7 whitespace-pre-line text-scholarly-slate">
                                    {mentor.bio ??
                                        'This mentor has not added a bio yet.'}
                                </p>

                                {mentor.expertise.length > 0 && (
                                    <div className="mt-6">
                                        <p className="text-xs font-bold tracking-[0.12em] text-scholarly-slate uppercase">
                                            Areas of expertise
                                        </p>
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {mentor.expertise.map((item) => (
                                                <span
                                                    key={item}
                                                    className="rounded-full bg-scholarly-blue-soft px-3 py-1.5 text-xs font-semibold text-scholarly-blue"
                                                >
                                                    {item}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="mt-6 grid gap-4 border-t border-scholarly-border pt-5 sm:grid-cols-2">
                                    <div className="flex items-start gap-3">
                                        <Languages className="mt-0.5 size-4 text-scholarly-blue" />
                                        <div>
                                            <p className="text-xs font-bold">
                                                Languages
                                            </p>
                                            <p className="mt-1 text-xs text-scholarly-slate">
                                                {mentor.languages.length > 0
                                                    ? mentor.languages.join(
                                                          ', ',
                                                      )
                                                    : 'Not listed yet'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <GraduationCap className="mt-0.5 size-4 text-scholarly-blue" />
                                        <div>
                                            <p className="text-xs font-bold">
                                                Experience
                                            </p>
                                            <p className="mt-1 text-xs text-scholarly-slate">
                                                {mentor.yearsExperience
                                                    ? `${mentor.yearsExperience} years mentoring`
                                                    : 'Experienced mentor'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {(mentor.linkedinUrl || mentor.websiteUrl) && (
                                    <div className="mt-5 flex flex-wrap gap-2">
                                        {mentor.linkedinUrl && (
                                            <a
                                                href={mentor.linkedinUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex h-10 items-center gap-2 rounded-lg border border-scholarly-border px-4 text-xs font-bold text-scholarly-navy transition hover:border-scholarly-blue hover:text-scholarly-blue"
                                            >
                                                <Linkedin className="size-3.5" />{' '}
                                                LinkedIn
                                            </a>
                                        )}
                                        {mentor.websiteUrl && (
                                            <a
                                                href={mentor.websiteUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex h-10 items-center gap-2 rounded-lg border border-scholarly-border px-4 text-xs font-bold text-scholarly-navy transition hover:border-scholarly-blue hover:text-scholarly-blue"
                                            >
                                                <Globe2 className="size-3.5" />{' '}
                                                Website
                                            </a>
                                        )}
                                    </div>
                                )}
                            </section>

                            {mentor.introVideoUrl && (
                                <section className="rounded-2xl border border-scholarly-border bg-white p-6 shadow-sm">
                                    <h2 className="flex items-center gap-2 text-xl font-bold">
                                        <Video className="size-5 text-scholarly-blue" />{' '}
                                        Introduction
                                    </h2>
                                    <video
                                        controls
                                        src={mentor.introVideoUrl}
                                        className="mt-4 w-full rounded-xl bg-scholarly-navy"
                                    />
                                </section>
                            )}
                        </div>

                        <aside className="space-y-6">
                            <section
                                id="availability"
                                className="rounded-2xl border border-scholarly-border bg-white p-6 shadow-sm"
                            >
                                <h2 className="flex items-center gap-2 text-lg font-bold">
                                    <CalendarClock className="size-4 text-scholarly-blue" />{' '}
                                    Weekly availability
                                </h2>
                                <p className="mt-1 text-xs leading-5 text-scholarly-slate">
                                    Times are shown in{' '}
                                    {mentor.slots[0]?.timezone ?? 'UTC'}.
                                </p>
                                <div className="mt-4 space-y-2">
                                    {mentor.slots.length > 0 ? (
                                        mentor.slots.map((slot) => (
                                            <div
                                                key={slot.id}
                                                className="rounded-lg bg-scholarly-blue-white px-3 py-2.5 text-xs font-semibold text-scholarly-navy"
                                            >
                                                {slot.label}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="rounded-lg bg-scholarly-blue-white px-3 py-4 text-center text-xs text-scholarly-slate">
                                            No weekly availability has been
                                            published yet.
                                        </p>
                                    )}
                                </div>
                            </section>

                            {isStudent && (
                                <section
                                    id="mentorship"
                                    className="rounded-2xl border border-scholarly-border bg-white p-6 shadow-sm"
                                >
                                    {mentorship ? (
                                        <>
                                            <h2 className="flex items-center gap-2 text-lg font-bold">
                                                <CheckCircle2 className="size-4 text-scholarly-teal" />{' '}
                                                Your mentorship
                                            </h2>
                                            <div className="mt-3 rounded-xl bg-scholarly-teal-soft px-3 py-2 text-xs font-bold text-scholarly-teal-dark">
                                                {mentorship.statusLabel}
                                                {mentorship.startedAt
                                                    ? ` · since ${mentorship.startedAt}`
                                                    : ''}
                                            </div>
                                            {mentorship.goals && (
                                                <p className="mt-3 text-xs leading-5 text-scholarly-slate">
                                                    {mentorship.goals}
                                                </p>
                                            )}
                                            {mentorship.nextSession && (
                                                <div className="mt-4 rounded-xl bg-scholarly-blue-white p-3">
                                                    <p className="text-[11px] font-bold tracking-[0.1em] text-scholarly-slate uppercase">
                                                        Next session
                                                    </p>
                                                    <p className="mt-1 text-sm font-bold">
                                                        {
                                                            mentorship
                                                                .nextSession
                                                                .topic
                                                        }
                                                    </p>
                                                    <p className="mt-1 text-xs text-scholarly-slate">
                                                        {
                                                            mentorship
                                                                .nextSession
                                                                .date
                                                        }{' '}
                                                        ·{' '}
                                                        {
                                                            mentorship
                                                                .nextSession
                                                                .time
                                                        }{' '}
                                                        ·{' '}
                                                        {
                                                            mentorship
                                                                .nextSession
                                                                .statusLabel
                                                        }
                                                    </p>
                                                </div>
                                            )}

                                            {mentorship.canRequestSession &&
                                                !mentorship.hasPendingSession && (
                                                    <form
                                                        onSubmit={
                                                            requestSession
                                                        }
                                                        className="mt-4 space-y-3 border-t border-scholarly-border pt-4"
                                                    >
                                                        <p className="text-xs font-bold">
                                                            Request a session
                                                        </p>
                                                        <div>
                                                            <input
                                                                value={
                                                                    sessionForm
                                                                        .data
                                                                        .topic
                                                                }
                                                                onChange={(
                                                                    event,
                                                                ) =>
                                                                    sessionForm.setData(
                                                                        'topic',
                                                                        event
                                                                            .target
                                                                            .value,
                                                                    )
                                                                }
                                                                placeholder="What would you like help with?"
                                                                className="h-10 w-full rounded-lg border border-scholarly-border px-3 text-xs outline-none focus:border-scholarly-blue"
                                                            />
                                                            <InputError
                                                                message={
                                                                    sessionForm
                                                                        .errors
                                                                        .topic
                                                                }
                                                                className="mt-1"
                                                            />
                                                        </div>
                                                        <input
                                                            type="datetime-local"
                                                            value={
                                                                sessionForm.data
                                                                    .scheduled_at
                                                            }
                                                            onChange={(event) =>
                                                                sessionForm.setData(
                                                                    'scheduled_at',
                                                                    event.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="h-10 w-full rounded-lg border border-scholarly-border px-3 text-xs outline-none focus:border-scholarly-blue"
                                                        />
                                                        <InputError
                                                            message={
                                                                sessionForm
                                                                    .errors
                                                                    .scheduled_at
                                                            }
                                                        />
                                                        <select
                                                            value={
                                                                sessionForm.data
                                                                    .duration_minutes
                                                            }
                                                            onChange={(event) =>
                                                                sessionForm.setData(
                                                                    'duration_minutes',
                                                                    event.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="h-10 w-full rounded-lg border border-scholarly-border px-3 text-xs outline-none focus:border-scholarly-blue"
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
                                                        </select>
                                                        <button
                                                            type="submit"
                                                            disabled={
                                                                sessionForm.processing
                                                            }
                                                            className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-scholarly-navy text-xs font-bold text-white transition hover:bg-scholarly-navy/90 disabled:opacity-60"
                                                        >
                                                            Request session
                                                        </button>
                                                    </form>
                                                )}

                                            {mentorship.hasPendingSession && (
                                                <p className="mt-4 rounded-lg bg-scholarly-gold-soft px-3 py-2 text-xs text-scholarly-gold-dark">
                                                    Your session request is
                                                    waiting for your mentor to
                                                    confirm.
                                                </p>
                                            )}
                                        </>
                                    ) : (
                                        <form onSubmit={requestMentorship}>
                                            <h2 className="flex items-center gap-2 text-lg font-bold">
                                                <MessageCircle className="size-4 text-scholarly-blue" />{' '}
                                                Request mentorship
                                            </h2>
                                            <p className="mt-2 text-xs leading-5 text-scholarly-slate">
                                                Tell {mentor.name} what you are
                                                working towards. They will be
                                                able to see your request and
                                                respond.
                                            </p>
                                            <textarea
                                                value={
                                                    mentorshipForm.data.goals
                                                }
                                                onChange={(event) =>
                                                    mentorshipForm.setData(
                                                        'goals',
                                                        event.target.value,
                                                    )
                                                }
                                                rows={4}
                                                placeholder="I am applying for… and would love help with…"
                                                className="mt-3 w-full rounded-lg border border-scholarly-border p-3 text-xs outline-none focus:border-scholarly-blue"
                                            />
                                            <InputError
                                                message={
                                                    mentorshipForm.errors.goals
                                                }
                                                className="mt-1"
                                            />
                                            <button
                                                type="submit"
                                                disabled={
                                                    mentorshipForm.processing
                                                }
                                                className="mt-3 inline-flex h-10 w-full items-center justify-center rounded-lg bg-scholarly-blue text-xs font-bold text-white transition hover:bg-scholarly-blue-dark disabled:opacity-60"
                                            >
                                                Send mentorship request
                                            </button>
                                        </form>
                                    )}
                                </section>
                            )}

                            <section className="rounded-2xl border border-scholarly-border bg-white p-6 shadow-sm">
                                <h2 className="text-sm font-bold">
                                    Response time
                                </h2>
                                <p className="mt-2 text-sm text-scholarly-slate">
                                    {mentor.responseTime}
                                </p>
                                <div className="mt-4 grid grid-cols-2 gap-3">
                                    <div className="rounded-lg bg-scholarly-blue-white p-3">
                                        <p className="text-xl font-bold text-scholarly-navy">
                                            {mentor.sessions}
                                        </p>
                                        <p className="text-[11px] text-scholarly-slate">
                                            Sessions
                                        </p>
                                    </div>
                                    <div className="rounded-lg bg-scholarly-blue-white p-3">
                                        <p className="text-xl font-bold text-scholarly-navy">
                                            {mentor.learners}
                                        </p>
                                        <p className="text-[11px] text-scholarly-slate">
                                            Learners
                                        </p>
                                    </div>
                                </div>
                            </section>
                        </aside>
                    </div>
                </div>
            </div>
        </>
    );
}

MentorShow.layout = () => ({
    breadcrumbs: [{ title: 'Mentors', href: '/mentors' }],
});
