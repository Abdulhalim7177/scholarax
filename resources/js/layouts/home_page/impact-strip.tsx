import { homeIcon } from '@/lib/home-icons';
import type { HomeImpactStat } from '@/types/domain';

type ImpactStripProps = {
    stats: HomeImpactStat[];
};

const compactNumber = new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1,
});

export default function ImpactStrip({ stats }: ImpactStripProps) {
    if (stats.length === 0) {
        return null;
    }

    return (
        <section className="mt-15 bg-white">
            <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-scholarly-border-soft px-5 py-7 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-8 lg:px-10">
                {stats.map((stat) => {
                    const MetricIcon = homeIcon(stat.icon);

                    return (
                        <div
                            key={stat.key}
                            className="flex items-center justify-center gap-4 py-4 sm:py-1"
                        >
                            <MetricIcon
                                className="size-7 text-scholarly-blue"
                                strokeWidth={1.8}
                            />
                            <div>
                                <p className="text-xl font-bold tracking-tight text-scholarly-navy">
                                    {compactNumber.format(stat.value)}
                                </p>
                                <p className="text-xs font-semibold text-scholarly-slate">
                                    {stat.label}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
