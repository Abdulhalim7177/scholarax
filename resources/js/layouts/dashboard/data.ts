export const savedScholarships = [
    {
        name: 'Chevening Scholarships',
        country: 'United Kingdom',
        level: "Master's",
        status: 'Fully funded',
        tone: 'teal',
        initials: 'C',
    },
    {
        name: 'DAAD Scholarships',
        country: 'Germany',
        level: "Master's / PhD",
        status: 'Fully funded',
        tone: 'teal',
        initials: 'D',
    },
    {
        name: 'Erasmus Mundus',
        country: 'Multiple countries',
        level: "Master's",
        status: 'Fully funded',
        tone: 'teal',
        initials: 'EU',
    },
    {
        name: 'Fulbright Foreign Student Program',
        country: 'United States',
        level: "Master's / PhD",
        status: 'Deadline soon',
        tone: 'gold',
        initials: 'F',
    },
] as const;

export const tasks = [
    {
        title: 'Personal statement',
        body: 'Draft your SOP',
        due: '18 Nov 2026',
        complete: false,
    },
    {
        title: 'Recommendation letter',
        body: 'Request from your referee',
        due: '10 Nov 2026',
        complete: true,
    },
    {
        title: 'English test score',
        body: 'Upload IELTS/TOEFL score',
        due: '25 Nov 2026',
        complete: false,
    },
    {
        title: 'Application fee waiver',
        body: 'Check eligibility and apply',
        due: '1 Dec 2026',
        complete: false,
    },
] as const;
