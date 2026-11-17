<?php

namespace Database\Seeders;

use App\Enums\FundingType;
use App\Enums\ScholarshipStatus;
use App\Enums\UserRole;
use App\Models\Country;
use App\Models\FieldOfStudy;
use App\Models\Scholarship;
use App\Models\StudyLevel;
use App\Models\User;
use Illuminate\Database\Seeder;

class ScholarshipSeeder extends Seeder
{
    /**
     * Seed the application's scholarships.
     */
    public function run(): void
    {
        $adminId = User::query()->where('role', UserRole::Admin->value)->value('id');

        $studyLevels = StudyLevel::query()->pluck('id', 'slug');
        $fields = FieldOfStudy::query()->pluck('id', 'slug');
        $countries = Country::query()->pluck('id', 'iso2');

        $scholarships = [
            [
                'slug' => 'chevening-scholarships',
                'title' => 'Chevening Scholarships',
                'provider' => 'UK Government',
                'summary' => 'Build your network and study a one-year master’s degree at a leading UK university.',
                'description' => 'Chevening Scholarships are the UK government’s global scholarship programme, funded by the Foreign, Commonwealth and Development Office and partner organisations. The programme offers awards to outstanding scholars with leadership potential from around the world to study a one-year master’s degree in the United Kingdom.',
                'host_country' => 'GB',
                'funding_type' => FundingType::FullyFunded,
                'deadline_in_days' => 14,
                'status' => ScholarshipStatus::Live,
                'is_featured' => true,
                'levels' => ['masters'],
                'fields' => ['all-fields'],
                'eligible' => ['NG', 'KE', 'IN'],
                'application_url' => 'https://www.chevening.org/scholarships/',
                'eligibility' => 'Applicants must be a citizen of a Chevening-eligible country, return home for at least two years after the award, and have an undergraduate degree.',
                'required_documents' => ['Valid passport', 'Academic transcripts', 'Two references', 'English language evidence'],
            ],
            [
                'slug' => 'daad-development-related-postgraduate-courses',
                'title' => 'DAAD Development-Related Postgraduate Courses',
                'provider' => 'DAAD',
                'summary' => 'Advance your career with postgraduate study at a German university and a global cohort.',
                'description' => 'DAAD’s Development-Related Postgraduate Courses offer scholarships for graduates with at least two years of professional experience. The courses prepare specialists and executives from developing and newly industrialised countries for future leadership roles.',
                'host_country' => 'DE',
                'funding_type' => FundingType::FullyFunded,
                'deadline_in_days' => 32,
                'status' => ScholarshipStatus::Live,
                'is_featured' => true,
                'levels' => ['masters', 'phd'],
                'fields' => ['development-studies', 'engineering'],
                'eligible' => ['NG', 'KE', 'IN'],
                'application_url' => 'https://www.daad.de/en/study-and-research-in-germany/scholarships/',
                'eligibility' => 'Applicants should hold a bachelor’s degree and have at least two years of relevant professional experience in a developing country.',
                'required_documents' => ['DAAD application form', 'Curriculum vitae', 'Motivation letter', 'Academic references'],
            ],
            [
                'slug' => 'erasmus-mundus-joint-masters',
                'title' => 'Erasmus Mundus Joint Masters',
                'provider' => 'European Union',
                'summary' => 'Study across several European universities with a highly international learning experience.',
                'description' => 'Erasmus Mundus Joint Masters are high-level integrated study programmes delivered by international partnerships of higher education institutions. Students study in at least two European countries and graduate with a joint or multiple degree.',
                'host_country' => null,
                'funding_type' => FundingType::FullyFunded,
                'deadline_in_days' => 72,
                'status' => ScholarshipStatus::Live,
                'is_featured' => true,
                'levels' => ['masters'],
                'fields' => ['multiple-fields'],
                'eligible' => ['NG', 'KE', 'IN', 'GB'],
                'application_url' => 'https://www.eacea.ec.europa.eu/scholarships/erasmus-mundus-catalogue_en',
                'eligibility' => 'Applicants must hold a bachelor’s degree and apply to an eligible Erasmus Mundus Joint Master programme.',
                'required_documents' => ['Degree certificate', 'Transcripts', 'Motivation letter', 'Language certificate'],
            ],
            [
                'slug' => 'fulbright-foreign-student-program',
                'title' => 'Fulbright Foreign Student Program',
                'provider' => 'Fulbright',
                'summary' => 'Join a community of emerging leaders while pursuing graduate study in the United States.',
                'description' => 'The Fulbright Foreign Student Program enables graduate students, young professionals, and artists from abroad to study and conduct research in the United States. The programme operates in more than 160 countries worldwide.',
                'host_country' => 'US',
                'funding_type' => FundingType::FullyFunded,
                'deadline_in_days' => 91,
                'status' => ScholarshipStatus::Live,
                'is_featured' => false,
                'levels' => ['masters', 'phd'],
                'fields' => ['all-fields'],
                'eligible' => ['NG', 'KE'],
                'application_url' => 'https://foreign.fulbrightonline.org/',
                'eligibility' => 'Applicants must be citizens of a participating country and hold a bachelor’s degree by the start of the grant.',
                'required_documents' => ['Online application', 'Study objective', 'Personal statement', 'Three references'],
            ],
            [
                'slug' => 'australia-awards-scholarships',
                'title' => 'Australia Awards Scholarships',
                'provider' => 'Australian Government',
                'summary' => 'Develop the skills to contribute to sustainable development in your home country.',
                'description' => 'Australia Awards Scholarships are long-term awards administered by the Department of Foreign Affairs and Trade. They provide opportunities for people from developing countries to undertake full-time undergraduate or postgraduate study at participating Australian universities.',
                'host_country' => 'AU',
                'funding_type' => FundingType::FullyFunded,
                'deadline_in_days' => 179,
                'status' => ScholarshipStatus::Live,
                'is_featured' => false,
                'levels' => ['masters'],
                'fields' => ['public-policy'],
                'eligible' => ['NG', 'KE'],
                'application_url' => 'https://www.dfat.gov.au/people-to-people/australia-awards',
                'eligibility' => 'Applicants must be citizens of an eligible country, meet academic and English language requirements, and not hold another scholarship.',
                'required_documents' => ['Application form', 'Academic transcripts', 'Development impact plan', 'References'],
            ],
            [
                'slug' => 'commonwealth-masters-scholarships',
                'title' => 'Commonwealth Master’s Scholarships',
                'provider' => 'Commonwealth Scholarship Commission',
                'summary' => 'Study in the UK and join a global network focused on development and positive change.',
                'description' => 'Commonwealth Master’s Scholarships are for candidates from low and middle income Commonwealth countries, to undertake full-time taught master’s study at a UK university. The awards are funded by the UK Foreign, Commonwealth and Development Office.',
                'host_country' => 'GB',
                'funding_type' => FundingType::FullyFunded,
                'deadline_in_days' => 5,
                'status' => ScholarshipStatus::Live,
                'is_featured' => false,
                'levels' => ['masters'],
                'fields' => ['multiple-fields'],
                'eligible' => ['NG', 'KE', 'IN'],
                'application_url' => 'https://cscuk.fcdo.gov.uk/scholarships/commonwealth-masters-scholarships/',
                'eligibility' => 'Applicants must be a citizen of an eligible Commonwealth country, hold a first degree, and be unable to afford UK study without the scholarship.',
                'required_documents' => ['Application form', 'Transcripts', 'Development impact statement', 'References'],
            ],
            [
                'slug' => 'global-futures-fellowship',
                'title' => 'Global Futures Fellowship',
                'provider' => 'Northbridge Foundation',
                'summary' => 'A new fellowship for emerging public policy leaders committed to global cooperation.',
                'description' => 'The Global Futures Fellowship supports emerging leaders working on cross-border policy challenges. Fellows receive funding for graduate study, a mentorship programme, and access to a global network of practitioners.',
                'host_country' => 'US',
                'funding_type' => FundingType::FullyFunded,
                'deadline_in_days' => 120,
                'status' => ScholarshipStatus::Pending,
                'is_featured' => false,
                'levels' => ['masters'],
                'fields' => ['public-policy', 'social-sciences'],
                'eligible' => ['NG', 'KE', 'IN'],
                'application_url' => 'https://example.com/global-futures-fellowship',
                'eligibility' => 'Applicants should have at least three years of policy or community leadership experience.',
                'required_documents' => ['Application form', 'Policy essay', 'Two references'],
            ],
            [
                'slug' => 'women-in-stem-award',
                'title' => 'Women in STEM Award',
                'provider' => 'Bright Futures Trust',
                'summary' => 'Supporting outstanding women pursuing undergraduate or postgraduate STEM study in Canada.',
                'description' => 'The Women in STEM Award provides partial funding to women pursuing degrees in science, technology, engineering, or mathematics at participating Canadian universities. Recipients also join a peer mentoring community.',
                'host_country' => 'CA',
                'funding_type' => FundingType::Partial,
                'deadline_in_days' => 200,
                'status' => ScholarshipStatus::Draft,
                'is_featured' => false,
                'levels' => ['bachelors', 'masters'],
                'fields' => ['engineering', 'computer-science'],
                'eligible' => ['NG', 'KE', 'IN'],
                'application_url' => 'https://example.com/women-in-stem-award',
                'eligibility' => 'Applicants must identify as women, be admitted to a STEM programme in Canada, and demonstrate academic excellence.',
                'required_documents' => ['Admission letter', 'Transcripts', 'Personal statement'],
            ],
        ];

        foreach ($scholarships as $data) {
            $isLive = $data['status'] === ScholarshipStatus::Live;

            $scholarship = Scholarship::query()->updateOrCreate(
                ['slug' => $data['slug']],
                [
                    'title' => $data['title'],
                    'provider' => $data['provider'],
                    'summary' => $data['summary'],
                    'description' => $data['description'],
                    'host_country_id' => $data['host_country'] === null
                        ? null
                        : $countries[$data['host_country']] ?? null,
                    'funding_type' => $data['funding_type'],
                    'deadline_at' => now()->addDays($data['deadline_in_days']),
                    'application_url' => $data['application_url'],
                    'eligibility' => $data['eligibility'],
                    'required_documents' => $data['required_documents'],
                    'status' => $data['status'],
                    'is_featured' => $data['is_featured'],
                    'verified_at' => $isLive ? now() : null,
                    'published_at' => $isLive ? now() : null,
                    'created_by' => $adminId,
                    'approved_by' => $isLive ? $adminId : null,
                ],
            );

            $scholarship->studyLevels()->sync(
                collect($data['levels'])->map(fn (string $slug) => $studyLevels[$slug])->filter()->all(),
            );

            $scholarship->fieldsOfStudy()->sync(
                collect($data['fields'])->map(fn (string $slug) => $fields[$slug])->filter()->all(),
            );

            $scholarship->eligibleCountries()->sync(
                collect($data['eligible'])->map(fn (string $iso2) => $countries[$iso2])->filter()->all(),
            );
        }
    }
}
