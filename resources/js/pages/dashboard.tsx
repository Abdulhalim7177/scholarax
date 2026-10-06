import { Head, usePage } from '@inertiajs/react';

import ActivityCard from '@/layouts/dashboard/activity-card';
import ApplicationOverview from '@/layouts/dashboard/application-overview';
import ApplicationStrength from '@/layouts/dashboard/application-strength';
import DashboardHeader from '@/layouts/dashboard/dashboard-header';
import MomentumCta from '@/layouts/dashboard/momentum-cta';
import OverviewMetrics from '@/layouts/dashboard/overview-metrics';
import SavedScholarships from '@/layouts/dashboard/saved-scholarships';
import TasksCard from '@/layouts/dashboard/tasks-card';

type PageProps = {
    auth?: { user?: { name?: string } | null };
};

export default function Dashboard() {
    const { auth } = usePage<PageProps>().props;
    const firstName = auth?.user?.name?.split(' ')[0] ?? 'Amina';

    return (
        <>
            <Head title="Dashboard" />
            <div className="min-h-screen bg-scholarly-blue-white p-4 text-scholarly-navy sm:p-6 lg:p-8">
                <div className="mx-auto max-w-7xl space-y-6">
                    <DashboardHeader firstName={firstName} />
                    <OverviewMetrics />
                    <ApplicationOverview />
                    <ApplicationStrength />
                    <SavedScholarships />
                    <section className="grid gap-6 lg:grid-cols-2">
                        <ActivityCard />
                        <TasksCard />
                    </section>
                    <MomentumCta />
                </div>
            </div>
        </>
    );
}

Dashboard.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
    ],
});
