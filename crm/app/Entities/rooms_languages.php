<?php

namespace App\Entities;

use Illuminate\Database\Eloquent\Model;

class rooms_languages extends Model
{
    protected $fillable = ["rooms_name", "rooms_id", "country_code"];
    public $timestamps = false;
}
