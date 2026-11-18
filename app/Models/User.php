<?php

namespace App\Models;

use App\Concerns\HasTeams;
use App\Enums\UserRole;
use Database\Factories\UserFactory;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;
use Laravel\Fortify\Contracts\PasskeyUser;
use Laravel\Fortify\PasskeyAuthenticatable;
use Laravel\Fortify\TwoFactorAuthenticatable;

/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property Carbon|null $email_verified_at
 * @property string $password
 * @property UserRole $role
 * @property string|null $avatar
 * @property string|null $two_factor_secret
 * @property string|null $two_factor_recovery_codes
 * @property Carbon|null $two_factor_confirmed_at
 * @property string|null $remember_token
 * @property int|null $current_team_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Team|null $currentTeam
 * @property-read string|null $avatar_url
 * @property-read Collection<int, Team> $ownedTeams
 * @property-read Collection<int, Membership> $teamMemberships
 * @property-read Collection<int, Team> $teams
 * @property-read Collection<int, Scholarship> $savedScholarships
 * @property-read StudentProfile|null $studentProfile
 * @property-read Collection<int, Education> $educations
 * @property-read Collection<int, WorkExperience> $workExperiences
 * @property-read Collection<int, TestScore> $testScores
 * @property-read Collection<int, Application> $applications
 * @property-read Collection<int, ActivityEvent> $activityEvents
 */
#[Fillable(['name', 'email', 'password', 'role', 'avatar', 'current_team_id'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable implements MustVerifyEmail, PasskeyUser
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, HasTeams, Notifiable, PasskeyAuthenticatable, TwoFactorAuthenticatable;

    /**
     * The accessors to append to the model's array form.
     *
     * @var list<string>
     */
    protected $appends = ['avatar_url'];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'role' => UserRole::class,
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    /**
     * Get the scholarships saved by the user.
     *
     * @return BelongsToMany<Scholarship, $this>
     */
    public function savedScholarships(): BelongsToMany
    {
        return $this->belongsToMany(Scholarship::class, 'saved_scholarships')->withTimestamps();
    }

    /**
     * Get the user's student profile.
     *
     * @return HasOne<StudentProfile, $this>
     */
    public function studentProfile(): HasOne
    {
        return $this->hasOne(StudentProfile::class);
    }

    /**
     * Get the user's education history.
     *
     * @return HasMany<Education, $this>
     */
    public function educations(): HasMany
    {
        return $this->hasMany(Education::class)->orderByDesc('started_at');
    }

    /**
     * Get the user's work experience.
     *
     * @return HasMany<WorkExperience, $this>
     */
    public function workExperiences(): HasMany
    {
        return $this->hasMany(WorkExperience::class)->orderByDesc('started_at');
    }

    /**
     * Get the user's test scores.
     *
     * @return HasMany<TestScore, $this>
     */
    public function testScores(): HasMany
    {
        return $this->hasMany(TestScore::class)->orderByDesc('tested_at');
    }

    /**
     * Get the scholarship applications submitted by the user.
     *
     * @return HasMany<Application, $this>
     */
    public function applications(): HasMany
    {
        return $this->hasMany(Application::class, 'student_id');
    }

    /**
     * Get the CV and statement documents owned by the user.
     *
     * @return HasMany<CvSopDocument, $this>
     */
    public function cvSopDocuments(): HasMany
    {
        return $this->hasMany(CvSopDocument::class);
    }

    /**
     * Get the user's activity feed.
     *
     * @return HasMany<ActivityEvent, $this>
     */
    public function activityEvents(): HasMany
    {
        return $this->hasMany(ActivityEvent::class)->latest();
    }

    /**
     * Get the user's avatar URL.
     */
    public function getAvatarUrlAttribute(): ?string
    {
        if (! $this->avatar) {
            return null;
        }

        return asset('storage/'.$this->avatar);
    }
}
