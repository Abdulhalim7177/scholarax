import { Check, RotateCcw } from 'lucide-react';

type FiltersPanelProps = {
    country: string;
    level: string;
    field: string;
    fundingOnly: boolean;
    countries: string[];
    levels: string[];
    fields: string[];
    onCountryChange: (value: string) => void;
    onLevelChange: (value: string) => void;
    onFieldChange: (value: string) => void;
    onFundingOnlyChange: (value: boolean) => void;
    onReset: () => void;
    mobile?: boolean;
};

export default function FiltersPanel({
    country,
    level,
    field,
    fundingOnly,
    countries,
    levels,
    fields,
    onCountryChange,
    onLevelChange,
    onFieldChange,
    onFundingOnlyChange,
    onReset,
    mobile = false,
}: FiltersPanelProps) {
    return (
        <aside
            className={
                mobile
                    ? 'rounded-2xl border border-scholarly-border bg-white p-5'
                    : 'sticky top-6 rounded-2xl border border-scholarly-border bg-white p-5'
            }
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-bold text-scholarly-navy">
                        Refine results
                    </p>
                    <p className="mt-1 text-xs text-scholarly-slate">
                        Find the right fit faster.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onReset}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-scholarly-blue hover:text-scholarly-blue-dark"
                >
                    <RotateCcw className="size-3" />
                    Reset
                </button>
            </div>

            <div className="mt-6 space-y-5">
                <label className="block">
                    <span className="mb-2 block text-xs font-bold tracking-[0.12em] text-scholarly-slate uppercase">
                        Destination
                    </span>
                    <select
                        value={country}
                        onChange={(event) =>
                            onCountryChange(event.target.value)
                        }
                        className="h-11 w-full rounded-lg border border-scholarly-border bg-scholarly-blue-white px-3 text-sm text-scholarly-navy outline-none focus:border-scholarly-blue focus:ring-4 focus:ring-scholarly-blue-soft"
                    >
                        {countries.map((option) => (
                            <option key={option}>{option}</option>
                        ))}
                    </select>
                </label>
                <label className="block">
                    <span className="mb-2 block text-xs font-bold tracking-[0.12em] text-scholarly-slate uppercase">
                        Study level
                    </span>
                    <select
                        value={level}
                        onChange={(event) => onLevelChange(event.target.value)}
                        className="h-11 w-full rounded-lg border border-scholarly-border bg-scholarly-blue-white px-3 text-sm text-scholarly-navy outline-none focus:border-scholarly-blue focus:ring-4 focus:ring-scholarly-blue-soft"
                    >
                        {levels.map((option) => (
                            <option key={option}>{option}</option>
                        ))}
                    </select>
                </label>
                <label className="block">
                    <span className="mb-2 block text-xs font-bold tracking-[0.12em] text-scholarly-slate uppercase">
                        Field of study
                    </span>
                    <select
                        value={field}
                        onChange={(event) => onFieldChange(event.target.value)}
                        className="h-11 w-full rounded-lg border border-scholarly-border bg-scholarly-blue-white px-3 text-sm text-scholarly-navy outline-none focus:border-scholarly-blue focus:ring-4 focus:ring-scholarly-blue-soft"
                    >
                        {fields.map((option) => (
                            <option key={option}>{option}</option>
                        ))}
                    </select>
                </label>
                <button
                    type="button"
                    onClick={() => onFundingOnlyChange(!fundingOnly)}
                    className="flex w-full items-center gap-3 text-left text-sm text-scholarly-navy"
                >
                    <span
                        className={`flex size-5 items-center justify-center rounded-md border transition ${fundingOnly ? 'border-scholarly-blue bg-scholarly-blue text-white' : 'border-scholarly-border bg-white'}`}
                    >
                        {fundingOnly && <Check className="size-3.5" />}
                    </span>
                    <span>
                        <span className="block font-semibold">
                            Fully funded only
                        </span>
                        <span className="block text-xs text-scholarly-slate">
                            Tuition, living costs, or both.
                        </span>
                    </span>
                </button>
            </div>
        </aside>
    );
}
