<?php
namespace App\Repositories\HotelReservations;

use App\Entities\hotel_reservations;


class HotelReservationsRepository implements HotelReservationsInterface
{
    public $hotelReservation;


    public function __construct(hotel_reservations $hotelReservation)
    {
        $this->hotelReservation = $hotelReservation;
    }


    public function create($hotelReservation)
    {
        return $this->hotelReservation->create($hotelReservation);
    }

    public function insertArray($hotelReservationArray)
    {
        return $this->hotelReservation->insert($hotelReservationArray);
    }

    public function all()
    {
        return $this->hotelReservation->all();
    }

    public function findByStudentId($id)
    {
        return $this->hotelReservation
            ->where('student_id_num', "=", $id)
            ->orderBy('created_at', 'desc')
            ->distinct()
            ->get();
    }

    public function findByHotelBookingId($id){
        return $this->hotelReservation
            ->where('id', "=", $id)
            ->first();
    }

    public function remove($id)
    {
        return $this->hotelReservation
            ->where('id', "=", $id)
            ->delete();
    }

}