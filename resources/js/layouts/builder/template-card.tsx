import { Check, FileText } from 'lucide-react';

import type { BuilderTemplate } from './data';

type TemplateCardProps = {
    template: BuilderTemplate;
    selected: boolean;
    onSelect: () => void;
};

const accentClasses = {
    blue: 'bg-scholarly-blue-soft text-scholarly-blue',
    teal: 'bg-scholarly-teal-soft text-scholarly-teal-dark',
    gold: 'bg-scholarly-gold-soft text-scholarly-gold-dark',
};

export default function TemplateCard({
    template,
    selected,
    onSelect,
}: TemplateCardProps) {
    return (
        <button
            type="button"
            onClick={onSelect}
            className={`relative w-full rounded-xl border p-4 text-left transition ${selected ? 'border-scholarly-blue bg-scholarly-blue-white shadow-sm' : 'hover:border-scholarly-border-strong border-scholarly-border bg-white'}`}
        >
            {template.recommended && (
                <span className="absolute -top-2.5 right-3 rounded-full bg-scholarly-blue px-2.5 py-1 text-[10px] font-bold text-white">
                    Recommended
                </span>
            )}
            <div className="flex items-start gap-3">
                <span
                    className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${accentClasses[template.accent]}`}
                >
                    <FileText className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold text-scholarly-navy">
                        {template.name}
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-scholarly-slate">
                        {template.description}
                    </span>
                </span>
                <span
                    className={`flex size-5 shrink-0 items-center justify-center rounded-full border ${selected ? 'border-scholarly-blue bg-scholarly-blue text-white' : 'border-scholarly-border text-transparent'}`}
                >
                    <Check className="size-3" />
                </span>
            </div>
        </button>
    );
}
