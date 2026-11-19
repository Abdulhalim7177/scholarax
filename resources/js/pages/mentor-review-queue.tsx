import { Head, router, useForm } from '@inertiajs/react';
import { CheckCircle2, Clock3, FileText, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import InputError from '@/components/input-error';
import type { MentorReviewItem, MentorReviewQueueProps } from '@/types/domain';

const filters = ['All reviews', 'Needs attention', 'On track'];

function ReviewRow({ item }: { item: MentorReviewItem }) {
    const [open, setOpen] = useState(false);
    const form = useForm({
        action: 'complete',
        feedback: item.feedback ?? '',
        decision: 'approve',
    });

    const startReview = () => {
        router.patch(
            `/mentor-review-queue/${item.id}`,
            { action: 'start', feedback: null, decision: null },
            { preserveScroll: true },
        );
    };

    const submit = (decision: 'approve' | 'request_changes') => {
        form.transform((data) => ({ ...data, decision }));
        form.patch(`/mentor-review-queue/${item.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setOpen(false);
                form.reset();
            },
        });
    };

    return (
        <div className="py-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-scholarly-blue-soft text-xs font-bold text-scholarly-blue">
                    {item.initials}
                </div>
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-bold">{item.learner}</h2>
                        <span
                            className={`rounded-full px-2 py-1 text-[10px] font-bold ${item.priority === 'Needs attention' ? 'bg-scholarly-coral-soft text-scholarly-coral-dark' : 'bg-scholarly-teal-soft text-scholarly-teal-dark'}`}
                        >
                            {item.priority}
                        </span>
                        <span className="rounded-full bg-scholarly-blue-white px-2 py-1 text-[10px] font-bold text-scholarly-slate">
                            {item.statusLabel}
                        </span>
                    </div>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-scholarly-slate">
                        <FileText className="size-3.5" />
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
                <div className="flex flex-wrap gap-2">
                    {item.status !== 'in_review' && (
                        <button
                            type="button"
                            onClick={startReview}
                            className="inline-flex items-center justify-center rounded-lg border border-scholarly-border px-4 py-2.5 text-xs font-bold text-scholarly-navy hover:border-scholarly-blue hover:text-scholarly-blue"
                        >
                            Start review
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={() => setOpen((value) => !value)}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-scholarly-blue px-4 py-2.5 text-xs font-bold text-white hover:bg-scholarly-blue-dark"
                    >
                        {open ? 'Close review' : 'Open review'}
                    </button>
                </div>
            </div>

            {open && (
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        submit('approve');
                    }}
                    className="mt-4 rounded-xl border border-scholarly-border bg-scholarly-blue-white p-4"
                >
                    <label
                        htmlFor={`feedback-${item.id}`}
                        className="text-xs font-bold text-scholarly-navy"
                    >
                        Feedback for {item.learner}
                    </label>
                    <textarea
                        id={`feedback-${item.id}`}
                        value={form.data.feedback}
                        onChange={(event) =>
                            form.setData('feedback', event.target.value)
                        }
                        rows={4}
                        placeholder="Share one honest observation and one practical next step."
                        className="mt-2 w-full rounded-lg border border-scholarly-border bg-white p-3 text-sm outline-none focus:border-scholarly-blue"
                    />
                    <InputError
                        message={form.errors.feedback}
                        className="mt-1"
                    />
                    <div className="mt-3 flex flex-wrap gap-2">
                        <button
                            type="submit"
                            disabled={form.processing}
                            className="inline-flex items-center justify-center rounded-lg bg-scholarly-teal px-4 py-2.5 text-xs font-bold text-white hover:bg-scholarly-teal-dark disabled:opacity-60"
                        >
                            Approve document
                        </button>
                        <button
                            type="button"
                            disabled={form.processing}
                            onClick={() => submit('request_changes')}
                            className="inline-flex items-center justify-center rounded-lg border border-scholarly-coral px-4 py-2.5 text-xs font-bold text-scholarly-coral-dark hover:bg-scholarly-coral-soft disabled:opacity-60"
                        >
                            Request changes
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

export default function MentorReviewQueue({
    stats,
    items,
}: MentorReviewQueueProps) {
    const [filter, setFilter] = useState(filters[0]);
    const [query, setQuery] = useState('');
    const visibleItems = useMemo(
        () =>
            items.filter((item) => {
                const matchesFilter =
                    filter === 'All reviews' || item.priority === filter;
                const matchesQuery =
                    !query ||
                    `${item.learner} ${item.document} ${item.scholarship}`
                        .toLowerCase()
                        .includes(query.toLowerCase());
                return matchesFilter && matchesQuery;
            }),
        [filter, items, query],
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
                                {stats.waiting}
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
                                {stats.dueToday}
                            </p>
                            <p className="mt-1 text-sm font-semibold">
                                Due today
                            </p>
                            <p className="mt-1 text-xs text-scholarly-slate">
                                Documents that need a look today
                            </p>
                        </div>
                        <div className="rounded-2xl border border-scholarly-border bg-scholarly-navy p-5 text-white shadow-sm">
                            <p className="text-3xl font-bold">
                                {stats.helpfulness}%
                            </p>
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
                                <ReviewRow key={item.id} item={item} />
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
