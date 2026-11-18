import { useForm } from '@inertiajs/react';
import { CheckCircle2, Circle, Pencil, Plus, Trash2 } from 'lucide-react';
import type { FormEvent } from 'react';
import { useState } from 'react';

import type { EducationRecord } from '@/types/domain';

type SectionProps = {
    educations: EducationRecord[];
};

const inputClass =
    'mt-1.5 h-11 w-full rounded-lg border border-scholarly-border bg-scholarly-blue-white px-3 text-sm text-scholarly-navy outline-none focus:border-scholarly-blue focus:ring-4 focus:ring-scholarly-blue-soft';
const labelClass =
    'text-xs font-bold tracking-[0.12em] text-scholarly-slate uppercase';

const emptyEducation = {
    institution: '',
    degree: '',
    field: '',
    started_at: '',
    ended_at: '',
    grade: '',
    is_current: false,
};

function EducationRow({ education }: { education: EducationRecord }) {
    const [editing, setEditing] = useState(false);
    const form = useForm({
        institution: education.institution,
        degree: education.degree,
        field: education.field,
        started_at: education.started_at,
        ended_at: education.ended_at,
        grade: education.grade,
        is_current: education.is_current,
    });

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        form.patch(`/profile/educations/${education.id}`, {
            preserveScroll: true,
            onSuccess: () => setEditing(false),
        });
    };

    const remove = () => {
        if (
            !window.confirm(
                `Remove ${education.degree} at ${education.institution}?`,
            )
        ) {
            return;
        }

        form.delete(`/profile/educations/${education.id}`, {
            preserveScroll: true,
        });
    };

    if (editing) {
        return (
            <form
                onSubmit={submit}
                className="rounded-xl border border-scholarly-blue bg-white p-4"
            >
                <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                        <span className={labelClass}>Institution</span>
                        <input
                            value={form.data.institution}
                            onChange={(event) =>
                                form.setData('institution', event.target.value)
                            }
                            className={inputClass}
                        />
                    </label>
                    <label className="block">
                        <span className={labelClass}>Degree</span>
                        <input
                            value={form.data.degree}
                            onChange={(event) =>
                                form.setData('degree', event.target.value)
                            }
                            className={inputClass}
                        />
                    </label>
                    <label className="block">
                        <span className={labelClass}>Field of study</span>
                        <input
                            value={form.data.field}
                            onChange={(event) =>
                                form.setData('field', event.target.value)
                            }
                            className={inputClass}
                        />
                    </label>
                    <label className="block">
                        <span className={labelClass}>Grade</span>
                        <input
                            value={form.data.grade}
                            onChange={(event) =>
                                form.setData('grade', event.target.value)
                            }
                            className={inputClass}
                        />
                    </label>
                    <label className="block">
                        <span className={labelClass}>Started</span>
                        <input
                            type="date"
                            value={form.data.started_at}
                            onChange={(event) =>
                                form.setData('started_at', event.target.value)
                            }
                            className={inputClass}
                        />
                    </label>
                    <label className="block">
                        <span className={labelClass}>Ended</span>
                        <input
                            type="date"
                            value={form.data.ended_at}
                            disabled={form.data.is_current}
                            onChange={(event) =>
                                form.setData('ended_at', event.target.value)
                            }
                            className={inputClass}
                        />
                    </label>
                    <label className="flex items-center gap-2 text-sm font-semibold sm:col-span-2">
                        <input
                            type="checkbox"
                            checked={form.data.is_current}
                            onChange={(event) =>
                                form.setData('is_current', event.target.checked)
                            }
                            className="size-4 accent-scholarly-blue"
                        />
                        I am currently studying here
                    </label>
                </div>
                <div className="mt-4 flex gap-2">
                    <button
                        type="submit"
                        disabled={form.processing}
                        className="inline-flex h-10 items-center justify-center rounded-lg bg-scholarly-blue px-4 text-sm font-bold text-white disabled:opacity-50"
                    >
                        Save
                    </button>
                    <button
                        type="button"
                        onClick={() => setEditing(false)}
                        className="inline-flex h-10 items-center justify-center rounded-lg border border-scholarly-border px-4 text-sm font-bold text-scholarly-slate"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        );
    }

    return (
        <div className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-scholarly-border p-4">
            <div>
                <p className="text-sm font-bold">
                    {education.degree}
                    {education.field ? ` · ${education.field}` : ''}
                </p>
                <p className="mt-0.5 text-xs text-scholarly-slate">
                    {education.institution}
                </p>
                <p className="mt-1 text-xs text-scholarly-slate-light">
                    {education.started_at || '—'} to{' '}
                    {education.is_current
                        ? 'Present'
                        : education.ended_at || '—'}
                    {education.grade ? ` · ${education.grade}` : ''}
                </p>
            </div>
            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={() => setEditing(true)}
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-scholarly-border px-3 text-xs font-bold text-scholarly-slate transition hover:border-scholarly-blue hover:text-scholarly-blue"
                >
                    <Pencil className="size-3.5" /> Edit
                </button>
                <button
                    type="button"
                    onClick={remove}
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-scholarly-coral-dark/30 px-3 text-xs font-bold text-scholarly-coral-dark transition hover:bg-scholarly-coral-soft"
                >
                    <Trash2 className="size-3.5" />
                </button>
            </div>
        </div>
    );
}

