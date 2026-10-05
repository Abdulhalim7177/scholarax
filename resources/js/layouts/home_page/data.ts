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

export const scholarships = [
    {
        initials: 'C',
        name: 'Chevening Scholarships',
        provider: 'UK Government',
        country: 'United Kingdom',
        level: "Master's",
        tone: 'bg-scholarly-navy-light text-white',
    },
    {
        initials: 'D',
        name: 'DAAD Scholarships',
        provider: 'German Academic Exchange Service',
        country: 'Germany',
        level: "Master's / PhD",
        tone: 'bg-scholarly-blue-soft text-scholarly-blue',
    },
    {
        initials: 'EU',
        name: 'Erasmus+ Programme',
        provider: 'European Union',
        country: 'Multiple countries',
        level: "Bachelor's / Master's",
        tone: 'bg-scholarly-gold-soft text-scholarly-gold-dark',
    },
] as const;
