import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    MoreHorizontal,
    Search,
    ShieldCheck,
    UserPlus,
    UsersRound,
} from 'lucide-react';
import { useState } from 'react';

const users = [
    {
        name: 'Amina Yusuf',
        email: 'amina@example.com',
        role: 'Student',
        status: 'Active',
        joined: 'Today',
        initials: 'AY',
        tone: 'coral',
    },
    {
        name: 'Dr. Maya Chen',
        email: 'maya@example.com',
        role: 'Mentor',
        status: 'Active',
        joined: 'Today',
        initials: 'MC',
        tone: 'blue',
    },
    {
        name: 'David Mensah',
        email: 'david@example.com',
        role: 'Student',
        status: 'Active',
        joined: 'Yesterday',
        initials: 'DM',
        tone: 'teal',
    },
    {
        name: 'James Okafor',
        email: 'james@example.com',
        role: 'Mentor',
        status: 'Pending review',
        joined: 'Yesterday',
        initials: 'JO',
        tone: 'gold',
    },
    {
        name: 'Lucia Rossi',
        email: 'lucia@example.com',
        role: 'Student',
        status: 'Active',
        joined: '2 days ago',
        initials: 'LR',
        tone: 'blue',
    },
];

export default function AdminUsers() {
    const [query, setQuery] = useState('');
    const [role, setRole] = useState('All users');
    const filtered = users.filter(
        (user) =>
            (!query ||
                `${user.name} ${user.email}`
                    .toLowerCase()
                    .includes(query.toLowerCase())) &&
            (role === 'All users' || user.role === role),
    );
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
                            href="/admin-coming-soon?feature=Invite%20user"
                            className="inline-flex h-11 items-center gap-2 self-start rounded-xl bg-scholarly-blue px-4 text-sm font-bold text-white hover:bg-scholarly-blue-dark lg:self-auto"
                        >
                            <UserPlus className="size-4" /> Invite user
                        </Link>
                    </header>
                    <section className="grid gap-4 sm:grid-cols-3">
                        <div className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm">
                            <UsersRound className="size-5 text-scholarly-blue" />
                            <p className="mt-5 text-3xl font-bold">2,481</p>
                            <p className="mt-1 text-sm font-semibold">
                                Total users
                            </p>
                        </div>
                        <div className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm">
                            <ShieldCheck className="size-5 text-scholarly-teal" />
                            <p className="mt-5 text-3xl font-bold">142</p>
                            <p className="mt-1 text-sm font-semibold">
                                Verified mentors
                            </p>
                        </div>
                        <div className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm">
                            <UserPlus className="size-5 text-scholarly-gold-dark" />
                            <p className="mt-5 text-3xl font-bold">18</p>
                            <p className="mt-1 text-sm font-semibold">
                                New this week
                            </p>
                        </div>
                    </section>
                    <section className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm sm:p-6">
                        <div className="flex flex-col gap-3 border-b border-scholarly-border pb-5 md:flex-row md:items-center md:justify-between">
                            <div className="flex gap-1 rounded-xl bg-scholarly-blue-white p-1">
                                {['All users', 'Student', 'Mentor'].map(
                                    (item) => (
                                        <button
                                            key={item}
                                            type="button"
                                            onClick={() => setRole(item)}
                                            className={`rounded-lg px-3 py-2 text-xs font-bold ${role === item ? 'bg-scholarly-blue text-white' : 'text-scholarly-slate'}`}
                                        >
                                            {item}
                                        </button>
                                    ),
                                )}
                            </div>
                            <label className="relative block md:w-72">
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
                                    {filtered.map((user) => (
                                        <tr
                                            key={user.email}
                                            className="text-sm"
                                        >
                                            <td className="py-4">
                                                <div className="flex items-center gap-3">
                                                    <span
                                                        className={`flex size-10 items-center justify-center rounded-full text-xs font-bold ${user.tone === 'coral' ? 'bg-scholarly-coral-soft text-scholarly-coral-dark' : user.tone === 'teal' ? 'bg-scholarly-teal-soft text-scholarly-teal-dark' : user.tone === 'gold' ? 'bg-scholarly-gold-soft text-scholarly-gold-dark' : 'bg-scholarly-blue-soft text-scholarly-blue'}`}
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
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td>
                                                <span
                                                    className={`text-xs font-bold ${user.status === 'Active' ? 'text-scholarly-teal-dark' : 'text-scholarly-gold-dark'}`}
                                                >
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td className="text-xs text-scholarly-slate">
                                                {user.joined}
                                            </td>
                                            <td className="text-right">
                                                <Link
                                                    href={`/admin-coming-soon?feature=${encodeURIComponent(`${user.name} account`)}`}
                                                    className="inline-flex rounded-lg p-2 text-scholarly-slate hover:bg-scholarly-blue-soft hover:text-scholarly-blue"
                                                >
                                                    <MoreHorizontal className="size-4" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <Link
                            href="/admin-coming-soon?feature=User%20directory"
                            className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-scholarly-blue"
                        >
                            Open full directory{' '}
                            <ArrowRight className="size-4" />
                        </Link>
                    </section>
                </div>
            </div>
        </>
    );
}

AdminUsers.layout = () => ({
    breadcrumbs: [{ title: 'Users', href: '/admin-users' }],
});
