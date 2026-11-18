import { ArrowRight } from 'lucide-react';

import { relativeTime } from '@/lib/format';
import type { ApplicationHistoryItem } from '@/types/domain';

type Props = {
    history: ApplicationHistoryItem[];
};

export default function ApplicationTimeline({ history }: Props) {
    return (
        <section className="rounded-2xl border border-scholarly-border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">Status timeline</h2>
            <p className="mt-1 text-sm text-scholarly-slate">
                Every status change on this application.
            </p>

            <ol className="mt-5 space-y-5">
                {history.map((entry, index) => (
                    <li key={entry.id} className="relative flex gap-3">
                        <div className="flex flex-col items-center">
                            <span
                                className={`mt-1 flex size-2.5 rounded-full ${index === 0 ? 'bg-scholarly-blue' : 'bg-scholarly-slate-light'}`}
                            />
                            {index < history.length - 1 && (
                                <span className="mt-1 w-px flex-1 bg-scholarly-border" />
                            )}
                        </div>
                        <div className="min-w-0 flex-1 pb-1">
                            <p className="flex flex-wrap items-center gap-1.5 text-sm font-bold">
                                {entry.fromLabel ? (
                                    <>
                                        <span className="text-scholarly-slate">
                                            {entry.fromLabel}
                                        </span>
                                        <ArrowRight className="size-3.5 text-scholarly-slate-light" />
                                    </>
                                ) : null}
                                <span>{entry.toLabel}</span>
                            </p>
                            {entry.note && (
                                <p className="mt-1 text-xs text-scholarly-slate">
                                    {entry.note}
                                </p>
                            )}
                            <p className="mt-1 text-xs text-scholarly-slate-light">
                                {entry.changedBy ? `${entry.changedBy} · ` : ''}
                                {relativeTime(entry.createdAt)}
                            </p>
                        </div>
                    </li>
                ))}
                {history.length === 0 && (
                    <li className="text-sm text-scholarly-slate">
                        No status changes recorded yet.
                    </li>
                )}
            </ol>
        </section>
    );
}
