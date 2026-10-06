import { Bell, ChevronRight } from 'lucide-react';

import SectionIntro from './section-intro';

export default function DeadlineSection() {
    return (
        <section className="bg-scholarly-gold/20 py-20 sm:py-24">
            <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:px-10">
                <div className="flex justify-center">
                    <div className="w-full max-w-[330px] rounded-3xl  bg-white p-5 shadow-xl">
                        <div className="flex items-center justify-between">
                            <ChevronRight className="size-4 rotate-180 text-scholarly-slate-light" />
                            <p className="text-sm font-bold text-scholarly-navy">
                                April 2026
                            </p>
                            <ChevronRight className="size-4 text-scholarly-slate-light" />
                        </div>
                        <div className="mt-5 grid grid-cols-7 gap-2 text-center text-[10px] font-semibold text-scholarly-slate-light">
                            <span>Sun</span>
                            <span>Mon</span>
                            <span>Tue</span>
                            <span>Wed</span>
                            <span>Thu</span>
                            <span>Fri</span>
                            <span>Sat</span>
                            {Array.from({ length: 35 }, (_, index) => (
                                <span
                                    key={index}
                                    className={`flex size-7 items-center justify-center rounded-full ${index === 17 ? 'bg-scholarly-blue font-bold text-white' : index === 24 ? 'bg-scholarly-gold-soft font-bold text-scholarly-gold-dark' : 'text-scholarly-slate'}`}
                                >
                                    {((index + 29) % 30) + 1}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
                <div>
                    <SectionIntro
                        eyebrow="Stay on track"
                        title="Never miss a deadline."
                        body="Get personalized reminders for application deadlines, interviews, and important updates."
                    />
                    <button
                        type="button"
                        className="mt-8 inline-flex items-center gap-2 rounded-full bg-scholarly-blue px-6 py-3.5 text-sm font-bold text-white transition hover:bg-scholarly-blue-white hover:text-scholarly-blue"
                    >
                        <Bell className="size-4" /> Set up deadline alerts
                    </button>
                </div>
            </div>
        </section>
    );
}
