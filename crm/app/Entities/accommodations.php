<?php

namespace App\Entities;

use Illuminate\Database\Eloquent\Model;

class accommodations extends Model
{
    protected $fillable = ['name', 'room_type', 'accommodation_type', 'building_id'];

    public function building()
    {
        return $this->belongsTo('App\Entities\buildings', 'building_id');
    }
}
