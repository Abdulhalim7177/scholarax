<?php

use App\Http\Controllers\AdminScholarshipController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\SavedScholarshipController;
use App\Http\Controllers\ScholarshipController;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');

    Route::inertia('coming-soon', 'coming-soon')->name('coming-soon');
    Route::get('scholarships', [ScholarshipController::class, 'index'])->name('scholarships.index');
    Route::get('scholarships/{scholarship}', [ScholarshipController::class, 'show'])->name('scholarships.show');
    Route::post('saved-scholarships/{scholarship}', [SavedScholarshipController::class, 'store'])->name('saved-scholarships.store');
    Route::delete('saved-scholarships/{scholarship}', [SavedScholarshipController::class, 'destroy'])->name('saved-scholarships.destroy');
    Route::inertia('applications', 'applications')->name('applications');
    Route::inertia('mentors', 'mentors')->name('mentors');
    Route::inertia('cv-sop-builder', 'cv-sop-builder')->name('cv-sop-builder');
});

Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::inertia('admin-coming-soon', 'admin-coming-soon')->name('admin-coming-soon');
    Route::inertia('admin-dashboard', 'admin-dashboard')->name('admin-dashboard');
    Route::inertia('admin-users', 'admin-users')->name('admin-users');
    Route::get('admin-scholarships', [AdminScholarshipController::class, 'index'])->name('admin-scholarships.index');
    Route::get('admin-scholarships/create', [AdminScholarshipController::class, 'create'])->name('admin-scholarships.create');
    Route::post('admin-scholarships', [AdminScholarshipController::class, 'store'])->name('admin-scholarships.store');
    Route::get('admin-scholarships/{scholarship}/edit', [AdminScholarshipController::class, 'edit'])->name('admin-scholarships.edit');
    Route::patch('admin-scholarships/{scholarship}', [AdminScholarshipController::class, 'update'])->name('admin-scholarships.update');
    Route::delete('admin-scholarships/{scholarship}', [AdminScholarshipController::class, 'destroy'])->name('admin-scholarships.destroy');
    Route::post('admin-scholarships/{scholarship}/approve', [AdminScholarshipController::class, 'approve'])->name('admin-scholarships.approve');
    Route::inertia('admin-mentors', 'admin-mentors')->name('admin-mentors');
    Route::inertia('admin-applications', 'admin-applications')->name('admin-applications');
    Route::inertia('admin-reports', 'admin-reports')->name('admin-reports');
    Route::inertia('admin-settings', 'admin-settings')->name('admin-settings');
});

Route::middleware(['auth', 'role:mentor,admin'])->group(function () {
    Route::inertia('mentor-coming-soon', 'mentor-coming-soon')->name('mentor-coming-soon');
    Route::inertia('mentor-dashboard', 'mentor-dashboard')->name('mentor-dashboard');
    Route::inertia('mentor-review-queue', 'mentor-review-queue')->name('mentor-review-queue');
    Route::inertia('mentor-learners', 'mentor-learners')->name('mentor-learners');
    Route::inertia('mentor-sessions', 'mentor-sessions')->name('mentor-sessions');
    Route::inertia('mentor-impact', 'mentor-impact')->name('mentor-impact');
    Route::inertia('mentor-profile', 'mentor-profile')->name('mentor-profile');
});

require __DIR__.'/teams.php';
require __DIR__.'/settings.php';
