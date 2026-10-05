import { ArrowRight } from 'lucide-react';

import { features } from './data';
import SectionIntro from './section-intro';

export default function FeaturesSection() {
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
                {features.map(({ icon: Icon, title, body, tone }) => (
                    <div
                        key={title}
                        className="group rounded-3xl border border-scholarly-border bg-white p-7 transition hover:border-scholarly-border-strong "
                    >
                        <div
                            className={`mb-8 flex size-12 items-center justify-center rounded-2xl ${tone === 'blue' ? 'bg-scholarly-blue-soft text-scholarly-blue' : tone === 'gold' ? 'bg-scholarly-gold-soft text-scholarly-gold-dark' : 'bg-scholarly-coral-soft text-scholarly-coral-dark'}`}
                        >
                            <Icon className="size-6" />
                        </div>
                        <h3 className="text-lg font-bold text-scholarly-navy">
                            {title}
                        </h3>
                        <p className="mt-3 min-h-14 text-sm leading-6 text-scholarly-slate">
                            {body}
                        </p>
                        <a
                            href="#scholarships"
                            className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-scholarly-blue"
                        >
                            Learn more{' '}
                            <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                        </a>
                    </div>
                ))}
            </div>
        </section>
    );
}
