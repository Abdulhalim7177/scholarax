import { Head, Link, useForm } from '@inertiajs/react';
import { MessageCircle, Send } from 'lucide-react';
import type { FormEvent } from 'react';

import InputError from '@/components/input-error';
import type { MentorMessagesProps } from '@/types/domain';

const toneClasses = {
    blue: 'bg-scholarly-blue-soft text-scholarly-blue',
    coral: 'bg-scholarly-coral-soft text-scholarly-coral-dark',
    gold: 'bg-scholarly-gold-soft text-scholarly-gold-dark',
    teal: 'bg-scholarly-teal-soft text-scholarly-teal-dark',
};

export default function MentorMessages({
    stats,
    conversations,
    active,
    thread,
}: MentorMessagesProps) {
    const form = useForm({
        mentorship_id: active ? String(active.mentorshipId) : '',
        body: '',
    });

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        form.post('/mentor-messages', {
            preserveScroll: true,
            onSuccess: () => form.reset('body'),
        });
    };

    return (
        <>
            <Head title="Messages" />
            <div className="min-h-screen bg-scholarly-blue-white p-4 text-scholarly-navy sm:p-6 lg:p-8">
                <div className="mx-auto max-w-7xl space-y-6">
                    <header className="flex flex-col gap-3 border-b border-scholarly-border pb-6 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-sm font-semibold text-scholarly-blue">
                                Stay close to your learners
                            </p>
                            <h1 className="mt-2 font-display text-4xl tracking-[-0.03em] sm:text-5xl">
                                Messages
                            </h1>
                            <p className="mt-3 text-sm leading-6 text-scholarly-slate">
                                {stats.conversations} conversations ·{' '}
                                {stats.unread} unread
                            </p>
                        </div>
                    </header>

                    {conversations.length === 0 ? (
                        <section className="rounded-2xl border border-scholarly-border bg-white p-12 text-center shadow-sm">
                            <MessageCircle className="mx-auto size-9 text-scholarly-blue" />
                            <p className="mt-4 font-display text-2xl">
                                No conversations yet.
                            </p>
                            <p className="mt-2 text-sm text-scholarly-slate">
                                Messages will appear here when you start
                                mentoring a learner.
                            </p>
                        </section>
                    ) : (
                        <div className="grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
                            <section className="rounded-2xl border border-scholarly-border bg-white p-3 shadow-sm">
                                <div className="space-y-1">
                                    {conversations.map((conversation) => (
                                        <Link
                                            key={conversation.mentorshipId}
                                            href={`/mentor-messages?mentorship=${conversation.mentorshipId}`}
                                            preserveScroll
                                            className={`flex items-center gap-3 rounded-xl p-3 transition ${conversation.active ? 'bg-scholarly-blue-soft' : 'hover:bg-scholarly-blue-white'}`}
                                        >
                                            <span
                                                className={`flex size-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${toneClasses[conversation.tone]}`}
                                            >
                                                {conversation.initials}
                                            </span>
                                            <span className="min-w-0 flex-1">
                                                <span className="flex items-center justify-between gap-2">
                                                    <span className="truncate text-sm font-bold">
                                                        {conversation.learner}
                                                    </span>
                                                    {conversation.unread >
                                                        0 && (
                                                        <span className="rounded-full bg-scholarly-coral px-1.5 py-0.5 text-[10px] font-bold text-white">
                                                            {
                                                                conversation.unread
                                                            }
                                                        </span>
                                                    )}
                                                </span>
                                                <span className="mt-1 block truncate text-xs text-scholarly-slate">
                                                    {conversation.lastMessage ??
                                                        'No messages yet'}
                                                </span>
                                                {conversation.lastMessageAt && (
                                                    <span className="mt-1 block text-[10px] text-scholarly-slate-light">
                                                        {
                                                            conversation.lastMessageAt
                                                        }
                                                    </span>
                                                )}
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            </section>

                            <section className="flex min-h-[520px] flex-col rounded-2xl border border-scholarly-border bg-white shadow-sm">
                                {active ? (
                                    <>
                                        <div className="flex items-center gap-3 border-b border-scholarly-border p-4 sm:p-5">
                                            <span
                                                className={`flex size-11 items-center justify-center rounded-full text-xs font-bold ${toneClasses[conversations.find((item) => item.mentorshipId === active.mentorshipId)?.tone ?? 'blue']}`}
                                            >
                                                {active.initials}
                                            </span>
                                            <div className="min-w-0">
                                                <p className="font-bold">
                                                    {active.learner}
                                                </p>
                                                <p className="truncate text-xs text-scholarly-slate">
                                                    {active.goal ??
                                                        'Scholarship preparation'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex-1 space-y-4 overflow-y-auto bg-scholarly-blue-white p-4 sm:p-6">
                                            {thread.map((message) => (
                                                <div
                                                    key={message.id}
                                                    className={`flex ${message.fromMentor ? 'justify-end' : 'justify-start'}`}
                                                >
                                                    <div
                                                        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm sm:max-w-[70%] ${message.fromMentor ? 'rounded-br-sm bg-scholarly-blue text-white' : 'rounded-bl-sm bg-white text-scholarly-navy'}`}
                                                    >
                                                        <p className="whitespace-pre-line">
                                                            {message.body}
                                                        </p>
                                                        <p
                                                            className={`mt-2 text-[10px] ${message.fromMentor ? 'text-white/65' : 'text-scholarly-slate-light'}`}
                                                        >
                                                            {message.senderName}{' '}
                                                            · {message.date}{' '}
                                                            {message.time}
                                                            {message.read
                                                                ? ' · Read'
                                                                : ''}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                            {thread.length === 0 && (
                                                <p className="py-16 text-center text-sm text-scholarly-slate">
                                                    No messages in this
                                                    conversation yet. Say hello.
                                                </p>
                                            )}
                                        </div>

                                        <form
                                            onSubmit={submit}
                                            className="border-t border-scholarly-border p-4 sm:p-5"
                                        >
                                            <div className="flex items-end gap-2">
                                                <textarea
                                                    value={form.data.body}
                                                    onChange={(event) =>
                                                        form.setData(
                                                            'body',
                                                            event.target.value,
                                                        )
                                                    }
                                                    rows={2}
                                                    placeholder={`Message ${active.learner}…`}
                                                    className="min-h-11 flex-1 rounded-xl border border-scholarly-border bg-scholarly-blue-white p-3 text-sm outline-none focus:border-scholarly-blue"
                                                />
                                                <button
                                                    type="submit"
                                                    disabled={
                                                        form.processing ||
                                                        form.data.body.trim() ===
                                                            ''
                                                    }
                                                    className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-scholarly-blue text-white hover:bg-scholarly-blue-dark disabled:opacity-50"
                                                    aria-label="Send message"
                                                >
                                                    <Send className="size-4" />
                                                </button>
                                            </div>
                                            <InputError
                                                message={form.errors.body}
                                                className="mt-1"
                                            />
                                        </form>
                                    </>
                                ) : (
                                    <div className="flex flex-1 items-center justify-center p-10 text-center text-sm text-scholarly-slate">
                                        Select a conversation to start
                                        messaging.
                                    </div>
                                )}
                            </section>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

MentorMessages.layout = () => ({
    breadcrumbs: [{ title: 'Messages', href: '/mentor-messages' }],
});
