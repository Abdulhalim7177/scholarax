import { Head, usePage } from '@inertiajs/react';

import CompletionCard from '@/layouts/student-profile/completion-card';
import EducationSection from '@/layouts/student-profile/education-section';
import ProfileForm from '@/layouts/student-profile/profile-form';
import TestScoresSection from '@/layouts/student-profile/test-scores-section';
import WorkExperienceSection from '@/layouts/student-profile/work-experience-section';
import type { StudentProfileProps } from '@/types/domain';
import type { Auth } from '@/types';

export default function StudentProfile() {
    const {
        auth,
        profile,
        educations,
        workExperiences,
        testScores,
        options,
        completion,
    } = usePage<StudentProfileProps & { auth: Auth }>().props;

    const firstName = auth?.user?.name?.split(' ')[0] ?? 'there';

    return (
        <>
            <Head title="My profile" />
            <div className="min-h-screen bg-scholarly-blue-white p-4 text-scholarly-navy sm:p-6 lg:p-8">
                <div className="mx-auto max-w-6xl space-y-6">
                    <header className="flex flex-col justify-between gap-4 border-b border-scholarly-border pb-6 sm:flex-row sm:items-end">
                        <div>
                            <p className="text-sm font-semibold tracking-[0.18em] text-scholarly-blue uppercase">
                                Your scholarship profile
                            </p>
                            <h1 className="mt-2 font-display text-4xl tracking-[-0.03em] sm:text-5xl">
                                Hi {firstName}, let’s build your story
                            </h1>
                            <p className="mt-2 max-w-2xl text-sm leading-6 text-scholarly-slate">
                                Keep your profile current so every application
                                and document pulls from the same source of
                                truth.
                            </p>
                        </div>
                    </header>

                    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                        <div className="space-y-6">
                            <ProfileForm profile={profile} options={options} />
                            <EducationSection educations={educations} />
                            <WorkExperienceSection
                                workExperiences={workExperiences}
                            />
                            <TestScoresSection testScores={testScores} />
                        </div>
                        <aside className="space-y-6">
                            <CompletionCard completion={completion} />
                        </aside>
                    </div>
                </div>
            </div>
        </>
    );
}

StudentProfile.layout = () => ({
    breadcrumbs: [{ title: 'My profile', href: '/profile' }],
});
