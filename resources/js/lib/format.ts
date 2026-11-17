export function relativeTime(value: string | null): string {
    if (!value) {
        return '—';
    }

    const date = new Date(value);
    const minutes = Math.round((Date.now() - date.getTime()) / 60_000);

    if (minutes < 1) {
        return 'Just now';
    }

    if (minutes < 60) {
        return `${minutes}m ago`;
    }

    const hours = Math.round(minutes / 60);

    if (hours < 24) {
        return `${hours}h ago`;
    }

    const days = Math.round(hours / 24);

    if (days < 30) {
        return `${days}d ago`;
    }

    return date.toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}
