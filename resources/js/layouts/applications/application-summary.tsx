import { Link } from '@inertiajs/react';
import {
    ArrowRight,
    CheckCircle2,
    Clock3,
    FileCheck2,
    ListChecks,
    UserRound,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import type { ApplicationChecklistItem } from '@/types/domain';

type Props = {
    summary: {
        overallProgress: number;
        checklist: ApplicationChecklistItem[];
        completedChecks: number;
        totalChecks: number;
    };
};

const iconFor = (key: string): LucideIcon => {
    switch (key) {
        case 'profile':
            return UserRound;
        case 'cv':
            return FileCheck2;
        default:
            return Clock3;
    }
};

export default function ApplicationSummary({ summary }: Props) {
    const momentum =
        summary.overallProgress >= 80
            ? 'You’re almost submission ready.'
            : summary.overallProgress >= 40
              ? 'You’re making real progress.'
              : 'Your applications are just getting started.';

    return (
        <aside className="space-y-5">
            <section className="rounded-2xl border border-scholarly-border bg-scholarly-navy p-6 text-white shadow-sm">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-xs font-bold tracking-[0.15em] text-scholarly-sky uppercase">
                            Your momentum
                        </p>
                        <h2 className="mt-3 font-display text-3xl leading-tight">
                            {momentum}
                        </h2>
                    </div>
                    <div className="flex size-11 items-center justify-center rounded-xl bg-white/10 text-scholarly-gold">
                        <ListChecks className="size-5" />
                    </div>
                </div>
                <div className="mt-7 flex items-end justify-between">
                    <span className="text-5xl font-bold tracking-[-0.06em]">
                        {summary.overallProgress}%
                    </span>
                    <span className="pb-1 text-xs text-white/60">
                        average completion
                    </span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/15">
                    <div
                        className="h-full rounded-full bg-scholarly-blue"
                        style={{ width: `${summary.overallProgress}%` }}
                    />
                </div>
                <p className="mt-4 text-sm leading-6 text-white/65">
                    Complete the checklist items below to keep every application
                    moving toward submission.
                </p>
            </section>

            <section className="rounded-2xl border border-scholarly-border bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <h2 className="text-base font-bold text-scholarly-navy">
                        Application checklist
                    </h2>
                    <span className="text-xs font-bold text-scholarly-blue">
                        {summary.completedChecks} of {summary.totalChecks} done
                    </span>
                </div>
                <div className="mt-5 space-y-4">
                    {summary.checklist.map((item) => {
                        const Icon = item.complete
                            ? CheckCircle2
                            : iconFor(item.key);

                        return (
                            <div
                                key={item.key}
                                className="flex items-center gap-3 text-sm"
                            >
                                <Icon
                                    className={`size-4 ${item.complete ? 'text-scholarly-teal' : 'text-scholarly-slate-light'}`}
                                />
                                <span
                                    className={
                                        item.complete
                                            ? 'text-scholarly-slate line-through'
                                            : 'font-semibold text-scholarly-navy'
                                    }
                                >
                                    {item.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
                <Link
                    href="/profile"
                    className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-scholarly-blue hover:text-scholarly-blue-dark"
                >
                    Complete your profile <ArrowRight className="size-4" />
                </Link>
            </section>
        </aside>
    );
}
