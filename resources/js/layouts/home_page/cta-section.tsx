import { Link } from '@inertiajs/react';
import { ArrowRight, Sparkles } from 'lucide-react';

import { register } from '@/routes';
import type { HomePageProps } from './types';

export default function CtaSection({ auth, dashboardUrl }: HomePageProps) {
    return (
        <section className="px-5 pb-20 sm:px-8 lg:px-10">
            <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 overflow-hidden rounded-[32px] bg-scholarly-navy px-7 py-12 sm:px-12 lg:flex-row lg:items-center lg:px-16 lg:py-14">
                <div>
                    <div className="mb-4 inline-flex items-center gap-2 text-scholarly-gold">
                        <Sparkles className="size-4" />
                        <span className="text-xs font-bold tracking-[0.2em] uppercase">
                            Your future is worth the effort
                        </span>
                    </div>
                    <h2 className="font-display text-4xl leading-tight tracking-[-0.04em] text-white sm:text-5xl">
                        Your next chapter
                        <br />
                        starts here.
                    </h2>
                    <p className="mt-4 max-w-md text-sm leading-6 text-scholarly-navy-muted">
                        Join a global community of ambitious learners and take
                        your first step toward the opportunity you want.
                    </p>
                </div>
                <Link
                    href={auth?.user ? dashboardUrl : register()}
                    className="inline-flex shrink-0 items-center gap-2 rounded-full bg-scholarly-blue px-6 py-3.5 text-sm font-bold text-white transition hover:bg-scholarly-blue-hover"
                >
                    Create your free profile <ArrowRight className="size-4" />
                </Link>
            </div>
        </section>
    );
}
