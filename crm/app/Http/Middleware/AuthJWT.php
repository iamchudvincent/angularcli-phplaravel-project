<?php

namespace App\Http\Middleware;

use Closure;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthJWT
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $statusCodes = config('constants.status_code');

        if(!empty($request->header('jwt'))) {
            $user = JWTAuth::toUser($request->header('jwt'));
            $request->attributes->add(['user' => $user]);
        } else {
            return response()->json(["errors" => [config('errorcodes.token.token_invalid')['key']]], $statusCodes['unauthorized']);
        }
        return $next($request);
    }
}
