import SectionIntro from './section-intro';

export default function ProcessSection() {
    return (
        <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-10 lg:py-32">
            <SectionIntro
                align="center"
                eyebrow="Your application, step by step"
                title="A clearer path to your next chapter."
                body="From your first search to your final submission, keep every important step in one calm, organized place."
            />
            <div className="mt-14 grid gap-6 md:grid-cols-3">
                {[
                    [
                        '01',
                        'Discover',
                        'Find scholarships that match your goals and background.',
                        'bg-scholarly-teal-soft',
                        'text-scholarly-teal',
                    ],
                    [
                        '02',
                        'Prepare',
                        'Build a strong application with guided tools and support.',
                        'bg-scholarly-blue-soft',
                        'text-scholarly-blue',
                    ],
                    [
                        '03',
                        'Apply with confidence',
                        'Submit on time and keep track of every deadline.',
                        'bg-scholarly-coral-soft',
                        'text-scholarly-coral-dark',
                    ],
                ].map(([number, title, body, bg, color]) => (
                    <div
                        key={number}
                        className="rounded-3xl border border-scholarly-border p-7"
                    >
                        <span
                            className={`flex size-12 items-center justify-center rounded-2xl text-sm font-bold ${bg} ${color}`}
                        >
                            {number}
                        </span>
                        <h3 className="mt-7 text-lg font-bold text-scholarly-navy">
                            {title}
                        </h3>
                        <p className="mt-3 text-sm leading-6 text-scholarly-slate">
                            {body}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}
