<?php
/**
 * Created by PhpStorm.
 * User: DELL
 * Date: 4/11/2017
 * Time: 1:56 PM
 */

namespace App\Http\Controllers;
//require __DIR__  . '/../../../vendor/paypal-php-sdk/autoload.php';

use App\Http\Requests\ApplyRequest;
use App\Repositories\Beds\BedsInterface;
use App\Repositories\HotelReservations\HotelReservationsInterface;
use App\Repositories\Buildings\BuildingsInterface;
use App\Repositories\ChangeLog\ChangeLogInterface;
use App\Repositories\DormitoryRooms\DormitoryRoomsInterface;
use App\Repositories\HotelStatuses\HotelStatusesInterface;
use App\Repositories\Nationalities\NationalitiesInterface;
use App\Repositories\Payments\PaymentsInterface;
use App\Repositories\Reservations\ReservationsInterface;
use App\Repositories\ReservationStatuses\ReservationStatusesInterface;
use App\Repositories\Rooms\RoomsInterface;
use App\Repositories\StudentApply\StudentApplyInterface;
use App\Repositories\Users\UsersInterface;
use App\Repositories\InvoiceDiscount\InvoiceDiscountInterface;
use DateTime;
use Exception;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use App\GlobalFunctions;
use Illuminate\Support\Facades\Storage;
class StudentApplyController extends Controller
{
    private $studentApplyService;
    private $userService;
    private $permissions;
    private $bedsService;
    private $dormitoryRoomsService;
    private $reservationStatusService;
    private $roomService;
    private $reservationService;
    private $nationalityService;
    private $buildingService;
    private $hotelStatusService;
    private $changeLogService;
    private $invoiceDiscountService;
    private $hotelReservationsService;
    private $paymentsService;

    public function __construct(StudentApplyInterface $studentApplyInterface, NationalitiesInterface $nationalitiesInterface, ReservationsInterface $reservationsInterface,
                                BuildingsInterface $buildingsInterface, ReservationStatusesInterface $reservationStatusesInterface,
                                RoomsInterface $roomsService, BedsInterface $bedsService, DormitoryRoomsInterface $dormitoryRoomsService,
                                HotelStatusesInterface $hotelStatusesInterface, UsersInterface $usersInterface, ChangeLogInterface $changeLogInterface,
                                InvoiceDiscountInterface $invoiceDiscountInterface,HotelReservationsInterface $hotelReservationsService,
                                PaymentsInterface $paymentsService)
    {
        $this->studentApplyService = $studentApplyInterface;
        $this->nationalityService = $nationalitiesInterface;
        $this->reservationService = $reservationsInterface;
        $this->buildingService = $buildingsInterface;
        $this->reservationStatusService = $reservationStatusesInterface;
        $this->roomService = $roomsService;
        $this->bedsService = $bedsService;
        $this->dormitoryRoomsService = $dormitoryRoomsService;
        $this->hotelStatusService = $hotelStatusesInterface;
        $this->userService = $usersInterface;
        $this->changeLogService = $changeLogInterface;
        $this->invoiceDiscountService = $invoiceDiscountInterface;
        $this->hotelReservationsService = $hotelReservationsService;
        $this->paymentsService = $paymentsService;
        $this->permissions = config('constants.permissions');
    }

    public function search(ApplyRequest $request)
    {
        $data = $request->all();
        $list = $this->studentApplyService->search($data);
        $dataReturn = array(
            "list" => $list,
        );
        return response()->json($dataReturn);
    }

    public function show($id)
    {
        $studentApply = $this->studentApplyService->findById($id);
        return response()->json($studentApply);
    }

    public function findLog($id)
    {
        $changeLogList = $this->changeLogService->findById($id);
        return response()->json($changeLogList);
    }

    public function findApplyInvoice($id)
    {
        $applyInvoice = $this->studentApplyService->findByInvoiceNo($id);
        return response()->json($applyInvoice);
    }

    public function findInvoiceDiscountList($id)
    {
        $invoiceDiscount = $this->invoiceDiscountService->findByInvoiceNo($id);
        return response()->json($invoiceDiscount);
    }

    public function update(ApplyRequest $request, $id)
    {
        $data = $request->all();
        if($data['birthday']){
            $data['age'] = GlobalFunctions::calculateAge($data['birthday']);
        }
        $apply = $this->studentApplyService->findById($id);
        $apply->update($data);
        return response()->json(["message" => "update_successfully", "data" => $apply]);
    }

    private function getMapKeyForRoomBed($item)
    {
        return $item["building_id"] . "_" . $item["room_id"] . "_" . $item["gender"];
    }

