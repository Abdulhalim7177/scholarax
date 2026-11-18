import { useForm } from '@inertiajs/react';
import { Save } from 'lucide-react';
import type { FormEvent } from 'react';

import type {
    ScholarshipFilterOptions,
    StudentProfileRecord,
} from '@/types/domain';

type Props = {
    profile: StudentProfileRecord | null;
    options: ScholarshipFilterOptions;
};

const inputClass =
    'mt-1.5 h-11 w-full rounded-lg border border-scholarly-border bg-scholarly-blue-white px-3 text-sm text-scholarly-navy outline-none focus:border-scholarly-blue focus:ring-4 focus:ring-scholarly-blue-soft';
const textAreaClass =
    'mt-1.5 w-full rounded-lg border border-scholarly-border bg-scholarly-blue-white px-3 py-2.5 text-sm leading-6 text-scholarly-navy outline-none focus:border-scholarly-blue focus:ring-4 focus:ring-scholarly-blue-soft';
const labelClass =
    'text-xs font-bold tracking-[0.12em] text-scholarly-slate uppercase';

export default function ProfileForm({ profile, options }: Props) {
    const form = useForm({
        headline: profile?.headline ?? '',
        bio: profile?.bio ?? '',
        date_of_birth: profile?.date_of_birth ?? '',
        city: profile?.city ?? '',
        country_id: profile?.country_id ?? '',
        linkedin_url: profile?.linkedin_url ?? '',
        website_url: profile?.website_url ?? '',
        target_level_id: profile?.target_level_id ?? '',
        target_field_id: profile?.target_field_id ?? '',
    });

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        form.patch('/profile', { preserveScroll: true });
    };

    return (
        <section className="rounded-2xl border border-scholarly-border bg-white p-6 shadow-sm">
            <div>
                <h2 className="text-xl font-bold">Scholarship profile</h2>
                <p className="mt-1 text-sm text-scholarly-slate">
                    These details power your applications and scholarship
                    matches.
                </p>
            </div>

            <form onSubmit={submit} className="mt-5 grid gap-5 sm:grid-cols-2">
                <label className="block sm:col-span-2">
                    <span className={labelClass}>Headline</span>
                    <input
                        value={form.data.headline}
                        onChange={(event) =>
                            form.setData('headline', event.target.value)
                        }
                        placeholder="Aspiring policy analyst and future Chevening scholar"
                        className={inputClass}
                    />
                    {form.errors.headline && (
                        <p className="mt-1 text-xs text-scholarly-coral-dark">
                            {form.errors.headline}
                        </p>
                    )}
                </label>

                <label className="block sm:col-span-2">
                    <span className={labelClass}>Bio</span>
                    <textarea
                        value={form.data.bio}
                        onChange={(event) =>
                            form.setData('bio', event.target.value)
                        }
                        rows={4}
                        placeholder="Tell your story in a few sentences."
                        className={textAreaClass}
                    />
                    {form.errors.bio && (
                        <p className="mt-1 text-xs text-scholarly-coral-dark">
                            {form.errors.bio}
                        </p>
                    )}
                </label>

                <label className="block">
                    <span className={labelClass}>Date of birth</span>
                    <input
                        type="date"
                        value={form.data.date_of_birth}
                        onChange={(event) =>
                            form.setData('date_of_birth', event.target.value)
                        }
                        className={inputClass}
                    />
                    {form.errors.date_of_birth && (
                        <p className="mt-1 text-xs text-scholarly-coral-dark">
                            {form.errors.date_of_birth}
                        </p>
                    )}
                </label>

                <label className="block">
                    <span className={labelClass}>City</span>
                    <input
                        value={form.data.city}
                        onChange={(event) =>
                            form.setData('city', event.target.value)
                        }
                        placeholder="Lagos"
                        className={inputClass}
                    />
                </label>

                <label className="block">
                    <span className={labelClass}>Country</span>
                    <select
                        value={form.data.country_id}
                        onChange={(event) =>
                            form.setData('country_id', event.target.value)
                        }
                        className={inputClass}
                    >
                        <option value="">Select a country</option>
                        {options.countries.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="block">
                    <span className={labelClass}>Target study level</span>
                    <select
                        value={form.data.target_level_id}
                        onChange={(event) =>
                            form.setData('target_level_id', event.target.value)
                        }
                        className={inputClass}
                    >
                        <option value="">Select a level</option>
                        {options.levels.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="block">
                    <span className={labelClass}>Target field</span>
                    <select
                        value={form.data.target_field_id}
                        onChange={(event) =>
                            form.setData('target_field_id', event.target.value)
                        }
                        className={inputClass}
                    >
                        <option value="">Select a field</option>
                        {options.fields.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="block">
                    <span className={labelClass}>LinkedIn</span>
                    <input
                        value={form.data.linkedin_url}
                        onChange={(event) =>
                            form.setData('linkedin_url', event.target.value)
                        }
                        placeholder="https://www.linkedin.com/in/…"
                        className={inputClass}
                    />
                    {form.errors.linkedin_url && (
                        <p className="mt-1 text-xs text-scholarly-coral-dark">
                            {form.errors.linkedin_url}
                        </p>
                    )}
                </label>

                <label className="block">
                    <span className={labelClass}>Website</span>
                    <input
                        value={form.data.website_url}
                        onChange={(event) =>
                            form.setData('website_url', event.target.value)
                        }
                        placeholder="https://…"
                        className={inputClass}
                    />
                    {form.errors.website_url && (
                        <p className="mt-1 text-xs text-scholarly-coral-dark">
                            {form.errors.website_url}
                        </p>
                    )}
                </label>

                <div className="sm:col-span-2">
                    <button
                        type="submit"
                        disabled={form.processing}
                        className="inline-flex h-11 items-center gap-2 rounded-xl bg-scholarly-blue px-5 text-sm font-bold text-white transition hover:bg-scholarly-blue-dark disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Save className="size-4" /> Save profile
                    </button>
                </div>
            </form>
        </section>
    );
}
