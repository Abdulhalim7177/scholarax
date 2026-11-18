<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Models\Country;
use App\Models\Scholarship;
use App\Models\User;
use App\Support\MentorData;
use App\Support\ScholarshipData;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    /**
     * Display the public home page.
     */
    public function __invoke(): Response
    {
        $featured = Scholarship::query()
            ->live()
            ->featured()
            ->with(['hostCountry', 'studyLevels', 'fieldsOfStudy'])
            ->orderBy('deadline_at')
            ->limit(3)
            ->get();

        if ($featured->isEmpty()) {
            $featured = Scholarship::query()
                ->live()
                ->with(['hostCountry', 'studyLevels', 'fieldsOfStudy'])
                ->orderBy('deadline_at')
                ->limit(3)
                ->get();
        }

        $featuredScholarships = $featured
            ->map(fn (Scholarship $scholarship) => ScholarshipData::summary($scholarship));

        return Inertia::render('welcome', [
            'featuredScholarships' => $featuredScholarships,
            'scholarshipCount' => Scholarship::query()->live()->count(),
            'countryCount' => Country::query()->where('is_active', true)->count(),
            'studentCount' => User::query()
                ->where('role', UserRole::Student->value)
                ->count(),
            'featuredMentor' => MentorData::featured(),
        ]);
    }
}
