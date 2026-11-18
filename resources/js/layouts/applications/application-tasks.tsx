import { router, useForm } from '@inertiajs/react';
import { CalendarDays, Check, Plus, Trash2 } from 'lucide-react';
import type { FormEvent } from 'react';

import type { ApplicationTaskItem } from '@/types/domain';

type Props = {
    applicationId: number;
    tasks: ApplicationTaskItem[];
    summary: { total: number; completed: number };
};

export default function ApplicationTasks({
    applicationId,
    tasks,
    summary,
}: Props) {
    const form = useForm({
        title: '',
        description: '',
        due_at: '',
    });

    const toggle = (task: ApplicationTaskItem) => {
        router.patch(
            `/applications/${applicationId}/tasks/${task.id}`,
            { completed: !task.completed },
            { preserveScroll: true },
        );
    };

    const remove = (task: ApplicationTaskItem) => {
        if (!window.confirm(`Remove “${task.title}”?`)) {
            return;
        }

        router.delete(`/applications/${applicationId}/tasks/${task.id}`, {
            preserveScroll: true,
        });
    };

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        form.post(`/applications/${applicationId}/tasks`, {
            preserveScroll: true,
            onSuccess: () => form.reset(),
        });
    };

    return (
        <section className="rounded-2xl border border-scholarly-border bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-xl font-bold">Tasks</h2>
                    <p className="mt-1 text-sm text-scholarly-slate">
                        {summary.completed} of {summary.total} tasks complete.
                    </p>
                </div>
                <div className="h-2 w-32 overflow-hidden rounded-full bg-scholarly-blue-white">
                    <div
                        className="h-full rounded-full bg-scholarly-teal"
                        style={{
                            width: `${summary.total === 0 ? 0 : Math.round((summary.completed / summary.total) * 100)}%`,
                        }}
                    />
                </div>
            </div>

            <div className="mt-5 divide-y divide-scholarly-border">
                {tasks.map((task) => (
                    <div key={task.id} className="flex items-start gap-3 py-3">
                        <button
                            type="button"
                            onClick={() => toggle(task)}
                            aria-label={
                                task.completed
                                    ? `Mark ${task.title} incomplete`
                                    : `Mark ${task.title} complete`
                            }
                            className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md border transition ${
                                task.completed
                                    ? 'border-scholarly-teal bg-scholarly-teal text-white'
                                    : 'border-scholarly-border hover:border-scholarly-teal hover:bg-scholarly-teal-soft'
                            }`}
                        >
                            <Check
                                className={`size-3.5 ${task.completed ? 'text-white' : 'text-scholarly-teal'}`}
                            />
                        </button>
                        <div className="min-w-0 flex-1">
                            <p
                                className={`text-sm font-bold ${task.completed ? 'text-scholarly-slate line-through' : 'text-scholarly-navy'}`}
                            >
                                {task.title}
                            </p>
                            {task.description && (
                                <p className="mt-0.5 text-xs text-scholarly-slate">
                                    {task.description}
                                </p>
                            )}
                            <p className="mt-1 inline-flex items-center gap-1 text-xs text-scholarly-slate-light">
                                <CalendarDays className="size-3" />
                                {task.due ? `Due ${task.due}` : 'No due date'}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => remove(task)}
                            aria-label={`Remove ${task.title}`}
                            className="text-scholarly-slate-light transition hover:text-scholarly-coral-dark"
                        >
                            <Trash2 className="size-4" />
                        </button>
                    </div>
                ))}
                {tasks.length === 0 && (
                    <p className="py-6 text-center text-sm text-scholarly-slate">
                        No tasks yet. Add your first task below.
                    </p>
                )}
            </div>

            <form
                onSubmit={submit}
                className="mt-5 grid gap-3 rounded-xl bg-scholarly-blue-white p-4 sm:grid-cols-[minmax(0,1fr)_auto_auto]"
            >
                <input
                    value={form.data.title}
                    onChange={(event) =>
                        form.setData('title', event.target.value)
                    }
                    placeholder="New task title"
                    className="h-10 rounded-lg border border-scholarly-border bg-white px-3 text-sm outline-none focus:border-scholarly-blue focus:ring-4 focus:ring-scholarly-blue-soft"
                />
                <input
                    type="date"
                    value={form.data.due_at}
                    onChange={(event) =>
                        form.setData('due_at', event.target.value)
                    }
                    className="h-10 rounded-lg border border-scholarly-border bg-white px-3 text-sm outline-none focus:border-scholarly-blue focus:ring-4 focus:ring-scholarly-blue-soft"
                />
                <button
                    type="submit"
                    disabled={form.processing || form.data.title.trim() === ''}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-scholarly-navy px-4 text-sm font-bold text-white transition hover:bg-scholarly-navy/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <Plus className="size-4" /> Add task
                </button>
                {form.errors.title && (
                    <p className="text-xs text-scholarly-coral-dark sm:col-span-3">
                        {form.errors.title}
                    </p>
                )}
            </form>
        </section>
    );
}
