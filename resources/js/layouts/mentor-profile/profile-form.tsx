import { useForm } from '@inertiajs/react';
import { Camera, Save, Video } from 'lucide-react';
import { useRef, useState } from 'react';
import type { FormEvent } from 'react';

import type { MentorOwnProfileProps } from '@/types/domain';

type Props = Pick<MentorOwnProfileProps, 'profile' | 'options'>;

const inputClass =
    'mt-1.5 h-11 w-full rounded-lg border border-scholarly-border bg-scholarly-blue-white px-3 text-sm text-scholarly-navy outline-none focus:border-scholarly-blue focus:ring-4 focus:ring-scholarly-blue-soft';
const textAreaClass =
    'mt-1.5 w-full rounded-lg border border-scholarly-border bg-scholarly-blue-white px-3 py-2.5 text-sm leading-6 text-scholarly-navy outline-none focus:border-scholarly-blue focus:ring-4 focus:ring-scholarly-blue-soft';
const labelClass =
    'text-xs font-bold tracking-[0.12em] text-scholarly-slate uppercase';

export default function MentorProfileForm({ profile, options }: Props) {
    const avatarInput = useRef<HTMLInputElement>(null);
    const videoInput = useRef<HTMLInputElement>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [videoName, setVideoName] = useState<string | null>(null);

    const form = useForm({
        name: profile.name,
        headline: profile.headline,
        current_role: profile.current_role,
        organization: profile.organization,
        country_id: profile.country_id,
        bio: profile.bio,
        languages: profile.languages,
        years_experience: profile.years_experience,
        linkedin_url: profile.linkedin_url,
        website_url: profile.website_url,
        availability_status: profile.availability_status,
        avatar: null as File | null,
        intro_video: null as File | null,
    });

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        form.transform((data) => {
            const { avatar, intro_video, ...rest } = data;

            return {
                ...rest,
                _method: 'patch',
                ...(avatar ? { avatar } : {}),
                ...(intro_video ? { intro_video } : {}),
            };
        });

        form.post('/mentor-profile', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setAvatarPreview(null);
                setVideoName(null);
                if (avatarInput.current) {
                    avatarInput.current.value = '';
                }
                if (videoInput.current) {
                    videoInput.current.value = '';
                }
            },
        });
    };

    const initials = profile.name
        .split(' ')
        .map((part) => part[0])
        .filter(Boolean)
        .slice(0, 2)
        .join('')
        .toUpperCase();

    const avatarSrc = avatarPreview ?? profile.avatar_url;

    return (
        <section className="rounded-2xl border border-scholarly-border bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-6 border-b border-scholarly-border pb-7 sm:flex-row sm:items-center">
                <div className="relative">
                    {avatarSrc ? (
                        <img
                            src={avatarSrc}
                            alt={profile.name}
                            className="size-24 rounded-3xl object-cover"
                        />
                    ) : (
                        <div className="flex size-24 items-center justify-center rounded-3xl bg-scholarly-blue text-2xl font-bold text-white">
                            {initials || 'M'}
                        </div>
                    )}
                    <input
                        ref={avatarInput}
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        className="sr-only"
                        onChange={(event) => {
                            const file = event.target.files?.[0] ?? null;
                            form.setData('avatar', file);

                            if (file) {
                                setAvatarPreview(URL.createObjectURL(file));
                            }
                        }}
                    />
                    <button
                        type="button"
                        onClick={() => avatarInput.current?.click()}
                        aria-label="Change profile photo"
                        className="absolute -right-2 -bottom-2 flex size-8 items-center justify-center rounded-full border-2 border-white bg-scholarly-navy text-white"
                    >
                        <Camera className="size-3.5" />
                    </button>
                </div>
                <div className="min-w-0">
                    <h2 className="text-2xl font-bold">{profile.name}</h2>
                    <p className="mt-1 text-sm text-scholarly-slate">
                        {[profile.current_role, profile.organization]
                            .filter(Boolean)
                            .join(' · ') || 'Add your role and organization'}
                    </p>
                    {form.errors.avatar && (
                        <p className="mt-1 text-xs text-scholarly-coral-dark">
                            {form.errors.avatar}
                        </p>
                    )}

                    <input
                        ref={videoInput}
                        type="file"
                        accept="video/mp4,video/quicktime,video/webm"
                        className="sr-only"
                        onChange={(event) => {
                            const file = event.target.files?.[0] ?? null;
                            form.setData('intro_video', file);
                            setVideoName(file?.name ?? null);
                        }}
                    />
                    <button
                        type="button"
                        onClick={() => videoInput.current?.click()}
                        className="mt-3 inline-flex items-center gap-2 rounded-lg border border-scholarly-border px-3 py-2 text-xs font-bold text-scholarly-slate transition hover:border-scholarly-blue hover:text-scholarly-blue"
                    >
                        <Video className="size-3.5" />
                        {videoName ??
                            (profile.intro_video_url
                                ? 'Replace intro video'
                                : 'Upload intro video')}
                    </button>
                    {form.errors.intro_video && (
                        <p className="mt-1 text-xs text-scholarly-coral-dark">
                            {form.errors.intro_video}
                        </p>
                    )}
                </div>
            </div>

            <form onSubmit={submit} className="mt-7 grid gap-5 sm:grid-cols-2">
                <label className="block">
                    <span className={labelClass}>Display name</span>
                    <input
                        value={form.data.name}
                        onChange={(event) =>
                            form.setData('name', event.target.value)
                        }
                        className={inputClass}
                    />
                    {form.errors.name && (
                        <p className="mt-1 text-xs text-scholarly-coral-dark">
                            {form.errors.name}
                        </p>
                    )}
                </label>

                <label className="block">
                    <span className={labelClass}>Headline</span>
                    <input
                        value={form.data.headline}
                        onChange={(event) =>
                            form.setData('headline', event.target.value)
                        }
                        placeholder="Graduate admissions mentor for UK scholarships"
                        className={inputClass}
                    />
                    {form.errors.headline && (
                        <p className="mt-1 text-xs text-scholarly-coral-dark">
                            {form.errors.headline}
                        </p>
                    )}
                </label>

                <label className="block">
                    <span className={labelClass}>Current role</span>
                    <input
                        value={form.data.current_role}
                        onChange={(event) =>
                            form.setData('current_role', event.target.value)
                        }
                        placeholder="Graduate Admissions Mentor"
                        className={inputClass}
                    />
                </label>

                <label className="block">
                    <span className={labelClass}>Organization</span>
                    <input
                        value={form.data.organization}
                        onChange={(event) =>
                            form.setData('organization', event.target.value)
                        }
                        placeholder="University of Cambridge"
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
                    <span className={labelClass}>Availability</span>
                    <select
                        value={form.data.availability_status}
                        onChange={(event) =>
                            form.setData(
                                'availability_status',
                                event.target
                                    .value as typeof form.data.availability_status,
                            )
                        }
                        className={inputClass}
                    >
                        {options.availabilityStatuses.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="block">
                    <span className={labelClass}>Years of experience</span>
                    <input
                        type="number"
                        min={0}
                        max={60}
                        value={form.data.years_experience}
                        onChange={(event) =>
                            form.setData('years_experience', event.target.value)
                        }
                        className={inputClass}
                    />
                </label>

                <label className="block">
                    <span className={labelClass}>Languages</span>
                    <input
                        value={form.data.languages}
                        onChange={(event) =>
                            form.setData('languages', event.target.value)
                        }
                        placeholder="English, French"
                        className={inputClass}
                    />
                    <span className="mt-1 block text-[11px] text-scholarly-slate-light">
                        Separate languages with commas.
                    </span>
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

                <label className="block sm:col-span-2">
                    <span className={labelClass}>About you</span>
                    <textarea
                        value={form.data.bio}
                        onChange={(event) =>
                            form.setData('bio', event.target.value)
                        }
                        rows={5}
                        placeholder="Share how you help learners and what you have been through."
                        className={textAreaClass}
                    />
                    {form.errors.bio && (
                        <p className="mt-1 text-xs text-scholarly-coral-dark">
                            {form.errors.bio}
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