    public function getRemainingTotalNumbersPerRoomType($dateFrom, $campus)
    {
//        genarate all room bad group by building and room type and gender
        $totalRoomBedList = $this->bedsService->getTotalRoomTypeBed($campus);
        $RoomBedMap = array();
        foreach ($totalRoomBedList as $item) {
            $key = $this->getMapKeyForRoomBed($item);
            $RoomBedMap[$key] = $item;
        }

//        generate all week map for 12 weeks.
        $weekMap = array();
        $startDate = $dateFrom;
//        notice!!! we need to clone new $RoomBedMap to use it in blow loop
        $RoomBedMapStr = serialize($RoomBedMap);
        for ($i = 0; $i <= 4 * 3; $i++) {
            $startWeekEnd = strtotime("next sunday, 12pm", strtotime($startDate));
            $endWeekEnd = strtotime("next sunday, 12pm", $startWeekEnd);
            $startDate = date("Y-m-d", $startWeekEnd);
            $weekMap[$startDate] = array("start" => $startWeekEnd, "end" => $endWeekEnd, "roomList" => unserialize($RoomBedMapStr));
        }

//        query all reservation for the hole 12 weeks.
        $listKey = array_keys($weekMap);
        $firstWeek = $weekMap[$listKey[0]];
        $lastWeek = $weekMap[$listKey[count($listKey) - 1]];
        $startTime = $firstWeek["start"];
        $endTime = $lastWeek["end"];
        $listReservation = $this->reservationService->searchReserved(array(
            "checkin_date" => date("Y-m-d", $startTime),
            "checkout_date" => date("Y-m-d", $endTime),
            "building_id" => $campus));
        foreach ($listReservation as $item) {
            $dateFrom = $item["date_from"];
            $dateTo = $item["date_to"];
            $key = $this->getMapKeyForRoomBed(array(
                "building_id" => $item["campus"],
                "room_id" => $item["room_id"],
                "gender" => $item["gender"]));

            $checkinWeek = strtotime("last sunday, 12pm", strtotime($dateFrom));
            $weekDayFrom = date('w', strtotime($dateFrom));
            if ($weekDayFrom == 0) {
                $checkinWeek = strtotime("sunday, 12pm", strtotime($dateFrom));
            }

            $checkoutWeek = strtotime("last sunday, 12pm", strtotime($dateTo));
            $weekDayTo = date('w', strtotime($dateTo));
            if ($weekDayTo == 0) {
                $checkoutWeek = strtotime("sunday, 12pm", strtotime($dateTo));
            }
//            reduce down room by room reservation
            while ($checkinWeek <= $checkoutWeek) {
                $startDate = date("Y-m-d", $checkinWeek);
                if (array_key_exists($startDate, $weekMap)) {
                    $weekArray = $weekMap[$startDate];
                    $total = $weekArray["roomList"][$key]["total"] - 1;
                    $weekArray["roomList"][$key]["total"] = $total;
                    $weekMap[$startDate] = $weekArray;
                }
                $checkinWeek = strtotime("next sunday, 12pm", $checkinWeek);
            }
        }
        $i = 0;
        $fourWeekHeader = array();
        $fourWeekBody = array();
        $fourWeekMap = array();
        foreach ($weekMap as $key => $item) {
            $fourWeekHeader[] = $key;
            $fourWeekBody[] = $item;
            $i++;
            if ($i % 12 == 0) {
                $fourWeekMap[] = array("weekday" => $fourWeekHeader, "weekcontent" => $fourWeekBody);
                $fourWeekHeader = array();
                $fourWeekBody = array();
            }

        }

        return response()->json(array("roomTypeKeyList" => array_keys($RoomBedMap), "roomTypeList" => $RoomBedMap, "fourWeekList" => $fourWeekMap));
    }

    public function calculateAvailRooms($roomsTotal, $countOccupiedRooms)
    {
        return floor($roomsTotal - $countOccupiedRooms);
    }

    public function createInvoiceDiscount($discount,$reason,$invoiceNumber)
    {
        $user = \Request::get('user');
        $today=date("Y-m-d h:i:s");
        //print($discount);exit;
        $invoiceArray = array(
            "student_invoice_no" => $invoiceNumber,
            "discount" => $discount,
            "who_discounted" => $user['email'],
            "reason" => urldecode($reason),
            "created_at" => $today,
            "updated_at" => $today
        );
        $invoice = $this->invoiceDiscountService->create($invoiceArray);
        return response()->json(["message" => "created_successfully", "data" => $invoice]);
    }

    public function deleteInvoiceDiscount($id,$invoiceNumber,$discountAmount)
    {
        $apply = $this->studentApplyService->findByInvoiceNo($invoiceNumber);
        $currentDiscount = $apply['discount'] - $discountAmount;
        $apply->update(array("discount" => $currentDiscount));
        $deleteInvoice = $this->invoiceDiscountService->remove($id);
        return response()->json(["message" => "discount_deleted_successfully", "data" => $deleteInvoice]);
    }

    public function updateApplyDiscount($applyId,$totalInvoice)
    {
        $apply = $this->studentApplyService->findById($applyId);
        $apply->update(array("discount" => $totalInvoice));
        return response()->json(["message" => "apply_discount_update_successfully", "data" => $apply]);
    }

    public function updateApplyCommission($applyId,$commission)
    {
        $apply = $this->studentApplyService->findById($applyId);
        $apply->update(array("commission" => $commission));
        return response()->json(["message" => "apply_commission_update_successfully", "data" => $apply]);
    }

    public function bookingRoom($dormBldg, $accommodationId, $roomId, $checkIn, $checkOut, $applyId)
    {
        $apply = $this->studentApplyService->findById($applyId);
        if($accommodationId != 2 && $accommodationId != 3){
            $bed = $this->bedsService->findById($roomId);
            $dormitoryRoom = $this->dormitoryRoomsService->getDormitoryRoomById($bed["dormitory_room_id"]);
            $dormRoomId = $this->getRoomId($accommodationId, $dormitoryRoom->room_id);
            $this->saveOrUpdateRoomReservation($apply, $roomId, $checkIn, $checkOut);
            $apply->update(array("dormitory_room_name" => $dormitoryRoom->name));
            $apply->update(array("room_id1" => $dormRoomId));
            $apply->update(array("dormitory_room_id" => $bed->id));
            $saveFile = null;
        } else {
            $today = date("Y-m-d H:i:s");
            $user = \Request::get('user');
            $fileArray = array(
                "student_id_num" => $applyId,
                "checkin_date" => $checkIn,
                "checkout_date" => $checkOut,
                "accommodation" => $accommodationId==2?'Zelenity Hotel':'Waterfront Hotel',
                "created_at" => $today,
                "updated_by" => $user['name'],
                "updated_at" => $today
            );
            $saveFile = $this->hotelReservationsService->create($fileArray);
        }

        $apply->update(array("campus" => $dormBldg==1?"ITP":"SFC"));
        $apply->update(array("building_id" => $dormBldg));
        $apply->update(array("accommodation_id1" => $accommodationId));

        return response()->json(["message" => "update_successfully", "data" => $apply, "hotelbooking" => $saveFile]);
    }

