<?php
/**
 * Created by PhpStorm.
 * User: DELL
 * Date: 4/10/2017
 * Time: 12:03 PM
 */

namespace App\Entities;


use Illuminate\Database\Eloquent\Model;

class other_reservations extends Model
{
    protected $fillable = ['accommodation_id', 'date_from', 'date_to', 'reservation_status_id', 'hotel_status_id', 'memo', 'nationality_id', 'deleted_at', 'created_user', 'created_at', 'updated_user', 'updated_at'];

    public function accommodation()
    {
        return $this->belongsTo('App\Entities\accommodations', 'accommodation_id');
    }

    public function reservationStatus()
    {
        return $this->belongsTo('App\Entities\reservation_statuses', 'reservation_status_id');
    }

    public function hotelStatus()
    {
        return $this->belongsTo('App\Entities\hotel_ststuses', 'hotel_status_id');
    }

    public function nationality()
    {
        return $this->belongsTo('App\Entities\nationalities', 'nationality_id');
    }
}