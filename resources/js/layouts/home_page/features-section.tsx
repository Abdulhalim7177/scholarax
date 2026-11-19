import { ArrowRight } from 'lucide-react';

import { homeIcon } from '@/lib/home-icons';
import type { HomeContentBlock } from '@/types/domain';
import SectionIntro from './section-intro';

const toneClasses = {
    blue: 'bg-scholarly-blue-soft text-scholarly-blue',
    teal: 'bg-scholarly-teal-soft text-scholarly-teal-dark',
    coral: 'bg-scholarly-coral-soft text-scholarly-coral-dark',
    gold: 'bg-scholarly-gold-soft text-scholarly-gold-dark',
};

export default function FeaturesSection({
    features,
}: {
    features: HomeContentBlock[];
}) {
    if (features.length === 0) {
        return null;
    }

    return (
        <section
            id="resources"
            className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-10 lg:py-32"
        >
            <SectionIntro
                eyebrow="Everything you need"
                title="Move forward with confidence."
                body="A guided home for every part of your scholarship journey — from the first search to the final submission."
            />
            <div className="mt-12 grid gap-5 md:grid-cols-3">
                {features.map((feature) => {
                    const Icon = homeIcon(feature.icon);

                    return (
                        <div
                            key={feature.id}
                            className="group rounded-3xl border border-scholarly-border bg-white p-7 transition hover:border-scholarly-border-strong"
                        >
                            <div
                                className={`mb-8 flex size-12 items-center justify-center rounded-2xl ${toneClasses[feature.tone]}`}
                            >
                                <Icon className="size-6" />
                            </div>
                            <h3 className="text-lg font-bold text-scholarly-navy">
                                {feature.title}
                            </h3>
                            <p className="mt-3 min-h-14 text-sm leading-6 text-scholarly-slate">
                                {feature.body}
                            </p>
                            <a
                                href="#scholarships"
                                className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-scholarly-blue"
                            >
                                Learn more{' '}
                                <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                            </a>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
