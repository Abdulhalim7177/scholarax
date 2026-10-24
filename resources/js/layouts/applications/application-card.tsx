import { Link } from '@inertiajs/react';
import { ArrowRight, CalendarDays, MapPin } from 'lucide-react';

import type { Application } from './data';

type ApplicationCardProps = {
    application: Application;
};

const flagFor = (code: string) => {
    const flags: Record<string, string> = {
        GB: '🇬🇧',
        DE: '🇩🇪',
        US: '🇺🇸',
        EU: '🇪🇺',
    };
    return flags[code] ?? '🌍';
};

const colorClasses = {
    blue: {
        icon: 'bg-scholarly-blue-soft text-scholarly-blue',
        progress: 'bg-scholarly-blue',
        badge: 'bg-scholarly-blue-soft text-scholarly-blue',
    },
    teal: {
        icon: 'bg-scholarly-teal-soft text-scholarly-teal-dark',
        progress: 'bg-scholarly-teal',
        badge: 'bg-scholarly-teal-soft text-scholarly-teal-dark',
    },
    gold: {
        icon: 'bg-scholarly-gold-soft text-scholarly-gold-dark',
        progress: 'bg-scholarly-gold',
        badge: 'bg-scholarly-gold-soft text-scholarly-gold-dark',
    },
    coral: {
        icon: 'bg-scholarly-coral-soft text-scholarly-coral-dark',
        progress: 'bg-scholarly-coral',
        badge: 'bg-scholarly-coral-soft text-scholarly-coral-dark',
    },
};

export default function ApplicationCard({ application }: ApplicationCardProps) {
    const colors = colorClasses[application.color];

    return (
        <article className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-[0_14px_35px_rgba(16,42,67,0.08)] sm:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                <div
                    className={`flex size-14 shrink-0 items-center justify-center rounded-2xl text-2xl ${colors.icon}`}
                    aria-hidden="true"
                >
                    {flagFor(application.countryCode)}
                </div>
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <p className="text-xs font-semibold text-scholarly-blue">
                                {application.provider}
                            </p>
                            <h2 className="mt-1 text-lg leading-7 font-bold tracking-[-0.02em] text-scholarly-navy">
                                {application.title}
                            </h2>
                        </div>
                        <span
                            className={`rounded-full px-3 py-1.5 text-xs font-bold ${colors.badge}`}
                        >
                            {application.status}
                        </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-scholarly-slate">
                        <span className="inline-flex items-center gap-1.5">
                            <MapPin className="size-3.5" />
                            {application.country}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <CalendarDays className="size-3.5" />
                            Deadline {application.deadline}
                        </span>
                    </div>
                </div>
            </div>
            <div className="mt-6 rounded-xl bg-scholarly-blue-white p-4">
                <div className="flex items-center justify-between gap-4 text-xs">
                    <span className="font-bold text-scholarly-navy">
                        Application progress
                    </span>
                    <span className="font-bold text-scholarly-blue">
                        {application.progress}% complete
                    </span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
                    <div
                        className={`h-full rounded-full transition-all ${colors.progress}`}
                        style={{ width: `${application.progress}%` }}
                    />
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <span className="text-scholarly-slate">
                        Next:{' '}
                        <strong className="text-scholarly-navy">
                            {application.nextStep}
                        </strong>
                    </span>
                    <span
                        className={`font-bold ${application.deadlineLabel === '14 days left' ? 'text-scholarly-coral-dark' : 'text-scholarly-slate'}`}
                    >
                        {application.deadlineLabel}
                    </span>
                </div>
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-scholarly-slate">
                    {application.updated}
                </span>
                <Link
                    href={`/coming-soon?feature=${encodeURIComponent(`Continue ${application.title}`)}`}
                    className="hover:bg-scholarly-blue-dark inline-flex items-center gap-2 rounded-lg bg-scholarly-blue px-4 py-2.5 text-xs font-bold text-white transition"
                >
                    {application.status === 'Offer received'
                        ? 'View offer'
                        : application.status === 'Submitted'
                          ? 'Track application'
                          : 'Continue application'}
                    <ArrowRight className="size-3.5" />
                </Link>
            </div>
        </article>
    );
}
