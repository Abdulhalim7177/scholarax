import {
    BookOpen,
    FileText,
    Globe2,
    Layers,
    Search,
    UsersRound,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const icons: Record<string, LucideIcon> = {
    book: BookOpen,
    'file-text': FileText,
    globe: Globe2,
    layers: Layers,
    search: Search,
    users: UsersRound,
};

/**
 * Resolve a content block icon name to a Lucide icon.
 */
export function homeIcon(name: string | null | undefined): LucideIcon {
    return icons[name ?? ''] ?? Layers;
}
