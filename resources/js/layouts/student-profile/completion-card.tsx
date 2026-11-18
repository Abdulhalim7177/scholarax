import { CheckCircle2, Circle } from 'lucide-react';

import type { ProfileCompletion } from '@/types/domain';

type Props = {
    completion: ProfileCompletion;
};

export default function CompletionCard({ completion }: Props) {
    return (
        <section className="rounded-2xl border border-scholarly-border bg-scholarly-navy p-6 text-white shadow-sm">
            <p className="text-xs font-bold tracking-[0.15em] text-scholarly-sky uppercase">
                Profile completion
            </p>
            <div className="mt-4 flex items-end justify-between">
                <span className="text-5xl font-bold tracking-[-0.06em]">
                    {completion.score}%
                </span>
                <span className="pb-1 text-xs text-white/60">
                    {completion.completed} of {completion.total} checks
                </span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/15">
                <div
                    className="h-full rounded-full bg-scholarly-blue"
                    style={{ width: `${completion.score}%` }}
                />
            </div>

            <ul className="mt-5 space-y-3">
                {completion.checks.map((check) => (
                    <li
                        key={check.key}
                        className="flex items-center gap-2.5 text-sm"
                    >
                        {check.complete ? (
                            <CheckCircle2 className="size-4 shrink-0 text-scholarly-teal" />
                        ) : (
                            <Circle className="size-4 shrink-0 text-white/40" />
                        )}
                        <span
                            className={
                                check.complete
                                    ? 'text-white/60 line-through'
                                    : 'text-white/90'
                            }
                        >
                            {check.label}
                        </span>
                    </li>
                ))}
            </ul>
        </section>
    );
}
