import { ArrowRight, BookOpen, Bookmark, MapPin } from 'lucide-react';

import { ActionLink, comingSoon } from './action-link';
import { savedScholarships } from './data';

export default function SavedScholarships() {
    return (
        <section className="rounded-2xl border border-scholarly-border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h2 className="text-xl font-bold">Saved scholarships</h2>
                    <p className="mt-1 text-sm text-scholarly-slate">
                        Opportunities you’re interested in.
                    </p>
                </div>
                <ActionLink
                    href={comingSoon('All saved scholarships')}
                    className="inline-flex items-center gap-1 text-sm font-bold text-scholarly-blue"
                >
                    See all saved scholarships <ArrowRight className="size-4" />
                </ActionLink>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {savedScholarships.map((scholarship) => (
                    <div
                        key={scholarship.name}
                        className="flex flex-col rounded-2xl border border-scholarly-border p-4"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex size-11 items-center justify-center rounded-xl bg-scholarly-blue-soft font-bold text-scholarly-blue">
                                {scholarship.initials}
                            </div>
                            <Bookmark className="size-5 fill-scholarly-gold text-scholarly-gold" />
                        </div>
                        <h3 className="mt-4 min-h-10 text-sm font-bold">
                            {scholarship.name}
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
                        <span
                            className={`mt-4 w-fit rounded-full px-2.5 py-1 text-[11px] font-bold ${scholarship.tone === 'teal' ? 'bg-scholarly-teal-soft text-scholarly-teal' : 'bg-scholarly-gold-soft text-scholarly-gold-dark'}`}
                        >
                            {scholarship.status}
                        </span>
                        <ActionLink
                            href={comingSoon(scholarship.name)}
                            className="mt-5 inline-flex items-center justify-center gap-1 rounded-xl border border-scholarly-blue px-3 py-2 text-xs font-bold text-scholarly-blue transition hover:bg-scholarly-blue-white"
                        >
                            View scholarship <ArrowRight className="size-3.5" />
                        </ActionLink>
                    </div>
                ))}
            </div>
        </section>
    );
}
