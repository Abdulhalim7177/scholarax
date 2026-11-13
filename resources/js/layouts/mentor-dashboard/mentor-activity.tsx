import { Link } from '@inertiajs/react';
import { ArrowRight, CalendarDays, MessageCircle } from 'lucide-react';

import type { MentorSession } from './data';

type Props = {
    sessions: MentorSession[];
    messages: Array<{
        learner: string;
        initials: string;
        message: string;
        time: string;
        tone: string;
    }>;
};

export default function MentorActivity({ sessions, messages }: Props) {
    return (
        <div className="space-y-6">
            <section className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-scholarly-navy">
                            Upcoming sessions
                        </h2>
                        <p className="mt-1 text-sm text-scholarly-slate">
                            Your next conversations.
                        </p>
                    </div>
                    <CalendarDays className="size-5 text-scholarly-blue" />
                </div>
                <div className="mt-4 divide-y divide-scholarly-border-soft">
                    {sessions.map((session) => (
                        <Link
                            key={session.id}
                            href={`/mentor-coming-soon?feature=Session with ${encodeURIComponent(session.learner)}`}
                            className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                        >
                            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-scholarly-blue-soft text-xs font-bold text-scholarly-blue">
                                {session.initials}
                            </span>
                            <span className="min-w-0 flex-1">
                                <span className="block text-sm font-bold text-scholarly-navy">
                                    {session.learner}
                                </span>
                                <span className="mt-1 block text-xs text-scholarly-slate">
                                    {session.topic}
                                </span>
                            </span>
                            <span className="text-right">
                                <span className="block text-xs font-bold text-scholarly-navy">
                                    {session.time}
                                </span>
                                <span className="mt-1 block text-[11px] text-scholarly-slate">
                                    {session.date}
                                </span>
                            </span>
                        </Link>
                    ))}
                </div>
                <Link
                    href="/mentor-coming-soon?feature=Mentor%20calendar"
                    className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-scholarly-blue"
                >
                    Open calendar <ArrowRight className="size-4" />
                </Link>
            </section>
            <section className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-scholarly-navy">
                            Recent messages
                        </h2>
                        <p className="mt-1 text-sm text-scholarly-slate">
                            Stay close to your learners.
                        </p>
                    </div>
                    <MessageCircle className="size-5 text-scholarly-coral" />
                </div>
                <div className="mt-4 divide-y divide-scholarly-border-soft">
                    {messages.map((message) => (
                        <Link
                            key={message.learner}
                            href={`/mentor-coming-soon?feature=Message ${encodeURIComponent(message.learner)}`}
                            className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                        >
                            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-scholarly-coral-soft text-[11px] font-bold text-scholarly-coral-dark">
                                {message.initials}
                            </span>
                            <span className="min-w-0 flex-1">
                                <span className="block text-xs font-bold text-scholarly-navy">
                                    {message.learner}
                                </span>
                                <span className="mt-1 block truncate text-xs text-scholarly-slate">
                                    {message.message}
                                </span>
                            </span>
                            <span className="text-[11px] text-scholarly-slate-light">
                                {message.time}
                            </span>
                        </Link>
                    ))}
                </div>
                <Link
                    href="/mentor-coming-soon?feature=Mentor%20inbox"
                    className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-scholarly-blue"
                >
                    Open inbox <ArrowRight className="size-4" />
                </Link>
            </section>
        </div>
    );
}
