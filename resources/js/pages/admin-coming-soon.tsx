import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export default function AdminComingSoon() {
    const { url } = usePage();
    const params = new URLSearchParams(url.split('?')[1] ?? '');
    const feature = params.get('feature') ?? 'This admin feature';

    return (
        <>
            <Head title="Admin feature coming soon" />
            <main className="flex min-h-screen items-center justify-center bg-scholarly-blue-white px-5 py-12">
                <section className="w-full max-w-xl rounded-3xl border border-scholarly-border bg-white p-8 text-center shadow-xl sm:p-12">
                    <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-scholarly-blue-soft text-scholarly-blue">
                        <ShieldCheck className="size-7" />
                    </div>
                    <p className="mt-7 text-xs font-bold tracking-[0.2em] text-scholarly-blue uppercase">
                        Admin workspace is growing
                    </p>
                    <h1 className="mt-3 font-display text-4xl tracking-[-0.04em] text-scholarly-navy">
                        {feature} is coming soon
                    </h1>
                    <p className="mx-auto mt-5 max-w-md leading-7 text-scholarly-slate">
                        This admin area is being prepared for the platform
                        operations team. It will be available here soon.
                    </p>
                    <Link
                        href="/admin-dashboard"
                        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-scholarly-blue px-5 py-3 text-sm font-bold text-white transition hover:bg-scholarly-blue-dark"
                    >
                        <ArrowLeft className="size-4" /> Back to admin overview
                    </Link>
                </section>
            </main>
        </>
    );
}
