<?php
/**
 * Created by PhpStorm.
 * User: DELL
 * Date: 4/10/2017
 * Time: 11:51 AM
 */

namespace App\Entities;


use Illuminate\Database\Eloquent\Model;

class operation_log extends Model
{
 
    protected $fillable = ['email_address','deleted_flag','operator_id','operator_role_id',
        'method_name','params_json','result_json','remote_addr_ip','request_uri',
        'user_agent','server_name','host_name','updated_at','created_at'];
}