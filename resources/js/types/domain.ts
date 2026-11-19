export type FundingType =
    | 'fully_funded'
    | 'partial'
    | 'tuition_only'
    | 'stipend_only';

export type ScholarshipStatus =
    | 'draft'
    | 'pending'
    | 'live'
    | 'closed'
    | 'archived';

export type ScholarshipOption = {
    value: string;
    label: string;
};

export type ScholarshipSummary = {
    id: number;
    slug: string;
    title: string;
    provider: string;
    country: string;
    countryCode: string;
    level: string;
    field: string;
    funding: string;
    fundingType: FundingType;
    deadline: string | null;
    deadlineLabel: string;
    daysLeft: number | null;
    description: string;
    featured: boolean;
    saved: boolean;
    status: ScholarshipStatus;
};

export type ScholarshipDetail = ScholarshipSummary & {
    summary: string | null;
    eligibility: string | null;
    requiredDocuments: string[];
    applicationUrl: string | null;
    publishedAt: string | null;
    updatedAt: string | null;
};

export type ScholarshipFilters = {
    q: string;
    country: string;
    level: string;
    field: string;
    funding: boolean;
    sort: 'soonest' | 'latest';
};

export type ScholarshipFilterOptions = {
    countries: ScholarshipOption[];
    levels: ScholarshipOption[];
    fields: ScholarshipOption[];
};

export type PaginatedLink = {
    url: string | null;
    label: string;
    active: boolean;
};

export type Paginated<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: PaginatedLink[];
};

export type ScholarshipIndexProps = {
    scholarships: Paginated<ScholarshipSummary>;
    filters: ScholarshipFilters;
    options: ScholarshipFilterOptions;
    savedCount: number;
};

export type ScholarshipApplicationInfo = {
    id: number;
    status: ApplicationStatusValue;
    statusLabel: string;
};

export type ScholarshipShowProps = {
    scholarship: ScholarshipDetail;
    application: ScholarshipApplicationInfo | null;
};

export type AdminScholarship = {
    id: number;
    slug: string;
    title: string;
    provider: string;
    country: string;
    status: ScholarshipStatus;
    statusLabel: string;
    deadline: string | null;
    deadlineAt: string | null;
    updatedAt: string | null;
    isFeatured: boolean;
};

export type AdminScholarshipStats = {
    live: number;
    createdThisMonth: number;
    pending: number;
};

export type AdminScholarshipIndexProps = {
    scholarships: Paginated<AdminScholarship>;
    filters: {
        q: string;
        status: string;
    };
    statuses: ScholarshipOption[];
    stats: AdminScholarshipStats;
};

export type AdminScholarshipFormValues = {
    title: string;
    provider: string;
    summary: string;
    description: string;
    host_country_id: string;
    funding_type: FundingType;
    deadline_at: string;
    application_url: string;
    eligibility: string;
    required_documents: string;
    status: ScholarshipStatus;
    is_featured: boolean;
    study_level_ids: string[];
    field_of_study_ids: string[];
    eligible_country_ids: string[];
};

export type AdminScholarshipFormRecord = AdminScholarshipFormValues & {
    id: number;
    slug: string;
};

export type AdminScholarshipFormOptions = {
    countries: ScholarshipOption[];
    levels: ScholarshipOption[];
    fields: ScholarshipOption[];
    fundingTypes: ScholarshipOption[];
    statuses: ScholarshipOption[];
};

export type AdminScholarshipFormProps = {
    scholarship: AdminScholarshipFormRecord | null;
    options: AdminScholarshipFormOptions;
};

export type HomePageData = {
    featuredScholarships: ScholarshipSummary[];
    scholarshipCount: number;
    countryCount: number;
    studentCount: number;
};

export type ApplicationStatusValue =
    | 'draft'
    | 'in_review'
    | 'submitted'
    | 'offer_received'
    | 'rejected'
    | 'withdrawn';

export type ApplicationDocumentStatusValue =
    | 'draft'
    | 'submitted'
    | 'changes_requested'
    | 'approved';

export type ScholarshipReference = {
    id: number;
    slug: string;
    title: string;
    provider: string;
    summary: string | null;
    country: string;
    countryCode: string;
    level: string;
    funding: string;
};

