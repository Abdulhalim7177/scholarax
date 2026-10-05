import { dashboard } from '@/routes';
import type { LucideIcon } from 'lucide-react';

export type HomePageProps = {
    auth?: {
        user?: { name?: string } | null;
    };
    currentTeam?: { slug: string } | null;
    dashboardUrl: string | ReturnType<typeof dashboard>;
};

export type Feature = {
    icon: LucideIcon;
    title: string;
    body: string;
    tone: 'blue' | 'gold' | 'coral';
};
