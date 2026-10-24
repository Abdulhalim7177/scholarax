import { Head } from '@inertiajs/react';
import { SlidersHorizontal } from 'lucide-react';
import { useMemo, useState } from 'react';

import FiltersPanel from '@/layouts/scholarships/filters-panel';
import ScholarshipsHeader from '@/layouts/scholarships/scholarships-header';
import ScholarshipCard from '@/layouts/scholarships/scholarship-card';
import {
    scholarships,
    scholarshipCountries,
    scholarshipFields,
    scholarshipLevels,
} from '@/layouts/scholarships/data';

export default function Scholarships() {
    const [query, setQuery] = useState('');
    const [country, setCountry] = useState(scholarshipCountries[0]);
    const [level, setLevel] = useState(scholarshipLevels[0]);
    const [field, setField] = useState(scholarshipFields[0]);
    const [fundingOnly, setFundingOnly] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [saved, setSaved] = useState<string[]>(['daad']);

    const filteredScholarships = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();

        return scholarships.filter((scholarship) => {
            const matchesQuery =
                !normalizedQuery ||
                [
                    scholarship.title,
                    scholarship.provider,
                    scholarship.country,
                    scholarship.field,
                ].some((value) =>
                    value.toLowerCase().includes(normalizedQuery),
                );
            const matchesCountry =
                country === scholarshipCountries[0] ||
                scholarship.country === country;
            const matchesLevel =
                level === scholarshipLevels[0] || scholarship.level === level;
            const matchesField =
                field === scholarshipFields[0] || scholarship.field === field;
            const matchesFunding =
                !fundingOnly || scholarship.funding === 'Fully funded';

            return (
                matchesQuery &&
                matchesCountry &&
                matchesLevel &&
                matchesField &&
                matchesFunding
            );
        });
    }, [country, field, fundingOnly, level, query]);

    const resetFilters = () => {
        setCountry(scholarshipCountries[0]);
        setLevel(scholarshipLevels[0]);
        setField(scholarshipFields[0]);
        setFundingOnly(false);
    };

    const filters = {
        country,
        level,
        field,
        fundingOnly,
        countries: scholarshipCountries,
        levels: scholarshipLevels,
        fields: scholarshipFields,
        onCountryChange: setCountry,
        onLevelChange: setLevel,
        onFieldChange: setField,
        onFundingOnlyChange: setFundingOnly,
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
                                <FiltersPanel {...filters} mobile />
                                <button
                                    type="button"
                                    onClick={() => setShowFilters(false)}
                                    className="mt-3 h-11 w-full rounded-xl bg-scholarly-blue text-sm font-bold text-white"
                                >
                                    Show results
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
                        <div className="hidden lg:block">
                            <FiltersPanel {...filters} />
                        </div>
                        <main>
                            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-scholarly-slate">
                                        <span className="font-bold text-scholarly-navy">
                                            {filteredScholarships.length}{' '}
                                            scholarships
                                        </span>{' '}
                                        matched to your search
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    className="inline-flex items-center gap-2 self-start rounded-lg border border-scholarly-border bg-white px-3 py-2 text-xs font-bold text-scholarly-slate transition hover:border-scholarly-blue hover:text-scholarly-blue"
                                >
                                    <SlidersHorizontal className="size-3.5" />
                                    Sort: Deadline soonest
                                </button>
                            </div>
                            {filteredScholarships.length > 0 ? (
                                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                                    {filteredScholarships.map((scholarship) => (
                                        <ScholarshipCard
                                            key={scholarship.id}
                                            scholarship={scholarship}
                                            saved={saved.includes(
                                                scholarship.id,
                                            )}
                                            onToggleSaved={(id) =>
                                                setSaved((current) =>
                                                    current.includes(id)
                                                        ? current.filter(
                                                              (item) =>
                                                                  item !== id,
                                                          )
                                                        : [...current, id],
                                                )
                                            }
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="border-scholarly-border-strong rounded-2xl border border-dashed bg-white px-6 py-16 text-center">
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
                                        onClick={() => {
                                            setQuery('');
                                            resetFilters();
                                        }}
                                        className="hover:bg-scholarly-blue-hover mt-5 rounded-lg bg-scholarly-blue px-4 py-2.5 text-sm font-bold text-white"
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
