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

export type ScholarshipShowProps = {
    scholarship: ScholarshipDetail;
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
