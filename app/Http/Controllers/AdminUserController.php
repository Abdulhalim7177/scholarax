<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Models\MentorProfile;
use App\Models\User;
use App\Support\AdminData;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminUserController extends Controller
{
    /**
     * Display the platform user directory.
     */
    public function index(Request $request): Response
    {
        $filters = [
            'q' => trim((string) $request->input('q', '')),
            'role' => (string) $request->input('role', ''),
        ];

        $query = User::query()->with('mentorProfile:id,user_id,verification_status');

        $role = UserRole::tryFrom($filters['role']);

        if ($role !== null) {
            $query->where('role', $role);
        }

        if ($filters['q'] !== '') {
            $like = '%'.$filters['q'].'%';

            $query->where(function (Builder $query) use ($like): void {
                $query->where('name', 'like', $like)->orWhere('email', 'like', $like);
            });
        }

        $users = $query
            ->latest()
            ->paginate(10)
            ->withQueryString()
            ->through(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role->value,
                'roleLabel' => $user->role->label(),
                'status' => $user->email_verified_at === null ? 'pending' : 'active',
                'initials' => AdminData::initials($user->name),
                'tone' => AdminData::accent($user->id),
                'mentorProfileId' => $user->mentorProfile?->id,
                'joinedAt' => $user->created_at?->toIso8601String(),
            ]);

        return Inertia::render('admin-users', [
            'users' => $users,
            'filters' => $filters,
            'roles' => [
                ['value' => '', 'label' => 'All users'],
                ['value' => UserRole::Student->value, 'label' => 'Students'],
                ['value' => UserRole::Mentor->value, 'label' => 'Mentors'],
                ['value' => UserRole::Admin->value, 'label' => 'Admins'],
            ],
            'stats' => [
                'total' => User::query()->count(),
                'verifiedMentors' => MentorProfile::query()->verified()->count(),
                'newThisWeek' => User::query()->where('created_at', '>=', now()->subWeek())->count(),
            ],
        ]);
    }
}
