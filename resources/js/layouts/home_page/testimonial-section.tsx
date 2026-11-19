import { MessageCircle } from 'lucide-react';

import type { HomeTestimonial } from '@/types/domain';
import SectionIntro from './section-intro';

const toneClasses = {
    blue: 'bg-scholarly-blue-soft text-scholarly-blue',
    teal: 'bg-scholarly-teal-soft text-scholarly-teal-dark',
    coral: 'bg-scholarly-coral-soft text-scholarly-coral-dark',
    gold: 'bg-scholarly-gold-soft text-scholarly-gold-dark',
};

export default function TestimonialSection({
    testimonials,
}: {
    testimonials: HomeTestimonial[];
}) {
    if (testimonials.length === 0) {
        return null;
    }

    return (
        <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-10 lg:py-32">
            <SectionIntro
                align="center"
                eyebrow="What learners say"
                title="Stories from the Scholarly community."
                body="Real learners sharing how discovery, guided tools, and mentorship moved their applications forward."
            />
            <div className="mt-12 grid gap-5 md:grid-cols-3">
                {testimonials.map((testimonial) => (
                    <figure
                        key={testimonial.id}
                        className="flex flex-col rounded-3xl border border-scholarly-border bg-white p-7"
                    >
                        <div className="flex size-11 items-center justify-center rounded-full bg-scholarly-blue-soft text-scholarly-blue">
                            <MessageCircle className="size-5" />
                        </div>
                        <blockquote className="mt-5 flex-1 text-sm leading-7 text-scholarly-navy">
                            “{testimonial.quote}”
                        </blockquote>
                        <figcaption className="mt-6 flex items-center gap-3 border-t border-scholarly-border-soft pt-5">
                            <span
                                className={`flex size-11 items-center justify-center rounded-full text-sm font-bold ${toneClasses[testimonial.tone]}`}
                            >
                                {testimonial.initials}
                            </span>
                            <span>
                                <span className="block text-sm font-bold text-scholarly-navy">
                                    {testimonial.authorName}
                                </span>
                                {testimonial.authorDetail !== null && (
                                    <span className="mt-0.5 block text-xs text-scholarly-slate-light">
                                        {testimonial.authorDetail}
                                    </span>
                                )}
                            </span>
                        </figcaption>
                    </figure>
                ))}
            </div>
        </section>
    );
}
