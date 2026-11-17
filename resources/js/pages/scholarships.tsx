import { Head, router } from '@inertiajs/react';
import { SlidersHorizontal } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import FiltersPanel from '@/layouts/scholarships/filters-panel';
import Pagination from '@/layouts/scholarships/pagination';
import ScholarshipCard from '@/layouts/scholarships/scholarship-card';
import ScholarshipsHeader from '@/layouts/scholarships/scholarships-header';
import type {
    ScholarshipFilters,
    ScholarshipIndexProps,
    ScholarshipSummary,
} from '@/types/domain';

export default function Scholarships({
    scholarships,
    filters,
    options,
    savedCount,
}: ScholarshipIndexProps) {
    const [query, setQuery] = useState(filters.q);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        setQuery(filters.q);
    }, [filters.q]);

    const applyFilters = useCallback(
        (next: Partial<ScholarshipFilters>) => {
            const merged = { ...filters, ...next };

            router.get(
                '/scholarships',
                {
                    q: merged.q || undefined,
                    country: merged.country || undefined,
                    level: merged.level || undefined,
                    field: merged.field || undefined,
                    funding: merged.funding ? 1 : undefined,
                    sort: merged.sort === 'latest' ? 'latest' : undefined,
                },
                { preserveState: true, preserveScroll: true, replace: true },
            );
        },
        [filters],
    );

    useEffect(() => {
        if (query === filters.q) {
            return;
        }

        const timer = window.setTimeout(() => {
            applyFilters({ q: query });
        }, 350);

        return () => window.clearTimeout(timer);
    }, [applyFilters, filters.q, query]);

    const resetFilters = () => {
        setQuery('');
        applyFilters({
            q: '',
            country: '',
            level: '',
            field: '',
            funding: false,
            sort: 'soonest',
        });
    };

    const toggleSaved = (scholarship: ScholarshipSummary) => {
        const requestOptions = {
            preserveScroll: true,
            preserveState: true,
        };

        if (scholarship.saved) {
            router.delete(
                `/saved-scholarships/${scholarship.id}`,
                requestOptions,
            );

            return;
        }

        router.post(
            `/saved-scholarships/${scholarship.id}`,
            {},
            requestOptions,
        );
    };

    const panelProps = {
        country: filters.country,
        level: filters.level,
        field: filters.field,
        fundingOnly: filters.funding,
        countries: options.countries,
        levels: options.levels,
        fields: options.fields,
        onCountryChange: (value: string) => applyFilters({ country: value }),
        onLevelChange: (value: string) => applyFilters({ level: value }),
        onFieldChange: (value: string) => applyFilters({ field: value }),
        onFundingOnlyChange: (value: boolean) =>
            applyFilters({ funding: value }),
        onReset: resetFilters,
    };

    return (
        <>
            <Head title="Find scholarships" />
            <div className="min-h-screen bg-scholarly-blue-white p-4 text-scholarly-navy sm:p-6 lg:p-8">
                <div className="mx-auto max-w-7xl space-y-8">
                    <ScholarshipsHeader
                        query={query}
                        onQueryChange={setQuery}
                        onOpenFilters={() => setShowFilters(true)}
                    />

                    {showFilters && (
                        <div
                            className="fixed inset-0 z-50 flex items-end bg-scholarly-navy/30 p-4 backdrop-blur-sm lg:hidden"
                            onClick={() => setShowFilters(false)}
                        >
                            <div
                                className="w-full"
                                onClick={(event) => event.stopPropagation()}
                            >
                                <FiltersPanel {...panelProps} mobile />
                                <button
                                    type="button"
                                    onClick={() => setShowFilters(false)}
                                    className="mt-3 h-11 w-full rounded-xl bg-scholarly-blue text-sm font-bold text-white"
                                >
                                    Show {scholarships.total} results
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
                        <div className="hidden lg:block">
                            <FiltersPanel {...panelProps} />
                        </div>
                        <main>
                            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-scholarly-slate">
                                        <span className="font-bold text-scholarly-navy">
                                            {scholarships.total} scholarships
                                        </span>{' '}
                                        matched to your search
                                        {savedCount > 0 && (
                                            <span className="text-scholarly-slate-light">
                                                {' '}
                                                · {savedCount} saved
                                            </span>
                                        )}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() =>
                                        applyFilters({
                                            sort:
                                                filters.sort === 'soonest'
                                                    ? 'latest'
                                                    : 'soonest',
                                        })
                                    }
                                    className="inline-flex items-center gap-2 self-start rounded-lg border border-scholarly-border bg-white px-3 py-2 text-xs font-bold text-scholarly-slate transition hover:border-scholarly-blue hover:text-scholarly-blue"
                                >
                                    <SlidersHorizontal className="size-3.5" />
                                    Sort:{' '}
                                    {filters.sort === 'soonest'
                                        ? 'Deadline soonest'
                                        : 'Deadline latest'}
                                </button>
                            </div>
                            {scholarships.data.length > 0 ? (
                                <>
                                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                                        {scholarships.data.map(
                                            (scholarship) => (
                                                <ScholarshipCard
                                                    key={scholarship.id}
                                                    scholarship={scholarship}
                                                    onToggleSaved={toggleSaved}
                                                />
                                            ),
                                        )}
                                    </div>
                                    <Pagination paginator={scholarships} />
                                </>
                            ) : (
                                <div className="rounded-2xl border border-dashed border-scholarly-border-strong bg-white px-6 py-16 text-center">
                                    <p className="font-display text-2xl text-scholarly-navy">
                                        No scholarships found yet.
                                    </p>
                                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-scholarly-slate">
                                        Try broadening your search or resetting
                                        the filters. There are many more
                                        opportunities waiting to be added.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={resetFilters}
                                        className="mt-5 rounded-lg bg-scholarly-blue px-4 py-2.5 text-sm font-bold text-white hover:bg-scholarly-blue-hover"
                                    >
                                        Clear filters
                                    </button>
                                </div>
                            )}
                        </main>
                    </div>
                </div>
            </div>
        </>
    );
}

Scholarships.layout = () => ({
    breadcrumbs: [{ title: 'Find scholarships', href: '/scholarships' }],
});
