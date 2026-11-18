import { router } from '@inertiajs/react';
import { Plus, X } from 'lucide-react';
import { useState } from 'react';

import type { MentorExpertiseTag } from '@/types/domain';

type Props = {
    expertise: MentorExpertiseTag[];
    availableExpertise: MentorExpertiseTag[];
};

export default function MentorExpertiseSection({
    expertise,
    availableExpertise,
}: Props) {
    const [selected, setSelected] = useState('');
    const [processing, setProcessing] = useState(false);

    const add = () => {
        if (!selected) {
            return;
        }

        router.post(
            '/mentor-profile/expertise',
            { expertise_tag_id: Number(selected) },
            {
                preserveScroll: true,
                onStart: () => setProcessing(true),
                onFinish: () => setProcessing(false),
                onSuccess: () => setSelected(''),
            },
        );
    };

    const remove = (tag: MentorExpertiseTag) => {
        router.delete(`/mentor-profile/expertise/${tag.id}`, {
            preserveScroll: true,
        });
    };

    return (
        <section className="rounded-2xl border border-scholarly-border bg-white p-6 shadow-sm">
            <div>
                <h2 className="text-xl font-bold">Areas of expertise</h2>
                <p className="mt-1 text-sm text-scholarly-slate">
                    Help learners understand where you can help most.
                </p>
            </div>

            {expertise.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                    {expertise.map((tag) => (
                        <span
                            key={tag.id}
                            className="inline-flex items-center gap-1.5 rounded-full bg-scholarly-blue-soft px-3 py-1.5 text-xs font-semibold text-scholarly-blue"
                        >
                            {tag.name}
                            <button
                                type="button"
                                onClick={() => remove(tag)}
                                aria-label={`Remove ${tag.name}`}
                                className="text-scholarly-blue/60 transition hover:text-scholarly-blue"
                            >
                                <X className="size-3.5" />
                            </button>
                        </span>
                    ))}
                </div>
            ) : (
                <p className="mt-4 text-sm text-scholarly-slate">
                    No expertise tags yet. Add a few so learners can find you.
                </p>
            )}

            {availableExpertise.length > 0 ? (
                <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                    <select
                        value={selected}
                        onChange={(event) => setSelected(event.target.value)}
                        className="h-11 flex-1 rounded-lg border border-scholarly-border bg-scholarly-blue-white px-3 text-sm text-scholarly-navy outline-none focus:border-scholarly-blue"
                    >
                        <option value="">Add an expertise tag…</option>
                        {availableExpertise.map((tag) => (
                            <option key={tag.id} value={tag.id}>
                                {tag.name}
                            </option>
                        ))}
                    </select>
                    <button
                        type="button"
                        onClick={add}
                        disabled={processing || !selected}
                        className="inline-flex h-11 items-center justify-center gap-1.5 rounded-lg bg-scholarly-navy px-4 text-xs font-bold text-white transition hover:bg-scholarly-navy/90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Plus className="size-3.5" /> Add
                    </button>
                </div>
            ) : (
                <p className="mt-4 text-xs text-scholarly-slate-light">
                    You have added every available expertise tag.
                </p>
            )}
        </section>
    );
}
