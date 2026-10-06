import { ArrowRight, Star } from 'lucide-react';

import SectionIntro from './section-intro';

export default function MentorsSection() {
    return (
        <section
            id="mentors"
            className="bg-scholarly-gold-white py-24 sm:py-32"
        >
            <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10">
                <div className="order-2 lg:order-1">
                    <div className="relative rounded-[30px]  bg-white p-6 shadow-xl">
                        <div className="flex items-center gap-4">
                            <div className="flex size-14 items-center justify-center rounded-full bg-scholarly-sky text-lg font-bold text-scholarly-blue">
                                SM
                            </div>
                            <div>
                                <p className="font-bold text-scholarly-navy">
                                    Dr. Sarah Malik
                                </p>
                                <p className="text-xs text-scholarly-slate-light">
                                    Education consultant · United Kingdom
                                </p>
                                <div className="mt-1 flex items-center gap-1 text-scholarly-gold">
                                    <Star className="size-3.5 fill-current" />
                                    <Star className="size-3.5 fill-current" />
                                    <Star className="size-3.5 fill-current" />
                                    <Star className="size-3.5 fill-current" />
                                    <Star className="size-3.5 fill-current" />
                                    <span className="ml-1 text-[11px] font-semibold text-scholarly-slate-light">
                                        4.9 (120 reviews)
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-7 space-y-3">
                            <div className="ml-auto max-w-[78%] rounded-2xl rounded-br-md bg-scholarly-blue-soft p-4 text-xs leading-5 text-scholarly-navy">
                                I’m planning to apply for a Master’s in
                                Environmental Science. Could you give me some
                                advice on my SOP?
                            </div>
                            <div className="max-w-[78%] rounded-2xl rounded-bl-md bg-scholarly-blue-white p-4 text-xs leading-5 text-scholarly-slate">
                                Of course! I’d be happy to help. Let’s review
                                your draft and make it stronger together.
                            </div>
                        </div>
                        <div className="mt-6 flex flex-wrap gap-2">
                            <span className="rounded-full bg-scholarly-gold-soft px-3 py-1.5 text-[11px] font-bold text-scholarly-gold-dark">
                                SOP review
                            </span>
                            <span className="rounded-full bg-scholarly-blue-soft px-3 py-1.5 text-[11px] font-bold text-scholarly-blue">
                                Career advice
                            </span>
                            <span className="rounded-full bg-scholarly-coral-soft px-3 py-1.5 text-[11px] font-bold text-scholarly-coral-dark">
                                Study abroad
                            </span>
                        </div>
                    </div>
                </div>
                <div className="order-1 lg:order-2">
                    <SectionIntro
                        eyebrow="Real people. Real guidance."
                        title="Get guidance when it matters."
                        body="Connect with mentors who have been through the journey and can give your application the thoughtful review it deserves."
                    />
                    <a
                        href="#footer"
                        className="mt-8 inline-flex items-center gap-2 rounded-full bg-scholarly-blue px-6 py-3.5 text-sm font-bold text-white transition hover:bg-scholarly-blue-dark"
                    >
                        Meet our mentors <ArrowRight className="size-4" />
                    </a>
                </div>
            </div>
        </section>
    );
}
