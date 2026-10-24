<?php

use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::inertia('coming-soon', 'coming-soon')->name('coming-soon');

Route::inertia('scholarships', 'scholarships')->name('scholarships');

Route::inertia('applications', 'applications')->name('applications');

Route::inertia('mentors', 'mentors')->name('mentors');

Route::inertia('cv-sop-builder', 'cv-sop-builder')->name('cv-sop-builder');

// Frontend preview only: authentication will be restored when dashboard data is connected.
Route::get('/{current_team?}/dashboard', DashboardController::class)
    ->middleware('auth')
    ->name('dashboard');

// Team routes are intentionally disabled while Scholarly is learner-first.

require __DIR__.'/settings.php';
require __DIR__.'/teams.php';
