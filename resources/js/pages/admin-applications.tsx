import { Head, Link } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowRight,
    CheckCircle2,
    Clock3,
    FileCheck2,
    Search,
} from 'lucide-react';
import { useState } from 'react';

const applications = [
    {
        learner: 'Amina Yusuf',
        scholarship: 'Chevening Scholarships',
        stage: 'Draft',
        submitted: '2 hours ago',
        risk: 'Normal',
        initials: 'AY',
    },
    {
        learner: 'David Mensah',
        scholarship: 'DAAD Development Courses',
        stage: 'Submitted',
        submitted: 'Yesterday',
        risk: 'Normal',
        initials: 'DM',
    },
    {
        learner: 'Lucia Rossi',
        scholarship: 'Erasmus Mundus Joint Masters',
        stage: 'Under review',
        submitted: '2 days ago',
        risk: 'Needs check',
        initials: 'LR',
    },
    {
        learner: 'Sam Okoro',
        scholarship: 'Commonwealth Scholarship',
        stage: 'Submitted',
        submitted: '3 days ago',
        risk: 'Normal',
        initials: 'SO',
    },
];

export default function AdminApplications() {
    const [stage, setStage] = useState('All applications');
    const [query, setQuery] = useState('');
    const filtered = applications.filter(
        (application) =>
            (!query ||
                `${application.learner} ${application.scholarship}`
                    .toLowerCase()
                    .includes(query.toLowerCase())) &&
            (stage === 'All applications' || application.stage === stage),
    );
    return (
        <>
            <Head title="Applications" />
            <div className="min-h-screen bg-scholarly-blue-white p-4 text-scholarly-navy sm:p-6 lg:p-8">
                <div className="mx-auto max-w-7xl space-y-7">
                    <header>
                        <p className="text-sm font-semibold text-scholarly-blue">
                            Platform activity
                        </p>
                        <h1 className="mt-2 font-display text-4xl tracking-[-0.03em] sm:text-5xl">
                            Applications
                        </h1>
                        <p className="mt-3 max-w-2xl text-sm leading-6 text-scholarly-slate">
                            Monitor application flow and surface anything that
                            needs an admin decision.
                        </p>
                    </header>
                    <section className="grid gap-4 sm:grid-cols-3">
                        <div className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm">
                            <FileCheck2 className="size-5 text-scholarly-blue" />
                            <p className="mt-5 text-3xl font-bold">1,204</p>
                            <p className="mt-1 text-sm font-semibold">
                                Tracked applications
                            </p>
                        </div>
                        <div className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm">
                            <Clock3 className="size-5 text-scholarly-gold-dark" />
                            <p className="mt-5 text-3xl font-bold">46</p>
                            <p className="mt-1 text-sm font-semibold">
                                Submitted this week
                            </p>
                        </div>
                        <div className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm">
                            <AlertTriangle className="size-5 text-scholarly-coral-dark" />
                            <p className="mt-5 text-3xl font-bold">2</p>
                            <p className="mt-1 text-sm font-semibold">
                                Need a closer look
                            </p>
                        </div>
                    </section>
                    <section className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm sm:p-6">
                        <div className="flex flex-col gap-3 border-b border-scholarly-border pb-5 md:flex-row md:items-center md:justify-between">
                            <div className="flex gap-1 overflow-x-auto rounded-xl bg-scholarly-blue-white p-1">
                                {[
                                    'All applications',
                                    'Draft',
                                    'Submitted',
                                    'Under review',
                                ].map((item) => (
                                    <button
                                        key={item}
                                        type="button"
                                        onClick={() => setStage(item)}
                                        className={`rounded-lg px-3 py-2 text-xs font-bold whitespace-nowrap ${stage === item ? 'bg-scholarly-blue text-white' : 'text-scholarly-slate'}`}
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
                                    placeholder="Search applications"
                                    className="h-10 w-full rounded-lg border border-scholarly-border bg-scholarly-blue-white pl-9 text-xs outline-none focus:border-scholarly-blue"
                                />
                            </label>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[720px] text-left">
                                <thead>
                                    <tr className="border-b border-scholarly-border text-[11px] font-bold tracking-[0.12em] text-scholarly-slate uppercase">
                                        <th className="py-4">Learner</th>
                                        <th>Scholarship</th>
                                        <th>Stage</th>
                                        <th>Submitted</th>
                                        <th>Signal</th>
                                        <th />
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-scholarly-border-soft">
                                    {filtered.map((item) => (
                                        <tr
                                            key={`${item.learner}-${item.scholarship}`}
                                            className="text-sm"
                                        >
                                            <td className="py-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="flex size-9 items-center justify-center rounded-full bg-scholarly-blue-soft text-xs font-bold text-scholarly-blue">
                                                        {item.initials}
                                                    </span>
                                                    <span className="font-bold">
                                                        {item.learner}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="text-xs text-scholarly-slate">
                                                {item.scholarship}
                                            </td>
                                            <td>
                                                <span className="rounded-full bg-scholarly-blue-soft px-2.5 py-1 text-xs font-bold text-scholarly-blue">
                                                    {item.stage}
                                                </span>
                                            </td>
                                            <td className="text-xs text-scholarly-slate">
                                                {item.submitted}
                                            </td>
                                            <td>
                                                <span
                                                    className={`inline-flex items-center gap-1.5 text-xs font-bold ${item.risk === 'Normal' ? 'text-scholarly-teal-dark' : 'text-scholarly-coral-dark'}`}
                                                >
                                                    {item.risk === 'Normal' ? (
                                                        <CheckCircle2 className="size-3.5" />
                                                    ) : (
                                                        <AlertTriangle className="size-3.5" />
                                                    )}
                                                    {item.risk}
                                                </span>
                                            </td>
                                            <td className="text-right">
                                                <Link
                                                    href={`/admin-coming-soon?feature=${encodeURIComponent(`${item.learner} application`)}`}
                                                    className="inline-flex items-center gap-1 text-xs font-bold text-scholarly-blue"
                                                >
                                                    Inspect{' '}
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

AdminApplications.layout = () => ({
    breadcrumbs: [{ title: 'Applications', href: '/admin-applications' }],
});
