import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Bookmark,
    CheckCircle2,
    FileCheck2,
    FileText,
    Sparkles,
    UserRound,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import Pagination from '@/layouts/scholarships/pagination';
import { relativeTime } from '@/lib/format';
import type { NotificationsProps } from '@/types/domain';

const icons: Record<string, LucideIcon> = {
    saved_scholarship: Bookmark,
    profile_updated: UserRound,
    task_completed: CheckCircle2,
    application_created: FileText,
    document_added: FileCheck2,
    status_changed: Sparkles,
};

export default function Notifications({ notifications }: NotificationsProps) {
    return (
        <>
            <Head title="Notifications" />
            <div className="min-h-screen bg-scholarly-blue-white p-4 text-scholarly-navy sm:p-6 lg:p-8">
                <div className="mx-auto max-w-4xl space-y-7">
                    <header className="border-b border-scholarly-border pb-6">
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center gap-2 text-sm font-bold text-scholarly-blue"
                        >
                            <ArrowLeft className="size-4" /> Back to dashboard
                        </Link>
                        <h1 className="mt-4 font-display text-4xl tracking-[-0.03em] sm:text-5xl">
                            Notifications
                        </h1>
                        <p className="mt-3 text-sm leading-6 text-scholarly-slate">
                            Updates about your applications, documents, and
                            mentorship activity.
                        </p>
                    </header>
                    <section className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm sm:p-6">
                        <div className="divide-y divide-scholarly-border-soft">
                            {notifications.data.map((notification) => {
                                const Icon =
                                    icons[notification.type] ?? CheckCircle2;

                                return (
                                    <div
                                        key={notification.id}
                                        className="flex items-start gap-4 py-4 first:pt-0 last:pb-0"
                                    >
                                        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-scholarly-blue-soft text-scholarly-blue">
                                            <Icon className="size-4" />
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-bold">
                                                {notification.title}
                                            </p>
                                            {notification.body !== null && (
                                                <p className="mt-1 text-xs leading-5 text-scholarly-slate">
                                                    {notification.body}
                                                </p>
                                            )}
                                        </div>
                                        <span className="shrink-0 text-xs text-scholarly-slate-light">
                                            {relativeTime(
                                                notification.createdAt,
                                            )}
                                        </span>
                                    </div>
                                );
                            })}
                            {notifications.data.length === 0 && (
                                <p className="py-14 text-center text-sm text-scholarly-slate">
                                    You have no notifications yet. Activity will
                                    appear here as you use Scholarly.
                                </p>
                            )}
                        </div>
                        <Pagination paginator={notifications} />
                    </section>
                </div>
            </div>
        </>
    );
}

Notifications.layout = () => ({
    breadcrumbs: [{ title: 'Notifications', href: '/notifications' }],
});
