<?php

namespace App\Entities;

use Illuminate\Database\Eloquent\Model;

class plans extends Model
{
    protected $fillable = ['name', 'plan_type', 'code'];
    public $timestamps = false;
}
