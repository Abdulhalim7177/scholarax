import { Head, Link } from '@inertiajs/react';
import {
    Camera,
    Check,
    Globe2,
    GraduationCap,
    MapPin,
    Pencil,
    Plus,
    Save,
    Star,
} from 'lucide-react';
import { useState } from 'react';

export default function MentorProfile() {
    const [name, setName] = useState('Dr. Maya Chen');
    const [bio, setBio] = useState(
        'I help ambitious learners shape thoughtful scholarship applications, especially for UK programmes, public policy, and research-led degrees.',
    );
    const [saved, setSaved] = useState(false);
    return (
        <>
            <Head title="Mentor profile" />
            <div className="min-h-screen bg-scholarly-blue-white p-4 text-scholarly-navy sm:p-6 lg:p-8">
                <div className="mx-auto max-w-5xl space-y-7">
                    <header className="flex items-end justify-between border-b border-scholarly-border pb-6">
                        <div>
                            <p className="text-sm font-semibold text-scholarly-blue">
                                How learners find you
                            </p>
                            <h1 className="mt-2 font-display text-4xl tracking-[-0.03em] sm:text-5xl">
                                Mentor profile
                            </h1>
                            <p className="mt-3 text-sm leading-6 text-scholarly-slate">
                                Keep your profile clear, human, and easy for the
                                right learners to recognise.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setSaved(true)}
                            className="hidden h-11 items-center gap-2 rounded-xl bg-scholarly-blue px-4 text-sm font-bold text-white hover:bg-scholarly-blue-dark sm:inline-flex"
                        >
                            <Save className="size-4" />{' '}
                            {saved ? 'Saved' : 'Save changes'}
                        </button>
                    </header>
                    <section className="rounded-2xl border border-scholarly-border bg-white p-6 shadow-sm sm:p-8">
                        <div className="flex flex-col gap-6 border-b border-scholarly-border pb-7 sm:flex-row sm:items-center">
                            <div className="relative">
                                <div className="flex size-24 items-center justify-center rounded-3xl bg-scholarly-blue text-2xl font-bold text-white">
                                    MC
                                </div>
                                <button
                                    type="button"
                                    aria-label="Change profile photo"
                                    className="absolute -right-2 -bottom-2 flex size-8 items-center justify-center rounded-full border-2 border-white bg-scholarly-navy text-white"
                                >
                                    <Camera className="size-3.5" />
                                </button>
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h2 className="text-2xl font-bold">
                                        {name}
                                    </h2>
                                    <Check className="size-4 rounded-full bg-scholarly-teal p-0.5 text-white" />
                                </div>
                                <p className="mt-1 text-sm text-scholarly-slate">
                                    Graduate Admissions Mentor · University of
                                    Cambridge
                                </p>
                                <div className="mt-3 flex flex-wrap gap-4 text-xs text-scholarly-slate">
                                    <span className="inline-flex items-center gap-1.5">
                                        <MapPin className="size-3.5" /> United
                                        Kingdom
                                    </span>
                                    <span className="inline-flex items-center gap-1.5">
                                        <Star className="size-3.5 fill-scholarly-gold text-scholarly-gold" />{' '}
                                        4.9 rating
                                    </span>
                                    <span className="inline-flex items-center gap-1.5">
                                        <Globe2 className="size-3.5" /> English
                                        · Mandarin
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="grid gap-5 py-7 md:grid-cols-2">
                            <label className="block">
                                <span className="mb-2 block text-xs font-bold">
                                    Display name
                                </span>
                                <input
                                    value={name}
                                    onChange={(event) =>
                                        setName(event.target.value)
                                    }
                                    className="h-11 w-full rounded-lg border border-scholarly-border bg-scholarly-blue-white px-3 text-sm outline-none focus:border-scholarly-blue"
                                />
                            </label>
                            <label className="block">
                                <span className="mb-2 block text-xs font-bold">
                                    Role / headline
                                </span>
                                <input
                                    defaultValue="Graduate Admissions Mentor"
                                    className="h-11 w-full rounded-lg border border-scholarly-border bg-scholarly-blue-white px-3 text-sm outline-none focus:border-scholarly-blue"
                                />
                            </label>
                            <label className="block md:col-span-2">
                                <span className="mb-2 block text-xs font-bold">
                                    About you
                                </span>
                                <textarea
                                    value={bio}
                                    onChange={(event) =>
                                        setBio(event.target.value)
                                    }
                                    rows={4}
                                    className="w-full resize-none rounded-lg border border-scholarly-border bg-scholarly-blue-white p-3 text-sm leading-6 outline-none focus:border-scholarly-blue"
                                />
                            </label>
                        </div>
                        <div className="border-t border-scholarly-border pt-7">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-bold">
                                        Areas of expertise
                                    </h2>
                                    <p className="mt-1 text-xs text-scholarly-slate">
                                        Help learners understand where you can
                                        help most.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    className="inline-flex items-center gap-1 text-xs font-bold text-scholarly-blue"
                                >
                                    <Plus className="size-3.5" /> Add expertise
                                </button>
                            </div>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {[
                                    'SOP review',
                                    'UK scholarships',
                                    'Research plans',
                                    'Public policy',
                                    'Interview preparation',
                                ].map((tag) => (
                                    <span
                                        key={tag}
                                        className="inline-flex items-center gap-1.5 rounded-full bg-scholarly-blue-soft px-3 py-2 text-xs font-semibold text-scholarly-blue"
                                    >
                                        {tag}
                                        <button
                                            type="button"
                                            aria-label={`Remove ${tag}`}
                                            className="text-scholarly-blue/60 hover:text-scholarly-blue"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </section>
                    <div className="grid gap-6 lg:grid-cols-2">
                        <section className="rounded-2xl border border-scholarly-border bg-white p-6 shadow-sm">
                            <div className="flex items-start gap-3">
                                <div className="flex size-10 items-center justify-center rounded-xl bg-scholarly-teal-soft text-scholarly-teal-dark">
                                    <CalendarDaysIcon />
                                </div>
                                <div>
                                    <h2 className="font-bold">Availability</h2>
                                    <p className="mt-1 text-xs leading-5 text-scholarly-slate">
                                        Choose when learners can request your
                                        time.
                                    </p>
                                </div>
                            </div>
                            <div className="mt-5 space-y-3">
                                {[
                                    'Monday · 9:00 AM – 12:00 PM',
                                    'Wednesday · 2:00 PM – 5:00 PM',
                                    'Saturday · 10:00 AM – 1:00 PM',
                                ].map((slot) => (
                                    <div
                                        key={slot}
                                        className="flex items-center justify-between rounded-lg bg-scholarly-blue-white p-3 text-xs font-semibold"
                                    >
                                        <span>{slot}</span>
                                        <Check className="size-4 text-scholarly-teal" />
                                    </div>
                                ))}
                            </div>
                            <Link
                                href="/mentor-sessions"
                                className="mt-5 inline-flex text-xs font-bold text-scholarly-blue"
                            >
                                Manage session times{' '}
                                <Pencil className="ml-1 size-3.5" />
                            </Link>
                        </section>
                        <section className="rounded-2xl border border-scholarly-border bg-scholarly-navy p-6 text-white shadow-sm">
                            <GraduationCap className="size-6 text-scholarly-gold" />
                            <h2 className="mt-5 font-display text-2xl">
                                Your profile is 86% complete.
                            </h2>
                            <p className="mt-2 text-sm leading-6 text-white/65">
                                Add a short introduction video to help the right
                                learners feel comfortable reaching out.
                            </p>
                            <Link
                                href="/mentor-coming-soon?feature=Profile%20introduction%20video"
                                className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-scholarly-gold"
                            >
                                Complete profile <Pencil className="size-3.5" />
                            </Link>
                        </section>
                    </div>
                    <button
                        type="button"
                        onClick={() => setSaved(true)}
                        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-scholarly-blue text-sm font-bold text-white hover:bg-scholarly-blue-dark sm:hidden"
                    >
                        <Save className="size-4" />{' '}
                        {saved ? 'Saved' : 'Save changes'}
                    </button>
                </div>
            </div>
        </>
    );
}

function CalendarDaysIcon() {
    return <span className="text-sm font-bold">15</span>;
}

MentorProfile.layout = () => ({
    breadcrumbs: [{ title: 'Mentor profile', href: '/mentor-profile' }],
});