export type ApplicationSummary = {
    id: number;
    status: ApplicationStatusValue;
    statusLabel: string;
    progress: number;
    nextStep: string;
    deadline: string | null;
    deadlineAt: string | null;
    deadlineLabel: string;
    daysLeft: number | null;
    submittedAt: string | null;
    decisionAt: string | null;
    updatedAt: string | null;
    scholarship: ScholarshipReference | null;
};

export type ApplicationTaskItem = {
    id: number;
    title: string;
    description: string | null;
    dueAt: string | null;
    due: string | null;
    completed: boolean;
    completedAt: string | null;
    type: string | null;
};

export type ApplicationDocumentItem = {
    id: number;
    type: string;
    typeLabel: string;
    title: string;
    version: number;
    status: ApplicationDocumentStatusValue;
    statusLabel: string;
    hasFile: boolean;
    builderDocumentId: number | null;
    fileName: string | null;
    downloadUrl: string | null;
    submittedAt: string | null;
    createdAt: string | null;
};

export type ApplicationHistoryItem = {
    id: number;
    fromStatus: ApplicationStatusValue | null;
    fromLabel: string | null;
    toStatus: ApplicationStatusValue;
    toLabel: string;
    note: string | null;
    changedBy: string | null;
    createdAt: string | null;
};

export type ApplicationDetail = ApplicationSummary & {
    scholarship:
        | (ScholarshipReference & {
              description: string;
              eligibility: string | null;
              requiredDocuments: string[];
              applicationUrl: string | null;
              field: string;
          })
        | null;
    tasks: ApplicationTaskItem[];
    documents: ApplicationDocumentItem[];
    history: ApplicationHistoryItem[];
    taskSummary: { total: number; completed: number };
    documentSummary: { total: number; complete: number };
};

export type ApplicationFilters = {
    q: string;
    status: string;
};

export type ApplicationChecklistItem = {
    key: string;
    label: string;
    complete: boolean;
};

export type ApplicationIndexProps = {
    applications: Paginated<ApplicationSummary>;
    filters: ApplicationFilters;
    statuses: ScholarshipOption[];
    stats: {
        total: number;
        draft: number;
        in_review: number;
        offer_received: number;
    };
    summary: {
        overallProgress: number;
        checklist: ApplicationChecklistItem[];
        completedChecks: number;
        totalChecks: number;
    };
};

export type ApplicationCreateOption = {
    id: number;
    title: string;
    provider: string;
    country: string;
    level: string;
    deadline: string | null;
    summary: string | null;
    requiredDocuments: string[];
};

export type ApplicationCreateProps = {
    scholarships: ApplicationCreateOption[];
    selectedScholarshipId: number | null;
};

export type ApplicationShowProps = {
    application: ApplicationDetail;
    statuses: ScholarshipOption[];
    documentTypes: ScholarshipOption[];
    documentStatuses: ScholarshipOption[];
};

export type StudentProfileRecord = {
    headline: string;
    bio: string;
    date_of_birth: string;
    city: string;
    country_id: string;
    linkedin_url: string;
    website_url: string;
    target_level_id: string;
    target_field_id: string;
};

export type EducationRecord = {
    id: number;
    institution: string;
    degree: string;
    field: string;
    started_at: string;
    ended_at: string;
    grade: string;
    is_current: boolean;
};

export type WorkExperienceRecord = {
    id: number;
    organization: string;
    role: string;
    started_at: string;
    ended_at: string;
    description: string;
    is_current: boolean;
};

export type TestScoreRecord = {
    id: number;
    type: string;
    score: string;
    tested_at: string;
    expires_at: string;
};

export type ProfileCompletion = {
    score: number;
    completed: number;
    total: number;
    checks: Array<{ key: string; label: string; complete: boolean }>;
};

export type StudentProfileProps = {
    profile: StudentProfileRecord | null;
    educations: EducationRecord[];
    workExperiences: WorkExperienceRecord[];
    testScores: TestScoreRecord[];
    options: ScholarshipFilterOptions;
    completion: ProfileCompletion;
};

export type DashboardMetrics = {
    savedScholarships: number;
    applicationsInProgress: number;
    profileCompletion: number;
    upcomingDeadlines: number;
};

