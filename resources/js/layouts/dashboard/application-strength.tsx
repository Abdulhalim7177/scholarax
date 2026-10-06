import { ArrowRight } from 'lucide-react';

import { ActionLink, comingSoon } from './action-link';
import StrengthCard from './strength-card';

export default function ApplicationStrength() {
    return (
        <section className="rounded-2xl border border-scholarly-border bg-white p-6 shadow-sm">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                    <h2 className="text-xl font-bold">
                        Your application strength
                    </h2>
                    <p className="mt-1 text-sm text-scholarly-slate">
                        Based on your profile, CV, and statement of purpose.
                    </p>
                </div>
                <ActionLink
                    href={comingSoon('Improve my application')}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-scholarly-blue px-4 py-2.5 text-sm font-bold text-scholarly-blue transition hover:bg-scholarly-blue-white"
                >
                    Improve my application <ArrowRight className="size-4" />
                </ActionLink>
            </div>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
                <StrengthCard
                    title="CV Strength"
                    score="92%"
                    caption="Strong foundation"
                    body="Your CV highlights your academic achievements well."
                    tone="teal"
                />
                <StrengthCard
                    title="SOP Strength"
                    score="84%"
                    caption="Add more personal detail"
                    body="Your SOP is compelling, with room for more personal stories."
                    tone="blue"
                />
            </div>
        </section>
    );
}
