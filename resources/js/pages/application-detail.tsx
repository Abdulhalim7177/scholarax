import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowUpRight,
    CalendarDays,
    CheckCircle2,
    GraduationCap,
    MapPin,
    Sparkles,
} from 'lucide-react';
import type { FormEvent } from 'react';

import ApplicationDocuments from '@/layouts/applications/application-documents';
import ApplicationTasks from '@/layouts/applications/application-tasks';
import ApplicationTimeline from '@/layouts/applications/application-timeline';
import type { ApplicationShowProps } from '@/types/domain';

export default function ApplicationDetail({
    application,
    statuses,
    documentTypes,
    documentStatuses,
}: ApplicationShowProps) {
    const scholarship = application.scholarship;

    const form = useForm({
        status: application.status,
        next_step: application.nextStep,
        deadline_at: application.deadlineAt
            ? application.deadlineAt.slice(0, 10)
            : '',
        note: '',
    });

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        form.patch(`/applications/${application.id}`, {
            preserveScroll: true,
            onSuccess: () => form.reset('note'),
        });
    };

    return (
        <>
            <Head title={scholarship?.title ?? 'Application'} />
            <div className="min-h-screen bg-scholarly-blue-white p-4 text-scholarly-navy sm:p-6 lg:p-8">
                <div className="mx-auto max-w-6xl space-y-6">
                    <div>
                        <Link
                            href="/applications"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-scholarly-blue hover:text-scholarly-blue-dark"
                        >
                            <ArrowLeft className="size-4" /> Back to
                            applications
                        </Link>
                    </div>

                    <header className="rounded-2xl border border-scholarly-border bg-white p-6 shadow-sm sm:p-8">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-scholarly-blue">
                                    {scholarship?.provider ?? 'Scholarship'}
                                </p>
                                <h1 className="mt-2 font-display text-3xl tracking-[-0.03em] sm:text-4xl">
                                    {scholarship?.title ??
                                        'Untitled application'}
                                </h1>
                                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-scholarly-slate">
                                    <span className="inline-flex items-center gap-1.5">
                                        <MapPin className="size-4" />
                                        {scholarship?.country ??
                                            'Multiple countries'}
                                    </span>
                                    <span className="inline-flex items-center gap-1.5">
                                        <GraduationCap className="size-4" />
                                        {scholarship?.level ??
                                            'Study level pending'}
                                    </span>
                                    <span className="inline-flex items-center gap-1.5">
                                        <CalendarDays className="size-4" />
                                        {application.deadline ?? 'Rolling'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
                                <span className="rounded-full bg-scholarly-blue-soft px-3 py-1.5 text-xs font-bold text-scholarly-blue">
                                    {application.statusLabel}
                                </span>
                                <span className="text-xs text-scholarly-slate">
                                    {application.deadlineLabel}
                                </span>
                                {scholarship?.applicationUrl && (
                                    <a
                                        href={scholarship.applicationUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1 text-xs font-bold text-scholarly-blue hover:text-scholarly-blue-dark"
                                    >
                                        Provider website{' '}
                                        <ArrowUpRight className="size-3.5" />
                                    </a>
                                )}
                            </div>
                        </div>

                        <div className="mt-6 rounded-xl bg-scholarly-blue-white p-4">
                            <div className="flex items-center justify-between text-xs">
                                <span className="font-bold">
                                    Application progress
                                </span>
                                <span className="font-bold text-scholarly-blue">
                                    {application.progress}% complete
                                </span>
                            </div>
                            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
                                <div
                                    className="h-full rounded-full bg-scholarly-blue"
                                    style={{
                                        width: `${application.progress}%`,
                                    }}
                                />
                            </div>
                            <p className="mt-3 text-xs text-scholarly-slate">
                                <strong className="text-scholarly-navy">
                                    Next:
                                </strong>{' '}
                                {application.nextStep}
                            </p>
                        </div>
                    </header>

                    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
                        <div className="space-y-6">
                            <ApplicationTasks
                                applicationId={application.id}
                                tasks={application.tasks}
                                summary={application.taskSummary}
                            />
                            <ApplicationDocuments
                                applicationId={application.id}
                                documents={application.documents}
                                summary={application.documentSummary}
                                documentTypes={documentTypes}
                                documentStatuses={documentStatuses}
                            />

                            {scholarship && (
                                <section className="rounded-2xl border border-scholarly-border bg-white p-6 shadow-sm">
                                    <h2 className="text-xl font-bold">
                                        About this scholarship
                                    </h2>
                                    <p className="mt-3 text-sm leading-7 whitespace-pre-line text-scholarly-slate">
                                        {scholarship.description}
                                    </p>
                                    {scholarship.eligibility && (
                                        <>
                                            <h3 className="mt-5 text-sm font-bold">
                                                Eligibility
                                            </h3>
                                            <p className="mt-2 text-sm leading-7 text-scholarly-slate">
                                                {scholarship.eligibility}
                                            </p>
                                        </>
                                    )}
                                    {scholarship.requiredDocuments.length >
                                        0 && (
                                        <>
                                            <h3 className="mt-5 text-sm font-bold">
                                                Required documents
                                            </h3>
                                            <ul className="mt-2 space-y-2">
                                                {scholarship.requiredDocuments.map(
                                                    (document) => (
                                                        <li
                                                            key={document}
                                                            className="flex items-start gap-2 text-sm text-scholarly-slate"
                                                        >
                                                            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-scholarly-teal" />
                                                            {document}
                                                        </li>
                                                    ),
                                                )}
                                            </ul>
                                        </>
                                    )}
                                </section>
                            )}
                        </div>

                        <aside className="space-y-6">
                            <section className="rounded-2xl border border-scholarly-border bg-white p-6 shadow-sm">
                                <h2 className="flex items-center gap-2 text-xl font-bold">
                                    <Sparkles className="size-5 text-scholarly-blue" />
                                    Update status
                                </h2>
                                <form
                                    onSubmit={submit}
                                    className="mt-4 space-y-4"
                                >
                                    <label className="block">
                                        <span className="text-xs font-bold tracking-[0.12em] text-scholarly-slate uppercase">
                                            Status
                                        </span>
                                        <select
                                            value={form.data.status}
                                            onChange={(event) =>
                                                form.setData(
                                                    'status',
                                                    event.target
                                                        .value as typeof form.data.status,
                                                )
                                            }
                                            className="mt-1.5 h-11 w-full rounded-lg border border-scholarly-border bg-scholarly-blue-white px-3 text-sm outline-none focus:border-scholarly-blue focus:ring-4 focus:ring-scholarly-blue-soft"
                                        >
                                            {statuses.map((option) => (
                                                <option
                                                    key={option.value}
                                                    value={option.value}
                                                >
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </label>

                                    <label className="block">
                                        <span className="text-xs font-bold tracking-[0.12em] text-scholarly-slate uppercase">
                                            Next step
                                        </span>
                                        <input
                                            value={form.data.next_step}
                                            onChange={(event) =>
                                                form.setData(
                                                    'next_step',
                                                    event.target.value,
                                                )
                                            }
                                            placeholder="What comes next?"
                                            className="mt-1.5 h-11 w-full rounded-lg border border-scholarly-border bg-scholarly-blue-white px-3 text-sm outline-none focus:border-scholarly-blue focus:ring-4 focus:ring-scholarly-blue-soft"
                                        />
                                    </label>

                                    <label className="block">
                                        <span className="text-xs font-bold tracking-[0.12em] text-scholarly-slate uppercase">
                                            Deadline
                                        </span>
                                        <input
                                            type="date"
                                            value={form.data.deadline_at}
                                            onChange={(event) =>
                                                form.setData(
                                                    'deadline_at',
                                                    event.target.value,
                                                )
                                            }
                                            className="mt-1.5 h-11 w-full rounded-lg border border-scholarly-border bg-scholarly-blue-white px-3 text-sm outline-none focus:border-scholarly-blue focus:ring-4 focus:ring-scholarly-blue-soft"
                                        />
                                    </label>

                                    <label className="block">
                                        <span className="text-xs font-bold tracking-[0.12em] text-scholarly-slate uppercase">
                                            Status note
                                        </span>
                                        <input
                                            value={form.data.note}
                                            onChange={(event) =>
                                                form.setData(
                                                    'note',
                                                    event.target.value,
                                                )
                                            }
                                            placeholder="Optional note for the timeline"
                                            className="mt-1.5 h-11 w-full rounded-lg border border-scholarly-border bg-scholarly-blue-white px-3 text-sm outline-none focus:border-scholarly-blue focus:ring-4 focus:ring-scholarly-blue-soft"
                                        />
                                    </label>

                                    <button
                                        type="submit"
                                        disabled={form.processing}
                                        className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-scholarly-blue px-4 text-sm font-bold text-white transition hover:bg-scholarly-blue-dark disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        Save changes
                                    </button>
                                </form>
                            </section>

                            <ApplicationTimeline
                                history={application.history}
                            />
                        </aside>
                    </div>
                </div>
            </div>
        </>
    );
}

ApplicationDetail.layout = () => ({
    breadcrumbs: [{ title: 'My applications', href: '/applications' }],
});