export type DashboardJourney = {
    discover: boolean;
    prepare: boolean;
    apply: boolean;
};

export type DashboardStrength = {
    profile: { score: number; completed: number; total: number };
    application: {
        score: number;
        tasksCompleted: number;
        tasksTotal: number;
        documentsComplete: number;
        documentsTotal: number;
    };
};

export type DashboardDeadline = {
    id: string;
    title: string;
    label: string;
    month: string;
    day: string;
    timestamp: number;
    url: string;
};

export type DashboardTask = {
    id: number;
    title: string;
    description: string | null;
    due: string | null;
    applicationId: number;
    applicationTitle: string | null;
    updateUrl: string;
};

export type ActivityEntry = {
    id: number;
    type: string;
    title: string;
    body: string | null;
    createdAt: string | null;
};

export type DashboardFocus = {
    title: string;
    body: string;
    href: string;
    action: string;
};

export type StudentDashboardProps = {
    pendingInvitations: Array<{
        code: string;
        inviterName: string;
        team: { name: string; slug: string };
    }>;
    metrics: DashboardMetrics;
    currentApplication: ApplicationSummary | null;
    journey: DashboardJourney;
    strength: DashboardStrength;
    savedScholarships: ScholarshipSummary[];
    deadlines: DashboardDeadline[];
    tasks: DashboardTask[];
    activity: ActivityEntry[];
    focus: DashboardFocus;
};

export type BuilderMode = 'cv' | 'sop';

export type BuilderAccent = 'blue' | 'teal' | 'gold';

export type BuilderTemplatePayload = {
    id: number;
    type: BuilderMode;
    name: string;
    slug: string;
    description: string;
    accent: BuilderAccent;
    recommended: boolean;
};

export type BuilderSectionPayload = {
    id: number;
    key: string;
    title: string;
    content: string | null;
    sortOrder: number;
    completed: boolean;
    completedAt: string | null;
};

export type BuilderAttachment = {
    applicationDocumentId: number;
    applicationId: number;
    applicationTitle: string;
    status: ApplicationDocumentStatusValue;
    statusLabel: string;
    hasFile: boolean;
};

export type BuilderDocument = {
    id: number;
    type: BuilderMode;
    typeLabel: string;
    title: string;
    headline: string | null;
    summary: string | null;
    status: 'draft' | 'in_progress' | 'complete';
    statusLabel: string;
    templateId: number | null;
    lastSavedAt: string | null;
    lastSavedLabel: string | null;
    updatedAt: string | null;
    strength: number;
    completedSections: number;
    totalSections: number;
    nextAction: string;
    sections: BuilderSectionPayload[];
    attachments: BuilderAttachment[];
};

export type BuilderApplicationOption = {
    id: number;
    title: string;
    deadline: string | null;
};

export type BuilderDraft = {
    title: string;
    headline: string;
    summary: string;
    templateId: number | null;
    sections: Record<number, string>;
};

export type CvSopBuilderProps = {
    documents: Record<BuilderMode, BuilderDocument>;
    templates: BuilderTemplatePayload[];
    applications: BuilderApplicationOption[];
};

export type MentorAvailabilityValue = 'available' | 'limited' | 'unavailable';

export type MentorAccent = 'blue' | 'teal' | 'coral' | 'gold';

export type MentorSummary = {
    id: number;
    name: string;
    headline: string | null;
    role: string | null;
    organization: string | null;
    country: string;
    countryCode: string | null;
    expertise: string[];
    languages: string[];
    rating: string;
    reviews: number;
    sessions: number;
    learners: number;
    responseTime: string;
    availability: MentorAvailabilityValue;
    availabilityLabel: string;
    accent: MentorAccent;
    avatarUrl: string | null;
    featured: boolean;
    verified: boolean;
};

export type MentorAvailabilitySlotPayload = {
    id: number;
    weekday: number;
    weekdayLabel: string;
    startTime: string;
    endTime: string;
    timezone: string;
    isActive: boolean;
    label: string;
};