    private function saveOrUpdateRoomReservation($apply, $dormitoryRoomId, $checkIn, $checkOut)
    {
        // remove to allow multiple bookings
        //$listResv = $apply->dormitoryRoomReservationList();
        //$listResv->delete(); // remove reservations
        //$listResv->detach(); // remove reservations_student_apply

        //Find nationality of student
        $studentNationality = $apply['country_code'];
        $listNationality = $this->nationalityService->all();
        $nationalityId = 17;//default other flag
        foreach ($listNationality as $nat) {
            if (strtolower($nat["nation_code"]) == strtolower($studentNationality)) {
                $nationalityId = $nat["id"];
            }
        }

        $user = \Request::get('user');
        $dataArray = array(
            "bed_id" => $dormitoryRoomId,
            "date_from" => $checkIn,
            "date_to" => $checkOut,
            "reservation_status_id" => 3,
            "memo" => $apply['student_name'] . '/' . ($apply['sex'] === 1 ? 'Male' : 'Female'),
            "nationality_id" => $nationalityId,
            "created_user" => $user['id'],
            "updated_user" => $user['id']
        );
        $result = $this->reservationService->create($dataArray);
        $apply->dormitoryRoomReservationList()->save($result);
        return $result;
    }

    public function retrieveRoomList($accommodationId,$dormBldg,$dormRoomType,$checkInDate,$checkOutDate,$applyId)
    {
        $apply = $this->studentApplyService->findById($applyId);
        $availBedList = $this->bedsService->getListBedsByFilterForStudentApply($accommodationId,$dormBldg,$apply['sex'],$dormRoomType);//filter by gender, room_type, building(it/sf)
        $listResv = $this->reservationService->searchDormitoryReserved($dormBldg,$checkInDate,$checkOutDate,$apply);
        $mapResv = array();
        foreach ($listResv as $resv) {
            $mapResv[$resv["bed_id"]] = $resv;
        }
        $filterBedList = array();
        foreach ($availBedList as $item) {
            if (!array_key_exists($item['id'], $mapResv)) {
                $filterBedList[] = $item;
            }
        }
        return response()->json($filterBedList);
    }

    public function findReservedRoomsList($applyId){

        $reservedRoom = $this->reservationService->findRoomsByApplyId($applyId);
        return response()->json($reservedRoom);
    }

    public function deleteReservedRoom($reservationId,$applyId){
        $apply = $this->studentApplyService->findById($applyId);
        // remove $applyId from reservations
        $removeRsev = $this->reservationService->findById($reservationId);
        $removeRsev->delete();
        // remove $reservationId from reservations_student_apply
        $listResv = $apply->dormitoryRoomReservationList();
        $listResv->detach($reservationId);
        return response()->json(["message" => "room_reservations_deleted_successfully"]);
    }

    public function destroy($id)
    {
        $apply = $this->studentApplyService->findById($id);
        $apply->delete();
        return response()->json(["message" => "deleted_successfully", "data" => $id]);

    }

    public function findReservedHotelsList($applyId){

        $reservedHotels = $this->hotelReservationsService->findByStudentId($applyId);
        return response()->json($reservedHotels);
    }

    public function uploadHotelFile($hotelBookId, Request $request){
        $today = date("Y-m-d H:i:s");
        $user = \Request::get('user');
        $fileName = $hotelBookId.'_'.$request->file('hotelbookingfile')->getClientOriginalName();
        $fileSize = $request->file('hotelbookingfile')->getSize() / 1024;
        $request->file('hotelbookingfile')->move(storage_path('bookings/') , $fileName);

        //find file in the database
        $files = $this->hotelReservationsService->findByHotelBookingId($hotelBookId);

        // update new file in the database
        $files->update(array("filename" => $fileName));
        $files->update(array("filesize" => $fileSize));
        $files->update(array("updated_by" => $user['name']));
        $files->update(array("updated_at" => $today));

        return response()->json(array(
            "message" => "upload_successfully",
            "storage" => storage_path('bookings\\') . $fileName
        ));
    }

    public function downloadHotelFile($hotelBookId){
        $files = $this->hotelReservationsService->findByHotelBookingId($hotelBookId);
        $file= storage_path('bookings/').$files['filename'];
        $headers = array('Content-Type: application/pdf',);
        return response()->download($file, $files['filename'], $headers);
    }

    public function deleteReservedHotel($hotelBookingId){
        // remove $applyId from reservations
        $removeHotel = $this->hotelReservationsService->remove($hotelBookingId);
        return response()->json(["message" => "room_reservations_deleted_successfully","data" => $removeHotel]);
    }

