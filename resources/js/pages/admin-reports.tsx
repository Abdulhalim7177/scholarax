import { Head, router } from '@inertiajs/react';
import {
    ArrowDownRight,
    ArrowUpRight,
    BarChart3,
    Download,
    Globe2,
    GraduationCap,
    HeartHandshake,
    Loader2,
    UsersRound,
} from 'lucide-react';

import { relativeTime } from '@/lib/format';
import type { AdminReportProps } from '@/types/domain';

const destinationColours = [
    'bg-scholarly-blue',
    'bg-scholarly-teal',
    'bg-scholarly-gold',
    'bg-scholarly-coral',
];

function ChangeBadge({
    change,
    suffix = '%',
}: {
    change: number;
    suffix?: string;
}) {
    if (change === 0) {
        return (
            <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-scholarly-slate">
                No change
            </span>
        );
    }

    const positive = change > 0;

    return (
        <span
            className={`mt-2 inline-flex items-center gap-1 text-xs font-bold ${positive ? 'text-scholarly-teal-dark' : 'text-scholarly-coral-dark'}`}
        >
            {positive ? (
                <ArrowUpRight className="size-3.5" />
            ) : (
                <ArrowDownRight className="size-3.5" />
            )}
            {positive ? '+' : ''}
            {Math.abs(change).toFixed(1)}
            {suffix}
        </span>
    );
}

export default function AdminReports({
    stats,
    series,
    destinations,
    exports,
    generatedAt,
}: AdminReportProps) {
    const requestExport = () => {
        router.post('/admin-reports/export', {}, { preserveScroll: true });
    };

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
                        <button
                            type="button"
                            onClick={requestExport}
                            className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-xl border border-scholarly-border bg-white px-4 text-sm font-bold hover:border-scholarly-blue hover:text-scholarly-blue sm:self-auto"
                        >
                            <Download className="size-4" /> Export report
                        </button>
                    </header>
                    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <div className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm">
                            <UsersRound className="size-5 text-scholarly-blue" />
                            <p className="mt-5 text-3xl font-bold">
                                {stats.activeUsers.value.toLocaleString()}
                            </p>
                            <p className="mt-1 text-sm font-semibold">
                                Monthly active users
                            </p>
                            <ChangeBadge change={stats.activeUsers.change} />
                        </div>
                        <div className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm">
                            <GraduationCap className="size-5 text-scholarly-teal" />
                            <p className="mt-5 text-3xl font-bold">
                                {stats.completion.value}%
                            </p>
                            <p className="mt-1 text-sm font-semibold">
                                Application completion
                            </p>
                            <ChangeBadge
                                change={stats.completion.change}
                                suffix=" pts"
                            />
                        </div>
                        <div className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm">
                            <HeartHandshake className="size-5 text-scholarly-coral" />
                            <p className="mt-5 text-3xl font-bold">
                                {stats.matchRate.value}%
                            </p>
                            <p className="mt-1 text-sm font-semibold">
                                Mentor match success
                            </p>
                            <ChangeBadge
                                change={stats.matchRate.change}
                                suffix=" pts"
                            />
                        </div>
                        <div className="rounded-2xl border border-scholarly-border bg-scholarly-navy p-5 text-white shadow-sm">
                            <BarChart3 className="size-5 text-scholarly-gold" />
                            <p className="mt-5 text-3xl font-bold">
                                {stats.satisfaction.value}%
                            </p>
                            <p className="mt-1 text-sm font-semibold">
                                Platform satisfaction
                            </p>
                            <p className="mt-2 text-xs text-white/60">
                                From {stats.satisfaction.responses} reviews
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
                                        New users and applications, last six
                                        months.
                                    </p>
                                </div>
                                <span className="rounded-lg bg-scholarly-blue-white px-3 py-2 text-xs font-bold text-scholarly-slate">
                                    Generated {relativeTime(generatedAt)}
                                </span>
                            </div>
                            <div className="mt-8 flex h-60 items-end gap-3 border-b border-l border-scholarly-border p-4">
                                {series.map((point) => (
                                    <div
                                        key={point.label}
                                        className="group flex flex-1 items-end gap-1"
                                        title={`${point.label}: ${point.users} new users, ${point.applications} applications`}
                                    >
                                        <div
                                            className="w-1/2 rounded-t bg-scholarly-blue transition group-hover:bg-scholarly-teal"
                                            style={{
                                                height: `${point.usersHeight}%`,
                                            }}
                                        />
                                        <div
                                            className="w-1/2 rounded-t bg-scholarly-gold"
                                            style={{
                                                height: `${point.applicationsHeight}%`,
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="mt-3 grid grid-cols-6 text-center text-[11px] font-semibold text-scholarly-slate">
                                {series.map((point) => (
                                    <span key={point.label}>{point.label}</span>
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
                                {destinations.map((destination, index) => (
                                    <div key={destination.country}>
                                        <div className="flex justify-between text-xs font-semibold">
                                            <span>{destination.country}</span>
                                            <span>{destination.percent}%</span>
                                        </div>
                                        <div className="mt-2 h-2 rounded-full bg-scholarly-blue-white">
                                            <div
                                                className={`h-full rounded-full ${destinationColours[index % destinationColours.length]}`}
                                                style={{
                                                    width: `${destination.percent}%`,
                                                }}
                                            />
                                        </div>
                                        <p className="mt-1 text-[11px] text-scholarly-slate">
                                            {destination.count} applications
                                        </p>
                                    </div>
                                ))}
                                {destinations.length === 0 && (
                                    <p className="text-sm text-scholarly-slate">
                                        Destinations appear once learners start
                                        applications.
                                    </p>
                                )}
                            </div>
                        </section>
                    </div>
                    <section className="rounded-2xl border border-scholarly-border bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold">
                                    Recent exports
                                </h2>
                                <p className="mt-1 text-sm text-scholarly-slate">
                                    Download a snapshot of the platform
                                    aggregates.
                                </p>
                            </div>
                        </div>
                        <div className="mt-5 divide-y divide-scholarly-border-soft">
                            {exports.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="flex size-10 items-center justify-center rounded-xl bg-scholarly-blue-soft text-scholarly-blue">
                                            {item.status === 'completed' ? (
                                                <Download className="size-4" />
                                            ) : item.status === 'failed' ? (
                                                <ArrowDownRight className="size-4" />
                                            ) : (
                                                <Loader2 className="size-4 animate-spin" />
                                            )}
                                        </span>
                                        <div>
                                            <p className="text-sm font-bold">
                                                Platform report #{item.id}
                                            </p>
                                            <p className="mt-1 text-xs text-scholarly-slate">
                                                Requested{' '}
                                                {relativeTime(item.requestedAt)}
                                                {item.rows > 0
                                                    ? ` · ${item.rows} rows`
                                                    : ''}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-xs font-bold text-scholarly-slate">
                                            {item.statusLabel}
                                        </span>
                                        {item.downloadUrl !== null ? (
                                            <a
                                                href={item.downloadUrl}
                                                className="inline-flex h-9 items-center gap-2 rounded-lg bg-scholarly-blue px-3 text-xs font-bold text-white hover:bg-scholarly-blue-dark"
                                            >
                                                <Download className="size-3.5" />
                                                Download
                                            </a>
                                        ) : null}
                                    </div>
                                </div>
                            ))}
                            {exports.length === 0 && (
                                <p className="py-8 text-center text-sm text-scholarly-slate">
                                    No exports yet. Generate one with the export
                                    button above.
                                </p>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}

AdminReports.layout = () => ({
    breadcrumbs: [{ title: 'Reports & insights', href: '/admin-reports' }],
});
