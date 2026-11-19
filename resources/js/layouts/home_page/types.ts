import type { dashboard } from '@/routes';
import type {
    HomeApplicationPreview,
    HomeContent,
    HomeDeadline,
    HomeImpactStat,
    HomeTestimonial,
    MentorSummary,
    ScholarshipSummary,
} from '@/types/domain';

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
    impactStats?: HomeImpactStat[];
    testimonials?: HomeTestimonial[];
    content?: HomeContent;
    applicationPreview?: HomeApplicationPreview;
    nextDeadline?: HomeDeadline | null;
};
