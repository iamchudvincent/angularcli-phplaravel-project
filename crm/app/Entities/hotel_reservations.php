<?php
/**
 * Created by PhpStorm.
 * User: DELL
 * Date: 4/10/2017
 * Time: 11:51 AM
 */

namespace App\Entities;


use Illuminate\Database\Eloquent\Model;

class hotel_reservations extends Model
{
    protected $fillable = ['student_id_num','checkin_date','checkout_date','accommodation','filename','filesize','created_at','updated_by','updated_at'];
}