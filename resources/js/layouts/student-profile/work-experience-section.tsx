import { useForm } from '@inertiajs/react';
import { CheckCircle2, Pencil, Plus, Trash2 } from 'lucide-react';
import type { FormEvent } from 'react';
import { useState } from 'react';

import type { WorkExperienceRecord } from '@/types/domain';

const inputClass =
    'mt-1.5 h-11 w-full rounded-lg border border-scholarly-border bg-scholarly-blue-white px-3 text-sm text-scholarly-navy outline-none focus:border-scholarly-blue focus:ring-4 focus:ring-scholarly-blue-soft';
const labelClass =
    'text-xs font-bold tracking-[0.12em] text-scholarly-slate uppercase';

const emptyExperience = {
    organization: '',
    role: '',
    started_at: '',
    ended_at: '',
    description: '',
    is_current: false,
};

function ExperienceRow({ experience }: { experience: WorkExperienceRecord }) {
    const [editing, setEditing] = useState(false);
    const form = useForm({
        organization: experience.organization,
        role: experience.role,
        started_at: experience.started_at,
        ended_at: experience.ended_at,
        description: experience.description,
        is_current: experience.is_current,
    });

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        form.patch(`/profile/work-experiences/${experience.id}`, {
            preserveScroll: true,
            onSuccess: () => setEditing(false),
        });
    };

    const remove = () => {
        if (
            !window.confirm(
                `Remove ${experience.role} at ${experience.organization}?`,
            )
        ) {
            return;
        }

        form.delete(`/profile/work-experiences/${experience.id}`, {
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
                        <span className={labelClass}>Organization</span>
                        <input
                            value={form.data.organization}
                            onChange={(event) =>
                                form.setData('organization', event.target.value)
                            }
                            className={inputClass}
                        />
                    </label>
                    <label className="block">
                        <span className={labelClass}>Role</span>
                        <input
                            value={form.data.role}
                            onChange={(event) =>
                                form.setData('role', event.target.value)
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
                    <label className="block sm:col-span-2">
                        <span className={labelClass}>Description</span>
                        <textarea
                            value={form.data.description}
                            onChange={(event) =>
                                form.setData('description', event.target.value)
                            }
                            rows={3}
                            className="mt-1.5 w-full rounded-lg border border-scholarly-border bg-scholarly-blue-white px-3 py-2.5 text-sm leading-6 text-scholarly-navy outline-none focus:border-scholarly-blue focus:ring-4 focus:ring-scholarly-blue-soft"
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
                        I currently work here
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
                <p className="text-sm font-bold">{experience.role}</p>
                <p className="mt-0.5 text-xs text-scholarly-slate">
                    {experience.organization}
                </p>
                <p className="mt-1 text-xs text-scholarly-slate-light">
                    {experience.started_at || '—'} to{' '}
                    {experience.is_current
                        ? 'Present'
                        : experience.ended_at || '—'}
                </p>
                {experience.description && (
                    <p className="mt-2 max-w-xl text-xs leading-5 text-scholarly-slate">
                        {experience.description}
                    </p>
                )}
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

export default function WorkExperienceSection({
    workExperiences,
}: {
    workExperiences: WorkExperienceRecord[];
}) {
    const [adding, setAdding] = useState(false);
    const form = useForm(emptyExperience);

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        form.post('/profile/work-experiences', {
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
                    <h2 className="text-xl font-bold">Work experience</h2>
                    <p className="mt-1 text-sm text-scholarly-slate">
                        Roles and projects that strengthen your application.
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
                {workExperiences.map((experience) => (
                    <ExperienceRow
                        key={experience.id}
                        experience={experience}
                    />
                ))}
                {workExperiences.length === 0 && !adding && (
                    <p className="py-4 text-center text-sm text-scholarly-slate">
                        No work experience yet.
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
                            <span className={labelClass}>Organization</span>
                            <input
                                value={form.data.organization}
                                onChange={(event) =>
                                    form.setData(
                                        'organization',
                                        event.target.value,
                                    )
                                }
                                className={inputClass}
                            />
                            {form.errors.organization && (
                                <p className="mt-1 text-xs text-scholarly-coral-dark">
                                    {form.errors.organization}
                                </p>
                            )}
                        </label>
                        <label className="block">
                            <span className={labelClass}>Role</span>
                            <input
                                value={form.data.role}
                                onChange={(event) =>
                                    form.setData('role', event.target.value)
                                }
                                className={inputClass}
                            />
                            {form.errors.role && (
                                <p className="mt-1 text-xs text-scholarly-coral-dark">
                                    {form.errors.role}
                                </p>
                            )}
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
                        <label className="block sm:col-span-2">
                            <span className={labelClass}>Description</span>
                            <textarea
                                value={form.data.description}
                                onChange={(event) =>
                                    form.setData(
                                        'description',
                                        event.target.value,
                                    )
                                }
                                rows={3}
                                className="mt-1.5 w-full rounded-lg border border-scholarly-border bg-scholarly-blue-white px-3 py-2.5 text-sm leading-6 text-scholarly-navy outline-none focus:border-scholarly-blue focus:ring-4 focus:ring-scholarly-blue-soft"
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
                            I currently work here
                        </label>
                    </div>
                    <div className="mt-4 flex gap-2">
                        <button
                            type="submit"
                            disabled={form.processing}
                            className="inline-flex h-10 items-center gap-2 rounded-lg bg-scholarly-blue px-4 text-sm font-bold text-white disabled:opacity-50"
                        >
                            <CheckCircle2 className="size-4" /> Save experience
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                form.reset();
                                setAdding(false);
                            }}
                            className="inline-flex h-10 items-center justify-center rounded-lg border border-scholarly-border px-4 text-sm font-bold text-scholarly-slate"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}
        </section>
    );
}
