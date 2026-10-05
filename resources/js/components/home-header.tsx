import { Link } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

import { login, register } from '@/routes';
import BrandMark from '../layouts/home_page/brand-mark';
import type { HomePageProps } from '../layouts/home_page/types';

export default function HomeHeader({ auth, dashboardUrl }: HomePageProps) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const closeMobile = () => setMobileOpen(false);

    return (
        <header className="absolute inset-x-0 top-0 z-50">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10 lg:py-7">
                <Link href="/" aria-label="Scholarly home">
                    <BrandMark />
                </Link>
                <nav className="hidden items-center gap-8 lg:flex">
                    <a
                        href="#scholarships"
                        className="text-sm font-semibold text-scholarly-slate transition hover:text-scholarly-blue"
                    >
                        Find scholarships
                    </a>
                    <a
                        href="#application"
                        className="text-sm font-semibold text-scholarly-slate transition hover:text-scholarly-blue"
                    >
                        Build your profile
                    </a>
                    <a
                        href="#mentors"
                        className="text-sm font-semibold text-scholarly-slate transition hover:text-scholarly-blue"
                    >
                        Mentors
                    </a>
                    <a
                        href="#resources"
                        className="text-sm font-semibold text-scholarly-slate transition hover:text-scholarly-blue"
                    >
                        Resources
                    </a>
                </nav>
                <div className="hidden items-center gap-5 lg:flex">
                    {auth?.user ? (
                        <Link
                            href={dashboardUrl}
                            className="text-sm font-bold text-scholarly-navy transition hover:text-scholarly-blue"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <Link
                            href={login()}
                            className="text-sm font-bold text-scholarly-navy transition hover:text-scholarly-blue"
                        >
                            Log in
                        </Link>
                    )}
                    <Link
                        href={auth?.user ? dashboardUrl : register()}
                        className="rounded-full bg-scholarly-blue px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-scholarly-blue-dark"
                    >
                        Get started
                    </Link>
                </div>
                <button
                    type="button"
                    onClick={() => setMobileOpen((open) => !open)}
                    className="rounded-xl p-2 text-scholarly-navy lg:hidden"
                    aria-label="Toggle navigation"
                >
                    {mobileOpen ? (
                        <X className="size-6" />
                    ) : (
                        <Menu className="size-6" />
                    )}
                </button>
            </div>
            {mobileOpen ? (
                <div className="mx-4 rounded-2xl border border-scholarly-border bg-white p-5 shadow-xl lg:hidden">
                    <nav className="flex flex-col gap-4">
                        <a
                            href="#scholarships"
                            onClick={closeMobile}
                            className="font-semibold text-scholarly-slate"
                        >
                            Find scholarships
                        </a>
                        <a
                            href="#application"
                            onClick={closeMobile}
                            className="font-semibold text-scholarly-slate"
                        >
                            Build your profile
                        </a>
                        <a
                            href="#mentors"
                            onClick={closeMobile}
                            className="font-semibold text-scholarly-slate"
                        >
                            Mentors
                        </a>
                        <a
                            href="#resources"
                            onClick={closeMobile}
                            className="font-semibold text-scholarly-slate"
                        >
                            Resources
                        </a>
                        {auth?.user ? (
                            <Link
                                href={dashboardUrl}
                                onClick={closeMobile}
                                className="font-semibold text-scholarly-slate"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <Link
                                href={login()}
                                onClick={closeMobile}
                                className="font-semibold text-scholarly-slate"
                            >
                                Log in
                            </Link>
                        )}
                        <Link
                            href={auth?.user ? dashboardUrl : register()}
                            onClick={closeMobile}
                            className="rounded-full bg-scholarly-blue px-5 py-3 text-center font-bold text-white"
                        >
                            Get started
                        </Link>
                    </nav>
                </div>
            ) : null}
        </header>
    );
}
