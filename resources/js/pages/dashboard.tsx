import { Head, usePage } from '@inertiajs/react';

import ActivityCard from '@/layouts/dashboard/activity-card';
import ApplicationOverview from '@/layouts/dashboard/application-overview';
import ApplicationStrength from '@/layouts/dashboard/application-strength';
import DashboardHeader from '@/layouts/dashboard/dashboard-header';
import MomentumCta from '@/layouts/dashboard/momentum-cta';
import OverviewMetrics from '@/layouts/dashboard/overview-metrics';
import SavedScholarships from '@/layouts/dashboard/saved-scholarships';
import TasksCard from '@/layouts/dashboard/tasks-card';
import { dashboard } from '@/routes';
import type { StudentDashboardProps } from '@/types/domain';
import type { Auth } from '@/types';

export default function Dashboard() {
    const {
        auth,
        metrics,
        currentApplication,
        journey,
        strength,
        savedScholarships,
        deadlines,
        tasks,
        activity,
        focus,
    } = usePage<StudentDashboardProps & { auth: Auth }>().props;

    const firstName = auth?.user?.name?.split(' ')[0] ?? 'there';

    return (
        <>
            <Head title="Dashboard" />
            <div className="min-h-screen bg-scholarly-blue-white p-4 text-scholarly-navy sm:p-6 lg:p-8">
                <div className="mx-auto max-w-7xl space-y-6">
                    <DashboardHeader firstName={firstName} />
                    <OverviewMetrics metrics={metrics} />
                    <ApplicationOverview
                        currentApplication={currentApplication}
                        deadlines={deadlines}
                        journey={journey}
                    />
                    <ApplicationStrength strength={strength} />
                    <SavedScholarships scholarships={savedScholarships} />
                    <section className="grid gap-6 lg:grid-cols-2">
                        <ActivityCard activity={activity} />
                        <TasksCard tasks={tasks} />
                    </section>
                    <MomentumCta focus={focus} />
                </div>
            </div>
        </>
    );
}

Dashboard.layout = () => ({
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard.url(),
        },
    ],
});
