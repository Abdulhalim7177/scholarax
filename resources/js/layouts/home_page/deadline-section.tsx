import { Link } from '@inertiajs/react';
import { Bell, ChevronRight } from 'lucide-react';

import type { HomeDeadline } from '@/types/domain';
import SectionIntro from './section-intro';

type DeadlineSectionProps = {
    deadline: HomeDeadline | null;
};

const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * Build the calendar cells for the deadline month.
 */
function monthCells(deadline: HomeDeadline | null): Array<number | null> {
    if (deadline === null) {
        return [];
    }

    const date = new Date(deadline.date);
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstWeekday = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    return [
        ...Array.from({ length: firstWeekday }, () => null),
        ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
    ];
}

export default function DeadlineSection({ deadline }: DeadlineSectionProps) {
    const cells = monthCells(deadline);
    const daysLeftLabel =
        deadline === null
            ? null
            : deadline.daysLeft === 0
              ? 'Due today'
              : `${deadline.daysLeft} ${deadline.daysLeft === 1 ? 'day' : 'days'} left`;

    return (
        <section className="bg-scholarly-gold/20 py-20 sm:py-24">
            <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:px-10">
                <div className="flex justify-center">
                    <div className="w-full max-w-[330px] rounded-3xl bg-white p-5 shadow-xl">
                        <div className="flex items-center justify-between">
                            <ChevronRight className="size-4 rotate-180 text-scholarly-slate-light" />
                            <p className="text-sm font-bold text-scholarly-navy">
                                {deadline?.monthLabel ?? 'Upcoming deadlines'}
                            </p>
                            <ChevronRight className="size-4 text-scholarly-slate-light" />
                        </div>
                        {cells.length > 0 ? (
                            <div className="mt-5 grid grid-cols-7 gap-2 text-center text-[10px] font-semibold text-scholarly-slate-light">
                                {weekdayLabels.map((label) => (
                                    <span key={label}>{label}</span>
                                ))}
                                {cells.map((day, index) =>
                                    day === null ? (
                                        <span key={`blank-${index}`} />
                                    ) : (
                                        <span
                                            key={day}
                                            className={`flex size-7 items-center justify-center rounded-full ${day === deadline?.day ? 'bg-scholarly-blue font-bold text-white' : 'text-scholarly-slate'}`}
                                        >
                                            {day}
                                        </span>
                                    ),
                                )}
                            </div>
                        ) : (
                            <p className="mt-6 rounded-xl bg-scholarly-blue-white p-4 text-center text-xs text-scholarly-slate">
                                New scholarship deadlines appear here as they
                                are added.
                            </p>
                        )}
                    </div>
                </div>
                <div>
                    <SectionIntro
                        eyebrow="Stay on track"
                        title="Never miss a deadline."
                        body="Get personalized reminders for application deadlines, interviews, and important updates."
                    />
                    {deadline !== null && (
                        <div className="mt-8 rounded-2xl border border-scholarly-border bg-white p-5">
                            <p className="text-[11px] font-bold tracking-[0.14em] text-scholarly-blue uppercase">
                                Next deadline
                            </p>
                            <p className="mt-2 text-sm font-bold text-scholarly-navy">
                                {deadline.title}
                            </p>
                            <p className="mt-1 text-xs text-scholarly-slate">
                                {deadline.monthLabel} · {daysLeftLabel}
                            </p>
                        </div>
                    )}
                    <Link
                        href={deadline?.url ?? '/scholarships'}
                        className="mt-8 inline-flex items-center gap-2 rounded-full bg-scholarly-blue px-6 py-3.5 text-sm font-bold text-white transition hover:bg-scholarly-blue-dark"
                    >
                        <Bell className="size-4" />
                        {deadline !== null
                            ? 'View this scholarship'
                            : 'Browse scholarships'}
                    </Link>
                </div>
            </div>
        </section>
    );
}
