<?php
/**
 * Created by PhpStorm.
 * User: DELL
 * Date: 4/10/2017
 * Time: 11:58 AM
 */

namespace App\Entities;


use Illuminate\Database\Eloquent\Model;

class beds extends Model
{
    protected $fillable = ['dormitory_room_id', 'name'];

    public function dormitoryRoom()
    {
        return $this->belongsTo('App\Entities\dormitory_rooms', 'dormitory_room_id');
    }

    public function reservations()
    {
        return $this->hasMany('App\Entities\reservations', 'bed_id');
    }
}