export type MentorDetail = MentorSummary & {
    bio: string | null;
    yearsExperience: number | null;
    linkedinUrl: string | null;
    websiteUrl: string | null;
    introVideoUrl: string | null;
    verifiedAt: string | null;
    slots: MentorAvailabilitySlotPayload[];
};

export type MentorFilterState = {
    q: string;
    expertise: string;
    country: string;
    availability: boolean;
};

export type MentorDirectoryStats = {
    mentors: number;
    sessions: number;
    rating: string;
    reviews: number;
};

export type MentorDirectoryProps = {
    mentors: Paginated<MentorSummary>;
    filters: MentorFilterState;
    options: {
        expertise: ScholarshipOption[];
        countries: ScholarshipOption[];
    };
    stats: MentorDirectoryStats;
    recommended: MentorSummary | null;
};

export type MentorExpertiseTag = {
    id: number;
    name: string;
    slug: string;
};

export type MentorProfileForm = {
    name: string;
    headline: string;
    current_role: string;
    organization: string;
    country_id: string;
    bio: string;
    languages: string;
    years_experience: string;
    linkedin_url: string;
    website_url: string;
    availability_status: MentorAvailabilityValue;
    avatar_url: string | null;
    intro_video_url: string | null;
};

export type MentorOwnProfileProps = {
    profile: MentorProfileForm;
    verification: {
        status: 'pending' | 'verified' | 'rejected';
        label: string;
        verifiedAt: string | null;
    };
    expertise: MentorExpertiseTag[];
    availableExpertise: MentorExpertiseTag[];
    slots: MentorAvailabilitySlotPayload[];
    options: {
        countries: ScholarshipOption[];
        availabilityStatuses: ScholarshipOption[];
        weekdays: ScholarshipOption[];
    };
    completion: ProfileCompletion;
    publicUrl: string;
};

export type StudentMentorship = {
    id: number;
    status: 'active' | 'paused' | 'completed' | 'cancelled';
    statusLabel: string;
    goals: string | null;
    startedAt: string | null;
    canRequestSession: boolean;
    hasPendingSession: boolean;
    nextSession: {
        topic: string;
        date: string;
        time: string;
        statusLabel: string;
    } | null;
};

export type MentorShowProps = {
    mentor: MentorDetail;
    mentorship: StudentMentorship | null;
};

export type MentorReviewItem = {
    id: number;
    learner: string;
    initials: string;
    document: string;
    documentType: string;
    scholarship: string;
    submitted: string;
    due: string;
    dueAt: string | null;
    priority: 'Needs attention' | 'On track';
    priorityValue: 'high' | 'normal';
    status: 'pending' | 'in_review' | 'completed' | 'overdue';
    statusLabel: string;
    feedback: string | null;
    tone: MentorAccent;
};

export type MentorSessionSummary = {
    id: number;
    learner: string;
    initials: string;
    topic: string;
    time: string;
    date: string;
    status: 'requested' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
    statusLabel: string;
    tone: MentorAccent;
};

export type MentorSessionDetail = MentorSessionSummary & {
    mentorshipId: number;
    scheduledAt: string;
    dateLabel: string;
    duration: string;
    meetingUrl: string | null;
    notes: string | null;
    attendance: 'pending' | 'attended' | 'missed' | null;
    attendanceLabel: string | null;
    requestedByStudent: boolean;
};

export type MentorMessageSummary = {
    mentorshipId: number;
    learner: string;
    initials: string;
    message: string;
    time: string | null;
    tone: MentorAccent;
    unread: boolean;
};

export type MentorDashboardProps = {
    mentor: {
        name: string;
        firstName: string;
        avatarUrl: string | null;
    };
    stats: {
        activeLearners: number;
        newLearners: number;
        reviewsCompleted: number;
        rating: string;
        reviews: number;
        responseTime: string;
    };
    reviews: MentorReviewItem[];
    sessions: MentorSessionSummary[];
    messages: MentorMessageSummary[];
    impact: {
        learnersSupported: number;
        year: number;
    };
};

export type MentorLearner = {
    id: number;
    studentId: number;
    name: string;
    initials: string;
    email: string;
    avatarUrl: string | null;
    goal: string;
    progress: number;
    next: string;
    status: string;
    statusTone: 'active' | 'new' | 'warn' | 'muted';
    tone: MentorAccent;
    started: string | null;
    applicationCount: number;
    nextSession: {
        topic: string;
        date: string;
        time: string;
    } | null;
    messageUrl: string;
};

