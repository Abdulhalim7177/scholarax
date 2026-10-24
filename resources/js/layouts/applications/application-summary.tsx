import { Link } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';
import {
    ArrowRight,
    CheckCircle2,
    Clock3,
    FileCheck2,
    ListChecks,
} from 'lucide-react';

export default function ApplicationSummary() {
    const checklist: Array<[string, boolean, LucideIcon]> = [
        ['Complete your profile', true, CheckCircle2],
        ['Upload your CV', true, FileCheck2],
        ['Draft your SOP', false, Clock3],
        ['Request recommendation', false, Clock3],
    ];

    return (
        <aside className="space-y-5">
            <section className="rounded-2xl border border-scholarly-border bg-scholarly-navy p-6 text-white shadow-sm">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-xs font-bold tracking-[0.15em] text-scholarly-sky uppercase">
                            Your momentum
                        </p>
                        <h2 className="mt-3 font-display text-3xl leading-tight">
                            You’re making progress.
                        </h2>
                    </div>
                    <div className="flex size-11 items-center justify-center rounded-xl bg-white/10 text-scholarly-gold">
                        <ListChecks className="size-5" />
                    </div>
                </div>
                <div className="mt-7 flex items-end justify-between">
                    <span className="text-5xl font-bold tracking-[-0.06em]">
                        68%
                    </span>
                    <span className="pb-1 text-xs text-white/60">
                        overall completion
                    </span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/15">
                    <div className="h-full w-[68%] rounded-full bg-scholarly-blue" />
                </div>
                <p className="mt-4 text-sm leading-6 text-white/65">
                    Keep your personal statement moving and you’ll be ready to
                    submit your first application soon.
                </p>
            </section>
            <section className="rounded-2xl border border-scholarly-border bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <h2 className="text-base font-bold text-scholarly-navy">
                        Application checklist
                    </h2>
                    <span className="text-xs font-bold text-scholarly-blue">
                        2 of 5 done
                    </span>
                </div>
                <div className="mt-5 space-y-4">
                    {checklist.map(([label, complete, Icon]) => (
                        <div
                            key={label}
                            className="flex items-center gap-3 text-sm"
                        >
                            <Icon
                                className={`size-4 ${complete ? 'text-scholarly-teal' : 'text-scholarly-slate-light'}`}
                            />
                            <span
                                className={
                                    complete
                                        ? 'text-scholarly-slate line-through'
                                        : 'font-semibold text-scholarly-navy'
                                }
                            >
                                {label}
                            </span>
                        </div>
                    ))}
                </div>
                <Link
                    href="/coming-soon?feature=Application checklist"
                    className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-scholarly-blue hover:text-scholarly-blue-dark"
                >
                    View checklist <ArrowRight className="size-4" />
                </Link>
            </section>
        </aside>
    );
}
