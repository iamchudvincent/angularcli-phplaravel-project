<?php
/**
 * Created by PhpStorm.
 * User: DELL
 * Date: 4/10/2017
 * Time: 12:01 PM
 */

namespace App\Entities;


use Illuminate\Database\Eloquent\Model;

class nationalities extends Model
{
    protected $fillable = ['name', 'flag_url'];
}