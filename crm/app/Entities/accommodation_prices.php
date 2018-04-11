<?php

namespace App\Entities;

use Illuminate\Database\Eloquent\Model;

class accommodation_prices extends Model
{
    protected $fillable = ['apply_from', 'apply_to', 'price', 'accommodation_id', 'room_id'];

    public function accommodation()
    {
        return $this->belongsTo('App\Entities\accommodations', 'accommodation_id');
    }

    public function room()
    {
        return $this->belongsTo('App\Entities\rooms', 'room_id');
    }
}
