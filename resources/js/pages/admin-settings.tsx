import { Head, Link, useForm, usePage } from '@inertiajs/react';
import {
    Bell,
    Check,
    Database,
    LockKeyhole,
    Save,
    ShieldCheck,
    SlidersHorizontal,
} from 'lucide-react';

import type { FormEvent } from 'react';

import { relativeTime } from '@/lib/format';
import type { AdminSettingsProps, PlatformSettingValues } from '@/types/domain';
import type { User } from '@/types';

const toggles: Array<{
    key: keyof Pick<
        PlatformSettingValues,
        | 'require_mentor_verification'
        | 'review_new_scholarships'
        | 'report_notifications'
        | 'weekly_platform_digest'
    >;
    label: string;
    note: string;
}> = [
    {
        key: 'require_mentor_verification',
        label: 'Require mentor verification',
        note: 'Mentors must be approved before appearing in search.',
    },
    {
        key: 'review_new_scholarships',
        label: 'Review new scholarships',
        note: 'Hold new scholarship listings for admin review.',
    },
    {
        key: 'report_notifications',
        label: 'Report notifications',
        note: 'Notify admins when content is reported by a user.',
    },
    {
        key: 'weekly_platform_digest',
        label: 'Weekly platform digest',
        note: 'Send a summary of growth and moderation activity.',
    },
];

