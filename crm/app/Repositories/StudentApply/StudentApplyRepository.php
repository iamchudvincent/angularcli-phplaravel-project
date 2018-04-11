<?php
namespace App\Repositories\StudentApply;

use App\Entities\student_apply;
use Illuminate\Pagination\Paginator;
class StudentApplyRepository implements StudentApplyInterface
{
    public $studentApply;

    public function __construct(student_apply $studentApply)
    {
        $this->studentApply = $studentApply;
    }


    public function create($studentApply)
    {
        return $this->studentApply->create($studentApply);
    }

    public function insertArray($studentApplyArray)
    {
        return $this->studentApply->insert($studentApplyArray);
    }

    public function all()
    {
        return $this->studentApply->all();
    }

    public function exportSearch($request){
        $query = $this->studentApply;
        return $query->where('delete_flag', '=', '0')
            ->orderBy('id', 'desc')->get();
    }

    public function search($request)
    {
        if(array_key_exists("currentPage", $request) && !empty($request["currentPage"])) {
            $currentPage = $request['currentPage'];
        } else {
            $currentPage = 1;
        }
        Paginator::currentPageResolver(function () use ($currentPage) {
            return $currentPage;
        });
        $query = $this->studentApply;
        if(array_key_exists("passportName", $request) && !empty($request["passportName"])){
            $textsearch = $request['passportName'];
            $query = $query->where(function ($query) use ($textsearch){
                $query->where('student_name', 'like', '%'.$textsearch.'%')
                    ->orWhere("phone", "like", '%'.$textsearch.'%')
                    ->orWhere("email", "like", '%'.$textsearch.'%');
            });
        }
        if(array_key_exists("studentStat", $request) && !empty($request["studentStat"])){
            $studStat = $request['studentStat'];
            $query = $query->where(function ($query) use ($studStat){
                $query->where("student_status", "=", $studStat);
            });
        }
        if(array_key_exists("cntCode", $request) && !empty($request["cntCode"])){
            $cntCode= $request['cntCode'];
            $query = $query->where(function ($query) use ($cntCode){
                $query->where("country_code", "=", $cntCode);
            });
        }
        if(array_key_exists("checkIn", $request) && !empty($request["checkIn"])){
            if(!empty($request['checkIn'])) {
                $start = $request['checkIn'];
                $startArray = array_values($start);
                $query = $query->where("checkin_date", ">=", $startArray[2]);
            }
        }
        if(array_key_exists("checkOut", $request) && !empty($request["checkOut"])){
            if(!empty($request['checkOut'])) {
                $end = $request['checkOut'];
                $endArray = array_values($end);
                $query = $query->where("checkin_date", "<=", $endArray[2]);
            }
        }
        if(array_key_exists("building", $request) && !empty($request["building"])){
            $query = $query->where("building_id", $request['building']);
        }
        if(array_key_exists("paymentCheck", $request) && !empty($request["paymentCheck"])){
            $query = $query->where("payment_pending",">", 0);
        }
        return $query->where('delete_flag', '=', '0')
            ->orderBy('id', 'desc')->paginate(50);
    }

    public function findById($id)
    {
        return $this->studentApply
            ->where('id', '=', $id)
            ->first();
    }

    public function findByApplyNo($id)
    {
        return $this->studentApply
            ->where('apply_no', '=', $id)
            ->first();
    }

    public function findByInvoiceNo($id)
    {
        return $this->studentApply
            ->where('invoice_number', '=', $id)
            ->first();
    }

    public function findByEditId($id)
    {
        return $this->studentApply
            ->where('edit_id', '=', $id)
            ->first();
    }

    public function exportData()
    {
        return $this->studentApply
        ->get(array(
            'student_applies.*',
            'id_number as id_number',
            'apply_no as apply_no',
            'student_name as student_name',
            'passport_name as passport_name',
            'birthday as birthday',
            'sex as sex',
            'age as age',
            'nationality as nationality',
            'country_code as country_code',
            'address as address',
            'phone as phone',
            'email as email',
            'job as job',
            'emergency_contact as emergency_contact',
            'email_family as email_family',
            'skype_id as skype_id',
            'room_id1 as room_id1',
            'term as term',
            'course as course',
            'campus as campus',
            'checkin_date as checkin_date',
            'checkout_date as checkout_date',
            'agent_name as agent_name',
            'agent_email as agent_email',

        ));
    }

    public function findBykey($key)
    {
        return $this->studentApply
            ->where('id', '=', $key)
            ->orwhere('apply_no', '=', $key)
            ->orwhere('id_number', '=', $key)
            ->first();
    }

    public function getColumns(){
        return $this->studentApply->getConnection()->getSchemaBuilder()->getColumnListing($this->studentApply->getTable());
    }


    public function getGradList($gradFrom,$gradCampus){

        $gradTo = strtotime("6 days", strtotime($gradFrom));
        $gradTo = date('Y-m-d', $gradTo);
        $query = $this->studentApply;
        return $query
            ->where('building_id','=',$gradCampus)
            ->where(function($query) use ($gradFrom, $gradTo) {
                $query->where(function ($q) use ($gradFrom, $gradTo) {
                    $q->where('graduation_date', '>=', $gradFrom)
                        ->where('graduation_date', '<=', $gradTo);
                })->orWhere(function ($q) use ($gradFrom, $gradTo) {
                    $q->where('graduation_date', '>=', $gradFrom)
                        ->where('graduation_date', '<=', $gradTo);
                })->orWhere(function ($q) use ($gradFrom, $gradTo) {
                    $q->where('graduation_date', '<=', $gradFrom)
                        ->where('graduation_date', '>=', $gradTo);
                });
            })
            ->orderBy('graduation_date', 'asc')->get();

    }


    public function getChangeDorm($changeFrom){
        return $query = $this->studentApply
            ->join('reservations_student_apply', 'student_applies.id', '=', 'reservations_student_apply.student_apply_id')
            ->join('reservations','reservations_student_apply.reservations_id','=','reservations.id')
            ->join('beds', 'reservations.bed_id','=','beds.id')
            ->join('dormitory_rooms','beds.dormitory_room_id','=', 'dormitory_rooms.id')
            ->join('rooms', 'dormitory_rooms.room_id', '=', 'rooms.id')
            ->whereRaw('student_applies.id = reservations_student_apply.student_apply_id')
            ->whereRaw('reservations.date_from > student_applies.checkin_date')
            ->where('reservations.date_from', '>=', $changeFrom)
            ->orderBy('student_applies.student_name', 'asc')
            ->get(array(
                'student_applies.*',
                'reservations.date_from as reservation_checkin',
                'reservations.date_to as reservation_checkout',
                'rooms.type as room_type',
                'dormitory_rooms.name as dormitory_room_name'
            ))->toArray();

    }


    public function getChangeHotel($changeFrom){
       return $query = $this->studentApply
            ->join('hotel_reservations','student_applies.id','=','hotel_reservations.student_id_num')
            ->whereRaw('hotel_reservations.student_id_num = student_applies.id')
            ->whereRaw('hotel_reservations.checkin_date > student_applies.checkin_date')
            ->where('hotel_reservations.checkin_date','>=',$changeFrom)
           ->orderBy('student_applies.student_name', 'asc')
            ->get(array(
                'student_applies.*',
                'hotel_reservations.checkin_date as hotel_checkin',
                'hotel_reservations.checkout_date as hotel_checkout',
                'hotel_reservations.accommodation as hotel_accommodation'
            ))->toArray();
    }
}