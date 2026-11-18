import { Link } from '@inertiajs/react';
import { ArrowRight, BookOpen, Bookmark, MapPin } from 'lucide-react';

import type { ScholarshipSummary } from '@/types/domain';

type Props = {
    scholarships: ScholarshipSummary[];
};

export default function SavedScholarships({ scholarships }: Props) {
    return (
        <section className="rounded-2xl border border-scholarly-border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h2 className="text-xl font-bold">Saved scholarships</h2>
                    <p className="mt-1 text-sm text-scholarly-slate">
                        Opportunities you’re interested in.
                    </p>
                </div>
                <Link
                    href="/scholarships"
                    className="inline-flex items-center gap-1 text-sm font-bold text-scholarly-blue"
                >
                    See all scholarships <ArrowRight className="size-4" />
                </Link>
            </div>

            {scholarships.length > 0 ? (
                <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {scholarships.map((scholarship) => (
                        <div
                            key={scholarship.id}
                            className="flex flex-col rounded-2xl border border-scholarly-border p-4"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex size-11 items-center justify-center rounded-xl bg-scholarly-blue-soft font-bold text-scholarly-blue">
                                    {scholarship.title
                                        .slice(0, 2)
                                        .toUpperCase()}
                                </div>
                                <Bookmark className="size-5 fill-scholarly-gold text-scholarly-gold" />
                            </div>
                            <h3 className="mt-4 min-h-10 text-sm font-bold">
                                {scholarship.title}
                            </h3>
                            <div className="mt-3 space-y-2 text-xs text-scholarly-slate">
                                <p className="flex items-center gap-1.5">
                                    <MapPin className="size-3.5" />
                                    {scholarship.country}
                                </p>
                                <p className="flex items-center gap-1.5">
                                    <BookOpen className="size-3.5" />
                                    {scholarship.level}
                                </p>
                            </div>
                            <span className="mt-4 w-fit rounded-full bg-scholarly-teal-soft px-2.5 py-1 text-[11px] font-bold text-scholarly-teal">
                                {scholarship.funding}
                            </span>
                            <Link
                                href={`/scholarships/${scholarship.slug}`}
                                className="mt-5 inline-flex items-center justify-center gap-1 rounded-xl border border-scholarly-blue px-3 py-2 text-xs font-bold text-scholarly-blue transition hover:bg-scholarly-blue-white"
                            >
                                View scholarship{' '}
                                <ArrowRight className="size-3.5" />
                            </Link>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="mt-6 rounded-2xl border border-dashed border-scholarly-border-strong p-6 text-center">
                    <p className="text-sm font-bold text-scholarly-navy">
                        You haven’t saved any scholarships yet.
                    </p>
                    <p className="mx-auto mt-1 max-w-sm text-sm text-scholarly-slate">
                        Browse the catalogue and bookmark the opportunities you
                        want to revisit.
                    </p>
                    <Link
                        href="/scholarships"
                        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-scholarly-blue px-4 py-2.5 text-sm font-bold text-white"
                    >
                        Find scholarships <ArrowRight className="size-4" />
                    </Link>
                </div>
            )}
        </section>
    );
}
