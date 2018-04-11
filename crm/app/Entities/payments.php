<?php
/**
 * Created by PhpStorm.
 * User: DELL
 * Date: 4/10/2017
 * Time: 11:51 AM
 */

namespace App\Entities;


use Illuminate\Database\Eloquent\Model;

class payments extends Model
{
    protected $fillable = [
        'student_id','edit_id','payment_amount','payment_currency','confirm','confirm_by','created_at','updated_at'
    ];
}