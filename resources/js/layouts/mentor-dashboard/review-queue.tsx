import { Link } from '@inertiajs/react';
import { ArrowRight, Clock3, FileText } from 'lucide-react';

import type { ReviewItem } from './data';

type ReviewQueueProps = { items: ReviewItem[] };

const toneClasses = {
    blue: 'bg-scholarly-blue-soft text-scholarly-blue',
    coral: 'bg-scholarly-coral-soft text-scholarly-coral-dark',
    gold: 'bg-scholarly-gold-soft text-scholarly-gold-dark',
    teal: 'bg-scholarly-teal-soft text-scholarly-teal-dark',
};

export default function ReviewQueue({ items }: ReviewQueueProps) {
    return (
        <section className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-scholarly-navy">
                        Review queue
                    </h2>
                    <p className="mt-1 text-sm text-scholarly-slate">
                        Give learners clear, useful next steps.
                    </p>
                </div>
                <span className="rounded-full bg-scholarly-coral-soft px-3 py-1.5 text-xs font-bold text-scholarly-coral-dark">
                    {items.length} waiting
                </span>
            </div>
            <div className="mt-5 divide-y divide-scholarly-border-soft">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="flex flex-col gap-4 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center"
                    >
                        <div
                            className={`flex size-11 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${toneClasses[item.tone]}`}
                        >
                            {item.initials}
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <p className="font-bold text-scholarly-navy">
                                    {item.learner}
                                </p>
                                <span
                                    className={`rounded-full px-2 py-1 text-[10px] font-bold ${item.priority === 'Needs attention' ? 'bg-scholarly-coral-soft text-scholarly-coral-dark' : 'bg-scholarly-teal-soft text-scholarly-teal-dark'}`}
                                >
                                    {item.priority}
                                </span>
                            </div>
                            <p className="mt-1 flex items-center gap-1.5 text-sm text-scholarly-slate">
                                <FileText className="size-3.5 text-scholarly-blue" />
                                {item.document} · {item.scholarship}
                            </p>
                            <p className="mt-1 flex items-center gap-1.5 text-xs text-scholarly-slate-light">
                                <Clock3 className="size-3.5" />
                                {item.submitted} ·{' '}
                                <strong
                                    className={
                                        item.priority === 'Needs attention'
                                            ? 'text-scholarly-coral-dark'
                                            : 'text-scholarly-slate'
                                    }
                                >
                                    {item.due}
                                </strong>
                            </p>
                        </div>
                        <Link
                            href={`/mentor-coming-soon?feature=Review ${encodeURIComponent(item.learner)}`}
                            className="inline-flex items-center justify-center gap-1.5 self-start rounded-lg border border-scholarly-blue px-3 py-2 text-xs font-bold text-scholarly-blue transition hover:bg-scholarly-blue hover:text-white sm:self-auto"
                        >
                            Review <ArrowRight className="size-3.5" />
                        </Link>
                    </div>
                ))}
            </div>
            <Link
                href="/mentor-coming-soon?feature=Full%20review%20queue"
                className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-scholarly-blue"
            >
                View all reviews <ArrowRight className="size-4" />
            </Link>
        </section>
    );
}
