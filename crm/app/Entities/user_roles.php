<?php
/**
 * Created by PhpStorm.
 * User: DELL
 * Date: 4/10/2017
 * Time: 1:38 PM
 */

namespace App\Entities;


use Illuminate\Database\Eloquent\Model;

class user_roles extends Model
{
    protected $fillable = ['user_id', 'role_id'];
    public $timestamps = false;

    public function user()
    {
        $this->belongsTo('App\Entities\users', 'user_id');
    }

    public function role()
    {
        $this->belongsTo('App\Entities\roles', 'role_id');
    }
}