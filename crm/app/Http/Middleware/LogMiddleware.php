<?php

namespace App\Http\Middleware;

use Closure;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Contracts\Facades\ChannelLog;
use App\Repositories\ChangeLog\ChangeLogInterface;

class LogMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    private $changeLogService;

    public function __construct(ChangeLogInterface $changeLogService)
    {
        $this->changeLogService = $changeLogService;
    }

    public function handle($request, Closure $next)
    {
        return $next($request);
    }

    public function terminate($request, $response)
    {
        if ($response->status() == 200) {
            $user = JWTAuth::toUser($request->header('jwt'));
            $data = (array)$response->getData();      
            
            if ($request->isMethod('post')) {
                if ($request->is(config('routes.reservation'))) {
                    ChannelLog::writeLog($user["email"] . " dormitory insert.", $data);
                } else if ($request->is('admin/other-reservation')) {
                    ChannelLog::writeLog($user["email"] . " others insert.", $data);
                } else if ($request->is('admin/import')) {
                    ChannelLog::writeLog($user["email"] . " data import.", $data);
                }
            } else if ($request->isMethod('put')) {
                if ($request->is(config('routes.reservation').'/*')) { 
                    ChannelLog::writeLog($user["email"]." dormitory update.", $data);
                } else if ($request->is(config('routes.other_reservation').'/*')) {
                    ChannelLog::writeLog($user["email"] . " others update.", $data);
                }
            } else if ($request->isMethod('delete')) {
                if ($request->is(config('routes.reservation').'/*')) { 
                    ChannelLog::writeLog($user["email"]." dormitory delete.", (array)$data["data"]);
                } else if ($request->is(config('routes.other_reservation').'/*')) {
                    ChannelLog::writeLog($user["email"] . " others delete.", (array)$data["data"]);
                }
            }
            $this->saveChangeLog($request, $user, $response);

        }
    }

    public function saveChangeLog($request, $user, $response)
    {
        $input_params = $request->all();  // Retrieving All Input Data
        $today=date("Y-m-d h:i:s");
        $changeLog = array(
            "created_time" => $today,
            "modified_time" => $today,
            "operator_id" => $user['id'],
            "email_address" => $user['email'],
            "method_name" => str_replace("/app/admin/", "", $request->server('REQUEST_URI')),
            "params_json" => json_encode($input_params),
            "result_json" => $response->content(),
            "remote_addr_ip" => $request->ip(),
            "request_uri" => $request->server('REQUEST_URI'),
            "user_agent" => $request->server('HTTP_USER_AGENT'),
            "server_name" => $request->server('SERVER_NAME'),
            "host_name" => $request->server('HTTP_HOST')
        );
        $this->changeLogService->create($changeLog);
    }
}
