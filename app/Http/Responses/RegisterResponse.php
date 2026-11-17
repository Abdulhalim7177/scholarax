<?php

namespace App\Http\Responses;

use App\Enums\UserRole;
use Illuminate\Http\JsonResponse;
use Laravel\Fortify\Contracts\RegisterResponse as RegisterResponseContract;
use Symfony\Component\HttpFoundation\Response;

class RegisterResponse implements RegisterResponseContract
{
    public function toResponse($request): Response
    {
        $redirect = $request->user()?->role?->homePath() ?? UserRole::Student->homePath();

        return $request->wantsJson()
            ? new JsonResponse(['two_factor' => false], 201)
            : redirect()->intended($redirect);
    }
}
