<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        if (! User::query()->where('email', 'student@scholarly.test')->exists()) {
            User::factory()->create([
                'name' => 'Amina Yusuf',
                'email' => 'student@scholarly.test',
            ]);
        }

        if (! User::query()->where('email', 'mentor@scholarly.test')->exists()) {
            User::factory()->mentor()->create([
                'name' => 'Dr. Maya Chen',
                'email' => 'mentor@scholarly.test',
            ]);
        }

        if (! User::query()->where('email', 'admin@scholarly.test')->exists()) {
            User::factory()->admin()->create([
                'name' => 'Sarah Admin',
                'email' => 'admin@scholarly.test',
            ]);
        }

        $this->call([
            ReferenceDataSeeder::class,
            PlatformSettingSeeder::class,
            ScholarshipSeeder::class,
            BuilderTemplateSeeder::class,
            MentorSeeder::class,
            StudentDataSeeder::class,
            MentorshipSeeder::class,
            ModerationSeeder::class,
        ]);
    }
}
