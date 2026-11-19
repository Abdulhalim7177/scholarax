import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowRight,
    Search,
    ShieldCheck,
    UserPlus,
    UsersRound,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import Pagination from '@/layouts/scholarships/pagination';
import { adminToneClasses } from '@/lib/admin-tones';
import { relativeTime } from '@/lib/format';
import type { AdminUsersProps } from '@/types/domain';

export default function AdminUsers({
    users,
    filters,
    roles,
    stats,
}: AdminUsersProps) {
    const [query, setQuery] = useState(filters.q);

    useEffect(() => {
        setQuery(filters.q);
    }, [filters.q]);

    const applyFilters = useCallback(
        (next: Partial<typeof filters>) => {
            const merged = { ...filters, ...next };

            router.get(
                '/admin-users',
                {
                    q: merged.q || undefined,
                    role: merged.role || undefined,
                },
                { preserveState: true, preserveScroll: true, replace: true },
            );
        },
        [filters],
    );

    useEffect(() => {
        if (query === filters.q) {
            return;
        }

        const timer = window.setTimeout(() => {
            applyFilters({ q: query });
        }, 350);

        return () => window.clearTimeout(timer);
    }, [applyFilters, filters.q, query]);

    return (
        <>
            <Head title="Users" />
            <div className="min-h-screen bg-scholarly-blue-white p-4 text-scholarly-navy sm:p-6 lg:p-8">
                <div className="mx-auto max-w-7xl space-y-7">
                    <header className="flex flex-col gap-5 border-b border-scholarly-border pb-6 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p className="text-sm font-semibold text-scholarly-blue">
                                Platform directory
                            </p>
                            <h1 className="mt-2 font-display text-4xl tracking-[-0.03em] sm:text-5xl">
                                Users
                            </h1>
                            <p className="mt-3 text-sm leading-6 text-scholarly-slate">
                                Manage the people who make Scholarly useful,
                                safe, and welcoming.
                            </p>
                        </div>
                        <Link
                            href="/admin-mentors?status=pending"
                            className="inline-flex h-11 items-center gap-2 self-start rounded-xl border border-scholarly-border bg-white px-4 text-sm font-bold text-scholarly-navy hover:border-scholarly-blue hover:text-scholarly-blue lg:self-auto"
                        >
                            <ShieldCheck className="size-4" /> Verification
                            queue
                        </Link>
                    </header>
                    <section className="grid gap-4 sm:grid-cols-3">
                        <div className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm">
                            <UsersRound className="size-5 text-scholarly-blue" />
                            <p className="mt-5 text-3xl font-bold">
                                {stats.total.toLocaleString()}
                            </p>
                            <p className="mt-1 text-sm font-semibold">
                                Total users
                            </p>
                        </div>
                        <div className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm">
                            <ShieldCheck className="size-5 text-scholarly-teal" />
                            <p className="mt-5 text-3xl font-bold">
                                {stats.verifiedMentors.toLocaleString()}
                            </p>
                            <p className="mt-1 text-sm font-semibold">
                                Verified mentors
                            </p>
                        </div>
                        <div className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm">
                            <UserPlus className="size-5 text-scholarly-gold-dark" />
                            <p className="mt-5 text-3xl font-bold">
                                {stats.newThisWeek.toLocaleString()}
                            </p>
                            <p className="mt-1 text-sm font-semibold">
                                New this week
                            </p>
                        </div>
                    </section>
                    <section className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm sm:p-6">
                        <div className="flex flex-col gap-3 border-b border-scholarly-border pb-5 md:flex-row md:items-center md:justify-between">
                            <div className="flex gap-1 overflow-x-auto rounded-xl bg-scholarly-blue-white p-1">
                                {roles.map((option) => (
                                    <button
                                        key={option.value || 'all'}
                                        type="button"
                                        onClick={() =>
                                            applyFilters({
                                                role: option.value,
                                            })
                                        }
                                        className={`rounded-lg px-3 py-2 text-xs font-bold whitespace-nowrap ${filters.role === option.value ? 'bg-scholarly-blue text-white' : 'text-scholarly-slate'}`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                            <label className="relative block md:w-72">
                                <span className="sr-only">Search users</span>
                                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-scholarly-slate-light" />
                                <input
                                    value={query}
                                    onChange={(event) =>
                                        setQuery(event.target.value)
                                    }
                                    placeholder="Search users"
                                    className="h-10 w-full rounded-lg border border-scholarly-border bg-scholarly-blue-white pl-9 text-xs outline-none focus:border-scholarly-blue"
                                />
                            </label>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[680px] text-left">
                                <thead>
                                    <tr className="border-b border-scholarly-border text-[11px] font-bold tracking-[0.12em] text-scholarly-slate uppercase">
                                        <th className="py-4">User</th>
                                        <th>Role</th>
                                        <th>Status</th>
                                        <th>Joined</th>
                                        <th />
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-scholarly-border-soft">
                                    {users.data.map((user) => (
                                        <tr key={user.id} className="text-sm">
                                            <td className="py-4">
                                                <div className="flex items-center gap-3">
                                                    <span
                                                        className={`flex size-10 items-center justify-center rounded-full text-xs font-bold ${adminToneClasses[user.tone]}`}
                                                    >
                                                        {user.initials}
                                                    </span>
                                                    <span>
                                                        <span className="block font-bold">
                                                            {user.name}
                                                        </span>
                                                        <span className="mt-1 block text-xs text-scholarly-slate">
                                                            {user.email}
                                                        </span>
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="rounded-full bg-scholarly-blue-soft px-2.5 py-1 text-xs font-semibold text-scholarly-blue">
                                                    {user.roleLabel}
                                                </span>
                                            </td>
                                            <td>
                                                <span
                                                    className={`text-xs font-bold ${user.status === 'active' ? 'text-scholarly-teal-dark' : 'text-scholarly-gold-dark'}`}
                                                >
                                                    {user.status === 'active'
                                                        ? 'Active'
                                                        : 'Pending'}
                                                </span>
                                            </td>
                                            <td className="text-xs text-scholarly-slate">
                                                {relativeTime(user.joinedAt)}
                                            </td>
                                            <td className="text-right">
                                                {user.mentorProfileId !==
                                                    null && (
                                                    <Link
                                                        href={`/admin-mentors?q=${encodeURIComponent(user.name)}`}
                                                        className="inline-flex items-center gap-1 text-xs font-bold text-scholarly-blue"
                                                    >
                                                        Mentor profile{' '}
                                                        <ArrowRight className="size-3.5" />
                                                    </Link>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {users.data.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="py-14 text-center text-sm text-scholarly-slate"
                                            >
                                                No users match these filters
                                                yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <Pagination paginator={users} />
                    </section>
                </div>
            </div>
        </>
    );
}

AdminUsers.layout = () => ({
    breadcrumbs: [{ title: 'Users', href: '/admin-users' }],
});
