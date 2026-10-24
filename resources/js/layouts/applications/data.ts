export type ApplicationStatus =
    | 'Draft'
    | 'In review'
    | 'Submitted'
    | 'Offer received';

export type Application = {
    id: string;
    title: string;
    provider: string;
    country: string;
    countryCode: string;
    status: ApplicationStatus;
    progress: number;
    deadline: string;
    deadlineLabel: string;
    nextStep: string;
    updated: string;
    color: 'blue' | 'teal' | 'gold' | 'coral';
};

export const applications: Application[] = [
    {
        id: 'chevening',
        title: 'Chevening Scholarships',
        provider: 'UK Government',
        country: 'United Kingdom',
        countryCode: 'GB',
        status: 'Draft',
        progress: 68,
        deadline: '18 Nov 2026',
        deadlineLabel: '14 days left',
        nextStep: 'Finish your personal statement',
        updated: 'Updated 2 hours ago',
        color: 'blue',
    },
    {
        id: 'daad',
        title: 'DAAD Development-Related Postgraduate Courses',
        provider: 'DAAD',
        country: 'Germany',
        countryCode: 'DE',
        status: 'In review',
        progress: 84,
        deadline: '5 Dec 2026',
        deadlineLabel: '32 days left',
        nextStep: 'Request your recommendation letter',
        updated: 'Updated yesterday',
        color: 'teal',
    },
    {
        id: 'erasmus',
        title: 'Erasmus Mundus Joint Masters',
        provider: 'European Union',
        country: 'Multiple countries',
        countryCode: 'EU',
        status: 'Submitted',
        progress: 100,
        deadline: '14 Jan 2027',
        deadlineLabel: '72 days left',
        nextStep: 'Track your application response',
        updated: 'Submitted 4 days ago',
        color: 'gold',
    },
    {
        id: 'fulbright',
        title: 'Fulbright Foreign Student Program',
        provider: 'Fulbright',
        country: 'United States',
        countryCode: 'US',
        status: 'Offer received',
        progress: 100,
        deadline: '1 Feb 2027',
        deadlineLabel: '91 days left',
        nextStep: 'Review your offer details',
        updated: 'Offer received 1 week ago',
        color: 'coral',
    },
];

export const statusFilters: Array<'All' | ApplicationStatus> = [
    'All',
    'Draft',
    'In review',
    'Submitted',
    'Offer received',
];
