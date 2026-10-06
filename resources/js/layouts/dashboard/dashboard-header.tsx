import { ArrowRight, Bell } from 'lucide-react';

import { ActionLink, comingSoon } from './action-link';

export default function DashboardHeader({ firstName }: { firstName: string }) {
    return (
        <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
                <p className="text-sm font-semibold tracking-[0.18em] text-scholarly-blue uppercase">
                    Your scholarship journey
                </p>
                <h1 className="mt-2 font-display text-4xl tracking-[-0.04em] sm:text-5xl">
                    Good morning, {firstName}
                </h1>
                <p className="mt-2 text-sm text-scholarly-slate">
                    Here is your scholarship journey at a glance.
                </p>
            </div>
            <div className="flex items-center gap-3">
                <ActionLink
                    href={comingSoon('Notifications')}
                    className="flex size-11 items-center justify-center rounded-xl border border-scholarly-border bg-white text-scholarly-navy shadow-sm transition hover:border-scholarly-blue hover:text-scholarly-blue"
                    aria-label="Open notifications"
                >
                    <Bell className="size-5" />
                </ActionLink>
                <ActionLink
                    href={comingSoon('Explore scholarships')}
                    className="inline-flex items-center gap-2 rounded-xl bg-scholarly-blue px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-scholarly-blue-dark"
                >
                    Explore scholarships <ArrowRight className="size-4" />
                </ActionLink>
            </div>
        </header>
    );
}