export type MentorLearnersProps = {
    stats: {
        activeLearners: number;
        averageProgress: number;
        unreadMessages: number;
    };
    learners: MentorLearner[];
    filters: { q: string };
};

export type MentorSessionsProps = {
    stats: {
        upcoming: number;
        availableHours: string;
        attendanceRate: number;
        attendanceSample: number;
    };
    weekLabel: string;
    upcoming: MentorSessionDetail[];
    recent: MentorSessionDetail[];
    availability: Array<{
        id: number;
        label: string;
        isActive: boolean;
    }>;
    learners: Array<{
        value: string;
        label: string;
    }>;
};

export type MentorImpactProps = {
    stats: {
        learners: number;
        progress: number;
        rating: string;
        reviews: number;
        offerRate: number;
    };
    series: Array<{
        label: string;
        value: number;
        height: number;
    }>;
    helpfulness: number;
    voices: Array<{
        quote: string;
        learner: string;
    }>;
};

export type MentorReviewQueueProps = {
    stats: {
        waiting: number;
        dueToday: number;
        helpfulness: number;
    };
    items: MentorReviewItem[];
};

export type MentorMessageThreadItem = {
    id: number;
    body: string;
    fromMentor: boolean;
    senderName: string;
    time: string | null;
    date: string | null;
    read: boolean;
};

export type MentorMessagesProps = {
    stats: {
        conversations: number;
        unread: number;
    };
    conversations: Array<{
        mentorshipId: number;
        learner: string;
        initials: string;
        avatarUrl: string | null;
        goal: string | null;
        lastMessage: string | null;
        lastMessageAt: string | null;
        unread: number;
        tone: MentorAccent;
        active: boolean;
    }>;
    active: {
        mentorshipId: number;
        learner: string;
        initials: string;
        avatarUrl: string | null;
        goal: string | null;
    } | null;
    thread: MentorMessageThreadItem[];
};

export type AdminTone = 'blue' | 'teal' | 'coral' | 'gold';

export type AdminDashboardProps = {
    stats: {
        totalUsers: number;
        usersThisMonth: number;
        usersGrowth: number;
        liveScholarships: number;
        scholarshipsThisMonth: number;
        applicationsTracked: number;
        submittedThisWeek: number;
        activeMentorships: number;
        verifiedMentors: number;
    };
    moderation: {
        openTasks: number;
        items: Array<{
            key: string;
            label: string;
            count: number;
            note: string;
            href: string;
            tone: AdminTone;
        }>;
    };
    recentUsers: Array<{
        id: number;
        name: string;
        email: string;
        role: string;
        roleLabel: string;
        initials: string;
        tone: AdminTone;
        joinedAt: string | null;
    }>;
    checks: Array<{
        label: string;
        ok: boolean;
        note: string;
    }>;
    checkedAt: string;
};

export type AdminUserRow = {
    id: number;
    name: string;
    email: string;
    role: string;
    roleLabel: string;
    status: 'active' | 'pending';
    initials: string;
    tone: AdminTone;
    mentorProfileId: number | null;
    joinedAt: string | null;
};

export type AdminUsersProps = {
    users: Paginated<AdminUserRow>;
    filters: {
        q: string;
        role: string;
    };
    roles: ScholarshipOption[];
    stats: {
        total: number;
        verifiedMentors: number;
        newThisWeek: number;
    };
};

export type AdminMentorRow = {
    id: number;
    name: string;
    headline: string | null;
    specialty: string | null;
    organization: string | null;
    country: string | null;
    status: string;
    statusLabel: string;
    rating: string | null;
    reviews: number;
    learners: number;
    initials: string;
    tone: AdminTone;
};

export type AdminMentorsProps = {
    mentors: Paginated<AdminMentorRow>;
    filters: {
        q: string;
        status: string;
    };
    statuses: ScholarshipOption[];
    stats: {
        verified: number;
        pending: number;
        averageRating: string;
    };
};

