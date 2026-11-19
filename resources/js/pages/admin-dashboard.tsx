import { Head, Link } from '@inertiajs/react';
import {
    Activity,
    ArrowRight,
    BookOpen,
    CheckCircle2,
    Clock3,
    FileCheck2,
    Flag,
    ShieldCheck,
    UserPlus,
    UsersRound,
    XCircle,
} from 'lucide-react';
import type { ComponentType } from 'react';

import { adminToneClasses } from '@/lib/admin-tones';
import { relativeTime } from '@/lib/format';
import type { AdminDashboardProps } from '@/types/domain';

const moderationIcons: Record<string, ComponentType<{ className?: string }>> = {
    scholarships: BookOpen,
    mentors: UsersRound,
    reports: Flag,
};

export default function AdminDashboard({
    stats,
    moderation,
    recentUsers,
    checks,
    checkedAt,
}: AdminDashboardProps) {
    const growthLabel = (value: number) =>
        `${value > 0 ? '+' : ''}${value.toFixed(1)}% this month`;

    return (
        <>
            <Head title="Admin dashboard" />
            <div className="min-h-screen bg-scholarly-blue-white p-4 text-scholarly-navy sm:p-6 lg:p-8">
                <div className="mx-auto max-w-7xl space-y-7">
                    <header className="flex flex-col gap-5 border-b border-scholarly-border pb-6 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-scholarly-blue">
                                <ShieldCheck className="size-4" /> Platform
                                operations
                            </p>
                            <h1 className="font-display text-4xl tracking-[-0.03em] sm:text-5xl">
                                Admin overview
                            </h1>
                            <p className="mt-3 max-w-2xl text-sm leading-6 text-scholarly-slate sm:text-base">
                                Keep Scholarly healthy, useful, and safe for
                                every student and mentor who depends on it.
                            </p>
                        </div>
                        <Link
                            href="/admin-reports"
                            className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-xl border border-scholarly-border bg-white px-4 text-sm font-bold text-scholarly-navy hover:border-scholarly-blue hover:text-scholarly-blue lg:self-auto"
                        >
                            View platform report{' '}
                            <ArrowRight className="size-4" />
                        </Link>
                    </header>
                    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <div className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm">
                            <div className="mb-5 flex size-10 items-center justify-center rounded-xl bg-scholarly-blue-soft text-scholarly-blue">
                                <UsersRound className="size-5" />
                            </div>
                            <p className="text-3xl font-bold tracking-[-0.04em]">
                                {stats.totalUsers.toLocaleString()}
                            </p>
                            <p className="mt-1 text-sm font-semibold">
                                Total users
                            </p>
                            <p className="mt-1 text-xs text-scholarly-teal-dark">
                                {growthLabel(stats.usersGrowth)}
                            </p>
                        </div>
                        <div className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm">
                            <div className="mb-5 flex size-10 items-center justify-center rounded-xl bg-scholarly-teal-soft text-scholarly-teal-dark">
                                <BookOpen className="size-5" />
                            </div>
                            <p className="text-3xl font-bold tracking-[-0.04em]">
                                {stats.liveScholarships.toLocaleString()}
                            </p>
                            <p className="mt-1 text-sm font-semibold">
                                Live scholarships
                            </p>
                            <p className="mt-1 text-xs text-scholarly-slate">
                                {stats.scholarshipsThisMonth} added this month
                            </p>
                        </div>
                        <div className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm">
                            <div className="mb-5 flex size-10 items-center justify-center rounded-xl bg-scholarly-gold-soft text-scholarly-gold-dark">
                                <FileCheck2 className="size-5" />
                            </div>
                            <p className="text-3xl font-bold tracking-[-0.04em]">
                                {stats.applicationsTracked.toLocaleString()}
                            </p>
                            <p className="mt-1 text-sm font-semibold">
                                Applications tracked
                            </p>
                            <p className="mt-1 text-xs text-scholarly-slate">
                                {stats.submittedThisWeek} submitted this week
                            </p>
                        </div>
                        <div className="rounded-2xl border border-scholarly-border bg-scholarly-navy p-5 text-white shadow-sm">
                            <div className="mb-5 flex size-10 items-center justify-center rounded-xl bg-white/10 text-scholarly-gold">
                                <Activity className="size-5" />
                            </div>
                            <p className="text-3xl font-bold tracking-[-0.04em]">
                                {stats.activeMentorships.toLocaleString()}
                            </p>
                            <p className="mt-1 text-sm font-semibold">
                                Active mentorships
                            </p>
                            <p className="mt-1 text-xs text-white/60">
                                {stats.verifiedMentors} verified mentors
                            </p>
                        </div>
                    </section>
                    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.65fr)]">
                        <section className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm sm:p-6">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h2 className="text-xl font-bold">
                                        Needs your attention
                                    </h2>
                                    <p className="mt-1 text-sm text-scholarly-slate">
                                        Keep the platform moving with a few
                                        focused checks.
                                    </p>
                                </div>
                                <span className="rounded-full bg-scholarly-coral-soft px-3 py-1.5 text-xs font-bold text-scholarly-coral-dark">
                                    {moderation.openTasks} open tasks
                                </span>
                            </div>
                            <div className="mt-5 divide-y divide-scholarly-border-soft">
                                {moderation.items.map((item) => {
                                    const Icon =
                                        moderationIcons[item.key] ?? Flag;

                                    return (
                                        <Link
                                            key={item.key}
                                            href={item.href}
                                            className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
                                        >
                                            <span
                                                className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${adminToneClasses[item.tone]}`}
                                            >
                                                <Icon className="size-5" />
                                            </span>
                                            <span className="min-w-0 flex-1">
                                                <span className="block text-sm font-bold">
                                                    {item.label}
                                                </span>
                                                <span className="mt-1 block text-xs text-scholarly-slate">
                                                    {item.note}
                                                </span>
                                            </span>
                                            <span className="text-right">
                                                <span className="block text-xs font-bold text-scholarly-coral-dark">
                                                    {item.count} pending
                                                </span>
                                                <ArrowRight className="mt-2 ml-auto size-4 text-scholarly-slate-light" />
                                            </span>
                                        </Link>
                                    );
                                })}
                            </div>
                            <Link
                                href="/admin-moderation"
                                className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-scholarly-blue"
                            >
                                Open moderation center{' '}
                                <ArrowRight className="size-4" />
                            </Link>
                        </section>
                        <section className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm sm:p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold">
                                        System status
                                    </h2>
                                    <p className="mt-1 text-sm text-scholarly-slate">
                                        Live platform checks.
                                    </p>
                                </div>
                                <CheckCircle2 className="size-5 text-scholarly-teal" />
                            </div>
                            <div className="mt-5 space-y-4">
                                {checks.map((check) => (
                                    <div
                                        key={check.label}
                                        className="flex items-center justify-between rounded-lg bg-scholarly-blue-white p-3"
                                    >
                                        <span className="text-xs font-semibold">
                                            {check.label}
                                        </span>
                                        <span
                                            className={`inline-flex items-center gap-1.5 text-[11px] font-bold ${check.ok ? 'text-scholarly-teal-dark' : 'text-scholarly-coral-dark'}`}
                                        >
                                            {check.ok ? (
                                                <CheckCircle2 className="size-3.5" />
                                            ) : (
                                                <XCircle className="size-3.5" />
                                            )}
                                            {check.note}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <p className="mt-5 flex items-center gap-2 text-xs text-scholarly-slate">
                                <Clock3 className="size-3.5" /> Last checked{' '}
                                {relativeTime(checkedAt)}
                            </p>
                        </section>
                    </div>
                    <section className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm sm:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold">
                                    Recent registrations
                                </h2>
                                <p className="mt-1 text-sm text-scholarly-slate">
                                    The latest people joining Scholarly.
                                </p>
                            </div>
                            <Link
                                href="/admin-users"
                                className="text-sm font-bold text-scholarly-blue"
                            >
                                View all
                            </Link>
                        </div>
                        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                            {recentUsers.map((user) => (
                                <div
                                    key={user.id}
                                    className="flex items-center gap-3 rounded-xl bg-scholarly-blue-white p-3"
                                >
                                    <span
                                        className={`flex size-10 items-center justify-center rounded-full text-xs font-bold ${adminToneClasses[user.tone]}`}
                                    >
                                        {user.initials}
                                    </span>
                                    <span className="min-w-0 flex-1">
                                        <span className="block truncate text-sm font-bold">
                                            {user.name}
                                        </span>
                                        <span className="mt-1 block text-xs text-scholarly-slate">
                                            {user.roleLabel} ·{' '}
                                            {relativeTime(user.joinedAt)}
                                        </span>
                                    </span>
                                    <UserPlus className="size-4 text-scholarly-slate-light" />
                                </div>
                            ))}
                            {recentUsers.length === 0 && (
                                <p className="text-sm text-scholarly-slate">
                                    No registrations yet.
                                </p>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}

AdminDashboard.layout = () => ({
    breadcrumbs: [{ title: 'Admin overview', href: '/admin-dashboard' }],
});
