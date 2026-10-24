export type BuilderMode = 'CV' | 'SOP';

export type BuilderTemplate = {
    id: string;
    name: string;
    description: string;
    accent: 'blue' | 'teal' | 'gold';
    recommended?: boolean;
};

export const templates: Record<BuilderMode, BuilderTemplate[]> = {
    CV: [
        {
            id: 'academic-modern',
            name: 'Academic modern',
            description: 'Clean sections for education, research, and impact.',
            accent: 'blue',
            recommended: true,
        },
        {
            id: 'scholarship-focus',
            name: 'Scholarship focus',
            description:
                'Put leadership, awards, and service front and center.',
            accent: 'teal',
        },
        {
            id: 'minimal-classic',
            name: 'Minimal classic',
            description:
                'A calm, traditional layout that keeps the focus on you.',
            accent: 'gold',
        },
    ],
    SOP: [
        {
            id: 'story-led',
            name: 'Story-led statement',
            description:
                'Build a personal narrative with a clear sense of purpose.',
            accent: 'blue',
            recommended: true,
        },
        {
            id: 'research-forward',
            name: 'Research forward',
            description:
                'Lead with your questions, experience, and future contribution.',
            accent: 'teal',
        },
        {
            id: 'career-impact',
            name: 'Career & impact',
            description:
                'Connect your journey to the change you want to create.',
            accent: 'gold',
        },
    ],
};

export const cvSections = ['Profile', 'Education', 'Experience', 'Skills'];
export const sopSections = [
    'Opening story',
    'Academic journey',
    'Why this program',
    'Future impact',
];
