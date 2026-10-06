import { Bookmark, CheckCircle2, MessageCircle, UserRound } from 'lucide-react';

import { ActionLink, comingSoon } from './action-link';

export default function ActivityCard() {
    const activity = [
        [
            'Saved DAAD Scholarships',
            'Added to your saved list',
            Bookmark,
            '2 hours ago',
        ],
        [
            'Completed education history',
            'Your profile is 82% complete',
            CheckCircle2,
            '1 day ago',
        ],
        [
            'Mentor reviewed your SOP',
            'Dr. Maya Chen left feedback',
            MessageCircle,
            '2 days ago',
        ],
        [
            'Updated profile information',
            'Added work experience',
            UserRound,
            '3 days ago',
        ],
    ] as const;
    return (
        <div className="rounded-2xl border border-scholarly-border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold">Recent activity</h2>
                    <p className="mt-1 text-sm text-scholarly-slate">
                        Here’s what’s happened recently.
                    </p>
                </div>
                <ActionLink
                    href={comingSoon('All activity')}
                    className="text-sm font-bold text-scholarly-blue"
                >
                    View all activity
                </ActionLink>
            </div>
            <div className="mt-5 space-y-4">
                {activity.map(([title, body, Icon, time]) => (
                    <div key={title} className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-xl bg-scholarly-blue-soft text-scholarly-blue">
                            <Icon className="size-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold">{title}</p>
                            <p className="text-xs text-scholarly-slate">
                                {body}
                            </p>
                        </div>
                        <span className="shrink-0 text-xs text-scholarly-slate-light">
                            {time}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
