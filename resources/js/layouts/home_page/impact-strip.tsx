import { BookOpen, Globe2, UsersRound } from 'lucide-react';

type ImpactStripProps = {
    scholarshipCount: number;
    countryCount: number;
    studentCount: number;
};

const compactNumber = new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1,
});

export default function ImpactStrip({
    scholarshipCount,
    countryCount,
    studentCount,
}: ImpactStripProps) {
    const metrics = [
        {
            value: compactNumber.format(studentCount),
            label: 'students supported',
            icon: UsersRound,
        },
        {
            value: compactNumber.format(countryCount),
            label: 'countries',
            icon: Globe2,
        },
        {
            value: compactNumber.format(scholarshipCount),
            label: 'scholarship programs',
            icon: BookOpen,
        },
    ];

    return (
        <section className="mt-15 bg-white">
            <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-scholarly-border-soft px-5 py-7 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-8 lg:px-10">
                {metrics.map(({ value, label, icon: MetricIcon }) => (
                    <div
                        key={label}
                        className="flex items-center justify-center gap-4 py-4 sm:py-1"
                    >
                        <MetricIcon
                            className="size-7 text-scholarly-blue"
                            strokeWidth={1.8}
                        />
                        <div>
                            <p className="text-xl font-bold tracking-tight text-scholarly-navy">
                                {value}
                            </p>
                            <p className="text-xs font-semibold text-scholarly-slate">
                                {label}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
