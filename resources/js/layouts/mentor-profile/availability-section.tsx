import { router, useForm } from '@inertiajs/react';
import { CalendarPlus, Trash2 } from 'lucide-react';
import type { FormEvent } from 'react';

import type {
    MentorAvailabilitySlotPayload,
    ScholarshipOption,
} from '@/types/domain';

type Props = {
    slots: MentorAvailabilitySlotPayload[];
    weekdays: ScholarshipOption[];
};

const inputClass =
    'h-11 w-full rounded-lg border border-scholarly-border bg-scholarly-blue-white px-3 text-sm text-scholarly-navy outline-none focus:border-scholarly-blue focus:ring-4 focus:ring-scholarly-blue-soft';
const labelClass =
    'mb-1.5 block text-xs font-bold tracking-[0.12em] text-scholarly-slate uppercase';

export default function MentorAvailabilitySection({ slots, weekdays }: Props) {
    const form = useForm({
        weekday: weekdays[0]?.value ?? '1',
        start_time: '09:00',
        end_time: '12:00',
        timezone: 'UTC',
        is_active: true,
    });

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        form.post('/mentor-profile/availability', {
            preserveScroll: true,
            onSuccess: () => {
                form.reset('start_time', 'end_time');
            },
        });
    };

    const remove = (slot: MentorAvailabilitySlotPayload) => {
        router.delete(`/mentor-profile/availability/${slot.id}`, {
            preserveScroll: true,
        });
    };

    const toggle = (slot: MentorAvailabilitySlotPayload) => {
        router.patch(
            `/mentor-profile/availability/${slot.id}`,
            {
                weekday: slot.weekday,
                start_time: slot.startTime,
                end_time: slot.endTime,
                timezone: slot.timezone,
                is_active: !slot.isActive,
            },
            { preserveScroll: true },
        );
    };

    return (
        <section className="rounded-2xl border border-scholarly-border bg-white p-6 shadow-sm">
            <div>
                <h2 className="text-xl font-bold">Availability</h2>
                <p className="mt-1 text-sm text-scholarly-slate">
                    Choose when learners can request your time.
                </p>
            </div>

            <div className="mt-4 space-y-2">
                {slots.length > 0 ? (
                    slots.map((slot) => (
                        <div
                            key={slot.id}
                            className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-scholarly-blue-white px-3 py-2.5"
                        >
                            <div>
                                <p className="text-xs font-semibold text-scholarly-navy">
                                    {slot.label}
                                </p>
                                <p className="mt-0.5 text-[11px] text-scholarly-slate">
                                    {slot.timezone}
                                    {!slot.isActive && ' · paused'}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => toggle(slot)}
                                    className={`rounded-full px-2.5 py-1 text-[11px] font-bold transition ${
                                        slot.isActive
                                            ? 'bg-scholarly-teal-soft text-scholarly-teal-dark hover:bg-scholarly-teal/20'
                                            : 'bg-scholarly-gold-soft text-scholarly-gold-dark hover:bg-scholarly-gold/20'
                                    }`}
                                >
                                    {slot.isActive ? 'Active' : 'Paused'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => remove(slot)}
                                    aria-label={`Remove ${slot.label}`}
                                    className="flex size-8 items-center justify-center rounded-lg border border-scholarly-coral-dark/30 text-scholarly-coral-dark transition hover:bg-scholarly-coral-soft"
                                >
                                    <Trash2 className="size-3.5" />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="rounded-lg bg-scholarly-blue-white px-3 py-4 text-center text-sm text-scholarly-slate">
                        No availability slots yet.
                    </p>
                )}
            </div>

            <form
                onSubmit={submit}
                className="mt-5 grid gap-3 border-t border-scholarly-border pt-5 sm:grid-cols-2"
            >
                <label className="block sm:col-span-2">
                    <span className={labelClass}>Weekday</span>
                    <select
                        value={form.data.weekday}
                        onChange={(event) =>
                            form.setData('weekday', event.target.value)
                        }
                        className={inputClass}
                    >
                        {weekdays.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="block">
                    <span className={labelClass}>Starts</span>
                    <input
                        type="time"
                        value={form.data.start_time}
                        onChange={(event) =>
                            form.setData('start_time', event.target.value)
                        }
                        className={inputClass}
                    />
                    {form.errors.start_time && (
                        <p className="mt-1 text-xs text-scholarly-coral-dark">
                            {form.errors.start_time}
                        </p>
                    )}
                </label>

                <label className="block">
                    <span className={labelClass}>Ends</span>
                    <input
                        type="time"
                        value={form.data.end_time}
                        onChange={(event) =>
                            form.setData('end_time', event.target.value)
                        }
                        className={inputClass}
                    />
                    {form.errors.end_time && (
                        <p className="mt-1 text-xs text-scholarly-coral-dark">
                            {form.errors.end_time}
                        </p>
                    )}
                </label>

                <label className="block">
                    <span className={labelClass}>Timezone</span>
                    <input
                        value={form.data.timezone}
                        onChange={(event) =>
                            form.setData('timezone', event.target.value)
                        }
                        placeholder="UTC"
                        className={inputClass}
                    />
                </label>

                <div className="flex items-end">
                    <button
                        type="submit"
                        disabled={form.processing}
                        className="inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-lg bg-scholarly-navy px-4 text-xs font-bold text-white transition hover:bg-scholarly-navy/90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <CalendarPlus className="size-3.5" /> Add slot
                    </button>
                </div>
            </form>
        </section>
    );
}
