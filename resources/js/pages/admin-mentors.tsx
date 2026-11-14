import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    Clock3,
    Search,
    ShieldCheck,
    Star,
    UserCheck,
} from 'lucide-react';
import { useState } from 'react';

const mentors = [
    {
        name: 'Dr. Maya Chen',
        specialty: 'Graduate admissions',
        status: 'Verified',
        rating: '4.9',
        learners: 12,
        initials: 'MC',
        tone: 'blue',
    },
    {
        name: 'James Okafor',
        specialty: 'Scholarship strategy',
        status: 'Pending verification',
        rating: '—',
        learners: 0,
        initials: 'JO',
        tone: 'gold',
    },
    {
        name: 'Sofia Martinez',
        specialty: 'Personal statements',
        status: 'Verified',
        rating: '5.0',
        learners: 8,
        initials: 'SM',
        tone: 'coral',
    },
    {
        name: 'Leila Haddad',
        specialty: 'Research proposals',
        status: 'Verified',
        rating: '4.9',
        learners: 10,
        initials: 'LH',
        tone: 'teal',
    },
];

export default function AdminMentors() {
    const [query, setQuery] = useState('');
    const filtered = mentors.filter((mentor) =>
        `${mentor.name} ${mentor.specialty}`
            .toLowerCase()
            .includes(query.toLowerCase()),
    );
    return (
        <>
            <Head title="Mentors" />
            <div className="min-h-screen bg-scholarly-blue-white p-4 text-scholarly-navy sm:p-6 lg:p-8">
                <div className="mx-auto max-w-7xl space-y-7">
                    <header className="flex flex-col gap-5 border-b border-scholarly-border pb-6 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p className="text-sm font-semibold text-scholarly-blue">
                                People giving guidance
                            </p>
                            <h1 className="mt-2 font-display text-4xl tracking-[-0.03em] sm:text-5xl">
                                Mentors
                            </h1>
                            <p className="mt-3 text-sm leading-6 text-scholarly-slate">
                                Verify expertise, support quality, and help
                                learners find the right person.
                            </p>
                        </div>
                        <Link
                            href="/admin-coming-soon?feature=Mentor%20verification"
                            className="inline-flex h-11 items-center gap-2 self-start rounded-xl bg-scholarly-blue px-4 text-sm font-bold text-white hover:bg-scholarly-blue-dark lg:self-auto"
                        >
                            <ShieldCheck className="size-4" /> Verification
                            queue
                        </Link>
                    </header>
                    <section className="grid gap-4 sm:grid-cols-3">
                        <div className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm">
                            <UserCheck className="size-5 text-scholarly-teal" />
                            <p className="mt-5 text-3xl font-bold">142</p>
                            <p className="mt-1 text-sm font-semibold">
                                Verified mentors
                            </p>
                        </div>
                        <div className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm">
                            <Clock3 className="size-5 text-scholarly-gold-dark" />
                            <p className="mt-5 text-3xl font-bold">3</p>
                            <p className="mt-1 text-sm font-semibold">
                                Awaiting verification
                            </p>
                        </div>
                        <div className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm">
                            <Star className="size-5 fill-scholarly-gold text-scholarly-gold" />
                            <p className="mt-5 text-3xl font-bold">4.9</p>
                            <p className="mt-1 text-sm font-semibold">
                                Average mentor rating
                            </p>
                        </div>
                    </section>
                    <section className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm sm:p-6">
                        <div className="flex items-center justify-between border-b border-scholarly-border pb-5">
                            <div>
                                <h2 className="text-xl font-bold">
                                    Mentor directory
                                </h2>
                                <p className="mt-1 text-sm text-scholarly-slate">
                                    A quick view of the people supporting
                                    learners.
                                </p>
                            </div>
                            <label className="relative hidden md:block md:w-64">
                                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-scholarly-slate-light" />
                                <input
                                    value={query}
                                    onChange={(event) =>
                                        setQuery(event.target.value)
                                    }
                                    placeholder="Search mentors"
                                    className="h-10 w-full rounded-lg border border-scholarly-border bg-scholarly-blue-white pl-9 text-xs outline-none focus:border-scholarly-blue"
                                />
                            </label>
                        </div>
                        <div className="mt-4 divide-y divide-scholarly-border-soft">
                            {filtered.map((mentor) => (
                                <div
                                    key={mentor.name}
                                    className="flex flex-col gap-4 py-4 first:pt-0 sm:flex-row sm:items-center"
                                >
                                    <span
                                        className={`flex size-11 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${mentor.tone === 'coral' ? 'bg-scholarly-coral-soft text-scholarly-coral-dark' : mentor.tone === 'teal' ? 'bg-scholarly-teal-soft text-scholarly-teal-dark' : mentor.tone === 'gold' ? 'bg-scholarly-gold-soft text-scholarly-gold-dark' : 'bg-scholarly-blue-soft text-scholarly-blue'}`}
                                    >
                                        {mentor.initials}
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-bold">
                                            {mentor.name}
                                        </p>
                                        <p className="mt-1 text-sm text-scholarly-slate">
                                            {mentor.specialty}
                                        </p>
                                    </div>
                                    <div className="text-left sm:text-right">
                                        <p className="text-xs font-bold">
                                            {mentor.rating === '—'
                                                ? 'Not rated yet'
                                                : `${mentor.rating} rating`}
                                        </p>
                                        <p className="mt-1 text-xs text-scholarly-slate">
                                            {mentor.learners} active learners
                                        </p>
                                    </div>
                                    <span
                                        className={`rounded-full px-2.5 py-1 text-xs font-bold ${mentor.status === 'Verified' ? 'bg-scholarly-teal-soft text-scholarly-teal-dark' : 'bg-scholarly-gold-soft text-scholarly-gold-dark'}`}
                                    >
                                        {mentor.status}
                                    </span>
                                    <Link
                                        href={`/admin-coming-soon?feature=${encodeURIComponent(`${mentor.name} profile`)}`}
                                        className="inline-flex items-center gap-1 text-xs font-bold text-scholarly-blue"
                                    >
                                        View <ArrowRight className="size-3.5" />
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}

AdminMentors.layout = () => ({
    breadcrumbs: [{ title: 'Mentors', href: '/admin-mentors' }],
});
