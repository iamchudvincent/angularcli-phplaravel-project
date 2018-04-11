<?php

namespace App\Entities;

use Illuminate\Database\Eloquent\Model;

class holidays extends Model
{
    protected $fillable = ['date', 'name', 'opened_class'];
    public $timestamps = false;
}