export default function AdminSettings({
    settings,
    options,
    updatedAt,
}: AdminSettingsProps) {
    const { auth } = usePage().props as { auth?: { user?: User } };
    const form = useForm<PlatformSettingValues>(settings);

    const submit = (event?: FormEvent<HTMLFormElement>) => {
        event?.preventDefault();
        form.patch('/admin-settings', { preserveScroll: true });
    };

    return (
        <>
            <Head title="Admin settings" />
            <div className="min-h-screen bg-scholarly-blue-white p-4 text-scholarly-navy sm:p-6 lg:p-8">
                <div className="mx-auto max-w-5xl space-y-7">
                    <header className="flex flex-col gap-5 border-b border-scholarly-border pb-6 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-sm font-semibold text-scholarly-blue">
                                Platform controls
                            </p>
                            <h1 className="mt-2 font-display text-4xl tracking-[-0.03em] sm:text-5xl">
                                Settings
                            </h1>
                            <p className="mt-3 text-sm leading-6 text-scholarly-slate">
                                Set the rules and defaults that keep the admin
                                workspace consistent.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => submit()}
                            disabled={form.processing}
                            className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-xl bg-scholarly-blue px-4 text-sm font-bold text-white hover:bg-scholarly-blue-dark disabled:opacity-60 sm:self-auto"
                        >
                            <Save className="size-4" />{' '}
                            {form.recentlySuccessful
                                ? 'Saved'
                                : form.processing
                                  ? 'Saving…'
                                  : 'Save changes'}
                        </button>
                    </header>
                    <form
                        onSubmit={submit}
                        className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]"
                    >
                        <div className="space-y-6">
                            <section className="rounded-2xl border border-scholarly-border bg-white p-6 shadow-sm">
                                <div className="flex items-start gap-3 border-b border-scholarly-border pb-5">
                                    <div className="flex size-10 items-center justify-center rounded-xl bg-scholarly-blue-soft text-scholarly-blue">
                                        <SlidersHorizontal className="size-5" />
                                    </div>
                                    <div>
                                        <h2 className="font-bold">
                                            Platform preferences
                                        </h2>
                                        <p className="mt-1 text-xs leading-5 text-scholarly-slate">
                                            Choose how new content and people
                                            move through Scholarly.
                                        </p>
                                    </div>
                                </div>
                                <div className="divide-y divide-scholarly-border-soft">
                                    {toggles.map((item) => {
                                        const enabled = form.data[item.key];

                                        return (
                                            <div
                                                key={item.key}
                                                className="flex items-center justify-between gap-5 py-4 first:pt-5 last:pb-0"
                                            >
                                                <div>
                                                    <p className="text-sm font-semibold">
                                                        {item.label}
                                                    </p>
                                                    <p className="mt-1 text-xs leading-5 text-scholarly-slate">
                                                        {item.note}
                                                    </p>
                                                    {form.errors[item.key] && (
                                                        <p className="mt-1 text-xs font-semibold text-scholarly-coral-dark">
                                                            {
                                                                form.errors[
                                                                    item.key
                                                                ]
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                                <button
                                                    type="button"
                                                    role="switch"
                                                    aria-checked={enabled}
                                                    aria-label={item.label}
                                                    onClick={() =>
                                                        form.setData(
                                                            item.key,
                                                            !enabled,
                                                        )
                                                    }
                                                    className={`relative h-6 w-11 shrink-0 rounded-full transition ${enabled ? 'bg-scholarly-blue' : 'bg-scholarly-border-strong'}`}
                                                >
                                                    <span
                                                        className={`absolute top-1 size-4 rounded-full bg-white shadow-sm transition ${enabled ? 'left-6' : 'left-1'}`}
                                                    />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                            <section className="rounded-2xl border border-scholarly-border bg-white p-6 shadow-sm">
                                <div className="flex items-start gap-3">
                                    <div className="flex size-10 items-center justify-center rounded-xl bg-scholarly-teal-soft text-scholarly-teal-dark">
                                        <Database className="size-5" />
                                    </div>
                                    <div>
                                        <h2 className="font-bold">
                                            Data and privacy
                                        </h2>
                                        <p className="mt-1 text-xs leading-5 text-scholarly-slate">
                                            Manage platform data defaults and
                                            retention behaviour.
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                                    <label className="block">
                                        <span className="mb-2 block text-xs font-bold">
                                            Default timezone
                                        </span>
                                        <select
                                            value={form.data.default_timezone}
                                            onChange={(event) =>
                                                form.setData(
                                                    'default_timezone',
                                                    event.target.value,
                                                )
                                            }
                                            className="h-11 w-full rounded-lg border border-scholarly-border bg-scholarly-blue-white px-3 text-sm"
                                        >
                                            {options.timezones.map((option) => (
                                                <option
                                                    key={option.value}
                                                    value={option.value}
                                                >
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        {form.errors.default_timezone && (
                                            <p className="mt-1 text-xs font-semibold text-scholarly-coral-dark">
                                                {form.errors.default_timezone}
                                            </p>
                                        )}
                                    </label>
                                    <label className="block">
                                        <span className="mb-2 block text-xs font-bold">
                                            Application data retention
                                        </span>
                                        <select
                                            value={String(
                                                form.data
                                                    .application_data_retention_months,
                                            )}
                                            onChange={(event) =>
                                                form.setData(
                                                    'application_data_retention_months',
                                                    Number(event.target.value),
                                                )
                                            }
                                            className="h-11 w-full rounded-lg border border-scholarly-border bg-scholarly-blue-white px-3 text-sm"
                                        >
                                            {options.retention.map((option) => (
                                                <option
                                                    key={option.value}
                                                    value={option.value}
                                                >
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        {form.errors
                                            .application_data_retention_months && (
                                            <p className="mt-1 text-xs font-semibold text-scholarly-coral-dark">
                                                {
                                                    form.errors
                                                        .application_data_retention_months
                                                }
                                            </p>
                                        )}
                                    </label>
                                </div>
                                {updatedAt !== null && (
                                    <p className="mt-4 text-xs text-scholarly-slate">
                                        Last updated {relativeTime(updatedAt)}
                                    </p>
                                )}
                            </section>
                        </div>
                        <aside className="space-y-6">
                            <section className="rounded-2xl border border-scholarly-border bg-scholarly-navy p-6 text-white shadow-sm">
                                <ShieldCheck className="size-6 text-scholarly-gold" />
                                <h2 className="mt-5 font-display text-2xl">
                                    Admin access
                                </h2>
                                <p className="mt-2 text-sm leading-6 text-white/65">
                                    You are managing platform-wide settings.
                                    Changes are recorded for accountability.
                                </p>
                                <div className="mt-6 border-t border-white/10 pt-5">
                                    <p className="text-xs text-white/55">
                                        Signed in as
                                    </p>
                                    <p className="mt-1 text-sm font-bold">
                                        {auth?.user?.name ?? 'Administrator'}
                                    </p>
                                </div>
                            </section>
                            <section className="rounded-2xl border border-scholarly-border bg-white p-6 shadow-sm">
                                <Bell className="size-5 text-scholarly-blue" />
                                <h2 className="mt-4 font-bold">
                                    Notification health
                                </h2>
                                <p className="mt-2 text-xs leading-5 text-scholarly-slate">
                                    Admin notification preferences are applied
                                    to platform events.
                                </p>
                                <div className="mt-4 flex items-center gap-2 text-xs font-bold text-scholarly-teal-dark">
                                    <Check className="size-4" />{' '}
                                    {form.data.report_notifications
                                        ? 'Report alerts active'
                                        : 'Report alerts paused'}
                                </div>
                            </section>
                            <section className="rounded-2xl border border-scholarly-border bg-white p-6 shadow-sm">
                                <LockKeyhole className="size-5 text-scholarly-coral-dark" />
                                <h2 className="mt-4 font-bold">Security</h2>
                                <p className="mt-2 text-xs leading-5 text-scholarly-slate">
                                    Review admin access and authentication
                                    controls.
                                </p>
                                <Link
                                    href="/settings/security"
                                    className="mt-4 inline-block text-xs font-bold text-scholarly-blue"
                                >
                                    Manage security
                                </Link>
                            </section>
                        </aside>
                    </form>
                </div>
            </div>
        </>
    );
}

AdminSettings.layout = () => ({
    breadcrumbs: [{ title: 'Settings', href: '/admin-settings' }],
});
