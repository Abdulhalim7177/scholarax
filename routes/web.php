<?php

use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::inertia('/coming-soon', 'coming-soon')->name('coming-soon');

// Frontend preview only: authentication will be restored when dashboard data is connected.
Route::get('/dashboard', DashboardController::class)->name('dashboard.simple');

// Team routes are intentionally disabled while Scholarly is learner-first.

require __DIR__.'/settings.php';
