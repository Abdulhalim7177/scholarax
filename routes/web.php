<?php

use App\Http\Controllers\AdminApplicationController;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\AdminMentorController;
use App\Http\Controllers\AdminMentorVerificationController;
use App\Http\Controllers\AdminModerationController;
use App\Http\Controllers\AdminReportController;
use App\Http\Controllers\AdminScholarshipController;
use App\Http\Controllers\AdminSettingController;
use App\Http\Controllers\AdminUserController;
use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\ApplicationDocumentController;
use App\Http\Controllers\ApplicationTaskController;
use App\Http\Controllers\BuilderController;
use App\Http\Controllers\CvSopDocumentController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\MentorDashboardController;
use App\Http\Controllers\MentorDirectoryController;
use App\Http\Controllers\MentorImpactController;
use App\Http\Controllers\MentorLearnerController;
use App\Http\Controllers\MentorMessageController;
use App\Http\Controllers\MentorProfileController;
use App\Http\Controllers\MentorReviewQueueController;
use App\Http\Controllers\MentorSessionController;
use App\Http\Controllers\MentorshipController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\SavedScholarshipController;
use App\Http\Controllers\ScholarshipController;
use App\Http\Controllers\Student\EducationController;
use App\Http\Controllers\Student\StudentProfileController;
use App\Http\Controllers\Student\TestScoreController;
use App\Http\Controllers\Student\WorkExperienceController;
use App\Http\Controllers\StudentSessionController;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');

    Route::get('notifications', NotificationController::class)->name('notifications');
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

    Route::get('mentors', [MentorDirectoryController::class, 'index'])->name('mentors.index');
    Route::get('mentors/{mentorProfile}', [MentorDirectoryController::class, 'show'])->name('mentors.show');
    Route::post('mentorships', [MentorshipController::class, 'store'])->name('mentorships.store');
    Route::post('mentorships/{mentorship}/sessions', [StudentSessionController::class, 'store'])->name('student-sessions.store');
    Route::get('cv-sop-builder', [BuilderController::class, 'index'])->name('cv-sop-builder');
    Route::get('cv-sop-builder/documents/{document}/preview', [BuilderController::class, 'preview'])->name('builder-documents.preview');
    Route::patch('cv-sop-builder/documents/{document}', [CvSopDocumentController::class, 'update'])->name('builder-documents.update');
    Route::post('cv-sop-builder/documents/{document}/applications', [CvSopDocumentController::class, 'attach'])->name('builder-documents.attach');
    Route::delete('cv-sop-builder/documents/{document}/applications/{application}', [CvSopDocumentController::class, 'detach'])->name('builder-documents.detach');
});

Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('admin-dashboard', AdminDashboardController::class)->name('admin-dashboard');
    Route::get('admin-users', [AdminUserController::class, 'index'])->name('admin-users.index');
    Route::get('admin-scholarships', [AdminScholarshipController::class, 'index'])->name('admin-scholarships.index');
    Route::get('admin-scholarships/create', [AdminScholarshipController::class, 'create'])->name('admin-scholarships.create');
    Route::post('admin-scholarships', [AdminScholarshipController::class, 'store'])->name('admin-scholarships.store');
    Route::get('admin-scholarships/{scholarship}/edit', [AdminScholarshipController::class, 'edit'])->name('admin-scholarships.edit');
    Route::patch('admin-scholarships/{scholarship}', [AdminScholarshipController::class, 'update'])->name('admin-scholarships.update');
    Route::delete('admin-scholarships/{scholarship}', [AdminScholarshipController::class, 'destroy'])->name('admin-scholarships.destroy');
    Route::post('admin-scholarships/{scholarship}/approve', [AdminScholarshipController::class, 'approve'])->name('admin-scholarships.approve');
    Route::get('admin-mentors', [AdminMentorController::class, 'index'])->name('admin-mentors.index');
    Route::post('admin-mentors/{mentorProfile}/verify', [AdminMentorVerificationController::class, 'verify'])->name('admin-mentors.verify');
    Route::post('admin-mentors/{mentorProfile}/reject', [AdminMentorVerificationController::class, 'reject'])->name('admin-mentors.reject');
    Route::get('admin-applications', [AdminApplicationController::class, 'index'])->name('admin-applications.index');
    Route::get('admin-moderation', [AdminModerationController::class, 'index'])->name('admin-moderation.index');
    Route::post('admin-moderation/{contentReport}/resolve', [AdminModerationController::class, 'resolve'])->name('admin-moderation.resolve');
    Route::post('admin-moderation/{contentReport}/dismiss', [AdminModerationController::class, 'dismiss'])->name('admin-moderation.dismiss');
    Route::get('admin-reports', [AdminReportController::class, 'index'])->name('admin-reports.index');
    Route::post('admin-reports/export', [AdminReportController::class, 'export'])->name('admin-reports.export');
    Route::get('admin-reports/exports/{reportExport}/download', [AdminReportController::class, 'download'])->name('admin-reports.exports.download');
    Route::get('admin-settings', [AdminSettingController::class, 'edit'])->name('admin-settings.edit');
    Route::patch('admin-settings', [AdminSettingController::class, 'update'])->name('admin-settings.update');
});

Route::middleware(['auth', 'role:mentor,admin'])->group(function () {
    Route::get('mentor-dashboard', MentorDashboardController::class)->name('mentor-dashboard');
    Route::get('mentor-review-queue', [MentorReviewQueueController::class, 'index'])->name('mentor-review-queue');
    Route::patch('mentor-review-queue/{documentReview}', [MentorReviewQueueController::class, 'update'])->name('mentor-review-queue.update');
    Route::get('mentor-learners', [MentorLearnerController::class, 'index'])->name('mentor-learners');
    Route::get('mentor-learners/{mentorship}', [MentorLearnerController::class, 'show'])->name('mentor-learners.show');
    Route::get('mentor-sessions', [MentorSessionController::class, 'index'])->name('mentor-sessions');
    Route::post('mentor-sessions', [MentorSessionController::class, 'store'])->name('mentor-sessions.store');
    Route::patch('mentor-sessions/{session}', [MentorSessionController::class, 'update'])->name('mentor-sessions.update');
    Route::get('mentor-impact', MentorImpactController::class)->name('mentor-impact');
    Route::get('mentor-impact/export', [MentorImpactController::class, 'download'])->name('mentor-impact.download');
    Route::get('mentor-messages', [MentorMessageController::class, 'index'])->name('mentor-messages');
    Route::post('mentor-messages', [MentorMessageController::class, 'store'])->name('mentor-messages.store');
    Route::get('mentor-profile', [MentorProfileController::class, 'edit'])->name('mentor-profile.edit');
    Route::patch('mentor-profile', [MentorProfileController::class, 'update'])->name('mentor-profile.update');
    Route::post('mentor-profile/expertise', [MentorProfileController::class, 'storeExpertise'])->name('mentor-profile.expertise.store');
    Route::delete('mentor-profile/expertise/{expertiseTag}', [MentorProfileController::class, 'destroyExpertise'])->name('mentor-profile.expertise.destroy');
    Route::post('mentor-profile/availability', [MentorProfileController::class, 'storeAvailability'])->name('mentor-profile.availability.store');
    Route::patch('mentor-profile/availability/{slot}', [MentorProfileController::class, 'updateAvailability'])->name('mentor-profile.availability.update');
    Route::delete('mentor-profile/availability/{slot}', [MentorProfileController::class, 'destroyAvailability'])->name('mentor-profile.availability.destroy');
});

require __DIR__.'/teams.php';
require __DIR__.'/settings.php';
