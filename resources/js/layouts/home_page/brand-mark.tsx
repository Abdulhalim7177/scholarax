import { BookOpen } from 'lucide-react';

export default function BrandMark({ light = false }: { light?: boolean }) {
    return (
        <div className="flex items-center gap-2.5">
            <div
                className={`flex size-10 items-center justify-center rounded-[13px] ${light ? 'bg-white/15 text-white' : 'bg-scholarly-blue text-white'}`}
            >
                <BookOpen className="size-5" strokeWidth={2.2} />
            </div>
            <span
                className={`text-[19px] font-bold tracking-[-0.04em] ${light ? 'text-white' : 'text-scholarly-navy'}`}
            >
                Scholarly
            </span>
        </div>
    );
}
