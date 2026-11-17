import { Link } from '@inertiajs/react';
import { ArrowRight, ChevronDown, ChevronRight, Search } from 'lucide-react';

import type { ScholarshipSummary } from '@/types/domain';
import SectionIntro from './section-intro';

type ScholarshipSearchSectionProps = {
    scholarships: ScholarshipSummary[];
    total: number;
};

const tones = [
    'bg-scholarly-navy-light text-white',
    'bg-scholarly-blue-soft text-scholarly-blue',
    'bg-scholarly-gold-soft text-scholarly-gold-dark',
];

const initialsFor = (title: string) =>
    title
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0])
        .join('')
        .toUpperCase();

export default function ScholarshipSearchSection({
    scholarships,
    total,
}: ScholarshipSearchSectionProps) {
    return (
        <section
            id="scholarships"
            className="bg-scholarly-blue-white py-24 sm:py-32"
        >
            <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-10">
                <div>
                    <SectionIntro
                        eyebrow="Search global opportunities"
                        title="Find a scholarship that fits you."
                        body="Search thousands of opportunities from universities and organizations around the world, then save the ones that feel right."
                    />
                    <Link
                        href="/scholarships"
                        className="mt-8 inline-flex items-center gap-2 rounded-full bg-scholarly-blue px-6 py-3.5 text-sm font-bold text-white transition hover:bg-scholarly-blue-dark"
                    >
                        Search scholarships <ArrowRight className="size-4" />
                    </Link>
                </div>
                <div
                    id="search-preview"
                    className="rounded-[28px] bg-white p-5 sm:p-7"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-xl bg-scholarly-blue-soft text-scholarly-blue">
                                <Search className="size-5" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-scholarly-navy">
                                    Scholarship search
                                </p>
                                <p className="text-xs text-scholarly-slate-light">
                                    {total}{' '}
                                    {total === 1
                                        ? 'opportunity'
                                        : 'opportunities'}{' '}
                                    found
                                </p>
                            </div>
                        </div>
                        <Link
                            href="/scholarships"
                            aria-label="Browse scholarships"
                            className="rounded-lg p-2 text-scholarly-slate hover:bg-scholarly-blue-white"
                        >
                            <ChevronDown className="size-4" />
                        </Link>
                    </div>
                    <div className="mt-6 grid gap-3 sm:grid-cols-3">
                        <div className="rounded-xl border border-scholarly-border px-3 py-2.5">
                            <p className="text-[10px] font-bold tracking-wide text-scholarly-slate-light uppercase">
                                Country
                            </p>
                            <p className="mt-1 text-sm font-semibold text-scholarly-navy">
                                Any country
                            </p>
                        </div>
                        <div className="rounded-xl border border-scholarly-border px-3 py-2.5">
                            <p className="text-[10px] font-bold tracking-wide text-scholarly-slate-light uppercase">
                                Study level
                            </p>
                            <p className="mt-1 text-sm font-semibold text-scholarly-navy">
                                Any level
                            </p>
                        </div>
                        <Link
                            href="/scholarships"
                            className="rounded-xl bg-scholarly-blue px-4 py-2.5 text-center text-sm font-bold text-white"
                        >
                            Search
                        </Link>
                    </div>
                    <div className="mt-5 divide-y divide-scholarly-border-soft">
                        {scholarships.length > 0 ? (
                            scholarships.map((scholarship, index) => (
                                <Link
                                    key={scholarship.id}
                                    href={`/scholarships/${scholarship.slug}`}
                                    className="flex items-center gap-3 py-4 transition hover:bg-scholarly-blue-white/60"
                                >
                                    <div
                                        className={`flex size-10 shrink-0 items-center justify-center rounded-xl text-xs font-extrabold ${tones[index % tones.length]}`}
                                    >
                                        {initialsFor(scholarship.title)}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-bold text-scholarly-navy">
                                            {scholarship.title}
                                        </p>
                                        <p className="truncate text-xs text-scholarly-slate-light">
                                            {scholarship.provider}
                                        </p>
                                    </div>
                                    <div className="hidden text-right sm:block">
                                        <p className="text-xs font-semibold text-scholarly-navy">
                                            {scholarship.level}
                                        </p>
                                        <p className="text-xs text-scholarly-slate-light">
                                            {scholarship.country}
                                        </p>
                                    </div>
                                    <ChevronRight className="size-4 text-scholarly-slate-light" />
                                </Link>
                            ))
                        ) : (
                            <p className="py-8 text-center text-sm text-scholarly-slate">
                                New opportunities are being added soon.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
