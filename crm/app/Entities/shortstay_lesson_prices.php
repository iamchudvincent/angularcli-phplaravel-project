<?php

namespace App\Entities;

use Illuminate\Database\Eloquent\Model;

class shortstay_lesson_prices extends Model
{
    protected $fillable = ['plan_id', 'day_type', 'apply_from', 'apply_to', 'price'];
    public $timestamps = false;

    public function plan()
    {
        return $this->belongsTo('App\Entities\plans');
    }
}
