import { Head, Link } from '@inertiajs/react';
import {
    ArrowDownRight,
    ArrowUpRight,
    BarChart3,
    Download,
    Globe2,
    GraduationCap,
    HeartHandshake,
    UsersRound,
} from 'lucide-react';

export default function AdminReports() {
    return (
        <>
            <Head title="Reports and insights" />
            <div className="min-h-screen bg-scholarly-blue-white p-4 text-scholarly-navy sm:p-6 lg:p-8">
                <div className="mx-auto max-w-7xl space-y-7">
                    <header className="flex flex-col gap-5 border-b border-scholarly-border pb-6 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-sm font-semibold text-scholarly-blue">
                                Understand the platform
                            </p>
                            <h1 className="mt-2 font-display text-4xl tracking-[-0.03em] sm:text-5xl">
                                Reports & insights
                            </h1>
                            <p className="mt-3 text-sm leading-6 text-scholarly-slate">
                                A clear view of growth, engagement, and the
                                outcomes Scholarly is creating.
                            </p>
                        </div>
                        <Link
                            href="/admin-coming-soon?feature=Download%20admin%20report"
                            className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-xl border border-scholarly-border bg-white px-4 text-sm font-bold hover:border-scholarly-blue hover:text-scholarly-blue sm:self-auto"
                        >
                            <Download className="size-4" /> Export report
                        </Link>
                    </header>
                    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <div className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm">
                            <UsersRound className="size-5 text-scholarly-blue" />
                            <p className="mt-5 text-3xl font-bold">2,481</p>
                            <p className="mt-1 text-sm font-semibold">
                                Monthly active users
                            </p>
                            <p className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-scholarly-teal-dark">
                                <ArrowUpRight className="size-3.5" /> 14.8%
                            </p>
                        </div>
                        <div className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm">
                            <GraduationCap className="size-5 text-scholarly-teal" />
                            <p className="mt-5 text-3xl font-bold">68%</p>
                            <p className="mt-1 text-sm font-semibold">
                                Application completion
                            </p>
                            <p className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-scholarly-teal-dark">
                                <ArrowUpRight className="size-3.5" /> 8.2%
                            </p>
                        </div>
                        <div className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm">
                            <HeartHandshake className="size-5 text-scholarly-coral" />
                            <p className="mt-5 text-3xl font-bold">76%</p>
                            <p className="mt-1 text-sm font-semibold">
                                Mentor match success
                            </p>
                            <p className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-scholarly-coral-dark">
                                <ArrowDownRight className="size-3.5" /> 2.1%
                            </p>
                        </div>
                        <div className="rounded-2xl border border-scholarly-border bg-scholarly-navy p-5 text-white shadow-sm">
                            <BarChart3 className="size-5 text-scholarly-gold" />
                            <p className="mt-5 text-3xl font-bold">91%</p>
                            <p className="mt-1 text-sm font-semibold">
                                Platform satisfaction
                            </p>
                            <p className="mt-2 text-xs text-white/60">
                                From 420 responses
                            </p>
                        </div>
                    </section>
                    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(300px,0.6fr)]">
                        <section className="rounded-2xl border border-scholarly-border bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold">
                                        Platform growth
                                    </h2>
                                    <p className="mt-1 text-sm text-scholarly-slate">
                                        New users and active applications.
                                    </p>
                                </div>
                                <span className="rounded-lg bg-scholarly-blue-white px-3 py-2 text-xs font-bold text-scholarly-slate">
                                    Last 6 months
                                </span>
                            </div>
                            <div className="mt-8 flex h-60 items-end gap-3 border-b border-l border-scholarly-border p-4">
                                {[
                                    30, 42, 37, 54, 60, 66, 64, 72, 79, 85, 89,
                                    96,
                                ].map((height, index) => (
                                    <div
                                        key={index}
                                        className="group flex flex-1 items-end gap-1"
                                    >
                                        <div
                                            className="w-1/2 rounded-t bg-scholarly-blue transition group-hover:bg-scholarly-teal"
                                            style={{ height: `${height}%` }}
                                        />
                                        <div
                                            className="w-1/2 rounded-t bg-scholarly-gold"
                                            style={{
                                                height: `${Math.max(18, height - 20)}%`,
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 flex gap-5 text-xs text-scholarly-slate">
                                <span className="inline-flex items-center gap-2">
                                    <span className="size-2 rounded-full bg-scholarly-blue" />{' '}
                                    New users
                                </span>
                                <span className="inline-flex items-center gap-2">
                                    <span className="size-2 rounded-full bg-scholarly-gold" />{' '}
                                    Applications
                                </span>
                            </div>
                        </section>
                        <section className="rounded-2xl border border-scholarly-border bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold">
                                        Top destinations
                                    </h2>
                                    <p className="mt-1 text-sm text-scholarly-slate">
                                        Where learners are applying.
                                    </p>
                                </div>
                                <Globe2 className="size-5 text-scholarly-blue" />
                            </div>
                            <div className="mt-6 space-y-5">
                                {[
                                    [
                                        'United Kingdom',
                                        '38%',
                                        'bg-scholarly-blue',
                                    ],
                                    ['Germany', '24%', 'bg-scholarly-teal'],
                                    [
                                        'United States',
                                        '18%',
                                        'bg-scholarly-gold',
                                    ],
                                    ['France', '12%', 'bg-scholarly-coral'],
                                ].map(([country, percent, color]) => (
                                    <div key={country}>
                                        <div className="flex justify-between text-xs font-semibold">
                                            <span>{country}</span>
                                            <span>{percent}</span>
                                        </div>
                                        <div className="mt-2 h-2 rounded-full bg-scholarly-blue-white">
                                            <div
                                                className={`h-full rounded-full ${color}`}
                                                style={{ width: percent }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
}

AdminReports.layout = () => ({
    breadcrumbs: [{ title: 'Reports & insights', href: '/admin-reports' }],
});
