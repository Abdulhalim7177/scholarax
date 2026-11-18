import { router, useForm } from '@inertiajs/react';
import {
    Download,
    FilePlus2,
    FileText,
    Trash2,
    UploadCloud,
} from 'lucide-react';
import type { FormEvent } from 'react';
import { useRef } from 'react';

import type {
    ApplicationDocumentItem,
    ApplicationDocumentStatusValue,
    ScholarshipOption,
} from '@/types/domain';

type Props = {
    applicationId: number;
    documents: ApplicationDocumentItem[];
    summary: { total: number; complete: number };
    documentTypes: ScholarshipOption[];
    documentStatuses: ScholarshipOption[];
};

const statusClasses: Record<ApplicationDocumentStatusValue, string> = {
    draft: 'bg-scholarly-blue-soft text-scholarly-blue',
    submitted: 'bg-scholarly-teal-soft text-scholarly-teal-dark',
    changes_requested: 'bg-scholarly-coral-soft text-scholarly-coral-dark',
    approved: 'bg-scholarly-gold-soft text-scholarly-gold-dark',
};

export default function ApplicationDocuments({
    applicationId,
    documents,
    summary,
    documentTypes,
    documentStatuses,
}: Props) {
    const fileInput = useRef<HTMLInputElement>(null);

    const form = useForm<{
        type: string;
        title: string;
        file: File | null;
    }>({
        type: documentTypes[0]?.value ?? 'cv',
        title: '',
        file: null,
    });

    const changeStatus = (
        document: ApplicationDocumentItem,
        status: string,
    ) => {
        router.patch(
            `/applications/${applicationId}/documents/${document.id}`,
            { status },
            { preserveScroll: true },
        );
    };

    const remove = (document: ApplicationDocumentItem) => {
        if (!window.confirm(`Remove “${document.title}”?`)) {
            return;
        }

        router.delete(
            `/applications/${applicationId}/documents/${document.id}`,
            { preserveScroll: true },
        );
    };

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        form.post(`/applications/${applicationId}/documents`, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                form.reset();
                if (fileInput.current) {
                    fileInput.current.value = '';
                }
            },
        });
    };

    return (
        <section className="rounded-2xl border border-scholarly-border bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-xl font-bold">Documents</h2>
                    <p className="mt-1 text-sm text-scholarly-slate">
                        {summary.complete} of {summary.total} documents
                        complete.
                    </p>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full bg-scholarly-blue-soft px-3 py-1.5 text-xs font-bold text-scholarly-blue">
                    <FileText className="size-3.5" />
                    {summary.total} uploaded
                </span>
            </div>

            <div className="mt-5 space-y-4">
                {documents.map((document) => (
                    <div
                        key={document.id}
                        className="rounded-xl border border-scholarly-border p-4"
                    >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="flex min-w-0 items-start gap-3">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-scholarly-blue-soft text-scholarly-blue">
                                    <FileText className="size-5" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-bold">
                                        {document.title}
                                    </p>
                                    <p className="mt-0.5 text-xs text-scholarly-slate">
                                        {document.typeLabel} · v
                                        {document.version}
                                        {document.fileName
                                            ? ` · ${document.fileName}`
                                            : ' · No file attached'}
                                    </p>
                                </div>
                            </div>
                            <span
                                className={`rounded-full px-3 py-1 text-xs font-bold ${statusClasses[document.status]}`}
                            >
                                {document.statusLabel}
                            </span>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-2">
                            <select
                                value={document.status}
                                onChange={(event) =>
                                    changeStatus(document, event.target.value)
                                }
                                className="h-9 rounded-lg border border-scholarly-border bg-white px-2 text-xs font-semibold outline-none focus:border-scholarly-blue"
                                aria-label={`Status for ${document.title}`}
                            >
                                {documentStatuses.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            {document.downloadUrl && (
                                <a
                                    href={document.downloadUrl}
                                    className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-scholarly-border px-3 text-xs font-bold text-scholarly-slate transition hover:border-scholarly-blue hover:text-scholarly-blue"
                                >
                                    <Download className="size-3.5" /> Download
                                </a>
                            )}
                            <button
                                type="button"
                                onClick={() => remove(document)}
                                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-scholarly-coral-dark/30 px-3 text-xs font-bold text-scholarly-coral-dark transition hover:bg-scholarly-coral-soft"
                            >
                                <Trash2 className="size-3.5" /> Remove
                            </button>
                        </div>
                    </div>
                ))}
                {documents.length === 0 && (
                    <p className="py-6 text-center text-sm text-scholarly-slate">
                        No documents attached yet.
                    </p>
                )}
            </div>

            <form
                onSubmit={submit}
                className="mt-5 space-y-3 rounded-xl bg-scholarly-blue-white p-4"
            >
                <p className="flex items-center gap-2 text-sm font-bold">
                    <FilePlus2 className="size-4 text-scholarly-blue" /> Add a
                    document
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                    <select
                        value={form.data.type}
                        onChange={(event) =>
                            form.setData('type', event.target.value)
                        }
                        className="h-10 rounded-lg border border-scholarly-border bg-white px-3 text-sm outline-none focus:border-scholarly-blue"
                    >
                        {documentTypes.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <input
                        value={form.data.title}
                        onChange={(event) =>
                            form.setData('title', event.target.value)
                        }
                        placeholder="Document title"
                        className="h-10 rounded-lg border border-scholarly-border bg-white px-3 text-sm outline-none focus:border-scholarly-blue focus:ring-4 focus:ring-scholarly-blue-soft"
                    />
                </div>
                <input
                    ref={fileInput}
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={(event) =>
                        form.setData('file', event.target.files?.[0] ?? null)
                    }
                    className="block w-full rounded-lg border border-dashed border-scholarly-border-strong bg-white px-3 py-2.5 text-xs text-scholarly-slate file:mr-3 file:rounded-md file:border-0 file:bg-scholarly-blue-soft file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-scholarly-blue"
                />
                <p className="text-xs text-scholarly-slate">
                    PDF, Word or image up to 10 MB.
                </p>
                {form.errors.title && (
                    <p className="text-xs text-scholarly-coral-dark">
                        {form.errors.title}
                    </p>
                )}
                {form.errors.file && (
                    <p className="text-xs text-scholarly-coral-dark">
                        {form.errors.file}
                    </p>
                )}
                <button
                    type="submit"
                    disabled={form.processing || form.data.title.trim() === ''}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-scholarly-navy px-4 text-sm font-bold text-white transition hover:bg-scholarly-navy/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <UploadCloud className="size-4" /> Upload document
                </button>
            </form>
        </section>
    );
}
