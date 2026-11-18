<?php

namespace Database\Seeders;

use App\Enums\BuilderTemplateType;
use App\Models\BuilderTemplate;
use Illuminate\Database\Seeder;

class BuilderTemplateSeeder extends Seeder
{
    /**
     * Seed the CV and statement of purpose templates.
     */
    public function run(): void
    {
        $cvSections = [
            ['key' => 'profile', 'title' => 'Profile'],
            ['key' => 'education', 'title' => 'Education'],
            ['key' => 'experience', 'title' => 'Experience'],
            ['key' => 'skills', 'title' => 'Skills'],
        ];

        $sopSections = [
            ['key' => 'opening-story', 'title' => 'Opening story'],
            ['key' => 'academic-journey', 'title' => 'Academic journey'],
            ['key' => 'why-this-program', 'title' => 'Why this program'],
            ['key' => 'future-impact', 'title' => 'Future impact'],
        ];

        $templates = [
            [
                'type' => BuilderTemplateType::Cv,
                'name' => 'Academic modern',
                'slug' => 'academic-modern',
                'description' => 'Clean sections for education, research, and impact.',
                'accent' => 'blue',
                'is_recommended' => true,
                'sort_order' => 0,
                'sections' => $cvSections,
            ],
            [
                'type' => BuilderTemplateType::Cv,
                'name' => 'Scholarship focus',
                'slug' => 'scholarship-focus',
                'description' => 'Put leadership, awards, and service front and center.',
                'accent' => 'teal',
                'is_recommended' => false,
                'sort_order' => 1,
                'sections' => $cvSections,
            ],
            [
                'type' => BuilderTemplateType::Cv,
                'name' => 'Minimal classic',
                'slug' => 'minimal-classic',
                'description' => 'A calm, traditional layout that keeps the focus on you.',
                'accent' => 'gold',
                'is_recommended' => false,
                'sort_order' => 2,
                'sections' => $cvSections,
            ],
            [
                'type' => BuilderTemplateType::Sop,
                'name' => 'Story-led statement',
                'slug' => 'story-led-statement',
                'description' => 'Build a personal narrative with a clear sense of purpose.',
                'accent' => 'blue',
                'is_recommended' => true,
                'sort_order' => 0,
                'sections' => $sopSections,
            ],
            [
                'type' => BuilderTemplateType::Sop,
                'name' => 'Research forward',
                'slug' => 'research-forward',
                'description' => 'Lead with your questions, experience, and future contribution.',
                'accent' => 'teal',
                'is_recommended' => false,
                'sort_order' => 1,
                'sections' => $sopSections,
            ],
            [
                'type' => BuilderTemplateType::Sop,
                'name' => 'Career & impact',
                'slug' => 'career-and-impact',
                'description' => 'Connect your journey to the change you want to create.',
                'accent' => 'gold',
                'is_recommended' => false,
                'sort_order' => 2,
                'sections' => $sopSections,
            ],
        ];

        foreach ($templates as $template) {
            BuilderTemplate::query()->updateOrCreate(
                ['slug' => $template['slug']],
                [
                    ...$template,
                    'is_active' => true,
                ],
            );
        }
    }
}
