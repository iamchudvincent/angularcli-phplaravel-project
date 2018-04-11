<?php

namespace App\Entities;

use Illuminate\Database\Eloquent\Model;

class accommodations_languages extends Model
{
    protected $fillable = ["accommodations_name", "accommodations_id", "country_code"];
    public $timestamps = false;
}
