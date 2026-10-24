import { Head, Link } from '@inertiajs/react';
import { ArrowRight, FileText, Sparkles } from 'lucide-react';
import { useState } from 'react';

import DocumentWorkspace from '@/layouts/builder/document-workspace';
import TemplateCard from '@/layouts/builder/template-card';
import {
    cvSections,
    sopSections,
    templates,
    type BuilderMode,
} from '@/layouts/builder/data';

export default function CvSopBuilder() {
    const [mode, setMode] = useState<BuilderMode>('CV');
    const [selectedTemplate, setSelectedTemplate] = useState(
        templates.CV[0].id,
    );
    const [activeSection, setActiveSection] = useState(cvSections[0]);
    const [profileName, setProfileName] = useState('Amina Yusuf');
    const [headline, setHeadline] = useState(
        'Public policy graduate and future change-maker',
    );
    const [statement, setStatement] = useState(
        'I am passionate about creating more equitable opportunities through thoughtful public policy and community-led change. My academic journey has taught me to combine rigorous research with a deep understanding of the people behind every problem.',
    );

    const sections = mode === 'CV' ? cvSections : sopSections;
    const activeTemplates = templates[mode];

    const changeMode = (nextMode: BuilderMode) => {
        setMode(nextMode);
        setSelectedTemplate(templates[nextMode][0].id);
        setActiveSection((nextMode === 'CV' ? cvSections : sopSections)[0]);
    };

    return (
        <>
            <Head title="CV & SOP builder" />
            <div className="min-h-screen bg-scholarly-blue-white p-4 text-scholarly-navy sm:p-6 lg:p-8">
                <div className="mx-auto max-w-7xl space-y-8">
                    <header className="flex flex-col gap-5 border-b border-scholarly-border pb-6 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-scholarly-blue">
                                <Sparkles className="size-4" /> Build with
                                confidence
                            </p>
                            <h1 className="font-display text-4xl tracking-[-0.03em] sm:text-5xl">
                                CV & SOP builder
                            </h1>
                            <p className="mt-3 max-w-2xl text-sm leading-6 text-scholarly-slate sm:text-base">
                                Turn your experiences into a clear, compelling
                                application with guidance that still sounds like
                                you.
                            </p>
                        </div>
                        <Link
                            href="/mentors"
                            className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-xl border border-scholarly-border bg-white px-4 text-sm font-bold text-scholarly-navy transition hover:border-scholarly-blue hover:text-scholarly-blue lg:self-auto"
                        >
                            Ask a mentor <ArrowRight className="size-4" />
                        </Link>
                    </header>
                    <div className="flex rounded-xl border border-scholarly-border bg-white p-1 sm:w-fit">
                        <button
                            type="button"
                            onClick={() => changeMode('CV')}
                            className={`inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold transition ${mode === 'CV' ? 'bg-scholarly-blue text-white' : 'text-scholarly-slate hover:text-scholarly-navy'}`}
                        >
                            <FileText className="size-4" /> Build my CV
                        </button>
                        <button
                            type="button"
                            onClick={() => changeMode('SOP')}
                            className={`inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold transition ${mode === 'SOP' ? 'bg-scholarly-blue text-white' : 'text-scholarly-slate hover:text-scholarly-navy'}`}
                        >
                            <FileText className="size-4" /> Write my SOP
                        </button>
                    </div>
                    <section className="grid gap-4 sm:grid-cols-3">
                        <div className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm">
                            <p className="text-xs font-bold tracking-[0.12em] text-scholarly-slate uppercase">
                                {mode} strength
                            </p>
                            <div className="mt-3 flex items-end gap-2">
                                <span className="text-4xl font-bold tracking-[-0.05em] text-scholarly-navy">
                                    {mode === 'CV' ? '92%' : '84%'}
                                </span>
                                <span className="text-scholarly-teal-dark pb-1 text-xs font-bold">
                                    {mode === 'CV'
                                        ? 'Strong foundation'
                                        : 'Good direction'}
                                </span>
                            </div>
                            <div className="mt-4 h-2 overflow-hidden rounded-full bg-scholarly-blue-white">
                                <div
                                    className={`h-full rounded-full ${mode === 'CV' ? 'w-[92%] bg-scholarly-teal' : 'w-[84%] bg-scholarly-blue'}`}
                                />
                            </div>
                        </div>
                        <div className="rounded-2xl border border-scholarly-border bg-white p-5 shadow-sm">
                            <p className="text-xs font-bold tracking-[0.12em] text-scholarly-slate uppercase">
                                Completion
                            </p>
                            <div className="mt-3 flex items-end gap-2">
                                <span className="text-4xl font-bold tracking-[-0.05em] text-scholarly-navy">
                                    {mode === 'CV' ? '4' : '2'}/5
                                </span>
                                <span className="pb-1 text-xs text-scholarly-slate">
                                    sections ready
                                </span>
                            </div>
                            <p className="mt-3 text-xs text-scholarly-slate">
                                Keep going—your next improvement is clear.
                            </p>
                        </div>
                        <div className="rounded-2xl border border-scholarly-border bg-scholarly-navy p-5 text-white shadow-sm">
                            <p className="text-xs font-bold tracking-[0.12em] text-scholarly-sky uppercase">
                                Next best action
                            </p>
                            <p className="mt-3 text-sm font-semibold">
                                {mode === 'CV'
                                    ? 'Add measurable impact to your experience.'
                                    : 'Connect your story to your future goals.'}
                            </p>
                            <Link
                                href="/coming-soon?feature=Application feedback"
                                className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-scholarly-gold"
                            >
                                Improve my {mode}{' '}
                                <ArrowRight className="size-3.5" />
                            </Link>
                        </div>
                    </section>
                    <section>
                        <div className="mb-4 flex items-end justify-between">
                            <div>
                                <h2 className="text-xl font-bold">
                                    Choose a starting template
                                </h2>
                                <p className="mt-1 text-sm text-scholarly-slate">
                                    You can change the layout at any time.
                                </p>
                            </div>
                            <span className="hidden text-xs font-semibold text-scholarly-slate sm:block">
                                Step 1 of 2
                            </span>
                        </div>
                        <div className="grid gap-4 md:grid-cols-3">
                            {activeTemplates.map((template) => (
                                <TemplateCard
                                    key={template.id}
                                    template={template}
                                    selected={selectedTemplate === template.id}
                                    onSelect={() =>
                                        setSelectedTemplate(template.id)
                                    }
                                />
                            ))}
                        </div>
                    </section>
                    <DocumentWorkspace
                        mode={mode}
                        activeSection={activeSection}
                        onSectionChange={setActiveSection}
                        sections={sections}
                        profileName={profileName}
                        headline={headline}
                        statement={statement}
                        onProfileNameChange={setProfileName}
                        onHeadlineChange={setHeadline}
                        onStatementChange={setStatement}
                    />
                </div>
            </div>
        </>
    );
}

CvSopBuilder.layout = () => ({
    breadcrumbs: [{ title: 'CV & SOP builder', href: '/cv-sop-builder' }],
});
