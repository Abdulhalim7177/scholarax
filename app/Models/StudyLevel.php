<?php

namespace App\Models;

use Database\Factories\StudyLevelFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $name
 * @property string $slug
 * @property int $sort_order
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Collection<int, Scholarship> $scholarships
 */
#[Fillable(['name', 'slug', 'sort_order'])]
class StudyLevel extends Model
{
    /** @use HasFactory<StudyLevelFactory> */
    use HasFactory;

    /**
     * Get the scholarships that offer this study level.
     *
     * @return BelongsToMany<Scholarship, $this>
     */
    public function scholarships(): BelongsToMany
    {
        return $this->belongsToMany(Scholarship::class, 'scholarship_study_level')->withTimestamps();
    }
}
