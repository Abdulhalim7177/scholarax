import type { HomeContentBlock } from '@/types/domain';
import SectionIntro from './section-intro';

const toneClasses = {
    blue: ['bg-scholarly-blue-soft', 'text-scholarly-blue'],
    teal: ['bg-scholarly-teal-soft', 'text-scholarly-teal'],
    coral: ['bg-scholarly-coral-soft', 'text-scholarly-coral-dark'],
    gold: ['bg-scholarly-gold-soft', 'text-scholarly-gold-dark'],
} as const;

export default function ProcessSection({
    steps,
}: {
    steps: HomeContentBlock[];
}) {
    if (steps.length === 0) {
        return null;
    }

    return (
        <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-10 lg:py-32">
            <SectionIntro
                align="center"
                eyebrow="Your application, step by step"
                title="A clearer path to your next chapter."
                body="From your first search to your final submission, keep every important step in one calm, organized place."
            />
            <div className="mt-14 grid gap-6 md:grid-cols-3">
                {steps.map((step) => {
                    const [background, colour] = toneClasses[step.tone];

                    return (
                        <div
                            key={step.id}
                            className="rounded-3xl border border-scholarly-border p-7"
                        >
                            <span
                                className={`flex size-12 items-center justify-center rounded-2xl text-sm font-bold ${background} ${colour}`}
                            >
                                {step.badge ?? step.title.slice(0, 1)}
                            </span>
                            <h3 className="mt-7 text-lg font-bold text-scholarly-navy">
                                {step.title}
                            </h3>
                            <p className="mt-3 text-sm leading-6 text-scholarly-slate">
                                {step.body}
                            </p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
