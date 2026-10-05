import { Link } from '@inertiajs/react';
import { ArrowRight, Check, Star } from 'lucide-react';

import { register } from '@/routes';
import type { HomePageProps } from './types';

export default function HeroSection({ auth, dashboardUrl }: HomePageProps) {
    return (
        <section className="relative isolate min-h-[720px] overflow-hidden bg-scholarly-blue-white pt-32 sm:min-h-[760px] sm:pt-40 lg:min-h-[760px] lg:pt-44">
            <div className="absolute top-20 -left-40 -z-10 size-[500px] rounded-full bg-scholarly-sky/70 blur-3xl" />
            <div className="absolute -right-36 bottom-0 -z-10 size-[520px] rounded-full bg-white blur-3xl" />
            <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-10 lg:pb-24">
                <div className="relative z-10 max-w-xl">
                    <div className="mb-5 inline-flex -rotate-2 items-center gap-2 text-scholarly-gold">
                        <span className="font-handwritten text-[27px] leading-none">
                            Your next scholarship starts here
                        </span>
                        <svg
                            viewBox="0 0 42 24"
                            className="mt-4 h-6 w-10"
                            aria-hidden="true"
                        >
                            <path
                                d="M2 4c12 2 18 7 25 16M19 17l8 3-2-8"
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                            />
                        </svg>
                    </div>
                    <h1 className="max-w-xl font-display text-[54px] leading-[0.98] tracking-[-0.055em] text-scholarly-navy sm:text-[72px]">
                        Find scholarships.
                        <br />
                        <span className="text-scholarly-blue">
                            Build your future.
                        </span>
                    </h1>
                    <p className="mt-7 max-w-lg text-[17px] leading-8 text-scholarly-slate">
                        Discover global opportunities, create a stronger
                        application, and get guidance from mentors — all in one
                        place.
                    </p>
                    <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                        <a
                            href="#scholarships"
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-scholarly-blue px-6 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-scholarly-blue-dark hover:text-scholarly-gold"
                        >
                            Explore scholarships{' '}
                            <ArrowRight className="size-4" />
                        </a>
                        <Link
                            href={auth?.user ? dashboardUrl : register()}
                            className="inline-flex items-center justify-center rounded-full  bg-scholarly-gold/90 px-6 py-3.5 text-sm font-bold text-scholarly-navy transition hover:border-scholarly-blue hover:bg-scholarly-gold/90 hover:text-scholarly-blue"
                        >
                            Get started
                        </Link>
                    </div>
                    <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-semibold text-scholarly-slate">
                        <span className="inline-flex items-center gap-2">
                            <Check className="size-4 text-scholarly-teal" />{' '}
                            Free to explore
                        </span>
                        <span className="inline-flex items-center gap-2">
                            <Check className="size-4 text-scholarly-teal" />{' '}
                            Built for global learners
                        </span>
                    </div>
                </div>
                <div className="relative mx-auto w-full max-w-[650px] lg:justify-self-end">
                    <div className="absolute top-1/2 left-1/2 size-[min(76vw,520px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-scholarly-border-strong bg-scholarly-blue-soft" />
                    <div className="absolute top-[3%] right-[6%] rounded-2xl border border-white bg-white px-4 py-3 shadow-xl">
                        <div className="flex items-center gap-2">
                            <span className="size-2 rounded-full bg-scholarly-teal" />
                            <span className="text-xs font-bold text-scholarly-navy">
                                190+ countries
                            </span>
                        </div>
                    </div>
                    <div className="relative mx-auto aspect-[1.1/0.85] max-w-[590px] overflow-hidden rounded-[42%_58%_48%_52%/48%_42%_58%_52%] bg-gradient-to-br from-scholarly-sky-strong via-scholarly-sky to-white shadow-xl">
                        <div className="absolute inset-x-[16%] top-[20%] bottom-0 rounded-t-[45%] bg-scholarly-skin-light" />
                        <div className="absolute top-[17%] left-[23%] h-[28%] w-[19%] rounded-[50%_50%_45%_45%] bg-scholarly-navy-dark" />
                        <div className="absolute top-[31%] left-[22%] h-[53%] w-[21%] rounded-t-[45%] bg-scholarly-blue" />
                        <div className="absolute top-[19%] left-[40%] h-[34%] w-[25%] rounded-[48%] bg-scholarly-skin-dark" />
                        <div className="absolute top-[38%] left-[39%] h-[50%] w-[27%] rounded-t-[48%] bg-scholarly-gold" />
                        <div className="absolute top-[24%] right-[18%] h-[30%] w-[22%] rounded-[50%] bg-scholarly-skin-mid" />
                        <div className="absolute top-[42%] right-[16%] h-[48%] w-[25%] rounded-t-[48%] bg-scholarly-navy" />
                        <div className="absolute bottom-[12%] left-[8%] rounded-2xl border border-white/80 bg-white/90 px-4 py-3 shadow-lg backdrop-blur">
                            <p className="text-[10px] font-bold tracking-wider text-scholarly-blue uppercase">
                                Study abroad
                            </p>
                            <p className="mt-1 text-sm font-bold text-scholarly-navy">
                                A brighter future
                            </p>
                        </div>
                    </div>
                    <div className="absolute bottom-[6%] left-[-3%] rounded-2xl border border-scholarly-border bg-white p-4 shadow-lg">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-xl bg-scholarly-gold-soft text-scholarly-gold-dark">
                                <Star className="size-5 fill-current" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-scholarly-navy">
                                    Chevening
                                </p>
                                <p className="text-[11px] text-scholarly-slate">
                                    Fully funded · UK
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="absolute right-[-2%] bottom-[16%] rounded-2xl border border-scholarly-border bg-white p-4 shadow-lg">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-xl bg-scholarly-teal-soft text-scholarly-teal">
                                <Check className="size-5" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-scholarly-navy">
                                    Profile complete
                                </p>
                                <p className="text-[11px] text-scholarly-slate">
                                    Ready to apply
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
