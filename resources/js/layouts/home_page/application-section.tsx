import { Check, Sparkles } from 'lucide-react';

import type { HomeApplicationPreview, HomeContentBlock } from '@/types/domain';
import SectionIntro from './section-intro';

type ApplicationSectionProps = {
    steps: HomeContentBlock[];
    preview: HomeApplicationPreview;
};

export default function ApplicationSection({
    steps,
    preview,
}: ApplicationSectionProps) {
    return (
        <section
            id="application"
            className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-10 lg:py-32"
        >
            <div className="grid items-center gap-14 lg:grid-cols-2">
                <div>
                    <SectionIntro
                        eyebrow="Build your best application"
                        title="Turn your story into a stronger application."
                        body="Use guided tools to shape a polished CV and a statement of purpose that sounds like you."
                    />
                    <div className="mt-9 flex flex-wrap gap-3 text-sm font-semibold text-scholarly-slate">
                        <span className="inline-flex items-center gap-2 rounded-full bg-scholarly-teal-soft px-4 py-2 text-scholarly-teal-dark">
                            <Check className="size-4" /> Guided templates
                        </span>
                        <span className="inline-flex items-center gap-2 rounded-full bg-scholarly-blue-soft px-4 py-2 text-scholarly-blue">
                            <Check className="size-4" /> Mentor feedback
                        </span>
                    </div>
                </div>
                <div className="rounded-[30px] bg-scholarly-navy p-4 shadow-xl sm:p-6">
                    <div className="rounded-2xl bg-white p-5 sm:p-7">
                        <div className="flex items-center justify-between border-b border-scholarly-border-soft pb-5">
                            <div>
                                <p className="text-xs font-bold tracking-wider text-scholarly-blue uppercase">
                                    My application
                                </p>
                                <p className="mt-1 text-lg font-bold text-scholarly-navy">
                                    Build your profile
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-scholarly-blue">
                                    {preview.progress}%
                                </p>
                                <p className="text-[11px] font-semibold text-scholarly-slate-light">
                                    complete
                                </p>
                            </div>
                        </div>
                        <div className="mt-6 h-2 rounded-full bg-scholarly-blue-soft">
                            <div
                                className="h-2 rounded-full bg-scholarly-blue"
                                style={{ width: `${preview.progress}%` }}
                            />
                        </div>
                        <div className="mt-7 grid gap-3 sm:grid-cols-2">
                            {steps.map((step, index) => {
                                const complete = index < preview.completedSteps;

                                return (
                                    <div
                                        key={step.id}
                                        className={`flex items-center gap-3 rounded-xl border p-3 ${complete ? 'border-scholarly-teal-border bg-scholarly-teal-white' : 'border-scholarly-border'}`}
                                    >
                                        <span
                                            className={`flex size-7 items-center justify-center rounded-full text-xs font-bold ${complete ? 'bg-scholarly-teal text-white' : 'bg-scholarly-blue-soft text-scholarly-blue'}`}
                                        >
                                            {complete ? (
                                                <Check className="size-4" />
                                            ) : (
                                                index + 1
                                            )}
                                        </span>
                                        <span className="text-xs font-bold text-scholarly-navy">
                                            {step.title}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="mt-7 flex items-center gap-3 rounded-xl bg-scholarly-blue-white p-4">
                            <Sparkles className="size-5 text-scholarly-gold" />
                            <p className="text-xs leading-5 font-semibold text-scholarly-slate">
                                {preview.completedSteps >= preview.totalSteps
                                    ? 'Your application is complete. Review it once more before you submit.'
                                    : 'You’re making progress. Keep going to unlock your next step.'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
