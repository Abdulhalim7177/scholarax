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
