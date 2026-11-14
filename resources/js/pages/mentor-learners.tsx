import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    MessageCircle,
    Search,
    TrendingUp,
    UsersRound,
} from 'lucide-react';
import { useState } from 'react';

const learners = [
    {
        name: 'Amina Yusuf',
        initials: 'AY',
        goal: 'Chevening Scholarship',
        progress: 68,
        next: 'Review personal statement',
        status: 'Active',
        tone: 'coral',
    },
    {
        name: 'David Mensah',
        initials: 'DM',
        goal: 'DAAD Development Scholarship',
        progress: 84,
        next: 'Review academic CV',
        status: 'Active',
        tone: 'blue',
    },
    {
        name: 'Lucia Rossi',
        initials: 'LR',
        goal: 'Erasmus Mundus Joint Masters',
        progress: 52,
        next: 'Discuss programme shortlist',
        status: 'Active',
        tone: 'teal',
    },
    {
        name: 'Sam Okoro',
        initials: 'SO',
        goal: 'Commonwealth Scholarship',
        progress: 35,
        next: 'Set application goals',
        status: 'Needs a check-in',
        tone: 'gold',
    },
    {
        name: 'Nadia Rahman',
        initials: 'NR',
        goal: 'Fulbright Foreign Student Program',
        progress: 91,
        next: 'Practice interview answers',
        status: 'Active',
        tone: 'blue',
    },
    {
        name: 'Jon Bell',
        initials: 'JB',
        goal: 'Rhodes Scholarship',
        progress: 24,
        next: 'Complete profile',
        status: 'New learner',
        tone: 'teal',
    },
];

export default function MentorLearners() {
    const [query, setQuery] = useState('');
    const filtered = learners.filter((learner) =>
        `${learner.name} ${learner.goal}`
            .toLowerCase()
            .includes(query.toLowerCase()),
    );
    return (
        <>
            <Head title="My learners" />
            <div className="min-h-screen bg-scholarly-blue-white p-4 text-scholarly-navy sm:p-6 lg:p-8">
                <div className="mx-auto max-w-7xl space-y-7">
                    <header className="flex flex-col gap-5 border-b border-scholarly-border pb-6 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p className="text-sm font-semibold text-scholarly-blue">
                                People you’re guiding
                            </p>
                            <h1 className="mt-2 font-display text-4xl tracking-[-0.03em] sm:text-5xl">
                                My learners
                            </h1>
                            <p className="mt-3 max-w-2xl text-sm leading-6 text-scholarly-slate">
                                See where each learner is in their journey and
                                offer the right nudge at the right time.
                            </p>
                        </div>
                        <label className="relative block lg:w-72">
                            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-scholarly-slate-light" />
                            <input
                                value={query}
                                onChange={(event) =>
                                    setQuery(event.target.value)
                                }
                                placeholder="Search your learners"
                                className="h-11 w-full rounded-xl border border-scholarly-border bg-white pr-3 pl-9 text-sm outline-none focus:border-scholarly-blue"
                            />
                        </label>
                    </header>
                    <section className="grid gap-4 sm:grid-cols-3">
                        <div className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm">
                            <UsersRound className="size-5 text-scholarly-blue" />
                            <p className="mt-5 text-3xl font-bold">12</p>
                            <p className="mt-1 text-sm font-semibold">
                                Active learners
                            </p>
                        </div>
                        <div className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm">
                            <TrendingUp className="size-5 text-scholarly-teal" />
                            <p className="mt-5 text-3xl font-bold">76%</p>
                            <p className="mt-1 text-sm font-semibold">
                                Average progress
                            </p>
                        </div>
                        <div className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm">
                            <MessageCircle className="size-5 text-scholarly-coral" />
                            <p className="mt-5 text-3xl font-bold">3</p>
                            <p className="mt-1 text-sm font-semibold">
                                Unread messages
                            </p>
                        </div>
                    </section>
                    <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {filtered.map((learner) => (
                            <article
                                key={learner.name}
                                className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`flex size-11 items-center justify-center rounded-xl text-xs font-bold ${learner.tone === 'coral' ? 'bg-scholarly-coral-soft text-scholarly-coral-dark' : learner.tone === 'gold' ? 'bg-scholarly-gold-soft text-scholarly-gold-dark' : learner.tone === 'teal' ? 'bg-scholarly-teal-soft text-scholarly-teal-dark' : 'bg-scholarly-blue-soft text-scholarly-blue'}`}
                                        >
                                            {learner.initials}
                                        </div>
                                        <div>
                                            <h2 className="font-bold">
                                                {learner.name}
                                            </h2>
                                            <p className="mt-1 text-xs text-scholarly-slate">
                                                {learner.status}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        aria-label={`Message ${learner.name}`}
                                        className="rounded-lg p-2 text-scholarly-slate hover:bg-scholarly-blue-soft hover:text-scholarly-blue"
                                    >
                                        <MessageCircle className="size-4" />
                                    </button>
                                </div>
                                <p className="mt-5 text-sm font-semibold text-scholarly-navy">
                                    {learner.goal}
                                </p>
                                <div className="mt-4 flex items-center justify-between text-xs">
                                    <span className="text-scholarly-slate">
                                        Journey progress
                                    </span>
                                    <strong>{learner.progress}%</strong>
                                </div>
                                <div className="mt-2 h-2 rounded-full bg-scholarly-blue-white">
                                    <div
                                        className="h-full rounded-full bg-scholarly-blue"
                                        style={{
                                            width: `${learner.progress}%`,
                                        }}
                                    />
                                </div>
                                <p className="mt-4 text-xs text-scholarly-slate">
                                    Next:{' '}
                                    <strong className="text-scholarly-navy">
                                        {learner.next}
                                    </strong>
                                </p>
                                <Link
                                    href={`/mentor-coming-soon?feature=${encodeURIComponent(`${learner.name} profile`)}`}
                                    className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-scholarly-blue"
                                >
                                    View learner profile{' '}
                                    <ArrowRight className="size-3.5" />
                                </Link>
                            </article>
                        ))}
                    </section>
                </div>
            </div>
        </>
    );
}

MentorLearners.layout = () => ({
    breadcrumbs: [{ title: 'My learners', href: '/mentor-learners' }],
});
