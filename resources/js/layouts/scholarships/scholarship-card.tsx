import { ArrowUpRight, Bookmark, CalendarDays, MapPin } from 'lucide-react';
import { Link } from '@inertiajs/react';

import type { Scholarship } from './data';

type ScholarshipCardProps = {
    scholarship: Scholarship;
    saved: boolean;
    onToggleSaved: (id: string) => void;
};

const flagFor = (code: string) => {
    const flags: Record<string, string> = {
        GB: '🇬🇧',
        DE: '🇩🇪',
        US: '🇺🇸',
        AU: '🇦🇺',
        EU: '🇪🇺',
    };
    return flags[code] ?? '🌍';
};

export default function ScholarshipCard({
    scholarship,
    saved,
    onToggleSaved,
}: ScholarshipCardProps) {
    return (
        <article
            className={`relative flex h-full flex-col rounded-2xl border bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-[0_14px_35px_rgba(16,42,67,0.08)] ${scholarship.featured ? 'border-scholarly-blue shadow-[0_8px_25px_rgba(21,94,239,0.1)]' : 'border-scholarly-border'}`}
        >
            {scholarship.featured && (
                <span className="absolute -top-3 left-5 rounded-full bg-scholarly-blue px-3 py-1 text-[10px] font-bold tracking-[0.12em] text-white uppercase">
                    Recommended for you
                </span>
            )}
            <div className="flex items-start justify-between gap-4">
                <div
                    className="flex size-12 items-center justify-center rounded-xl bg-scholarly-blue-soft text-2xl"
                    aria-hidden="true"
                >
                    {flagFor(scholarship.countryCode)}
                </div>
                <button
                    type="button"
                    onClick={() => onToggleSaved(scholarship.id)}
                    aria-label={
                        saved
                            ? `Remove ${scholarship.title} from saved scholarships`
                            : `Save ${scholarship.title}`
                    }
                    className={`rounded-lg p-2 transition ${saved ? 'bg-scholarly-gold-soft text-scholarly-gold-dark' : 'text-scholarly-slate-light hover:bg-scholarly-blue-soft hover:text-scholarly-blue'}`}
                >
                    <Bookmark
                        className={`size-5 ${saved ? 'fill-current' : ''}`}
                    />
                </button>
            </div>
            <div className="mt-5">
                <p className="text-xs font-semibold text-scholarly-blue">
                    {scholarship.provider}
                </p>
                <h2 className="mt-1 text-lg leading-7 font-bold tracking-[-0.02em] text-scholarly-navy">
                    {scholarship.title}
                </h2>
                <p className="mt-2 line-clamp-2 text-sm leading-5 text-scholarly-slate">
                    {scholarship.description}
                </p>
            </div>
            <div className="mt-5 space-y-2 border-t border-scholarly-border-soft pt-4 text-xs text-scholarly-slate">
                <span className="flex items-center gap-2">
                    <MapPin className="size-3.5 text-scholarly-blue" />
                    {scholarship.country}
                </span>
                <span className="flex items-center gap-2">
                    <CalendarDays className="size-3.5 text-scholarly-blue" />
                    {scholarship.level} · {scholarship.field}
                </span>
            </div>
            <div className="mt-4 flex items-center justify-between gap-3">
                <span className="rounded-full bg-scholarly-teal-soft px-2.5 py-1 text-[11px] font-bold text-scholarly-teal-dark">
                    {scholarship.funding}
                </span>
                <span
                    className={`text-xs font-semibold ${scholarship.daysLeft <= 14 ? 'text-scholarly-coral-dark' : 'text-scholarly-slate'}`}
                >
                    {scholarship.deadlineLabel}
                </span>
            </div>
            <Link
                href={`/coming-soon?feature=${encodeURIComponent(scholarship.title)}`}
                className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-scholarly-blue px-4 text-sm font-bold text-scholarly-blue transition hover:bg-scholarly-blue hover:text-white"
            >
                View scholarship <ArrowUpRight className="size-4" />
            </Link>
        </article>
    );
}
