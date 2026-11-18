<?php

namespace App\Models;

use Carbon\CarbonImmutable;
use Database\Factories\ExpertiseTagFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * @property int $id
 * @property string $name
 * @property string $slug
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read Collection<int, MentorProfile> $mentorProfiles
 */
#[Fillable(['name', 'slug'])]
class ExpertiseTag extends Model
{
    /** @use HasFactory<ExpertiseTagFactory> */
    use HasFactory;

    /**
     * Get the mentors who list this expertise.
     *
     * @return BelongsToMany<MentorProfile, $this>
     */
    public function mentorProfiles(): BelongsToMany
    {
        return $this->belongsToMany(MentorProfile::class, 'mentor_expertise')
            ->withTimestamps();
    }
}
