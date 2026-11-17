import { Link } from '@inertiajs/react';
import { ArrowUpRight, Clock3, MessageCircle, Star } from 'lucide-react';

import type { Mentor } from './data';

type MentorCardProps = {
    mentor: Mentor;
};

const accentClasses = {
    blue: 'bg-scholarly-blue-soft text-scholarly-blue',
    teal: 'bg-scholarly-teal-soft text-scholarly-teal-dark',
    coral: 'bg-scholarly-coral-soft text-scholarly-coral-dark',
    gold: 'bg-scholarly-gold-soft text-scholarly-gold-dark',
};

export default function MentorCard({ mentor }: MentorCardProps) {
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
                    <img
                        src={mentor.avatar}
                        alt={mentor.name}
                        className="size-16 rounded-2xl object-cover"
                    />
                    <span
                        className={`absolute -right-1 -bottom-1 size-4 rounded-full border-2 border-white ${mentor.availability === 'Available' ? 'bg-scholarly-teal' : 'bg-scholarly-gold'}`}
                    />
                </div>
                <div className="min-w-0 flex-1">
                    <h2 className="text-base font-bold text-scholarly-navy">
                        {mentor.name}
                    </h2>
                    <p className="mt-1 text-xs leading-5 text-scholarly-slate">
                        {mentor.role}
                    </p>
                    <p className="text-xs text-scholarly-slate-light">
                        {mentor.organization}
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
                    className={`mt-2 text-xs font-bold ${mentor.availability === 'Available' ? 'text-scholarly-teal-dark' : 'text-scholarly-gold-dark'}`}
                >
                    {mentor.availability}
                </p>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2">
                <Link
                    href={`/coming-soon?feature=${encodeURIComponent(`${mentor.name} profile`)}`}
                    className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-scholarly-border px-3 text-xs font-bold text-scholarly-navy transition hover:border-scholarly-blue hover:text-scholarly-blue"
                >
                    View profile <ArrowUpRight className="size-3.5" />
                </Link>
                <Link
                    href={`/coming-soon?feature=${encodeURIComponent(`Chat with ${mentor.name}`)}`}
                    className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg bg-scholarly-blue px-3 text-xs font-bold text-white transition hover:bg-scholarly-blue-dark"
                >
                    Message <MessageCircle className="size-3.5" />
                </Link>
            </div>
        </article>
    );
}
