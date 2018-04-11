<?php
/**
 * Created by PhpStorm.
 * User: DELL
 * Date: 4/10/2017
 * Time: 2:07 PM
 */

namespace App\Repositories\HotelReservations;


use Illuminate\Support\ServiceProvider;

class HotelReservationsService extends ServiceProvider
{
    /**
     * Bootstrap the application services.
     *
     * @return void
     */
    public function boot()
    {

    }

    /**
     * Register the application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind('App\Repositories\HotelReservations\HotelReservationsInterface', 'App\Repositories\HotelReservations\HotelReservationsRepository');
    }
}