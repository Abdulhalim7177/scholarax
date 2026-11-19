<?php

use App\Models\CvSopDocument;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('a builder document can be previewed by its owner', function () {
    $user = User::factory()->create();
    $document = CvSopDocument::factory()->create([
        'user_id' => $user->id,
        'headline' => 'Amina Yusuf',
    ]);
    $document->sections()->create([
        'key' => 'profile',
        'title' => 'Profile',
        'content' => 'A short professional summary.',
        'sort_order' => 0,
    ]);

    $this->actingAs($user)
        ->get("/cv-sop-builder/documents/{$document->id}/preview")
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('builder-preview')
            ->where('document.id', $document->id)
            ->where('document.headline', 'Amina Yusuf')
            ->has('document.sections', 1)
            ->where('document.sections.0.content', 'A short professional summary.'));
});

test('other users cannot preview a builder document', function () {
    $owner = User::factory()->create();
    $other = User::factory()->create();
    $document = CvSopDocument::factory()->create(['user_id' => $owner->id]);

    $this->actingAs($other)
        ->get("/cv-sop-builder/documents/{$document->id}/preview")
        ->assertForbidden();
});
