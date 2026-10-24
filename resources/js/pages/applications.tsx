import { Head, Link } from '@inertiajs/react';
import { ArrowRight, FileText, Plus, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';

import ApplicationCard from '@/layouts/applications/application-card';
import ApplicationSummary from '@/layouts/applications/application-summary';
import {
    applications,
    statusFilters,
    type ApplicationStatus,
} from '@/layouts/applications/data';

export default function Applications() {
    const [activeFilter, setActiveFilter] = useState<'All' | ApplicationStatus>(
        'All',
    );
    const filteredApplications = useMemo(
        () =>
            activeFilter === 'All'
                ? applications
                : applications.filter(
                      (application) => application.status === activeFilter,
                  ),
        [activeFilter],
    );

    return (
        <>
            <Head title="My applications" />
            <div className="min-h-screen bg-scholarly-blue-white p-4 text-scholarly-navy sm:p-6 lg:p-8">
                <div className="mx-auto max-w-7xl space-y-8">
                    <header className="flex flex-col gap-5 border-b border-scholarly-border pb-6 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-scholarly-blue">
                                <Sparkles className="size-4" /> Your scholarship
                                journey
                            </p>
                            <h1 className="font-display text-4xl tracking-[-0.03em] text-scholarly-navy sm:text-5xl">
                                My applications
                            </h1>
                            <p className="mt-3 max-w-2xl text-sm leading-6 text-scholarly-slate sm:text-base">
                                Keep every opportunity moving forward, from your
                                first draft to the final decision.
                            </p>
                        </div>
                        <Link
                            href="/scholarships"
                            className="hover:bg-scholarly-blue-dark inline-flex h-11 items-center justify-center gap-2 self-start rounded-xl bg-scholarly-blue px-4 text-sm font-bold text-white transition lg:self-auto"
                        >
                            Find a scholarship <ArrowRight className="size-4" />
                        </Link>
                    </header>

                    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {[
                            ['4', 'Total applications', 'Keep showing up'],
                            [
                                '1',
                                'Draft in progress',
                                'Ready for your next step',
                            ],
                            ['2', 'Being reviewed', 'Your work is moving'],
                            [
                                '1',
                                'Offer received',
                                'A moment worth celebrating',
                            ],
                        ].map(([value, label, note], index) => (
                            <div
                                key={label}
                                className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm"
                            >
                                <div
                                    className={`mb-5 flex size-10 items-center justify-center rounded-xl ${index === 3 ? 'bg-scholarly-gold-soft text-scholarly-gold-dark' : index === 2 ? 'bg-scholarly-teal-soft text-scholarly-teal-dark' : 'bg-scholarly-blue-soft text-scholarly-blue'}`}
                                >
                                    <FileText className="size-5" />
                                </div>
                                <p className="text-3xl font-bold tracking-[-0.04em] text-scholarly-navy">
                                    {value}
                                </p>
                                <p className="mt-1 text-sm font-semibold text-scholarly-navy">
                                    {label}
                                </p>
                                <p className="mt-1 text-xs text-scholarly-slate">
                                    {note}
                                </p>
                            </div>
                        ))}
                    </section>

                    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
                        <main>
                            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-scholarly-navy">
                                        Your applications
                                    </h2>
                                    <p className="mt-1 text-sm text-scholarly-slate">
                                        Pick up where you left off.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    className="inline-flex items-center gap-2 self-start rounded-lg border border-scholarly-border bg-white px-3 py-2 text-xs font-bold text-scholarly-slate transition hover:border-scholarly-blue hover:text-scholarly-blue"
                                >
                                    <Plus className="size-3.5" /> Add
                                    application
                                </button>
                            </div>
                            <div className="mb-6 flex gap-1 overflow-x-auto rounded-xl border border-scholarly-border bg-white p-1">
                                {statusFilters.map((filter) => (
                                    <button
                                        key={filter}
                                        type="button"
                                        onClick={() => setActiveFilter(filter)}
                                        className={`rounded-lg px-3 py-2 text-xs font-bold whitespace-nowrap transition sm:px-4 ${activeFilter === filter ? 'bg-scholarly-blue text-white' : 'hover:bg-scholarly-blue-soft text-scholarly-slate hover:text-scholarly-blue'}`}
                                    >
                                        {filter}
                                    </button>
                                ))}
                            </div>
                            <div className="space-y-5">
                                {filteredApplications.map((application) => (
                                    <ApplicationCard
                                        key={application.id}
                                        application={application}
                                    />
                                ))}
                            </div>
                        </main>
                        <ApplicationSummary />
                    </div>
                </div>
            </div>
        </>
    );
}

Applications.layout = () => ({
    breadcrumbs: [{ title: 'My applications', href: '/applications' }],
});
