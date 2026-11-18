<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Http\Requests\Student\StudentProfileRequest;
use App\Models\StudentProfile;
use App\Support\ActivityLogger;
use App\Support\StudentProfileData;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StudentProfileController extends Controller
{
    /**
     * Show the student's scholarship profile.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('student-profile', StudentProfileData::forUser($request->user()));
    }

    /**
     * Update the student's scholarship profile.
     */
    public function update(StudentProfileRequest $request): RedirectResponse
    {
        $user = $request->user();

        $profile = StudentProfile::query()->updateOrCreate(
            ['user_id' => $user->id],
            $request->validated(),
        );

        $user->unsetRelation('studentProfile');

        ActivityLogger::log(
            $user,
            'profile_updated',
            'Updated your profile',
            'Your scholarship profile details changed.',
            $profile,
        );

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Profile updated.'),
        ]);

        return back();
    }
}
