import { Check, Circle } from 'lucide-react';

import { ActionLink, comingSoon } from './action-link';
import { tasks } from './data';

export default function TasksCard() {
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
                <ActionLink
                    href={comingSoon('All application tasks')}
                    className="text-sm font-bold text-scholarly-blue"
                >
                    View all tasks
                </ActionLink>
            </div>
            <div className="mt-5 divide-y divide-scholarly-border">
                {tasks.map((task) => (
                    <ActionLink
                        key={task.title}
                        href={comingSoon(task.title)}
                        className="flex items-center gap-3 py-3"
                    >
                        <div
                            className={`flex size-6 items-center justify-center rounded-md border ${task.complete ? 'border-scholarly-teal bg-scholarly-teal text-white' : 'border-scholarly-border'}`}
                        >
                            {task.complete ? (
                                <Check className="size-4" />
                            ) : (
                                <Circle className="size-3 text-transparent" />
                            )}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold">{task.title}</p>
                            <p className="text-xs text-scholarly-slate">
                                {task.body}
                            </p>
                        </div>
                        <span
                            className={`text-xs font-semibold ${task.complete ? 'text-scholarly-slate-light line-through' : 'text-scholarly-navy'}`}
                        >
                            {task.due}
                        </span>
                    </ActionLink>
                ))}
            </div>
        </div>
    );
}
