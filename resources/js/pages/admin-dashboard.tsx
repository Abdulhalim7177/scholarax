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
} from 'lucide-react';

const recentUsers = [
    {
        name: 'Amina Yusuf',
        type: 'Student',
        joined: '8 min ago',
        initials: 'AY',
        tone: 'coral',
    },
    {
        name: 'Dr. Maya Chen',
        type: 'Mentor',
        joined: '32 min ago',
        initials: 'MC',
        tone: 'blue',
    },
    {
        name: 'David Mensah',
        type: 'Student',
        joined: '1 hour ago',
        initials: 'DM',
        tone: 'teal',
    },
    {
        name: 'James Okafor',
        type: 'Mentor',
        joined: '3 hours ago',
        initials: 'JO',
        tone: 'gold',
    },
];

const moderationItems = [
    {
        label: 'Scholarship submissions',
        count: '8 pending',
        note: 'New opportunities waiting for review',
        icon: BookOpen,
        tone: 'blue',
    },
    {
        label: 'Mentor applications',
        count: '3 pending',
        note: 'Profiles awaiting verification',
        icon: UsersRound,
        tone: 'teal',
    },
    {
        label: 'Reported content',
        count: '2 open',
        note: 'Reports need an admin decision',
        icon: Flag,
        tone: 'coral',
    },
];

export default function AdminDashboard() {
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
                            href="/admin-coming-soon?feature=Platform%20reports"
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
                                2,481
                            </p>
                            <p className="mt-1 text-sm font-semibold">
                                Total users
                            </p>
                            <p className="mt-1 text-xs text-scholarly-teal-dark">
                                +14.8% this month
                            </p>
                        </div>
                        <div className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm">
                            <div className="mb-5 flex size-10 items-center justify-center rounded-xl bg-scholarly-teal-soft text-scholarly-teal-dark">
                                <BookOpen className="size-5" />
                            </div>
                            <p className="text-3xl font-bold tracking-[-0.04em]">
                                386
                            </p>
                            <p className="mt-1 text-sm font-semibold">
                                Live scholarships
                            </p>
                            <p className="mt-1 text-xs text-scholarly-slate">
                                24 added this month
                            </p>
                        </div>
                        <div className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm">
                            <div className="mb-5 flex size-10 items-center justify-center rounded-xl bg-scholarly-gold-soft text-scholarly-gold-dark">
                                <FileCheck2 className="size-5" />
                            </div>
                            <p className="text-3xl font-bold tracking-[-0.04em]">
                                1,204
                            </p>
                            <p className="mt-1 text-sm font-semibold">
                                Applications tracked
                            </p>
                            <p className="mt-1 text-xs text-scholarly-slate">
                                Across all learners
                            </p>
                        </div>
                        <div className="rounded-2xl border border-scholarly-border bg-scholarly-navy p-5 text-white shadow-sm">
                            <div className="mb-5 flex size-10 items-center justify-center rounded-xl bg-white/10 text-scholarly-gold">
                                <Activity className="size-5" />
                            </div>
                            <p className="text-3xl font-bold tracking-[-0.04em]">
                                99.8%
                            </p>
                            <p className="mt-1 text-sm font-semibold">
                                Platform health
                            </p>
                            <p className="mt-1 text-xs text-white/60">
                                All systems operational
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
                                    13 open tasks
                                </span>
                            </div>
                            <div className="mt-5 divide-y divide-scholarly-border-soft">
                                {moderationItems.map((item) => (
                                    <Link
                                        key={item.label}
                                        href={`/admin-coming-soon?feature=${encodeURIComponent(item.label)}`}
                                        className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
                                    >
                                        <span
                                            className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${item.tone === 'coral' ? 'bg-scholarly-coral-soft text-scholarly-coral-dark' : item.tone === 'teal' ? 'bg-scholarly-teal-soft text-scholarly-teal-dark' : 'bg-scholarly-blue-soft text-scholarly-blue'}`}
                                        >
                                            <item.icon className="size-5" />
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
                                                {item.count}
                                            </span>
                                            <ArrowRight className="mt-2 ml-auto size-4 text-scholarly-slate-light" />
                                        </span>
                                    </Link>
                                ))}
                            </div>
                            <Link
                                href="/admin-coming-soon?feature=Moderation%20center"
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
                                {[
                                    'Web application',
                                    'Scholarship search',
                                    'Mentor messaging',
                                    'Document storage',
                                ].map((service) => (
                                    <div
                                        key={service}
                                        className="flex items-center justify-between rounded-lg bg-scholarly-blue-white p-3"
                                    >
                                        <span className="text-xs font-semibold">
                                            {service}
                                        </span>
                                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-scholarly-teal-dark">
                                            <span className="size-2 rounded-full bg-scholarly-teal" />{' '}
                                            Operational
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <p className="mt-5 flex items-center gap-2 text-xs text-scholarly-slate">
                                <Clock3 className="size-3.5" /> Last checked
                                just now
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
                                href="/admin-coming-soon?feature=All%20users"
                                className="text-sm font-bold text-scholarly-blue"
                            >
                                View all
                            </Link>
                        </div>
                        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                            {recentUsers.map((user) => (
                                <div
                                    key={user.name}
                                    className="flex items-center gap-3 rounded-xl bg-scholarly-blue-white p-3"
                                >
                                    <span
                                        className={`flex size-10 items-center justify-center rounded-full text-xs font-bold ${user.tone === 'coral' ? 'bg-scholarly-coral-soft text-scholarly-coral-dark' : user.tone === 'teal' ? 'bg-scholarly-teal-soft text-scholarly-teal-dark' : user.tone === 'gold' ? 'bg-scholarly-gold-soft text-scholarly-gold-dark' : 'bg-scholarly-blue-soft text-scholarly-blue'}`}
                                    >
                                        {user.initials}
                                    </span>
                                    <span className="min-w-0 flex-1">
                                        <span className="block truncate text-sm font-bold">
                                            {user.name}
                                        </span>
                                        <span className="mt-1 block text-xs text-scholarly-slate">
                                            {user.type} · {user.joined}
                                        </span>
                                    </span>
                                    <UserPlus className="size-4 text-scholarly-slate-light" />
                                </div>
                            ))}
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
