import { Search, SlidersHorizontal } from 'lucide-react';

type ScholarshipsHeaderProps = {
    query: string;
    onQueryChange: (value: string) => void;
    onOpenFilters: () => void;
};

export default function ScholarshipsHeader({
    query,
    onQueryChange,
    onOpenFilters,
}: ScholarshipsHeaderProps) {
    return (
        <header className="flex flex-col gap-6 border-b border-scholarly-border pb-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
                <p className="mb-2 text-sm font-semibold text-scholarly-blue">
                    Explore your next opportunity
                </p>
                <h1 className="font-display text-4xl tracking-[-0.03em] text-scholarly-navy sm:text-5xl">
                    Find scholarships
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-scholarly-slate sm:text-base">
                    Discover funding opportunities matched to your goals, field,
                    and study plans.
                </p>
            </div>
            <div className="flex w-full gap-2 lg:max-w-md">
                <label className="relative block flex-1">
                    <span className="sr-only">Search scholarships</span>
                    <Search className="text-scholarly-slate-light pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2" />
                    <input
                        value={query}
                        onChange={(event) => onQueryChange(event.target.value)}
                        placeholder="Search by scholarship, country, or field"
                        className="placeholder:text-scholarly-slate-light focus:ring-scholarly-blue-soft h-12 w-full rounded-xl border border-scholarly-border bg-white pr-4 pl-11 text-sm text-scholarly-navy transition outline-none focus:border-scholarly-blue focus:ring-4"
                    />
                </label>
                <button
                    type="button"
                    onClick={onOpenFilters}
                    className="inline-flex h-12 shrink-0 items-center gap-2 rounded-xl border border-scholarly-border bg-white px-4 text-sm font-semibold text-scholarly-navy transition hover:border-scholarly-blue hover:text-scholarly-blue lg:hidden"
                >
                    <SlidersHorizontal className="size-4" />
                    Filters
                </button>
            </div>
        </header>
    );
}
