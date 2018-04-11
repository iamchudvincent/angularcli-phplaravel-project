<?php
/**
 * Created by PhpStorm.
 * User: DELL
 * Date: 4/10/2017
 * Time: 1:46 PM
 */

namespace App\Entities;


use Illuminate\Database\Eloquent\Model;

class role_permissions extends Model
{
    protected $fillable = ['role_id', 'permission_id'];

    public function role()
    {
        $this->belongsTo('App\Entities\roles', 'role_id');
    }

    public function permission()
    {
        $this->belongsTo('App\Entities\permissions', 'permission_id');
    }
}