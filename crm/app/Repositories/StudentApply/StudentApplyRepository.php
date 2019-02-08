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

    public function getLastStudentId()
    {
        return $this->studentApply
            ->latest('id')->first();
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
                    ->orWhere("passport_name", "like", '%'.$textsearch.'%')
                    ->orWhere("phone", "like", '%'.$textsearch.'%')
                    ->orWhere("id_number", "like", '%'.$textsearch.'%')
                    ->orWhere("course", "like", '%'.$textsearch.'%')
                    ->orWhere("camp_name", "like", '%'.$textsearch.'%')
                    ->orWhere("note_for_op", "like", '%'.$textsearch.'%')
                    ->orWhere("receipt_number", "like", '%'.$textsearch.'%')
                    ->orWhere("invoice_number", "like", '%'.$textsearch.'%')
                    ->orWhere("agent_name", "like", '%'.$textsearch.'%');
            });
        }
        if(array_key_exists("studentStat", $request) && !empty($request["studentStat"])){
            $studStat = $request['studentStat'];
            if($studStat != 0){
                $query = $query->where(function ($query) use ($studStat){
                    $query->where("student_status", "=", $studStat);
                });
            }
        }
        if(array_key_exists("cntCode", $request) && !empty($request["cntCode"])){
            $cntCode= $request['cntCode'];
            if($cntCode != "Others"){
                $query = $query->where(function ($query) use ($cntCode){
                    $query->where("country_code", "=", $cntCode);
                });
            } else {
                $query = $query->where(function ($query) use ($cntCode){
                    $query->where("country_code", "=", "IT")
                        ->orWhere("country_code", "=", "MY")
                        ->orWhere("country_code", "=", "SP")
                        ->orWhere("country_code", "=", "SW")
                        ->orWhere("country_code", "=", "TK")
                        ->orWhere("country_code", "=", "UAE")
                        ->orWhere("country_code", "=", "EN")
                        ->orWhere("country_code", "=", "Others");
                });
            }
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
            if($request["building"] != -1){
                $query = $query->where("building_id", $request['building']);
            }
        }
        if(array_key_exists("building", $request) && !empty($request["building"])){
            if($request["building"] == -1) {
                if(array_key_exists("transferDate", $request) && !empty($request["transferDate"])){
                    if(!empty($request['transferDate'])) {
                        $transferDate = $request['transferDate'];
                        $formattedValue = array_values($transferDate);
                        $query = $query->where("sfc_to_itp", "like", '%'.$formattedValue[2].'%')
                            ->orWhere("itp_to_sfc", "like", '%'.$formattedValue[2].'%');
                    }
                }
            }
            if($request["building"] != -1){
                if($request["building"] == 2) {
                    if(array_key_exists("transferDate", $request) && !empty($request["transferDate"])){
                        if(!empty($request['transferDate'])) {
                            $transferDate = $request['transferDate'];
                            $formattedValue = array_values($transferDate);
                            $query = $query->where("sfc_to_itp", "like", '%'.$formattedValue[2].'%');
                        }
                    }
                } else {
                    if(array_key_exists("transferDate", $request) && !empty($request["transferDate"])){
                        if(!empty($request['transferDate'])) {
                            $transferDate = $request['transferDate'];
                            $formattedValue = array_values($transferDate);
                            $query = $query->where("itp_to_sfc", "like", '%'.$formattedValue[2].'%');
                        }
                    }
                }
            }
        }
        if(array_key_exists("paymentCheck", $request) && !empty($request["paymentCheck"])){
            $query = $query->where("payment_pending",">", 0);
        }
        if(array_key_exists("addDateFrom", $request) && !empty($request["addDateFrom"])){
            if(!empty($request['addDateFrom'])) {
                $addedDate = $request['addDateFrom'];
                $formattedValue = array_values($addedDate);
                $query = $query->where("created_at", ">=", $formattedValue[2]);
            }
        }
        if(array_key_exists("addDateTo", $request) && !empty($request["addDateTo"])){
            if(!empty($request['addDateTo'])) {
                $addedDate = $request['addDateTo'];
                $formattedValue = array_values($addedDate);
                $query = $query->where("created_at", "<=", $formattedValue[2]);
            }
        }
        if(array_key_exists("gradDateFrom", $request) && !empty($request["gradDateFrom"])){
            if(!empty($request['gradDateFrom'])) {
                $gradDate = $request['gradDateFrom'];
                $formattedValue = array_values($gradDate);
                $query = $query->where("graduation_date", ">=", $formattedValue[2]);
            }
        }
        if(array_key_exists("gradDateTo", $request) && !empty($request["gradDateTo"])){
            if(!empty($request['gradDateTo'])) {
                $gradDate = $request['gradDateTo'];
                $formattedValue = array_values($gradDate);
                $query = $query->where("graduation_date", "<=", $formattedValue[2]);
            }
        }
        if(array_key_exists("searchCheckedList", $request) && !empty($request["searchCheckedList"])){
            if(!empty($request['searchCheckedList'])) {
                $searchList = $request['searchCheckedList'];
                $searchValue = explode(',', $searchList);
                foreach($searchValue as $check) {
                    $query = $query->orWhere('id','=',$check);
                }
            }
        }

        if(empty($request["passportName"]) && empty($request["studentStat"]) && empty($request["cntCode"]) && empty($request["checkIn"])
            && empty($request["checkOut"]) && empty($request["paymentCheck"]) && empty($request["addDateFrom"]) &&
            empty($request["addDateTo"]) && empty($request["gradDateFrom"]) && empty($request["gradDateTo"]) &&
            empty($request["searchCheckedList"])) {
            return $query->where('delete_flag', '=', '0')
                ->orderBy('created_at', 'desc')
                ->orderBy('id', 'asc')
                ->paginate(75);
        } else {
            return $query->where('delete_flag', '=', '0')
                ->orderBy('checkin_date', 'asc')
                ->paginate(75);
        }

    }

    public function searchPrintList($request)
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
                    ->orWhere("passport_name", "like", '%'.$textsearch.'%')
                    ->orWhere("phone", "like", '%'.$textsearch.'%')
                    ->orWhere("id_number", "like", '%'.$textsearch.'%')
                    ->orWhere("course", "like", '%'.$textsearch.'%')
                    ->orWhere("camp_name", "like", '%'.$textsearch.'%')
                    ->orWhere("note_for_op", "like", '%'.$textsearch.'%')
                    ->orWhere("receipt_number", "like", '%'.$textsearch.'%')
                    ->orWhere("agent_name", "like", '%'.$textsearch.'%');
            });
        }
        if(array_key_exists("studentStat", $request) && !empty($request["studentStat"])){
            $studStat = $request['studentStat'];
            if($studStat != 0){
                $query = $query->where(function ($query) use ($studStat){
                    $query->where("student_status", "=", $studStat);
                });
            }
        }
        if(array_key_exists("cntCode", $request) && !empty($request["cntCode"])){
            $cntCode= $request['cntCode'];
            if($cntCode != "Others"){
                $query = $query->where(function ($query) use ($cntCode){
                    $query->where("country_code", "=", $cntCode);
                });
            } else {
                $query = $query->where(function ($query) use ($cntCode){
                    $query->where("country_code", "=", "IT")
                        ->orWhere("country_code", "=", "MY")
                        ->orWhere("country_code", "=", "SP")
                        ->orWhere("country_code", "=", "SW")
                        ->orWhere("country_code", "=", "TK")
                        ->orWhere("country_code", "=", "UAE")
                        ->orWhere("country_code", "=", "EN")
                        ->orWhere("country_code", "=", "Others");
                });
            }
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
            if($request["building"] != -1){
                $query = $query->where("building_id", $request['building']);
            }
        }
        if(array_key_exists("building", $request) && !empty($request["building"])){
            if($request["building"] == -1) {
                if(array_key_exists("transferDate", $request) && !empty($request["transferDate"])){
                    if(!empty($request['transferDate'])) {
                        $transferDate = $request['transferDate'];
                        $formattedValue = array_values($transferDate);
                        $query = $query->where("sfc_to_itp", "like", '%'.$formattedValue[2].'%')
                            ->orWhere("itp_to_sfc", "like", '%'.$formattedValue[2].'%');
                    }
                }
            }
            if($request["building"] != -1){
                if($request["building"] == 2) {
                    if(array_key_exists("transferDate", $request) && !empty($request["transferDate"])){
                        if(!empty($request['transferDate'])) {
                            $transferDate = $request['transferDate'];
                            $formattedValue = array_values($transferDate);
                            $query = $query->where("sfc_to_itp", "like", '%'.$formattedValue[2].'%');
                        }
                    }
                } else {
                    if(array_key_exists("transferDate", $request) && !empty($request["transferDate"])){
                        if(!empty($request['transferDate'])) {
                            $transferDate = $request['transferDate'];
                            $formattedValue = array_values($transferDate);
                            $query = $query->where("itp_to_sfc", "like", '%'.$formattedValue[2].'%');
                        }
                    }
                }
            }
        }
        if(array_key_exists("paymentCheck", $request) && !empty($request["paymentCheck"])){
            $query = $query->where("payment_pending",">", 0);
        }
        if(array_key_exists("addDateFrom", $request) && !empty($request["addDateFrom"])){
            if(!empty($request['addDateFrom'])) {
                $addedDate = $request['addDateFrom'];
                $formattedValue = array_values($addedDate);
                $query = $query->where("created_at", ">=", $formattedValue[2]);
            }
        }
        if(array_key_exists("addDateTo", $request) && !empty($request["addDateTo"])){
            if(!empty($request['addDateTo'])) {
                $addedDate = $request['addDateTo'];
                $formattedValue = array_values($addedDate);
                $query = $query->where("created_at", "<=", $formattedValue[2]);
            }
        }
        if(array_key_exists("gradDateFrom", $request) && !empty($request["gradDateFrom"])){
            if(!empty($request['gradDateFrom'])) {
                $gradDate = $request['gradDateFrom'];
                $formattedValue = array_values($gradDate);
                $query = $query->where("graduation_date", ">=", $formattedValue[2]);
            }
        }
        if(array_key_exists("gradDateTo", $request) && !empty($request["gradDateTo"])){
            if(!empty($request['gradDateTo'])) {
                $gradDate = $request['gradDateTo'];
                $formattedValue = array_values($gradDate);
                $query = $query->where("graduation_date", "<=", $formattedValue[2]);
            }
        }
        if(array_key_exists("searchCheckedList", $request) && !empty($request["searchCheckedList"])){
            if(!empty($request['searchCheckedList'])) {
                $searchList = $request['searchCheckedList'];
                $searchValue = explode(',', $searchList);
                foreach($searchValue as $check) {
                    $query = $query->orWhere('id','=',$check);
                }
            }
        }

        return $query->where('delete_flag', '=', '0')
            ->orderBy('arrival_date', 'asc')
            ->orderBy('arrival_time', 'asc')
            ->paginate(75);
    }

    public function exportClassList($request)
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
                    ->orWhere("passport_name", "like", '%'.$textsearch.'%')
                    ->orWhere("phone", "like", '%'.$textsearch.'%')
                    ->orWhere("id_number", "like", '%'.$textsearch.'%')
                    ->orWhere("course", "like", '%'.$textsearch.'%')
                    ->orWhere("camp_name", "like", '%'.$textsearch.'%')
                    ->orWhere("note_for_op", "like", '%'.$textsearch.'%')
                    ->orWhere("receipt_number", "like", '%'.$textsearch.'%')
                    ->orWhere("agent_name", "like", '%'.$textsearch.'%');
            });
        }
        if(array_key_exists("studentStat", $request) && !empty($request["studentStat"])){
            $studStat = $request['studentStat'];
            if($studStat != 0){
                $query = $query->where(function ($query) use ($studStat){
                    $query->where("student_status", "=", $studStat);
                });
            }
        }
        if(array_key_exists("cntCode", $request) && !empty($request["cntCode"])){
            $cntCode= $request['cntCode'];
            if($cntCode != "Others"){
                $query = $query->where(function ($query) use ($cntCode){
                    $query->where("country_code", "=", $cntCode);
                });
            } else {
                $query = $query->where(function ($query) use ($cntCode){
                    $query->where("country_code", "=", "IT")
                        ->orWhere("country_code", "=", "MY")
                        ->orWhere("country_code", "=", "SP")
                        ->orWhere("country_code", "=", "SW")
                        ->orWhere("country_code", "=", "TK")
                        ->orWhere("country_code", "=", "UAE")
                        ->orWhere("country_code", "=", "EN")
                        ->orWhere("country_code", "=", "Others");
                });
            }
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
            if($request["building"] != -1){
                $query = $query->where("building_id", $request['building']);
            }
        }
        if(array_key_exists("building", $request) && !empty($request["building"])){
            if($request["building"] == -1) {
                if(array_key_exists("transferDate", $request) && !empty($request["transferDate"])){
                    if(!empty($request['transferDate'])) {
                        $transferDate = $request['transferDate'];
                        $formattedValue = array_values($transferDate);
                        $query = $query->where("sfc_to_itp", "like", '%'.$formattedValue[2].'%')
                            ->orWhere("itp_to_sfc", "like", '%'.$formattedValue[2].'%');
                    }
                }
            }
            if($request["building"] != -1){
                if($request["building"] == 2) {
                    if(array_key_exists("transferDate", $request) && !empty($request["transferDate"])){
                        if(!empty($request['transferDate'])) {
                            $transferDate = $request['transferDate'];
                            $formattedValue = array_values($transferDate);
                            $query = $query->where("sfc_to_itp", "like", '%'.$formattedValue[2].'%');
                        }
                    }
                } else {
                    if(array_key_exists("transferDate", $request) && !empty($request["transferDate"])){
                        if(!empty($request['transferDate'])) {
                            $transferDate = $request['transferDate'];
                            $formattedValue = array_values($transferDate);
                            $query = $query->where("itp_to_sfc", "like", '%'.$formattedValue[2].'%');
                        }
                    }
                }
            }
        }
        if(array_key_exists("paymentCheck", $request) && !empty($request["paymentCheck"])){
            $query = $query->where("payment_pending",">", 0);
        }
        if(array_key_exists("addDateFrom", $request) && !empty($request["addDateFrom"])){
            if(!empty($request['addDateFrom'])) {
                $addedDate = $request['addDateFrom'];
                $formattedValue = array_values($addedDate);
                $query = $query->where("created_at", ">=", $formattedValue[2]);
            }
        }
        if(array_key_exists("addDateTo", $request) && !empty($request["addDateTo"])){
            if(!empty($request['addDateTo'])) {
                $addedDate = $request['addDateTo'];
                $formattedValue = array_values($addedDate);
                $query = $query->where("created_at", "<=", $formattedValue[2]);
            }
        }
        if(array_key_exists("gradDateFrom", $request) && !empty($request["gradDateFrom"])){
            if(!empty($request['gradDateFrom'])) {
                $gradDate = $request['gradDateFrom'];
                $formattedValue = array_values($gradDate);
                $query = $query->where("graduation_date", ">=", $formattedValue[2]);
            }
        }
        if(array_key_exists("gradDateTo", $request) && !empty($request["gradDateTo"])){
            if(!empty($request['gradDateTo'])) {
                $gradDate = $request['gradDateTo'];
                $formattedValue = array_values($gradDate);
                $query = $query->where("graduation_date", "<=", $formattedValue[2]);
            }
        }
        if(array_key_exists("searchCheckedList", $request) && !empty($request["searchCheckedList"])){
            if(!empty($request['searchCheckedList'])) {
                $searchList = $request['searchCheckedList'];
                $searchValue = explode(',', $searchList);
                foreach($searchValue as $check) {
                    $query = $query->orWhere('id','=',$check);
                }
            }
        }

        return $query->where('delete_flag', '=', '0')
            ->orderBy('entrance_date', 'asc')
            ->get();
    }

    public function exportPickupList($request)
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
                    ->orWhere("passport_name", "like", '%'.$textsearch.'%')
                    ->orWhere("phone", "like", '%'.$textsearch.'%')
                    ->orWhere("id_number", "like", '%'.$textsearch.'%')
                    ->orWhere("course", "like", '%'.$textsearch.'%')
                    ->orWhere("camp_name", "like", '%'.$textsearch.'%')
                    ->orWhere("note_for_op", "like", '%'.$textsearch.'%')
                    ->orWhere("receipt_number", "like", '%'.$textsearch.'%')
                    ->orWhere("agent_name", "like", '%'.$textsearch.'%');
            });
        }
        if(array_key_exists("studentStat", $request) && !empty($request["studentStat"])){
            $studStat = $request['studentStat'];
            if($studStat != 0){
                $query = $query->where(function ($query) use ($studStat){
                    $query->where("student_status", "=", $studStat);
                });
            }
        }
        if(array_key_exists("cntCode", $request) && !empty($request["cntCode"])){
            $cntCode= $request['cntCode'];
            if($cntCode != "Others"){
                $query = $query->where(function ($query) use ($cntCode){
                    $query->where("country_code", "=", $cntCode);
                });
            } else {
                $query = $query->where(function ($query) use ($cntCode){
                    $query->where("country_code", "=", "IT")
                        ->orWhere("country_code", "=", "MY")
                        ->orWhere("country_code", "=", "SP")
                        ->orWhere("country_code", "=", "SW")
                        ->orWhere("country_code", "=", "TK")
                        ->orWhere("country_code", "=", "UAE")
                        ->orWhere("country_code", "=", "EN")
                        ->orWhere("country_code", "=", "Others");
                });
            }
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
            if($request["building"] != -1){
                $query = $query->where("building_id", $request['building']);
            }
        }
        if(array_key_exists("building", $request) && !empty($request["building"])){
            if($request["building"] == -1) {
                if(array_key_exists("transferDate", $request) && !empty($request["transferDate"])){
                    if(!empty($request['transferDate'])) {
                        $transferDate = $request['transferDate'];
                        $formattedValue = array_values($transferDate);
                        $query = $query->where("sfc_to_itp", "like", '%'.$formattedValue[2].'%')
                            ->orWhere("itp_to_sfc", "like", '%'.$formattedValue[2].'%');
                    }
                }
            }
            if($request["building"] != -1){
                if($request["building"] == 2) {
                    if(array_key_exists("transferDate", $request) && !empty($request["transferDate"])){
                        if(!empty($request['transferDate'])) {
                            $transferDate = $request['transferDate'];
                            $formattedValue = array_values($transferDate);
                            $query = $query->where("sfc_to_itp", "like", '%'.$formattedValue[2].'%');
                        }
                    }
                } else {
                    if(array_key_exists("transferDate", $request) && !empty($request["transferDate"])){
                        if(!empty($request['transferDate'])) {
                            $transferDate = $request['transferDate'];
                            $formattedValue = array_values($transferDate);
                            $query = $query->where("itp_to_sfc", "like", '%'.$formattedValue[2].'%');
                        }
                    }
                }
            }
        }
        if(array_key_exists("paymentCheck", $request) && !empty($request["paymentCheck"])){
            $query = $query->where("payment_pending",">", 0);
        }
        if(array_key_exists("addDateFrom", $request) && !empty($request["addDateFrom"])){
            if(!empty($request['addDateFrom'])) {
                $addedDate = $request['addDateFrom'];
                $formattedValue = array_values($addedDate);
                $query = $query->where("created_at", ">=", $formattedValue[2]);
            }
        }
        if(array_key_exists("addDateTo", $request) && !empty($request["addDateTo"])){
            if(!empty($request['addDateTo'])) {
                $addedDate = $request['addDateTo'];
                $formattedValue = array_values($addedDate);
                $query = $query->where("created_at", "<=", $formattedValue[2]);
            }
        }
        if(array_key_exists("gradDateFrom", $request) && !empty($request["gradDateFrom"])){
            if(!empty($request['gradDateFrom'])) {
                $gradDate = $request['gradDateFrom'];
                $formattedValue = array_values($gradDate);
                $query = $query->where("graduation_date", ">=", $formattedValue[2]);
            }
        }
        if(array_key_exists("gradDateTo", $request) && !empty($request["gradDateTo"])){
            if(!empty($request['gradDateTo'])) {
                $gradDate = $request['gradDateTo'];
                $formattedValue = array_values($gradDate);
                $query = $query->where("graduation_date", "<=", $formattedValue[2]);
            }
        }
        if(array_key_exists("searchCheckedList", $request) && !empty($request["searchCheckedList"])){
            if(!empty($request['searchCheckedList'])) {
                $searchList = $request['searchCheckedList'];
                $searchValue = explode(',', $searchList);
                foreach($searchValue as $check) {
                    $query = $query->orWhere('id','=',$check);
                }
            }
        }

        return $query->where('delete_flag', '=', '0')
            ->orderBy('arrival_date', 'asc')
            ->orderBy('arrival_time', 'asc')
            ->get();
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

    public function findByInvoiceNo($applyId, $invoiceId)
    {
        return $this->studentApply
            ->where('invoice_number', '=', $invoiceId)
            ->where('id', '=', $applyId)
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
            //->where('id', '=', $key)
            //->where('apply_no', '=', $key)
            ->where('id_number', '=', $key)
            ->first();
    }

    public function getColumns(){
        return $this->studentApply->getConnection()->getSchemaBuilder()->getColumnListing($this->studentApply->getTable());
    }


    public function getGradList($gradFrom,$gradCampus){

        //Graduate within 7 days from $gradFrom
        $gradTo = strtotime("6 days", strtotime($gradFrom));
        $gradTo = date('Y-m-d', $gradTo);
        $query = $this->studentApply;

        if($gradCampus != 3){
            $query = $query->where("building_id", $gradCampus);
        }

        return $query
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
            ->whereIn('student_status', [2,5])
            ->orderBy('graduation_date', 'asc')->get();

    }


    public function getChangeDorm($changeFrom,$changeTo,$campus){
        return $query = $this->studentApply
            ->join('reservations_student_apply', 'student_applies.id', '=', 'reservations_student_apply.student_apply_id')
            ->join('reservations','reservations_student_apply.reservations_id','=','reservations.id')
            ->join('beds', 'reservations.bed_id','=','beds.id')
            ->join('dormitory_rooms','beds.dormitory_room_id','=', 'dormitory_rooms.id')
            ->join('rooms', 'dormitory_rooms.room_id', '=', 'rooms.id')
            ->whereRaw('student_applies.id = reservations_student_apply.student_apply_id')
            ->whereRaw('reservations.date_from > student_applies.checkin_date')
            ->where('reservations.date_from', '>=', $changeFrom)
            ->where('reservations.date_from', '<=', $changeTo)
            ->whereIn('student_status', [2, 5])
            ->where('student_applies.building_id','=', $campus)
            ->orderBy('reservations.date_from', 'asc')
            ->get(array(
                'student_applies.*',
                'reservations.date_from as reservation_checkin',
                'reservations.date_to as reservation_checkout',
                'rooms.type as room_type',
                'beds.name as bed_name',
                'dormitory_rooms.name as current_dormitory_room_name'
            ))->toArray();

    }


    public function getChangeHotel($changeFrom,$changeTo,$campus){
        return $query = $this->studentApply
            ->join('other_reservations','student_applies.id','=','other_reservations.student_id_num')
            ->whereRaw('other_reservations.student_id_num = student_applies.id')
            ->whereRaw('other_reservations.date_from > student_applies.checkin_date')
            ->where(function($query) use ($changeFrom, $changeTo) {
                $query->where(function ($q) use ($changeFrom, $changeTo) {
                    $q->where('other_reservations.date_from', '>=', $changeFrom)
                        ->where('other_reservations.date_from', '<=', $changeTo);
                });
            })
            ->whereIn('student_status', [2,5])
            ->where('student_applies.building_id','=', $campus)
            ->orderBy('other_reservations.date_from', 'asc')
            ->get(array(
                'student_applies.*',
                'other_reservations.date_from as hotel_checkin',
                'other_reservations.date_to as hotel_checkout',
                'other_reservations.accommodation as hotel_accommodation'
            ))->toArray();
    }

    public function getChangeHotels($changeFrom,$changeTo,$campus){
        return $query = $this->studentApply
            ->join('hotels_reservations_student_apply', 'student_applies.id', '=', 'hotels_reservations_student_apply.student_apply_id')
            ->join('hotels_reservations','hotels_reservations_student_apply.hotels_reservations_id','=','hotels_reservations.id')
            ->join('hotels_beds', 'hotels_reservations.hotels_bed_id','=','hotels_beds.id')
            ->join('hotels_rooms','hotels_beds.hotels_room_id','=', 'hotels_rooms.id')
            ->join('rooms', 'hotels_rooms.room_id', '=', 'rooms.id')
            ->whereRaw('student_applies.id = hotels_reservations_student_apply.student_apply_id')
            ->whereRaw('hotels_reservations.date_from > student_applies.checkin_date')
            ->where('hotels_reservations.date_from', '>=', $changeFrom)
            ->where('hotels_reservations.date_from', '<=', $changeTo)
            ->whereIn('student_status', [2, 5])
            ->where('student_applies.building_id','=', $campus)
            ->orderBy('hotels_reservations.date_from', 'asc')
            ->get(array(
                'student_applies.*',
                'hotels_reservations.date_from as reservation_checkin',
                'hotels_reservations.date_to as reservation_checkout',
                'rooms.type as room_type',
                'hotels_beds.name as bed_name',
                'hotels_rooms.name as current_dormitory_room_name'
            ))->toArray();
    }

    public function getChangeWalkins($changeFrom,$changeTo,$campus){
        return $query = $this->studentApply
            ->join('student_apply_walkin_reservations', 'student_applies.id', '=', 'student_apply_walkin_reservations.student_apply_id')
            ->join('walkin_reservations','student_apply_walkin_reservations.walkin_reservations_id','=','walkin_reservations.id')
            ->join('walkin_beds', 'walkin_reservations.walkin_bed_id','=','walkin_beds.id')
            ->join('walkin_rooms','walkin_beds.walkin_room_id','=', 'walkin_rooms.id')
            ->join('rooms', 'walkin_rooms.room_id', '=', 'rooms.id')
            ->whereRaw('student_applies.id = student_apply_walkin_reservations.student_apply_id')
            ->whereRaw('walkin_reservations.date_from > student_applies.checkin_date')
            ->where('walkin_reservations.date_from', '>=', $changeFrom)
            ->where('walkin_reservations.date_from', '<=', $changeTo)
            ->whereIn('student_status', [2, 5])
            ->where('student_applies.building_id','=', $campus)
            ->orderBy('walkin_reservations.date_from', 'asc')
            ->get(array(
                'student_applies.*',
                'walkin_reservations.date_from as reservation_checkin',
                'walkin_reservations.date_to as reservation_checkout',
                'rooms.type as room_type',
                'walkin_beds.name as bed_name',
                'walkin_rooms.name as current_dormitory_room_name'
            ))->toArray();
    }

    public function getChangeCondos($changeFrom,$changeTo,$campus){
        return $query = $this->studentApply
            ->join('condo_reservations_student_apply', 'student_applies.id', '=', 'condo_reservations_student_apply.student_apply_id')
            ->join('condo_reservations','condo_reservations_student_apply.condo_reservations_id','=','condo_reservations.id')
            ->join('condo_beds', 'condo_reservations.condo_bed_id','=','condo_beds.id')
            ->join('condo_rooms','condo_beds.condo_room_id','=', 'condo_rooms.id')
            ->join('rooms', 'condo_rooms.room_id', '=', 'rooms.id')
            ->whereRaw('student_applies.id = condo_reservations_student_apply.student_apply_id')
            ->whereRaw('condo_reservations.date_from > student_applies.checkin_date')
            ->where('condo_reservations.date_from', '>=', $changeFrom)
            ->where('condo_reservations.date_from', '<=', $changeTo)
            ->whereIn('student_status', [2, 5])
            ->where('student_applies.building_id','=', $campus)
            ->orderBy('condo_reservations.date_from', 'asc')
            ->get(array(
                'student_applies.*',
                'condo_reservations.date_from as reservation_checkin',
                'condo_reservations.date_to as reservation_checkout',
                'rooms.type as room_type',
                'condo_beds.name as bed_name',
                'condo_rooms.name as current_dormitory_room_name'
            ))->toArray();
    }

    public function getChangePlan($changePlanFrom,$changePlanTo,$campus) {
        return $query = $this->studentApply
            ->join('courses','student_applies.id','=','courses.student_id')
            ->whereRaw('courses.student_id = student_applies.id')
            ->whereRaw('courses.date_from > student_applies.checkin_date')
            ->where(function($query) use ($changePlanFrom, $changePlanTo) {
                $query->where(function ($q) use ($changePlanFrom, $changePlanTo) {
                    $q->where('courses.date_from', '>=', $changePlanFrom)
                        ->where('courses.date_from', '<=', $changePlanTo);
                });
            })
            ->whereIn('student_status', [5])
            ->where('student_applies.building_id','=', $campus)
            ->orderBy('courses.date_from', 'asc')
            ->get(array(
                'student_applies.*',
                'courses.date_from as course_from',
                'courses.date_to as course_to',
                'courses.bldg_id as course_campus',
                'courses.course_name as course_plan'
            ))->toArray();
    }

    public function getCountPerCountry($countryCode){

        return $this->studentApply
            ->selectRaw('COUNT(student_applies.invoice_number) as count')
            ->where('country_code', '=', $countryCode)
            ->where('invoice_number', '!=', '')
            ->whereNotNull('invoice_number')
            ->first();
    }

    public function getPlanList($countPlanFrom,$countPlanTo,$countPlanCampus,$countCntCode) {

        $query = $this->studentApply;

        if($countCntCode == '1') {
            $query = $query->where("country_code",'!=', 'JP');
        } else {
            $query = $query->where("country_code",'=', 'JP');
        }

        return $query
            ->join('courses','student_applies.id','=','courses.student_id')
            ->whereRaw('courses.student_id = student_applies.id')
            ->whereRaw('courses.date_from >= student_applies.checkin_date')
            ->where(function($query) use ($countPlanFrom, $countPlanTo) {
                $query->where(function ($q) use ($countPlanFrom, $countPlanTo) {
                    $q->where('courses.date_from', '>=', $countPlanFrom)
                        ->where('courses.date_to', '<=', $countPlanTo);
                })->orWhere(function ($q) use ($countPlanFrom, $countPlanTo) {
                    $q->where('courses.date_from', '<=', $countPlanFrom)
                        ->where('courses.date_to', '>=', $countPlanTo);
                });
            })
            ->whereIn('student_status', [2,5])
            ->where('delete_flag', '=', '0')
            ->where('courses.bldg_id', '=' ,$countPlanCampus)
            ->orderBy('courses.date_from', 'asc')
            ->get(array(
                'student_applies.*',
                'courses.date_from as course_from',
                'courses.date_to as course_to',
                'courses.bldg_id as course_campus',
                'courses.course_name as course_plan'
            ))->toArray();

    }

    public function getWeeklyListStudentReport($searchCondition) {

        $query = $this->studentApply;

        if(array_key_exists('status', $searchCondition) && !empty($searchCondition['status'])){
            if($searchCondition['status'] == 256) {
                $query = $query->whereIn('student_status', [2,5,6]);
            } else {
                $query = $query->whereIn('student_status', [10]);
            }
        }

        if(array_key_exists('visitcode', $searchCondition) && !empty($searchCondition['visitcode'])){
            if($searchCondition['visitcode'] == 1) {
                $query = $query->whereIn('visit_id', [1]);
            } else if($searchCondition['visitcode'] == 3) {
                $query = $query->whereIn('visit_id', [3]);
            } else {
                $query = $query->whereIn('visit_id', [2,4,5]);
            }
        }

        if(array_key_exists('nation', $searchCondition) && !empty($searchCondition['nation'])){
            if($searchCondition['nation'] != 'OTHERS') {
                $query = $query->where('country_code', '=', $searchCondition['nation']);
            } else {
                $query = $query->whereNotIn('country_code', ['JP','TW','CN','RU','KR','ARAB','VN','TH','MN']);
            }
        }

        return $query
            ->selectRaw('count(id) as numOfStudents')
            ->where(function($query) use ($searchCondition) {
                $query->where(function ($q) use ($searchCondition) {
                    $q->where('checkin_date', '>=', $searchCondition['weekstart'])
                        ->where('checkout_date', '<=', $searchCondition['weekend']);
                })->orWhere(function ($q) use ($searchCondition) {
                    $q->where('checkin_date', '>=', $searchCondition['weekstart'])
                        ->where('checkin_date', '<=', $searchCondition['weekend']);
                })->orWhere(function ($q) use ($searchCondition) {
                    $q->where('checkout_date', '>=', $searchCondition['weekstart'])
                        ->where('checkout_date', '<=', $searchCondition['weekend']);
                })->orWhere(function ($q) use ($searchCondition) {
                    $q->where('checkin_date', '<=', $searchCondition['weekstart'])
                        ->where('checkout_date', '>=', $searchCondition['weekend']);
                });
            })
            ->where('building_id',$searchCondition['campus'])
            ->where('delete_flag', '=', '0')
            ->first();
    }

    public function getCafeListDorm($cafeFrom,$cafeTo,$cafeCampus,$visitorType) {
        $query = $this->studentApply;
        if(!empty($visitorType)){
            $query = $query->where(function ($query) use ($visitorType){
                $query->where('reservations.visitor_type', '=', $visitorType);
            });
        }
        return $query
            ->join('reservations_student_apply', 'student_applies.id', '=', 'reservations_student_apply.student_apply_id')
            ->join('reservations','reservations_student_apply.reservations_id','=','reservations.id')
            ->join('beds', 'reservations.bed_id','=','beds.id')
            ->join('dormitory_rooms','beds.dormitory_room_id','=', 'dormitory_rooms.id')
            ->join('rooms', 'dormitory_rooms.room_id', '=', 'rooms.id')
            ->whereRaw('student_applies.id = reservations_student_apply.student_apply_id')
            ->whereRaw('reservations.date_from >= student_applies.checkin_date')
            ->where(function($query) use ($cafeFrom, $cafeTo) {
                $query->where(function ($q) use ($cafeFrom, $cafeTo) {
                    $q->where('reservations.date_from', '>=', $cafeFrom)
                        ->where('reservations.date_to', '<=', $cafeTo);
                })->orWhere(function ($q) use ($cafeFrom, $cafeTo) {
                    $q->where('reservations.date_from', '>=', $cafeFrom)
                        ->where('reservations.date_from', '<=', $cafeTo);
                })->orWhere(function ($q) use ($cafeFrom, $cafeTo) {
                    $q->where('reservations.date_to', '>=', $cafeFrom)
                        ->where('reservations.date_to', '<=', $cafeTo);
                })->orWhere(function ($q) use ($cafeFrom, $cafeTo) {
                    $q->where('reservations.date_from', '<=', $cafeFrom)
                        ->where('reservations.date_to', '>=', $cafeTo);
                });
            })
            ->whereIn('student_status', [2,5,6])
            ->where('delete_flag', '=', '0')
            ->where('reservations.building_id', '=' ,$cafeCampus)
            ->orderBy('reservations.date_from', 'asc')
            ->get(array(
                'country_code',
                'reservations.*',
                'student_applies.id  as apply_id'
            ))->toArray();
    }

    public function getCafeListOthers($cafeFrom,$cafeTo,$cafeCampus,$visitorType,$accommodationId) {

        $query = $this->studentApply;
        if(!empty($visitorType)){
            $query = $query->where(function ($query) use ($visitorType){
                $query->where('other_reservations.visitor_type', '=', $visitorType);
            });
        }

        if(!empty($accommodationId)){
            $query = $query->where(function ($query) use ($accommodationId){
                $query->where('other_reservations.accommodation_id', '=', $accommodationId);
            });
        }

        return $query
            ->join('other_reservations','student_applies.id','=','other_reservations.student_id_num')
            ->whereRaw('other_reservations.student_id_num = student_applies.id')
            ->whereRaw('other_reservations.date_from >= student_applies.checkin_date')
            ->where(function($query) use ($cafeFrom, $cafeTo) {
                $query->where(function ($q) use ($cafeFrom, $cafeTo) {
                    $q->where('other_reservations.date_from', '>=', $cafeFrom)
                        ->where('other_reservations.date_to', '<=', $cafeTo);
                })->orWhere(function ($q) use ($cafeFrom, $cafeTo) {
                    $q->where('other_reservations.date_from', '>=', $cafeFrom)
                        ->where('other_reservations.date_from', '<=', $cafeTo);
                })->orWhere(function ($q) use ($cafeFrom, $cafeTo) {
                    $q->where('other_reservations.date_to', '>=', $cafeFrom)
                        ->where('other_reservations.date_to', '<=', $cafeTo);
                })->orWhere(function ($q) use ($cafeFrom, $cafeTo) {
                    $q->where('other_reservations.date_from', '<=', $cafeFrom)
                        ->where('other_reservations.date_to', '>=', $cafeTo);
                });
            })
            ->whereIn('student_status', [2,5,6])
            ->where('delete_flag', '=', '0')
            ->where('other_reservations.building_id', '=' ,$cafeCampus)
            ->orderBy('other_reservations.date_from', 'asc')
            ->get(array(
                'country_code',
                'other_reservations.*'
            ))->toArray();
    }

    public function getSumOfStudents($date){
        $query = $this->studentApply;
        return $query
            ->selectRaw('count(student_applies.id) as totalSumOfStudents')
            ->where('created_at', 'like', '%'.$date.'%')
            ->where('visit_id', '=', 1)
            ->whereIn('student_status', [2,5,6,9])
            ->first();
    }

    public function getSumOfStudentsWeek($date){
        $query = $this->studentApply;
        return $query
            ->selectRaw('sum(student_applies.term) as totalSumOfWeeks')
            ->where('created_at', 'like', '%'.$date.'%')
            ->where('visit_id', '=', 1)
            ->whereIn('student_status', [2,5,6,9])
            ->first();
    }

    public function getSalesReportStudents($date,$country,$agent) {

        $query = $this->studentApply;
        if(!empty($agent)){
            if($agent == 2) {
                $query = $query->where(function ($query) use ($agent){
                    $query->where('agent_name', '!=', 'QQ');
                });
            } else if($agent == 1) {
                $query = $query->where(function ($query) use ($agent){
                    $query->where('agent_name', '=', 'QQ');
                });
            }
        }

        if(!empty($country)) {
            if($country == 'Others') {
                $query = $query->where(function ($query) use ($country){
                    $query->whereNotIn('country_code', ['JP','TW','KR','CN','RU','VN','ARAB','TH','MN']);
                });
            } else {
                $query = $query->where(function ($query) use ($country){
                    $query->where('country_code', '=', $country);
                });
            }
        }

        return $query
            ->selectRaw('count(student_applies.id) as numOfStudents')
            ->where('created_at', 'like', '%'.$date.'%')
            ->where('visit_id', '=', 1)
            ->whereIn('student_status', [2,5,6,9])
            ->first();
    }

    public function getSalesReportStudentWeeks($date,$country,$agent) {

        $query = $this->studentApply;
        if(!empty($agent)){
            if($agent == 2) {
                $query = $query->where(function ($query) use ($agent){
                    $query->where('agent_name', '!=', 'QQ');
                });
            } else if($agent == 1){
                $query = $query->where(function ($query) use ($agent){
                    $query->where('agent_name', '=', 'QQ');
                });
            }
        }

        if(!empty($country)) {
            if($country == 'Others') {
                $query = $query->where(function ($query) use ($country){
                    $query->whereNotIn('country_code', ['JP','TW','KR','CN','RU','VN','ARAB','TH','MN']);
                });
            } else {
                $query = $query->where(function ($query) use ($country){
                    $query->where('country_code', '=', $country);
                });
            }
        }

        return $query
            ->selectRaw('sum(student_applies.term) as numOfWeeks')
            ->where('created_at', 'like', '%'.$date.'%')
            ->where('visit_id', '=', 1)
            ->whereIn('student_status', [2,5,6,9])
            ->first();
    }

    public function getAgenciesCamps($campFrom,$campTo,$campus,$visitId){

        $query = $this->studentApply;
        return $query
            ->selectRaw('student_status, count(student_applies.student_status) as countStatus')
            ->selectRaw('checkin_date, count(student_applies.checkin_date) as countCheckindate')
            ->selectRaw('checkout_date, count(student_applies.checkout_date) as countCheckoutdate')
            ->selectRaw('camp_name, count(student_applies.camp_name) as countCamp')
            ->selectRaw('country_code')
            ->selectRaw('campus')
            ->where('delete_flag', '=', '0')
            ->where('visit_id', '=', $visitId)
            ->where('building_id', '=', $campus)
            ->whereNotNull('agent_name')
            ->where('agent_name','!=' ,'')
            ->whereNotNull('camp_name')
            ->where('camp_name','!=' ,'')
            ->whereIn('student_status', [1,2,5,6,10])
            ->where(function($query) use ($campFrom, $campTo) {
                $query->where(function ($q) use ($campFrom, $campTo) {
                    $q->where('checkin_date', '>=', $campFrom)
                        ->where('checkout_date', '<=', $campTo);
                })->orWhere(function ($q) use ($campFrom, $campTo) {
                    $q->where('checkin_date', '>=', $campFrom)
                        ->where('checkin_date', '<=', $campTo);
                })->orWhere(function ($q) use ($campFrom, $campTo) {
                    $q->where('checkout_date', '>=', $campFrom)
                        ->where('checkout_date', '<=', $campTo);
                })->orWhere(function ($q) use ($campFrom, $campTo) {
                    $q->where('checkin_date', '<=', $campFrom)
                        ->where('checkout_date', '>=', $campTo);
                });
            })
            ->groupBy('campus')
            ->groupBy('country_code')
            ->groupBy('student_status')
            ->groupBy('checkin_date')
            ->groupBy('checkout_date')
            ->groupBy('camp_name')
            ->orderBy('campus', 'desc')
            ->get();
    }

    public function getTotalNumberOfTermsPerMonthPerNation($searchCondition) {
        $query = $this->studentApply;
        if(array_key_exists('agent', $searchCondition) && !empty($searchCondition['agent'])){
            if($searchCondition['agent'] == 1) {
                $query = $query->where('agent_name', '=', 'QQ');
            } else {
                $query =  $query->where('agent_name', '!=', 'QQ');
            }
        }
        if(array_key_exists('nation', $searchCondition) && !empty($searchCondition['nation'])){
            if($searchCondition['nation'] != 'OTHERS') {
                $query = $query->where('country_code', '=', $searchCondition['nation']);
            } else {
                $query =  $query->whereNotIn('country_code', ['JP','TW','CN','TH','RU','KR','ARAB','VN','MN']);
            }
        }
        return $query
            //->selectRaw('sum(term) as totalNumberOfTerms')
            ->selectRaw('count(id) as totalNumberOfTerms')
            //->where('checkin_date', 'like', $searchCondition['yearmonth'].'%')
            ->where(function ($query) use ($searchCondition){
                $query->where(function ($q) use ($searchCondition) {
                    $q->where('entrance_date', '>=', $searchCondition['monthstart'])
                        ->where('graduation_date', '<=', $searchCondition['monthend']);
                })->orWhere(function ($q) use ($searchCondition) {
                    $q->where('entrance_date', '>=', $searchCondition['monthstart'])
                        ->where('entrance_date', '<=', $searchCondition['monthend']);
                })->orWhere(function ($q) use ($searchCondition) {
                    $q->where('graduation_date', '>=', $searchCondition['monthstart'])
                        ->where('graduation_date', '<=', $searchCondition['monthend']);
                })->orWhere(function ($q) use ($searchCondition) {
                    $q->where('entrance_date', '<=', $searchCondition['monthstart'])
                        ->where('graduation_date', '>=', $searchCondition['monthend']);
                });
            })
            ->where('delete_flag', '=', '0')
            ->whereIn('visit_id', [1])
            ->whereNotIn('student_status', [4,10])
            ->first();
    }

    public function getTotalNumberOfStudentsPerWeek($searchCondition) {
        $query = $this->studentApply;

        return $query
            ->selectRaw('count(id) as totalNumberOfStudents')
            ->where(function ($query) use ($searchCondition){
                $query->where(function($query) use($searchCondition){
                    $query->where('checkin_date', '>=', $searchCondition['checkin_date'])
                        ->where('checkin_date', '<', $searchCondition['checkout_date']);
                })->orWhere(function ($query)  use ($searchCondition) {
                    $query->where('checkout_date', '>', $searchCondition['checkin_date'])
                        ->where('checkout_date', '<=', $searchCondition['checkout_date']);
                })->orWhere(function ($query)  use ($searchCondition) {
                    $query->where('checkin_date', '<', $searchCondition['checkin_date'])
                        ->where('checkout_date', '>', $searchCondition['checkout_date']);
                });
            })
            ->where('building_id',$searchCondition['building_id'])
            ->where('delete_flag', '=', '0')
            ->whereIn('visit_id', [1])
            ->whereNotIn('student_status', [4,9])
            ->first();

    }

    public function getTotalNumberOfTransferStudentsPerWeek($searchCondition) {
        $query = $this->studentApply;
        return $query
            ->selectRaw('count('.$searchCondition['transfer_to'].') as totalNumberOfStudents')
            ->where(function ($query) use ($searchCondition){
                $query->where(function($query) use($searchCondition){
                    $query->where($searchCondition['transfer_to'], '>=', $searchCondition['checkin_date'])
                        ->where($searchCondition['transfer_to'], '<', $searchCondition['checkout_date']);
                })->orWhere(function ($query)  use ($searchCondition) {
                    $query->where('checkout_date', '>', $searchCondition['checkin_date'])
                        ->where('checkout_date', '<=', $searchCondition['checkout_date']);
                })->orWhere(function ($query)  use ($searchCondition) {
                    $query->where($searchCondition['transfer_to'], '<', $searchCondition['checkin_date'])
                        ->where('checkout_date', '>', $searchCondition['checkout_date']);
                });
            })
            ->where('building_id',$searchCondition['building_id'])
            ->where('delete_flag', '=', '0')
            ->whereIn('visit_id', [1])
            ->whereNotIn('student_status', [4,9])
            ->first();

    }

}