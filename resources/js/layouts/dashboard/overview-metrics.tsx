import { Bookmark, CalendarDays, FileText, UserRound } from 'lucide-react';

import MetricCard from './metric-card';

export default function OverviewMetrics() {
    return (
        <section
            className="grid grid-cols-2 gap-4 xl:grid-cols-4"
            aria-label="Dashboard overview"
        >
            <MetricCard
                icon={Bookmark}
                label="Saved scholarships"
                value="12"
                tone="blue"
            />
            <MetricCard
                icon={FileText}
                label="Applications in progress"
                value="4"
                tone="teal"
            />
            <MetricCard
                icon={UserRound}
                label="Profile completion"
                value="82%"
                tone="coral"
            />
            <MetricCard
                icon={CalendarDays}
                label="Upcoming deadlines"
                value="3"
                tone="gold"
            />
        </section>
    );
}
