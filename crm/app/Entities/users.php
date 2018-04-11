<?php
/**
 * Created by PhpStorm.
 * User: DELL
 * Date: 4/10/2017
 * Time: 1:36 PM
 */

namespace App\Entities;


use Illuminate\Database\Eloquent\Model;

class users extends Model
{
    protected $fillable = ['email', 'password', 'name', 'mail_notification'];
    public $timestamps = false;
}