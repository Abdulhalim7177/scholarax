<?php

namespace App\Models;

use Database\Factories\FieldOfStudyFactory;
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
class FieldOfStudy extends Model
{
    /** @use HasFactory<FieldOfStudyFactory> */
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'fields_of_study';

    /**
     * Get the scholarships that accept this field of study.
     *
     * @return BelongsToMany<Scholarship, $this>
     */
    public function scholarships(): BelongsToMany
    {
        return $this->belongsToMany(Scholarship::class, 'scholarship_field_of_study')->withTimestamps();
    }
}
