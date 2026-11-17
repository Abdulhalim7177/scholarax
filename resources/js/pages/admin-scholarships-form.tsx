import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import type { FormEvent } from 'react';

import type {
    AdminScholarshipFormProps,
    AdminScholarshipFormValues,
} from '@/types/domain';

const emptyForm: AdminScholarshipFormValues = {
    title: '',
    provider: '',
    summary: '',
    description: '',
    host_country_id: '',
    funding_type: 'fully_funded',
    deadline_at: '',
    application_url: '',
    eligibility: '',
    required_documents: '',
    status: 'pending',
    is_featured: false,
    study_level_ids: [],
    field_of_study_ids: [],
    eligible_country_ids: [],
};

export default function AdminScholarshipsForm({
    scholarship,
    options,
}: AdminScholarshipFormProps) {
    const form = useForm<AdminScholarshipFormValues>(
        scholarship
            ? {
                  title: scholarship.title,
                  provider: scholarship.provider,
                  summary: scholarship.summary,
                  description: scholarship.description,
                  host_country_id: scholarship.host_country_id,
                  funding_type: scholarship.funding_type,
                  deadline_at: scholarship.deadline_at,
                  application_url: scholarship.application_url,
                  eligibility: scholarship.eligibility,
                  required_documents: scholarship.required_documents,
                  status: scholarship.status,
                  is_featured: scholarship.is_featured,
                  study_level_ids: scholarship.study_level_ids,
                  field_of_study_ids: scholarship.field_of_study_ids,
                  eligible_country_ids: scholarship.eligible_country_ids,
              }
            : emptyForm,
    );

    const toggleRelationship = (
        key: 'study_level_ids' | 'field_of_study_ids' | 'eligible_country_ids',
        value: string,
    ) => {
        const current = form.data[key];

        form.setData(
            key,
            current.includes(value)
                ? current.filter((item) => item !== value)
                : [...current, value],
        );
    };

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        form.transform((data) => ({
            ...data,
            required_documents: data.required_documents
                .split('\n')
                .map((line) => line.trim())
                .filter(Boolean),
        }));

        if (scholarship) {
            form.patch(`/admin-scholarships/${scholarship.id}`, {
                preserveScroll: true,
            });

            return;
        }

        form.post('/admin-scholarships', { preserveScroll: true });
    };

    const destroy = () => {
        if (!scholarship) {
            return;
        }

        if (
            !window.confirm(
                `Delete “${scholarship.title}”? This can be restored by an administrator later.`,
            )
        ) {
            return;
        }

        router.delete(`/admin-scholarships/${scholarship.id}`);
    };

    const inputClass =
        'mt-1.5 h-11 w-full rounded-lg border border-scholarly-border bg-scholarly-blue-white px-3 text-sm text-scholarly-navy outline-none focus:border-scholarly-blue focus:ring-4 focus:ring-scholarly-blue-soft';
    const textAreaClass =
        'mt-1.5 w-full rounded-lg border border-scholarly-border bg-scholarly-blue-white px-3 py-2.5 text-sm leading-6 text-scholarly-navy outline-none focus:border-scholarly-blue focus:ring-4 focus:ring-scholarly-blue-soft';
    const labelClass =
        'text-xs font-bold tracking-[0.12em] text-scholarly-slate uppercase';

    return (
        <>
            <Head
                title={
                    scholarship ? 'Edit scholarship' : 'Add a new scholarship'
                }
            />
            <div className="min-h-screen bg-scholarly-blue-white p-4 text-scholarly-navy sm:p-6 lg:p-8">
                <div className="mx-auto max-w-6xl space-y-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <Link
                                href="/admin-scholarships"
                                className="inline-flex items-center gap-2 text-sm font-semibold text-scholarly-blue hover:text-scholarly-blue-dark"
                            >
                                <ArrowLeft className="size-4" /> Back to
                                scholarships
                            </Link>
                            <h1 className="mt-3 font-display text-4xl tracking-[-0.03em]">
                                {scholarship
                                    ? 'Edit scholarship'
                                    : 'Add a new scholarship'}
                            </h1>
                            <p className="mt-2 text-sm leading-6 text-scholarly-slate">
                                Changes are saved to the database and reflected
                                across student pages immediately.
                            </p>
                        </div>
                        {scholarship && (
                            <button
                                type="button"
                                onClick={destroy}
                                className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-xl border border-scholarly-coral-dark/30 px-4 text-sm font-bold text-scholarly-coral-dark transition hover:bg-scholarly-coral-soft sm:self-auto"
                            >
                                <Trash2 className="size-4" /> Delete
                            </button>
                        )}
                    </div>

                    <form
                        onSubmit={submit}
                        className="grid gap-6 lg:grid-cols-3"
                    >
                        <div className="space-y-6 lg:col-span-2">
                            <section className="rounded-2xl border border-scholarly-border bg-white p-6 shadow-sm">
                                <h2 className="text-lg font-bold">
                                    Opportunity details
                                </h2>
                                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                                    <label className="block sm:col-span-2">
                                        <span className={labelClass}>
                                            Title
                                        </span>
                                        <input
                                            value={form.data.title}
                                            onChange={(event) =>
                                                form.setData(
                                                    'title',
                                                    event.target.value,
                                                )
                                            }
                                            className={inputClass}
                                        />
                                        {form.errors.title && (
                                            <p className="mt-1 text-xs text-scholarly-coral-dark">
                                                {form.errors.title}
                                            </p>
                                        )}
                                    </label>
                                    <label className="block">
                                        <span className={labelClass}>
                                            Provider
                                        </span>
                                        <input
                                            value={form.data.provider}
                                            onChange={(event) =>
                                                form.setData(
                                                    'provider',
                                                    event.target.value,
                                                )
                                            }
                                            className={inputClass}
                                        />
                                        {form.errors.provider && (
                                            <p className="mt-1 text-xs text-scholarly-coral-dark">
                                                {form.errors.provider}
                                            </p>
                                        )}
                                    </label>
                                    <label className="block">
                                        <span className={labelClass}>
                                            Host country
                                        </span>
                                        <select
                                            value={form.data.host_country_id}
                                            onChange={(event) =>
                                                form.setData(
                                                    'host_country_id',
                                                    event.target.value,
                                                )
                                            }
                                            className={inputClass}
                                        >
                                            <option value="">
                                                Multiple countries
                                            </option>
                                            {options.countries.map((option) => (
                                                <option
                                                    key={option.value}
                                                    value={option.value}
                                                >
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                    <label className="block sm:col-span-2">
                                        <span className={labelClass}>
                                            Short summary
                                        </span>
                                        <textarea
                                            value={form.data.summary}
                                            onChange={(event) =>
                                                form.setData(
                                                    'summary',
                                                    event.target.value,
                                                )
                                            }
                                            rows={3}
                                            className={textAreaClass}
                                        />
                                        {form.errors.summary && (
                                            <p className="mt-1 text-xs text-scholarly-coral-dark">
                                                {form.errors.summary}
                                            </p>
                                        )}
                                    </label>
                                    <label className="block sm:col-span-2">
                                        <span className={labelClass}>
                                            Full description
                                        </span>
                                        <textarea
                                            value={form.data.description}
                                            onChange={(event) =>
                                                form.setData(
                                                    'description',
                                                    event.target.value,
                                                )
                                            }
                                            rows={7}
                                            className={textAreaClass}
                                        />
                                        {form.errors.description && (
                                            <p className="mt-1 text-xs text-scholarly-coral-dark">
                                                {form.errors.description}
                                            </p>
                                        )}
                                    </label>
                                    <label className="block sm:col-span-2">
                                        <span className={labelClass}>
                                            Eligibility
                                        </span>
                                        <textarea
                                            value={form.data.eligibility}
                                            onChange={(event) =>
                                                form.setData(
                                                    'eligibility',
                                                    event.target.value,
                                                )
                                            }
                                            rows={4}
                                            className={textAreaClass}
                                        />
                                    </label>
                                    <label className="block sm:col-span-2">
                                        <span className={labelClass}>
                                            Required documents (one per line)
                                        </span>
                                        <textarea
                                            value={form.data.required_documents}
                                            onChange={(event) =>
                                                form.setData(
                                                    'required_documents',
                                                    event.target.value,
                                                )
                                            }
                                            rows={4}
                                            className={textAreaClass}
                                        />
                                    </label>
                                </div>
                            </section>

                            <section className="rounded-2xl border border-scholarly-border bg-white p-6 shadow-sm">
                                <h2 className="text-lg font-bold">
                                    Study levels
                                </h2>
                                <p className="mt-1 text-xs text-scholarly-slate">
                                    Select every level this scholarship
                                    supports.
                                </p>
                                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                    {options.levels.map((option) => (
                                        <label
                                            key={option.value}
                                            className="flex items-center gap-3 rounded-xl border border-scholarly-border bg-scholarly-blue-white px-3 py-2.5 text-sm font-semibold"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={form.data.study_level_ids.includes(
                                                    option.value,
                                                )}
                                                onChange={() =>
                                                    toggleRelationship(
                                                        'study_level_ids',
                                                        option.value,
                                                    )
                                                }
                                                className="size-4 accent-scholarly-blue"
                                            />
                                            {option.label}
                                        </label>
                                    ))}
                                </div>
                                {form.errors.study_level_ids && (
                                    <p className="mt-2 text-xs text-scholarly-coral-dark">
                                        {form.errors.study_level_ids}
                                    </p>
                                )}
                            </section>

                            <section className="rounded-2xl border border-scholarly-border bg-white p-6 shadow-sm">
                                <h2 className="text-lg font-bold">
                                    Fields of study
                                </h2>
                                <p className="mt-1 text-xs text-scholarly-slate">
                                    Choose the disciplines this opportunity
                                    accepts.
                                </p>
                                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                    {options.fields.map((option) => (
                                        <label
                                            key={option.value}
                                            className="flex items-center gap-3 rounded-xl border border-scholarly-border bg-scholarly-blue-white px-3 py-2.5 text-sm font-semibold"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={form.data.field_of_study_ids.includes(
                                                    option.value,
                                                )}
                                                onChange={() =>
                                                    toggleRelationship(
                                                        'field_of_study_ids',
                                                        option.value,
                                                    )
                                                }
                                                className="size-4 accent-scholarly-blue"
                                            />
                                            {option.label}
                                        </label>
                                    ))}
                                </div>
                                {form.errors.field_of_study_ids && (
                                    <p className="mt-2 text-xs text-scholarly-coral-dark">
                                        {form.errors.field_of_study_ids}
                                    </p>
                                )}
                            </section>

                            <section className="rounded-2xl border border-scholarly-border bg-white p-6 shadow-sm">
                                <h2 className="text-lg font-bold">
                                    Eligible applicant countries
                                </h2>
                                <p className="mt-1 text-xs text-scholarly-slate">
                                    Optional. Leave empty when nationality is
                                    not restricted.
                                </p>
                                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                    {options.countries.map((option) => (
                                        <label
                                            key={option.value}
                                            className="flex items-center gap-3 rounded-xl border border-scholarly-border bg-scholarly-blue-white px-3 py-2.5 text-sm font-semibold"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={form.data.eligible_country_ids.includes(
                                                    option.value,
                                                )}
                                                onChange={() =>
                                                    toggleRelationship(
                                                        'eligible_country_ids',
                                                        option.value,
                                                    )
                                                }
                                                className="size-4 accent-scholarly-blue"
                                            />
                                            {option.label}
                                        </label>
                                    ))}
                                </div>
                            </section>
                        </div>

                        <aside className="space-y-6">
                            <section className="rounded-2xl border border-scholarly-border bg-white p-6 shadow-sm">
                                <h2 className="text-lg font-bold">
                                    Publishing
                                </h2>
                                <div className="mt-5 space-y-4">
                                    <label className="block">
                                        <span className={labelClass}>
                                            Status
                                        </span>
                                        <select
                                            value={form.data.status}
                                            onChange={(event) =>
                                                form.setData(
                                                    'status',
                                                    event.target
                                                        .value as AdminScholarshipFormValues['status'],
                                                )
                                            }
                                            className={inputClass}
                                        >
                                            {options.statuses.map((option) => (
                                                <option
                                                    key={option.value}
                                                    value={option.value}
                                                >
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                    <label className="block">
                                        <span className={labelClass}>
                                            Funding type
                                        </span>
                                        <select
                                            value={form.data.funding_type}
                                            onChange={(event) =>
                                                form.setData(
                                                    'funding_type',
                                                    event.target
                                                        .value as AdminScholarshipFormValues['funding_type'],
                                                )
                                            }
                                            className={inputClass}
                                        >
                                            {options.fundingTypes.map(
                                                (option) => (
                                                    <option
                                                        key={option.value}
                                                        value={option.value}
                                                    >
                                                        {option.label}
                                                    </option>
                                                ),
                                            )}
                                        </select>
                                    </label>
                                    <label className="block">
                                        <span className={labelClass}>
                                            Deadline
                                        </span>
                                        <input
                                            type="date"
                                            value={form.data.deadline_at}
                                            onChange={(event) =>
                                                form.setData(
                                                    'deadline_at',
                                                    event.target.value,
                                                )
                                            }
                                            className={inputClass}
                                        />
                                        {form.errors.deadline_at && (
                                            <p className="mt-1 text-xs text-scholarly-coral-dark">
                                                {form.errors.deadline_at}
                                            </p>
                                        )}
                                    </label>
                                    <label className="block">
                                        <span className={labelClass}>
                                            Application URL
                                        </span>
                                        <input
                                            type="url"
                                            value={form.data.application_url}
                                            onChange={(event) =>
                                                form.setData(
                                                    'application_url',
                                                    event.target.value,
                                                )
                                            }
                                            className={inputClass}
                                        />
                                        {form.errors.application_url && (
                                            <p className="mt-1 text-xs text-scholarly-coral-dark">
                                                {form.errors.application_url}
                                            </p>
                                        )}
                                    </label>
                                    <label className="flex items-center gap-3 rounded-xl border border-scholarly-border bg-scholarly-blue-white px-3 py-3 text-sm font-semibold">
                                        <input
                                            type="checkbox"
                                            checked={form.data.is_featured}
                                            onChange={(event) =>
                                                form.setData(
                                                    'is_featured',
                                                    event.target.checked,
                                                )
                                            }
                                            className="size-4 accent-scholarly-blue"
                                        />
                                        Feature on the home page
                                    </label>
                                </div>
                            </section>

                            <button
                                type="submit"
                                disabled={form.processing}
                                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-scholarly-blue px-4 text-sm font-bold text-white transition hover:bg-scholarly-blue-dark disabled:opacity-60"
                            >
                                <Save className="size-4" />
                                {form.processing
                                    ? 'Saving…'
                                    : scholarship
                                      ? 'Save changes'
                                      : 'Create scholarship'}
                            </button>
                            <p className="text-center text-xs leading-5 text-scholarly-slate">
                                Saving updates the live database immediately.
                                Students only see scholarships with a live
                                status.
                            </p>
                        </aside>
                    </form>
                </div>
            </div>
        </>
    );
}

AdminScholarshipsForm.layout = (props: AdminScholarshipFormProps) => ({
    breadcrumbs: [
        { title: 'Scholarships', href: '/admin-scholarships' },
        {
            title: props.scholarship ? 'Edit scholarship' : 'Add scholarship',
            href: props.scholarship
                ? `/admin-scholarships/${props.scholarship.id}/edit`
                : '/admin-scholarships/create',
        },
    ],
});
