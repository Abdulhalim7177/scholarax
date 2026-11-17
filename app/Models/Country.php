<?php

namespace App\Models;

use Database\Factories\CountryFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $name
 * @property string $iso2
 * @property string|null $iso3
 * @property bool $is_active
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Collection<int, Scholarship> $scholarships
 * @property-read Collection<int, Scholarship> $eligibleScholarships
 */
#[Fillable(['name', 'iso2', 'iso3', 'is_active'])]
class Country extends Model
{
    /** @use HasFactory<CountryFactory> */
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    /**
     * Get the scholarships hosted in this country.
     *
     * @return HasMany<Scholarship, $this>
     */
    public function scholarships(): HasMany
    {
        return $this->hasMany(Scholarship::class, 'host_country_id');
    }

    /**
     * Get the scholarships that accept applicants from this country.
     *
     * @return BelongsToMany<Scholarship, $this>
     */
    public function eligibleScholarships(): BelongsToMany
    {
        return $this->belongsToMany(Scholarship::class, 'scholarship_eligible_country')->withTimestamps();
    }
}
