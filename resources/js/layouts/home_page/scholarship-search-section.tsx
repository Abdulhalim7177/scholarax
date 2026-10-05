import { ArrowRight, ChevronDown, ChevronRight, Search } from 'lucide-react';

import { scholarships } from './data';
import SectionIntro from './section-intro';

export default function ScholarshipSearchSection() {
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
                    <a
                        href="#search-preview"
                        className="mt-8 inline-flex items-center gap-2 rounded-full bg-scholarly-blue px-6 py-3.5 text-sm font-bold text-white transition hover:bg-scholarly-blue-dark"
                    >
                        Search scholarships <ArrowRight className="size-4" />
                    </a>
                </div>
                <div
                    id="search-preview"
                    className="rounded-[28px] bg-white p-5  sm:p-7"
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
                                    2,500+ opportunities found
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            className="rounded-lg p-2 text-scholarly-slate hover:bg-scholarly-blue-white"
                        >
                            <ChevronDown className="size-4" />
                        </button>
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
                        <button
                            type="button"
                            className="rounded-xl bg-scholarly-blue px-4 py-2.5 text-sm font-bold text-white"
                        >
                            Search
                        </button>
                    </div>
                    <div className="mt-5 divide-y divide-scholarly-border-soft">
                        {scholarships.map((item) => (
                            <div
                                key={item.name}
                                className="flex items-center gap-3 py-4"
                            >
                                <div
                                    className={`flex size-10 shrink-0 items-center justify-center rounded-xl text-xs font-extrabold ${item.tone}`}
                                >
                                    {item.initials}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-bold text-scholarly-navy">
                                        {item.name}
                                    </p>
                                    <p className="truncate text-xs text-scholarly-slate-light">
                                        {item.provider}
                                    </p>
                                </div>
                                <div className="hidden text-right sm:block">
                                    <p className="text-xs font-semibold text-scholarly-navy">
                                        {item.level}
                                    </p>
                                    <p className="text-xs text-scholarly-slate-light">
                                        {item.country}
                                    </p>
                                </div>
                                <ChevronRight className="size-4 text-scholarly-slate-light" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
