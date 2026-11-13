import { Link } from '@inertiajs/react';
import { Bell, CalendarPlus, MessageCircle } from 'lucide-react';

type MentorHeaderProps = { name?: string };

export default function MentorHeader({ name = 'Maya' }: MentorHeaderProps) {
    return (
        <header className="flex flex-col gap-5 border-b border-scholarly-border pb-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
                <p className="mb-2 text-sm font-semibold text-scholarly-blue">
                    Mentor workspace
                </p>
                <h1 className="font-display text-4xl tracking-[-0.03em] text-scholarly-navy sm:text-5xl">
                    Good morning, {name}
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-scholarly-slate sm:text-base">
                    Here’s what needs your attention today. Your guidance is
                    helping learners move closer to their goals.
                </p>
            </div>
            <div className="flex flex-wrap gap-2">
                <Link
                    href="/mentor-coming-soon?feature=Mentor%20messages"
                    className="inline-flex h-11 items-center gap-2 rounded-xl border border-scholarly-border bg-white px-4 text-sm font-bold text-scholarly-navy transition hover:border-scholarly-blue hover:text-scholarly-blue"
                >
                    <MessageCircle className="size-4" /> Messages
                </Link>
                <Link
                    href="/mentor-coming-soon?feature=Create%20mentor%20session"
                    className="inline-flex h-11 items-center gap-2 rounded-xl bg-scholarly-blue px-4 text-sm font-bold text-white transition hover:bg-scholarly-blue-dark"
                >
                    <CalendarPlus className="size-4" /> Add availability
                </Link>
                <button
                    type="button"
                    aria-label="Notifications"
                    className="inline-flex size-11 items-center justify-center rounded-xl border border-scholarly-border bg-white text-scholarly-slate hover:border-scholarly-blue hover:text-scholarly-blue"
                >
                    <Bell className="size-4" />
                </button>
            </div>
        </header>
    );
}
