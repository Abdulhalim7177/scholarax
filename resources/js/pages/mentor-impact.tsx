import { Head, Link } from '@inertiajs/react';
import {
    ArrowUpRight,
    Award,
    HeartHandshake,
    Star,
    TrendingUp,
    UsersRound,
} from 'lucide-react';

export default function MentorImpact() {
    return (
        <>
            <Head title="Impact and insights" />
            <div className="min-h-screen bg-scholarly-blue-white p-4 text-scholarly-navy sm:p-6 lg:p-8">
                <div className="mx-auto max-w-7xl space-y-7">
                    <header className="flex flex-col gap-5 border-b border-scholarly-border pb-6 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-sm font-semibold text-scholarly-blue">
                                The difference you’re making
                            </p>
                            <h1 className="mt-2 font-display text-4xl tracking-[-0.03em] sm:text-5xl">
                                Impact & insights
                            </h1>
                            <p className="mt-3 max-w-2xl text-sm leading-6 text-scholarly-slate">
                                See how your time, feedback, and encouragement
                                are helping learners move forward.
                            </p>
                        </div>
                        <Link
                            href="/mentor-coming-soon?feature=Download%20impact%20report"
                            className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-xl border border-scholarly-border bg-white px-4 text-sm font-bold hover:border-scholarly-blue hover:text-scholarly-blue sm:self-auto"
                        >
                            Download report <ArrowUpRight className="size-4" />
                        </Link>
                    </header>
                    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {[
                            [
                                '28',
                                'Learners supported',
                                UsersRound,
                                'This year',
                            ],
                            [
                                '84%',
                                'Application progress',
                                TrendingUp,
                                '+12% from last month',
                            ],
                            [
                                '4.9',
                                'Average rating',
                                Star,
                                '48 learner reviews',
                            ],
                            [
                                '76%',
                                'Offer success rate',
                                Award,
                                'For completed journeys',
                            ],
                        ].map(([value, label, Icon, note]) => (
                            <div
                                key={label as string}
                                className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm"
                            >
                                <Icon className="size-5 text-scholarly-blue" />
                                <p className="mt-5 text-3xl font-bold tracking-[-0.04em]">
                                    {value as string}
                                    {label === 'Average rating' && (
                                        <span className="text-xl text-scholarly-gold">
                                            {' '}
                                            ★
                                        </span>
                                    )}
                                </p>
                                <p className="mt-1 text-sm font-semibold">
                                    {label as string}
                                </p>
                                <p className="mt-1 text-xs text-scholarly-slate">
                                    {note as string}
                                </p>
                            </div>
                        ))}
                    </section>
                    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(300px,0.7fr)]">
                        <section className="rounded-2xl border border-scholarly-border bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold">
                                        Learner outcomes
                                    </h2>
                                    <p className="mt-1 text-sm text-scholarly-slate">
                                        Progress across the last six months.
                                    </p>
                                </div>
                                <TrendingUp className="size-5 text-scholarly-teal" />
                            </div>
                            <div className="mt-8 flex h-56 items-end gap-3 border-b border-l border-scholarly-border p-4">
                                {[
                                    34, 48, 43, 61, 68, 84, 76, 92, 88, 96, 84,
                                    100,
                                ].map((height, index) => (
                                    <div
                                        key={index}
                                        className="group flex flex-1 flex-col items-center gap-2"
                                    >
                                        <div
                                            className="w-full rounded-t-md bg-scholarly-blue transition group-hover:bg-scholarly-teal"
                                            style={{ height: `${height}%` }}
                                        />
                                        <span className="text-[10px] text-scholarly-slate-light">
                                            {
                                                [
                                                    'Jun',
                                                    '',
                                                    'Jul',
                                                    '',
                                                    'Aug',
                                                    '',
                                                    'Sep',
                                                    '',
                                                    'Oct',
                                                    '',
                                                    'Nov',
                                                    '',
                                                ][index]
                                            }
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </section>
                        <section className="rounded-2xl border border-scholarly-border bg-scholarly-navy p-6 text-white shadow-sm">
                            <div className="flex size-11 items-center justify-center rounded-xl bg-white/10 text-scholarly-gold">
                                <HeartHandshake className="size-5" />
                            </div>
                            <h2 className="mt-5 font-display text-2xl">
                                Your feedback lands.
                            </h2>
                            <p className="mt-3 text-sm leading-6 text-white/65">
                                Learners say your comments are clearest when you
                                pair one honest observation with one practical
                                next step.
                            </p>
                            <div className="mt-6 border-t border-white/10 pt-5">
                                <p className="text-3xl font-bold">92%</p>
                                <p className="mt-1 text-xs text-white/60">
                                    of learners rated your feedback helpful
                                </p>
                            </div>
                        </section>
                    </div>
                    <section className="rounded-2xl border border-scholarly-border bg-white p-6 shadow-sm">
                        <h2 className="text-xl font-bold">Learner voices</h2>
                        <div className="mt-5 grid gap-4 md:grid-cols-3">
                            {[
                                '“Maya helped me find the story inside my experience.”',
                                '“The feedback was honest, kind, and easy to act on.”',
                                '“I submitted with confidence because of our sessions.”',
                            ].map((quote) => (
                                <blockquote
                                    key={quote}
                                    className="rounded-xl bg-scholarly-blue-white p-4 text-sm leading-6 text-scholarly-slate"
                                >
                                    {quote}
                                    <footer className="mt-3 text-xs font-bold text-scholarly-navy">
                                        Anonymous learner
                                    </footer>
                                </blockquote>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}

MentorImpact.layout = () => ({
    breadcrumbs: [{ title: 'Impact & insights', href: '/mentor-impact' }],
});
