import { dashboard } from '@/routes';
import type { MentorSummary, ScholarshipSummary } from '@/types/domain';
import type { LucideIcon } from 'lucide-react';
export type HomePageProps = {
    auth?: {
        user?: { name?: string } | null;
    };
    currentTeam?: { slug: string } | null;
    dashboardUrl: string | ReturnType<typeof dashboard>;
    featuredScholarships?: ScholarshipSummary[];
    scholarshipCount?: number;
    countryCount?: number;
    studentCount?: number;
    featuredMentor?: MentorSummary | null;
};

export type Feature = {
    icon: LucideIcon;
    title: string;
    body: string;
    tone: 'blue' | 'gold' | 'coral';
};
