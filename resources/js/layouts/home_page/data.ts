import { FileText, Search, UsersRound } from 'lucide-react';

export const features = [
    {
        icon: Search,
        title: 'Discover scholarships',
        body: 'Find opportunities that match your goals, background, field, and preferred country.',
        tone: 'blue',
    },
    {
        icon: FileText,
        title: 'Build your application',
        body: 'Create a standout CV and statement of purpose with guided templates.',
        tone: 'gold',
    },
    {
        icon: UsersRound,
        title: 'Get expert guidance',
        body: 'Connect with experienced mentors who can help you submit with confidence.',
        tone: 'coral',
    },
] as const;