    public function import(Request $request)
    {
        $file = $request->file('studentimport');
        $statusCodes = config('constants.status_code');

        $user = \Request::get('user');
        $userPermissions = $this->userService->getUserPermission($user['id']);
        if (in_array($this->permissions['DAT_IMPORT'], $userPermissions)) {
            if (!empty($file)) {
                $fileType = explode('/', $file->getClientMimeType())[1];
                if (
                    !in_array($fileType, config('constants.acceptable_import_file')) ||
                    !in_array($file->getClientOriginalExtension(), config('constants.acceptable_import_file'))
                ) {
                    return response()->json(array(
                        "errors" => [config('errorcodes.student_apply.file_type_invalid.key')]
                    ), config('constants.status_code.bad_request'));
                }
                $firstSheet = Excel::load($file->getRealPath())->get()->first();

                $records = $firstSheet->toArray();
                $records[0];//Header
                $dbcols = $this->studentApplyService->getColumns();

                $index = 2;
                $okayRecord = array();
                $arrayError = array();
                $user = \Request::get('user');
                $today = date("Y-m-d H:i:s");
                $schoolList = $this->buildingService->all();
                $roomList = $this->roomService->all();
                $dormList = $this->dormitoryRoomsService->all();

                //DORMS
                $mapDorm = array();
                foreach ($dormList as $dorm) {
                    $mapDorm[$dorm["name"]] = $dorm;
                }

                //SCHOOLS
                $mapSchool = array();
                foreach ($schoolList as $school) {
                    $mapSchool[$school["code"]] = $school;
                }

                //ROOMS
                $mapRoom = array();
                foreach ($roomList as $rooms) {
                    $mapRoom[$rooms["type"]] = $rooms;
                }

                foreach ($records as $record) {

                    if (strtolower($record['status']) == 'new') {
                        $record["student_status"] = '1';
                    } else if (strtolower($record["status"]) == 'reserved') {
                        $record["student_status"] = '2';
                    } else if (strtolower($record["status"]) == 'paid') {
                        $record["student_status"] = '3';
                    } else if (strtolower($record["status"]) == 'cancel' || strtolower($record["status"]) == 'cancell') {
                        $record["student_status"] = '4';
                    } else if (strtolower($record["status"]) == 'present') {
                        $record["student_status"] = '5';
                    } else if (strtolower($record["status"]) == 'graduation' || strtolower($record["status"]) == 'graduate') {
                        $record["student_status"] = '6';
                    } else if (strtolower($record["status"]) == 'sample invoice') {
                        $record["student_status"] = '7';
                    } else if (strtolower($record["status"]) == 'arrange') {
                        $record["student_status"] = '8';
                    } else {
                        $record["student_status"] = '-1';
                    }
                    unset($record["status"]);

                    $record["student_name"] = $record["name"];
                    unset($record["name"]);

                    $record["created_at"] = (date('Y-m-d H:i:s', strtotime($record['add_date'])));
                    unset($record["add_date"]);

                    $record["agent_name"] = $record["agency"];
                    unset($record["agency"]);

                    $record["checkin_date"] = (new DateTime(substr($record['check_in'], 0, 10)))->format('Y-m-d H:i:s');
                    unset($record["check_in"]);

                    $record["checkout_date"] = (new DateTime(substr($record['check_out'], 0, 10)))->format('Y-m-d H:i:s');
                    unset($record["check_out"]);

                    $record["entrance_date"] = (new DateTime(substr($record['start_date'], 0, 10)))->format('Y-m-d H:i:s');
                    unset($record["start_date"]);

                    $record["graduation_date"] = (new DateTime(substr($record['graduation_date'], 0, 10)))->format('Y-m-d H:i:s');
                    $record["arrival_date"] = (date('Y-m-d H:i:s', strtotime($record["checkin_date"])));
                    $record["arrival_time"] = (date('Y-m-d H:i:s', strtotime($record['arrival_time'])));

                    $record["term"] = $record["week"];
                    unset($record["week"]);

                    $record["options_pickup"] = $record["pick_up_options"];
                    $record["options_meals"] = $record["meals_options"];
                    $record["autumn_campaign"] = $record["autum_campaine"];

                    $record["dormitory_room_name"] = $record["dorm"];
                    unset($record["dorm"]);

                    $record["english_skill"] = $record["english_level"];
                    unset($record["english_level"]);

                    $record["life_overseas"] = $record["experience_of_abroad"];
                    unset($record["experience_of_abroad"]);

                    $record["options_beginner_option"] = $record["begginer_support_option"];
                    $record["options_island_hopping"] = $record["island_hopping"];
                    $record["options_oslob"] = $record["oslob_tour"];

                    $record["birthday"] = (new DateTime(substr($record['date_of_birth'], 0, 10)))->format('Y-m-d H:i:s');
                    unset($record["date_of_birth"]);

                    $record["phone"] = $record["tel"];
                    unset($record["tel"]);

                    $record["email"] = $record["e_mail"];
                    unset($record["e_mail"]);

                    $record["job"] = $record["occupation"];
                    unset($record["occupation"]);

                    $record["email_family"] = $record["e_mail_for_family"];
                    unset($record["e_mail_for_family"]);

                    $record["how_know_qqe"] = $record["how_to_know_about_qqe"];
                    unset($record["how_to_know_about_qqe"]);

                    $record["campaign_code"] = $record["promo_code"];
                    unset($record["promo_code"]);

                    $record["memo"] = $record["remarks"];
                    unset($record["remarks"]);

                    $record["total_cost"] = $record["total"];
                    unset($record["total"]);

                    $record["ssp_fee_php"] = $record["ssp"];
                    unset($record["ssp"]);

                    $record["electrical_fee_php"] = $record["electricity_fee"];
                    unset($record["electricity_fee"]);

                    $record["i_card_cost"] = $record["i_card"];
                    unset($record["i_card"]);

                    //room
                    $roomTypeList = array("SINGLE" => "single", "TWIN" => "twin", "TRIPLE" => "triple", "QUAD" => "quad", "HEX" => "hex",
                        "Z-SINGLE" => "single", "Z-TWIN" => "twin", "Z-TRIPLE" => "triple", "Z-THIRD" => "triple",
                        "WF-SINGLE" => "single", "WF-TWIN" => "twin", "WF-TRIPLE" => "triple", "WF-THIRD" => "triple",
                        "EX-SINGLE" => "single", "EX-TWIN" => "twin", "EX-TRIPLE" => "triple", "EX-THIRD" => "triple",
                        "DX-SINGLE" => "single", "DX-TWIN" => "twin", "DX-TRIPLE" => "triple", "DX-THIRD" => "triple",
                        "" => "single", "WALK IN" => "single", "WALK-IN" => "single", "WHITE HOUSE" => "single");
                    $roomTypeOnly = $roomTypeList[strtoupper($record["room_type"])];
                    $record["room_id1"] = $mapRoom[strtolower($roomTypeOnly)]["id"];

                    //accommodation based on room_type
                    $accommodationList = array("SINGLE" => "1", "TWIN" => "1", "TRIPLE" => "1", "QUAD" => "1", "HEX" => "1",
                        "Z-SINGLE" => "2", "Z-TWIN" => "2", "Z-TRIPLE" => "2", "Z-THIRD" => "2",
                        "WF-SINGLE" => "3", "WF-TWIN" => "3", "WF-TRIPLE" => "3", "WF-THIRD" => "3",
                        "EX-SINGLE" => "5", "EX-TWIN" => "5", "EX-TRIPLE" => "5", "EX-THIRD" => "5",
                        "DX-SINGLE" => "6", "DX-TWIN" => "6", "DX-TRIPLE" => "6", "DX-THIRD" => "6",
                        "" => "1", "WALK IN" => "7", "WALK-IN" => "7", "WHITE HOUSE" => "7");
                    $record["accommodation_id1"] = $accommodationList[strtoupper($record["room_type"])];
                    unset($record["room_type"]);

                    //country_code field
                    $record["country_code"] = strtoupper($record["nationality"]);
                    if (strtolower($record["nationality"]) == 'cn') {
                        $record["country_code"] = 'CH';
                    } else if (strtolower($record["nationality"]) == 'vietnam') {
                        $record["country_code"] = 'VT';
                    } else if (strtolower($record["nationality"]) == 'rus') {
                        $record["country_code"] = 'RU';
                    }

                    //nationality field
                    if (strtolower($record["nationality"]) == 'it') {
                        $record["nationality"] = 'Italy';
                    } else if (strtolower($record["nationality"]) == 'bh') {
                        $record["nationality"] = 'Bahrain';
                    } else if (strtolower($record["nationality"]) == 'br') {
                        $record["nationality"] = 'Brazil';
                    } else if (strtolower($record["nationality"]) == 'ch' ||
                        strtolower($record["nationality"]) == 'cn'
                    ) {
                        $record["nationality"] = 'China';
                    } else if (strtolower($record["nationality"]) == 'ir') {
                        $record["nationality"] = 'Iran';
                    } else if (strtolower($record["nationality"]) == 'jp') {
                        $record["nationality"] = 'Japan';
                    } else if (strtolower($record["nationality"]) == 'kr') {
                        $record["nationality"] = 'Korea';
                    } else if (strtolower($record["nationality"]) == 'my') {
                        $record["nationality"] = 'Myanmar';
                    } else if (strtolower($record["nationality"]) == 'ru' ||
                        strtolower($record["nationality"]) == 'rus'
                    ) {
                        $record["nationality"] = 'Russia';
                    } else if (strtolower($record["nationality"]) == 'sau') {
                        $record["nationality"] = 'Saudi Arabia';
                    } else if (strtolower($record["nationality"]) == 'sp') {
                        $record["nationality"] = 'Spain';
                    } else if (strtolower($record["nationality"]) == 'sw') {
                        $record["nationality"] = 'Switzerland';
                    } else if (strtolower($record["nationality"]) == 'tw') {
                        $record["nationality"] = 'Taiwan';
                    } else if (strtolower($record["nationality"]) == 'tk') {
                        $record["nationality"] = 'Turky';
                    } else if (strtolower($record["nationality"]) == 'uae') {
                        $record["nationality"] = 'UAE';
                    } else if (strtolower($record["nationality"]) == 'vt' ||
                        strtolower($record["nationality"]) == 'vietnam'
                    ) {
                        $record["nationality"] = 'Vietnam';
                    } else if (strtolower($record["nationality"]) == 'other') {
                        $record["nationality"] = 'Other';
                    }

                    $record["due_date"] = (new DateTime(substr($record['due_date'], 0, 10)))->format('Y-m-d H:i:s');
                    $record["paid_date"] = (new DateTime(substr($record['paid_date'], 0, 10)))->format('Y-m-d H:i:s');

                    $record["sex"] = $record["sex"] === 'M' ? 1 : 2;
                    $record["campus"] = $record["school_campus"];
                    $record["building_id"] = $record["campus"] == 'ITP' ? 1 : 2;
                    $record["repeater"] = strtolower($record["repeater"]) === 'yes' ? 1 : 0;

                    $record["options_beginner_option"] = strtolower($record["options_beginner_option"]) === 'yes' ? 1 : 0;
                    $record["options_island_hopping"] = strtolower($record["options_island_hopping"]) === 'yes' ? 1 : 0;
                    $record["options_oslob"] = strtolower($record["options_oslob"]) === 'yes' ? 1 : 0;
                    $record["options_pickup"] = strtolower($record["options_pickup"]) === 'yes' ? 1 : 0;
                    $record["options_meals"] = strtolower($record["options_meals"]) === 'yes' ? 1 : 0;
                    $record["autumn_campaign"] = strtolower($record["autumn_campaign"]) === 'yes' ? 1 : 0;

                    $record['updated_at'] = $today;
                    $record['delete_flag'] = 0;

                    $record["sfc_to_itp"] = $record["sfc_itp"];
                    unset($record["sfc_itp"]);

                    $record["itp_to_sfc"] = $record["itpsfc"];
                    unset($record["itpsfc"]);

                    $record["price_jpy"] = $record["pricejpy"];
                    unset($record["pricejpy"]);

                    $record["ex_price_jpy"] = $record["exprice_jpy"];
                    unset($record["exprice_jpy"]);

                    $record["entrance_fee"] = $record["registraion_fee"];
                    unset($record["registraion_fee"]);

                    $record["pickup_cost"] = $record["pick_up"];
                    unset($record["pick_up"]);

                    $record["meal_cost"] = $record["meal"];
                    unset($record["meal"]);

                    $record["special_holiday_jpy"] = $record["supecial_holidayjpy"];
                    unset($record["supecial_holidayjpy"]);

                    $record["transfer_fee"] = $record["transfar_fee"];
                    unset($record["transfar_fee"]);

                    $record["extension_fee_jpy"] = $record["extention_fee"];
                    unset($record["extention_fee"]);

                    $record["commission"] = $record["comission"];
                    unset($record["comission"]);

                    $record["id_card"] = $record["student_id"];
                    unset($record["student_id"]);

                    $record["note_for_gatta"] = $record["note_fot_gatta"];
                    unset($record["note_fot_gatta"]);

                    $record["aya_plan_fee"] = $record["aya_plam_fee"];
                    unset($record["aya_plam_fee"]);

                    $record["beginner_cost"] = $record["begginer_support_fee"];
                    unset($record["begginer_support_fee"]);

                    $record["accommodation_cost"] = $record["accomodation"];
                    unset($record["accomodation"]);

                    $record["sevenh_tenh"] = $record["7h10h"];
                    unset($record["7h10h"]);

                    //Remove non-db fields
                    unset($record["0"]);
                    unset($record["check_in_day"]);
                    unset($record["begginer_support_option"]);
                    unset($record["island_hopping"]);
                    unset($record["oslob_tour"]);
                    unset($record["meals_options"]);
                    unset($record["pick_up_options"]);
                    unset($record["school_campus"]);
                    unset($record["autum_campaine"]);

                    $errors = $this->validateDataImport($record, $okayRecord);
                    if (count($errors) > 0) {
                        array_push($arrayError, array(
                            "row" => $index,
                            "errors" => $errors
                        ));
                    } else {
                        $apply = $this->studentApplyService->findBykey($record["id_number"]);
                        if ($apply) {
                            $apply->update($record);
                        } else {
                            array_push($okayRecord, $record);
                        }
                    }
                    $index++;
                }

                if (count($arrayError) == 0) {
                    foreach (array_chunk($okayRecord, 100) as $items) {
                        $this->studentApplyService->insertArray($items);
                    }
                    $today = date_create('now')->format('Ymd_His');

                    // save upload excel file to disk
                    Excel::create('data_import_' . $today, function ($excel) use ($okayRecord) {
                        $excel->sheet('studentapply', function ($sheet) use ($okayRecord) {
                            $sheet->appendRow(array(
                                    'id_number',
                                    'student_name',
                                    'passport_name',
                                    'sex',
                                    'age')
                            );

                            foreach ($okayRecord as $item) {
                                $sheet->appendRow(
                                    array($item['id_number'],
                                        $item['student_name'],
                                        $item['passport_name'],
                                        $item['sex'],
                                        $item['age'])
                                );
                            }
                        });
                    })->store('csv', storage_path('imports/'));
                    return response()->json(array(
                        "message" => "import_successfully",
                        "storage" => storage_path('imports\\') . 'data_import_' . $today . '.csv'
                    ));

                } else {
                    return response()->json(array(
                        "data" => $records,
                        "errors" => $arrayError
                    ), $statusCodes['bad_request']);
                }
            } else {
                $errorCodes = config('errorcodes.student_apply');
                return response()->json([
                    "errors" => [$errorCodes["import_file_required"]["key"]]
                ], $statusCodes['bad_request']);
            }
        } else {
            $statusCodes = config('constants.status_code');
            return response()->json(["errors" => [config('errorcodes.permission.permission_denied.key')]], $statusCodes['forbidden']);
        }

    }

