import { Link } from '@inertiajs/react';
import { ArrowRight, Sparkles } from 'lucide-react';

import type { DashboardFocus } from '@/types/domain';

type Props = {
    focus: DashboardFocus;
};

export default function MomentumCta({ focus }: Props) {
    return (
        <section className="flex flex-col items-start justify-between gap-5 overflow-hidden rounded-2xl bg-scholarly-navy p-7 text-white sm:flex-row sm:items-center sm:p-10">
            <div>
                <div className="flex items-center gap-3">
                    <div className="flex size-11 items-center justify-center rounded-xl bg-scholarly-blue/30 text-scholarly-sky">
                        <Sparkles className="size-5" />
                    </div>
                    <h2 className="font-display text-3xl">
                        Keep your momentum going
                    </h2>
                </div>
                <p className="mt-3 max-w-xl text-sm leading-6 text-scholarly-navy-muted">
                    {focus.title} — {focus.body}
                </p>
            </div>
            <Link
                href={focus.href}
                className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-scholarly-blue px-5 py-3 text-sm font-bold text-white transition hover:bg-scholarly-blue-hover"
            >
                {focus.action} <ArrowRight className="size-4" />
            </Link>
        </section>
    );
}
