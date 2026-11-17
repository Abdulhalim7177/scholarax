<?php

namespace App\Http\Responses;

use App\Enums\UserRole;
use Illuminate\Http\JsonResponse;
use Laravel\Fortify\Contracts\VerifyEmailResponse as VerifyEmailResponseContract;
use Symfony\Component\HttpFoundation\Response;

class VerifyEmailResponse implements VerifyEmailResponseContract
{
    public function toResponse($request): Response
    {
        $redirect = $request->user()?->role?->homePath() ?? UserRole::Student->homePath();

        return $request->wantsJson()
            ? new JsonResponse('', 204)
            : redirect()->intended($redirect.'?verified=1');
    }
}
