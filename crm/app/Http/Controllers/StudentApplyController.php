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
use App\Repositories\Accommodations\AccommodationsInterface;
use App\Repositories\Plans\PlansInterface;
use App\Repositories\Beds\BedsInterface;
use App\Repositories\CondoBeds\CondoBedsInterface;
use App\Repositories\CondoReservations\CondoReservationsInterface;
use App\Repositories\CondoRooms\CondoRoomsInterface;
use App\Repositories\HotelsBeds\HotelsBedsInterface;
use App\Repositories\HotelsReservations\HotelsReservationsInterface;
use App\Repositories\HotelsRooms\HotelsRoomsInterface;
use App\Repositories\WalkinBeds\WalkinBedsInterface;
use App\Repositories\WalkinReservations\WalkinReservationsInterface;
use App\Repositories\WalkinRooms\WalkinRoomsInterface;
use App\Repositories\CourseLogs\CourseLogsInterface;
use App\Repositories\Courses\CoursesInterface;
use App\Repositories\ExtensionInvoices\ExtensionInvoicesInterface;
use App\Repositories\RefundInvoices\RefundInvoicesInterface;
use App\Repositories\Invoices\InvoicesInterface;
use App\Repositories\HotelReservations\HotelReservationsInterface;
use App\Repositories\Buildings\BuildingsInterface;
use App\Repositories\ChangeLog\ChangeLogInterface;
use App\Repositories\DormitoryRooms\DormitoryRoomsInterface;
use App\Repositories\HotelStatuses\HotelStatusesInterface;
use App\Repositories\Nationalities\NationalitiesInterface;
use App\Repositories\Payments\PaymentsInterface;
use App\Repositories\ReservationLogs\ReservationLogsInterface;
use App\Repositories\Reservations\ReservationsInterface;
use App\Repositories\ReservationStatuses\ReservationStatusesInterface;
use App\Repositories\Rooms\RoomsInterface;
use App\Repositories\StudentApply\StudentApplyInterface;
use App\Repositories\Users\UsersInterface;
use App\Repositories\InvoiceDiscount\InvoiceDiscountInterface;
use App\Repositories\OtherReservations\OtherReservationsInterface;
use App\Repositories\Holidays\HolidaysInterface;
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
    private $condoRoomsService;
    private $hotelsRoomsService;
    private $walkinRoomsService;
    private $reservationStatusService;
    private $roomService;
    private $accommodationService;
    private $reservationService;
    private $condoReservationService;
    private $hotelsReservationService;
    private $walkinReservationService;
    private $nationalityService;
    private $buildingService;
    private $hotelStatusService;
    private $changeLogService;
    private $invoiceDiscountService;
    private $hotelReservationsService;
    private $paymentsService;
    private $generalValue;
    private $mailInfo;
    private $reservationStatus;
    private $otherReservationService;
    private $holidayService;
    private $courseService;
    private $extensionInvoiceService;
    private $refundInvoiceService;
    private $invoiceService;
    private $courseLogService;
    private $reservationLogService;
    private $condoBedsService;
    private $hotelsBedsService;
    private $walkinBedsService;
    private $planService;
    private $schoolList;
    private $roomList;
    private $accommodationList;
    private $planList;
    private $dormList;


    public function __construct(StudentApplyInterface $studentApplyInterface, NationalitiesInterface $nationalitiesInterface, ReservationsInterface $reservationsInterface,
                                BuildingsInterface $buildingsInterface, ReservationStatusesInterface $reservationStatusesInterface,
                                RoomsInterface $roomsService, BedsInterface $bedsService, DormitoryRoomsInterface $dormitoryRoomsService,
                                HotelStatusesInterface $hotelStatusesInterface, UsersInterface $usersInterface, ChangeLogInterface $changeLogInterface,
                                InvoiceDiscountInterface $invoiceDiscountInterface,HotelReservationsInterface $hotelReservationsService,
                                PaymentsInterface $paymentsService,OtherReservationsInterface $otherReservationsInterface,HolidaysInterface $holidayInterface,
                                CoursesInterface $coursesInterface, ExtensionInvoicesInterface $extensionInvoicesInterface, RefundInvoicesInterface $refundInvoicesInterface, CourseLogsInterface $courseLogsInterface,
                                ReservationLogsInterface $reservationLogsInterface, CondoBedsInterface $condoBedsInterface, CondoReservationsInterface $condoReservationsInterface,
                                CondoRoomsInterface $condoRoomsInterface, HotelsBedsInterface $hotelsBedsInterface, HotelsReservationsInterface $hotelsReservationsInterface,
                                HotelsRoomsInterface $hotelsRoomsInterface, WalkinBedsInterface $walkinBedsInterface, WalkinReservationsInterface $walkinReservationsInterface,
                                WalkinRoomsInterface $walkinRoomsInterface,AccommodationsInterface $accommodationService,PlansInterface $plansInterface, InvoicesInterface $invoicesInterface) {
        $this->studentApplyService = $studentApplyInterface;
        $this->nationalityService = $nationalitiesInterface;
        $this->reservationService = $reservationsInterface;
        $this->condoReservationService = $condoReservationsInterface;
        $this->hotelsReservationService = $hotelsReservationsInterface;
        $this->walkinReservationService = $walkinReservationsInterface;
        $this->buildingService = $buildingsInterface;
        $this->reservationStatusService = $reservationStatusesInterface;
        $this->roomService = $roomsService;
        $this->accommodationService = $accommodationService;
        $this->bedsService = $bedsService;
        $this->condoBedsService = $condoBedsInterface;
        $this->hotelsBedsService = $hotelsBedsInterface;
        $this->walkinBedsService = $walkinBedsInterface;
        $this->dormitoryRoomsService = $dormitoryRoomsService;
        $this->condoRoomsService = $condoRoomsInterface;
        $this->hotelsRoomsService = $hotelsRoomsInterface;
        $this->walkinRoomsService = $walkinRoomsInterface;
        $this->hotelStatusService = $hotelStatusesInterface;
        $this->userService = $usersInterface;
        $this->changeLogService = $changeLogInterface;
        $this->invoiceDiscountService = $invoiceDiscountInterface;
        $this->hotelReservationsService = $hotelReservationsService;
        $this->paymentsService = $paymentsService;
        $this->permissions = config('constants.permissions');
        $this->generalValue = config('constants.general_value');
        $this->reservationStatus = config('constants.reservation_status');
        $this->mailInfo = config('constants.mail.reservation.admin.create');
        $this->otherReservationService = $otherReservationsInterface;
        $this->holidayService = $holidayInterface;
        $this->courseService = $coursesInterface;
        $this->extensionInvoiceService = $extensionInvoicesInterface;
        $this->refundInvoiceService = $refundInvoicesInterface;
        $this->invoiceService = $invoicesInterface;
        $this->courseLogService = $courseLogsInterface;
        $this->reservationLogService = $reservationLogsInterface;
        $this->planService = $plansInterface;
        $this->schoolList = $this->buildingService->all();
        $this->roomList = $this->roomService->all();
        $this->accommodationList = $this->accommodationService->all();
        $this->planList = $this->planService->all();
        $this->dormList = $this->dormitoryRoomsService->all();
    }

    public function store(ApplyRequest $request) {

        $apply = $request->all();
        $today = time();
        $randomNumber = $today.rand(100,999);
        $user = \Request::get('user');
        $datetime = date("Y-m-d h:i:s");

        if(array_key_exists("groupAddHowMany", $apply)) {
            // Tentative add (Group and Individual)
            if($apply['groupAddHowMany']) {
                $studentApply = array(
                    "apply_no" => $randomNumber,
                    "sex" => $apply["groupdAddGender"],
                    "passport_name" => $apply['groupAddPassportName'],
                    "visit_id" => $apply['groupAddVisitType'],
                    "student_status" => 10,
                    "country_code" => $apply['groupAddCountry'],
                    "agent_name" => $apply['groupdAddAgency'],
                    "camp_name" => isset($apply['groupAddCampName'])?$apply['groupAddCampName']:'',
                    "checkin_date" => date('Y-m-d H:i:s', strtotime($apply['groupAddCheckin'])),
                    "checkout_date" => date('Y-m-d H:i:s', strtotime($apply['groupAddCheckout'])),
                    "accommodation_id1" => $apply['groupAddCampus']==1?'1':'4',
                    "building_id" => $apply["groupAddCampus"],
                    "sfc_to_itp" => null,
                    "itp_to_sfc" => null,
                    "campus" => $apply['groupAddCampus']==1?'ITP':'SFC');
                if($apply['groupAddHowMany'] == 1) {
                    $result = $this->studentApplyService->create($studentApply); // Individual
                    //invoices table
                    $invoiceData = array (
                        "sa_id_number" => $result['id'],
                        "checkin_date" => date('Y-m-d H:i:s', strtotime($apply['groupAddCheckin'])),
                        "checkout_date" => date('Y-m-d H:i:s', strtotime($apply['groupAddCheckout'])),
                        "id_card" => 200 //default student id card 200
                    );
                    $this->invoiceService->create($invoiceData);
                } else {
                    for ($ctr = 0; $ctr < $apply['groupAddHowMany']; $ctr++) {
                        $studentApply = array(
                            "apply_no" => $randomNumber.$ctr,
                            "sex" => $apply["groupdAddGender"],
                            "passport_name" => $apply['groupAddPassportName'],
                            "visit_id" => $apply['groupAddVisitType'],
                            "student_status" => 10,
                            "country_code" => $apply['groupAddCountry'],
                            "agent_name" => $apply['groupdAddAgency'],
                            "camp_name" => isset($apply['groupAddCampName'])?$apply['groupAddCampName']:'',
                            "checkin_date" => date('Y-m-d H:i:s', strtotime($apply['groupAddCheckin'])),
                            "checkout_date" => date('Y-m-d H:i:s', strtotime($apply['groupAddCheckout'])),
                            "accommodation_id1" => $apply['groupAddCampus']==1?'1':'4',
                            "building_id" => $apply["groupAddCampus"],
                            "sfc_to_itp" => null,
                            "itp_to_sfc" => null,
                            "campus" => $apply['groupAddCampus']==1?'ITP':'SFC');
                        $result = $this->studentApplyService->create($studentApply);// Group
                        //invoices table
                        $invoiceData = array (
                            "sa_id_number" => $result['id'],
                            "checkin_date" => date('Y-m-d H:i:s', strtotime($apply['groupAddCheckin'])),
                            "checkout_date" => date('Y-m-d H:i:s', strtotime($apply['groupAddCheckout'])),
                            "id_card" => 200 //default student id card 200
                        );
                        $this->invoiceService->create($invoiceData);
                    }
                }
            }
            return response()->json(["message" => "group_student_create_successful"]);

        }
        else if(array_key_exists("sa_id", $apply)) {
            // Extension Invoice create
            $terms = floor((GlobalFunctions::getDaysBetweenTwoDays($apply['ext_checkin_date'], $apply['ext_checkout_date']) / $this->generalValue['days_of_week']));
            $courseName = $this->getCourseName($apply['ext_plan_id'],0);
            $extInvoiceNumber = $this->generateExtInvoiceNumber($apply["sa_id"]);
            $holidays = $this->holidayService->getHolidaysInPeriod($apply['ext_checkin_date'], $apply['ext_checkout_date']);
            $holidaysStudent = '';
            foreach($holidays as $holiday) {
                if($holiday['opened_class'] == 1) { //list only 1=open classes
                    $dateFormat = strtotime($holiday['date']);
                    $holidaysStudent .= date('M j',$dateFormat).', ';
                }
            }
            $extInvoice = array("sa_id" => $apply["sa_id"], "sa_passport_name" => $apply["sa_passport_name"], "ext_invoice_number" => $extInvoiceNumber,
                "ext_checkin_date" => isset($apply['ext_checkin_date'])?$apply['ext_checkin_date']:'1990-01-01 00:00:00', "ext_checkout_date" => isset($apply['ext_checkout_date'])?$apply['ext_checkout_date']:'1990-01-01 00:00:00',
                "ext_term" => $terms, "ext_building_id" => isset($apply['ext_building_id'])?$apply['ext_building_id']:0, "ext_accommodation_id" => isset($apply['ext_accommodation_id'])?$apply['ext_accommodation_id']:0,
                "ext_room_id" => isset($apply['ext_room_id'])?$apply['ext_room_id']:0, "ext_plan_id" => isset($apply['ext_plan_id'])?$apply['ext_plan_id']:0, "ext_course" => $courseName, "ext_holidays" => $holidaysStudent,
                "ext_entrance_fee" => isset($apply['ext_entrance_fee'])?$apply['ext_entrance_fee']:0, "ext_tuition_accommodation_fee" => isset($apply['ext_tuition_accommodation_fee'])?$apply['ext_tuition_accommodation_fee']:0,
                "ext_room_upgrade_fee" => isset($apply['ext_room_upgrade_fee'])?$apply['ext_room_upgrade_fee']:0, "ext_plan_upgrade_fee" => isset($apply['ext_plan_upgrade_fee'])?$apply['ext_plan_upgrade_fee']:0,
                "ext_holiday_fee" => isset($apply['ext_holiday_fee'])?$apply['ext_holiday_fee']:0, "ext_other1_label" => isset($apply['ext_other1_label'])?$apply['ext_other1_label']:'',
                "ext_other1_fee" => isset($apply['ext_other1_fee'])?$apply['ext_other1_fee']:0, "ext_other2_label" => isset($apply['ext_other2_label'])?$apply['ext_other2_label']:'', "ext_other2_fee" => isset($apply['ext_other2_fee'])?$apply['ext_other2_fee']:0,
                "ext_agent_commission" => isset($apply['ext_agent_commission'])?$apply['ext_agent_commission']:0, "ext_total_cost" => isset($apply['ext_total_cost'])?$apply['ext_total_cost']:0, "ext_ssp_fee_php" => isset($apply['ext_ssp_fee_php'])?$apply['ext_ssp_fee_php']:0,
                "ext_student_id_card_php" => isset($apply['ext_student_id_card_php'])?$apply['ext_student_id_card_php']:0, "ext_electrical_fee_php" => isset($apply['ext_electrical_fee_php'])?$apply['ext_electrical_fee_php']:0,
                "ext_i_card_fee_php" => isset($apply['ext_i_card_fee_php'])?$apply['ext_i_card_fee_php']:0);
            $this->createOperationLogs($datetime,"/app/admin/apply","create-extend/".$apply["sa_id"],$user,$extInvoice,$extInvoice,$request);
            $this->extensionInvoiceService->create($extInvoice);

            return response()->json(["message" => "extension_invoice_create_successful"]);
        }
        else if(array_key_exists("sa_id_refund", $apply)) {
            // Refund Invoice create
            $terms = floor((GlobalFunctions::getDaysBetweenTwoDays($apply['rfd_checkin_date'], $apply['rfd_checkout_date']) / $this->generalValue['days_of_week']));
            $courseName = $this->getCourseName($apply['rfd_plan_id'],0);
            $rfdInvoiceNumber = $this->generateRefundInvoiceNumber($apply["sa_id_refund"]);
            $holidays = $this->holidayService->getHolidaysInPeriod($apply['rfd_checkin_date'], $apply['rfd_checkout_date']);
            $holidaysStudent = '';
            foreach($holidays as $holiday) {
                if($holiday['opened_class'] == 1) { //list only 1=open classes
                    $dateFormat = strtotime($holiday['date']);
                    $holidaysStudent .= date('M j',$dateFormat).', ';
                }
            }
            $rfdInvoice = array("sa_id_refund" => $apply["sa_id_refund"], "sa_passport_name" => $apply["sa_passport_name"], "refund_invoice_number" => $rfdInvoiceNumber,
                "rfd_checkin_date" => isset($apply['rfd_checkin_date'])?$apply['rfd_checkin_date']:'1990-01-01 00:00:00', "rfd_checkout_date" => isset($apply['rfd_checkout_date'])?$apply['rfd_checkout_date']:'1990-01-01 00:00:00',
                "rfd_term" => $terms, "rfd_building_id" => isset($apply['rfd_building_id'])?$apply['rfd_building_id']:0, "rfd_accommodation_id" => isset($apply['rfd_accommodation_id'])?$apply['rfd_accommodation_id']:0,
                "rfd_room_id" => isset($apply['rfd_room_id'])?$apply['rfd_room_id']:0, "rfd_plan_id" => isset($apply['rfd_plan_id'])?$apply['rfd_plan_id']:0, "rfd_course" => $courseName, "rfd_holidays" => $holidaysStudent,
                "rfd_entrance_fee" => isset($apply['rfd_entrance_fee'])?$apply['rfd_entrance_fee']:0, "rfd_tuition_accommodation_fee" => isset($apply['rfd_tuition_accommodation_fee'])?$apply['rfd_tuition_accommodation_fee']:0,
                "rfd_room_upgrade_fee" => isset($apply['rfd_room_upgrade_fee'])?$apply['rfd_room_upgrade_fee']:0, "rfd_plan_upgrade_fee" => isset($apply['rfd_plan_upgrade_fee'])?$apply['rfd_plan_upgrade_fee']:0,
                "rfd_holiday_fee" => isset($apply['rfd_holiday_fee'])?$apply['rfd_holiday_fee']:0, "rfd_other1_label" => isset($apply['rfd_other1_label'])?$apply['rfd_other1_label']:'',
                "rfd_other1_fee" => isset($apply['rfd_other1_fee'])?$apply['rfd_other1_fee']:0, "rfd_other2_label" => isset($apply['rfd_other2_label'])?$apply['rfd_other2_label']:'', "rfd_other2_fee" => isset($apply['rfd_other2_fee'])?$apply['rfd_other2_fee']:0,
                "rfd_agent_commission" => isset($apply['rfd_agent_commission'])?$apply['rfd_agent_commission']:0, "rfd_total_cost" => isset($apply['rfd_total_cost'])?$apply['rfd_total_cost']:0, "rfd_ssp_fee_php" => isset($apply['rfd_ssp_fee_php'])?$apply['rfd_ssp_fee_php']:0,
                "rfd_student_id_card_php" => isset($apply['rfd_student_id_card_php'])?$apply['rfd_student_id_card_php']:0, "rfd_electrical_fee_php" => isset($apply['rfd_electrical_fee_php'])?$apply['rfd_electrical_fee_php']:0,
                "rfd_i_card_fee_php" => isset($apply['rfd_i_card_fee_php'])?$apply['rfd_i_card_fee_php']:0);
            $this->createOperationLogs($datetime,"/app/admin/apply","create-refund/".$apply["sa_id_refund"],$user,$rfdInvoice,$rfdInvoice,$request);
            $this->refundInvoiceService->create($rfdInvoice);

            return response()->json(["message" => "refund_invoice_create_successful"]);
        }
        return response()->json(["message" => "default"]);
    }

    public function findRefundInvoice($id) {
        $refundInvoice = $this->refundInvoiceService->findByApplyId($id);
        return response()->json($refundInvoice);
    }

    public function findRefundInvoicePhpRate($id) {
        $refundInvoice = $this->refundInvoiceService->findByApplyId($id);
        $invoice = $this->invoiceService->findByApplyId($id);
        $phRate = $this->getExchangeRateRfdInv($refundInvoice, $invoice);
        return response()->json(number_format($phRate,0));
    }

    public function findExtensionInvoice($id) {
        $extensionInvoice = $this->extensionInvoiceService->findByApplyId($id);
        return response()->json($extensionInvoice);
    }

    public function findExtensionInvoicePhpRate($id) {
        $extensionInvoice = $this->extensionInvoiceService->findByApplyId($id);
        $phRate = $this->getExchangeRateExtInv($extensionInvoice);
        return response()->json(number_format($phRate,0));
    }

    public function findInvoice($id) {
        $invoice = $this->invoiceService->findByApplyId($id);
        return response()->json($invoice);
    }

    public function findInvoicePhpRate($id) {
        $invoice = $this->invoiceService->findByApplyId($id);
        $phRate = $this->getExchangeRateInv($invoice);
        return response()->json($phRate);
    }

    public function search(ApplyRequest $request) {
        $data = $request->all();
        $list = $this->studentApplyService->search($data);
        $printTemplateList = $this->studentApplyService->searchPrintList($data);
        $dataReturn = array("list" => $list, "printTemplateList" => $printTemplateList);
        return response()->json($dataReturn);
    }

    public function show($id) {
        $studentApply = $this->studentApplyService->findById($id);
        return response()->json($studentApply);
    }

    public function findLog($id) {
        $changeLogList = $this->changeLogService->findById($id);
        return response()->json($changeLogList);
    }

    public function findApplyInvoice($applyId, $invoiceId) {
        $studentApplyWithInvoice = $this->studentApplyService->findByInvoiceNo($applyId, $invoiceId);
        //$phRateStudentApply = $this->getExchangeRate($studentApplyWithInvoice);
        $invoice = $this->invoiceService->findByInvoiceNo($applyId, $invoiceId);
        $phRateInvoice = $this->getExchangeRateInv($invoice);
        return  response()->json(array("data" => $studentApplyWithInvoice, "invoiceInfo" => $invoice, "phTuitionFee" => number_format($phRateInvoice),2));
    }

    public function findInvoiceDiscountList($applyId, $invoiceId) {
        $invoiceDiscount = $this->invoiceDiscountService->findByInvoiceNo($applyId, $invoiceId);
        return response()->json($invoiceDiscount);
    }

    public function update(ApplyRequest $request, $id) {
        $data = $request->all();
        $user = \Request::get('user');
        $datetime = date("Y-m-d h:i:s");
        $today = date('Y-m-d', strtotime('now'));
        $checkValues = $this->studentApplyService->findById($id);
        $checkInvoiceValues = $this->invoiceService->findByApplyId($id);
        $studentStatus = config('constants.student_status');
        $roomReservationStatus = config('constants.reservation_status');

        if(array_key_exists("apply_no", $data)) {
            if ($data['birthday']) {
                $data['age'] = GlobalFunctions::calculateAge($data['birthday']);
            }
            //calculate term by weeks
            if ($data['checkin_date'] && $data['checkout_date']) {
                $data['term'] = floor((GlobalFunctions::getDaysBetweenTwoDays($data['checkin_date'], $data['checkout_date']) / $this->generalValue['days_of_week']));
            }
            //save holidays
            if ($data['entrance_date'] && $data['graduation_date']) {
                $holidays = $this->holidayService->getHolidaysInPeriod($data['entrance_date'], $data['graduation_date']);
                $holidaysStudent = '';
                foreach($holidays as $holiday) {
                    if($holiday['opened_class'] == 1) { //list only 1=open classes
                        $dateFormat = strtotime($holiday['date']);
                        $holidaysStudent .= date('M j',$dateFormat).', ';
                    }
                }
                $data['holidays'] = $holidaysStudent;
            }
            //generate id number if student_status is Reserved and id_number is blank
            if($data['student_status'] == 2 || $data['student_status'] == 5) {
                $data['entrance_date'] =  date('Y-m-d', strtotime($data['checkin_date']. ' + 1 days'));
                $data['graduation_date'] =  date('Y-m-d', strtotime($data['checkout_date']. ' - 1 days'));
                if(!$data['id_number']) {
                    $data['id_number'] = $this->randomizeIdNumber();
                }
                //if checkin_date is not greater or equal current date, changed status to PRESENT(5) is not allowed.
                if($data['student_status'] == 5 && $today < $data['checkin_date']) {
                    $data['student_status'] = $checkValues['student_status'];
                }
                //update memo
                $parRight =  $data['camp_name']?'[':''; $parLeft =  $data['camp_name']?']':'';
                $nameMemoContent = $data['passport_name']?$data['passport_name']:$data['student_name'];
                $otherMemoContent = '/' . ($data['sex'] === 1 ? 'Male' : 'Female') . $parRight . $data['camp_name'] . $parLeft;;
                $memoContent = $nameMemoContent.$otherMemoContent;
                //for reservations table
                $reservedRooms = $this->reservationService->findRoomsByApplyId($id);
                $this->updateReservationMemo($reservedRooms, $memoContent);
                //for other_reservations table
                $reservedHotelsWalkin = $this->otherReservationService->findByStudentId($id);
                $this->updateReservationMemo($reservedHotelsWalkin, $memoContent);
                //for condo_reservations table
                $reservedCondoRooms = $this->condoReservationService->findRoomsByApplyId($id);
                $this->updateReservationMemo($reservedCondoRooms, $memoContent);
                //for hotels_reservations table
                $reservedHotelsRooms = $this->hotelsReservationService->findRoomsByApplyId($id);
                $this->updateReservationMemo($reservedHotelsRooms, $memoContent);
                //for walkin_reservations table
                $reservedWalkinRooms = $this->walkinReservationService->findRoomsByApplyId($id);
                $this->updateReservationMemo($reservedWalkinRooms, $memoContent);

                if($checkValues['student_status'] == $studentStatus['tentative'] && $data['student_status'] == 2) { //Update reservation status to 3:reserved
                    $this->updateReservationStatusToReserved($reservedRooms, $roomReservationStatus['reserved']);
                    $this->updateReservationStatusToReserved($reservedHotelsWalkin, $roomReservationStatus['reserved']);
                    $this->updateReservationStatusToReserved($reservedCondoRooms, $roomReservationStatus['reserved']);
                    $this->updateReservationStatusToReserved($reservedHotelsRooms, $roomReservationStatus['reserved']);
                    $this->updateReservationStatusToReserved($reservedWalkinRooms, $roomReservationStatus['reserved']);
                }

                if($data['country_code'] == 'CN' && $checkValues['student_status'] == $studentStatus['tentative']) {
                    $mailConfig = config('constants.mail.reservation.admin');
                    $listAdminEmail = explode(',', $mailConfig['create']['address']);
                    $todayAdd2Weeks = date('Y-m-d', strtotime('+2 weeks'));
                    $replaceString = '';
                    if ($data['checkin_date'] >= $today && $data['checkout_date'] <=$todayAdd2Weeks) {
                        $replaceString = '*URGENT*';
                    }
                    if(count($listAdminEmail) > 0) {
                        GlobalFunctions::sendMailable($this->mailInfo["template"], $listAdminEmail, sprintf($this->mailInfo["subject"], $replaceString), $data, "", "", []);
                    }
                }
            }
            //remove discounts and commission when below are/is updated
            if($data['invoice_number']) {
                if($data['entrance_fee'] != $checkValues['entrance_fee'] || $data['sub_total'] != $checkValues['sub_total']
                    || $data['holiday_fee'] != $checkValues['holiday_fee'] || $data['transfer_fee'] != $checkValues['transfer_fee']) {
                    $data['commission'] = 0;
                    $data['commission_percentage'] = 0;
                    $data['discount'] = 0;
                    $discounts = $this->invoiceDiscountService->findByInvoiceNo($data['id'], $data['invoice_number']);
                    foreach ($discounts as $list) {
                        $this->invoiceDiscountService->remove($list['id']);
                    }
                }
            }
            //update invoice number for invoice_discounts table
            if($data['invoice_number'] != $checkValues['invoice_number']) {
                $invoiceNumber = $this->invoiceDiscountService->findByInvoiceNo($data['id'], $checkValues['invoice_number']);
                foreach ($invoiceNumber as $inv) {
                    $inv->update(array("student_invoice_no" => $data['invoice_number']));
                }
            }
            $apply = $this->studentApplyService->findById($id);
            $apply->update($data);
            //remove all reservations when change to Cancel status
            if($data['student_status'] == 4){
                $this->deleteStudent($data['id'], 0);
            }
            return response()->json(["message" => "student_update_successful", "data" => $apply]);

        }
        else if(array_key_exists("groupAddHowMany", $data)) {
            // student apply group updates
            return response()->json(["message" => "student_group_update_successful"]);

        }
        else if(array_key_exists("sa_id", $data)) {
            // extension invoice updates
            $courseName = $this->getCourseName($data['ext_plan_id'],0);
            $holidays = $this->holidayService->getHolidaysInPeriod($data['ext_checkin_date'], $data['ext_checkout_date']);
            $holidaysStudent = '';
            foreach($holidays as $holiday) {
                if($holiday['opened_class'] == 1) { //list only 1=open classes
                    $dateFormat = strtotime($holiday['date']);
                    $holidaysStudent .= date('M j',$dateFormat).', ';
                }
            }
            $data['ext_term']  = floor((GlobalFunctions::getDaysBetweenTwoDays($data['ext_checkin_date'], $data['ext_checkout_date']) / $this->generalValue['days_of_week']));
            $data['ext_course'] = $courseName;
            $data['ext_holidays'] = $holidaysStudent;
            $extInv = $this->extensionInvoiceService->findByApplyId($id);
            $this->createOperationLogs($datetime,"/app/admin/apply/","update-extend/",$user,$extInv,$data,$request);
            $extInv->update($data);
            return response()->json(["message" => "extension_invoice_update_successful"]);
        }
        else if(array_key_exists("sa_id_refund", $data)) {
            // refund invoice updates
            $courseName = $this->getCourseName($data['rfd_plan_id'],0);
            $holidays = $this->holidayService->getHolidaysInPeriod($data['rfd_checkin_date'], $data['rfd_checkout_date']);
            $holidaysStudent = '';
            foreach($holidays as $holiday) {
                if($holiday['opened_class'] == 1) { //list only 1=open classes
                    $dateFormat = strtotime($holiday['date']);
                    $holidaysStudent .= date('M j',$dateFormat).', ';
                }
            }
            $data['rfd_term']  = floor((GlobalFunctions::getDaysBetweenTwoDays($data['rfd_checkin_date'], $data['rfd_checkout_date']) / $this->generalValue['days_of_week']));
            $data['rfd_course'] = $courseName;
            $data['rfd_holidays'] = $holidaysStudent;
            $rfdInv = $this->refundInvoiceService->findByApplyId($id);
            $this->createOperationLogs($datetime,"/app/admin/apply/","update-refund/",$user,$rfdInv,$data,$request);
            $rfdInv->update($data);
            return response()->json(["message" => "refund_invoice_update_successful"]);
        }
        else if(array_key_exists("sa_id_number", $data)) {
            // invoice updates
            $holidays = $this->holidayService->getHolidaysInPeriod($data['checkin_date'], $data['checkout_date']);
            $holidaysStudent = '';
            foreach($holidays as $holiday) {
                if($holiday['opened_class'] == 1) { //list only 1=open classes
                    $dateFormat = strtotime($holiday['date']);
                    $holidaysStudent .= date('M j',$dateFormat).', ';
                }
            }
            $data['term']  = floor((GlobalFunctions::getDaysBetweenTwoDays($data['checkin_date'], $data['checkout_date']) / $this->generalValue['days_of_week']));
            $data['holidays'] = $holidaysStudent;
            $apply = $this->studentApplyService->findById($id);
            $apply->update(array("sub_total" => $data['sub_total'],
                "invoice_number" => $data['invoice_number'],
                "total_cost" => $data['total_cost'],
                "total_cost_php" => $data['total_cost_php'],
                "entrance_fee" => $data['entrance_fee'],
                "holiday_fee" => $data['holiday_fee'],
                "transfer_fee" => $data['transfer_fee'],
                "discount" => $data['discount'],
                "commission" => $data['commission'],
                "custom1_fee" => $data['custom1_fee'],
                "ecc" => $data['ecc'],
                "extention_fee_php" => $data['extention_fee_php'],
                "ssp_fee_php" => $data['ssp_fee_php'],
                "visa_fee_php" => $data['visa_fee_php'],
                "acri_fee_php" => $data['acri_fee_php'],
                "emigration_fee_php" => $data['immigration_fee_php'],
                "electrical_fee_php" => $data['electrical_fee_php'],
                "id_card" => $data['id_card'],
                "i_card_cost" => $data['i_card_cost'],
                "room_update_php" => $data['room_update_php'],
                "photocopy_php" => $data['photocopy_php'],
                "meal_total_php" => $data['meal_total_php'],
                "adjustments_php" => $data['adjustments_php'],
                "others_php" => $data['others_php'],
                "remittance_fee" => $data['remittance_fee'],
                "due_date" => date('Y-m-d H:i:s', strtotime($data['due_date'])),
                "departure_date" => date('Y-m-d H:i:s', strtotime($data['departure_date']))
            ));
            //remove discounts and commission when below are/is updated
            if($data['invoice_number']) {
                if($data['entrance_fee'] != $checkInvoiceValues['entrance_fee'] || $data['sub_total'] != $checkInvoiceValues['sub_total']
                    || $data['holiday_fee'] != $checkInvoiceValues['holiday_fee'] || $data['transfer_fee'] != $checkInvoiceValues['transfer_fee']) {
                    $data['commission'] = 0;
                    $data['commission_percentage'] = 0;
                    $data['discount'] = 0;
                    $discounts = $this->invoiceDiscountService->findByInvoiceNo($data['sa_id_number'], $data['invoice_number']);
                    foreach ($discounts as $list) {
                        $this->invoiceDiscountService->remove($list['id']);
                    }
                    $apply->update(array("discount" => $data['discount'], "commission" => $data['commission'], "commission_percentage" => $data['commission_percentage']));
                }
            }
            //update invoice number for invoice_discounts table
            if($data['invoice_number'] != $checkInvoiceValues['invoice_number']) {
                $invoiceNumber = $this->invoiceDiscountService->findByInvoiceNo($data['sa_id_number'], $checkInvoiceValues['invoice_number']);
                foreach ($invoiceNumber as $inv) {
                    $inv->update(array("student_invoice_no" => $data['invoice_number']));
                }
            }
            $invoiceUpdate = $this->invoiceService->findByApplyId($id);
            $this->createOperationLogs($datetime,"/app/admin/apply/","update-invoice/",$user,$invoiceUpdate,$data,$request);
            $invoiceUpdate->update($data);
            return response()->json(["message" => "invoice_update_successful"]);
        }
    }

    public function createOperationLogs($datetime,$search,$replace,$user,$paramsdata,$data,$request){
        $operations_log = array("created_time" => $datetime, "modified_time" => $datetime, "operator_id" => $user['id'], "email_address" => $user['email'], "user_name" => $user['name'],
            "method_name" => str_replace($search, $replace, $request->server('REQUEST_URI')), "params_json" => json_encode($paramsdata), "result_json" => json_encode($data),
            "remote_addr_ip" => $request->ip(), "request_uri" => $request->server('REQUEST_URI'), "user_agent" => $request->server('HTTP_USER_AGENT'), "server_name" => $request->server('SERVER_NAME'),
            "host_name" => $request->server('HTTP_HOST'));
        $this->changeLogService->create($operations_log);
    }

    public function getTotalNumberOfStudentsEnrolledPerWeek($dateFrom) {
        $generalValue = config('constants.general_value');
        $weekMap = array();
        $startDate = date('Y-m-d', strtotime($dateFrom. ' - 7 days'));
        for ($i = 0; $i <= 16; $i++) {
            $startWeekEnd = strtotime("next sunday, 12pm", strtotime($startDate));
            $endWeekEnd = strtotime("next saturday, 12pm", $startWeekEnd);
            $startDate = date("Y-m-d", $startWeekEnd);
            $endDate = date("Y-m-d", $endWeekEnd);
            $studentsTotalItTransfer = $this->studentApplyService->getTotalNumberOfTransferStudentsPerWeek(array("checkin_date" => $startDate, "checkout_date" => $endDate, "building_id" => $generalValue['it_park_school_id'], "transfer_to" => 'itp_to_sfc'));
            $studentsTotalSfTransfer = $this->studentApplyService->getTotalNumberOfTransferStudentsPerWeek(array("checkin_date" => $startDate, "checkout_date" => $endDate, "building_id" => $generalValue['sea_front_school_id'], "transfer_to" => 'sfc_to_itp'));
            $studentsTotalIt = $this->studentApplyService->getTotalNumberOfStudentsPerWeek(array("checkin_date" => $startDate, "checkout_date" => $endDate, "building_id" => $generalValue['it_park_school_id']));
            $studentsTotalSf = $this->studentApplyService->getTotalNumberOfStudentsPerWeek(array("checkin_date" => $startDate, "checkout_date" => $endDate, "building_id" => $generalValue['sea_front_school_id']));
            $itptotal = ($studentsTotalIt['totalNumberOfStudents'] - $studentsTotalItTransfer['totalNumberOfStudents']) + $studentsTotalSfTransfer['totalNumberOfStudents'];
            $sfctotal = ($studentsTotalSf['totalNumberOfStudents'] - $studentsTotalSfTransfer['totalNumberOfStudents']) + $studentsTotalItTransfer['totalNumberOfStudents'];
            $weekMap[$startDate] = array("arrive" => $startDate, "end" => $endDate, "itp" => $itptotal, "sfc" => $sfctotal, "total" => array_sum(array($itptotal, $sfctotal)));
        }
        $i = 0;
        $fourWeekHeader = array();
        $fourWeekBody = array();
        $fourWeekMap = array();
        foreach ($weekMap as $key => $item) {
            $fourWeekHeader[] = $key;
            $fourWeekBody[] = $item;
            $i++;
            if ($i % 16 == 0) {
                $fourWeekMap[] = array("weekday" => $fourWeekHeader, "weekcontent" => $fourWeekBody);
                $fourWeekHeader = array();
                $fourWeekBody = array();
            }
        }
        return response()->json($fourWeekMap);
    }

    public function getTotalNumbersOfEmptyBedsPerRoomType($dateFrom, $dateTo, $campus, $stayType) {
        $generalValue = config('constants.general_value');
        $RoomBedMap = array();$headerMap=array();
        switch ($stayType) {
            case 1:
                switch($campus) {
                    case 1:
                        array_push($RoomBedMap, $this->bedsService->getNumEmptyBed($generalValue['share_house_id'], $dateFrom, $dateTo, $generalValue['single_id'], $generalValue['male_id']), $this->bedsService->getNumEmptyBed($generalValue['share_house_id'], $dateFrom, $dateTo, $generalValue['single_id'], $generalValue['female_id']), $this->bedsService->getNumEmptyBed($generalValue['share_house_id'], $dateFrom, $dateTo, $generalValue['twin_id'], $generalValue['male_id']), $this->bedsService->getNumEmptyBed($generalValue['share_house_id'], $dateFrom, $dateTo, $generalValue['twin_id'], $generalValue['female_id']), $this->bedsService->getNumEmptyBed($generalValue['share_house_id'], $dateFrom, $dateTo, $generalValue['quad_id'], $generalValue['male_id']), $this->bedsService->getNumEmptyBed($generalValue['share_house_id'], $dateFrom, $dateTo, $generalValue['quad_id'], $generalValue['female_id']));
                        array_push($headerMap, "Share House Single[M]", "Share House Single[F]", "Share House Twin[M]", "Share House Twin[F]", "Share House Quad[M]", "Share House Quad[F]");break;
                    default:
                        array_push($RoomBedMap, $this->bedsService->getNumEmptyBed($generalValue['share_room_id'], $dateFrom, $dateTo, $generalValue['single_id'], $generalValue['male_id']), $this->bedsService->getNumEmptyBed($generalValue['share_room_id'], $dateFrom, $dateTo, $generalValue['single_id'], $generalValue['female_id']), $this->bedsService->getNumEmptyBed($generalValue['share_room_id'], $dateFrom, $dateTo, $generalValue['twin_id'], $generalValue['male_id']), $this->bedsService->getNumEmptyBed($generalValue['share_room_id'], $dateFrom, $dateTo, $generalValue['twin_id'], $generalValue['female_id']), $this->bedsService->getNumEmptyBed($generalValue['share_room_id'], $dateFrom, $dateTo, $generalValue['quad_id'], $generalValue['male_id']), $this->bedsService->getNumEmptyBed($generalValue['share_room_id'], $dateFrom, $dateTo, $generalValue['quad_id'], $generalValue['female_id']), $this->bedsService->getNumEmptyBed($generalValue['share_room_id'], $dateFrom, $dateTo, $generalValue['hex_id'], $generalValue['male_id']), $this->bedsService->getNumEmptyBed($generalValue['share_room_id'], $dateFrom, $dateTo, $generalValue['hex_id'], $generalValue['female_id']), $this->bedsService->getNumEmptyBed($generalValue['executive_id'], $dateFrom, $dateTo, null, null), $this->bedsService->getNumEmptyBed($generalValue['deluxe_id'], $dateFrom, $dateTo, null, null));
                        array_push($headerMap, "Share Room Single[M]","Share Room Single[F]", "Share Room Twin[M]","Share Room Twin[F]", "Share Room Quad[M]","Share Room Quad[F]", "Share Room Hex[M]","Share Room Hex[F]","Executive Room","Deluxe Room");break;
                }
                break;
            case 2:
                array_push($RoomBedMap,$this->condoBedsService->getNumEmptyBed($generalValue['condo_id'], $dateFrom, $dateTo, $generalValue['quad_id'], null));
                array_push($headerMap, "Condo Quad");break;
            case 3:
                array_push($RoomBedMap, $this->hotelsBedsService->getNumEmptyBed($generalValue['hotel_a_id'], $dateFrom, $dateTo, $generalValue['triple_id'], null), $this->hotelsBedsService->getNumEmptyBed($generalValue['hotel_w_id'], $dateFrom, $dateTo, $generalValue['triple_id'], null));
                array_push($headerMap, "Alba Uno Hotel", "Waterfront Hotel");break;
            default:
                switch($campus) {
                    case 1:
                        array_push($RoomBedMap,$this->walkinBedsService->getNumEmptyBed($generalValue['itp_walkin_id'], $dateFrom, $dateTo, $generalValue['single_id'], null));break;
                    default:
                        array_push($RoomBedMap, $this->walkinBedsService->getNumEmptyBed($generalValue['sfc_walkin_id'], $dateFrom, $dateTo, $generalValue['single_id'], null));break;
                }
                array_push($headerMap, "Walkin");break;
        }
        return response()->json(array("headers" => $headerMap, "contents" => $RoomBedMap));
    }

    private function getMapKeyForRoomBed($item) {
        return $item["building_id"] . "_" . $item["room_id"] . "_" . $item["gender"];
    }

    private function getMapKeyForRoomAccommodation($item) {
        return $item["building_id"] . "_" . $item["room_id"] . "_" . $item["accommodationId"]. "_" . $item["gender"];
    }

    private function getMapKeyForRoomAccommodationId($item) {
        return $item["building_id"] . "_" . $item["room_id"] . "_" . $item["accommodationId"];
    }

    private function getMapKeyForRoomBedNoGender($item) {
        return $item["building_id"] . "_" . $item["room_id"];
    }

    public function getRemainingTotalNumbersPerRoomType($dateFrom, $campus, $stayType) {
        $generalValue = config('constants.general_value');
        $RoomBedMap = array();$fourWeekMap=array();$CondoBedMap = array();$condoWeekMap=array();
        $HotelBedMap = array();$hotelWeekMap=array();$WalkinBedMap = array();$walkinWeekMap=array();
        switch ($stayType) {
            case 1:
                $totalDormitoryBedList = $this->bedsService->getTotalRoomTypeBedFilterGender($campus,null);
                foreach($totalDormitoryBedList as $item) {
                    switch ($item['accommodationId']) {
                        case $generalValue['executive_id']:
                        case $generalValue['deluxe_id']: list($RoomBedMap, $fourWeekMap) = $this->getDormitoryTotalEmptyBedsByAccommodation($totalDormitoryBedList, $dateFrom, $campus);break;
                        default: list($RoomBedMap, $fourWeekMap) = $this->getDormitoryTotalEmptyBeds($totalDormitoryBedList, $dateFrom, $campus);break;
                    }
                }
                break;
            case 2:
                $totalCondoBedList = $this->condoBedsService->getTotalRoomTypeBed($campus);
                list($CondoBedMap, $condoWeekMap) = $this->getCondoTotalEmptyBeds($totalCondoBedList, $dateFrom, $campus);break;
            case 3:
                $totalHotelBedList = $this->hotelsBedsService->getTotalRoomTypeBed($campus);
                list($HotelBedMap, $hotelWeekMap) = $this->getHotelTotalEmptyBeds($totalHotelBedList, $dateFrom, $campus);break;
            default:
                $totalWalkinBedList = $this->walkinBedsService->getTotalRoomTypeBed($campus);
                list($WalkinBedMap, $walkinWeekMap) = $this->getWalkinTotalEmptyBeds($totalWalkinBedList, $dateFrom, $campus);break;
        }

        return response()->json(array("roomTypeKeyList" => array_keys($RoomBedMap), "roomTypeList" => $RoomBedMap, "roomWeekList" => $fourWeekMap, "condoKeyList" => array_keys($CondoBedMap), "condoList" => $CondoBedMap, "condoWeekList" => $condoWeekMap,
            "hotelKeyList" => array_keys($HotelBedMap), "hotelList" => $HotelBedMap, "hotelWeekList" => $hotelWeekMap, "walkinKeyList" => array_keys($WalkinBedMap), "walkinList" => $WalkinBedMap, "walkinWeekList" => $walkinWeekMap));
    }

    /**
     * @param $totalDormitoryBedList
     * @param $data
     * @return array
     */
    public function getDormitoryTotalEmptyBeds($totalDormitoryBedList, $dateFrom, $campus) {
        $RoomBedMap = array();
        foreach ($totalDormitoryBedList as $item) {
            $key = $this->getMapKeyForRoomBed($item);
            $RoomBedMap[$key] = $item;
        }

        $weekMap = array();
        $startDate = date('Y-m-d', strtotime($dateFrom. ' - 7 days'));

        $RoomBedMapStr = serialize($RoomBedMap);
        for ($i = 0; $i <= 12; $i++) {
            $startWeekEnd = strtotime("next sunday, 12pm", strtotime($startDate));
            $endWeekEnd = strtotime("next saturday, 12pm", $startWeekEnd);
            $startDate = date("Y-m-d", $startWeekEnd);
            $weekMap[$startDate] = array("start" => $startWeekEnd, "end" => $endWeekEnd, "roomList" => unserialize($RoomBedMapStr));
        }

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
                "gender" => $item["gender"]
            ));

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
            // reduce down room by room reservation
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
        return array($RoomBedMap, $fourWeekMap);
    }


    /**
     * @param $totalDormitoryBedList
     * @param $data
     * @return array
     */
    public function getDormitoryTotalEmptyBedsByAccommodation($totalDormitoryBedList, $dateFrom, $campus) {
        $RoomBedMap = array();
        foreach ($totalDormitoryBedList as $item) {
            $key = $this->getMapKeyForRoomAccommodation($item);
            $RoomBedMap[$key] = $item;
        }
        $weekMap = array();
        $startDate = date('Y-m-d', strtotime($dateFrom . ' - 7 days'));

        $RoomBedMapStr = serialize($RoomBedMap);
        for ($i = 0; $i <= 12; $i++) {
            $startWeekEnd = strtotime("next sunday, 12pm", strtotime($startDate));
            $endWeekEnd = strtotime("next saturday, 12pm", $startWeekEnd);
            $startDate = date("Y-m-d", $startWeekEnd);
            $weekMap[$startDate] = array("start" => $startWeekEnd, "end" => $endWeekEnd, "roomList" => unserialize($RoomBedMapStr));
        }

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
            $key = $this->getMapKeyForRoomAccommodation(array(
                "building_id" => $item["campus"],
                "room_id" => $item["room_id"],
                "accommodationId" => $item["accommodation_id"],
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
            // reduce down room by room reservation
            while ($checkinWeek <= $checkoutWeek) {
                $startDate = date("Y-m-d", $checkinWeek);
                if (array_key_exists($startDate, $weekMap)) {
                    if(empty($item['gender'])) {
                        $weekArray = $weekMap[$startDate];
                        $total = $weekArray["roomList"][$key]["total"] - 1;
                        $weekArray["roomList"][$key]["total"] = $total;
                        $weekMap[$startDate] = $weekArray;
                    }

                    if(!empty($item['gender'])) {
                        $weekArray = $weekMap[$startDate];
                        $total = $weekArray["roomList"][$key]["total"] - 1;
                        $weekArray["roomList"][$key]["total"] = $total;
                        $weekMap[$startDate] = $weekArray;
                    }
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
        return array($RoomBedMap, $fourWeekMap);
    }

    /**
     * @param $totalCondoBedList
     * @param $data
     * @return array
     */
    public function getCondoTotalEmptyBeds($totalCondoBedList, $dateFrom, $campus) {
        $CondoBedMap = array();
        foreach ($totalCondoBedList as $item) {
            $key = $this->getMapKeyForRoomBedNoGender($item);
            $CondoBedMap[$key] = $item;
        }
        $weekMap = array();
        $startDate = date('Y-m-d', strtotime($dateFrom . ' - 7 days'));

        $RoomBedMapStr = serialize($CondoBedMap);
        for ($i = 0; $i <= 12; $i++) {
            $startWeekEnd = strtotime("next sunday, 12pm", strtotime($startDate));
            $endWeekEnd = strtotime("next saturday, 12pm", $startWeekEnd);
            $startDate = date("Y-m-d", $startWeekEnd);
            $weekMap[$startDate] = array("start" => $startWeekEnd, "end" => $endWeekEnd, "roomList" => unserialize($RoomBedMapStr));
        }

        $listKey = array_keys($weekMap);
        $firstWeek = $weekMap[$listKey[0]];
        $lastWeek = $weekMap[$listKey[count($listKey) - 1]];
        $startTime = $firstWeek["start"];
        $endTime = $lastWeek["end"];
        $listReservation = $this->condoReservationService->searchReserved(array(
            "checkin_date" => date("Y-m-d", $startTime),
            "checkout_date" => date("Y-m-d", $endTime),
            "building_id" => $campus));

        foreach ($listReservation as $item) {
            $dateFrom = $item["date_from"];
            $dateTo = $item["date_to"];
            $key = $this->getMapKeyForRoomBedNoGender(array(
                "building_id" => $item["campus"],
                "room_id" => $item["room_id"]));

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
            // reduce down room by room reservation
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
        $condoWeekMap = array();
        foreach ($weekMap as $key => $item) {
            $fourWeekHeader[] = $key;
            $fourWeekBody[] = $item;
            $i++;
            if ($i % 12 == 0) {
                $condoWeekMap[] = array("weekday" => $fourWeekHeader, "weekcontent" => $fourWeekBody);
                $fourWeekHeader = array();
                $fourWeekBody = array();
            }

        }
        return array($CondoBedMap, $condoWeekMap);
    }

    /**
     * @param $totalWalkinBedList
     * @param $data
     * @return array
     */
    public function getWalkinTotalEmptyBeds($totalWalkinBedList, $dateFrom, $campus) {
        $WalkinBedMap = array();
        foreach ($totalWalkinBedList as $item) {
            $key = $this->getMapKeyForRoomBedNoGender($item);
            $WalkinBedMap[$key] = $item;
        }
        $weekMap = array();
        $startDate = date('Y-m-d', strtotime($dateFrom . ' - 7 days'));

        $RoomBedMapStr = serialize($WalkinBedMap);
        for ($i = 0; $i <= 12; $i++) {
            $startWeekEnd = strtotime("next sunday, 12pm", strtotime($startDate));
            $endWeekEnd = strtotime("next saturday, 12pm", $startWeekEnd);
            $startDate = date("Y-m-d", $startWeekEnd);
            $weekMap[$startDate] = array("start" => $startWeekEnd, "end" => $endWeekEnd, "roomList" => unserialize($RoomBedMapStr));
        }

        $listKey = array_keys($weekMap);
        $firstWeek = $weekMap[$listKey[0]];
        $lastWeek = $weekMap[$listKey[count($listKey) - 1]];
        $startTime = $firstWeek["start"];
        $endTime = $lastWeek["end"];
        $listReservation = $this->walkinReservationService->searchReserved(array(
            "checkin_date" => date("Y-m-d", $startTime),
            "checkout_date" => date("Y-m-d", $endTime),
            "building_id" => $campus));

        foreach ($listReservation as $item) {
            $dateFrom = $item["date_from"];
            $dateTo = $item["date_to"];
            $key = $this->getMapKeyForRoomBedNoGender(array(
                "building_id" => $item["campus"],
                "room_id" => $item["room_id"]));

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
            // reduce down room by room reservation
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
        $walkinWeekMap = array();
        foreach ($weekMap as $key => $item) {
            $fourWeekHeader[] = $key;
            $fourWeekBody[] = $item;
            $i++;
            if ($i % 12 == 0) {
                $walkinWeekMap[] = array("weekday" => $fourWeekHeader, "weekcontent" => $fourWeekBody);
                $fourWeekHeader = array();
                $fourWeekBody = array();
            }

        }
        return array($WalkinBedMap, $walkinWeekMap);
    }

    /**
     * @param $totalHotelBedList
     * @param $data
     * @return array
     */
    public function getHotelTotalEmptyBeds($totalHotelBedList, $dateFrom, $campus) {
        $HotelBedMap = array();
        foreach ($totalHotelBedList as $item) {
            $key = $this->getMapKeyForRoomAccommodationId($item);
            $HotelBedMap[$key] = $item;
        }
        $weekMap = array();
        $startDate = date('Y-m-d', strtotime($dateFrom . ' - 7 days'));

        $RoomBedMapStr = serialize($HotelBedMap);
        for ($i = 0; $i <= 12; $i++) {
            $startWeekEnd = strtotime("next sunday, 12pm", strtotime($startDate));
            $endWeekEnd = strtotime("next saturday, 12pm", $startWeekEnd);
            $startDate = date("Y-m-d", $startWeekEnd);
            $weekMap[$startDate] = array("start" => $startWeekEnd, "end" => $endWeekEnd, "roomList" => unserialize($RoomBedMapStr));
        }

        $listKey = array_keys($weekMap);
        $firstWeek = $weekMap[$listKey[0]];
        $lastWeek = $weekMap[$listKey[count($listKey) - 1]];
        $startTime = $firstWeek["start"];
        $endTime = $lastWeek["end"];
        $listReservation = $this->hotelsReservationService->searchReserved(array(
            "checkin_date" => date("Y-m-d", $startTime),
            "checkout_date" => date("Y-m-d", $endTime),
            "building_id" => $campus));
        foreach ($listReservation as $item) {
            $dateFrom = $item["date_from"];
            $dateTo = $item["date_to"];
            $key = $this->getMapKeyForRoomAccommodationId(array(
                "building_id" => $item["campus"],
                "room_id" => $item["room_id"],
                "accommodationId" => $item["accommodation_id"]));

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
            // reduce down room by room reservation
            while ($checkinWeek <= $checkoutWeek) {
                $startDate = date("Y-m-d", $checkinWeek);
                if (array_key_exists($startDate, $weekMap)) {
                    if(empty($item['gender'])) {
                        $weekArray = $weekMap[$startDate];
                        $total = $weekArray["roomList"][$key]["total"] - 1;
                        $weekArray["roomList"][$key]["total"] = $total;
                        $weekMap[$startDate] = $weekArray;
                    }
                }
                $checkinWeek = strtotime("next sunday, 12pm", $checkinWeek);
            }
        }
        $i = 0;
        $fourWeekHeader = array();
        $fourWeekBody = array();
        $hotelWeekMap = array();
        foreach ($weekMap as $key => $item) {
            $fourWeekHeader[] = $key;
            $fourWeekBody[] = $item;
            $i++;
            if ($i % 12 == 0) {
                $hotelWeekMap[] = array("weekday" => $fourWeekHeader, "weekcontent" => $fourWeekBody);
                $fourWeekHeader = array();
                $fourWeekBody = array();
            }

        }
        return array($HotelBedMap, $hotelWeekMap);
    }

    public function calculateAvailRooms($roomsTotal, $countOccupiedRooms) {
        return floor($roomsTotal - $countOccupiedRooms);
    }

    public function createInvoiceDiscount($applyId, $discount,$reason,$invoiceNumber) {
        $user = \Request::get('user');
        $today=date("Y-m-d h:i:s");
        $invoiceArray = array(
            "student_invoice_no" => $invoiceNumber, "apply_id" => $applyId, "discount" => $discount, "who_discounted" => $user['email'],
            "reason" => urldecode($reason), "created_at" => $today, "updated_at" => $today
        );
        $invoice = $this->invoiceDiscountService->create($invoiceArray);
        return response()->json(["message" => "created_successfully", "data" => $invoice]);
    }

    public function deleteInvoiceDiscount($applyId, $id,$invoiceNumber,$discountAmount) {
        $apply = $this->studentApplyService->findByInvoiceNo($applyId, $invoiceNumber);
        $invoice = $this->invoiceService->findByInvoiceNo($applyId, $invoiceNumber);
        $currentDiscount = $apply['discount'] - $discountAmount;
        $currentDiscountInvoice = $invoice['discount'] - $discountAmount;
        $apply->update(array("discount" => $currentDiscount));
        $invoice->update(array("discount" => $currentDiscountInvoice));
        $deleteInvoice = $this->invoiceDiscountService->remove($id);
        return response()->json(["message" => "discount_deleted_successfully", "data" => $deleteInvoice]);
    }

    public function deleteExtInvoiceDiscount($applyId, $id,$invoiceNumber,$discountAmount) {
        $apply = $this->extensionInvoiceService->findByInvoiceNo($applyId, $invoiceNumber);
        $currentDiscount = $apply['ext_discount'] - $discountAmount;
        $apply->update(array("ext_discount" => $currentDiscount));
        $deleteInvoice = $this->invoiceDiscountService->remove($id);
        return response()->json(["message" => "extension_discount_deleted_successfully", "data" => $deleteInvoice]);
    }

    public function deleteRfdInvoiceDiscount($applyId, $id,$invoiceNumber,$discountAmount) {
        $apply = $this->refundInvoiceService->findByInvoiceNo($applyId, $invoiceNumber);
        $currentDiscount = $apply['rfd_discount'] - $discountAmount;
        $apply->update(array("rfd_discount" => $currentDiscount));
        $deleteInvoice = $this->invoiceDiscountService->remove($id);
        return response()->json(["message" => "refund_discount_deleted_successfully", "data" => $deleteInvoice]);
    }

    public function updateApplyDiscount($applyId,$totalInvoice) {
        $apply = $this->studentApplyService->findById($applyId);
        $invoice = $this->invoiceService->findByApplyId($applyId);
        $apply->update(array("discount" => $totalInvoice));
        $invoice->update(array("discount" => $totalInvoice));
        return response()->json(["message" => "apply_discount_update_successfully", "data" => $apply]);
    }

    public function updateExtInvDiscount($applyId,$totalInvoice) {
        $apply = $this->extensionInvoiceService->findByApplyId($applyId);
        $apply->update(array("ext_discount" => $totalInvoice));
        return response()->json(["message" => "ext_invoice_discount_update_successfully", "data" => $apply]);
    }

    public function updateRfdInvDiscount($applyId,$totalInvoice) {
        $apply = $this->refundInvoiceService->findByApplyId($applyId);
        $apply->update(array("rfd_discount" => $totalInvoice));
        return response()->json(["message" => "rfd_invoice_discount_update_successfully", "data" => $apply]);
    }

    public function updateApplyCommission($commissionReason,$commission,$commissionPercentage,$applyId) {
        $apply = $this->studentApplyService->findById($applyId);
        $invoice = $this->invoiceService->findByApplyId($applyId);
        $apply->update(array("commission" => $commission, "commission_reason" => $commissionReason, "commission_percentage" => $commissionPercentage));
        $invoice->update(array("commission" => $commission, "commission_reason" => $commissionReason, "commission_percentage" => $commissionPercentage));
        if($commissionReason == 'blank'){
            $apply->update(array("commission_reason" => null));
            $invoice->update(array("commission_reason" => null));
        }
        return response()->json(["message" => "apply_commission_update_successfully", "data" => $apply]);
    }

    public function updateApplyExtInvCommission($applyId,$commission,$commissionPercentage) {
        $apply = $this->extensionInvoiceService->findByApplyId($applyId);
        $apply->update(array("ext_agent_commission" => $commission, "ext_commission_percentage" => $commissionPercentage));
        return response()->json(["message" => "apply_extension_invoice_commission_update_successfully", "data" => $apply]);
    }

    public function updateApplyRfdInvCommission($applyId,$commission,$commissionPercentage) {
        $apply = $this->refundInvoiceService->findByApplyId($applyId);
        $apply->update(array("rfd_agent_commission" => $commission, "rfd_commission_percentage" => $commissionPercentage));
        return response()->json(["message" => "apply_refund_invoice_commission_update_successfully", "data" => $apply]);
    }

    public function confirmGAPaymentStatus($applyId) {
        $user = \Request::get('user');
        $apply = $this->studentApplyService->findById($applyId);
        $apply->update(array("ga_payment_status" => 1, "ga_payment_confirm_by" => $user['name']));
        return response()->json(["message" => "ga_payment_confirm_update_successfully", "data" => $apply]);
    }

    public function confirmInvoicePaymentStatus($applyId) {
        $user = \Request::get('user');
        $apply = $this->studentApplyService->findById($applyId);
        $apply->update(array("invoice_payment_status" => 1, "invoice_payment_confirm_by" => $user['name']));
        return response()->json(["message" => "invoice_payment_confirm_update_successfully", "data" => $apply]);
    }

    public function bookingRoom($roomMemo,$reserveStatusId, $dormBldg, $visitorType, $accommodationId, $roomId, $checkIn, $checkOut, $applyId) {
        $apply = $this->studentApplyService->findById($applyId);
        $today = date("Y-m-d H:i:s");
        $user = \Request::get('user');

        if($accommodationId == 9){
            //For Condo Rooms in ITP
            $bed = $this->condoBedsService->findById($roomId);
            $dormitoryRoom = $this->condoRoomsService->getDormitoryRoomById($bed["condo_room_id"]);
            $roomType = '(hex)';
            if($dormitoryRoom['room_id'] == 1 || $dormitoryRoom['room_id'] == 2){
                $roomType = $dormitoryRoom['room_id'] == 1 ? '(single)':'(twin)';
            } else if($dormitoryRoom['room_id'] == 3 || $dormitoryRoom['room_id'] == 4){
                $roomType = $dormitoryRoom['room_id'] == 3 ? '(triple)':'(quad)';
            }
            $this->saveOrUpdateRoomReservation($roomMemo,$reserveStatusId, $apply, $roomId, $checkIn, $checkOut, $dormBldg, $visitorType,$accommodationId);
            //clean existing dormitory name from import
            if ($apply['dormitory_room_name'] && !($apply['dormitory_room_id'])) { $apply['dormitory_room_name'] = ''; }
            $reservationLogArray = array("student_id" => $apply['id'], "user" => $user['name'], "email_address" => $user['email'], "bldg" => $dormBldg == 1 ? 'ITP' : 'SFC',
                "room" => $dormitoryRoom->name, "action" => "Add", "start_date" => $checkIn, "end_date" => $checkOut, "created_at" => $today, "updated_at" => $today);
            //save in reservation_logs table
            $this->reservationLogService->create($reservationLogArray);
            $apply->update(array("dormitory_room_name" => $apply['dormitory_room_name'] . "," .$dormitoryRoom->name.$roomType, "dormitory_room_id" => $bed->id));
            $saveFile = null;

        } else if ($accommodationId != 2 && $accommodationId != 3 && $accommodationId != 7 && $accommodationId != 8) {
            //For Share House, Room, Executive and Dexluxe in ITP and SFC
            $bed = $this->bedsService->findById($roomId);
            $dormitoryRoom = $this->dormitoryRoomsService->getDormitoryRoomById($bed["dormitory_room_id"]);
            $roomType = '(hex)';
            if($dormitoryRoom['room_id'] == 1 || $dormitoryRoom['room_id'] == 2){
                $roomType = $dormitoryRoom['room_id'] == 1 ? '(single)':'(twin)';
            } else if($dormitoryRoom['room_id'] == 3 || $dormitoryRoom['room_id'] == 4){
                $roomType = $dormitoryRoom['room_id'] == 3 ? '(triple)':'(quad)';
            }
            $this->saveOrUpdateRoomReservation($roomMemo,$reserveStatusId, $apply, $roomId, $checkIn, $checkOut,$dormBldg, $visitorType, $accommodationId);
            //clean existing dormitory name from import
            if ($apply['dormitory_room_name'] && !($apply['dormitory_room_id'])) { $apply['dormitory_room_name'] = ''; }
            $reservationLogArray = array("student_id" => $apply['id'], "user" => $user['name'], "email_address" => $user['email'], "bldg" => $dormBldg == 1 ? 'ITP' : 'SFC',
                "room" => $dormitoryRoom->name, "action" => "Add", "start_date" => $checkIn, "end_date" => $checkOut, "created_at" => $today, "updated_at" => $today);
            //save in reservation_logs table
            $this->reservationLogService->create($reservationLogArray);
            $apply->update(array("dormitory_room_name" => $apply['dormitory_room_name'] . "," .$dormitoryRoom->name.$roomType, "dormitory_room_id" => $bed->id));
            $saveFile = null;

        } else {
            //For Hotels and Walkin in ITP and SFC
            if($accommodationId == 7 || $accommodationId == 8) {
                $bed = $this->walkinBedsService->findById($roomId);
                $dormitoryRoom = $this->walkinRoomsService->getDormitoryRoomById($bed["walkin_room_id"]);
            } else {
                $bed = $this->hotelsBedsService->findById($roomId);
                $dormitoryRoom = $this->hotelsRoomsService->getDormitoryRoomById($bed["hotels_room_id"]);
            }
            $roomType = '(hex)';
            if($dormitoryRoom['room_id'] == 1 || $dormitoryRoom['room_id'] == 2){
                $roomType = $dormitoryRoom['room_id'] == 1 ? '(single)':'(twin)';
            } else if($dormitoryRoom['room_id'] == 3 || $dormitoryRoom['room_id'] == 4){
                $roomType = $dormitoryRoom['room_id'] == 3 ? '(triple)':'(quad)';
            }
            $this->saveOrUpdateRoomReservation($roomMemo,$reserveStatusId, $apply, $roomId, $checkIn, $checkOut, $dormBldg, $visitorType,$accommodationId);
            //clean existing dormitory name from import
            if ($apply['dormitory_room_name'] && !($apply['dormitory_room_id'])) { $apply['dormitory_room_name'] = ''; }
            $reservationLogArray = array("student_id" => $apply['id'], "user" => $user['name'], "email_address" => $user['email'], "bldg" => $dormBldg == 1 ? 'ITP' : 'SFC',
                "room" => $dormitoryRoom->name, "action" => "Add", "start_date" => $checkIn, "end_date" => $checkOut, "created_at" => $today, "updated_at" => $today);
            //save in reservation_logs table
            $this->reservationLogService->create($reservationLogArray);
            //clean existing dormitory name & hotel name from import
            if ($apply['dormitory_room_name'] && !($apply['dormitory_room_id'])) { $apply['dormitory_room_name'] = ''; }
            if ($apply['hotel_name'] && !($apply['dormitory_room_id'])) { $apply['hotel_name'] = ''; }

            $apply->update(array("dormitory_room_name" => $apply['dormitory_room_name'] . "," .$dormitoryRoom->name.$roomType, "dormitory_room_id" => $bed->id));
            $saveFile = null;
        }
        return response()->json(["message" => "update_successfully", "data" => $apply]);
    }

    private function saveOrUpdateRoomReservation($roomMemo,$reserveStatusId, $apply, $dormitoryRoomId, $checkIn, $checkOut, $dormBldg, $visitorType, $accommodationId) {
        $user = \Request::get('user');
        $nationalityId = $this->getNationalityId($apply['country_code']);
        $parRight =  $apply['camp_name']?'[':''; $parLeft =  $apply['camp_name']?']':'';
        $nameMemoUpdate = $apply['passport_name']?$apply['passport_name']:$apply['student_name'];
        $otherMemo = '/' . ($apply['sex'] === 1 ? 'Male' : 'Female'). $parRight . $apply['camp_name'] . $parLeft;
        $memoUpdate = $nameMemoUpdate.$otherMemo;
        if($roomMemo != 'EMPTY') { $memoUpdate = $nameMemoUpdate.$otherMemo. '/' . $roomMemo; }
        switch($accommodationId) {
            case 2:
            case 3:
                $dataArray = array("building_id" => $dormBldg, "visitor_type" => $visitorType, "hotels_bed_id" => $dormitoryRoomId, "date_from" => $checkIn, "date_to" => $checkOut,
                    "reservation_status_id" => $reserveStatusId, "memo" => $memoUpdate, "nationality_id" => $nationalityId, "created_user" => $user['id'], "updated_user" => $user['id']);
                $result = $this->hotelsReservationService->create($dataArray);
                $apply->hotelsRoomReservationList()->save($result);
                break;
            case 7:
            case 8:
                $dataArray = array("building_id" => $dormBldg, "visitor_type" => $visitorType, "walkin_bed_id" => $dormitoryRoomId, "date_from" => $checkIn, "date_to" => $checkOut,
                    "reservation_status_id" => $reserveStatusId, "memo" => $memoUpdate, "nationality_id" => $nationalityId, "created_user" => $user['id'], "updated_user" => $user['id']);
                $result = $this->walkinReservationService->create($dataArray);
                $apply->walkinRoomReservationList()->save($result);
                break;
            case 9:
                $dataArray = array("building_id" => $dormBldg, "visitor_type" => $visitorType, "condo_bed_id" => $dormitoryRoomId, "date_from" => $checkIn, "date_to" => $checkOut,
                    "reservation_status_id" => $reserveStatusId, "memo" => $memoUpdate, "nationality_id" => $nationalityId, "created_user" => $user['id'], "updated_user" => $user['id']);
                $result = $this->condoReservationService->create($dataArray);
                $apply->condoRoomReservationList()->save($result);
                break;
            default:
                $dataArray = array("building_id" => $dormBldg, "visitor_type" => $visitorType, "bed_id" => $dormitoryRoomId, "date_from" => $checkIn, "date_to" => $checkOut,
                    "reservation_status_id" => $reserveStatusId, "memo" => $memoUpdate, "nationality_id" => $nationalityId, "created_user" => $user['id'], "updated_user" => $user['id']);
                $result = $this->reservationService->create($dataArray);
                $apply->dormitoryRoomReservationList()->save($result);
                break;
        }
        return $result;
    }

    public function retrieveRoomList($accommodationId,$dormBldg,$dormRoomType,$checkInDate,$checkOutDate,$visitorType,$searchFilter,$applyId) {
        $apply = $this->studentApplyService->findById($applyId);
        $countStudentDorm = 0;$countStudentOthers = 0;$countStudentWalkin = 0;
        $countStudentInternITP = 0;$countStudentInternSFC = 0;

        $cafeListDorm = $this->studentApplyService->getCafeListDorm($checkInDate,$checkOutDate,$dormBldg,0);
        $cafeListOthers = $this->studentApplyService->getCafeListOthers($checkInDate,$checkOutDate,$dormBldg,0,$accommodationId);
        //ITP
        $cafeListOthersAlbaUno = $this->studentApplyService->getCafeListOthers($checkInDate,$checkOutDate,1,0,2); //Alba Uno
        $cafeListOthersWaterfront = $this->studentApplyService->getCafeListOthers($checkInDate,$checkOutDate,1,0,3); //Waterfront
        $cafeListOthersWalkinITP = $this->studentApplyService->getCafeListOthers($checkInDate,$checkOutDate,1,0,7); //Walkin ITP
        //SFC
        $cafeListOthersWalkinSFC = $this->studentApplyService->getCafeListOthers($checkInDate,$checkOutDate,2,0,8); //Walkin SFC

        $availBedList = $this->bedsService->getListBedsByFilterForStudentApply($accommodationId,$dormBldg,$apply['sex'],$dormRoomType);//filter by gender, room_type, building(it/sf)
        $listResv = $this->reservationService->searchDormitoryReserved($dormBldg,$checkInDate,$checkOutDate,$apply);

        $prevWkCheckin = date('Y-m-d', strtotime('last Sunday', strtotime($checkInDate)));
        $prevWkCheckout = date('Y-m-d', strtotime('last Saturday', strtotime($checkInDate)));
        $nextWkCheckin = date('Y-m-d', strtotime('next Sunday', strtotime($checkOutDate)));
        $nextWkCheckout = date('Y-m-d', strtotime('next Saturday', strtotime($checkOutDate)));
        $listResvPrevWeek = $this->reservationService->searchDormitoryReserved($dormBldg,$prevWkCheckin,$prevWkCheckout,$apply);
        $listResvNextWeek = $this->reservationService->searchDormitoryReserved($dormBldg,$nextWkCheckin,$nextWkCheckout,$apply);

        $mapResv = array();
        foreach ($listResv as $resv) {
            $mapResv[$resv["bed_id"]] = $resv;
        }

        $mapResvPrev = array();
        foreach ($listResvPrevWeek as $resv) {
            $mapResvPrev[$resv["bed_id"]] = $resv;
        }

        $mapResvNext = array();
        foreach ($listResvNextWeek as $resv) {
            $mapResvNext[$resv["bed_id"]] = $resv;
        }

        $filterBedList = array(); $filterBedListUnfiltered = array();
        foreach ($availBedList as $item) {
            if (!array_key_exists($item['id'], $mapResv)) {
                if($searchFilter == 1) {
                    if (array_key_exists($item['id'], $mapResvPrev) || array_key_exists($item['id'], $mapResvNext)) {
                        $filterBedList[] = $item;
                    }
                } else {
                    $filterBedListUnfiltered[]  = $item;
                }
            }
        }

        list($countStudentDorm, $countStudentOthers, $countStudentWalkin, $countStudentInternITP,$countStudentInternSFC) =
            $this->countStudents($cafeListDorm, $countStudentDorm, $cafeListOthers, $countStudentOthers,
                $countStudentWalkin, $cafeListOthersAlbaUno, $countStudentInternITP,$countStudentInternSFC,
                $cafeListOthersWaterfront, $cafeListOthersWalkinITP, $cafeListOthersWalkinSFC);

        if($dormBldg == 1) {
            $totalAllCombine = $countStudentDorm + $countStudentInternITP;
        } else {
            $totalAllCombine = $countStudentDorm + $countStudentInternSFC;
        }

        if($accommodationId == 2 || $accommodationId == 3) {
            // Alba Uno and Waterfront Retrieve Available rooms
            $availHotelsBedList = $this->hotelsBedsService->getListBedsByFilterForStudentApply($accommodationId,$dormBldg,$apply['sex'],$dormRoomType);//filter by gender, room_type, building(it/sf)
            $listResv = $this->hotelsReservationService->searchDormitoryReserved($dormBldg,$checkInDate,$checkOutDate,$apply);

            $mapHotelsResv = array();
            foreach ($listResv as $resv) {
                $mapHotelsResv[$resv["hotels_bed_id"]] = $resv;
            }

            $filterHotelsBedList = array();
            foreach ($availHotelsBedList as $item) {
                if (!array_key_exists($item['id'], $mapHotelsResv)) {
                    $filterHotelsBedList[] = $item;
                }
            }

            return response()->json(array("filderBedList" => $filterHotelsBedList, "countStudentDorm" => $totalAllCombine,
                "countStudentOthers" => $countStudentOthers,"countStudentWalkin" => $countStudentWalkin));
        }

        if($accommodationId == 7 || $accommodationId == 8) {
            // IT and SFC Walk-in Retrieve Available rooms
            $availWalkinBedList = $this->walkinBedsService->getListBedsByFilterForStudentApply($accommodationId,$dormBldg,$apply['sex'],$dormRoomType);//filter by gender, room_type, building(it/sf)
            $listResv = $this->walkinReservationService->searchDormitoryReserved($dormBldg,$checkInDate,$checkOutDate,$apply);

            $mapWalkinResv = array();
            foreach ($listResv as $resv) {
                $mapWalkinResv[$resv["walkin_bed_id"]] = $resv;
            }

            $filterWalkinBedList = array();
            foreach ($availWalkinBedList as $item) {
                if (!array_key_exists($item['id'], $mapWalkinResv)) {
                    $filterWalkinBedList[] = $item;
                }
            }

            return response()->json(array("filderBedList" => $filterWalkinBedList, "countStudentDorm" => $totalAllCombine,
                "countStudentOthers" => $countStudentOthers,"countStudentWalkin" => $countStudentWalkin));
        }

        if($accommodationId == 9) {
            // Condo Retrieve Available rooms
            $availCondoBedList = $this->condoBedsService->getListBedsByFilterForStudentApply($accommodationId,$dormBldg,$apply['sex'],$dormRoomType);//filter by gender, room_type, building(it/sf)
            $listResv = $this->condoReservationService->searchDormitoryReserved($dormBldg,$checkInDate,$checkOutDate,$apply);
            $mapCondoResv = array();
            foreach ($listResv as $resv) {
                $mapCondoResv[$resv["condo_bed_id"]] = $resv;
            }
            $filterCondoBedList = array();
            foreach ($availCondoBedList as $item) {
                if (!array_key_exists($item['id'], $mapCondoResv)) {
                    $filterCondoBedList[] = $item;
                }
            }
            return response()->json(array("filderBedList" => $filterCondoBedList, "countStudentDorm" => $totalAllCombine,
                "countStudentOthers" => $countStudentOthers,"countStudentWalkin" => $countStudentWalkin));
        }
        return response()->json(array("filderBedList" => $filterBedList?$filterBedList:$filterBedListUnfiltered, "countStudentDorm" => $totalAllCombine,
            "countStudentOthers" => $countStudentOthers,"countStudentWalkin" => $countStudentWalkin));
    }

    public function findReservedRoomsList($applyId) {

        $reservedRoom = $this->reservationService->findRoomsByApplyId($applyId);
        return response()->json($reservedRoom);
    }

    public function findCondoReservedRoomsList($applyId) {

        $reservedRoom = $this->condoReservationService->findRoomsByApplyId($applyId);
        return response()->json($reservedRoom);
    }

    public function findHotelsReservedRoomsList($applyId) {

        $reservedRoom = $this->hotelsReservationService->findRoomsByApplyId($applyId);
        return response()->json($reservedRoom);
    }

    public function findWalkinReservedRoomsList($applyId) {

        $reservedRoom = $this->walkinReservationService->findRoomsByApplyId($applyId);
        return response()->json($reservedRoom);
    }

    public function findReservedRoomsLogsList($applyId) {

        $reservedRoomLogs = $this->reservationLogService->findByStudentId($applyId);
        return response()->json($reservedRoomLogs);
    }

    public function deleteReservedRoom($reservedRoomName,$reservedRoomType,$reservationId,$applyId) {
        $today = date("Y-m-d H:i:s");
        $user = \Request::get('user');
        $apply = $this->studentApplyService->findById($applyId);
        $removeRsev = $this->reservationService->findById($reservationId);
        $reservationLogArray = array("student_id" => $apply['id'], "user" => $user['name'], "email_address" => $user['email'],
            "bldg" => $removeRsev['building_id'] == 1 ? 'ITP' : 'SFC', "room" => $reservedRoomName, "action" => "Delete",
            "start_date" => $removeRsev['date_from'], "end_date" => $removeRsev['date_to'], "created_at" => $today, "updated_at" => $today);
        //save in reservation_logs table
        $this->reservationLogService->create($reservationLogArray);
        // remove $applyId from reservations
        $removeRsev->delete();
        // remove $reservationId from reservations_student_apply
        $listResv = $apply->dormitoryRoomReservationList();
        $listResv->detach([$reservationId]);
        //remove the display accommo in apply list
        if(strpos($apply['dormitory_room_name'], "(") !== false) {
            $apply->update(array("dormitory_room_name" => str_replace(','.$reservedRoomName.'('.$reservedRoomType.')', '', $apply['dormitory_room_name'])));
        } else {
            $apply->update(array("dormitory_room_name" => str_replace(','.$reservedRoomName, '', $apply['dormitory_room_name'])));
        }
        return response()->json(["message" => "room_reservations_deleted_successfully"]);
    }

    public function deleteReservedCondoRoom($reservedRoomName,$reservedRoomType,$reservationId,$applyId) {
        $today = date("Y-m-d H:i:s");
        $user = \Request::get('user');
        $apply = $this->studentApplyService->findById($applyId);
        $removeRsev = $this->condoReservationService->findById($reservationId);
        $reservationLogArray = array("student_id" => $apply['id'], "user" => $user['name'], "email_address" => $user['email'], "bldg" => $removeRsev['building_id'] == 1 ? 'ITP' : 'SFC',
            "room" => $reservedRoomName, "action" => "Delete", "start_date" => $removeRsev['date_from'], "end_date" => $removeRsev['date_to'], "created_at" => $today, "updated_at" => $today);
        //save in reservation_logs table
        $this->reservationLogService->create($reservationLogArray);
        // remove $applyId from condo_reservations
        $removeRsev->delete();
        // remove $reservationId from condo_reservations_student_apply
        $listResv = $apply->condoRoomReservationList();
        $listResv->detach([$reservationId]);
        //remove the display accommo in apply list
        if(strpos($apply['dormitory_room_name'], "(") !== false) {
            $apply->update(array("dormitory_room_name" => str_replace(','.$reservedRoomName.'('.$reservedRoomType.')', '', $apply['dormitory_room_name'])));
        } else {
            $apply->update(array("dormitory_room_name" => str_replace(','.$reservedRoomName, '', $apply['dormitory_room_name'])));
        }
        return response()->json(["message" => "condo_room_reservations_deleted_successfully"]);
    }


    public function deleteReservedHotelsRoom($reservedRoomName,$reservedRoomType,$reservationId,$applyId) {
        $today = date("Y-m-d H:i:s");
        $user = \Request::get('user');
        $apply = $this->studentApplyService->findById($applyId);
        $removeRsev = $this->hotelsReservationService->findById($reservationId);
        $reservationLogArray = array("student_id" => $apply['id'], "user" => $user['name'], "email_address" => $user['email'], "bldg" => $removeRsev['building_id'] == 1 ? 'ITP' : 'SFC',
            "room" => $reservedRoomName, "action" => "Delete", "start_date" => $removeRsev['date_from'], "end_date" => $removeRsev['date_to'], "created_at" => $today, "updated_at" => $today);
        //save in reservation_logs table
        $this->reservationLogService->create($reservationLogArray);
        // remove $applyId from hotels_reservations
        $removeRsev->delete();
        // remove $reservationId from hotels_reservations_student_apply
        $listResv = $apply->hotelsRoomReservationList();
        $listResv->detach([$reservationId]);
        //remove the display accommo in apply list
        if(strpos($apply['dormitory_room_name'], "(") !== false) {
            $apply->update(array("dormitory_room_name" => str_replace(','.$reservedRoomName.'('.$reservedRoomType.')', '', $apply['dormitory_room_name'])));
        } else {
            $apply->update(array("dormitory_room_name" => str_replace(','.$reservedRoomName, '', $apply['dormitory_room_name'])));
        }
        return response()->json(["message" => "hotels_room_reservations_deleted_successfully"]);
    }

    public function deleteReservedWalkinRoom($reservedRoomName,$reservedRoomType,$reservationId,$applyId) {
        $today = date("Y-m-d H:i:s");
        $user = \Request::get('user');
        $apply = $this->studentApplyService->findById($applyId);
        $removeRsev = $this->walkinReservationService->findById($reservationId);
        $reservationLogArray = array("student_id" => $apply['id'], "user" => $user['name'], "email_address" => $user['email'], "bldg" => $removeRsev['building_id'] == 1 ? 'ITP' : 'SFC',
            "room" => $reservedRoomName, "action" => "Delete", "start_date" => $removeRsev['date_from'], "end_date" => $removeRsev['date_to'], "created_at" => $today, "updated_at" => $today);
        //save in reservation_logs table
        $this->reservationLogService->create($reservationLogArray);
        // remove $applyId from walkin_reservations
        $removeRsev->delete();
        // remove $reservationId from student_apply_walkin_reservations
        $listResv = $apply->walkinRoomReservationList();
        $listResv->detach([$reservationId]);
        //remove the display accommo in apply list
        if(strpos($apply['dormitory_room_name'], "(") !== false) {
            $apply->update(array("dormitory_room_name" => str_replace(','.$reservedRoomName.'('.$reservedRoomType.')', '', $apply['dormitory_room_name'])));
        } else {
            $apply->update(array("dormitory_room_name" => str_replace(','.$reservedRoomName, '', $apply['dormitory_room_name'])));
        }
        return response()->json(["message" => "walkin_room_reservations_deleted_successfully"]);
    }

    public function deleteReservedHotel($accommodationName,$hotelBookingId,$applyId) {
        $today = date("Y-m-d H:i:s");
        $user = \Request::get('user');
        $apply = $this->studentApplyService->findById($applyId);
        $hotelDetails = $this->otherReservationService->findById($hotelBookingId);
        $otherReservationLogArray = array("student_id" => $apply['id'], "user" => $user['name'], "email_address" => $user['email'], "bldg" => $hotelDetails['building_id'] == 1 ? 'ITP' : 'SFC',
            "room" => $accommodationName, "action" => "Delete", "start_date" => $hotelDetails['date_from'], "end_date" => $hotelDetails['date_to'], "created_at" => $today, "updated_at" => $today);
        //save in reservation_logs table
        $this->reservationLogService->create($otherReservationLogArray);
        // remove booking from other_reservations table
        $removeHotel = $this->otherReservationService->remove($hotelBookingId);
        // remove booking from other_reservations_student_apply
        $listResv = $apply->hotelWalkinReservationList();
        $listResv->detach([$hotelBookingId]);
        //update hotel_name
        $apply->update(array("hotel_name" => str_replace(','.$accommodationName, '', $apply['hotel_name'])));
        return response()->json(["message" => "hotel_reservations_deleted_successfully","data" => $removeHotel]);
    }

    public function updateToPresentStatus($reservedId) {
        $reserved= $this->reservationService->findById($reservedId);
        $reserved->update(array("reservation_status_id" => $this->reservationStatus['present']));
        return response()->json(["message" => "changed_present_successfully"]);
    }

    public function updateToReservedStatus($reservedId) {
        $reserved= $this->reservationService->findById($reservedId);
        $reserved->update(array("reservation_status_id" => $this->reservationStatus['reserved']));
        return response()->json(["message" => "changed_present_successfully"]);
    }

    public function updateToPresentStatusCondo($reservedId) {
        $reserved= $this->condoReservationService->findById($reservedId);
        $reserved->update(array("reservation_status_id" => $this->reservationStatus['present']));
        return response()->json(["message" => "changed_present_successfully"]);
    }

    public function updateToReservedStatusCondo($reservedId) {
        $reserved= $this->condoReservationService->findById($reservedId);
        $reserved->update(array("reservation_status_id" => $this->reservationStatus['reserved']));
        return response()->json(["message" => "changed_present_successfully"]);
    }

    public function updateToPresentStatusHotels($reservedId) {
        $reserved= $this->hotelsReservationService->findById($reservedId);
        $reserved->update(array("reservation_status_id" => $this->reservationStatus['present']));
        return response()->json(["message" => "changed_present_successfully"]);
    }

    public function updateToReservedStatusHotels($reservedId) {
        $reserved= $this->hotelsReservationService->findById($reservedId);
        $reserved->update(array("reservation_status_id" => $this->reservationStatus['reserved']));
        return response()->json(["message" => "changed_present_successfully"]);
    }

    public function updateToPresentStatusWalkin($reservedId) {
        $reserved= $this->walkinReservationService->findById($reservedId);
        $reserved->update(array("reservation_status_id" => $this->reservationStatus['present']));
        return response()->json(["message" => "changed_present_successfully"]);
    }

    public function updateToReservedStatusWalkin($reservedId) {
        $reserved= $this->walkinReservationService->findById($reservedId);
        $reserved->update(array("reservation_status_id" => $this->reservationStatus['reserved']));
        return response()->json(["message" => "changed_present_successfully"]);
    }

    public function destroy($id){
        $apply = $this->studentApplyService->findById($id);
        $apply->delete();
        return response()->json(["message" => "deleted_successfully", "data" => $id]);
    }

    public function findReservedHotelsList($applyId) {
        $reservedHotels = $this->otherReservationService->findByStudentId($applyId);
        return response()->json($reservedHotels);
    }

    public function uploadHotelFile($hotelBookId, Request $request) {
        $today = date("Y-m-d H:i:s");
        $user = \Request::get('user');
        $fileName = $hotelBookId.'_'.$request->file('hotelbookingfile')->getClientOriginalName();
        $fileSize = $request->file('hotelbookingfile')->getSize() / 1024;
        $request->file('hotelbookingfile')->move(storage_path('bookings/') , $fileName);
        //find file in the database
        $files = $this->otherReservationService->findById($hotelBookId);
        // update new file in the database
        $files->update(array("filename" => $fileName));
        $files->update(array("filesize" => $fileSize));
        $files->update(array("updated_by" => $user['name']));
        $files->update(array("updated_at" => $today));
        return response()->json(array("message" => "upload_successfully", "storage" => storage_path('bookings\\') . $fileName));
    }

    public function downloadHotelFile($hotelBookId) {
        $files = $this->otherReservationService->findById($hotelBookId);
        $file= storage_path('bookings/').$files['filename'];
        $headers = array('Content-Type: application/pdf',);
        return response()->download($file, $files['filename'], $headers);
    }

    public function import(Request $request) {
        $file = $request->file('studentimport');
        $statusCodes = config('constants.status_code');
        $user = \Request::get('user');
        $userPermissions = $this->userService->getUserPermission($user['id']);
        if (in_array($this->permissions['DAT_IMPORT'], $userPermissions)) {
            if (!empty($file)) {
                $fileType = explode('/', $file->getClientMimeType())[1];
                if (!in_array($fileType, config('constants.acceptable_import_file')) || !in_array($file->getClientOriginalExtension(), config('constants.acceptable_import_file'))) {
                    return response()->json(array("errors" => [config('errorcodes.student_apply.file_type_invalid.key')]), config('constants.status_code.bad_request'));
                }
                $firstSheet = Excel::load($file->getRealPath())->get()->first();
                $records = $firstSheet->toArray();
                $records[0];//Header
                $dbcols = $this->studentApplyService->getColumns();
                $index = 2; $okayRecord = array();$arrayError = array();
                $today = date("Y-m-d H:i:s");
                $schoolList = $this->buildingService->all();
                $roomList = $this->roomService->all();
                $dormList = $this->dormitoryRoomsService->all();
                $mapDorm = array(); $mapSchool = array();$mapRoom = array();
                foreach ($dormList as $dorm) { $mapDorm[$dorm["name"]] = $dorm; }
                foreach ($schoolList as $school) { $mapSchool[$school["code"]] = $school; }
                foreach ($roomList as $rooms) { $mapRoom[$rooms["type"]] = $rooms; }

                foreach ($records as $record) {
                    if(!$record['id_number'] || $record['id_number']==''){
                        if(strtolower($record['status']) == 'reserved' || strtolower($record['status']) == 'present') {
                            $record['id_number'] = $this->randomizeIdNumber();
                        }
                    }

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
                    } else if (strtolower($record["status"]) == 'leave') {
                        $record["student_status"] = '9';
                    } else {
                        $record["student_status"] = '-1';
                    }
                    unset($record["status"]);

                    $record["student_name"] = $record["name"];
                    unset($record["name"]);

                    $record["created_at"] = (date('Y-m-d H:i:s', strtotime($record['add_date'])));
                    unset($record["add_date"]);

                    if(!$record["agency"] || $record['agency'] == '') {
                        $record["agent_name"] = 'QQ';
                    } else {
                        $record["agent_name"] = $record["agency"];
                    }
                    unset($record["agency"]);

                    $record["checkin_date"] = (new DateTime(substr($record['check_in'], 0, 10)))->format('Y-m-d H:i:s');
                    unset($record["check_in"]);

                    $record["checkout_date"] = (new DateTime(substr($record['check_out'], 0, 10)))->format('Y-m-d H:i:s');
                    unset($record["check_out"]);

                    $record["entrance_date"] = (new DateTime(substr($record['start_date'], 0, 10)))->format('Y-m-d H:i:s');
                    unset($record["start_date"]);

                    $record["graduation_date"] = (new DateTime(substr($record['graduation_date'], 0, 10)))->format('Y-m-d H:i:s');
                    $record["arrival_date"] = (date('Y-m-d H:i:s', strtotime($record["checkin_date"])));

                    //Date from checkin and Time from arrival time
                    $arrivalDateOnly = (date('Y-m-d', strtotime($record["checkin_date"])));
                    if($record['arrival_time']) {
                        $arrivalTimeOnly = (date('H:i:s', strtotime($record['arrival_time'])));
                        $arrivalDateAndTime = $arrivalDateOnly.' '.$arrivalTimeOnly;
                    } else {
                        $arrivalDateAndTime = $arrivalDateOnly.' '.'11:59:59'; //default when no arrival time
                    }

                    $record["arrival_time"] = $arrivalDateAndTime;

                    $holidays = $this->holidayService->getHolidaysInPeriod($record["entrance_date"], $record["graduation_date"]);
                    $holidaysStudent = '';
                    foreach($holidays as $holiday){
                        $dateFormat = strtotime($holiday['date']);
                        $holidaysStudent .= date('M j',$dateFormat).', ';
                    }
                    $record['holidays'] = $holidaysStudent;

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
                    $record["building_id"] = $record["school_campus"] == 'ITP' ? 1 : 2;
                    $accommodationListWithShareHouseId  = array("SINGLE" => "1", "TWIN" => "1", "TRIPLE" => "1", "QUAD" => "1", "HEX" => "1",
                        "Z-SINGLE" => "2", "Z-TWIN" => "2", "Z-TRIPLE" => "2", "Z-THIRD" => "2",
                        "WF-SINGLE" => "3", "WF-TWIN" => "3", "WF-TRIPLE" => "3", "WF-THIRD" => "3",
                        "EX-SINGLE" => "5", "EX-TWIN" => "5", "EX-TRIPLE" => "5", "EX-THIRD" => "5",
                        "DX-SINGLE" => "6", "DX-TWIN" => "6", "DX-TRIPLE" => "6", "DX-THIRD" => "6",
                        "" => "1", "WALK IN" => "7", "WALK-IN" => "7", "WHITE HOUSE" => "7");
                    $accommodationListWithShareRoomId = array("SINGLE" => "4", "TWIN" => "4", "TRIPLE" => "4", "QUAD" => "4", "HEX" => "4",
                        "Z-SINGLE" => "2", "Z-TWIN" => "2", "Z-TRIPLE" => "2", "Z-THIRD" => "2",
                        "WF-SINGLE" => "3", "WF-TWIN" => "3", "WF-TRIPLE" => "3", "WF-THIRD" => "3",
                        "EX-SINGLE" => "5", "EX-TWIN" => "5", "EX-TRIPLE" => "5", "EX-THIRD" => "5",
                        "DX-SINGLE" => "6", "DX-TWIN" => "6", "DX-TRIPLE" => "6", "DX-THIRD" => "6",
                        "" => "1", "WALK IN" => "7", "WALK-IN" => "7", "WHITE HOUSE" => "7");
                    switch($record["building_id"]) {
                        case 1: $record["accommodation_id1"] = $accommodationListWithShareHouseId[strtoupper($record["room_type"])]; break;
                        default: $record["accommodation_id1"] = $accommodationListWithShareRoomId[strtoupper($record["room_type"])]; break;
                    }
                    unset($record["room_type"]);
                    //country_code field
                    switch(strtolower($record["nationality"])) {
                        case 'ch': $record["country_code"] = 'CN'; break;
                        case 'vietnam': $record["country_code"] = 'VN'; break;
                        case 'rus': $record["country_code"] = 'RU'; break;
                        case 'arab': case 'sau': $record["country_code"] = 'ARAB'; break;
                        default: $record["country_code"] = strtoupper($record["nationality"]); break;
                    }
                    //nationality field
                    $record["nationality"] = $this->getNationality($record["nationality"]);
                    $record["due_date"] = (new DateTime(substr($record['due_date'], 0, 10)))->format('Y-m-d H:i:s');
                    $record["paid_date"] = (new DateTime(substr($record['paid_date'], 0, 10)))->format('Y-m-d H:i:s');

                    $record["sex"] = $record["sex"] === 'M' ? 1 : 2;
                    $record["campus"] = $record["school_campus"];
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
                            //$apply->update($record); /* No updates when found id_number */
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
                            $sheet->appendRow(array('id_number', 'student_name', 'passport_name', 'sex', 'age'));

                            foreach ($okayRecord as $item) {
                                $sheet->appendRow(array($item['id_number'], $item['student_name'], $item['passport_name'], $item['sex'], $item['age']));
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


    public function importCamp(Request $request) {
        $file = $request->file('campimport');
        $statusCodes = config('constants.status_code');
        $user = \Request::get('user');
        $userPermissions = $this->userService->getUserPermission($user['id']);
        $lastId = $this->studentApplyService->getLastStudentId();

        if (in_array($this->permissions['DAT_IMPORT'], $userPermissions)) {
            if (!empty($file)) {
                $fileType = explode('/', $file->getClientMimeType())[1];
                if (!in_array($fileType, config('constants.acceptable_import_file')) || !in_array($file->getClientOriginalExtension(), config('constants.acceptable_import_file'))) {
                    return response()->json(array("errors" => [config('errorcodes.student_apply.file_type_invalid.key')]), config('constants.status_code.bad_request'));
                }
                $firstSheet = Excel::load($file->getRealPath())->get()->first();
                $records = $firstSheet->toArray();
                $records[0];//Header
                $dbcols = $this->studentApplyService->getColumns();
                $index = 2; $okayRecord = array(); $arrayError = array();
                $today = date("Y-m-d H:i:s");

                // get room_id1
                $mapRoom = $this->convert_list_to_map($this->roomList);
                // get accommodation_id1
                $mapAccommodation = $this->convert_list_to_map($this->accommodationList);
                // get plan_id
                $mapPlan = $this->convert_list_to_map($this->planList);

                foreach ($records as $record) {
                    // auto:camp_name, note_for_student,repeater,passport_name,passport_id,age,flight_no
                    $lastId['id'] = $lastId['id'] + 1;
                    $record['id'] = $lastId['id'];
                    $record['id_number'] = $this->randomizeIdNumber();
                    // set reserved status
                    $record["student_status"] = '2';
                    $record["created_at"] = (date('Y-m-d H:i:s', strtotime($record['create_date'])));
                    unset($record["create_date"]);
                    //country_code field
                    $record["country_code"] = strtoupper($record["nationality"]);
                    //nationality field
                    $record["nationality"] = $this->getNationality($record["nationality"]);

                    $record["checkin_date"] = (new DateTime(substr($record['check_in'], 0, 10)))->format('Y-m-d H:i:s');
                    unset($record["check_in"]);

                    $record["checkout_date"] = (new DateTime(substr($record['check_out'], 0, 10)))->format('Y-m-d H:i:s');
                    unset($record["check_out"]);

                    $record["entrance_date"] = (new DateTime(substr($record['start_date'], 0, 10)))->format('Y-m-d H:i:s');
                    unset($record["start_date"]);

                    $record["graduation_date"] = (new DateTime(substr($record['graduation_date'], 0, 10)))->format('Y-m-d H:i:s');
                    $record["arrival_date"] = (date('Y-m-d H:i:s', strtotime($record["arrival_date"])));

                    $record["term"] = $record["week"];
                    unset($record["week"]);

                    $record["building_id"] = $record["school_campus"] == 'ITP' ? 1 : 2;
                    $record["options_pickup"] = strtolower($record["pick_up_options"]) === 'yes' ? 1 : 0;
                    $record["options_meals"] = strtolower($record["meals_options"]) === 'yes' ? 1 : 0;

                    if(!$record["agency"] || $record['agency'] == '') {
                        $record["agent_name"] = 'QQ';
                    } else {
                        $record["agent_name"] = $record["agency"];
                    }
                    unset($record["agency"]);

                    $record["sex"] = $record["sex"] === 'M' ? 1 : 2;
                    $record["campus"] = $record["school_campus"];

                    $record["birthday"] = (new DateTime(substr($record['date_of_birth'], 0, 10)))->format('Y-m-d H:i:s');
                    unset($record["date_of_birth"]);

                    $record["repeater"] = strtolower($record["repeater"]) === 'yes' ? 1 : 0;

                    /* Auto Create Course  [start]*/
                    $formatFrom = strtotime($record["checkin_date"]);
                    $formatTo = strtotime($record["checkout_date"]);
                    $memoDateFrom = date('m/j',$formatFrom);
                    $memoDateTo = date('m/j',$formatTo);
                    $memo = ($record["building_id"] === 1 ? 'ITP':'SFC').' '.$memoDateFrom.'-'.$memoDateTo.' '.$record["course"];

                    $dataArray = array("student_id" => $record['id'], "bldg_id" => $record["building_id"], "course_name" => $record["course"], "date_from" => $record["checkin_date"], "date_to" => $record["checkout_date"],
                        "memo" => $memo, "created_by" => $user['name'], "created_at" => $today, "updated_at" => $today);

                    //save in courses table
                    $this->courseService->create($dataArray);

                    $courseLogArray = array("user" => $user['name'], "student_id" => $record['id'], "email_address" => $user['email'], "course" => $record["course"], "action" => "Add", "start_date" => $record["checkin_date"], "end_date" => $record["checkout_date"],
                        "created_at" => $today, "updated_at" => $today);
                    //save in course_logs table
                    $this->courseLogService->create($courseLogArray);

                    $invoiceData = array ("sa_id_number" => $record['id'], "checkin_date" => $record["checkin_date"], "checkout_date" => $record["checkout_date"], "id_card" => 200);
                    //save in invoices table
                    $this->invoiceService->create($invoiceData);

                    //plan_id
                    if($record["course"] == "GUARDIAN" || $record["course"] == "INTERN"){
                        $record["plan_id"] = 99; // Intern
                        if($record["course"] == "GUARDIAN") {
                            $record["plan_id"] = -1;
                        }
                    } else {
                        $planTypeList = array("Standard" => 1, "Superior" => 2, "Light" => 3, "TOEIC" => 8, "IELTS (4 PLAN)" => 12, "IELTS (6 PLAN)" => 13, "Business" => 7, "Body Make ST" => 14, "Body Make HL" => 15, "Super Light" => 16);
                        $planId = $planTypeList[$record["course"]];
                        $record["plan_id"] = $mapPlan[$planId]["id"];
                    }
                    $record["course"] = "," . $record["course"];
                    /* Auto Create Course  [end]*/

                    //Date from arrival_date and Time from arrival_time
                    $arrivalDateOnly = (date('Y-m-d', strtotime($record["arrival_date"])));
                    if($record['arrival_time']) {
                        $arrivalTimeOnly = (date('H:i:s', strtotime($record['arrival_time'])));
                        $arrivalDateAndTime = $arrivalDateOnly.' '.$arrivalTimeOnly;
                    } else {
                        $arrivalDateAndTime = $arrivalDateOnly.' '.'11:59:59'; //default when no arrival time
                    }
                    $record["arrival_time"] = $arrivalDateAndTime;

                    $holidays = $this->holidayService->getHolidaysInPeriod($record["entrance_date"], $record["graduation_date"]);
                    $holidaysStudent = '';
                    foreach($holidays as $holiday){
                        $dateFormat = strtotime($holiday['date']);
                        $holidaysStudent .= date('M j',$dateFormat).', ';
                    }
                    $record['holidays'] = $holidaysStudent;

                    //accommodation
                    $accommodationTypeList = array("IT-Sharehouse" => 1, "IT-Albauno" => 2, "IT-Waterfront" => 3, "IT-Walkin" => 7, "IT-Condo" => 9, "SF-Shareroom" => 4, "SF-Executive" => 5, "SF-Deluxe" => 6);
                    $stayId = $accommodationTypeList[$record["accommodation"]];
                    $record["accommodation_id1"] = $mapAccommodation[$stayId]["id"];

                    //room_type
                    $roomTypeList = array("SINGLE" => 1, "TWIN" => 2, "TRIPLE" => 3, "QUAD" => 4, "HEX" => 5);
                    $roomTypeOnly = $roomTypeList[strtoupper($record["room_type"])];
                    $record["room_id1"] = $mapRoom[strtolower($roomTypeOnly)]["id"];
                    unset($record["room_type"]);

                    $record['updated_at'] = $today;
                    $record['delete_flag'] = 0;

                    //Remove non-db fields
                    unset($record["0"]);unset($record["check_in_day"]);unset($record["accommodation"]);;
                    unset($record["begginer_support_option"]);unset($record["island_hopping"]);
                    unset($record["oslob_tour"]);unset($record["meals_options"]);unset($record["pick_up_options"]);
                    unset($record["school_campus"]);unset($record["autum_campaine"]);

                    $errors = $this->validateDataImport($record, $okayRecord);
                    if (count($errors) > 0) {
                        array_push($arrayError, array(
                            "row" => $index,
                            "errors" => $errors
                        ));
                    } else {
                        $apply = $this->studentApplyService->findBykey($record["id_number"]);
                        if ($apply) {
                            //$apply->update($record); /* No updates when found id_number */
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
                        $excel->sheet('studentapply', function ($sheet) use ($okayRecord) {$sheet->appendRow(array('id_number', 'passport_name', 'sex', 'age'));

                            foreach ($okayRecord as $item) {
                                $sheet->appendRow(array($item['id_number'], $item['passport_name'], $item['sex'], $item['age']));
                            }
                        });
                    })->store('csv', storage_path('imports/'));
                    return response()->json(array("message" => "import_successfully", "storage" => storage_path('imports\\') . 'data_import_' . $today . '.csv'));

                } else {
                    return response()->json(array("data" => $records, "errors" => $arrayError), $statusCodes['bad_request']);
                }
            } else {
                $errorCodes = config('errorcodes.student_apply');
                return response()->json(["errors" => [$errorCodes["import_file_required"]["key"]]], $statusCodes['bad_request']);
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
    public function getRoomId($accommodationId, $dormRoomId) {
        // Alba Uno 2, Waterfront 3, Executive 5, Deluxe 6 ($accommodationId)
        switch($accommodationId) {
            case 3: $dormRoomId = $dormRoomId == 1 ? 9 : $dormRoomId == 2 ? 10 : 11; break;
            case 5: $dormRoomId = $dormRoomId == 1 ? 12 : $dormRoomId == 2 ? 13 : 14; break;
            case 6: $dormRoomId = $dormRoomId == 1 ? 15 : $dormRoomId == 2 ? 16 : 17; break;
            default: $dormRoomId = $dormRoomId == 1 ? 6 : $dormRoomId == 2 ? 7 : 8; break;
        }
        return $dormRoomId;
    }

    /**
     * @param $cafeListDorm
     * @param $countStudentDorm
     * @param $cafeListOthers
     * @param $countStudentOthers
     * @param $countStudentWalkin
     * @param $cafeListOthersAlbaUno
     * @param $countStudentInternWalkZerWat
     * @param $cafeListOthersWaterfront
     * @param $cafeListOthersWalkinITP
     * @param $cafeListOthersWalkinSFC
     * @return array
     */
    public function countStudents($cafeListDorm, $countStudentDorm, $cafeListOthers,
                                  $countStudentOthers, $countStudentWalkin, $cafeListOthersAlbaUno,
                                  $countStudentInternITP,$countStudentInternSFC, $cafeListOthersWaterfront,
                                  $cafeListOthersWalkinITP, $cafeListOthersWalkinSFC) {
        foreach ($cafeListDorm as $student) {
            if ($student['visitor_type'] == 1 || $student['visitor_type'] == 3) { /* 1=student,3=intern restricted only with more than 300 reservations*/
                $countStudentDorm++;
            }
        }
        foreach ($cafeListOthers as $student) {
            if (($student['visitor_type'] == 1 || $student['visitor_type'] == 3) &&
                ($student['accommodation_id'] == 2 || $student['accommodation_id'] == 3)) { /*1=student,3=intern restricted only with more than 300 reservations hotels*/
                $countStudentOthers++;
            } else if (($student['visitor_type'] == 1 || $student['visitor_type'] == 3) &&
                ($student['accommodation_id'] == 7 || $student['accommodation_id'] == 8)) {  /*1=student,3=intern restricted only with more than 300 reservations walk-in*/
                $countStudentWalkin++;
            }
        }
        foreach ($cafeListOthersAlbaUno as $student) {
            if ($student['visitor_type'] == 1 || $student['visitor_type'] == 3) { /* 1=student,3=intern restricted only with more than 300 reservations*/
                $countStudentInternITP++;
            }
        }
        foreach ($cafeListOthersWaterfront as $student) {
            if ($student['visitor_type'] == 1 || $student['visitor_type'] == 3) { /* 1=student,3=intern restricted only with more than 300 reservations*/
                $countStudentInternITP++;
            }
        }
        foreach ($cafeListOthersWalkinITP as $student) {
            if ($student['visitor_type'] == 1 || $student['visitor_type'] == 3) { /* 1=student,3=intern restricted only with more than 300 reservations*/
                $countStudentInternITP++;
            }
        }
        foreach ($cafeListOthersWalkinSFC as $student) {
            if ($student['visitor_type'] == 1 || $student['visitor_type'] == 3) { /* 1=student,3=intern restricted only with more than 300 reservations*/
                $countStudentInternSFC++;
            }
        }
        return array($countStudentDorm, $countStudentOthers, $countStudentWalkin, $countStudentInternITP,$countStudentInternSFC);
    }

    /**
     * @return array
     */
    public function convert_list_to_map($list) {
        $mapArray = array();
        foreach ($list as $item) {
            $mapArray[$item["id"]] = $item;
        }
        return $mapArray;
    }

    /**
     * @param $course
     * @param $nationalityId
     * @return string
     */
    public function getCourseName($course,$nationalityId) {
        $courseName='';
        switch ($course) {
            case 1: $courseName = 'Standard'; break;
            case 2: $courseName = "Superior"; break;
            case 3: $courseName = 'Light';break;
            case 4: $courseName = 'Super Short Light';break;
            case 5: $courseName = 'Super Short';break;
            case 6: $courseName = 'Super Short + Online';break;
            case 7: $courseName = 'Business'; break;
            case 8: $courseName = 'TOEIC';break;
            case 9: $courseName = 'TOEIC WITH GUARANTEE';break;
            case 10: $courseName = 'IELTS';break;
            case 11: $courseName = 'Family';break;
            case 12: $courseName = $nationalityId == 6 ? 'Special' : 'IELTS (4 PLAN)';break;
            case 13: $courseName = 'IELTS (6 PLAN)';break;
            case 14: $courseName = 'Body Make ST';break;
            case 15: $courseName = 'Body Make HL';break;
            case 16: $courseName = 'Super Light';break;
            case -1: $courseName = 'GUARDIAN';break;
            case 99: $courseName = 'INTERN';break;
        }
        return $courseName;
    }

    /**
     * @param $studentNationality
     * @return int
     */
    public function getNationalityId($studentNationality) {
        $listNationality = $this->nationalityService->all();
        $nationalityId = 17;//default other flag
        foreach ($listNationality as $nat) {
            if (strtolower($nat["nation_code"]) == strtolower($studentNationality)) {
                $nationalityId = $nat["id"];
            }
        }
        return $nationalityId;
    }

    /**
     * @return string
     */
    public function randomizeIdNumber() {
        return rand(1000, 9999) . rand(1000, 9999);
    }

    /**
     * @param $reservedRooms
     * @param $memoContent
     */
    public function updateReservationMemo($reservedRooms, $memoContent) {
        foreach ($reservedRooms as $rooms) {
            $rooms->update(array("memo" => $memoContent));
        }
    }

    /**
     * @param $reservedRooms
     * @param $reservedStatus
     */
    public function updateReservationStatusToReserved($reservedRooms, $reservedStatus) {
        foreach ($reservedRooms as $rooms) {
            $rooms->update(array("reservation_status_id" => $reservedStatus));
        }
    }

    /**
     * @param $nationalityId
     * @return string
     */
    public function getNationality($nationalityId) {
        $nation='';
        switch (strtolower($nationalityId)) {
            case 'ch': case 'cn': $nation = 'China'; break;
            case 'it': $nation = 'Italy'; break;
            case 'bh': $nation = 'Bahrain'; break;
            case 'br': $nation = 'Brazil'; break;
            case 'ir': $nation = 'Iran'; break;
            case 'jp': $nation = 'Iran'; break;
            case 'kr': $nation = 'Korea'; break;
            case 'my': $nation = 'Myanmar'; break;
            case 'ru': case 'rus': $nation = 'Russia'; break;
            case 'sau': case 'arab': $nation = 'Saudi Arabia'; break;
            case 'sp': $nation = 'Spain'; break;
            case 'sw': $nation = 'Switzerland'; break;
            case 'tw': $nation = 'Taiwan'; break;
            case 'tk': $nation = 'Turky'; break;
            case 'uae': $nation = 'UAE'; break;
            case 'vn': case 'vietnam': $nation = 'Vietnam'; break;
            case 'other': $nation = 'Other'; break;
        }
        return $nation;
    }

    /**
     * @return array
     */
    public function getYears() {
        $years = range(date('Y', strtotime('+1 year')), 2015);
        return response()->json($years);
    }

    public function getTotalNumberOfWeekdayInAMonth($yearMonth) {
        $mondays=0;
        for($i=1; $i<=date("t", strtotime($yearMonth."-01")); $i++) {
            if(date("l", strtotime($yearMonth."-".$i)) === 'Monday') {
                $mondays++;
            }
        }
        return $mondays;
    }

    public function getNumberOfTermsPerCountry($yearFrom) {
        $monthlyMap = array();
        for ($m = 1; $m <= 12; ++$m) {
            $yearMonth = date($yearFrom.'-m', mktime(0, 0, 0, $m, 1));
            $startDate = date("Y-m-d", strtotime("first Monday of ".$yearMonth."". ' - 7 days'));
            $jpdsum = 0; $jpasum = 0; $twsum = 0; $cnsum = 0; $thsum = 0; $krsum = 0; $arabsum = 0; $vnsum = 0; $mnsum = 0; $rusum = 0; $otherssum = 0;
            $numberOfWeeksOfMonth = $this->getTotalNumberOfWeekdayInAMonth($yearMonth);
            for ($i = 1; $i <= $numberOfWeeksOfMonth; $i++) {
                $startWeekEnd = strtotime("next monday, 12pm", strtotime($startDate));
                $endWeekEnd = strtotime("next sunday, 12pm", $startWeekEnd);
                $startDate = date("Y-m-d", $startWeekEnd);
                $endDate = date("Y-m-d", $endWeekEnd);
                $jpdirect = $this->studentApplyService->getTotalNumberOfTermsPerMonthPerNation(array("nation" => 'JP', "yearmonth" => $yearMonth, "monthstart" => $startDate, "monthend" => $endDate, "agent" => 1));
                $jpagent = $this->studentApplyService->getTotalNumberOfTermsPerMonthPerNation(array("nation" => 'JP', "yearmonth" => $yearMonth, "monthstart" => $startDate, "monthend" => $endDate, "agent" => 2));
                $tw = $this->studentApplyService->getTotalNumberOfTermsPerMonthPerNation(array("nation" => 'TW', "yearmonth" => $yearMonth, "monthstart" => $startDate, "monthend" => $endDate,));
                $cn = $this->studentApplyService->getTotalNumberOfTermsPerMonthPerNation(array("nation" => 'CN', "yearmonth" => $yearMonth, "monthstart" => $startDate, "monthend" => $endDate,));
                $th = $this->studentApplyService->getTotalNumberOfTermsPerMonthPerNation(array("nation" => 'TH', "yearmonth" => $yearMonth, "monthstart" => $startDate, "monthend" => $endDate,));
                $kr = $this->studentApplyService->getTotalNumberOfTermsPerMonthPerNation(array("nation" => 'KR', "yearmonth" => $yearMonth, "monthstart" => $startDate, "monthend" => $endDate,));
                $arab = $this->studentApplyService->getTotalNumberOfTermsPerMonthPerNation(array("nation" => 'ARAB', "yearmonth" => $yearMonth, "monthstart" => $startDate, "monthend" => $endDate,));
                $vn = $this->studentApplyService->getTotalNumberOfTermsPerMonthPerNation(array("nation" => 'VN', "yearmonth" => $yearMonth, "monthstart" => $startDate, "monthend" => $endDate,));
                $mn = $this->studentApplyService->getTotalNumberOfTermsPerMonthPerNation(array("nation" => 'MN', "yearmonth" => $yearMonth, "monthstart" => $startDate, "monthend" => $endDate,));
                $ru = $this->studentApplyService->getTotalNumberOfTermsPerMonthPerNation(array("nation" => 'RU', "yearmonth" => $yearMonth, "monthstart" => $startDate, "monthend" => $endDate,));
                $others = $this->studentApplyService->getTotalNumberOfTermsPerMonthPerNation(array("nation" => 'OTHERS', "yearmonth" => $yearMonth, "monthstart" => $startDate, "monthend" => $endDate,));
                $jpdsum += $jpdirect['totalNumberOfTerms'];$jpasum += $jpagent['totalNumberOfTerms'];$twsum += $tw['totalNumberOfTerms'];$cnsum += $cn['totalNumberOfTerms'];$thsum += $th['totalNumberOfTerms'];$krsum += $kr['totalNumberOfTerms'];$arabsum += $arab['totalNumberOfTerms'];$vnsum += $vn['totalNumberOfTerms'];$mnsum += $mn['totalNumberOfTerms'];$rusum += $ru['totalNumberOfTerms'];$otherssum += $others['totalNumberOfTerms'];
                $monthlyMap[$yearMonth] = array("month" => $yearMonth, "jpdirect" => $jpdsum, "jpagent" => $jpasum, "tw" => $twsum, "cn" => $cnsum, "th" => $thsum, "kr" => $krsum, "arab" => $arabsum, "vn" => $vnsum, "mn" => $mnsum, "others" => $otherssum, "ru" => $rusum, "total" => array_sum(array($jpdsum, $jpasum, $twsum, $cnsum, $thsum, $krsum, $arabsum, $vnsum, $mnsum, $rusum, $otherssum)));
            }
        }
        $i = 0;$monthHeader = array();$monthBody = array();$monthMap = array();
        $jpdirecttotal=0;$jpagentttotal=0;$twtotal=0;$cntotal=0;$thtotal=0;$krtotal=0;$arabtotal=0;$vntotal=0;$mntotal=0;$rutotal=0;$otherstotal=0;
        foreach ($monthlyMap as $key => $item) {
            $monthHeader[] = $key;
            $monthBody[] = $item;
            $i++;
            if ($i % 12 == 0) {
                foreach($monthBody as $content) {
                    $jpdirecttotal += $content['jpdirect'];$jpagentttotal += $content['jpagent'];$twtotal += $content['tw'];$cntotal += $content['cn'];$thtotal += $content['th'];$krtotal += $content['kr'];$arabtotal += $content['arab'];$vntotal += $content['vn'];$mntotal += $content['mn'];$rutotal += $content['ru'];$otherstotal += $content['others'];
                }
                $monthMap[] = array("month" => $monthHeader, "monthcontent" => $monthBody, "_jpdirect" => $jpdirecttotal, "_jpagent" => $jpagentttotal, "_tw" => $twtotal, "_cn" => $cntotal, "_th" => $thtotal, "_kr" => $krtotal, "_arab" => $arabtotal, "_vn" => $vntotal, "_mn" => $mntotal, "_ru" => $rutotal, "_others" => $otherstotal, "_total" => array_sum(array($jpdirecttotal,$jpagentttotal,$twtotal,$cntotal,$thtotal,$krtotal,$arabtotal,$vntotal,$mntotal,$rutotal,$otherstotal)));
                $monthHeader = array();$monthBody = array();
            }
        }
        return response()->json($monthMap);
    }

    private function validateExportRequest($data) {
        $errorCodes = config('errorcodes.student_apply');
        $errors = array();
        return $errors;
    }

    public function exportInvoiceList(ApplyRequest $request) {
        $filename = 'Invoice-List.xlsx';
        $headers = array("Cache-Control: public", "Content-Description: File Transfer", "Content-Disposition: attachment; filename=$filename", 'Content-Type: application/vnd.ms-excel; charset=UTF-8', "Content-Encoding: UTF-8");
        try {
            $firstSheet = Excel::load("storage/template/Invoice-List.xlsx")->get()->first();
            $records = $firstSheet->toArray();

            $keyList = (array_keys($records[0]));

            $dataEx = array();
            $dataEx[] = $records[0];

            $data = $request->all();
            $students = $this->studentApplyService->exportClassList($data);

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
                        $studentRow[] = (new DateTime($stud['checkin_date']))->format('m/d/Y');
                    } else if ($key == 'checkout_date' && $stud['checkout_date']) {
                        $studentRow[] = (new DateTime($stud['checkout_date']))->format('m/d/Y');
                    } else if ($key == 'paid_date' && $stud['paid_date']) {
                        $studentRow[] = (new DateTime($stud['paid_date']))->format('m/d/Y');
                    } else if ($key == 'building_id' && $stud['building_id']) {
                        $studentRow[] = $mapSchool[$stud['building_id']]["code"];
                    }  else {
                        //$student field; key(id_number) from template $firstSheet
                        $studentRow[] = $stud[$key];
                    }

                }
                $dataEx[] = $studentRow;
            }

            //create xls file to export
            Excel::create('EXPORT-invoice-list', function ($excel) use ($dataEx) {
                $excel->getDefaultStyle()->getAlignment()->setHorizontal(\PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
                $excel->sheet('invoice_list', function ($sheet) use ($dataEx) {
                    $sheet->fromArray($dataEx, null, 'A1', false, false);
                    $sheet->freezeFirstRow();
                    $sheet->cells('A1:W1', function ($cells) {
                        $cells->setBackground('#004d99');
                        $cells->setFont(array(
                            'family' => 'Arial Unicode MS',
                            'size' => '10',
                            'bold' => true
                        ));
                        $cells->setFontColor('#ffffff');
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
                "errors" => [$errorcodes['download_invoicelist_unsuccessfully']['key']],
            ), $statusCode['internal_server_error']);
        }
    }

    public function exportGeneralAffairsInvoiceList(ApplyRequest $request) {
        $filename = 'General-Affairs-Invoice-List.xlsx';
        $headers = array("Cache-Control: public", "Content-Description: File Transfer", "Content-Disposition: attachment; filename=$filename", 'Content-Type: application/vnd.ms-excel; charset=UTF-8', "Content-Encoding: UTF-8");
        try {
            $firstSheet = Excel::load("storage/template/General-Affairs-Invoice-List.xlsx")->get()->first();
            $records = $firstSheet->toArray();

            $keyList = (array_keys($records[0]));

            $dataEx = array();
            $dataEx[] = $records[0];

            $data = $request->all();
            $students = $this->studentApplyService->exportClassList($data);

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
                        $studentRow[] = (new DateTime($stud['checkin_date']))->format('d/m/Y');
                    } else if ($key == 'checkout_date' && $stud['checkout_date']) {
                        $studentRow[] = (new DateTime($stud['checkout_date']))->format('d/m/Y');
                    } else if ($key == 'departure_date' && $stud['departure_date']) {
                        $studentRow[] = (new DateTime($stud['departure_date']))->format('d/m/Y');
                    } else if ($key == 'building_id' && $stud['building_id']) {
                        $studentRow[] = $mapSchool[$stud['building_id']]["code"];
                    } else if ($key == 'ga_payment_status') {
                        $studentRow[] = $stud['ga_payment_status'] === 1 ? 'Paid' : 'Unpaid';
                    }  else {
                        //$student field; key(id_number) from template $firstSheet
                        $studentRow[] = $stud[$key];
                    }

                }
                $dataEx[] = $studentRow;
            }

            //create xls file to export
            Excel::create('EXPORT-ga-invoice-list', function ($excel) use ($dataEx) {
                $excel->getDefaultStyle()->getAlignment()->setHorizontal(\PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
                $excel->sheet('invoice_list', function ($sheet) use ($dataEx) {
                    $sheet->fromArray($dataEx, null, 'A1', false, false);
                    $sheet->freezeFirstRow();
                    $sheet->cells('A1:S1', function ($cells) {
                        $cells->setBackground('#FFA500');
                        $cells->setFont(array(
                            'family' => 'Arial Unicode MS',
                            'size' => '10',
                            'bold' => true
                        ));
                        $cells->setFontColor('#ffffff');
                        $cells->setValignment('center');
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
                "errors" => [$errorcodes['download_gainvoicelist_unsuccessfully']['key']],
            ), $statusCode['internal_server_error']);
        }
    }

    public function exportClasslist(ApplyRequest $request) {
        $filename = 'Super-Flash-List.xlsx';
        $headers = array("Cache-Control: public", "Content-Description: File Transfer", "Content-Disposition: attachment; filename=$filename", 'Content-Type: application/vnd.ms-excel; charset=UTF-8', "Content-Encoding: UTF-8");
        try {
            $firstSheet = Excel::load("storage/template/Super-Flash-List.xlsx")->get()->first();
            $records = $firstSheet->toArray();

            $keyList = (array_keys($records[0]));

            $dataEx = array();
            $dataEx[] = $records[0];

            $data = $request->all();
            $students = $this->studentApplyService->exportClassList($data);

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
                    } else if ($key == 'entrance_date' && $stud['entrance_date']) {
                        $studentRow[] = (new DateTime($stud['entrance_date']))->format('m/d/Y(D)');
                    } else if ($key == 'graduation_date' && $stud['graduation_date']) {
                        $studentRow[] = (new DateTime($stud['graduation_date']))->format('m/d/Y(D)');
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
                        } else if($stud['accommodation_id1'] == 7) {
                            $studentRow[] = "(walkin)";
                        } else if($stud['accommodation_id1'] == 8) {
                            $studentRow[] = "(walkin)";
                        } else {
                            $studentRow[] = strtoupper($mapRoom[$stud['room_id1']]["type"]);
                        }
                    } else if ($key == 'room_id1' && !$stud['room_id1']) {
                        $studentRow[] = "WALK-IN";
                    } else if ($key == 'options_pickup' && $stud['options_pickup']) {
                        $studentRow[] = $stud['options_pickup'] === 1 ? 'Yes' : 'No';
                    } else if ($key == 'options_meals' && $stud['options_meals']) {
                        $studentRow[] = $stud['options_meals'] === 1 ? 'Yes' : 'No';
                    } else if ($key == 'arrival_date' && $stud['arrival_date']) {
                        $studentRow[] = (new DateTime($stud['arrival_date']))->format('m/d');
                    } else if ($key == 'arrival_time' && $stud['arrival_time']) {
                        $studentRow[] = (new DateTime($stud['arrival_time']))->format('H:i');
                    } else if ($key == 'repeater' && $stud['repeater']) {
                        $studentRow[] = $stud['repeater'] === 1 ? 'Yes' : 'No';
                    } else if ($key == 'building_id' && $stud['building_id']) {
                        $studentRow[] = $mapSchool[$stud['building_id']]["code"];
                    }  else {
                        //$student field; key(id_number) from template $firstSheet
                        $studentRow[] = $stud[$key];
                    }

                }
                $dataEx[] = $studentRow;
            }
            //create xls file to export
            Excel::create('EXPORT-super-flash-list', function ($excel) use ($dataEx) {
                $excel->getDefaultStyle()->getAlignment()->setHorizontal(\PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
                $excel->sheet('super_flash_list', function ($sheet) use ($dataEx) {
                    $sheet->fromArray($dataEx, null, 'A1', false, false);
                    $sheet->freezeFirstRow();
                    $sheet->cells('A1:O1', function ($cells) {
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
                "errors" => [$errorcodes['download_classlist_unsuccessfully']['key']],
            ), $statusCode['internal_server_error']);
        }
    }

    public function exportPickup(ApplyRequest $request) {
        $filename = 'Pickup-Excel-List.xlsx';
        $headers = array("Cache-Control: public", "Content-Description: File Transfer", "Content-Disposition: attachment; filename=$filename", 'Content-Type: application/vnd.ms-excel; charset=UTF-8', "Content-Encoding: UTF-8");
        try {
            $firstSheet = Excel::load("storage/template/Pickup-Excel-List.xlsx")->get()->first();
            $records = $firstSheet->toArray();

            $keyList = (array_keys($records[0]));

            $dataEx = array();
            $dataEx[] = $records[0];

            $data = $request->all();
            $students = $this->studentApplyService->exportPickupList($data);

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
                        } else if($stud['accommodation_id1'] == 7) {
                            $studentRow[] = "(walkin)";
                        } else if($stud['accommodation_id1'] == 8) {
                            $studentRow[] = "(walkin)";
                        } else {
                            $studentRow[] = strtoupper($mapRoom[$stud['room_id1']]["type"]);
                        }
                    } else if ($key == 'room_id1' && !$stud['room_id1']) {
                        $studentRow[] = "WALK-IN";
                    } else if ($key == 'options_pickup' && $stud['options_pickup']) {
                        $studentRow[] = $stud['options_pickup'] === 1 ? 'Yes' : 'No';
                    } else if ($key == 'options_meals' && $stud['options_meals']) {
                        $studentRow[] = $stud['options_meals'] === 1 ? 'Yes' : 'No';
                    } else if ($key == 'arrival_date' && $stud['arrival_date']) {
                        $studentRow[] = (new DateTime($stud['arrival_date']))->format('m/d');
                    } else if ($key == 'arrival_time' && $stud['arrival_time']) {
                        $studentRow[] = (new DateTime($stud['arrival_time']))->format('H:i');
                    } else if ($key == 'repeater' && $stud['repeater']) {
                        $studentRow[] = $stud['repeater'] === 1 ? 'Yes' : 'No';
                    } else {
                        //$student field; key(id_number) from template $firstSheet
                        $studentRow[] = $stud[$key];
                    }

                }
                $dataEx[] = $studentRow;
            }
            //create xls file to export
            Excel::create('EXPORT-pickup-list', function ($excel) use ($dataEx) {
                $excel->getDefaultStyle()->getAlignment()->setHorizontal(\PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
                $excel->sheet('pickup_list', function ($sheet) use ($dataEx) {
                    $sheet->fromArray($dataEx, null, 'A1', false, false);
                    $sheet->freezeFirstRow();
                    $sheet->cells('A1:X1', function ($cells) {
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
                "errors" => [$errorcodes['download_pickuplist_unsuccessfully']['key']],
            ), $statusCode['internal_server_error']);
        }
    }

    /**
     * @param ApplyRequest $request
     * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\Response
     */
    public function exportCamp(ApplyRequest $request) {
        return response()->download(storage_path('template/Camp-student-template.xlsx'));

    }

    /**
     * @param ApplyRequest $request
     * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\Response
     */
    public function export(ApplyRequest $request) {

        $filename = 'Export-student-data.xlsx';
        $headers = array("Cache-Control: public", "Content-Description: File Transfer", "Content-Disposition: attachment; filename=$filename", 'Content-Type: application/vnd.ms-excel; charset=UTF-8', "Content-Encoding: UTF-8");
        try {
            $firstSheet = Excel::load("storage/template/Export-student-template.xlsx")->get()->first();
            $records = $firstSheet->toArray();

            $keyList = (array_keys($records[0]));

            $dataEx = array();
            $dataEx[] = $records[0];

            $data = $request->all();
            $students = $this->studentApplyService->search($data);

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
                        } else if($stud['accommodation_id1'] == 7) {
                            $studentRow[] = "(walkin)";
                        } else if($stud['accommodation_id1'] == 8) {
                            $studentRow[] = "(walkin)";
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
                        } else if($stud['student_status'] == 9){
                            $studentRow[] = "LEAVE";
                        } else if($stud['student_status'] == 10){
                            $studentRow[] = "TENTATIVE";
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

    function arr2csv($fields) {
        $fp = fopen('php://temp', 'r+b');
        foreach ($fields as $field) {
            fputcsv($fp, $field);
        }
        rewind($fp);
        $tmp = str_replace(PHP_EOL, "\r\n", stream_get_contents($fp));
        return mb_convert_encoding($tmp, 'CP932', 'ASCII,JIS,UTF-8,eucJP-win,SJIS-win');
    }


    private function validateDataImport($data, $validatedData) {
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

    public function findStudentInfo($id) {
        $studentApply = $this->studentApplyService->findByEditId($id);
        return response()->json($studentApply);
    }

    public function generateInvoiceNumber($applyId) {
        $data = $this->studentApplyService->findById($applyId);
        $invoice = $this->invoiceService->findByApplyId($applyId);
        if(!$data['invoice_number']) {
            $invoiceNumber = $this->studentApplyService->getCountPerCountry($data['country_code']);
            $counter = $invoiceNumber['count'] + 1;
            $data['invoice_number'] = $data['country_code'].'A'
                .date("Ym")
                .str_pad($counter, 4, "00", STR_PAD_LEFT);
            $data->update(array("invoice_number" => $data['invoice_number']));
            $invoice->update(array("invoice_number" => $data['invoice_number'], "approved_date" => date("Y-m-d H:i:s")));
        }
        return response()->json(["message" => "generated_invoice_number_successfully"]);
    }

    public function generateExtInvoiceNumber($applyId) {
        $data = $this->studentApplyService->findById($applyId);
        if(!$data['ext_invoice_number']) {
            $data['ext_invoice_number'] = $data['invoice_number'].'-1';
            $data->update(array("ext_invoice_number" => $data['ext_invoice_number']));
        }
        return $data['ext_invoice_number'];
    }

    public function generateRefundInvoiceNumber($applyId) {
        $data = $this->studentApplyService->findById($applyId);
        if(!$data['refund_invoice_number']) {
            $data['refund_invoice_number'] = $data['invoice_number'].'-RFD';
            $data->update(array("refund_invoice_number" => $data['refund_invoice_number']));
        }
        return $data['refund_invoice_number'];
    }

    public function updateEditId($id) {
        $studentApply = $this->studentApplyService->findById($id);
        if(!$studentApply['edit_id']){
            $edit_no = md5($id."i@mas+r!n&");
            $studentApply->update(array("edit_id" => $edit_no));
        }
        return response()->json(["message" => "editId_retrieve_successfully"]);
    }

    public function updateInvoiceDueDate($applyId) {
        $dueDate = date("Y-m-d", strtotime("+21 days")); //due is 3 weeks after creation of Invoice
        $studentApply = $this->studentApplyService->findById($applyId);
        $studentApply->update(array("due_date" => $dueDate));
        return response()->json(["message" => "update_invoice_duedate_successfully"]);
    }

    public function updateStudentInfo(ApplyRequest $request, $id) {
        $data = $request->all();
        $ageUpdated = GlobalFunctions::calculateAge($data['birthday']);
        $studentApply = $this->studentApplyService->findByEditId($id);
        $studentApply->update(array("student_name" => $data['name'], "passport_name" => $data['passportName'], "birthday" => $data['birthday'], "sex" => $data["sex"] == "男性" || $data["sex"] == "M" ? 1 : 2 ,"age" => $ageUpdated,
            "nationality" => $data['nationality'], "address" => $data['address'], "phone" => $data['phone'], "email" => $data['email'], "job" => $data['job'], "emergency_contact" => isset($data['emergencyContact'])?$data['emergencyContact']:null,
            "email_family" => isset($data['emergencyContact'])?$data['emailFamily']:null, "skype_id" => isset($data['emergencyContact'])?$data['skypeId']:null, "line_id" => isset($data['emergencyContact'])?$data['lineId']:null));
        return response()->json(["message" => "update_successfully", "data" => $studentApply]);
    }

    public function getGraduatingList($gradFrom,$gradCampus) {
        $gradList = $this->studentApplyService->getGradList($gradFrom,$gradCampus);
        //Update dormitory_room_name only and display last room
        foreach ($gradList as $grads) {
            $reservedRooms = $this->reservationService->findRoomsByApplyIdWithGradFrom($grads['id'],$gradFrom);
            if($grads['dormitory_room_name'] && $grads['dormitory_room_id'] != 9999){
                foreach($reservedRooms as $reserved) {
                    $grads['dormitory_room_name'] = $reserved['room_name'].'(#'.$reserved['bed_name'].')';
                }
            } else {
                $room = explode(",", $grads['hotel_name']);
                $grads['dormitory_room_name'] = end($room);
            }
        }
        return response()->json($gradList);
    }

    public function getChangeDormRoomList($changeFrom,$changeTo,$campus) {
        $changeDormList = $this->studentApplyService->getChangeDorm($changeFrom,$changeTo,$campus);
        return response()->json($changeDormList);
    }

    public function getChangeHotelsRoomList($changeFrom,$changeTo,$campus) {
        $changeHotelsList = $this->studentApplyService->getChangeHotels($changeFrom,$changeTo,$campus);
        return response()->json($changeHotelsList);
    }

    public function getChangeWalkinsRoomList($changeFrom,$changeTo,$campus) {
        $changeWalkinsList = $this->studentApplyService->getChangeWalkins($changeFrom,$changeTo,$campus);
        return response()->json($changeWalkinsList);
    }

    public function getChangeCondosRoomList($changeFrom,$changeTo,$campus) {
        $changeCondosList = $this->studentApplyService->getChangeCondos($changeFrom,$changeTo,$campus);
        return response()->json($changeCondosList);
    }

    public function getChangeHotelRoomList($changeFrom,$changeTo,$campus) {
        $changeHotelList = $this->studentApplyService->getChangeHotel($changeFrom,$changeTo,$campus);
        return response()->json($changeHotelList);
    }

    public function getChangePlanList($changePlanFrom,$changePlanTo,$campus) {
        $changePlanList = $this->studentApplyService->getChangePlan($changePlanFrom,$changePlanTo,$campus);
        return response()->json($changePlanList);
    }

    public function addStudentPayment(ApplyRequest $request, $editId) {
        $data = $request->all();
        $today = date("Y-m-d H:i:s");
        $studentApply = $this->studentApplyService->findByEditId($editId);
        $updatePaymentPending = (($studentApply['payment_pending']?$studentApply['payment_pending']:0) + 1);
        $studentApply->update(array("payment_pending" => $updatePaymentPending));
        $paymentArray = array("student_id" => $studentApply['id'], "edit_id" => $editId, "confirm" => 1, "payment_amount" => $data['amountPayment'],
            "payment_currency" => $data['currencyPayment'], "created_at" => $today, "updated_at" => $today);
        $payment = $this->paymentsService->create($paymentArray);
        return response()->json(["message" => "update_successfully", "data" => $payment]);
    }

    public function confirmStudentPayment($id) {
        $today = date("Y-m-d H:i:s");
        $user = \Request::get('user');
        //find the pending amount for the student
        $payment = $this->paymentsService->findByPaymentsId($id);
        // update payment table in the database
        $payment->update(array("confirm" => 0, "confirm_by" => $user['name'], "updated_at" => $today));
        //find the student in student_apply
        $studentApply = $this->studentApplyService->findByEditId($payment['edit_id']);
        //add/update the paid_amount and payment_pending fields
        $paidAmount = ($studentApply['paid_amount']?$studentApply['paid_amount']:0) + $payment['payment_amount'];
        $updatePaymentPending = ($studentApply['payment_pending'] - 1);
        $studentApply->update(array("paid_amount" => $paidAmount, "payment_pending" => $updatePaymentPending));
        return response()->json(array("message" => "update_successfully","data" => $payment));
    }

    public function getPaymentsUnconfirmed($id) {
        $paymentsList = $this->paymentsService->findPaymentsToConfirm($id);
        return response()->json($paymentsList);
    }

    public function getPaymentsConfirmed($id) {
        $paymentsList = $this->paymentsService->findPaymentsAlreadyConfirmed($id);
        return response()->json($paymentsList);
    }

    public function deleteStudent($applyId, $delFlagOne) {
        $apply = $this->studentApplyService->findById($applyId);
        //find reserved rooms in reservations table
        $reservedRooms = $this->reservationService->findRoomsByApplyId($applyId);
        foreach ($reservedRooms as $rooms) {
            // remove $applyId from reservations
            $removeRsev = $this->reservationService->findById($rooms['id']);
            $removeRsev->delete();
            // remove $reservationId from reservations_student_apply
            $listResv = $apply->dormitoryRoomReservationList();
            $listResv->detach([$rooms['id']]);
        }
        //find reserved hotels and walkins in other_reservations table
        $reservedHotelsWalkin = $this->otherReservationService->findByStudentId($applyId);
        foreach ($reservedHotelsWalkin as $others) {
            // remove $applyId from other_reservations
            $removeRsev = $this->otherReservationService->findById($others['id']);
            $removeRsev->delete();
            // remove $reservationId from reservations_student_apply
            $listResv = $apply->hotelWalkinReservationList();
            $listResv->detach([$others['id']]);
        }
        //find reserved condos in condo_reservations table
        $reservedCondoRooms = $this->condoReservationService->findRoomsByApplyId($applyId);
        foreach ($reservedCondoRooms as $rooms) {
            // remove $applyId from condo_reservations
            $removeRsev = $this->condoReservationService->findById($rooms['id']);
            $removeRsev->delete();
            // remove $reservationId from condo_reservations_student_apply
            $listResv = $apply->condoRoomReservationList();
            $listResv->detach([$rooms['id']]);
        }
        //find reserved hotels in hotels_reservations table
        $reservedHotelsRooms = $this->hotelsReservationService->findRoomsByApplyId($applyId);
        foreach ($reservedHotelsRooms as $rooms) {
            // remove $applyId from hotels_reservations
            $removeRsev = $this->hotelsReservationService->findById($rooms['id']);
            $removeRsev->delete();
            // remove $reservationId from hotels_reservations_student_apply
            $listResv = $apply->hotelsRoomReservationList();
            $listResv->detach([$rooms['id']]);
        }
        //find reserved walkins in walkin_reservations table
        $reservedWalkinRooms = $this->walkinReservationService->findRoomsByApplyId($applyId);
        foreach ($reservedWalkinRooms as $rooms) {
            // remove $applyId from walkin_reservations
            $removeRsev = $this->walkinReservationService->findById($rooms['id']);
            $removeRsev->delete();
            // remove $reservationId from student_apply_walkin_reservations
            $listResv = $apply->walkinRoomReservationList();
            $listResv->detach([$rooms['id']]);
        }
        //find student plan/s in courses table and then remove each plan
        $studentCourse = $this->courseService->findByStudentId($applyId);
        foreach ($studentCourse as $course) {
            $this->courseService->remove($course['id']);
        }
        //find discounts in invoice_discounts table and then remove each discount
        $invoiceDiscount = $this->invoiceDiscountService->findByApplyId($applyId);
        foreach ($invoiceDiscount as $discount) {
            $this->invoiceDiscountService->remove($discount['id']);
        }
        $apply->update(array("delete_flag" => $delFlagOne, "dormitory_room_name" => '', "hotel_name" => '', "course" => '',"commission" => 0, "discount" => 0));
        return response()->json(["message" => "student_discounts_courses_and_reservations_deleted_successfully"]);
    }

    public function removeWalkin($applyId) {
        $apply = $this->studentApplyService->findById($applyId);
        $apply->update(array("dormitory_room_name" => str_replace(',Walk-in', '', $apply['dormitory_room_name'])));
        return response()->json(["message" => "walkin__deleted_successfully"]);
    }

    /**
     * This function converts to a (from and to) chosen currencies rate e.g. USD to PHP
     * @param $amount
     * @param $from
     * @param $to
     * @return float
     */
    public function convertCurrency($amount, $from, $to) {
        $conv_id = "{$from}_{$to}";
        $json_a = json_decode(file_get_contents("http://free.currencyconverterapi.com/api/v3/convert?q=$conv_id&compact=ultra"), true);
        return $amount * round($json_a[$conv_id], 4);
    }

    /**
     * @param $studentApplyWithInvoice
     * @return float
     */
    public function getExchangeRate($studentApplyWithInvoice) {
        $currency_to = "PHP";
        $currency_from = $studentApplyWithInvoice['country_code']=="JP"? "JPY" : "USD";
        return $this->convertCurrency($this->getStudentTotalTuitionPayment($studentApplyWithInvoice),$currency_from,$currency_to);
    }

    /**
     * @param $studentApplyWithInvoice
     * @return mixed
     */
    public function getStudentTotalTuitionPayment($studentApplyWithInvoice) {
        $invoiceValuesToAdd = array($studentApplyWithInvoice['sub_total'],$studentApplyWithInvoice['entrance_fee'],$studentApplyWithInvoice['holiday_fee'],$studentApplyWithInvoice['transfer_fee']);
        return (array_sum($invoiceValuesToAdd) - $studentApplyWithInvoice['discount']);
    }

    /**
     * @param $applyInvoice
     * @return float
     */
    public function getExchangeRateRfdInv($refundInvoice, $applyInvoice) {
        $totalTuitionFeeRefund = ($refundInvoice['rfd_entrance_fee']
                + $refundInvoice['rfd_tuition_accommodation_fee']
                + $refundInvoice['rfd_room_upgrade_fee']
                + $refundInvoice['rfd_plan_upgrade_fee']
                + $refundInvoice['rfd_other1_fee']
                + $refundInvoice['rfd_other2_fee']
                + $refundInvoice['rfd_holiday_fee']) - ($refundInvoice['rfd_agent_commission'] + $refundInvoice['rfd_discount']);
        $totalTuitionFeeInvoice = ($applyInvoice['entrance_fee']
                + $applyInvoice['sub_total']
                + $applyInvoice['holiday_fee']
                + $applyInvoice['transfer_fee']) - ($applyInvoice['commission'] + $applyInvoice['discount']);;
        $currency_from = "USD"; $currency_to = "PHP";
        $currency = $this->convertCurrency(($totalTuitionFeeInvoice - $totalTuitionFeeRefund), $currency_from, $currency_to);
        return $currency;
    }

    /**
     * @param $applyInvoice
     * @return float
     */
    public function getExchangeRateExtInv($applyInvoice) {
        $totalTuitionFee = ($applyInvoice['ext_entrance_fee'] + $applyInvoice['ext_tuition_accommodation_fee'] + $applyInvoice['ext_room_upgrade_fee'] + $applyInvoice['ext_plan_upgrade_fee'] + $applyInvoice['ext_other1_fee'] + $applyInvoice['ext_other2_fee'] + $applyInvoice['ext_holiday_fee']) - $applyInvoice['ext_discount'];
        $currency_from = "USD"; $currency_to = "PHP";
        $currency = $this->convertCurrency($totalTuitionFee, $currency_from, $currency_to);
        return $currency;
    }

    /**
     * @param $applyInvoice
     * @return float
     */
    public function getExchangeRateInv($applyInvoice) {
        $totalTuitionFee = (($applyInvoice['entrance_fee'] + $applyInvoice['sub_total'] + $applyInvoice['holiday_fee'] + $applyInvoice['transfer_fee']) - $applyInvoice['discount']);
        $currency_from = "USD"; $currency_to = "PHP";
        $currency = $this->convertCurrency($totalTuitionFee, $currency_from, $currency_to);
        return $currency;
    }

    public function addStudentCourse($bldg,$course,$dateFrom,$dateTo,$applyId) {
        $apply = $this->studentApplyService->findById($applyId);
        $today = date("Y-m-d H:i:s");
        $user = \Request::get('user');
        $nationalityId = $this->getNationalityId($apply['country_code']);
        $courseName = $this->getCourseName($course,$nationalityId);
        $formatFrom = strtotime($dateFrom);
        $formatTo = strtotime($dateTo);
        $memoDateFrom = date('m/j',$formatFrom);
        $memoDateTo = date('m/j',$formatTo);
        $memo = ($bldg === '1' ? 'ITP':'SFC').' '.$memoDateFrom.'-'.$memoDateTo.' '.$courseName;
        //clean existing dormitory name from import
        if (!$apply['plan_id']) {$apply['course'] = '';}
        $dataArray = array("student_id" => $apply['id'], "bldg_id" => $bldg, "course_name" => $courseName,
            "date_from" => $dateFrom, "date_to" => $dateTo, "memo" => $memo, "created_by" => $user['name'], "created_at" => $today, "updated_at" => $today);
        //save in courses table
        $this->courseService->create($dataArray);
        $courseLogArray = array("user" => $user['name'], "student_id" => $apply['id'], "email_address" => $user['email'],
            "course" => $courseName, "action" => "Add", "start_date" => $dateFrom, "end_date" => $dateTo, "created_at" => $today, "updated_at" => $today);
        //save in course_logs table
        $this->courseLogService->create($courseLogArray);
        $apply->update(array("course" => $apply['course'] . "," .$courseName, "plan_id" => $course));
        return response()->json(["message" => "course_successfully_added"]);
    }

    public function deleteStudentCourse($courseId,$applyId) {
        $today = date("Y-m-d H:i:s");
        $user = \Request::get('user');
        $apply = $this->studentApplyService->findById($applyId);
        $course = $this->courseService->findById($courseId);
        $courseLogArray = array("user" => $user['name'], "student_id" => $course['student_id'], "email_address" => $user['email'], "course" => $course['course_name'], "action" => "Delete",
            "start_date" => $course['date_from'], "end_date" => $course['date_to'], "created_at" => $today, "updated_at" => $today);
        //save in course_logs table
        $this->courseLogService->create($courseLogArray);
        $apply->update(array("course" => str_replace(','.$course['course_name'], '', $apply['course'])));
        $removeCourse = $this->courseService->remove($courseId);
        return response()->json(["message" => "course_deleted_successfully","data" => $removeCourse]);
    }

    public function findCourseList($applyId) {
        $courses = $this->courseService->findByStudentId($applyId);
        return response()->json($courses);
    }

    public function findCourseLogsList($applyId) {
        $courseLogs = $this->courseLogService->findByStudentId($applyId);
        return response()->json($courseLogs);
    }

    public function getPlanCountList($countPlanFrom,$countPlanTo,$countPlanCampus,$countCntCode) {
        $planList = $this->studentApplyService->getPlanList($countPlanFrom,$countPlanTo,$countPlanCampus,$countCntCode);
        if($countCntCode == 1) {
            $intStandardCtr = 0;$intLightCtr = 0;$intToeicCtr = 0;$intIeltsFourCtr = 0;$intIeltsSixCtr = 0;$intSuperiorCtr = 0;
            $intInternCtr = 0;$intBusinessCtr = 0;$intFamilyCtr = 0;$intSuperLightCtr = 0;
            foreach ($planList as $item) {
                if(strtolower($item['course_plan']) == 'standard') {
                    $intStandardCtr++;
                } if(strtolower($item['course_plan']) == 'light') {
                    $intLightCtr++;
                } if(strtolower($item['course_plan']) == 'toeic') {
                    $intToeicCtr++;
                } if(strtolower($item['course_plan']) == 'ielts (4 plan)') {
                    $intIeltsFourCtr++;
                } if(strtolower($item['course_plan']) == 'ielts (6 plan)') {
                    $intIeltsSixCtr++;
                }  if(strtolower($item['course_plan']) == 'superior') {
                    $intSuperiorCtr++;
                }  if(strtolower($item['course_plan']) == 'intern') {
                    $intInternCtr++;
                }  if(strtolower($item['course_plan']) == 'business') {
                    $intBusinessCtr++;
                }  if(strtolower($item['course_plan']) == 'family') {
                    $intFamilyCtr++;
                }  if(strtolower($item['course_plan']) == 'super light') {
                    $intSuperLightCtr++;
                }
            }
            $totalPlans = $intStandardCtr + $intLightCtr + $intToeicCtr + $intIeltsFourCtr + $intIeltsSixCtr + $intSuperiorCtr + $intInternCtr +
                $intBusinessCtr + $intFamilyCtr + $intSuperLightCtr;
            $IntPlansCounter[] = array("standard" => $intStandardCtr, "light" => $intLightCtr, "toeic" => $intToeicCtr,
                "ielts4plan" => $intIeltsFourCtr, "ielts6plan" => $intIeltsSixCtr,"superior" => $intSuperiorCtr,"intern" => $intInternCtr,
                "business" => $intBusinessCtr,"family" => $intFamilyCtr,"superlight" => $intSuperLightCtr, "totalIntPlan" => $totalPlans);
            return response()->json(array("planList" => $IntPlansCounter));

        } else {
            $jpStandardCtr = 0;$jpSuperiorCtr = 0;$jpLightCtr = 0;$jpSupShortCtr = 0;$jpSupShortLightCtr = 0;$jpSupShortOnlineCtr = 0;
            $jpBusinessCtr = 0;$jpToeicwithoutCtr = 0;$jpToeicwithCtr = 0;$jpIeltsCtr = 0;$jpFamilyCtr = 0;
            $jpSpecialCtr = 0;$jpInternCtr = 0;$jpSuperLightCtr = 0;$jpBodyMakeSTCtr = 0;$jpBodyMakeHLCtr = 0;
            foreach ($planList as $item) {
                if(strtolower($item['course_plan']) == 'standard') {
                    $jpStandardCtr++;
                } if(strtolower($item['course_plan']) == 'superior') {
                    $jpSuperiorCtr++;
                } if(strtolower($item['course_plan']) == 'light') {
                    $jpLightCtr++;
                } if(strtolower($item['course_plan']) == 'super short light') {
                    $jpSupShortCtr++;
                } if(strtolower($item['course_plan']) == 'super short') {
                    $jpSupShortLightCtr++;
                } if(strtolower($item['course_plan']) == 'super short + online') {
                    $jpSupShortOnlineCtr++;
                } if(strtolower($item['course_plan']) == 'business') {
                    $jpBusinessCtr++;
                } if(strtolower($item['course_plan']) == 'toeic w/out guarantee') {
                    $jpToeicwithoutCtr++;
                } if(strtolower($item['course_plan']) == 'toeic with guarantee') {
                    $jpToeicwithCtr++;
                } if(strtolower($item['course_plan']) == 'ielts') {
                    $jpIeltsCtr++;
                } if(strtolower($item['course_plan']) == 'family') {
                    $jpFamilyCtr++;
                }  if(strtolower($item['course_plan']) == 'special') {
                    $jpSpecialCtr++;
                }  if(strtolower($item['course_plan']) == 'intern') {
                    $jpInternCtr++;
                }  if(strtolower($item['course_plan']) == 'super light') {
                    $jpSuperLightCtr++;
                }  if(strtolower($item['course_plan']) == 'body make st') {
                    $jpBodyMakeSTCtr++;
                }  if(strtolower($item['course_plan']) == 'body make hl') {
                    $jpBodyMakeHLCtr++;
                }
            }
            $totalPlans = $jpStandardCtr + $jpSuperiorCtr + $jpLightCtr + $jpSupShortCtr + $jpSupShortLightCtr + $jpSupShortOnlineCtr +
                $jpBusinessCtr + $jpToeicwithoutCtr + $jpToeicwithCtr + $jpIeltsCtr + $jpFamilyCtr + $jpSpecialCtr + $jpInternCtr +
                $jpSuperLightCtr + $jpBodyMakeSTCtr + $jpBodyMakeHLCtr;
            $JpPlansCounter[] = array("standard" => $jpStandardCtr, "superior" => $jpSuperiorCtr, "light" => $jpLightCtr, "supershortlight" => $jpSupShortCtr,
                "supershort" => $jpSupShortLightCtr, "supershortonline" => $jpSupShortOnlineCtr, "business" => $jpBusinessCtr,
                "toeicwithout" => $jpToeicwithoutCtr, "toeicwith" => $jpToeicwithCtr, "ielts" => $jpIeltsCtr,
                "family" => $jpFamilyCtr,"special" => $jpSpecialCtr,"intern" => $jpInternCtr, "superlight" => $jpSuperLightCtr,
                "bodymakest" => $jpBodyMakeSTCtr,"bodymakehl" => $jpBodyMakeHLCtr,"totalJpPlan" => $totalPlans);
            return response()->json(array("planList" => $JpPlansCounter));
        }
    }


    public function getCountWeeklyReportStudents($weeklyFrom,$selectedCampus) {
        $weekMap = array();
        $startDate = date('Y-m-d', strtotime($weeklyFrom. ' - 7 days'));
        for ($i = 1; $i <= 8; $i++) {
            $startWeekEnd = strtotime("next sunday, 12pm", strtotime($startDate));
            $endWeekEnd = strtotime("next saturday, 12pm", $startWeekEnd);
            $startDate = date("Y-m-d", $startWeekEnd);
            $endDate = date("Y-m-d", $endWeekEnd);
            $jp = $this->studentApplyService->getWeeklyListStudentReport(array("status" => 256, "visitcode" => 1, "nation" => 'JP', "campus" => $selectedCampus, "weekstart" => $startDate, "weekend" => $endDate));
            $tw = $this->studentApplyService->getWeeklyListStudentReport(array("status" => 256, "visitcode" => 1, "nation" => 'TW', "campus" => $selectedCampus, "weekstart" => $startDate, "weekend" => $endDate));
            $cn = $this->studentApplyService->getWeeklyListStudentReport(array("status" => 256, "visitcode" => 1, "nation" => 'CN', "campus" => $selectedCampus, "weekstart" => $startDate, "weekend" => $endDate));
            $kr = $this->studentApplyService->getWeeklyListStudentReport(array("status" => 256, "visitcode" => 1, "nation" => 'KR', "campus" => $selectedCampus, "weekstart" => $startDate, "weekend" => $endDate));
            $arab = $this->studentApplyService->getWeeklyListStudentReport(array("status" => 256, "visitcode" => 1, "nation" => 'ARAB', "campus" => $selectedCampus, "weekstart" => $startDate, "weekend" => $endDate));
            $vn = $this->studentApplyService->getWeeklyListStudentReport(array("status" => 256, "visitcode" => 1, "nation" => 'VN', "campus" => $selectedCampus, "weekstart" => $startDate, "weekend" => $endDate));
            $ru = $this->studentApplyService->getWeeklyListStudentReport(array("status" => 256, "visitcode" => 1, "nation" => 'RU', "campus" => $selectedCampus, "weekstart" => $startDate, "weekend" => $endDate));
            $th = $this->studentApplyService->getWeeklyListStudentReport(array("status" => 256, "visitcode" => 1, "nation" => 'TH', "campus" => $selectedCampus, "weekstart" => $startDate, "weekend" => $endDate));
            $mn = $this->studentApplyService->getWeeklyListStudentReport(array("status" => 256, "visitcode" => 1, "nation" => 'MN', "campus" => $selectedCampus, "weekstart" => $startDate, "weekend" => $endDate));
            $others = $this->studentApplyService->getWeeklyListStudentReport(array("status" => 256, "visitcode" => 1, "nation" => 'OTHERS', "campus" => $selectedCampus, "weekstart" => $startDate, "weekend" => $endDate));
            $interns = $this->studentApplyService->getWeeklyListStudentReport(array("status" => 256, "visitcode" => 3, "campus" => $selectedCampus, "weekstart" => $startDate, "weekend" => $endDate));
            $nonstudents = $this->studentApplyService->getWeeklyListStudentReport(array("status" => 256, "visitcode" => 245, "campus" => $selectedCampus, "weekstart" => $startDate, "weekend" => $endDate));
            $tentatives = $this->studentApplyService->getWeeklyListStudentReport(array("status" => 10, "campus" => $selectedCampus, "weekstart" => $startDate, "weekend" => $endDate));
            $total = array_sum(array($jp['numOfStudents'],$tw['numOfStudents'],$cn['numOfStudents'],$kr['numOfStudents'],$arab['numOfStudents'],$vn['numOfStudents'],$ru['numOfStudents'],$th['numOfStudents'],$mn['numOfStudents'],$others['numOfStudents']));
            $weekMap[$startDate] = array("arrive" => $startDate, "end" => $endDate,"interns" => $interns['numOfStudents'], "nonstudents" => $nonstudents['numOfStudents'], "tentatives" => $tentatives['numOfStudents'], "total" => $total,
                "_jp" => $jp['numOfStudents'], "_jppercent" => $jp['numOfStudents']?round(($jp['numOfStudents']/$total)* 100 , 0).'%':'0%',
                "_tw" => $tw['numOfStudents'], "_twpercent" => $tw['numOfStudents']?round(($tw['numOfStudents']/$total)* 100 , 0).'%':'0%',
                "_cn" => $cn['numOfStudents'], "_cnpercent" => $cn['numOfStudents']?round(($cn['numOfStudents']/$total)* 100 , 0).'%':'0%',
                "_kr" => $kr['numOfStudents'], "_krpercent" => $kr['numOfStudents']?round(($kr['numOfStudents']/$total)* 100 , 0).'%':'0%',
                "_arab" => $arab['numOfStudents'], "_arabpercent" => $arab['numOfStudents']?round(($arab['numOfStudents']/$total)* 100 , 0).'%':'0%',
                "_vn" => $vn['numOfStudents'], "_vnpercent" => $vn['numOfStudents']?round(($vn['numOfStudents']/$total)* 100 , 0).'%':'0%',
                "_ru" => $ru['numOfStudents'], "_rupercent" => $ru['numOfStudents']?round(($ru['numOfStudents']/$total)* 100 , 0).'%':'0%',
                "_th" => $th['numOfStudents'], "_thpercent" => $th['numOfStudents']?round(($th['numOfStudents']/$total)* 100 , 0).'%':'0%',
                "_mn" => $mn['numOfStudents'], "_mnpercent" => $mn['numOfStudents']?round(($mn['numOfStudents']/$total)* 100 , 0).'%':'0%',
                "_others" => $others['numOfStudents'], "_otherspercent" => $others['numOfStudents']?round(($others['numOfStudents']/$total)* 100 , 0).'%':'0%',);
        }
        $i = 0;
        $fourWeekHeader = array();
        $fourWeekBody = array();
        $fourWeekMap = array();
        foreach ($weekMap as $key => $item) {
            $fourWeekHeader[] = $key;
            $fourWeekBody[] = $item;
            $i++;
            if ($i % 8 == 0) {
                $fourWeekMap[] = array("weekday" => $fourWeekHeader, "weekcontent" => $fourWeekBody);
                $fourWeekHeader = array();
                $fourWeekBody = array();
            }
        }
        return response()->json($fourWeekMap);
    }

    public function getReportSales($salesFrom,$salesTo) {
        $last_day = date("Y-m-t", strtotime($salesFrom));
        $dates = $this->dateRange($salesFrom, $salesTo);

        $salesFrom_lastyear = date("Y-m-d",strtotime("-1 year", strtotime($salesFrom)));
        $last_day_lastyear = date("Y-m-d",strtotime("-1 year", strtotime($salesTo)));
        $dates_lastyear = $this->dateRange($salesFrom_lastyear, $last_day_lastyear);

        //JP students
        $jpStudentsDS = array();$jpStudentsAS = array();$jpWeeksDS = array();$jpWeeksAS = array();
        //TW students
        $twStudents = array();$twWeeks = array();
        //KR students
        $krStudents = array();$krWeeks = array();
        //CN students
        $cnStudents = array();$cnWeeks = array();
        //RU students
        $ruStudents = array();$ruWeeks = array();
        //VN students
        $vnStudents = array();$vnWeeks = array();
        //ARAB students
        $arabStudents = array();$arabWeeks = array();
        //TH students
        $thStudents = array();$thWeeks = array();
        //MN students
        $mnStudents = array();$mnWeeks = array();
        //Other students
        $otherStudents = array();$otherWeeks = array();

        $totalStudents = array();
        $totalWeeks = array();
        $datesDisplay = array();

        $totalStudentsLastYear = array();
        $totalWeeksLastYear = array();

        $totalJPDirectPerLine = 0;$totalJPAgentPerLine = 0;$totalTWPerLine = 0;$totalKRPerLine = 0;$totalCNPerLine = 0;
        $totalRUPerLine = 0;$totalVNPerLine = 0;$totalARABPerLine = 0;$totalTHPerLine = 0;$totalOTHERSPerLine = 0;$totalMNPerLine = 0;

        $totalJPDWksPerLine = 0;$totalJPAWksPerLine = 0;$totalTWWksPerLine = 0;$totalKRWksPerLine = 0;$totalCNWksPerLine = 0;
        $totalRUWksPerLine = 0;$totalVNWksPerLine = 0;$totalARABWksPerLine = 0;$totalTHWksPerLine = 0;$totalOTHERSWksPerLine = 0;$totalMNWksPerLine = 0;

        $totalStudentsPerLine=0;$totalWeeksPerLine=0;

        $lastYearTotalJPDirectPerLine = 0;$lastYearTotalJPAgentPerLine = 0;$lastYearTotalTWPerLine = 0;$lastYearTotalKRPerLine = 0;$lastYearTotalCNPerLine = 0;
        $lastYearTotalRUPerLine = 0;$lastYearTotalVNPerLine = 0;$lastYearTotalARABPerLine = 0;$lastYearTotalTHPerLine = 0;$lastYearTotalOTHERSPerLine = 0;$lastYearTotalMNPerLine = 0;

        $lastYearTotalJPDWksPerLine = 0;$lastYearTotalJPAWksPerLine = 0;$lastYearTotalTWWksPerLine = 0;$lastYearTotalKRWksPerLine = 0;$lastYearTotalCNWksPerLine = 0;
        $lastYearTotalRUWksPerLine = 0;$lastYearTotalVNWksPerLine = 0;$lastYearTotalARABWksPerLine = 0;$lastYearTotalTHWksPerLine = 0;$lastYearTotalOTHERSWksPerLine = 0;$lastYearTotalMNWksPerLine = 0;

        $lastYearTotalStudentsPerLine=0;$lastYearTotalWeeksPerLine=0;

        // Loop through each day until the last day of the month
        foreach ($dates as $date) {
            list($jpdirect, $jpagent, $jpwkdirect, $jpwkagent, $tw, $twwk,
                $kr, $krwk, $cn, $cnwk, $ru, $ruwk, $vn, $vnwk,
                $arab, $arabwk, $th, $thwk, $others, $otherswk, $mn, $mnwk,) = $this->getStudentsSaleReport($date);

            $sumStud = $this->studentApplyService->getSumOfStudents($date);
            $sumWks = $this->studentApplyService->getSumOfStudentsWeek($date);

            //Students Count
            array_push($jpStudentsDS,$jpdirect['numOfStudents']);
            array_push($jpStudentsAS,$jpagent['numOfStudents']);
            array_push($twStudents,$tw['numOfStudents']);
            array_push($krStudents,$kr['numOfStudents']);
            array_push($cnStudents,$cn['numOfStudents']);
            array_push($ruStudents,$ru['numOfStudents']);
            array_push($vnStudents,$vn['numOfStudents']);
            array_push($arabStudents,$arab['numOfStudents']);
            array_push($thStudents,$th['numOfStudents']);
            array_push($mnStudents,$mn['numOfStudents']);
            array_push($otherStudents,$others['numOfStudents']);

            $totalJPDirectPerLine += $jpdirect['numOfStudents'];
            $totalJPAgentPerLine += $jpagent['numOfStudents'];
            $totalTWPerLine += $tw['numOfStudents'];
            $totalKRPerLine += $kr['numOfStudents'];
            $totalCNPerLine += $cn['numOfStudents'];
            $totalRUPerLine += $ru['numOfStudents'];
            $totalVNPerLine += $vn['numOfStudents'];
            $totalARABPerLine += $arab['numOfStudents'];
            $totalTHPerLine += $th['numOfStudents'];
            $totalMNPerLine += $mn['numOfStudents'];
            $totalOTHERSPerLine += $others['numOfStudents'];
            $totalStudentsPerLine += $sumStud['totalSumOfStudents'];

            //Weeks Count
            array_push($jpWeeksDS,$jpwkdirect['numOfWeeks']?$jpwkdirect['numOfWeeks']:0);
            array_push($jpWeeksAS,$jpwkagent['numOfWeeks']?$jpwkagent['numOfWeeks']:0);
            array_push($twWeeks,$twwk['numOfWeeks']?$twwk['numOfWeeks']:0);
            array_push($krWeeks,$krwk['numOfWeeks']?$krwk['numOfWeeks']:0);
            array_push($cnWeeks,$cnwk['numOfWeeks']?$cnwk['numOfWeeks']:0);
            array_push($ruWeeks,$ruwk['numOfWeeks']?$ruwk['numOfWeeks']:0);
            array_push($vnWeeks,$vnwk['numOfWeeks']?$vnwk['numOfWeeks']:0);
            array_push($arabWeeks,$arabwk['numOfWeeks']?$arabwk['numOfWeeks']:0);
            array_push($thWeeks,$thwk['numOfWeeks']?$thwk['numOfWeeks']:0);
            array_push($mnWeeks,$mnwk['numOfWeeks']?$mnwk['numOfWeeks']:0);
            array_push($otherWeeks,$otherswk['numOfWeeks']?$otherswk['numOfWeeks']:0);

            $totalJPDWksPerLine += $jpwkdirect['numOfWeeks'];
            $totalJPAWksPerLine += $jpwkagent['numOfWeeks'];
            $totalTWWksPerLine += $twwk['numOfWeeks'];
            $totalKRWksPerLine += $krwk['numOfWeeks'];
            $totalCNWksPerLine += $cnwk['numOfWeeks'];
            $totalRUWksPerLine += $ruwk['numOfWeeks'];
            $totalVNWksPerLine += $vnwk['numOfWeeks'];
            $totalARABWksPerLine += $arabwk['numOfWeeks'];
            $totalTHWksPerLine += $thwk['numOfWeeks'];
            $totalMNWksPerLine += $mnwk['numOfWeeks'];
            $totalOTHERSWksPerLine += $otherswk['numOfWeeks'];
            $totalWeeksPerLine += $sumWks['totalSumOfWeeks'];

            //Total Count per day
            array_push($totalStudents,$sumStud['totalSumOfStudents']?$sumStud['totalSumOfStudents']:0);
            array_push($totalWeeks,$sumWks['totalSumOfWeeks']?$sumWks['totalSumOfWeeks']:0);

            //Dates display
            array_push($datesDisplay,date("m/d", strtotime($date)));
        }

        // PREVIOUS YEAR : Loop through each day until the last day of the month
        foreach ($dates_lastyear as $lastyeardate) {

            list($jpdirect, $jpagent, $jpwkdirect, $jpwkagent, $tw, $twwk,
                $kr, $krwk, $cn, $cnwk, $ru, $ruwk, $vn, $vnwk,
                $arab, $arabwk, $th, $thwk, $others, $otherswk, $mn, $mnwk) = $this->getStudentsSaleReport($lastyeardate);

            $sumStudLastYear = $this->studentApplyService->getSumOfStudents($lastyeardate);
            $sumWksLastYear = $this->studentApplyService->getSumOfStudentsWeek($lastyeardate);

            //Students Count
            $lastYearTotalJPDirectPerLine += $jpdirect['numOfStudents'];
            $lastYearTotalJPAgentPerLine += $jpagent['numOfStudents'];
            $lastYearTotalTWPerLine += $tw['numOfStudents'];
            $lastYearTotalKRPerLine += $kr['numOfStudents'];
            $lastYearTotalCNPerLine += $cn['numOfStudents'];
            $lastYearTotalRUPerLine += $ru['numOfStudents'];
            $lastYearTotalVNPerLine += $vn['numOfStudents'];
            $lastYearTotalARABPerLine += $arab['numOfStudents'];
            $lastYearTotalTHPerLine += $th['numOfStudents'];
            $lastYearTotalMNPerLine += $mn['numOfStudents'];
            $lastYearTotalOTHERSPerLine += $others['numOfStudents'];

            $lastYearTotalStudentsPerLine += $sumStudLastYear['totalSumOfStudents'];

            //Weeks Count
            $lastYearTotalJPDWksPerLine += $jpwkdirect['numOfWeeks'];
            $lastYearTotalJPAWksPerLine += $jpwkagent['numOfWeeks'];
            $lastYearTotalTWWksPerLine += $twwk['numOfWeeks'];
            $lastYearTotalKRWksPerLine += $krwk['numOfWeeks'];
            $lastYearTotalCNWksPerLine += $cnwk['numOfWeeks'];
            $lastYearTotalRUWksPerLine += $ruwk['numOfWeeks'];
            $lastYearTotalVNWksPerLine += $vnwk['numOfWeeks'];
            $lastYearTotalARABWksPerLine += $arabwk['numOfWeeks'];
            $lastYearTotalTHWksPerLine += $thwk['numOfWeeks'];
            $lastYearTotalMNWksPerLine += $mnwk['numOfWeeks'];
            $lastYearTotalOTHERSWksPerLine += $otherswk['numOfWeeks'];

            $lastYearTotalWeeksPerLine += $sumWksLastYear['totalSumOfWeeks'];

            //Total Count per day
            array_push($totalStudentsLastYear,$sumStudLastYear['totalSumOfStudents']?$sumStudLastYear['totalSumOfStudents']:0);
            array_push($totalWeeksLastYear,$sumWksLastYear['totalSumOfWeeks']?$sumWksLastYear['totalSumOfWeeks']:0);

        }

        $salesReport[] = array("jpDirect" => $jpStudentsDS,"jpAgent" => $jpStudentsAS,
            "jpWeeksDS" => $jpWeeksDS, "jpWeeksAS" => $jpWeeksAS, "tw" => $twStudents, "twWeeks" => $twWeeks,
            "kr" => $krStudents, "krWeeks" => $krWeeks, "cn" => $cnStudents, "cnWeeks" => $cnWeeks,
            "ru" => $ruStudents, "ruWeeks" => $ruWeeks, "vn" => $vnStudents, "vnWeeks" => $vnWeeks,
            "arab" => $arabStudents, "arabWeeks" => $arabWeeks, "th" => $thStudents, "thWeeks" => $thWeeks,
            "others" => $otherStudents, "othersWeeks" => $otherWeeks, "mn" => $mnStudents, "mnWeeks" => $mnWeeks,
            "allTotalStudents" => $totalStudents,"allTotalWeeks" => $totalWeeks, "allDatesHeader" => $datesDisplay,
            "totalJPDRow" => $totalJPDirectPerLine,"totalJPARow" => $totalJPAgentPerLine, "totalTWRow" => $totalTWPerLine,
            "totalKRRow" => $totalKRPerLine,"totalCNRow" => $totalCNPerLine, "totalRURow" => $totalRUPerLine,
            "totalVNRow" => $totalVNPerLine,"totalARABRow" => $totalARABPerLine, "totalTHRow" => $totalTHPerLine, "totalMNRow" => $totalMNPerLine,
            "totalOTHERSRow" => $totalOTHERSPerLine,"totalSTUDALLRow" => $totalStudentsPerLine,
            "totalJPDWkRow" => $totalJPDWksPerLine,"totalJPAWkRow" => $totalJPAWksPerLine, "totalTWWkRow" => $totalTWWksPerLine,
            "totalKRWkRow" => $totalKRWksPerLine,"totalCNWkRow" => $totalCNWksPerLine, "totalRUWkRow" => $totalRUWksPerLine,
            "totalVNWkRow" => $totalVNWksPerLine,"totalARABWkRow" => $totalARABWksPerLine, "totalTHWkRow" => $totalTHWksPerLine, "totalMNWkRow" => $totalMNWksPerLine,
            "totalOTHERSWkRow" => $totalOTHERSWksPerLine,"totalALLWkRow" => $totalWeeksPerLine,
            "lastYearTotalPerLineStudent" => $lastYearTotalStudentsPerLine, "lastYearTotalPerLineWeeks" => $lastYearTotalWeeksPerLine,
            "lastYearTotalAllStudent" => $totalStudentsLastYear, "lastYearTotalAllWeeks" => $totalStudentsLastYear,
            "lytotalJPDRow" => $lastYearTotalJPDirectPerLine,"lytotalJPARow" => $lastYearTotalJPAgentPerLine, "lytotalTWRow" => $lastYearTotalTWPerLine,
            "lytotalKRRow" => $lastYearTotalKRPerLine,"lytotalCNRow" => $lastYearTotalCNPerLine, "lytotalRURow" => $lastYearTotalRUPerLine,
            "lytotalVNRow" => $lastYearTotalVNPerLine,"lytotalARABRow" => $lastYearTotalARABPerLine, "lytotalTHRow" => $lastYearTotalTHPerLine,
            "lytotalOTHERSRow" => $lastYearTotalOTHERSPerLine, "lytotalMNRow" => $lastYearTotalMNPerLine,
            "lytotalJPDWkRow" => $lastYearTotalJPDWksPerLine,"lytotalJPAWkRow" => $lastYearTotalJPAWksPerLine, "lytotalTWWkRow" => $lastYearTotalTWWksPerLine,
            "lytotalKRWkRow" => $lastYearTotalKRWksPerLine,"lytotalCNWkRow" => $lastYearTotalCNWksPerLine, "lytotalRUWkRow" => $lastYearTotalRUWksPerLine,
            "lytotalVNWkRow" => $lastYearTotalVNWksPerLine,"lytotalARABWkRow" => $lastYearTotalARABWksPerLine, "lytotalTHWkRow" => $lastYearTotalTHWksPerLine,
            "lytotalOTHERSWkRow" => $lastYearTotalOTHERSWksPerLine, "lytotalMNWkRow" => $lastYearTotalMNWksPerLine);

        return response()->json(array("allSalesReport" => $salesReport));
    }

    public function dateRange( $first, $last, $step = '+1 day', $format = 'Y-m-d' ) {
        $dates = [];
        $current = strtotime( $first );
        $last = strtotime( $last );
        while( $current <= $last ) {
            $dates[] = date( $format, $current );
            $current = strtotime( $step, $current );
        }
        return $dates;
    }

    /**
     * @param $date
     * @return array
     */
    public function getStudentsSaleReport($date) {
        //JP
        $jpdirect = $this->studentApplyService->getSalesReportStudents($date, 'JP', 1);
        $jpagent = $this->studentApplyService->getSalesReportStudents($date, 'JP', 2);
        $jpwkdirect = $this->studentApplyService->getSalesReportStudentWeeks($date, 'JP', 1);
        $jpwkagent = $this->studentApplyService->getSalesReportStudentWeeks($date, 'JP', 2);
        //TW
        $tw = $this->studentApplyService->getSalesReportStudents($date, 'TW', 0);
        $twwk = $this->studentApplyService->getSalesReportStudentWeeks($date, 'TW', 0);
        //KR
        $kr = $this->studentApplyService->getSalesReportStudents($date, 'KR', 0);
        $krwk = $this->studentApplyService->getSalesReportStudentWeeks($date, 'KR', 0);
        //CN
        $cn = $this->studentApplyService->getSalesReportStudents($date, 'CN', 0);
        $cnwk = $this->studentApplyService->getSalesReportStudentWeeks($date, 'CN', 0);
        //RU
        $ru = $this->studentApplyService->getSalesReportStudents($date, 'RU', 0);
        $ruwk = $this->studentApplyService->getSalesReportStudentWeeks($date, 'RU', 0);
        //VN
        $vn = $this->studentApplyService->getSalesReportStudents($date, 'VN', 0);
        $vnwk = $this->studentApplyService->getSalesReportStudentWeeks($date, 'VN', 0);
        //ARAB
        $arab = $this->studentApplyService->getSalesReportStudents($date, 'ARAB', 0);
        $arabwk = $this->studentApplyService->getSalesReportStudentWeeks($date, 'ARAB', 0);
        //TH
        $th = $this->studentApplyService->getSalesReportStudents($date, 'TH', 0);
        $thwk = $this->studentApplyService->getSalesReportStudentWeeks($date, 'TH', 0);
        //MN
        $mn = $this->studentApplyService->getSalesReportStudents($date, 'MN', 0);
        $mnwk = $this->studentApplyService->getSalesReportStudentWeeks($date, 'MN', 0);
        //Others
        $others = $this->studentApplyService->getSalesReportStudents($date, 'Others', 0);
        $otherswk = $this->studentApplyService->getSalesReportStudentWeeks($date, 'Others', 0);

        return array($jpdirect, $jpagent, $jpwkdirect, $jpwkagent, $tw, $twwk, $kr, $krwk, $cn, $cnwk, $ru, $ruwk, $vn, $vnwk, $arab, $arabwk, $th, $thwk, $others, $otherswk, $mn, $mnwk);
    }

    public function deleteInvoiceNumber($applyId) {
        $apply = $this->studentApplyService->findById($applyId);
        //find discounts in invoice_discounts table and then remove each discount
        $invoiceDiscount = $this->invoiceDiscountService->findByApplyId($applyId);
        foreach ($invoiceDiscount as $discount) {
            $this->invoiceDiscountService->remove($discount['id']);
        }
        //find invoice number in extension_invoices table and then remove each invoice number
        $extInvoiceNumber = $this->extensionInvoiceService->findByApplyId($applyId);
        $this->extensionInvoiceService->removeByStudentId($extInvoiceNumber['sa_id']);

        //remove in admin applications list
        $apply->update(array("invoice_number" => null, "ext_invoice_number" => null ,"commission" => 0 ,"discount" => 0));
        return response()->json(["message" => "invoice_number_deleted_successfully"]);
    }

    public function deleteExtendedInvoiceNumber($applyId) {
        $apply = $this->studentApplyService->findById($applyId);
        //find invoice number in extension_invoices table and then remove each invoice number
        $extInvoiceNumber = $this->extensionInvoiceService->findByApplyId($applyId);
        $this->extensionInvoiceService->removeByStudentId($extInvoiceNumber['sa_id']);
        //remove in admin applications list
        $apply->update(array("ext_invoice_number" => null));

        return response()->json(["message" => "extended_invoice_number_deleted_successfully"]);
    }

    public function deleteRefundInvoiceNumber($applyId) {
        $apply = $this->studentApplyService->findById($applyId);
        //find invoice number in refund_invoices table and then remove each invoice number
        $rfdInvoiceNumber = $this->refundInvoiceService->findByApplyId($applyId);
        $this->refundInvoiceService->removeByStudentId($rfdInvoiceNumber['sa_id_refund']);
        //remove in admin applications list
        $apply->update(array("refund_invoice_number" => null));

        return response()->json(["message" => "refund_invoice_number_deleted_successfully"]);
    }

    public function modifyStudentStatus($checkedList,$updateStatus) {
        $today = date("Y-m-d h:i:s");
        $now = date("Y-m-d");
        $user = \Request::get('user');
        $listArr = explode(',', $checkedList);
        if($checkedList) {
            foreach($listArr as $checked) {
                $apply = $this->studentApplyService->findById($checked);
                switch($updateStatus) {
                    case 2:
                    case 5:
                        if(!$apply['id_number']) {
                            $apply->update(array("id_number" => $this->randomizeIdNumber()));
                        }
                        break;
                    case 4: $this->deleteStudent($apply['id'], 0);break;
                }
                $changeLog = array(
                    "created_time" => $today,
                    "modified_time" => $today,
                    "operator_id" => $user['id'],
                    "email_address" => $user['email'],
                    "user_name" => $user['name'],
                    "method_name" => "apply/".$apply['id'],
                    "params_json" => "student_status = ".$apply['student_status'],
                    "result_json" => "success: student_status = ".$updateStatus,
                    "request_uri" => $_SERVER['REQUEST_URI'],
                    "remote_addr_ip" => $_SERVER['REMOTE_ADDR'] ? $_SERVER['REMOTE_ADDR'] : '0.0.0.0',
                    "user_agent" => $_SERVER['HTTP_USER_AGENT'],
                    "server_name" => $_SERVER['SERVER_NAME'],
                    "host_name" => $_SERVER['HTTP_HOST']
                );
                $this->changeLogService->create($changeLog);

                if($updateStatus == 5 && $now < $apply['checkin_date']) {
                    $updateStatus = $apply['student_status'];
                }
                $apply->update(array("student_status" => $updateStatus));
            }
            return response()->json(["message" => "status_updated_successfully"]);
        } else {
            return response()->json(["message" => "no_checklist"]);
        }
    }

    public function isInvoiceConfirmed($applyId, $invoiceLockStatus) {
        $today = date('Y-m-d', strtotime('now'));
        $apply = $this->studentApplyService->findById($applyId);
        $invoice = $this->invoiceService->findByApplyId($applyId);
        $apply->update(array("isInvoiceConfirmed" => $invoiceLockStatus));//update flag to 2(hide) or 1(display)
        $invoice->update(array("approved_date" => $today));// lock day = approved_date
        return response()->json(["message" => "isInvoiceConfirmed_successfully_updated"]);
    }

    public function isExtInvoiceConfirmed($applyId, $invoiceExtLockStatus) {
        $apply = $this->studentApplyService->findById($applyId);
        $apply->update(array("isExtInvoiceConfirmed" => $invoiceExtLockStatus));//update flag to 2(hide) or 1(display)
        $extApply = $this->extensionInvoiceService->findByApplyId($applyId);
        $extApply->update(array("ext_isInvoiceConfirmed" => $invoiceExtLockStatus));//update flag to 2(hide) or 1(display)
        return response()->json(["message" => "isExtInvoiceConfirmed_successfully_updated"]);
    }

    public function isRfdInvoiceConfirmed($applyId, $invoiceExtLockStatus) {
        $apply = $this->studentApplyService->findById($applyId);
        $apply->update(array("isRefundInvoiceConfirmed" => $invoiceExtLockStatus));//update flag to 2(hide) or 1(display)
        $extApply = $this->refundInvoiceService->findByApplyId($applyId);
        $extApply->update(array("rfd_isInvoiceConfirmed" => $invoiceExtLockStatus));//update flag to 2(hide) or 1(display)
        return response()->json(["message" => "isRefundInvoiceConfirmed_successfully_updated"]);
    }

    public function getReportCampBooking($campFrom,$campTo,$campus) {
        $firstWkStartD = $campFrom;
        $firstWkEndD =  date('Y-m-d', strtotime($campFrom. ' + 6 days'));
        $secondWkStartD =  date('Y-m-d', strtotime($campFrom. ' + 7 days'));
        $secondWkEndD =  date('Y-m-d', strtotime($campFrom. ' + 13 days'));
        $thirdWkStartD =  date('Y-m-d', strtotime($campFrom. ' + 14 days'));
        $thirdWkEndD =  date('Y-m-d', strtotime($campFrom. ' + 20 days'));
        $fourthWkStartD =  date('Y-m-d', strtotime($campFrom. ' + 21 days'));
        $fourthWkEndD =  date('Y-m-d', strtotime($campFrom. ' + 27 days'));

        $studentVisit = 1 ; $guardianVisit = 2;

        //Students
        $agentsCampsFirstStudent = $this->studentApplyService->getAgenciesCamps($firstWkStartD,$firstWkEndD,$campus,$studentVisit);
        $agentsCampsSecondStudent = $this->studentApplyService->getAgenciesCamps($secondWkStartD,$secondWkEndD,$campus,$studentVisit);
        $agentsCampsThirdStudent = $this->studentApplyService->getAgenciesCamps($thirdWkStartD,$thirdWkEndD,$campus,$studentVisit);
        $agentsCampsFourthStudent = $this->studentApplyService->getAgenciesCamps($fourthWkStartD,$fourthWkEndD,$campus,$studentVisit);
        //Guardians
        $agentsCampsFirstGuardian= $this->studentApplyService->getAgenciesCamps($firstWkStartD,$firstWkEndD,$campus,$guardianVisit);
        $agentsCampsSecondGuardian = $this->studentApplyService->getAgenciesCamps($secondWkStartD,$secondWkEndD,$campus,$guardianVisit);
        $agentsCampsThirdGuardian = $this->studentApplyService->getAgenciesCamps($thirdWkStartD,$thirdWkEndD,$campus,$guardianVisit);
        $agentsCampsFourthGuardian = $this->studentApplyService->getAgenciesCamps($fourthWkStartD,$fourthWkEndD,$campus,$guardianVisit);

        $totalFirst = 0;$totalSecond = 0;$totalThird = 0;$totalFourth = 0;
        $totalFirstGuardian = 0;$totalSecondGuardian = 0;$totalThirdGuardian = 0;$totalFourthGuardian = 0;

        //Students
        foreach($agentsCampsFirstStudent as $a){
            $totalFirst = $totalFirst + $a['countCamp'];
        }
        foreach($agentsCampsSecondStudent as $a){
            $totalSecond = $totalSecond + $a['countCamp'];
        }
        foreach($agentsCampsThirdStudent as $a){
            $totalThird = $totalThird + $a['countCamp'];
        }
        foreach($agentsCampsFourthStudent as $a){
            $totalFourth = $totalFourth + $a['countCamp'];
        }

        //Guardians
        foreach($agentsCampsFirstGuardian as $a){
            $totalFirstGuardian = $totalFirstGuardian + $a['countCamp'];
        }
        foreach($agentsCampsSecondGuardian as $a){
            $totalSecondGuardian = $totalSecondGuardian + $a['countCamp'];
        }
        foreach($agentsCampsThirdGuardian as $a){
            $totalThirdGuardian = $totalThirdGuardian + $a['countCamp'];
        }
        foreach($agentsCampsFourthGuardian as $a){
            $totalFourthGuardian = $totalFourthGuardian + $a['countCamp'];
        }

        $campBookingReport[] = array("listAgentsCampsFirst" => $agentsCampsFirstStudent,"listAgentsCampsSecond" => $agentsCampsSecondStudent,
            "listAgentsCampsThird" => $agentsCampsThirdStudent, "listAgentsCampsFourth" => $agentsCampsFourthStudent,
            "firstWeek" => $firstWkStartD, "firstWeekEnd" => $firstWkEndD, "secondWeek" => $secondWkStartD, "secondWeekEnd" => $secondWkEndD,
            "thirdWeek" => $thirdWkStartD, "thirdWeekEnd" => $thirdWkEndD, "fourthWeek" => $fourthWkStartD, "fourthWeekEnd" => $fourthWkEndD,
            "totalFirstWk" => $totalFirst, "totalSecondWk" => $totalSecond,
            "totalThirdWk" => $totalThird, "totalFourthWk" => $totalFourth,
            "totalFirstWkGuard" => $totalFirstGuardian, "totalSecondWkGuard" => $totalSecondGuardian,
            "totalThirdWkGuard" => $totalThirdGuardian, "totalFourthWkGuard" => $totalFourthGuardian);
        return response()->json(array("allCampBookReport" => $campBookingReport));
    }

}
