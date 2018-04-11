<?php

namespace App\Entities;

use Illuminate\Database\Eloquent\Model;

class plans_languages extends Model
{
    protected $fillable = ["plan_name", "plans_id", "country_code"];
    public $timestamps = false;
}
