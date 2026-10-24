<?php

use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::inertia('/coming-soon', 'coming-soon')->name('coming-soon');

// Frontend preview only: authentication will be restored when dashboard data is connected.
Route::get('/{current_team?}/dashboard', DashboardController::class)
    ->middleware('auth')
    ->name('dashboard');

// Team routes are intentionally disabled while Scholarly is learner-first.

require __DIR__.'/settings.php';
require __DIR__.'/teams.php';
