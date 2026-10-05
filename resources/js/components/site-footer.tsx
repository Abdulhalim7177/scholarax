import { MessageCircle, UserRound, UsersRound } from 'lucide-react';

import BrandMark from '../layouts/home_page/brand-mark';

export default function SiteFooter() {
    return (
        <footer
            id="footer"
            className="border-t border-scholarly-border bg-white"
        >
            <div className="mx-auto grid max-w-7xl gap-12 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-10">
                <div>
                    <BrandMark />
                    <p className="mt-5 max-w-xs text-sm leading-6 text-scholarly-slate-light">
                        Opening doors to a brighter, more equal world through
                        education.
                    </p>
                    <div className="mt-6 flex items-center gap-3 text-scholarly-blue">
                        <a
                            href="#footer"
                            aria-label="Community"
                            className="rounded-full bg-scholarly-blue-soft p-2"
                        >
                            <UsersRound className="size-4" />
                        </a>
                        <a
                            href="#footer"
                            aria-label="Messages"
                            className="rounded-full bg-scholarly-blue-soft p-2"
                        >
                            <MessageCircle className="size-4" />
                        </a>
                        <a
                            href="#footer"
                            aria-label="Profile"
                            className="rounded-full bg-scholarly-blue-soft p-2"
                        >
                            <UserRound className="size-4" />
                        </a>
                    </div>
                </div>
                <div>
                    <p className="text-sm font-bold text-scholarly-navy">
                        Platform
                    </p>
                    <div className="mt-5 space-y-3 text-sm text-scholarly-slate-light">
                        <a
                            href="#scholarships"
                            className="block hover:text-scholarly-blue"
                        >
                            Find scholarships
                        </a>
                        <a
                            href="#application"
                            className="block hover:text-scholarly-blue"
                        >
                            Build your profile
                        </a>
                        <a
                            href="#mentors"
                            className="block hover:text-scholarly-blue"
                        >
                            Mentors
                        </a>
                        <a
                            href="#application"
                            className="block hover:text-scholarly-blue"
                        >
                            Application tools
                        </a>
                    </div>
                </div>
                <div>
                    <p className="text-sm font-bold text-scholarly-navy">
                        Resources
                    </p>
                    <div className="mt-5 space-y-3 text-sm text-scholarly-slate-light">
                        <a
                            href="#resources"
                            className="block hover:text-scholarly-blue"
                        >
                            Guides
                        </a>
                        <a
                            href="#scholarships"
                            className="block hover:text-scholarly-blue"
                        >
                            Scholarship database
                        </a>
                        <a
                            href="#resources"
                            className="block hover:text-scholarly-blue"
                        >
                            Blog
                        </a>
                        <a
                            href="#footer"
                            className="block hover:text-scholarly-blue"
                        >
                            Help center
                        </a>
                    </div>
                </div>
                <div>
                    <p className="text-sm font-bold text-scholarly-navy">
                        Company
                    </p>
                    <div className="mt-5 space-y-3 text-sm text-scholarly-slate-light">
                        <a
                            href="#footer"
                            className="block hover:text-scholarly-blue"
                        >
                            About us
                        </a>
                        <a
                            href="#footer"
                            className="block hover:text-scholarly-blue"
                        >
                            Our mission
                        </a>
                        <a
                            href="#footer"
                            className="block hover:text-scholarly-blue"
                        >
                            Careers
                        </a>
                        <a
                            href="#footer"
                            className="block hover:text-scholarly-blue"
                        >
                            Contact
                        </a>
                    </div>
                </div>
            </div>
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 border-t border-scholarly-border-soft px-5 py-6 text-xs text-scholarly-slate-light sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
                <p>© 2026 Scholarly. All rights reserved.</p>
                <div className="flex gap-5">
                    <a href="#footer" className="hover:text-scholarly-blue">
                        Privacy
                    </a>
                    <a href="#footer" className="hover:text-scholarly-blue">
                        Terms
                    </a>
                    <a href="#footer" className="hover:text-scholarly-blue">
                        Cookies
                    </a>
                </div>
            </div>
        </footer>
    );
}
