import { Link } from '@inertiajs/react';

import type { Paginated } from '@/types/domain';

type PaginationProps = {
    paginator: Paginated<unknown>;
};

export default function Pagination({ paginator }: PaginationProps) {
    if (paginator.last_page <= 1) {
        return null;
    }

    return (
        <nav
            aria-label="Scholarship pages"
            className="mt-8 flex flex-wrap items-center justify-center gap-2"
        >
            {paginator.links.map((link, index) => {
                const label =
                    index === 0
                        ? 'Previous'
                        : index === paginator.links.length - 1
                          ? 'Next'
                          : link.label;

                if (link.url === null) {
                    return (
                        <span
                            key={`${link.label}-${index}`}
                            className="rounded-lg border border-scholarly-border bg-white px-3 py-2 text-xs font-semibold text-scholarly-slate-light"
                        >
                            {label}
                        </span>
                    );
                }

                return (
                    <Link
                        key={`${link.label}-${index}`}
                        href={link.url}
                        preserveScroll
                        className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                            link.active
                                ? 'border-scholarly-blue bg-scholarly-blue text-white'
                                : 'border-scholarly-border bg-white text-scholarly-slate hover:border-scholarly-blue hover:text-scholarly-blue'
                        }`}
                    >
                        {label}
                    </Link>
                );
            })}
        </nav>
    );
}
