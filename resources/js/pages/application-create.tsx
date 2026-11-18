import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowRight,
    CalendarDays,
    CheckCircle2,
    GraduationCap,
    MapPin,
} from 'lucide-react';
import type { FormEvent } from 'react';
import { useState } from 'react';

import type { ApplicationCreateProps } from '@/types/domain';

type FormValues = {
    scholarship_id: string;
    deadline_at: string;
    create_default_tasks: boolean;
};

export default function ApplicationCreate({
    scholarships,
    selectedScholarshipId,
}: ApplicationCreateProps) {
    const initial =
        selectedScholarshipId === null
            ? null
            : (scholarships.find(
                  (scholarship) => scholarship.id === selectedScholarshipId,
              ) ?? null);

    const [selected, setSelected] = useState<number | null>(
        initial?.id ?? null,
    );

    const form = useForm<FormValues>({
        scholarship_id: initial === null ? '' : String(initial.id),
        deadline_at: '',
        create_default_tasks: true,
    });

    const choose = (id: number) => {
        setSelected(id);
        form.setData('scholarship_id', String(id));
    };

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        form.post('/applications');
    };

    const activeScholarship = scholarships.find(
        (scholarship) => scholarship.id === selected,
    );

    return (
        <>
            <Head title="Start an application" />
            <div className="min-h-screen bg-scholarly-blue-white p-4 text-scholarly-navy sm:p-6 lg:p-8">
                <div className="mx-auto max-w-5xl space-y-6">
                    <div>
                        <Link
                            href="/applications"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-scholarly-blue hover:text-scholarly-blue-dark"
                        >
                            <ArrowLeft className="size-4" /> Back to
                            applications
                        </Link>
                        <h1 className="mt-3 font-display text-4xl tracking-[-0.03em]">
                            Start an application
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-scholarly-slate">
                            Choose a live scholarship. We will create the
                            starter tasks for you from its required documents.
                        </p>
                    </div>

                    {scholarships.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-scholarly-border-strong bg-white p-10 text-center">
                            <p className="text-lg font-bold">
                                No scholarships available
                            </p>
                            <p className="mx-auto mt-2 max-w-md text-sm text-scholarly-slate">
                                You already have an application for every live
                                scholarship, or there are no open opportunities
                                right now.
                            </p>
                            <Link
                                href="/scholarships"
                                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-scholarly-blue px-4 py-2.5 text-sm font-bold text-white"
                            >
                                Browse scholarships{' '}
                                <ArrowRight className="size-4" />
                            </Link>
                        </div>
                    ) : (
                        <form
                            onSubmit={submit}
                            className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]"
                        >
                            <div className="space-y-3">
                                <h2 className="text-lg font-bold">
                                    Choose a scholarship
                                </h2>
                                {scholarships.map((scholarship) => {
                                    const isSelected =
                                        scholarship.id === selected;

                                    return (
                                        <button
                                            key={scholarship.id}
                                            type="button"
                                            onClick={() =>
                                                choose(scholarship.id)
                                            }
                                            className={`w-full rounded-2xl border p-5 text-left shadow-sm transition ${
                                                isSelected
                                                    ? 'border-scholarly-blue ring-4 ring-scholarly-blue-soft'
                                                    : 'border-scholarly-border bg-white hover:border-scholarly-blue'
                                            }`}
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <p className="text-xs font-semibold text-scholarly-blue">
                                                        {scholarship.provider}
                                                    </p>
                                                    <h3 className="mt-1 text-lg leading-6 font-bold">
                                                        {scholarship.title}
                                                    </h3>
                                                    {scholarship.summary && (
                                                        <p className="mt-2 line-clamp-2 text-sm text-scholarly-slate">
                                                            {
                                                                scholarship.summary
                                                            }
                                                        </p>
                                                    )}
                                                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-scholarly-slate">
                                                        <span className="inline-flex items-center gap-1.5">
                                                            <MapPin className="size-3.5" />
                                                            {
                                                                scholarship.country
                                                            }
                                                        </span>
                                                        <span className="inline-flex items-center gap-1.5">
                                                            <GraduationCap className="size-3.5" />
                                                            {scholarship.level}
                                                        </span>
                                                        <span className="inline-flex items-center gap-1.5">
                                                            <CalendarDays className="size-3.5" />
                                                            {scholarship.deadline ??
                                                                'Rolling'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <span
                                                    className={`flex size-6 shrink-0 items-center justify-center rounded-full border ${isSelected ? 'border-scholarly-blue bg-scholarly-blue text-white' : 'border-scholarly-border text-transparent'}`}
                                                >
                                                    <CheckCircle2 className="size-4" />
                                                </span>
                                            </div>
                                        </button>
                                    );
                                })}
                                {form.errors.scholarship_id && (
                                    <p className="text-xs text-scholarly-coral-dark">
                                        {form.errors.scholarship_id}
                                    </p>
                                )}
                            </div>

                            <aside className="space-y-4">
                                <section className="rounded-2xl border border-scholarly-border bg-white p-6 shadow-sm">
                                    <h2 className="text-lg font-bold">
                                        Application setup
                                    </h2>
                                    <label className="mt-4 block">
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
                                        <span className="mt-1 block text-xs text-scholarly-slate">
                                            Leave blank to use the scholarship
                                            deadline
                                            {activeScholarship?.deadline
                                                ? ` (${activeScholarship.deadline})`
                                                : ''}
                                            .
                                        </span>
                                    </label>

                                    <label className="mt-4 flex items-start gap-3 rounded-xl border border-scholarly-border bg-scholarly-blue-white p-3 text-sm">
                                        <input
                                            type="checkbox"
                                            checked={
                                                form.data.create_default_tasks
                                            }
                                            onChange={(event) =>
                                                form.setData(
                                                    'create_default_tasks',
                                                    event.target.checked,
                                                )
                                            }
                                            className="mt-0.5 size-4 accent-scholarly-blue"
                                        />
                                        <span>
                                            <span className="font-semibold">
                                                Create starter tasks
                                            </span>
                                            <span className="mt-1 block text-xs text-scholarly-slate">
                                                Tasks are generated from this
                                                scholarship&apos;s required
                                                documents.
                                            </span>
                                        </span>
                                    </label>

                                    <button
                                        type="submit"
                                        disabled={
                                            form.processing ||
                                            form.data.scholarship_id === ''
                                        }
                                        className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-scholarly-blue px-4 text-sm font-bold text-white transition hover:bg-scholarly-blue-dark disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        Start application{' '}
                                        <ArrowRight className="size-4" />
                                    </button>
                                </section>

                                {activeScholarship &&
                                    activeScholarship.requiredDocuments.length >
                                        0 && (
                                        <section className="rounded-2xl border border-scholarly-border bg-white p-6 shadow-sm">
                                            <h2 className="text-sm font-bold">
                                                Required documents
                                            </h2>
                                            <ul className="mt-3 space-y-2">
                                                {activeScholarship.requiredDocuments.map(
                                                    (document) => (
                                                        <li
                                                            key={document}
                                                            className="flex items-start gap-2 text-xs text-scholarly-slate"
                                                        >
                                                            <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-scholarly-teal" />
                                                            {document}
                                                        </li>
                                                    ),
                                                )}
                                            </ul>
                                        </section>
                                    )}
                            </aside>
                        </form>
                    )}
                </div>
            </div>
        </>
    );
}

ApplicationCreate.layout = () => ({
    breadcrumbs: [
        { title: 'My applications', href: '/applications' },
        { title: 'Start an application', href: '/applications/create' },
    ],
});
