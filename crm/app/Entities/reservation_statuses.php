<?php
/**
 * Created by PhpStorm.
 * User: DELL
 * Date: 4/10/2017
 * Time: 12:00 PM
 */

namespace App\Entities;


use Illuminate\Database\Eloquent\Model;

class reservation_statuses extends Model
{
    protected $fillable = ['name'];
}