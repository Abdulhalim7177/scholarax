<?php

namespace Database\Seeders;

use App\Models\Country;
use App\Models\FieldOfStudy;
use App\Models\StudyLevel;
use Illuminate\Database\Seeder;

class ReferenceDataSeeder extends Seeder
{
    /**
     * Seed the application's reference data.
     */
    public function run(): void
    {
        $countries = [
            ['name' => 'United Kingdom', 'iso2' => 'GB', 'iso3' => 'GBR'],
            ['name' => 'Germany', 'iso2' => 'DE', 'iso3' => 'DEU'],
            ['name' => 'United States', 'iso2' => 'US', 'iso3' => 'USA'],
            ['name' => 'Australia', 'iso2' => 'AU', 'iso3' => 'AUS'],
            ['name' => 'Canada', 'iso2' => 'CA', 'iso3' => 'CAN'],
            ['name' => 'Netherlands', 'iso2' => 'NL', 'iso3' => 'NLD'],
            ['name' => 'Sweden', 'iso2' => 'SE', 'iso3' => 'SWE'],
            ['name' => 'Nigeria', 'iso2' => 'NG', 'iso3' => 'NGA'],
            ['name' => 'Kenya', 'iso2' => 'KE', 'iso3' => 'KEN'],
            ['name' => 'India', 'iso2' => 'IN', 'iso3' => 'IND'],
        ];

        foreach ($countries as $country) {
            Country::query()->updateOrCreate(
                ['iso2' => $country['iso2']],
                [...$country, 'is_active' => true],
            );
        }

        $studyLevels = [
            ['name' => "Bachelor's", 'slug' => 'bachelors'],
            ['name' => "Master's", 'slug' => 'masters'],
            ['name' => 'PhD', 'slug' => 'phd'],
            ['name' => 'Diploma', 'slug' => 'diploma'],
        ];

        foreach ($studyLevels as $index => $studyLevel) {
            StudyLevel::query()->updateOrCreate(
                ['slug' => $studyLevel['slug']],
                [...$studyLevel, 'sort_order' => $index],
            );
        }

        $fields = [
            ['name' => 'All fields', 'slug' => 'all-fields'],
            ['name' => 'Multiple fields', 'slug' => 'multiple-fields'],
            ['name' => 'Development studies', 'slug' => 'development-studies'],
            ['name' => 'Public policy', 'slug' => 'public-policy'],
            ['name' => 'Engineering', 'slug' => 'engineering'],
            ['name' => 'Computer science', 'slug' => 'computer-science'],
            ['name' => 'Medicine', 'slug' => 'medicine'],
            ['name' => 'Business', 'slug' => 'business'],
            ['name' => 'Social sciences', 'slug' => 'social-sciences'],
        ];

        foreach ($fields as $index => $field) {
            FieldOfStudy::query()->updateOrCreate(
                ['slug' => $field['slug']],
                [...$field, 'sort_order' => $index],
            );
        }
    }
}
