<?php

namespace Database\Seeders;

use App\Models\ContentBlock;
use App\Models\ImpactStat;
use App\Models\Testimonial;
use Illuminate\Database\Seeder;

class HomeContentSeeder extends Seeder
{
    /**
     * Seed the editorial content rendered on the public home page.
     */
    public function run(): void
    {
        $this->seedContentBlocks();
        $this->seedImpactStats();
        $this->seedTestimonials();
    }

    /**
     * Seed the feature, process, and application cards.
     */
    private function seedContentBlocks(): void
    {
        $blocks = [
            [
                'type' => 'feature',
                'title' => 'Discover scholarships',
                'body' => 'Find opportunities that match your goals, background, field, and preferred country.',
                'icon' => 'search',
                'tone' => 'blue',
                'sort_order' => 1,
            ],
            [
                'type' => 'feature',
                'title' => 'Build your application',
                'body' => 'Create a standout CV and statement of purpose with guided templates.',
                'icon' => 'file-text',
                'tone' => 'gold',
                'sort_order' => 2,
            ],
            [
                'type' => 'feature',
                'title' => 'Get expert guidance',
                'body' => 'Connect with experienced mentors who can help you submit with confidence.',
                'icon' => 'users',
                'tone' => 'coral',
                'sort_order' => 3,
            ],
            [
                'type' => 'process_step',
                'title' => 'Discover',
                'body' => 'Find scholarships that match your goals and background.',
                'badge' => '01',
                'tone' => 'teal',
                'sort_order' => 1,
            ],
            [
                'type' => 'process_step',
                'title' => 'Prepare',
                'body' => 'Build a strong application with guided tools and support.',
                'badge' => '02',
                'tone' => 'blue',
                'sort_order' => 2,
            ],
            [
                'type' => 'process_step',
                'title' => 'Apply with confidence',
                'body' => 'Submit on time and keep track of every deadline.',
                'badge' => '03',
                'tone' => 'coral',
                'sort_order' => 3,
            ],
            [
                'type' => 'application_step',
                'title' => 'Personal details',
                'tone' => 'blue',
                'sort_order' => 1,
            ],
            [
                'type' => 'application_step',
                'title' => 'Education',
                'tone' => 'blue',
                'sort_order' => 2,
            ],
            [
                'type' => 'application_step',
                'title' => 'Experience',
                'tone' => 'blue',
                'sort_order' => 3,
            ],
            [
                'type' => 'application_step',
                'title' => 'Statement of purpose',
                'tone' => 'blue',
                'sort_order' => 4,
            ],
        ];

        foreach ($blocks as $block) {
            ContentBlock::query()->updateOrCreate(
                ['type' => $block['type'], 'title' => $block['title']],
                $block,
            );
        }
    }

    /**
     * Seed the impact metrics shown below the hero.
     */
    private function seedImpactStats(): void
    {
        $stats = [
            [
                'key' => 'students-supported',
                'label' => 'students supported',
                'source' => 'students',
                'icon' => 'users',
                'sort_order' => 1,
            ],
            [
                'key' => 'countries-reached',
                'label' => 'countries',
                'source' => 'countries',
                'icon' => 'globe',
                'sort_order' => 2,
            ],
            [
                'key' => 'scholarship-programs',
                'label' => 'scholarship programs',
                'source' => 'scholarships',
                'icon' => 'book',
                'sort_order' => 3,
            ],
        ];

        foreach ($stats as $stat) {
            ImpactStat::query()->updateOrCreate(
                ['key' => $stat['key']],
                [...$stat, 'value' => 0, 'is_published' => true],
            );
        }
    }

    /**
     * Seed learner testimonials.
     */
    private function seedTestimonials(): void
    {
        $testimonials = [
            [
                'quote' => 'Scholarly made the entire process so much simpler. I found a scholarship I never knew about, improved my SOP with their tools, and got amazing advice from a mentor.',
                'author_name' => 'Daniel Kim',
                'author_detail' => 'Master’s in Computer Science, Canada',
                'initials' => 'DK',
                'tone' => 'gold',
                'sort_order' => 1,
            ],
            [
                'quote' => 'My mentor helped me turn a scattered draft into a statement I was proud to submit. The deadline tracker kept me calm right to the end.',
                'author_name' => 'Amara Osei',
                'author_detail' => 'Chevening Scholar, United Kingdom',
                'initials' => 'AO',
                'tone' => 'teal',
                'sort_order' => 2,
            ],
            [
                'quote' => 'I applied to three programmes in one week without losing track of a single document. Scholarly is the first tool that made applying feel manageable.',
                'author_name' => 'Luis Herrera',
                'author_detail' => 'Erasmus Mundus, Spain',
                'initials' => 'LH',
                'tone' => 'coral',
                'sort_order' => 3,
            ],
        ];

        foreach ($testimonials as $testimonial) {
            Testimonial::query()->updateOrCreate(
                ['author_name' => $testimonial['author_name']],
                [...$testimonial, 'is_published' => true],
            );
        }
    }
}
