export type ReviewItem = {
    id: string;
    learner: string;
    initials: string;
    document: string;
    scholarship: string;
    submitted: string;
    due: string;
    priority: 'Needs attention' | 'On track';
    tone: 'blue' | 'coral' | 'gold' | 'teal';
};

export type MentorSession = {
    id: string;
    learner: string;
    initials: string;
    topic: string;
    time: string;
    date: string;
    tone: 'blue' | 'coral' | 'teal';
};

export const reviewQueue: ReviewItem[] = [
    {
        id: 'amina-sop',
        learner: 'Amina Yusuf',
        initials: 'AY',
        document: 'Statement of Purpose',
        scholarship: 'Chevening Scholarships',
        submitted: 'Submitted 2 hours ago',
        due: 'Due today',
        priority: 'Needs attention',
        tone: 'coral',
    },
    {
        id: 'david-cv',
        learner: 'David Mensah',
        initials: 'DM',
        document: 'Academic CV',
        scholarship: 'DAAD Scholarships',
        submitted: 'Submitted yesterday',
        due: 'Due tomorrow',
        priority: 'On track',
        tone: 'blue',
    },
    {
        id: 'lucia-sop',
        learner: 'Lucia Rossi',
        initials: 'LR',
        document: 'Statement of Purpose',
        scholarship: 'Erasmus Mundus',
        submitted: 'Submitted 2 days ago',
        due: 'Due in 3 days',
        priority: 'On track',
        tone: 'teal',
    },
    {
        id: 'sam-cv',
        learner: 'Sam Okoro',
        initials: 'SO',
        document: 'Scholarship CV',
        scholarship: 'Commonwealth Scholarship',
        submitted: 'Submitted 4 days ago',
        due: 'Due in 5 days',
        priority: 'On track',
        tone: 'gold',
    },
];

export const sessions: MentorSession[] = [
    {
        id: 'session-amina',
        learner: 'Amina Yusuf',
        initials: 'AY',
        topic: 'SOP feedback call',
        time: '10:30 AM',
        date: 'Today',
        tone: 'coral',
    },
    {
        id: 'session-david',
        learner: 'David Mensah',
        initials: 'DM',
        topic: 'CV review',
        time: '2:00 PM',
        date: 'Today',
        tone: 'blue',
    },
    {
        id: 'session-lucia',
        learner: 'Lucia Rossi',
        initials: 'LR',
        topic: 'Scholarship strategy',
        time: '11:00 AM',
        date: 'Tomorrow',
        tone: 'teal',
    },
];

export const recentMessages = [
    {
        learner: 'Amina Yusuf',
        initials: 'AY',
        message: 'Thank you for the thoughtful feedback...',
        time: '8 min ago',
        tone: 'coral',
    },
    {
        learner: 'David Mensah',
        initials: 'DM',
        message: 'I have uploaded the revised CV.',
        time: '1 hour ago',
        tone: 'blue',
    },
    {
        learner: 'Lucia Rossi',
        initials: 'LR',
        message: 'Could we discuss my program shortlist?',
        time: 'Yesterday',
        tone: 'teal',
    },
];
