<?php

namespace App\Http\Middleware;

use App\Enums\UserRole;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasRole
{
    /**
     * Ensure the authenticated user has one of the given roles.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        abort_if($user === null, 403);

        $allowedRoles = array_filter(array_map(
            fn (string $role) => UserRole::tryFrom(trim($role)),
            $roles,
        ));

        abort_if($allowedRoles === [] || ! in_array($user->role, $allowedRoles, true), 403);

        return $next($request);
    }
}
