<?php

namespace App\Repositories\HotelReservations;

interface HotelReservationsInterface
{

    public function create($hotelReservation);

    public function all();

    public function insertArray($hotelReservationArray);

    public function findByStudentId($id);

    public function findByHotelBookingId($id);

    public function remove($id);

}