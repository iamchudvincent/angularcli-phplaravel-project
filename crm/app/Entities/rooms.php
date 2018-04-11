<?php

namespace App\Entities;

use Illuminate\Database\Eloquent\Model;

class rooms extends Model
{
    protected $fillable = ['type', 'name'];
    public $timestamps = false;
}