export type AdminApplicationRow = {
    id: number;
    learner: string;
    learnerEmail: string;
    scholarship: string;
    stage: string;
    stageLabel: string;
    progress: number;
    risk: 'normal' | 'needs_check';
    submittedAt: string | null;
    deadlineAt: string | null;
    initials: string;
    tone: AdminTone;
};

export type AdminApplicationsProps = {
    applications: Paginated<AdminApplicationRow>;
    filters: {
        q: string;
        stage: string;
    };
    stages: ScholarshipOption[];
    stats: {
        tracked: number;
        submittedThisWeek: number;
        needsAttention: number;
    };
};

export type AdminModerationRow = {
    id: number;
    targetType: string;
    targetLabel: string;
    targetUrl: string | null;
    reason: string;
    reasonLabel: string;
    details: string | null;
    reporter: string;
    status: string;
    statusLabel: string;
    resolutionNote: string | null;
    resolvedAt: string | null;
    createdAt: string | null;
};

export type AdminModerationProps = {
    reports: Paginated<AdminModerationRow>;
    filters: {
        q: string;
        status: string;
    };
    statuses: ScholarshipOption[];
    stats: {
        open: number;
        resolvedThisWeek: number;
        dismissed: number;
    };
};

export type AdminReportProps = {
    stats: {
        activeUsers: {
            value: number;
            change: number;
        };
        completion: {
            value: number;
            change: number;
        };
        matchRate: {
            value: number;
            change: number;
        };
        satisfaction: {
            value: number;
            responses: number;
        };
    };
    series: Array<{
        label: string;
        users: number;
        applications: number;
        usersHeight: number;
        applicationsHeight: number;
    }>;
    destinations: Array<{
        country: string;
        count: number;
        percent: number;
    }>;
    exports: Array<{
        id: number;
        status: string;
        statusLabel: string;
        rows: number;
        requestedAt: string | null;
        completedAt: string | null;
        downloadUrl: string | null;
    }>;
    generatedAt: string;
};

export type PlatformSettingValues = {
    require_mentor_verification: boolean;
    review_new_scholarships: boolean;
    report_notifications: boolean;
    weekly_platform_digest: boolean;
    default_timezone: string;
    application_data_retention_months: number;
};

export type AdminSettingsProps = {
    settings: PlatformSettingValues;
    options: {
        timezones: ScholarshipOption[];
        retention: ScholarshipOption[];
    };
    updatedAt: string | null;
};

export type HomeTone = 'blue' | 'teal' | 'coral' | 'gold';

export type HomeContentBlock = {
    id: number;
    eyebrow: string | null;
    title: string;
    body: string | null;
    badge: string | null;
    icon: string | null;
    tone: HomeTone;
};

export type HomeImpactStat = {
    key: string;
    label: string;
    icon: string;
    value: number;
};

export type HomeTestimonial = {
    id: number;
    quote: string;
    authorName: string;
    authorDetail: string | null;
    initials: string;
    tone: HomeTone;
};

export type HomeContent = {
    features: HomeContentBlock[];
    processSteps: HomeContentBlock[];
    applicationSteps: HomeContentBlock[];
};

export type HomeApplicationPreview = {
    progress: number;
    completedSteps: number;
    totalSteps: number;
};

export type HomeDeadline = {
    id: number;
    title: string;
    url: string;
    date: string;
    monthLabel: string;
    day: number;
    daysLeft: number;
};

export type NotificationEntry = {
    id: number;
    type: string;
    title: string;
    body: string | null;
    createdAt: string | null;
};

export type NotificationsProps = {
    notifications: Paginated<NotificationEntry>;
};

export type BuilderPreviewProps = {
    document: BuilderDocument;
};

export type MentorLearnerApplication = {
    id: number;
    scholarship: string;
    status: string;
    statusLabel: string;
    progress: number;
    nextStep: string | null;
    deadlineAt: string | null;
    openTasks: number;
};

export type MentorLearnerSession = {
    id: number;
    topic: string;
    date: string;
    time: string;
    status: string;
    statusLabel: string;
};

export type MentorLearnerDetailProps = {
    learner: MentorLearner;
    applications: MentorLearnerApplication[];
    sessions: MentorLearnerSession[];
    messageUrl: string;
};
