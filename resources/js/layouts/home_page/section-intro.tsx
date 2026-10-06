export default function SectionIntro({
    eyebrow,
    title,
    body,
    align = 'left',
}: {
    eyebrow: string;
    title: string;
    body?: string;
    align?: 'left' | 'center';
}) {
    return (
        <div
            className={
                align === 'center'
                    ? 'mx-auto max-w-2xl text-center'
                    : 'max-w-2xl'
            }
        >
            <p className="mb-3 text-[11px] font-bold tracking-[0.2em] text-scholarly-blue uppercase">
                {eyebrow}
            </p>
            <h2 className="font-display text-4xl leading-[1.08] tracking-[-0.04em] text-scholarly-navy sm:text-[48px]">
                {title}
            </h2>
            {body ? (
                <p className="mt-5 text-[16px] leading-7 text-scholarly-slate">
                    {body}
                </p>
            ) : null}
        </div>
    );
}
