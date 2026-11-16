import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    Award,
    CheckCircle2,
    Clock3,
    HeartHandshake,
    UsersRound,
} from 'lucide-react';

import MentorActivity from '@/layouts/mentor-dashboard/mentor-activity';
import MentorHeader from '@/layouts/mentor-dashboard/mentor-header';
import ReviewQueue from '@/layouts/mentor-dashboard/review-queue';
import {
    recentMessages,
    reviewQueue,
    sessions,
} from '@/layouts/mentor-dashboard/data';

export default function MentorDashboard() {
    return (
        <>
            <Head title="Mentor dashboard" />
            <div className="min-h-screen bg-scholarly-blue-white p-4 text-scholarly-navy sm:p-6 lg:p-8">
                <div className="mx-auto max-w-7xl space-y-6">
                    <MentorHeader />
                    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {[
                            [
                                '12',
                                'Active learners',
                                '3 new this month',
                                UsersRound,
                                'blue',
                            ],
                            [
                                '8',
                                'Reviews completed',
                                'This month',
                                CheckCircle2,
                                'teal',
                            ],
                            [
                                '4.9',
                                'Mentor rating',
                                'From 48 reviews',
                                Award,
                                'gold',
                            ],
                            [
                                '6 hrs',
                                'Response time',
                                'Your average',
                                Clock3,
                                'coral',
                            ],
                        ].map(([value, label, note, Icon, tone]) => (
                            <div
                                key={label as string}
                                className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm"
                            >
                                <div
                                    className={`mb-5 flex size-10 items-center justify-center rounded-xl ${tone === 'teal' ? 'bg-scholarly-teal-soft text-scholarly-teal-dark' : tone === 'gold' ? 'bg-scholarly-gold-soft text-scholarly-gold-dark' : tone === 'coral' ? 'bg-scholarly-coral-soft text-scholarly-coral-dark' : 'bg-scholarly-blue-soft text-scholarly-blue'}`}
                                >
                                    <Icon className="size-5" />
                                </div>
                                <p className="text-3xl font-bold tracking-[-0.04em] text-scholarly-navy">
                                    {value as string}
                                </p>
                                <p className="mt-1 text-sm font-semibold text-scholarly-navy">
                                    {label as string}
                                </p>
                                <p className="mt-1 text-xs text-scholarly-slate">
                                    {note as string}
                                </p>
                            </div>
                        ))}
                    </section>
                    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(300px,0.8fr)]">
                        <ReviewQueue items={reviewQueue} />
                        <MentorActivity
                            sessions={sessions}
                            messages={recentMessages}
                        />
                    </div>
                    <section className="flex flex-col gap-5 rounded-2xl border border-scholarly-border bg-scholarly-sky p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
                        <div className="flex items-start gap-4">
                            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white text-scholarly-blue shadow-sm">
                                <HeartHandshake className="size-6" />
                            </div>
                            <div>
                                <p className="text-xs font-bold tracking-[0.14em] text-scholarly-blue uppercase">
                                    Your mentor impact
                                </p>
                                <h2 className="mt-2 font-display text-2xl text-scholarly-navy">
                                    Small feedback can change a learner’s whole
                                    direction.
                                </h2>
                                <p className="mt-2 max-w-xl text-sm leading-6 text-scholarly-slate">
                                    You have helped 28 learners strengthen their
                                    applications this year. Keep the momentum
                                    going.
                                </p>
                            </div>
                        </div>
                        <Link
                            href="/mentor-coming-soon?feature=Mentor%20impact%20report"
                            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-scholarly-blue px-4 py-3 text-sm font-bold text-white hover:bg-scholarly-blue-dark"
                        >
                            View impact report <ArrowRight className="size-4" />
                        </Link>
                    </section>
                </div>
            </div>
        </>
    );
}

MentorDashboard.layout = () => ({
    breadcrumbs: [{ title: 'Mentor dashboard', href: '/mentor-dashboard' }],
});
