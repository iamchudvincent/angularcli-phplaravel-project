<?php

namespace App\Entities;

use Illuminate\Database\Eloquent\Model;

class longstay_prices extends Model
{
    protected $fillable = ['plan_id', 'room_id', 'accommodation_id', 'num_of_use', 'term_id', 'apply_from', 'apply_to', 'price', 'price_en'];
    public $timestamps = false;

    public function accommodation()
    {
        return $this->belongsTo('App\Entities\accommodations', 'accommodation_id');
    }

    public function plan()
    {
        return $this->belongsTo('App\Entities\plans', 'plan_id');
    }

    public function room()
    {
        return $this->belongsTo('App\Entities\rooms', 'room_id');
    }

    public function term()
    {
        return $this->belongsTo('App\Entities\terms', 'term_id');
    }
}
