import { ArrowRight, Sparkles } from 'lucide-react';

import { ActionLink, comingSoon } from './action-link';

export default function MomentumCta() {
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
                    Discover more scholarships, update your applications, and
                    get closer to your goals.
                </p>
            </div>
            <ActionLink
                href={comingSoon('Explore more scholarships')}
                className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-scholarly-blue px-5 py-3 text-sm font-bold text-white transition hover:bg-scholarly-blue-hover"
            >
                Explore more scholarships <ArrowRight className="size-4" />
            </ActionLink>
        </section>
    );
}
