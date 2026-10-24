export type Mentor = {
    id: string;
    name: string;
    role: string;
    organization: string;
    country: string;
    expertise: string[];
    languages: string[];
    rating: string;
    reviews: number;
    sessions: number;
    responseTime: string;
    availability: 'Available' | 'Limited availability';
    accent: 'blue' | 'teal' | 'coral' | 'gold';
    avatar: string;
    featured?: boolean;
};

export const mentors: Mentor[] = [
    {
        id: 'maya-chen',
        name: 'Dr. Maya Chen',
        role: 'Graduate Admissions Mentor',
        organization: 'University of Cambridge',
        country: 'United Kingdom',
        expertise: ['SOP review', 'UK scholarships', 'Research plans'],
        languages: ['English', 'Mandarin'],
        rating: '4.9',
        reviews: 48,
        sessions: 126,
        responseTime: 'Usually replies in 2 hours',
        availability: 'Available',
        accent: 'coral',
        avatar: 'https://i.pravatar.cc/160?img=47',
        featured: true,
    },
    {
        id: 'james-okafor',
        name: 'James Okafor',
        role: 'Scholarship Strategist',
        organization: 'DAAD Alumni Network',
        country: 'Germany',
        expertise: ['DAAD', 'STEM applications', 'CV review'],
        languages: ['English', 'German'],
        rating: '4.8',
        reviews: 36,
        sessions: 94,
        responseTime: 'Usually replies in 4 hours',
        availability: 'Available',
        accent: 'blue',
        avatar: 'https://i.pravatar.cc/160?img=12',
    },
    {
        id: 'sofia-martinez',
        name: 'Sofia Martinez',
        role: 'International Education Advisor',
        organization: 'Fulbright Alumni Association',
        country: 'United States',
        expertise: ['Fulbright', 'Personal statements', 'Interview prep'],
        languages: ['English', 'Spanish'],
        rating: '5.0',
        reviews: 29,
        sessions: 71,
        responseTime: 'Usually replies tomorrow',
        availability: 'Limited availability',
        accent: 'gold',
        avatar: 'https://i.pravatar.cc/160?img=32',
    },
    {
        id: 'leila-haddad',
        name: 'Leila Haddad',
        role: 'Public Policy Researcher',
        organization: 'Erasmus Mundus Alumni',
        country: 'France',
        expertise: ['Erasmus Mundus', 'Public policy', 'Academic CVs'],
        languages: ['English', 'French', 'Arabic'],
        rating: '4.9',
        reviews: 41,
        sessions: 108,
        responseTime: 'Usually replies in 3 hours',
        availability: 'Available',
        accent: 'teal',
        avatar: 'https://i.pravatar.cc/160?img=44',
    },
    {
        id: 'daniel-kim',
        name: 'Daniel Kim',
        role: 'PhD Application Mentor',
        organization: 'University of Melbourne',
        country: 'Australia',
        expertise: ['PhD applications', 'Research proposals', 'STEM'],
        languages: ['English', 'Korean'],
        rating: '4.8',
        reviews: 22,
        sessions: 63,
        responseTime: 'Usually replies in 6 hours',
        availability: 'Limited availability',
        accent: 'blue',
        avatar: 'https://i.pravatar.cc/160?img=68',
    },
    {
        id: 'aisha-bello',
        name: 'Aisha Bello',
        role: 'Personal Statement Coach',
        organization: 'Commonwealth Alumni Network',
        country: 'United Kingdom',
        expertise: ['Commonwealth', 'Storytelling', 'Interview prep'],
        languages: ['English', 'French'],
        rating: '4.9',
        reviews: 33,
        sessions: 87,
        responseTime: 'Usually replies in 5 hours',
        availability: 'Available',
        accent: 'coral',
        avatar: 'https://i.pravatar.cc/160?img=49',
    },
];

export const mentorExpertise = [
    'All expertise',
    'SOP review',
    'CV review',
    'Interview prep',
    'Research proposals',
    'STEM applications',
];

export const mentorCountries = [
    'All locations',
    'United Kingdom',
    'Germany',
    'United States',
    'France',
    'Australia',
];
