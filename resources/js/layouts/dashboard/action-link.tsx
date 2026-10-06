import { Link } from '@inertiajs/react';

export const comingSoon = (feature: string) =>
    `/coming-soon?feature=${encodeURIComponent(feature)}`;

export function ActionLink({
    href,
    children,
    className = '',
    ariaLabel,
}: {
    href: string;
    children: React.ReactNode;
    className?: string;
    ariaLabel?: string;
}) {
    return (
        <Link href={href} aria-label={ariaLabel} className={className}>
            {children}
        </Link>
    );
}
