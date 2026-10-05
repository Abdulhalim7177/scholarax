import { BookOpen, Globe2, UsersRound } from 'lucide-react';

export default function ImpactStrip() {
    return (
        <section className="mt-15  bg-white">
            <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-scholarly-border-soft px-5 py-7 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-8 lg:px-10">
                {[
                    ['500,000+', 'students supported', UsersRound],
                    ['190+', 'countries', Globe2],
                    ['2,500+', 'scholarship programs', BookOpen],
                ].map(([value, label, Icon]) => {
                    const MetricIcon = Icon as typeof UsersRound;
                    return (
                        <div
                            key={String(label)}
                            className="flex items-center justify-center gap-4 py-4 sm:py-1"
                        >
                            <MetricIcon
                                className="size-7 text-scholarly-blue"
                                strokeWidth={1.8}
                            />
                            <div>
                                <p className="text-xl font-bold tracking-tight text-scholarly-navy">
                                    {value as string}
                                </p>
                                <p className="text-xs font-semibold text-scholarly-slate">
                                    {label as string}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
