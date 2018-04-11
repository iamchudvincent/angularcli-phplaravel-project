<?php
/**
 * Created by PhpStorm.
 * User: DELL
 * Date: 4/10/2017
 * Time: 12:46 PM
 */

namespace App\Entities;


use Illuminate\Database\Eloquent\Model;

class dormitory_rooms extends Model
{
    protected $fillable = ['accommodation_id', 'room_id', 'name', 'gender'];
    public $timestamps = false;

    public function accommodation()
    {
        return $this->belongsTo('App\Entities\accommodations', 'accommodation_id');
    }

    public function room()
    {
        return $this->belongsTo('App\Entities\rooms', 'room_id');
    }
}