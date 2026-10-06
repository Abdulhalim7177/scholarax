type Props = {
    title: string;
    score: string;
    caption: string;
    body: string;
    tone: 'teal' | 'blue';
};

export default function StrengthCard({
    title,
    score,
    caption,
    body,
    tone,
}: Props) {
    return (
        <div className="flex items-center gap-5 rounded-2xl bg-scholarly-blue-white p-5">
            <div
                className={`flex size-24 shrink-0 items-center justify-center rounded-full border-[10px] ${tone === 'teal' ? 'border-scholarly-teal text-scholarly-teal' : 'border-scholarly-blue text-scholarly-blue'}`}
            >
                <span className="text-xl font-bold text-scholarly-navy">
                    {score}
                </span>
            </div>
            <div>
                <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold">{title}</h3>
                    <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${tone === 'teal' ? 'bg-scholarly-teal-soft text-scholarly-teal' : 'bg-scholarly-blue-soft text-scholarly-blue'}`}
                    >
                        {caption}
                    </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-scholarly-slate">
                    {body}
                </p>
            </div>
        </div>
    );
}
