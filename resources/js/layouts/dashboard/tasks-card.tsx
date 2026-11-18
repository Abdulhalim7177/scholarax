import { Link, router } from '@inertiajs/react';
import { ArrowRight, Check } from 'lucide-react';

import type { DashboardTask } from '@/types/domain';

type Props = {
    tasks: DashboardTask[];
};

export default function TasksCard({ tasks }: Props) {
    const complete = (task: DashboardTask) => {
        router.patch(
            task.updateUrl,
            { completed: true },
            { preserveScroll: true },
        );
    };

    return (
        <div className="rounded-2xl border border-scholarly-border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold">
                        Upcoming application tasks
                    </h2>
                    <p className="mt-1 text-sm text-scholarly-slate">
                        Stay on track with your goals.
                    </p>
                </div>
                <Link
                    href="/applications"
                    className="text-sm font-bold text-scholarly-blue"
                >
                    View all tasks
                </Link>
            </div>
            <div className="mt-5 divide-y divide-scholarly-border">
                {tasks.map((task) => (
                    <div key={task.id} className="flex items-center gap-3 py-3">
                        <button
                            type="button"
                            onClick={() => complete(task)}
                            aria-label={`Mark ${task.title} complete`}
                            className="flex size-6 items-center justify-center rounded-md border border-scholarly-border transition hover:border-scholarly-teal hover:bg-scholarly-teal-soft"
                        >
                            <Check className="size-3.5 text-scholarly-teal" />
                        </button>
                        <Link
                            href={`/applications/${task.applicationId}`}
                            className="min-w-0 flex-1"
                        >
                            <p className="text-sm font-bold">{task.title}</p>
                            <p className="truncate text-xs text-scholarly-slate">
                                {task.applicationTitle ??
                                    task.description ??
                                    'Application task'}
                            </p>
                        </Link>
                        <span className="shrink-0 text-xs font-semibold text-scholarly-navy">
                            {task.due ?? 'No due date'}
                        </span>
                    </div>
                ))}
                {tasks.length === 0 && (
                    <p className="py-6 text-center text-sm text-scholarly-slate">
                        You have no open tasks. Nice work!
                    </p>
                )}
            </div>
            <Link
                href="/applications"
                className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-scholarly-blue"
            >
                Go to applications <ArrowRight className="size-4" />
            </Link>
        </div>
    );
}
