<?php

namespace App\Entities;

use Illuminate\Database\Eloquent\Model;

class buildings extends Model
{
    protected $fillable = ['name'];
    public $timestamps = false;
}
