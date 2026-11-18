import { Link } from '@inertiajs/react';
import {
    Bookmark,
    CheckCircle2,
    FileCheck2,
    FileText,
    Sparkles,
    UserRound,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { relativeTime } from '@/lib/format';
import type { ActivityEntry } from '@/types/domain';

type Props = {
    activity: ActivityEntry[];
};

const icons: Record<string, LucideIcon> = {
    saved_scholarship: Bookmark,
    profile_updated: UserRound,
    task_completed: CheckCircle2,
    application_created: FileText,
    document_added: FileCheck2,
    status_changed: Sparkles,
};

export default function ActivityCard({ activity }: Props) {
    return (
        <div className="rounded-2xl border border-scholarly-border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold">Recent activity</h2>
                    <p className="mt-1 text-sm text-scholarly-slate">
                        Here’s what’s happened recently.
                    </p>
                </div>
                <Link
                    href="/profile"
                    className="text-sm font-bold text-scholarly-blue"
                >
                    Update profile
                </Link>
            </div>
            <div className="mt-5 space-y-4">
                {activity.map((entry) => {
                    const Icon = icons[entry.type] ?? CheckCircle2;

                    return (
                        <div key={entry.id} className="flex items-center gap-3">
                            <div className="flex size-9 items-center justify-center rounded-xl bg-scholarly-blue-soft text-scholarly-blue">
                                <Icon className="size-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-bold">
                                    {entry.title}
                                </p>
                                {entry.body && (
                                    <p className="truncate text-xs text-scholarly-slate">
                                        {entry.body}
                                    </p>
                                )}
                            </div>
                            <span className="shrink-0 text-xs text-scholarly-slate-light">
                                {relativeTime(entry.createdAt)}
                            </span>
                        </div>
                    );
                })}
                {activity.length === 0 && (
                    <p className="py-6 text-center text-sm text-scholarly-slate">
                        Your recent activity will appear here.
                    </p>
                )}
            </div>
        </div>
    );
}
