import { RotateCcw } from 'lucide-react';

type MentorFiltersProps = {
    expertise: string;
    country: string;
    availabilityOnly: boolean;
    expertiseOptions: string[];
    countryOptions: string[];
    onExpertiseChange: (value: string) => void;
    onCountryChange: (value: string) => void;
    onAvailabilityChange: (value: boolean) => void;
    onReset: () => void;
};

export default function MentorFilters({
    expertise,
    country,
    availabilityOnly,
    expertiseOptions,
    countryOptions,
    onExpertiseChange,
    onCountryChange,
    onAvailabilityChange,
    onReset,
}: MentorFiltersProps) {
    return (
        <aside className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm lg:sticky lg:top-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-bold text-scholarly-navy">
                        Find your fit
                    </p>
                    <p className="mt-1 text-xs text-scholarly-slate">
                        Filter by what matters to you.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onReset}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-scholarly-blue hover:text-scholarly-blue-dark"
                >
                    <RotateCcw className="size-3" /> Reset
                </button>
            </div>
            <div className="mt-6 space-y-5">
                <label className="block">
                    <span className="mb-2 block text-xs font-bold tracking-[0.12em] text-scholarly-slate uppercase">
                        Expertise
                    </span>
                    <select
                        value={expertise}
                        onChange={(event) =>
                            onExpertiseChange(event.target.value)
                        }
                        className="h-11 w-full rounded-lg border border-scholarly-border bg-scholarly-blue-white px-3 text-sm text-scholarly-navy outline-none focus:border-scholarly-blue focus:ring-4 focus:ring-scholarly-blue-soft"
                    >
                        {expertiseOptions.map((option) => (
                            <option key={option}>{option}</option>
                        ))}
                    </select>
                </label>
                <label className="block">
                    <span className="mb-2 block text-xs font-bold tracking-[0.12em] text-scholarly-slate uppercase">
                        Location
                    </span>
                    <select
                        value={country}
                        onChange={(event) =>
                            onCountryChange(event.target.value)
                        }
                        className="h-11 w-full rounded-lg border border-scholarly-border bg-scholarly-blue-white px-3 text-sm text-scholarly-navy outline-none focus:border-scholarly-blue focus:ring-4 focus:ring-scholarly-blue-soft"
                    >
                        {countryOptions.map((option) => (
                            <option key={option}>{option}</option>
                        ))}
                    </select>
                </label>
                <button
                    type="button"
                    onClick={() => onAvailabilityChange(!availabilityOnly)}
                    className="flex w-full items-center gap-3 text-left text-sm text-scholarly-navy"
                >
                    <span
                        className={`size-3 rounded-full ${availabilityOnly ? 'bg-scholarly-teal ring-4 ring-scholarly-teal-soft' : 'bg-scholarly-slate-light/40'}`}
                    />
                    <span>
                        <span className="block font-semibold">
                            Available to chat
                        </span>
                        <span className="block text-xs text-scholarly-slate">
                            Show mentors responding soon.
                        </span>
                    </span>
                </button>
            </div>
            <div className="mt-7 rounded-xl bg-scholarly-blue-white p-4">
                <p className="text-xs font-bold text-scholarly-navy">
                    A thoughtful match matters
                </p>
                <p className="mt-2 text-xs leading-5 text-scholarly-slate">
                    Choose someone who understands your target scholarship,
                    study field, or next application step.
                </p>
            </div>
        </aside>
    );
}
