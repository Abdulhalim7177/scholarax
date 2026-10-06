import type { LucideIcon } from 'lucide-react';

type Props = {
    icon: LucideIcon;
    label: string;
    value: string;
    tone: 'blue' | 'teal' | 'gold' | 'coral';
};

export default function MetricCard({ icon: Icon, label, value, tone }: Props) {
    const tones = {
        blue: 'bg-scholarly-blue-soft text-scholarly-blue',
        teal: 'bg-scholarly-teal-soft text-scholarly-teal',
        gold: 'bg-scholarly-gold-soft text-scholarly-gold-dark',
        coral: 'bg-scholarly-coral-soft text-scholarly-coral-dark',
    };

    return (
        <div className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm">
            <div
                className={`mb-4 flex size-11 items-center justify-center rounded-xl ${tones[tone]}`}
            >
                <Icon className="size-5" />
            </div>
            <p className="text-sm font-medium text-scholarly-slate">{label}</p>
            <p className="mt-1 text-3xl font-bold tracking-tight text-scholarly-navy">
                {value}
            </p>
        </div>
    );
}
