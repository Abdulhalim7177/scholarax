import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    CheckCircle2,
    Clock3,
    FileText,
    Search,
} from 'lucide-react';
import { useMemo, useState } from 'react';

import { reviewQueue } from '@/layouts/mentor-dashboard/data';

const filters = ['All reviews', 'Needs attention', 'On track'];

export default function MentorReviewQueue() {
    const [filter, setFilter] = useState(filters[0]);
    const [query, setQuery] = useState('');
    const visibleItems = useMemo(
        () =>
            reviewQueue.filter((item) => {
                const matchesFilter =
                    filter === 'All reviews' || item.priority === filter;
                const matchesQuery =
                    !query ||
                    `${item.learner} ${item.document} ${item.scholarship}`
                        .toLowerCase()
                        .includes(query.toLowerCase());
                return matchesFilter && matchesQuery;
            }),
        [filter, query],
    );

    return (
        <>
            <Head title="Review queue" />
            <div className="min-h-screen bg-scholarly-blue-white p-4 text-scholarly-navy sm:p-6 lg:p-8">
                <div className="mx-auto max-w-6xl space-y-7">
                    <header>
                        <p className="text-sm font-semibold text-scholarly-blue">
                            Mentor workspace
                        </p>
                        <h1 className="mt-2 font-display text-4xl tracking-[-0.03em] sm:text-5xl">
                            Review queue
                        </h1>
                        <p className="mt-3 max-w-2xl text-sm leading-6 text-scholarly-slate">
                            Give each learner feedback they can act on. Your
                            thoughtful review is the next step in their journey.
                        </p>
                    </header>
                    <section className="grid gap-4 sm:grid-cols-3">
                        <div className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm">
                            <p className="text-3xl font-bold">
                                {reviewQueue.length}
                            </p>
                            <p className="mt-1 text-sm font-semibold">
                                Waiting for review
                            </p>
                            <p className="mt-1 text-xs text-scholarly-slate">
                                Across your active learners
                            </p>
                        </div>
                        <div className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm">
                            <p className="text-3xl font-bold text-scholarly-coral-dark">
                                1
                            </p>
                            <p className="mt-1 text-sm font-semibold">
                                Due today
                            </p>
                            <p className="mt-1 text-xs text-scholarly-slate">
                                Amina’s SOP needs attention
                            </p>
                        </div>
                        <div className="rounded-2xl border border-scholarly-border bg-scholarly-navy p-5 text-white shadow-sm">
                            <p className="text-3xl font-bold">92%</p>
                            <p className="mt-1 text-sm font-semibold">
                                Feedback helpfulness
                            </p>
                            <p className="mt-1 text-xs text-white/60">
                                Based on learner responses
                            </p>
                        </div>
                    </section>
                    <section className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm sm:p-6">
                        <div className="flex flex-col gap-4 border-b border-scholarly-border pb-5 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex gap-1 overflow-x-auto rounded-xl bg-scholarly-blue-white p-1">
                                {filters.map((item) => (
                                    <button
                                        key={item}
                                        type="button"
                                        onClick={() => setFilter(item)}
                                        className={`rounded-lg px-3 py-2 text-xs font-bold whitespace-nowrap ${filter === item ? 'bg-scholarly-blue text-white' : 'text-scholarly-slate hover:text-scholarly-navy'}`}
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                            <label className="relative block lg:w-72">
                                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-scholarly-slate-light" />
                                <input
                                    value={query}
                                    onChange={(event) =>
                                        setQuery(event.target.value)
                                    }
                                    placeholder="Search learners or documents"
                                    className="h-10 w-full rounded-lg border border-scholarly-border bg-scholarly-blue-white pr-3 pl-9 text-xs outline-none focus:border-scholarly-blue"
                                />
                            </label>
                        </div>
                        <div className="divide-y divide-scholarly-border-soft">
                            {visibleItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex flex-col gap-4 py-5 first:pb-5 sm:flex-row sm:items-center"
                                >
                                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-scholarly-blue-soft text-xs font-bold text-scholarly-blue">
                                        {item.initials}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h2 className="font-bold">
                                                {item.learner}
                                            </h2>
                                            <span
                                                className={`rounded-full px-2 py-1 text-[10px] font-bold ${item.priority === 'Needs attention' ? 'bg-scholarly-coral-soft text-scholarly-coral-dark' : 'bg-scholarly-teal-soft text-scholarly-teal-dark'}`}
                                            >
                                                {item.priority}
                                            </span>
                                        </div>
                                        <p className="mt-1 flex items-center gap-1.5 text-sm text-scholarly-slate">
                                            <FileText className="size-3.5" />
                                            {item.document} · {item.scholarship}
                                        </p>
                                        <p className="mt-1 flex items-center gap-1.5 text-xs text-scholarly-slate-light">
                                            <Clock3 className="size-3.5" />
                                            {item.submitted} · {item.due}
                                        </p>
                                    </div>
                                    <Link
                                        href={`/mentor-coming-soon?feature=Review ${encodeURIComponent(item.learner)}`}
                                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-scholarly-blue px-4 py-2.5 text-xs font-bold text-white hover:bg-scholarly-blue-dark"
                                    >
                                        Open review{' '}
                                        <ArrowRight className="size-3.5" />
                                    </Link>
                                </div>
                            ))}
                            {visibleItems.length === 0 && (
                                <div className="py-14 text-center">
                                    <CheckCircle2 className="mx-auto size-8 text-scholarly-teal" />
                                    <p className="mt-3 font-display text-2xl">
                                        Nothing here right now.
                                    </p>
                                    <p className="mt-2 text-sm text-scholarly-slate">
                                        Try another filter or search term.
                                    </p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}

MentorReviewQueue.layout = () => ({
    breadcrumbs: [{ title: 'Review queue', href: '/mentor-review-queue' }],
});
