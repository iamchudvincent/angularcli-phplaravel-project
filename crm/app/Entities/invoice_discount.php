<?php
/**
 * Created by PhpStorm.
 * User: DELL
 * Date: 4/10/2017
 * Time: 11:51 AM
 */

namespace App\Entities;


use Illuminate\Database\Eloquent\Model;

class invoice_discount extends Model
{
    protected $fillable = ['student_invoice_no','discount','who_discounted','reason','updated_at','created_at'];
}