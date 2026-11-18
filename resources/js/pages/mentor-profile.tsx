import { Head, Link } from '@inertiajs/react';
import { ArrowUpRight, Eye, GraduationCap, Sparkles } from 'lucide-react';

import CompletionCard from '@/layouts/student-profile/completion-card';
import MentorAvailabilitySection from '@/layouts/mentor-profile/availability-section';
import MentorExpertiseSection from '@/layouts/mentor-profile/expertise-section';
import MentorProfileForm from '@/layouts/mentor-profile/profile-form';
import VerificationBanner from '@/layouts/mentor-profile/verification-banner';
import type { MentorOwnProfileProps } from '@/types/domain';

export default function MentorProfile({
    profile,
    verification,
    expertise,
    availableExpertise,
    slots,
    options,
    completion,
    publicUrl,
}: MentorOwnProfileProps) {
    return (
        <>
            <Head title="Mentor profile" />
            <div className="min-h-screen bg-scholarly-blue-white p-4 text-scholarly-navy sm:p-6 lg:p-8">
                <div className="mx-auto max-w-6xl space-y-6">
                    <header className="flex flex-col justify-between gap-4 border-b border-scholarly-border pb-6 sm:flex-row sm:items-end">
                        <div>
                            <p className="flex items-center gap-2 text-sm font-semibold text-scholarly-blue">
                                <Sparkles className="size-4" /> How learners
                                find you
                            </p>
                            <h1 className="mt-2 font-display text-4xl tracking-[-0.03em] sm:text-5xl">
                                Mentor profile
                            </h1>
                            <p className="mt-2 max-w-2xl text-sm leading-6 text-scholarly-slate">
                                Keep your profile clear, human, and easy for the
                                right learners to recognise.
                            </p>
                        </div>
                        <Link
                            href={publicUrl}
                            className="inline-flex h-11 items-center gap-2 rounded-xl border border-scholarly-border bg-white px-4 text-sm font-bold text-scholarly-navy transition hover:border-scholarly-blue hover:text-scholarly-blue"
                        >
                            <Eye className="size-4" /> Preview public profile
                            <ArrowUpRight className="size-3.5" />
                        </Link>
                    </header>

                    <VerificationBanner verification={verification} />

                    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                        <div className="space-y-6">
                            <MentorProfileForm
                                profile={profile}
                                options={options}
                            />
                            <MentorExpertiseSection
                                expertise={expertise}
                                availableExpertise={availableExpertise}
                            />
                            <MentorAvailabilitySection
                                slots={slots}
                                weekdays={options.weekdays}
                            />
                        </div>
                        <aside className="space-y-6">
                            <CompletionCard completion={completion} />
                            <section className="rounded-2xl border border-scholarly-border bg-white p-6 shadow-sm">
                                <GraduationCap className="size-5 text-scholarly-blue" />
                                <h2 className="mt-4 text-lg font-bold">
                                    Make a strong first impression
                                </h2>
                                <ul className="mt-3 space-y-2 text-xs leading-5 text-scholarly-slate">
                                    <li>
                                        Lead with the scholarships and study
                                        fields you know best.
                                    </li>
                                    <li>
                                        Keep your headline specific — it is what
                                        learners scan first.
                                    </li>
                                    <li>
                                        Add availability so learners know when
                                        to reach out.
                                    </li>
                                </ul>
                            </section>
                        </aside>
                    </div>
                </div>
            </div>
        </>
    );
}

MentorProfile.layout = () => ({
    breadcrumbs: [{ title: 'Mentor profile', href: '/mentor-profile' }],
});
