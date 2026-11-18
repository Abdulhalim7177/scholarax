import { Bookmark, CalendarDays, FileText, UserRound } from 'lucide-react';

import MetricCard from './metric-card';
import type { DashboardMetrics } from '@/types/domain';

type Props = {
    metrics: DashboardMetrics;
};

export default function OverviewMetrics({ metrics }: Props) {
    return (
        <section
            className="grid grid-cols-2 gap-4 xl:grid-cols-4"
            aria-label="Dashboard overview"
        >
            <MetricCard
                icon={Bookmark}
                label="Saved scholarships"
                value={String(metrics.savedScholarships)}
                tone="blue"
            />
            <MetricCard
                icon={FileText}
                label="Applications in progress"
                value={String(metrics.applicationsInProgress)}
                tone="teal"
            />
            <MetricCard
                icon={UserRound}
                label="Profile completion"
                value={`${metrics.profileCompletion}%`}
                tone="coral"
            />
            <MetricCard
                icon={CalendarDays}
                label="Upcoming deadlines"
                value={String(metrics.upcomingDeadlines)}
                tone="gold"
            />
        </section>
    );
}
