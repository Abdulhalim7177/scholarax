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
        User::factory()->create([
            'name' => 'Amina Yusuf',
            'email' => 'student@scholarly.test',
        ]);

        User::factory()->mentor()->create([
            'name' => 'Dr. Maya Chen',
            'email' => 'mentor@scholarly.test',
        ]);

        User::factory()->admin()->create([
            'name' => 'Sarah Admin',
            'email' => 'admin@scholarly.test',
        ]);

        $this->call([
            ReferenceDataSeeder::class,
            ScholarshipSeeder::class,
            BuilderTemplateSeeder::class,
            StudentDataSeeder::class,
        ]);
    }
}
