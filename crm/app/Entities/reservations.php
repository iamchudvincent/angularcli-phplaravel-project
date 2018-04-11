<?php
/**
 * Created by PhpStorm.
 * User: DELL
 * Date: 4/10/2017
 * Time: 11:51 AM
 */

namespace App\Entities;


use Illuminate\Database\Eloquent\Model;

class reservations extends Model
{
    protected $fillable = ['bed_id', 'date_from', 'date_to', 'reservation_status_id', 'memo', 'nationality_id', 'deleted_at', 'created_user', 'created_at', 'updated_user', 'updated_at'];

    public function bed()
    {
        return $this->belongsTo('App\Entities\beds', 'bed_id');
    }

    public function reservationStatus()
    {
        return $this->belongsTo('App\Entities\reservation_statuses', 'reservation_status_id');
    }

    public function nationality()
    {
        return $this->belongsTo('App\Entities\nationalities', 'nationality_id');
    }
}