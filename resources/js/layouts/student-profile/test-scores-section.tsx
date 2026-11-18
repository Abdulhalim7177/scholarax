import { useForm } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import type { FormEvent } from 'react';
import { useState } from 'react';

import type { TestScoreRecord } from '@/types/domain';

const inputClass =
    'mt-1.5 h-11 w-full rounded-lg border border-scholarly-border bg-scholarly-blue-white px-3 text-sm text-scholarly-navy outline-none focus:border-scholarly-blue focus:ring-4 focus:ring-scholarly-blue-soft';
const labelClass =
    'text-xs font-bold tracking-[0.12em] text-scholarly-slate uppercase';

const emptyScore = {
    type: '',
    score: '',
    tested_at: '',
    expires_at: '',
};

function ScoreRow({ score }: { score: TestScoreRecord }) {
    const [editing, setEditing] = useState(false);
    const form = useForm({
        type: score.type,
        score: score.score,
        tested_at: score.tested_at,
        expires_at: score.expires_at,
    });

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        form.patch(`/profile/test-scores/${score.id}`, {
            preserveScroll: true,
            onSuccess: () => setEditing(false),
        });
    };

    const remove = () => {
        if (!window.confirm(`Remove your ${score.type} score?`)) {
            return;
        }

        form.delete(`/profile/test-scores/${score.id}`, {
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
                        <span className={labelClass}>Test</span>
                        <input
                            value={form.data.type}
                            onChange={(event) =>
                                form.setData('type', event.target.value)
                            }
                            className={inputClass}
                        />
                    </label>
                    <label className="block">
                        <span className={labelClass}>Score</span>
                        <input
                            value={form.data.score}
                            onChange={(event) =>
                                form.setData('score', event.target.value)
                            }
                            className={inputClass}
                        />
                    </label>
                    <label className="block">
                        <span className={labelClass}>Tested on</span>
                        <input
                            type="date"
                            value={form.data.tested_at}
                            onChange={(event) =>
                                form.setData('tested_at', event.target.value)
                            }
                            className={inputClass}
                        />
                    </label>
                    <label className="block">
                        <span className={labelClass}>Expires on</span>
                        <input
                            type="date"
                            value={form.data.expires_at}
                            onChange={(event) =>
                                form.setData('expires_at', event.target.value)
                            }
                            className={inputClass}
                        />
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
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-scholarly-border p-4">
            <div>
                <p className="text-sm font-bold">
                    {score.type}{' '}
                    <span className="text-scholarly-blue">{score.score}</span>
                </p>
                <p className="mt-0.5 text-xs text-scholarly-slate">
                    Tested {score.tested_at || '—'}
                    {score.expires_at ? ` · Expires ${score.expires_at}` : ''}
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

export default function TestScoresSection({
    testScores,
}: {
    testScores: TestScoreRecord[];
}) {
    const [adding, setAdding] = useState(false);
    const form = useForm(emptyScore);

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        form.post('/profile/test-scores', {
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
                    <h2 className="text-xl font-bold">Test scores</h2>
                    <p className="mt-1 text-sm text-scholarly-slate">
                        Language and admissions tests linked to your profile.
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
                {testScores.map((score) => (
                    <ScoreRow key={score.id} score={score} />
                ))}
                {testScores.length === 0 && !adding && (
                    <p className="py-4 text-center text-sm text-scholarly-slate">
                        No test scores yet.
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
                            <span className={labelClass}>Test</span>
                            <input
                                value={form.data.type}
                                onChange={(event) =>
                                    form.setData('type', event.target.value)
                                }
                                placeholder="IELTS, TOEFL, GRE…"
                                className={inputClass}
                            />
                            {form.errors.type && (
                                <p className="mt-1 text-xs text-scholarly-coral-dark">
                                    {form.errors.type}
                                </p>
                            )}
                        </label>
                        <label className="block">
                            <span className={labelClass}>Score</span>
                            <input
                                value={form.data.score}
                                onChange={(event) =>
                                    form.setData('score', event.target.value)
                                }
                                placeholder="8.0"
                                className={inputClass}
                            />
                            {form.errors.score && (
                                <p className="mt-1 text-xs text-scholarly-coral-dark">
                                    {form.errors.score}
                                </p>
                            )}
                        </label>
                        <label className="block">
                            <span className={labelClass}>Tested on</span>
                            <input
                                type="date"
                                value={form.data.tested_at}
                                onChange={(event) =>
                                    form.setData(
                                        'tested_at',
                                        event.target.value,
                                    )
                                }
                                className={inputClass}
                            />
                        </label>
                        <label className="block">
                            <span className={labelClass}>Expires on</span>
                            <input
                                type="date"
                                value={form.data.expires_at}
                                onChange={(event) =>
                                    form.setData(
                                        'expires_at',
                                        event.target.value,
                                    )
                                }
                                className={inputClass}
                            />
                        </label>
                    </div>
                    <div className="mt-4 flex gap-2">
                        <button
                            type="submit"
                            disabled={form.processing}
                            className="inline-flex h-10 items-center justify-center rounded-lg bg-scholarly-blue px-4 text-sm font-bold text-white disabled:opacity-50"
                        >
                            Save score
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
