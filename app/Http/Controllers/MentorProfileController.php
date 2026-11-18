<?php

namespace App\Http\Controllers;

use App\Enums\AvailabilityStatus;
use App\Enums\VerificationStatus;
use App\Http\Requests\Mentor\MentorAvailabilityRequest;
use App\Http\Requests\Mentor\MentorExpertiseRequest;
use App\Http\Requests\Mentor\MentorProfileRequest;
use App\Models\ExpertiseTag;
use App\Models\MentorAvailabilitySlot;
use App\Models\MentorProfile;
use App\Models\User;
use App\Support\MentorData;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class MentorProfileController extends Controller
{
    /**
     * Show the mentor's own profile editor.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();
        $profile = $this->profileFor($user);

        Gate::authorize('update', $profile);

        return Inertia::render('mentor-profile', MentorData::ownProfile($user, $profile));
    }

    /**
     * Update the mentor's profile and account details.
     */
    public function update(MentorProfileRequest $request): RedirectResponse
    {
        $user = $request->user();
        $profile = $this->profileFor($user);

        Gate::authorize('update', $profile);

        $data = $request->validated();

        $user->name = (string) $data['name'];

        if ($request->hasFile('avatar')) {
            if ($user->avatar !== null) {
                Storage::disk('public')->delete($user->avatar);
            }

            $avatarPath = $request->file('avatar')?->store('avatars', 'public');

            if ($avatarPath !== false) {
                $user->avatar = $avatarPath;
            }
        }

        $user->save();

        $languages = array_values(array_filter(
            array_map('trim', explode(',', (string) ($data['languages'] ?? ''))),
        ));

        $profile->fill([
            'headline' => $data['headline'] ?? null,
            'current_role' => $data['current_role'] ?? null,
            'organization' => $data['organization'] ?? null,
            'country_id' => $data['country_id'] ?? null,
            'bio' => $data['bio'] ?? null,
            'languages' => $languages === [] ? null : $languages,
            'years_experience' => $data['years_experience'] ?? null,
            'linkedin_url' => $data['linkedin_url'] ?? null,
            'website_url' => $data['website_url'] ?? null,
            'availability_status' => AvailabilityStatus::from((string) $data['availability_status']),
        ]);

        if ($request->hasFile('intro_video')) {
            if ($profile->intro_video_path !== null) {
                Storage::disk('public')->delete($profile->intro_video_path);
            }

            $videoPath = $request->file('intro_video')
                ?->store('mentor-videos/'.$user->id, 'public');

            if ($videoPath !== false) {
                $profile->intro_video_path = $videoPath;
            }
        }

        $profile->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Mentor profile updated.')]);

        return to_route('mentor-profile.edit');
    }

    /**
     * Add an expertise tag to the mentor profile.
     */
    public function storeExpertise(MentorExpertiseRequest $request): RedirectResponse
    {
        $profile = $this->profileFor($request->user());

        Gate::authorize('update', $profile);

        $profile->expertiseTags()->syncWithoutDetaching([
            (int) $request->validated('expertise_tag_id'),
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Expertise added.')]);

        return back();
    }

    /**
     * Remove an expertise tag from the mentor profile.
     */
    public function destroyExpertise(Request $request, ExpertiseTag $expertiseTag): RedirectResponse
    {
        $profile = $this->profileFor($request->user());

        Gate::authorize('update', $profile);

        $profile->expertiseTags()->detach($expertiseTag->id);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Expertise removed.')]);

        return back();
    }

    /**
     * Add an availability slot to the mentor profile.
     */
    public function storeAvailability(MentorAvailabilityRequest $request): RedirectResponse
    {
        $profile = $this->profileFor($request->user());

        Gate::authorize('update', $profile);

        $data = $request->validated();

        $profile->availabilitySlots()->create([
            'weekday' => (int) $data['weekday'],
            'start_time' => (string) $data['start_time'],
            'end_time' => (string) $data['end_time'],
            'timezone' => (string) $data['timezone'],
            'is_active' => $request->boolean('is_active', true),
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Availability added.')]);

        return back();
    }

    /**
     * Update an availability slot.
     */
    public function updateAvailability(
        MentorAvailabilityRequest $request,
        MentorAvailabilitySlot $slot,
    ): RedirectResponse {
        $profile = $this->profileFor($request->user());

        Gate::authorize('update', $profile);
        $this->ensureSlotBelongsToProfile($slot, $profile);

        $data = $request->validated();

        $slot->fill([
            'weekday' => (int) $data['weekday'],
            'start_time' => (string) $data['start_time'],
            'end_time' => (string) $data['end_time'],
            'timezone' => (string) $data['timezone'],
            'is_active' => $request->boolean('is_active', true),
        ])->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Availability updated.')]);

        return back();
    }

    /**
     * Remove an availability slot.
     */
    public function destroyAvailability(Request $request, MentorAvailabilitySlot $slot): RedirectResponse
    {
        $profile = $this->profileFor($request->user());

        Gate::authorize('update', $profile);
        $this->ensureSlotBelongsToProfile($slot, $profile);

        $slot->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Availability removed.')]);

        return back();
    }

    /**
     * Get or create the mentor profile for the user.
     */
    private function profileFor(?User $user): MentorProfile
    {
        abort_if($user === null, 403);

        return $user->mentorProfile()->firstOrCreate([], [
            'verification_status' => VerificationStatus::Pending,
            'availability_status' => AvailabilityStatus::Available,
        ]);
    }

    /**
     * Ensure the slot belongs to the mentor profile.
     */
    private function ensureSlotBelongsToProfile(
        MentorAvailabilitySlot $slot,
        MentorProfile $profile,
    ): void {
        abort_unless($slot->mentor_profile_id === $profile->id, 404);
    }
}
