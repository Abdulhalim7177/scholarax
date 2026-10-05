import { MessageCircle } from 'lucide-react';

export default function TestimonialSection() {
    return (
        <section className="mx-auto max-w-4xl px-5 py-24 text-center sm:px-8 lg:py-32">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-scholarly-blue-soft text-scholarly-blue">
                <MessageCircle className="size-7" />
            </div>
            <p className="mt-7 text-[11px] font-bold tracking-[0.2em] text-scholarly-blue uppercase">
                What learners say
            </p>
            <blockquote className="mt-5 font-display text-3xl leading-tight tracking-[-0.035em] text-scholarly-navy sm:text-[43px]">
                “Scholarly made the entire process so much simpler. I found a
                scholarship I never knew about, improved my SOP with their
                tools, and got amazing advice from a mentor.”
            </blockquote>
            <div className="mt-8 flex items-center justify-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-full bg-scholarly-gold text-sm font-bold text-scholarly-navy">
                    DK
                </div>
                <div className="text-left">
                    <p className="text-sm font-bold text-scholarly-navy">
                        Daniel Kim
                    </p>
                    <p className="text-xs text-scholarly-slate-light">
                        Master’s in Computer Science, Canada
                    </p>
                </div>
            </div>
        </section>
    );
}
