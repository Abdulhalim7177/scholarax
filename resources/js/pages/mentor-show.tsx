import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    BadgeCheck,
    CalendarClock,
    Globe2,
    GraduationCap,
    Languages,
    Linkedin,
    MessageCircle,
    Star,
    UsersRound,
    Video,
} from 'lucide-react';

import type { MentorShowProps } from '@/types/domain';

export default function MentorShow({ mentor }: MentorShowProps) {
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
                                    <Link
                                        href={`/coming-soon?feature=${encodeURIComponent(`Message ${mentor.name}`)}`}
                                        className="inline-flex h-11 items-center gap-2 rounded-xl bg-scholarly-blue px-5 text-sm font-bold text-white transition hover:bg-scholarly-blue-dark"
                                    >
                                        <MessageCircle className="size-4" />{' '}
                                        Message mentor
                                    </Link>
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
                                <Link
                                    href={`/coming-soon?feature=${encodeURIComponent(`Book a session with ${mentor.name}`)}`}
                                    className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-lg bg-scholarly-navy text-xs font-bold text-white transition hover:bg-scholarly-navy/90"
                                >
                                    Request a session
                                </Link>
                            </section>

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
