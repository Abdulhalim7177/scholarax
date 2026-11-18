import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

import StrengthCard from './strength-card';
import type { DashboardStrength } from '@/types/domain';

type Props = {
    strength: DashboardStrength;
};

const profileCaption = (score: number) =>
    score >= 80
        ? 'Strong foundation'
        : score >= 50
          ? 'Good progress'
          : 'Needs attention';

const applicationCaption = (score: number) =>
    score >= 80
        ? 'Almost there'
        : score >= 50
          ? 'Building momentum'
          : 'Just getting started';

export default function ApplicationStrength({ strength }: Props) {
    const { profile, application } = strength;

    return (
        <section className="rounded-2xl border border-scholarly-border bg-white p-6 shadow-sm">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                    <h2 className="text-xl font-bold">
                        Your application strength
                    </h2>
                    <p className="mt-1 text-sm text-scholarly-slate">
                        Based on your profile, tasks, and documents.
                    </p>
                </div>
                <Link
                    href="/profile"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-scholarly-blue px-4 py-2.5 text-sm font-bold text-scholarly-blue transition hover:bg-scholarly-blue-white"
                >
                    Improve my profile <ArrowRight className="size-4" />
                </Link>
            </div>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
                <StrengthCard
                    title="Profile strength"
                    score={`${profile.score}%`}
                    caption={profileCaption(profile.score)}
                    body={`${profile.completed} of ${profile.total} profile checks complete.`}
                    tone="teal"
                />
                <StrengthCard
                    title="Application strength"
                    score={`${application.score}%`}
                    caption={applicationCaption(application.score)}
                    body={`${application.tasksCompleted}/${application.tasksTotal} tasks and ${application.documentsComplete}/${application.documentsTotal} documents complete.`}
                    tone="blue"
                />
            </div>
        </section>
    );
}
