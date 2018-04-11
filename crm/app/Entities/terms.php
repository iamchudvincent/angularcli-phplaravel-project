<?php

namespace App\Entities;

use Illuminate\Database\Eloquent\Model;

class terms extends Model
{
    protected $fillable = ['name'];
    public $timestamps = false;
}
