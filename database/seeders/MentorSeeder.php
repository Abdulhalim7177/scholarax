<?php

namespace Database\Seeders;

use App\Enums\AvailabilityStatus;
use App\Enums\UserRole;
use App\Enums\VerificationStatus;
use App\Models\Country;
use App\Models\ExpertiseTag;
use App\Models\MentorProfile;
use App\Models\User;
use Illuminate\Database\Seeder;

class MentorSeeder extends Seeder
{
    /**
     * Seed the mentor directory, expertise, and availability.
     */
    public function run(): void
    {
        $tags = [
            ['name' => 'SOP review', 'slug' => 'sop-review'],
            ['name' => 'CV review', 'slug' => 'cv-review'],
            ['name' => 'Interview prep', 'slug' => 'interview-prep'],
            ['name' => 'Research proposals', 'slug' => 'research-proposals'],
            ['name' => 'STEM applications', 'slug' => 'stem-applications'],
            ['name' => 'UK scholarships', 'slug' => 'uk-scholarships'],
            ['name' => 'DAAD', 'slug' => 'daad'],
            ['name' => 'Fulbright', 'slug' => 'fulbright'],
            ['name' => 'Erasmus Mundus', 'slug' => 'erasmus-mundus'],
            ['name' => 'Public policy', 'slug' => 'public-policy'],
            ['name' => 'Personal statements', 'slug' => 'personal-statements'],
            ['name' => 'PhD applications', 'slug' => 'phd-applications'],
            ['name' => 'Commonwealth', 'slug' => 'commonwealth'],
            ['name' => 'Storytelling', 'slug' => 'storytelling'],
            ['name' => 'Research plans', 'slug' => 'research-plans'],
            ['name' => 'Academic CVs', 'slug' => 'academic-cvs'],
        ];

        foreach ($tags as $tag) {
            ExpertiseTag::query()->updateOrCreate(['slug' => $tag['slug']], $tag);
        }

        $tagIds = ExpertiseTag::query()->pluck('id', 'slug');
        $countryIds = Country::query()->pluck('id', 'iso2');

        $mentors = [
            [
                'name' => 'Dr. Maya Chen',
                'email' => 'mentor@scholarly.test',
                'headline' => 'Graduate admissions mentor for UK scholarships and research degrees',
                'current_role' => 'Graduate Admissions Mentor',
                'organization' => 'University of Cambridge',
                'country' => 'GB',
                'bio' => 'I help ambitious learners shape thoughtful scholarship applications, especially for UK programmes, public policy, and research-led degrees. Over the past nine years I have supported applicants through Chevening, Commonwealth, and university-specific processes.',
                'languages' => ['English', 'Mandarin'],
                'years_experience' => 9,
                'linkedin_url' => 'https://www.linkedin.com/in/maya-chen',
                'website_url' => null,
                'verification_status' => VerificationStatus::Verified,
                'availability_status' => AvailabilityStatus::Available,
                'response_time_minutes' => 120,
                'rating_avg' => 4.9,
                'reviews_count' => 48,
                'learners_count' => 32,
                'sessions_count' => 126,
                'is_featured' => true,
                'expertise' => ['sop-review', 'uk-scholarships', 'research-plans', 'public-policy'],
                'slots' => [[1, '09:00', '12:00'], [3, '14:00', '17:00'], [6, '10:00', '13:00']],
            ],
            [
                'name' => 'James Okafor',
                'email' => 'james.okafor@scholarly.test',
                'headline' => 'DAAD and STEM application strategist',
                'current_role' => 'Scholarship Strategist',
                'organization' => 'DAAD Alumni Network',
                'country' => 'DE',
                'bio' => 'I studied in Germany on a DAAD scholarship and now help engineers and scientists translate technical work into compelling applications.',
                'languages' => ['English', 'German'],
                'years_experience' => 7,
                'linkedin_url' => 'https://www.linkedin.com/in/james-okafor',
                'website_url' => null,
                'verification_status' => VerificationStatus::Verified,
                'availability_status' => AvailabilityStatus::Available,
                'response_time_minutes' => 240,
                'rating_avg' => 4.8,
                'reviews_count' => 36,
                'learners_count' => 24,
                'sessions_count' => 94,
                'is_featured' => false,
                'expertise' => ['daad', 'stem-applications', 'cv-review'],
                'slots' => [[2, '10:00', '13:00'], [4, '15:00', '18:00']],
            ],
            [
                'name' => 'Sofia Martinez',
                'email' => 'sofia.martinez@scholarly.test',
                'headline' => 'Fulbright mentor for personal statements and interviews',
                'current_role' => 'International Education Advisor',
                'organization' => 'Fulbright Alumni Association',
                'country' => 'US',
                'bio' => 'As a Fulbright alumna, I work with first-generation applicants on telling their story clearly and preparing for interviews with confidence.',
                'languages' => ['English', 'Spanish'],
                'years_experience' => 6,
                'linkedin_url' => 'https://www.linkedin.com/in/sofia-martinez',
                'website_url' => null,
                'verification_status' => VerificationStatus::Verified,
                'availability_status' => AvailabilityStatus::Limited,
                'response_time_minutes' => 720,
                'rating_avg' => 5.0,
                'reviews_count' => 29,
                'learners_count' => 18,
                'sessions_count' => 71,
                'is_featured' => false,
                'expertise' => ['fulbright', 'personal-statements', 'interview-prep'],
                'slots' => [[5, '16:00', '19:00']],
            ],
            [
                'name' => 'Leila Haddad',
                'email' => 'leila.haddad@scholarly.test',
                'headline' => 'Erasmus Mundus and public policy application mentor',
                'current_role' => 'Public Policy Researcher',
                'organization' => 'Erasmus Mundus Alumni',
                'country' => 'FR',
                'bio' => 'I support applicants to European joint masters programmes, with a focus on policy, development, and social science degrees.',
                'languages' => ['English', 'French', 'Arabic'],
                'years_experience' => 8,
                'linkedin_url' => 'https://www.linkedin.com/in/leila-haddad',
                'website_url' => null,
                'verification_status' => VerificationStatus::Verified,
                'availability_status' => AvailabilityStatus::Available,
                'response_time_minutes' => 180,
                'rating_avg' => 4.9,
                'reviews_count' => 41,
                'learners_count' => 27,
                'sessions_count' => 108,
                'is_featured' => false,
                'expertise' => ['erasmus-mundus', 'public-policy', 'academic-cvs'],
                'slots' => [[1, '13:00', '16:00'], [4, '09:00', '12:00']],
            ],
            [
                'name' => 'Daniel Kim',
                'email' => 'daniel.kim@scholarly.test',
                'headline' => 'PhD applications and research proposal reviewer',
                'current_role' => 'PhD Application Mentor',
                'organization' => 'University of Melbourne',
                'country' => 'AU',
                'bio' => 'I help applicants turn early research ideas into focused proposals and find supervisors who are the right fit for their work.',
                'languages' => ['English', 'Korean'],
                'years_experience' => 5,
                'linkedin_url' => 'https://www.linkedin.com/in/daniel-kim',
                'website_url' => null,
                'verification_status' => VerificationStatus::Verified,
                'availability_status' => AvailabilityStatus::Limited,
                'response_time_minutes' => 360,
                'rating_avg' => 4.8,
                'reviews_count' => 22,
                'learners_count' => 15,
                'sessions_count' => 63,
                'is_featured' => false,
                'expertise' => ['phd-applications', 'research-proposals', 'stem-applications'],
                'slots' => [[3, '08:00', '11:00']],
            ],
            [
                'name' => 'Aisha Bello',
                'email' => 'aisha.bello@scholarly.test',
                'headline' => 'Commonwealth scholarship and storytelling coach',
                'current_role' => 'Personal Statement Coach',
                'organization' => 'Commonwealth Alumni Network',
                'country' => 'GB',
                'bio' => 'I help learners find the story only they can tell, then shape it into a statement that is specific, honest, and memorable.',
                'languages' => ['English', 'French'],
                'years_experience' => 6,
                'linkedin_url' => 'https://www.linkedin.com/in/aisha-bello',
                'website_url' => null,
                'verification_status' => VerificationStatus::Verified,
                'availability_status' => AvailabilityStatus::Available,
                'response_time_minutes' => 300,
                'rating_avg' => 4.9,
                'reviews_count' => 33,
                'learners_count' => 21,
                'sessions_count' => 87,
                'is_featured' => false,
                'expertise' => ['commonwealth', 'storytelling', 'interview-prep'],
                'slots' => [[2, '14:00', '17:00'], [6, '09:00', '11:00']],
            ],
            [
                'name' => 'Tunde Adeyemi',
                'email' => 'tunde.adeyemi@scholarly.test',
                'headline' => 'Education access mentor for first-time applicants',
                'current_role' => 'Education Access Mentor',
                'organization' => 'Teach for Nigeria',
                'country' => 'NG',
                'bio' => 'I work with first-time applicants from West Africa who are navigating scholarship systems for the first time.',
                'languages' => ['English', 'Yoruba'],
                'years_experience' => 4,
                'linkedin_url' => 'https://www.linkedin.com/in/tunde-adeyemi',
                'website_url' => null,
                'verification_status' => VerificationStatus::Pending,
                'availability_status' => AvailabilityStatus::Available,
                'response_time_minutes' => 480,
                'rating_avg' => 0,
                'reviews_count' => 0,
                'learners_count' => 0,
                'sessions_count' => 0,
                'is_featured' => false,
                'expertise' => ['sop-review', 'cv-review'],
                'slots' => [[1, '10:00', '12:00']],
            ],
        ];

        foreach ($mentors as $mentor) {
            $user = User::query()->where('email', $mentor['email'])->first();

            if (! $user instanceof User) {
                $user = User::factory()->mentor()->create([
                    'name' => $mentor['name'],
                    'email' => $mentor['email'],
                ]);
            }

            if ($user->role !== UserRole::Mentor) {
                $user->forceFill(['role' => UserRole::Mentor])->save();
            }

            $profile = MentorProfile::query()->updateOrCreate(
                ['user_id' => $user->id],
                [
                    'headline' => $mentor['headline'],
                    'current_role' => $mentor['current_role'],
                    'organization' => $mentor['organization'],
                    'country_id' => $countryIds[$mentor['country']] ?? null,
                    'bio' => $mentor['bio'],
                    'languages' => $mentor['languages'],
                    'years_experience' => $mentor['years_experience'],
                    'linkedin_url' => $mentor['linkedin_url'],
                    'website_url' => $mentor['website_url'],
                    'verification_status' => $mentor['verification_status'],
                    'verified_at' => $mentor['verification_status'] === VerificationStatus::Verified
                        ? now()->subMonths(3)
                        : null,
                    'availability_status' => $mentor['availability_status'],
                    'response_time_minutes' => $mentor['response_time_minutes'],
                    'rating_avg' => $mentor['rating_avg'],
                    'reviews_count' => $mentor['reviews_count'],
                    'learners_count' => $mentor['learners_count'],
                    'sessions_count' => $mentor['sessions_count'],
                    'is_featured' => $mentor['is_featured'],
                ],
            );

            $profile->expertiseTags()->sync(
                collect($mentor['expertise'])
                    ->map(fn (string $slug) => $tagIds[$slug] ?? null)
                    ->filter()
                    ->values()
                    ->all(),
            );

            $profile->availabilitySlots()->delete();

            foreach ($mentor['slots'] as [$weekday, $start, $end]) {
                $profile->availabilitySlots()->create([
                    'weekday' => $weekday,
                    'start_time' => $start,
                    'end_time' => $end,
                    'timezone' => 'UTC',
                    'is_active' => true,
                ]);
            }
        }
    }
}
