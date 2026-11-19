import { Link } from '@inertiajs/react';
import { ArrowUpRight, Clock3, MessageCircle, Star } from 'lucide-react';

import type { MentorSummary } from '@/types/domain';

type MentorCardProps = {
    mentor: MentorSummary;
};

const accentClasses = {
    blue: 'bg-scholarly-blue-soft text-scholarly-blue',
    teal: 'bg-scholarly-teal-soft text-scholarly-teal-dark',
    coral: 'bg-scholarly-coral-soft text-scholarly-coral-dark',
    gold: 'bg-scholarly-gold-soft text-scholarly-gold-dark',
};

export default function MentorCard({ mentor }: MentorCardProps) {
    const initials = mentor.name
        .split(' ')
        .map((part) => part[0])
        .filter(Boolean)
        .slice(0, 2)
        .join('')
        .toUpperCase();

    return (
        <article
            className={`relative flex h-full flex-col rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-[0_14px_35px_rgba(16,42,67,0.08)] ${mentor.featured ? 'border-scholarly-blue' : 'border-scholarly-border'}`}
        >
            {mentor.featured && (
                <span className="absolute -top-3 left-5 rounded-full bg-scholarly-blue px-3 py-1 text-[10px] font-bold tracking-[0.12em] text-white uppercase">
                    Recommended match
                </span>
            )}
            <div className="flex items-start gap-4">
                <div className="relative shrink-0">
                    {mentor.avatarUrl ? (
                        <img
                            src={mentor.avatarUrl}
                            alt={mentor.name}
                            className="size-16 rounded-2xl object-cover"
                        />
                    ) : (
                        <div className="flex size-16 items-center justify-center rounded-2xl bg-scholarly-blue-soft text-lg font-bold text-scholarly-blue">
                            {initials}
                        </div>
                    )}
                    <span
                        className={`absolute -right-1 -bottom-1 size-4 rounded-full border-2 border-white ${mentor.availability === 'available' ? 'bg-scholarly-teal' : 'bg-scholarly-gold'}`}
                    />
                </div>
                <div className="min-w-0 flex-1">
                    <h2 className="text-base font-bold text-scholarly-navy">
                        {mentor.name}
                    </h2>
                    <p className="mt-1 text-xs leading-5 text-scholarly-slate">
                        {mentor.role ?? mentor.headline ?? 'Mentor'}
                    </p>
                    <p className="text-xs text-scholarly-slate-light">
                        {mentor.organization ?? mentor.country}
                    </p>
                </div>
            </div>
            <div className="mt-5 flex items-center gap-3 text-xs">
                <span className="inline-flex items-center gap-1 font-bold text-scholarly-navy">
                    <Star className="size-3.5 fill-scholarly-gold text-scholarly-gold" />{' '}
                    {mentor.rating}{' '}
                    <span className="font-normal text-scholarly-slate">
                        ({mentor.reviews})
                    </span>
                </span>
                <span className="text-scholarly-border">|</span>
                <span className="text-scholarly-slate">
                    {mentor.sessions} sessions
                </span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
                {mentor.expertise.map((item) => (
                    <span
                        key={item}
                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${accentClasses[mentor.accent]}`}
                    >
                        {item}
                    </span>
                ))}
            </div>
            <div className="mt-5 border-t border-scholarly-border-soft pt-4">
                <div className="flex items-center gap-2 text-xs text-scholarly-slate">
                    <Clock3 className="size-3.5 text-scholarly-blue" />{' '}
                    {mentor.responseTime}
                </div>
                <p
                    className={`mt-2 text-xs font-bold ${mentor.availability === 'available' ? 'text-scholarly-teal-dark' : 'text-scholarly-gold-dark'}`}
                >
                    {mentor.availabilityLabel}
                </p>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2">
                <Link
                    href={`/mentors/${mentor.id}`}
                    className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-scholarly-border px-3 text-xs font-bold text-scholarly-navy transition hover:border-scholarly-blue hover:text-scholarly-blue"
                >
                    View profile <ArrowUpRight className="size-3.5" />
                </Link>
                <Link
                    href={`/mentors/${mentor.id}#mentorship`}
                    className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg bg-scholarly-blue px-3 text-xs font-bold text-white transition hover:bg-scholarly-blue-dark"
                >
                    Message <MessageCircle className="size-3.5" />
                </Link>
            </div>
        </article>
    );
}