export default function EducationSection({ educations }: SectionProps) {
    const [adding, setAdding] = useState(false);
    const form = useForm(emptyEducation);

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        form.post('/profile/educations', {
            preserveScroll: true,
            onSuccess: () => {
                form.reset();
                setAdding(false);
            },
        });
    };

    return (
        <section className="rounded-2xl border border-scholarly-border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h2 className="text-xl font-bold">Education</h2>
                    <p className="mt-1 text-sm text-scholarly-slate">
                        Your academic history, most recent first.
                    </p>
                </div>
                {!adding && (
                    <button
                        type="button"
                        onClick={() => setAdding(true)}
                        className="inline-flex h-10 items-center gap-2 rounded-lg bg-scholarly-navy px-4 text-sm font-bold text-white transition hover:bg-scholarly-navy/90"
                    >
                        <Plus className="size-4" /> Add
                    </button>
                )}
            </div>

            <div className="mt-5 space-y-3">
                {educations.map((education) => (
                    <EducationRow key={education.id} education={education} />
                ))}
                {educations.length === 0 && !adding && (
                    <p className="py-4 text-center text-sm text-scholarly-slate">
                        No education records yet.
                    </p>
                )}
            </div>

            {adding && (
                <form
                    onSubmit={submit}
                    className="mt-5 rounded-xl bg-scholarly-blue-white p-4"
                >
                    <div className="grid gap-4 sm:grid-cols-2">
                        <label className="block">
                            <span className={labelClass}>Institution</span>
                            <input
                                value={form.data.institution}
                                onChange={(event) =>
                                    form.setData(
                                        'institution',
                                        event.target.value,
                                    )
                                }
                                className={inputClass}
                            />
                            {form.errors.institution && (
                                <p className="mt-1 text-xs text-scholarly-coral-dark">
                                    {form.errors.institution}
                                </p>
                            )}
                        </label>
                        <label className="block">
                            <span className={labelClass}>Degree</span>
                            <input
                                value={form.data.degree}
                                onChange={(event) =>
                                    form.setData('degree', event.target.value)
                                }
                                className={inputClass}
                            />
                            {form.errors.degree && (
                                <p className="mt-1 text-xs text-scholarly-coral-dark">
                                    {form.errors.degree}
                                </p>
                            )}
                        </label>
                        <label className="block">
                            <span className={labelClass}>Field of study</span>
                            <input
                                value={form.data.field}
                                onChange={(event) =>
                                    form.setData('field', event.target.value)
                                }
                                className={inputClass}
                            />
                        </label>
                        <label className="block">
                            <span className={labelClass}>Grade</span>
                            <input
                                value={form.data.grade}
                                onChange={(event) =>
                                    form.setData('grade', event.target.value)
                                }
                                className={inputClass}
                            />
                        </label>
                        <label className="block">
                            <span className={labelClass}>Started</span>
                            <input
                                type="date"
                                value={form.data.started_at}
                                onChange={(event) =>
                                    form.setData(
                                        'started_at',
                                        event.target.value,
                                    )
                                }
                                className={inputClass}
                            />
                        </label>
                        <label className="block">
                            <span className={labelClass}>Ended</span>
                            <input
                                type="date"
                                value={form.data.ended_at}
                                disabled={form.data.is_current}
                                onChange={(event) =>
                                    form.setData('ended_at', event.target.value)
                                }
                                className={inputClass}
                            />
                        </label>
                        <label className="flex items-center gap-2 text-sm font-semibold sm:col-span-2">
                            <input
                                type="checkbox"
                                checked={form.data.is_current}
                                onChange={(event) =>
                                    form.setData(
                                        'is_current',
                                        event.target.checked,
                                    )
                                }
                                className="size-4 accent-scholarly-blue"
                            />
                            I am currently studying here
                        </label>
                    </div>
                    <div className="mt-4 flex gap-2">
                        <button
                            type="submit"
                            disabled={form.processing}
                            className="inline-flex h-10 items-center gap-2 rounded-lg bg-scholarly-blue px-4 text-sm font-bold text-white disabled:opacity-50"
                        >
                            <CheckCircle2 className="size-4" /> Save education
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                form.reset();
                                setAdding(false);
                            }}
                            className="inline-flex h-10 items-center gap-2 rounded-lg border border-scholarly-border px-4 text-sm font-bold text-scholarly-slate"
                        >
                            <Circle className="size-4" /> Cancel
                        </button>
                    </div>
                </form>
            )}
        </section>
    );
}
