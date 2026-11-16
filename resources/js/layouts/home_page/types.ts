import dashboardRoutes from '@/routes/dashboard';
import type { LucideIcon } from 'lucide-react';

export type HomePageProps = {
    auth?: {
        user?: { name?: string } | null;
    };
    currentTeam?: { slug: string } | null;
    dashboardUrl: string | ReturnType<typeof dashboardRoutes.simple>;
};

export type Feature = {
    icon: LucideIcon;
    title: string;
    body: string;
    tone: 'blue' | 'gold' | 'coral';
};
