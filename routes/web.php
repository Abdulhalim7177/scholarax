<?php

use App\Http\Controllers\AdminScholarshipController;
use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\ApplicationDocumentController;
use App\Http\Controllers\ApplicationTaskController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\SavedScholarshipController;
use App\Http\Controllers\ScholarshipController;
use App\Http\Controllers\Student\EducationController;
use App\Http\Controllers\Student\StudentProfileController;
use App\Http\Controllers\Student\TestScoreController;
use App\Http\Controllers\Student\WorkExperienceController;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');

    Route::inertia('coming-soon', 'coming-soon')->name('coming-soon');
    Route::get('scholarships', [ScholarshipController::class, 'index'])->name('scholarships.index');
    Route::get('scholarships/{scholarship}', [ScholarshipController::class, 'show'])->name('scholarships.show');
    Route::post('saved-scholarships/{scholarship}', [SavedScholarshipController::class, 'store'])->name('saved-scholarships.store');
    Route::delete('saved-scholarships/{scholarship}', [SavedScholarshipController::class, 'destroy'])->name('saved-scholarships.destroy');

    Route::get('profile', [StudentProfileController::class, 'edit'])->name('student-profile.edit');
    Route::patch('profile', [StudentProfileController::class, 'update'])->name('student-profile.update');
    Route::post('profile/educations', [EducationController::class, 'store'])->name('student-profile.educations.store');
    Route::patch('profile/educations/{education}', [EducationController::class, 'update'])->name('student-profile.educations.update');
    Route::delete('profile/educations/{education}', [EducationController::class, 'destroy'])->name('student-profile.educations.destroy');
    Route::post('profile/work-experiences', [WorkExperienceController::class, 'store'])->name('student-profile.work-experiences.store');
    Route::patch('profile/work-experiences/{workExperience}', [WorkExperienceController::class, 'update'])->name('student-profile.work-experiences.update');
    Route::delete('profile/work-experiences/{workExperience}', [WorkExperienceController::class, 'destroy'])->name('student-profile.work-experiences.destroy');
    Route::post('profile/test-scores', [TestScoreController::class, 'store'])->name('student-profile.test-scores.store');
    Route::patch('profile/test-scores/{testScore}', [TestScoreController::class, 'update'])->name('student-profile.test-scores.update');
    Route::delete('profile/test-scores/{testScore}', [TestScoreController::class, 'destroy'])->name('student-profile.test-scores.destroy');

    Route::get('applications', [ApplicationController::class, 'index'])->name('applications.index');
    Route::get('applications/create', [ApplicationController::class, 'create'])->name('applications.create');
    Route::post('applications', [ApplicationController::class, 'store'])->name('applications.store');
    Route::get('applications/{application}', [ApplicationController::class, 'show'])->name('applications.show');
    Route::patch('applications/{application}', [ApplicationController::class, 'update'])->name('applications.update');

    Route::post('applications/{application}/tasks', [ApplicationTaskController::class, 'store'])->name('application-tasks.store');
    Route::patch('applications/{application}/tasks/{task}', [ApplicationTaskController::class, 'update'])->name('application-tasks.update');
    Route::delete('applications/{application}/tasks/{task}', [ApplicationTaskController::class, 'destroy'])->name('application-tasks.destroy');

    Route::post('applications/{application}/documents', [ApplicationDocumentController::class, 'store'])->name('application-documents.store');
    Route::patch('applications/{application}/documents/{document}', [ApplicationDocumentController::class, 'update'])->name('application-documents.update');
    Route::delete('applications/{application}/documents/{document}', [ApplicationDocumentController::class, 'destroy'])->name('application-documents.destroy');
    Route::get('applications/{application}/documents/{document}/download', [ApplicationDocumentController::class, 'download'])->name('application-documents.download');

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
