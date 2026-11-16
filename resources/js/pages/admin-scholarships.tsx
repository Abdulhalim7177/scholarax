import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    BookOpen,
    CheckCircle2,
    Clock3,
    Plus,
    Search,
} from 'lucide-react';
import { useState } from 'react';

const scholarships = [
    {
        name: 'Chevening Scholarships',
        provider: 'UK Government',
        region: 'United Kingdom',
        status: 'Live',
        deadline: '18 Nov 2026',
        updated: '2 hours ago',
    },
    {
        name: 'DAAD Development-Related Courses',
        provider: 'DAAD',
        region: 'Germany',
        status: 'Live',
        deadline: '5 Dec 2026',
        updated: 'Yesterday',
    },
    {
        name: 'Erasmus Mundus Joint Masters',
        provider: 'European Union',
        region: 'Multiple countries',
        status: 'Live',
        deadline: '14 Jan 2027',
        updated: '2 days ago',
    },
    {
        name: 'Global Futures Fellowship',
        provider: 'Northbridge Foundation',
        region: 'United States',
        status: 'Pending review',
        deadline: '1 Feb 2027',
        updated: '3 hours ago',
    },
    {
        name: 'Women in STEM Award',
        provider: 'Bright Futures Trust',
        region: 'Canada',
        status: 'Draft',
        deadline: '20 Mar 2027',
        updated: 'Last week',
    },
];

export default function AdminScholarships() {
    const [query, setQuery] = useState('');
    const [status, setStatus] = useState('All scholarships');
    const filtered = scholarships.filter(
        (item) =>
            (!query ||
                `${item.name} ${item.provider} ${item.region}`
                    .toLowerCase()
                    .includes(query.toLowerCase())) &&
            (status === 'All scholarships' || item.status === status),
    );
    return (
        <>
            <Head title="Scholarships" />
            <div className="min-h-screen bg-scholarly-blue-white p-4 text-scholarly-navy sm:p-6 lg:p-8">
                <div className="mx-auto max-w-7xl space-y-7">
                    <header className="flex flex-col gap-5 border-b border-scholarly-border pb-6 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p className="text-sm font-semibold text-scholarly-blue">
                                Opportunity catalogue
                            </p>
                            <h1 className="mt-2 font-display text-4xl tracking-[-0.03em] sm:text-5xl">
                                Scholarships
                            </h1>
                            <p className="mt-3 text-sm leading-6 text-scholarly-slate">
                                Keep opportunities accurate, current, and worth
                                a learner’s time.
                            </p>
                        </div>
                        <Link
                            href="/admin-coming-soon?feature=Add%20scholarship"
                            className="inline-flex h-11 items-center gap-2 self-start rounded-xl bg-scholarly-blue px-4 text-sm font-bold text-white hover:bg-scholarly-blue-dark lg:self-auto"
                        >
                            <Plus className="size-4" /> Add scholarship
                        </Link>
                    </header>
                    <section className="grid gap-4 sm:grid-cols-3">
                        <div className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm">
                            <BookOpen className="size-5 text-scholarly-blue" />
                            <p className="mt-5 text-3xl font-bold">386</p>
                            <p className="mt-1 text-sm font-semibold">
                                Live scholarships
                            </p>
                        </div>
                        <div className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm">
                            <CheckCircle2 className="size-5 text-scholarly-teal" />
                            <p className="mt-5 text-3xl font-bold">24</p>
                            <p className="mt-1 text-sm font-semibold">
                                Added this month
                            </p>
                        </div>
                        <div className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm">
                            <Clock3 className="size-5 text-scholarly-coral" />
                            <p className="mt-5 text-3xl font-bold">8</p>
                            <p className="mt-1 text-sm font-semibold">
                                Awaiting review
                            </p>
                        </div>
                    </section>
                    <section className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm sm:p-6">
                        <div className="flex flex-col gap-3 border-b border-scholarly-border pb-5 md:flex-row md:items-center md:justify-between">
                            <div className="flex gap-1 overflow-x-auto rounded-xl bg-scholarly-blue-white p-1">
                                {[
                                    'All scholarships',
                                    'Live',
                                    'Pending review',
                                    'Draft',
                                ].map((item) => (
                                    <button
                                        key={item}
                                        type="button"
                                        onClick={() => setStatus(item)}
                                        className={`rounded-lg px-3 py-2 text-xs font-bold whitespace-nowrap ${status === item ? 'bg-scholarly-blue text-white' : 'text-scholarly-slate'}`}
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                            <label className="relative block md:w-72">
                                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-scholarly-slate-light" />
                                <input
                                    value={query}
                                    onChange={(event) =>
                                        setQuery(event.target.value)
                                    }
                                    placeholder="Search scholarships"
                                    className="h-10 w-full rounded-lg border border-scholarly-border bg-scholarly-blue-white pl-9 text-xs outline-none focus:border-scholarly-blue"
                                />
                            </label>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[760px] text-left">
                                <thead>
                                    <tr className="border-b border-scholarly-border text-[11px] font-bold tracking-[0.12em] text-scholarly-slate uppercase">
                                        <th className="py-4">Scholarship</th>
                                        <th>Region</th>
                                        <th>Status</th>
                                        <th>Deadline</th>
                                        <th>Updated</th>
                                        <th />
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-scholarly-border-soft">
                                    {filtered.map((item) => (
                                        <tr key={item.name} className="text-sm">
                                            <td className="py-4">
                                                <p className="font-bold">
                                                    {item.name}
                                                </p>
                                                <p className="mt-1 text-xs text-scholarly-slate">
                                                    {item.provider}
                                                </p>
                                            </td>
                                            <td className="text-xs text-scholarly-slate">
                                                {item.region}
                                            </td>
                                            <td>
                                                <span
                                                    className={`rounded-full px-2.5 py-1 text-xs font-bold ${item.status === 'Live' ? 'bg-scholarly-teal-soft text-scholarly-teal-dark' : item.status === 'Pending review' ? 'bg-scholarly-gold-soft text-scholarly-gold-dark' : 'bg-scholarly-blue-soft text-scholarly-blue'}`}
                                                >
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="text-xs font-semibold">
                                                {item.deadline}
                                            </td>
                                            <td className="text-xs text-scholarly-slate">
                                                {item.updated}
                                            </td>
                                            <td className="text-right">
                                                <Link
                                                    href={`/admin-coming-soon?feature=${encodeURIComponent(`${item.name} details`)}`}
                                                    className="inline-flex items-center gap-1 text-xs font-bold text-scholarly-blue"
                                                >
                                                    Open{' '}
                                                    <ArrowRight className="size-3.5" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}

AdminScholarships.layout = () => ({
    breadcrumbs: [{ title: 'Scholarships', href: '/admin-scholarships' }],
});
