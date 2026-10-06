import { Head, usePage } from '@inertiajs/react';

import ApplicationSection from '@/layouts/home_page/application-section';
import CtaSection from '@/layouts/home_page/cta-section';
import DeadlineSection from '@/layouts/home_page/deadline-section';
import FeaturesSection from '@/layouts/home_page/features-section';
import HeroSection from '@/layouts/home_page/hero-section';
import HomeHeader from '@/layouts/home_page/home-header';
import ImpactStrip from '@/layouts/home_page/impact-strip';
import MentorsSection from '@/layouts/home_page/mentors-section';
import ProcessSection from '@/layouts/home_page/process-section';
import ScholarshipSearchSection from '@/layouts/home_page/scholarship-search-section';
import SiteFooter from '@/layouts/home_page/site-footer';
import TestimonialSection from '@/layouts/home_page/testimonial-section';
import type { HomePageProps } from '@/layouts/home_page/types';

export default function Welcome() {
    const { auth, currentTeam } = usePage<HomePageProps>().props;
    const dashboardUrl = '/dashboard';
    const pageProps = { auth, currentTeam, dashboardUrl };

    return (
        <>
            <Head title="Find scholarships. Build your future." />
            <div className="min-h-screen overflow-hidden bg-white text-scholarly-navy">
                <HomeHeader {...pageProps} />
                <main>
                    <HeroSection {...pageProps} />
                    <ImpactStrip />
                    <FeaturesSection />
                    <ScholarshipSearchSection />
                    <ApplicationSection />
                    <MentorsSection />
                    <ProcessSection />
                    <DeadlineSection />
                    <TestimonialSection />
                    <CtaSection {...pageProps} />
                </main>
                <SiteFooter />
            </div>
        </>
    );
}
