export type Scholarship = {
    id: string;
    title: string;
    provider: string;
    country: string;
    countryCode: string;
    level: string;
    field: string;
    funding: string;
    deadline: string;
    deadlineLabel: string;
    daysLeft: number;
    description: string;
    featured?: boolean;
};

export const scholarships: Scholarship[] = [
    {
        id: 'chevening',
        title: 'Chevening Scholarships',
        provider: 'UK Government',
        country: 'United Kingdom',
        countryCode: 'GB',
        level: "Master's",
        field: 'All fields',
        funding: 'Fully funded',
        deadline: '18 Nov 2026',
        deadlineLabel: 'Deadline soon',
        daysLeft: 14,
        description:
            'Build your network and study a one-year master’s degree at a leading UK university.',
        featured: true,
    },
    {
        id: 'daad',
        title: 'DAAD Development-Related Postgraduate Courses',
        provider: 'DAAD',
        country: 'Germany',
        countryCode: 'DE',
        level: "Master's / PhD",
        field: 'Development studies',
        funding: 'Fully funded',
        deadline: '5 Dec 2026',
        deadlineLabel: '32 days left',
        daysLeft: 32,
        description:
            'Advance your career with postgraduate study at a German university and a global cohort.',
    },
    {
        id: 'erasmus',
        title: 'Erasmus Mundus Joint Masters',
        provider: 'European Union',
        country: 'Multiple countries',
        countryCode: 'EU',
        level: "Master's",
        field: 'Multiple fields',
        funding: 'Fully funded',
        deadline: '14 Jan 2027',
        deadlineLabel: '72 days left',
        daysLeft: 72,
        description:
            'Study across several European universities with a highly international learning experience.',
    },
    {
        id: 'fulbright',
        title: 'Fulbright Foreign Student Program',
        provider: 'Fulbright',
        country: 'United States',
        countryCode: 'US',
        level: "Master's / PhD",
        field: 'All fields',
        funding: 'Fully funded',
        deadline: '1 Feb 2027',
        deadlineLabel: '91 days left',
        daysLeft: 91,
        description:
            'Join a community of emerging leaders while pursuing graduate study in the United States.',
    },
    {
        id: 'australia-awards',
        title: 'Australia Awards Scholarships',
        provider: 'Australian Government',
        country: 'Australia',
        countryCode: 'AU',
        level: "Master's",
        field: 'Public policy',
        funding: 'Fully funded',
        deadline: '30 Apr 2027',
        deadlineLabel: '179 days left',
        daysLeft: 179,
        description:
            'Develop the skills to contribute to sustainable development in your home country.',
    },
    {
        id: 'commonwealth',
        title: 'Commonwealth Master’s Scholarships',
        provider: 'Commonwealth Scholarship Commission',
        country: 'United Kingdom',
        countryCode: 'GB',
        level: "Master's",
        field: 'Multiple fields',
        funding: 'Fully funded',
        deadline: '22 Oct 2026',
        deadlineLabel: 'Deadline soon',
        daysLeft: 5,
        description:
            'Study in the UK and join a global network focused on development and positive change.',
    },
];

export const scholarshipCountries = [
    'All countries',
    'United Kingdom',
    'Germany',
    'United States',
    'Australia',
    'Multiple countries',
];

export const scholarshipLevels = [
    'All study levels',
    "Master's",
    "Master's / PhD",
    'PhD',
];

export const scholarshipFields = [
    'All fields',
    'Development studies',
    'Public policy',
    'Multiple fields',
];