    /**
     * @param $accommodationId
     * @param $dormRoomId
     * @return int
     */
    public function getRoomId($accommodationId, $dormRoomId)
    {
        // Zelenity 2, Waterfront 3, Executive 5, Deluxe 6
        if ($accommodationId == 2) {
            if ($dormRoomId == 1) {
                $dormRoomId = 6;
            } else if ($dormRoomId == 2) {
                $dormRoomId = 7;
            } else {
                $dormRoomId = 8;
            }

        } else if ($accommodationId == 3) {
            if ($dormRoomId == 1) {
                $dormRoomId = 9;
            } else if ($dormRoomId == 2) {
                $dormRoomId = 10;
            } else {
                $dormRoomId = 11;
            }
        } else if ($accommodationId == 5) {
            if ($dormRoomId == 1) {
                $dormRoomId = 12;
            } else if ($dormRoomId == 2) {
                $dormRoomId = 13;
            } else {
                $dormRoomId = 14;
            }
        } else if ($accommodationId == 6) {
            if ($dormRoomId == 1) {
                $dormRoomId = 15;
            } else if ($dormRoomId == 2) {
                $dormRoomId = 16;
            } else {
                $dormRoomId = 17;
            }
        }
        return $dormRoomId;
    }


    private function validateExportRequest($data)
    {
        $errorCodes = config('errorcodes.student_apply');
        $errors = array();
        return $errors;
    }

    /**
     * @param ApplyRequest $request
     * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\Response
     */
    public function export(ApplyRequest $request)
    {

        $filename = 'Export-student-data.xlsx';
        $headers = array(
            "Cache-Control: public",
            "Content-Description: File Transfer",
            "Content-Disposition: attachment; filename=$filename",
            'Content-Type: application/vnd.ms-excel; charset=UTF-8',
            "Content-Encoding: UTF-8"
        );

        try {
            $firstSheet = Excel::load("storage/template/Export-student-template.xlsx")->get()->first();
            $records = $firstSheet->toArray();

            $keyList = (array_keys($records[0]));

            $dataEx = array();
            $dataEx[] = $records[0];

            $data = $request->all();
            $students = $this->studentApplyService->exportSearch($data);

            $schoolList = $this->buildingService->all();
            $roomList = $this->roomService->all();

            $mapSchool = array();
            foreach ($schoolList as $school) {
                $mapSchool[$school["id"]] = $school;
            }

            $mapRoom = array();
            foreach ($roomList as $rooms) {
                $mapRoom[$rooms["id"]] = $rooms;
            }

            //Map DB field values and Excel headers(from template $firstSheet) to create a new csv/excel file
            foreach ($students as $stud) {
                $studentRow = array();
                foreach ($keyList as $key) {
                    //Formatting other fields
                    if ($key == 'sex' && $stud['sex']) {
                        $studentRow[] = $stud['sex'] === 2 ? 'F' : 'M';
                    } else if ($key == 'created_at'  && $stud['created_at']) {
                        $studentRow[] = (new DateTime($stud['created_at']))->format('d-M');
                    } else if ($key == 'checkin_date' && $stud['checkin_date']) {
                        $studentRow[] = (new DateTime($stud['checkin_date']))->format('m/d/Y(D)');
                    } else if ($key == 'checkout_date' && $stud['checkout_date']) {
                        $studentRow[] = (new DateTime($stud['checkout_date']))->format('m/d/Y(D)');
                    } else if ($key == 'entrance_date' && $stud['entrance_date']) {
                        $studentRow[] = (new DateTime($stud['entrance_date']))->format('m/d/Y(D)');
                    } else if ($key == 'graduation_date' && $stud['graduation_date']) {
                        $studentRow[] = (new DateTime($stud['graduation_date']))->format('m/d/Y(D)');
                    } else if ($key == 'building_id' && $stud['building_id']) {
                        $studentRow[] = $mapSchool[$stud['building_id']]["code"];
                    } else if ($key == 'room_id1' && $stud['room_id1']) {
                        if($stud['accommodation_id1'] == 2){
                            if($stud['room_id1'] == 3 || $stud['room_id1'] == 8){
                                $studentRow[] = "Z-THIRD";
                            } else if($stud['room_id1'] == 2 || $stud['room_id1'] == 7){
                                $studentRow[] = "Z-TWIN";
                            } else {
                                $studentRow[] = "Z-SINGLE";
                            }
                        } else if($stud['accommodation_id1'] == 3){
                            if($stud['room_id1'] == 3 || $stud['room_id1'] == 11){
                                $studentRow[] = "WF-THIRD";
                            } else if($stud['room_id1'] == 2 || $stud['room_id1'] == 10){
                                $studentRow[] = "WF-TWIN";
                            } else {
                                $studentRow[] = "WF-SINGLE";
                            }
                        } else if($stud['accommodation_id1'] == 5){
                            if($stud['room_id1'] == 3 || $stud['room_id1'] == 14){
                                $studentRow[] = "EX-THIRD";
                            } else if($stud['room_id1'] == 2 || $stud['room_id1'] == 13){
                                $studentRow[] = "EX-TWIN";
                            } else {
                                $studentRow[] = "EX-SINGLE";
                            }
                        } else if($stud['accommodation_id1'] == 6){
                            if($stud['room_id1'] == 3 || $stud['room_id1'] == 17){
                                $studentRow[] = "DX-THIRD";
                            } else if($stud['room_id1'] == 2 || $stud['room_id1'] == 16){
                                $studentRow[] = "DX-TWIN";
                            } else {
                                $studentRow[] = "DX-SINGLE";
                            }
                        } else {
                            $studentRow[] = strtoupper($mapRoom[$stud['room_id1']]["type"]);
                        }
                    } else if ($key == 'room_id1' && !$stud['room_id1']) {
                        $studentRow[] = "WALK-IN";
                    } else if ($key == 'options_pickup' && $stud['options_pickup']) {
                        $studentRow[] = $stud['options_pickup'] === 1 ? 'Yes' : 'No';
                    } else if ($key == 'options_meals' && $stud['options_meals']) {
                        $studentRow[] = $stud['options_meals'] === 1 ? 'Yes' : 'No';
                    }  else if ($key == 'autumn_campaign' && $stud['autumn_campaign']) {
                        $studentRow[] = $stud['autumn_campaign'] === 1 ? 'Yes' : 'No';
                    } else if ($key == 'arrival_date' && $stud['arrival_date']) {
                        $studentRow[] = (new DateTime($stud['arrival_date']))->format('m/d');
                    } else if ($key == 'arrival_time' && $stud['arrival_time']) {
                        $studentRow[] = (new DateTime($stud['arrival_time']))->format('H:i');
                    } else if ($key == 'options_beginner_option' && $stud['options_beginner_option']) {
                        $studentRow[] = $stud['options_beginner_option'] === 1 ? 'Yes' : 'No';
                    } else if ($key == 'options_island_hopping' && $stud['options_island_hopping']) {
                        $studentRow[] = $stud['options_island_hopping'] === 1 ? 'Yes' : 'No';
                    } else if ($key == 'options_oslob' && $stud['options_oslob']) {
                        $studentRow[] = $stud['options_oslob'] === 1 ? 'Yes' : 'No';
                    } else if ($key == 'repeater' && $stud['repeater']) {
                        $studentRow[] = $stud['repeater'] === 1 ? 'Yes' : 'No';
                    } else if ($key == 'birthday' && $stud['birthday']) {
                        $studentRow[] = (new DateTime($stud['birthday']))->format('m/d/Y(D)');
                    } else if ($key == 'check_in_day') {
                        $studentRow[] = (new DateTime($stud['checkin_date']))->format('(D)');
                    } else if ($key == 'student_status' && $stud['student_status']) {
                        if($stud['student_status'] == 1){
                            $studentRow[] = "NEW";
                        } else if($stud['student_status'] == 2){
                            $studentRow[] = "RESERVED";
                        } else if($stud['student_status'] == 3){
                            $studentRow[] = "PAID";
                        } else if($stud['student_status'] == 4){
                            $studentRow[] = "CANCEL";
                        } else if($stud['student_status'] == 5){
                            $studentRow[] = "PRESENT";
                        } else if($stud['student_status'] == 6){
                            $studentRow[] = "GRADUATE";
                        } else if($stud['student_status'] == 7){
                            $studentRow[] = "SAMPLE INVOICE";
                        } else if($stud['student_status'] == 8){
                            $studentRow[] = "ARRANGE";
                        } else if($stud['student_status'] == -1){
                            $studentRow[] = "UNKNOWN";
                        }
                    } else if ($key == 'due_date'  && $stud['due_date']) {
                        $studentRow[] = (new DateTime($stud['due_date']))->format('m/d');
                    } else if ($key == 'paid_date' && $stud['paid_date']) {
                        $studentRow[] = (new DateTime($stud['paid_date']))->format('m/d/Y');
                    } else if($key == 'total_cost' && $stud['total_cost']) {
                        $studentRow[] = ((($stud['sub_total'] + $stud['entrance_fee']) +
                        $stud['pickup_cost'] + $stud['meal_cost'] + $stud['special_holiday_jpy'] + $stud['transfer_fee'] +
                        $stud['extension_fee_jpy'] + $stud['additional_lesson_fee'] + $stud['remittance_fee'] +
                        $stud['special_cost'] + $stud['beginner_cost']) - ($stud['discount'] + $stud['commission']))
                            - $stud['paid_amount'];
                    } else {
                        //$student field; key(id_number) from template $firstSheet
                        $studentRow[] = $stud[$key];
                    }

                }
                $dataEx[] = $studentRow;
            }
            //create xls file to export
            Excel::create('EXPORT-student-data', function ($excel) use ($dataEx) {
                $excel->getDefaultStyle()->getAlignment()->setHorizontal(\PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
                $excel->sheet('student_master_export', function ($sheet) use ($dataEx) {
                    $sheet->fromArray($dataEx, null, 'A1', false, false);
                    $sheet->freezeFirstRow();
                    $sheet->cells('A1:CM1', function ($cells) {
                        $cells->setBackground('#FFFF00');
                        $cells->setFont(array(
                            'family' => 'Arial Unicode MS',
                            'size' => '10',
                            'bold' => true
                        ));
                    });
                });
            })->export('xlsx');

            $csv = $dataEx;
            array_push($headers, "Content-Disposition: attachment; filename=$filename");

            return response()->make($csv, 200, $headers);
        } catch (Exception $e) {
            $statusCode = config('constants.status_code');
            $errorcodes = config('errorcodes.student_apply');

            return response()->json(array(
                "errors" => [$errorcodes['download_student_unsuccessfully']['key']],
            ), $statusCode['internal_server_error']);
        }
    }

    function arr2csv($fields)
    {
        $fp = fopen('php://temp', 'r+b');
        foreach ($fields as $field) {
            fputcsv($fp, $field);
        }
        rewind($fp);
        $tmp = str_replace(PHP_EOL, "\r\n", stream_get_contents($fp));
        return mb_convert_encoding($tmp, 'CP932', 'ASCII,JIS,UTF-8,eucJP-win,SJIS-win');
    }


    private function validateDataImport($data, $validatedData)
    {
        $errors = array();
        $errorcodes = config('errorcodes.student_apply');
        $apply_no = null;

        if (empty($data['checkin_date'])) {
            array_push($errors, $errorcodes['checkin_date_required']['key']);
        }

        if (empty($data['checkout_date'])) {
            array_push($errors, $errorcodes['checkout_date_required']['key']);
        }

        return $errors;
    }

    public function findStudentInfo($id)
    {
        $studentApply = $this->studentApplyService->findByEditId($id);
        return response()->json($studentApply);
    }

    public function updateEditId($id){
        $studentApply = $this->studentApplyService->findById($id);
        if(!$studentApply['edit_id']){
            $edit_no = md5($id."i@mas+r!n&");
            $studentApply->update(array("edit_id" => $edit_no));
        }
        return response()->json(["message" => "editId_retrieve_successfully"]);
    }

    public function updateStudentInfo(ApplyRequest $request, $id)
    {
        $data = $request->all();
        $ageUpdated = GlobalFunctions::calculateAge($data['birthday']);
        $studentApply = $this->studentApplyService->findByEditId($id);

        $studentApply->update(array("student_name" => $data['name']));
        $studentApply->update(array("passport_name" => $data['passportName']));
        $studentApply->update(array("birthday" => $data['birthday']));
        $studentApply->update(array("sex" => $data["sex"] == "男性" || $data["sex"] == "M" ? 1 : 2));
        $studentApply->update(array("age" => $ageUpdated));
        $studentApply->update(array("nationality" => $data['nationality']));
        $studentApply->update(array("address" => $data['address']));
        $studentApply->update(array("phone" => $data['phone']));
        $studentApply->update(array("email" => $data['email']));
        $studentApply->update(array("job" => $data['job']));
        $studentApply->update(array("emergency_contact" => isset($data['emergencyContact'])?$data['emergencyContact']:null));
        $studentApply->update(array("email_family" => isset($data['emergencyContact'])?$data['emailFamily']:null));
        $studentApply->update(array("skype_id" => isset($data['emergencyContact'])?$data['skypeId']:null));
        $studentApply->update(array("line_id" => isset($data['emergencyContact'])?$data['lineId']:null));

        return response()->json(["message" => "update_successfully", "data" => $studentApply]);
    }

    public function getGraduatingList($gradFrom,$gradCampus){

        $gradList = $this->studentApplyService->getGradList($gradFrom,$gradCampus);
        return response()->json($gradList);
    }

    public function getChangeDormRoomList($changeFrom){

        $changeDormList = $this->studentApplyService->getChangeDorm($changeFrom);
        return response()->json($changeDormList);
    }

    public function getChangeHotelRoomList($changeFrom){

        $changeHotelList = $this->studentApplyService->getChangeHotel($changeFrom);
        return response()->json($changeHotelList);
    }

    public function addStudentPayment(ApplyRequest $request, $editId){
        $data = $request->all();
        $today = date("Y-m-d H:i:s");
        $studentApply = $this->studentApplyService->findByEditId($editId);

        $updatePaymentPending = (($studentApply['payment_pending']?$studentApply['payment_pending']:0) + 1);
        $studentApply->update(array("payment_pending" => $updatePaymentPending));

        $paymentArray = array(
            "student_id" => $studentApply['id'],
            "edit_id" => $editId,
            "confirm" => 1,
            "payment_amount" => $data['amountPayment'],
            "payment_currency" => $data['currencyPayment'],
            "created_at" => $today,
            "updated_at" => $today
        );
        $payment = $this->paymentsService->create($paymentArray);

        return response()->json(["message" => "update_successfully", "data" => $payment]);
    }

    public function confirmStudentPayment($id){
        $today = date("Y-m-d H:i:s");
        $user = \Request::get('user');

        //find the pending amount for the student
        $payment = $this->paymentsService->findByPaymentsId($id);
        // update payment table in the database
        $payment->update(array("confirm" => 0));
        $payment->update(array("confirm_by" => $user['name']));
        $payment->update(array("updated_at" => $today));

        //find the student in student_apply
        $studentApply = $this->studentApplyService->findByEditId($payment['edit_id']);

        //add/update the paid_amount and payment_pending fields
        $paidAmount = ($studentApply['paid_amount']?$studentApply['paid_amount']:0) + $payment['payment_amount'];
        $updatePaymentPending = ($studentApply['payment_pending'] - 1);

        $studentApply->update(array("paid_amount" => $paidAmount));
        $studentApply->update(array("payment_pending" => $updatePaymentPending));

        return response()->json(array("message" => "update_successfully","data" => $payment));

    }

    public function getPaymentsUnconfirmed($id){
        $paymentsList = $this->paymentsService->findPaymentsToConfirm($id);
        return response()->json($paymentsList);
    }

    public function getPaymentsConfirmed($id){
        $paymentsList = $this->paymentsService->findPaymentsAlreadyConfirmed($id);
        return response()->json($paymentsList);
    }

}
