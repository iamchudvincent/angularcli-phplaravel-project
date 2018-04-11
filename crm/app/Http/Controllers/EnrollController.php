<?php

namespace App\Http\Controllers;

use App\GlobalFunctions;
use App\Http\Requests\EnrollRequest;
use App\Repositories\AccommodationPrices\AccommodationPricesInterface;
use App\Repositories\Accommodations\AccommodationsInterface;
use App\Repositories\Buildings\BuildingsInterface;
use App\Repositories\Holidays\HolidaysInterface;
use App\Repositories\LongstayPrices\LongstayPricesInterface;
use App\Repositories\Plans\PlansInterface;
use App\Repositories\Rooms\RoomsInterface;
use App\Repositories\ShortstayLessonPrices\ShortstayLessonPricesInterface;
use App\Repositories\StudentApply\StudentApplyInterface;
use App\Repositories\Terms\TermsInterface;
use League\Flysystem\Exception;
//use Log;

class EnrollController extends Controller
{
    private $accommodationPricesService;
    private $accommodationService;
    private $planService;
    private $buildingService;
    private $holidayService;
    private $roomService;
    private $termService;
    private $longstayService;
    private $shortstayService;
    private $studentApplyService;
    private $plansService;

    public function __construct(AccommodationPricesInterface $accommodationPricesInterface, PlansInterface $plansInterface,
                                AccommodationsInterface $accommodationsInterface, BuildingsInterface $buildingsInterface,
                                HolidaysInterface $holidayInterface, RoomsInterface $roomsInterface,
                                TermsInterface $termsInterface, LongstayPricesInterface $longstayPricesInterface,
                                ShortstayLessonPricesInterface $shortstayLessonPrice, StudentApplyInterface $studentApplyService,
                                PlansInterface $plansService)
    {
        $this->accommodationPricesService = $accommodationPricesInterface;
        $this->accommodationService = $accommodationsInterface;
        $this->planService = $plansInterface;
        $this->buildingService = $buildingsInterface;
        $this->holidayService = $holidayInterface;
        $this->roomService = $roomsInterface;
        $this->termService = $termsInterface;
        $this->longstayService = $longstayPricesInterface;
        $this->shortstayService = $shortstayLessonPrice;
        $this->studentApplyService = $studentApplyService;
        $this->plansService = $plansService;
    }

    private function validateData($data)
    {
        $errors = [];
        $planType = config('constants.plan.plan_type');
        $errorCodes = config('errorcodes.enroll');
        $plan = $this->planService->findById($data['planId']);
        $today = date('Y-m-d');
        $generalValue = config('constants.general_value');

        $buildings = $this->buildingService->getBuildingBelongToPlan($data['planId']);
        $i = 0;
        for(; $i < count($buildings); $i++) {
            if( $buildings[$i]->id == $data['buildingId'] )
                break;
        }
        if( $i == count($buildings) ) {
            array_push($errors, $errorCodes['building_id_invalid']['key']);
        }

        if( $plan->plan_type == $planType['long'] && ( $data['term'] > $generalValue['max_long_term'] || $data['term'] < $generalValue['min_long_term'] ) ) {
            array_push($errors, $errorCodes['term_invalid']['key']);
        }

        if( $today > $data['checkIn']) {
            array_push($errors, $errorCodes['check_in_in_past']['key']);
        }
        if (date('N', strtotime($data['checkIn'])) != $generalValue['sunday'] && $plan->plan_type == $planType['long'] ) {
            array_push($errors, $errorCodes['check_in_not_sunday']['key']);
        }

        if( $data['checkOut'] < $data['checkIn'] ) {
            array_push($errors, 'check_out_after_check_in');
        } else {
            if ($plan->plan_type == $planType['long']) {
                $checkOut = date('Y-m-d', strtotime($data['checkIn'] . "+" . ($data['term'] * $generalValue['days_of_week']) . " days"));
                $checkOut = date('Y-m-d', strtotime("-1 days", strtotime($checkOut)));
                if ($data['checkOut'] != $checkOut) {
                    array_push($errors, $errorCodes['check_out_invalid']['key']);
                }
            }
        }

        $nextDay = date('Y-m-d', strtotime($data['checkIn'] . "+1 days"));
        if(
            ( $data['entrance'] != $nextDay && $plan->plan_type == $planType['long'] ) ||
            ( $data['entrance'] != $data['checkIn'] && $data['entrance'] != $nextDay && $plan->plan_type == $planType['short'] )
        ) {
            array_push($errors, $errorCodes['entrance_invalid']['key']);
        }

        $prevDay = date('Y-m-d', strtotime("-1 days", strtotime($data['checkOut'])));
        if(
            ( $data['graduation'] != $prevDay && $plan->plan_type == $planType['long'] ) ||
            ( $data['graduation'] != $prevDay && $data['graduation'] != $data['checkOut'] && $plan->plan_type == $planType['short'] )
        ) {
            array_push($errors, $errorCodes['graduation_invalid']['key']);
        }

        if( $data['graduation'] < $data['entrance'] ) {
            array_push($errors, $errorCodes['graduation_invalid']['key']);
        }

        if( $data['accommodationId1'] != $generalValue['no_accommodation_id']) {
            if ($plan->plan_type == $planType['short']) {
                $accommodationPrice = $this->accommodationPricesService->getPriceWithAccommodationRoom($data['accommodationId1'], $data['roomId1'], $data['checkIn']);
                if (empty($accommodationPrice)) {
                    array_push($errors, $errorCodes['roomId1_invalid']['key']);
                }
            }
        }

        return $errors;
    }

    /**
     * @api {POST} /enroll Enroll Submit
     * @apiVersion 0.1.0
     * @apiGroup Client Submit
     *
     * @apiDescription Note: With special case `宿泊なし` (`Walk In`), just set `accommodationId1` equal `-1`
     *
     * @apiHeader {string} Content-Type Using 'application/json'.
     * @apiHeader {string} Accept Using 'application/json'.
     *
     * @apiParam {string} consultation This field is used if user comes from CONSULT.
     * @apiParam {string} name User's name.
     * @apiParam {string} passportName User's passport name.
     * @apiParam {string} birthday User's birthday. Format `YYYY-MM-DD`.
     * @apiParam {string=男性,女性} sex User's sex.
     * @apiParam {string} nationality User's nationality.
     * @apiParam {string} address User's address. This field is combined of `address 1`, `address 2` and `addess 3` with space between.
     * @apiParam {string} phone User's phone number. Example: 123-456-789
     * @apiParam {string} email User's email.
     * @apiParam {string} job User's job.
     * @apiParam {string} [emergencyContact] User's emergency contact.
     * @apiParam {string} [emailFamily] Email of user's family.
     * @apiParam {string} [skypeId] User's skype Id.
     * @apiParam {string} [lineId] User's line Id.
     * @apiParam {int} planId The index of plan.
     * @apiParam {int} buildingId The index of building.
     * @apiParam {int} [term] How long this plan lasts ? With long plan (planType `1`), `term` have to be between `1` and `24` weeks,with short plan (planType `2`), `term` can be omitted.
     * @apiParam {string} checkIn Date user want to check in. Format `YYYY-MM-DD`. This day have to be or after today.
     * @apiParam {string} checkOut Date user want to check out. Any day's equal to or after check in day.
     * @apiParam {string} entrance Date user want to begin the course. It has to be check in day or after a day.
     * @apiParam {string} graduation Date user want to graduate. It has to be check out day or before a day.
     * @apiParam {int} accommodationId1 Index of accommodation user choose first.
     * @apiParam {int} roomId1 Index of room user choose first.
     * @apiParam {int} [accommodationId2] Index of accommodation user choose second.
     * @apiParam {int} [roomId2] Index of room user choose second.
     * @apiParam {string[]=specialOption,beginnerOption,meals,pickUp,islandHopping,oslob} optionsList List option user want to use. Includes `Special Options`, `Beginner Option`, `Meals`, `Pick up`,`Island Hopping`, `Oslob`
     * @apiParam {string=individual, agent} applicationRoute Through any agent ?
     * @apiParam {string} agentName Agent name. If application route type `agent`, this field is required.
     * @apiParam {string} agentEmail Agent email. If application route type `agent`, this field is required.
     * @apiParam {string} [englishSkill] User's English skill.
     * @apiParam {string=yes,no} [expQqeOnl] User's experience of QQE online lessons.
     * @apiParam {string} [expLifeOverseas] User's experience of life overseas or studying abroad.
     * @apiParam {string} howKnowQqe How does user know QQE ?
     * @apiParam {string=first, twice, online} [studiedQqeBefore] Has user ever studied abroad in QQE ?
     * @apiParam {string} [campaignCode] User's campaign code.
     * @apiParam {string} [memo] User's memo.
     *
     * @apiParamExample {json} Request-Example:
     *  {
     *      "name": "John Doe",
     *      "passportName": "John Doe",
     *      "birthday": "1999-01-01",
     *      "sex": "male",
     *      "nationality": "Vietnam",
     *      "address": "12 Str1 Hk",
     *      "phone": "123-456-789",
     *      "email": "johndoe@example.com",
     *      "job": "IT developer",
     *      "accommodationId1": 1,
     *      "roomId1": 1,
     *      "accommodationId2": 2,
     *      "roomId2": 1,
     *      "optionsList": [
     *          "meals",
     *          "pickUp",
     *          "specialOption",
     *          "beginnerOption",
     *          "islandHopping",
     *          "oslob"
     *      ],
     *      "planId": 1,
     *      "buildingId": 1,
     *      "numOf": 1,
     *      "term": 2,
     *      "checkIn": "2017-03-05",
     *      "checkOut": "2017-03-19",
     *      "entrance": "2017-03-06",
     *      "graduation": "2017-03-18",
     *      "studiedQqeBefore": "first",
     *      "applicationRoute": "agent",
     *      "agentName": "エージェント",
     *      "agentEmail": "papaagent@gmail.com"
     *  }
     *
     * @apiSuccess {string[]} message Successful message.
     *
     * @apiSuccessExample {json} Success-Response:
     *  HTTP/1.1 200 OK
     *  {
     *      "message": "email_sent"
     *  }
     *
     * @apiError {string[]} errors List errors message.
     * @apiError {string[]} name List errors of name field.
     * @apiError {string[]} passportName List errors of passport name field.
     * @apiError {string[]} birthday List errors of birthday field.
     * @apiError {string[]} sex List errors of sex field.
     * @apiError {string[]} nationality List errors of nationality field.
     * @apiError {string[]} address List errors of address field.
     * @apiError {string[]} phone List errors of phone field.
     * @apiError {string[]} email List errors of email field.
     * @apiError {string[]} job List errors of job field.
     * @apiError {string[]} planId List errors of planId field.
     * @apiError {string[]} buildingId List errors of buildingId field.
     * @apiError {string[]} term List errors of term field.
     * @apiError {string[]} checkIn List errors of check-in field.
     * @apiError {string[]} checkOut List errors of check-out field.
     * @apiError {string[]} entrance List errors of entrance field.
     * @apiError {string[]} graduation List errors of graduation field.
     * @apiError {string[]} accommodationId1 List errors of accommodation-id-1 field.
     * @apiError {string[]} roomId1 List errors of room-id-1 field.
     * @apiError {string[]} optionsList List errors of options-list field.
     * @apiError {string[]} applicationRoute List errors of application-route field.
     *
     * @apiErrorExample {json} Error-Response:
     *  HTTP/1.1 422 Unprocessable Entity
     *  {
     *      "consultation": [
     *          "consultation_more_1000"
     *      ],
     *      "name": [
     *          "name_required",
     *          "name_more_100"
     *      ],
     *      "passportName": [
     *          "passport_name_required",
     *          "passport_name_invalid",
     *          "passport_name_more_100"
     *      ],
     *      "birthday": [
     *          "birthday_required",
     *          "birthday_invalid"
     *      ],
     *      "sex": [
     *          "sex_required",
     *          "sex_invalid"
     *      ],
     *      "nationality": [
     *          "nationality_required",
     *          "nationality_more_100"
     *      ],
     *      "address": [
     *          "address_required"
     *      ],
     *      "phone": [
     *          "phone_required"
     *      ],
     *      "email": [
     *          "email_required",
     *          "email_invalid"
     *      ],
     *      "job": [
     *          "job_required",
     *          "job_more_100"
     *      ],
     *      "planId": [
     *          "plan_id_required",
     *          "plan_id_invalid"
     *      ],
     *      "buildingId": [
     *          "building_id_required",
     *          "building_id_invalid"
     *      ],
     *      "term": [
     *          "term_required"
     *      ],
     *      "checkIn": [
     *          "check_in_required",
     *          "check_in_invalid"
     *      ],
     *      "checkOut": [
     *          "check_out_required",
     *          "check_out_invalid"
     *      ],
     *      "entrance": [
     *          "entrance_required",
     *          "entrance_invalid"
     *      ],
     *      "graduation": [
     *          "graduation_required",
     *          "graduation_invalid"
     *      ],
     *      "accommodationId1": [
     *          "accommodationId1_required"
     *      ],
     *      "roomId1": [
     *          "roomId1_required",
     *          "roomId1_invalid"
     *      ],
     *      "accommodationId2": [
     *          "accommodationId2_invalid"
     *      ],
     *      "roomId2": [
     *          "roomId2_required",
     *          "roomId2_invalid"
     *      ],
     *      "optionsList": [
     *          "options_list_required",
     *          "options_list_invalid"
     *      ],
     *      "applicationRoute": [
     *          "application_route_requried",
     *          "application_route_invalid"
     *      ],
     *      "agentName": [
     *          "agent_name_required",
     *          "agent_name_more_100"
     *      ],
     *      "agentEmail": [
     *          "agent_email_required",
     *          "agent_email_invalid"
     *      ]
     *  }
     *
     *
     * @apiErrorExample {json} Error-Response:
     *  HTTP/1.1 400 Bad Request
     *  {
     *      "errors": [
     *          "building_id_invalid",
     *          "term_invalid",
     *          "check_in_in_past",
     *          "check_in_not_sunday",
     *          "check_out_after_check_in",
     *          "check_out_invalid",
     *          "entrance_invalid",
     *          "graduation_invalid",
     *          "roomId1_invalid"
     *      ]
     *  }
     *
     * @apiErrorExample {json} Error-Response:
     *  HTTP/1.1 500 Internal Server Error
     *  {
     *      "errors" [
     *          "failed_send_mail"
     *      ]
     *  }
     * 
     */
    public function store(EnrollRequest $request)
    {
        $language = $this->getLanguage();
        $errors = [];
        $data = $request->all();
        $errors = $this->validateData($data);
        $errorCodes = config('errorcodes.enroll');
        $yesNoAnswer = config('constants.answer');
        $statusCode = config('constants.status_code');

        if( count($errors) == 0 ) {
            $today = time();
            $randomNumber = $today.rand(100,999);
            $optionsList = $this->getOptionList($language);
            $optionsCostKey = 'constants.options_cost';
            if($language != "JP"){
                $optionsCostKey = 'constants.options_cost_en';
            }
            $optionsCost = config($optionsCostKey);
            $planType = config('constants.plan.plan_type');
            $applicationRoute = config('constants.application_route');

            $plan = $this->planService->findById($data['planId']);
            $data['plan'] = $this->getPlanName($data['planId'],$language);

            $editId = md5($randomNumber."i@mas+r!n&");
            $languageId = strtolower($this->getLanguage());
            $data['studentEditLink'] = 'https://'.$_SERVER['SERVER_NAME'].'/studentinfo/?id='.$editId.'&lan='.$languageId;

            if( in_array($optionsList['Special Options']['key'], $data['optionsList']) ) {
                $data[$optionsList['Special Options']['key']] = $language=='JP'?$yesNoAnswer['yes']['jp_value']:$yesNoAnswer['yes']['en_value'];
                $data['specialCost'] = $optionsCost[$optionsList['Special Options']['key']];
            } else {
                $data[$optionsList['Special Options']['key']] = $language=='JP'?$yesNoAnswer['no']['jp_value']:$yesNoAnswer['no']['en_value'];
                $data['specialCost'] = 0;
            }

            if( in_array($optionsList['Beginner Option']['key'], $data['optionsList']) ) {
                $data[$optionsList['Beginner Option']['key']] = $language=='JP'?$yesNoAnswer['yes']['jp_value']:$yesNoAnswer['yes']['en_value'];
                $data['beginnerCost'] = $optionsCost[$optionsList['Beginner Option']['key']];
            } else {
                $data[$optionsList['Beginner Option']['key']] = $language=='JP'?$yesNoAnswer['no']['jp_value']:$yesNoAnswer['no']['en_value'];
                $data['beginnerCost'] = 0;
            }

            if( $data['applicationRoute'] == $applicationRoute['individual']['en']) {
                $data['remittanceFee'] = $optionsCost['remittanceFee'];
            } else {
                $data['remittanceFee'] = 0;
            }

            if( in_array('islandHopping', $data['optionsList']) ) {
                $data['islandHopping'] = $language=='JP'?$yesNoAnswer['yes']['jp_value']:$yesNoAnswer['yes']['en_value'];
            } else {
                $data['islandHopping'] = $language=='JP'?$yesNoAnswer['no']['jp_value']:$yesNoAnswer['no']['en_value'];
            }

            if( in_array('oslob', $data['optionsList']) ) {
                $data['oslob'] = $language=='JP'?$yesNoAnswer['yes']['jp_value']:$yesNoAnswer['yes']['en_value'];
            } else {
                $data['oslob'] = $language=='JP'?$yesNoAnswer['no']['jp_value']:$yesNoAnswer['no']['en_value'];
            }

            $data['age'] = GlobalFunctions::calculateAge($data['birthday']);
            $data['sex'] = $data["sex"] == "男性" ? 'M' : 'F';

            if( empty($data['emergencyContact']) ) {
                $data['emergencyContact'] = "";
            }

            if( $data['applicationRoute'] == $applicationRoute['individual']['en'] ) {
                $data['agentName'] = "";
                $data['agentEmail'] = "";
            }

            if( !array_key_exists('emailFamily', $data) ) {
                $data['emailFamily'] = "";
            }
            if( !array_key_exists('skypeId', $data) ) {
                $data['skypeId'] = "";
            }
            if( !array_key_exists('lineId', $data) ) {
                $data['lineId'] = "";
            }
            if( !array_key_exists('englishSkill', $data) ) {
                $data['englishSkill'] = "";
            }
            if( !array_key_exists('expQqeOnl', $data) ) {
                $data['expQqeOnl'] = $language=='JP'?$yesNoAnswer['no']['exp_qqe_onl']:$yesNoAnswer['no']['exp_qqe_onl_en'];
            } else {
                if( $data['expQqeOnl'] == "yes" ) {
                    $data['expQqeOnl'] = $language=='JP'?$yesNoAnswer['yes']['exp_qqe_onl']:$yesNoAnswer['yes']['exp_qqe_onl_en'];
                } else {
                    $data['expQqeOnl'] = $language=='JP'?$yesNoAnswer['no']['exp_qqe_onl']:$yesNoAnswer['no']['exp_qqe_onl_en'];
                }
            }
            if( !array_key_exists('howKnowQqe', $data) ) {
                $data['howKnowQqe'] = "";
            }
            if( !array_key_exists('studiedQqeBefore', $data) ) {
                $data['studiedQqeBefore'] = "";
            } else {
                $studiedQqeBeforeValue = config('constants.studied_qqe_before');
                if( $data['studiedQqeBefore'] == $studiedQqeBeforeValue['first']['en'] ) {
                    $data['studiedQqeBefore'] = $language=='JP'?$studiedQqeBeforeValue['first']['jp']:$studiedQqeBeforeValue['first']['en'];
                } elseif ( $data['studiedQqeBefore'] == $studiedQqeBeforeValue['twice']['en'] ) {
                    $data['studiedQqeBefore'] = $language=='JP'?$studiedQqeBeforeValue['twice']['jp']:$studiedQqeBeforeValue['twice']['en'];
                } else {
                    $data['studiedQqeBefore'] = $language=='JP'?$studiedQqeBeforeValue['online']['jp']:$studiedQqeBeforeValue['online']['en'];
                }
            }
            if( !array_key_exists('campaignCode', $data) ) {
                $data['campaignCode'] = "";
            }
            if( !array_key_exists('expLifeOverseas', $data) ) {
                $data['expLifeOverseas'] = "";
            }
            if( !array_key_exists('memo', $data) ) {
                $data['memo'] = "";
            }

            if( $plan->plan_type == $planType['long'] ) {
                $data = $this->calculateOptionsCostLongstayPlan($data);
                $data = $this->calculateCostWithLongstayPlan($data);

            } elseif( $plan->plan_type == $planType['short'] ) {
                $data = $this->calculateOptionsCostShortstayPlan($data);
                $data = $this->calculateCostWithShortstayPlan($data);
            }
            if($data['building'] && $language != 'JP'){
                $data['building'] = $data['building']=="ITパーク校"?'IT Park':'Seafront Campus';
            }
            if($language != 'JP'){
                $accommodationStayOne = "";
                $accommodationRoomTypeOne = "";
                if(!empty($data['accommodationRoom1']) && !empty($data['roomId1'])){
                    $accommodationCountyList = $this->accommodationService->allCountryAccommodations($language);
                    foreach ($accommodationCountyList as $item) {
                        if($data['accommodationId1'] == $item["accommodations_id"]){
                            $accommodationStayOne = $item['accommodations_name'];
                        }
                    }
                    $roomCountryList = $this->roomService->allCountryRooms($language);
                    foreach ($roomCountryList as $item) {
                        if($data['roomId1'] == $item["rooms_id"]){
                            $accommodationRoomTypeOne = $item['rooms_name'];
                        }
                    }
                }
                $data['accommodationRoom1']=$accommodationStayOne.' '.$accommodationRoomTypeOne;

                $accommodationStayTwo= "";
                $accommodationRoomTypeTwo = "";
                if(!empty($data['accommodationRoom2']) && !empty($data['roomId2'])){
                    $accommodationCountyList = $this->accommodationService->allCountryAccommodations($language);
                    foreach ($accommodationCountyList as $item) {
                        if($data['accommodationId2'] == $item["accommodations_id"]){
                            $accommodationStayTwo = $item['accommodations_name'];
                        }
                    }
                    $roomCountryList = $this->roomService->allCountryRooms($language);
                    foreach ($roomCountryList as $item) {
                        if($data['roomId2'] == $item["rooms_id"]){
                            $accommodationRoomTypeTwo = $item['rooms_name'];
                        }
                    }
                }
                $data['accommodationRoom2']=$accommodationStayTwo.' '.$accommodationRoomTypeTwo;
            }

            if( in_array('meals', $data['optionsList']) ) {
                $data['meals'] = $language=='JP'?$yesNoAnswer['yes']['jp_value']:$yesNoAnswer['yes']['en_value'];
            } else {
                $data['meals'] = $language=='JP'?$yesNoAnswer['no']['jp_value']:$yesNoAnswer['no']['en_value'];
            }

            if( in_array('pickUp', $data['optionsList']) ) {
                $data['pickUp'] = $language=='JP'?$yesNoAnswer['yes']['jp_value']:$yesNoAnswer['yes']['en_value'];
            } else {
                $data['pickUp'] = $language=='JP'?$yesNoAnswer['no']['jp_value']:$yesNoAnswer['no']['en_value'];
            }

            try {
                $term = ((int) $data['term']);
                $weekLabel = $language=='JP'?'週':' week(s)';
                if($plan->plan_type == $planType['long']) {
                    $data['term'] = ((int) $data['term']) .$weekLabel;
                } else {
                    $data['term'] = 0;
                }
                $toUser = $data['email'];
                $data['checkIn'] = date('Y/m/d', strtotime($data['checkIn']));
                $data['checkOut'] = date('Y/m/d', strtotime($data['checkOut']));
                $data['entrance'] = date('Y/m/d', strtotime($data['entrance']));
                $data['graduation'] = date('Y/m/d', strtotime($data['graduation']));
                $data['birthday'] = date('Y/m/d', strtotime($data['birthday']));

                $mailSender = $language =='JP' ? config("constants.mail.from-address.JP") : config("constants.mail.from-address.EN");
                //Log::info("mailSender is $mailSender, constants.mail.from-address.$language and the default is " . config("constants.mail.from-address.EN") );
                if (!empty($data['consultation'])) {
                    $mailConfig = config('constants.mail.enroll.JP.consult');
                    if($language != "JP"){
                        $mailConfig = config('constants.mail.enroll.EN.consult');
                    }
                    if ($applicationRoute['individual']['en'] == $data['applicationRoute']) {
                        $data['applicationRoute'] = $language=='JP'?$applicationRoute['individual']['jp']:$applicationRoute['individual']['en'];
                        $listAdminEmail = explode(',', $mailConfig['admin']['individual']['address']);
                        GlobalFunctions::sendMailable($mailConfig['admin']['individual']['template'], $listAdminEmail[0], sprintf($mailConfig['admin']['individual']['subject'], $randomNumber), $data, $data['name'], $data['email'], $listAdminEmail,$mailSender);
                    } else {
                        $data['applicationRoute'] = $language=='JP'?$applicationRoute['agent']['jp']:$applicationRoute['agent']['en'];
                        $listAdminEmail = explode(',', $mailConfig['admin']['corporate']['address']);
                        GlobalFunctions::sendMailable($mailConfig['admin']['corporate']['template'], $listAdminEmail[0], sprintf($mailConfig['admin']['corporate']['subject'], $randomNumber), $data, $data['name'], $data['email'], $listAdminEmail,$mailSender);
                        $toUser = $data['agentEmail'];
                    }
                    GlobalFunctions::sendMailable($mailConfig['user']['template'], $toUser, $mailConfig['user']['subject'], $data, "", "", array(),$mailSender);
                } else {
                    $mailConfig = config('constants.mail.enroll.JP.apply');
                    if($language != "JP"){
                        $mailConfig = config('constants.mail.enroll.EN.apply');
                    }
                    if ($applicationRoute['individual']['en'] == $data['applicationRoute']) {
                        $data['applicationRoute'] = $language=='JP'?$applicationRoute['individual']['jp']:$applicationRoute['individual']['en'];
                        $listAdminEmail = explode(',', $mailConfig['admin']['individual']['address']);
                        GlobalFunctions::sendMailable($mailConfig['admin']['individual']['template'], $listAdminEmail[0], sprintf($mailConfig['admin']['individual']['subject'], $randomNumber), $data, $data['name'], $data['email'], $listAdminEmail,$mailSender);
                    } else {
                        $data['applicationRoute'] = $language=='JP'?$applicationRoute['agent']['jp']:$applicationRoute['agent']['en'];
                        $listAdminEmail = explode(',', $mailConfig['admin']['corporate']['address']);
                        GlobalFunctions::sendMailable($mailConfig['admin']['corporate']['template'], $listAdminEmail[0], sprintf($mailConfig['admin']['corporate']['subject'], $randomNumber), $data, $data['name'], $data['email'], $listAdminEmail,$mailSender);
                        $toUser = $data['agentEmail'];
                    }
                    GlobalFunctions::sendMailable($mailConfig['user']['template'], $toUser, $mailConfig['user']['subject'], $data, "", "", array(),$mailSender);
                }
                $this->saveStudentApply($randomNumber, $data, $term, $optionsList);

            } catch (Exception $e) {
                return response()->json(["errors" => $errorCodes['failed_send_mail']['key']], $statusCode['internal_server_error']);
            }

            return response()->json(['message' => 'email_sent']);

        } else {
            return response()->json(['errors' => $errors], $statusCode['bad_request']);
        }
    }

    public function calculateOptionsCostLongstayPlan($dataClient)
    {
        $language = $this->getLanguage();
        $yesNoAnswer = config('constants.answer');
        $optionsCostKey = 'constants.options_cost';
        if($language != "JP"){
            $optionsCostKey = 'constants.options_cost_en';
        }
        $optionsCost = config($optionsCostKey);
        $optionsList = config('constants.options_list.'.$language);
        $planType = config('constants.plan.plan_type');
        $generalValue = config('constants.general_value');

        $plan = $this->planService->findById($dataClient['planId']);

        if( in_array($optionsList['Meals']['key'], $dataClient['optionsList']) ) {
            $dataClient['mealCost'] = $dataClient['term'] * $optionsCost[$planType['long']]['meals']['value'];
            $dataClient['meals'] = $yesNoAnswer['yes']['jp_value'];
        } else {
            $dataClient['mealCost'] = 0;
            $dataClient['meals'] = $yesNoAnswer['no']['jp_value'];
        }

        if( in_array($optionsList['Pick up']['key'], $dataClient['optionsList']) ) {
            $dataClient['pickUpCost'] = $optionsCost[$planType['long']]['pickUp'];
            $dataClient['pickUp'] = $yesNoAnswer['yes']['jp_value'];
        } else {
            $dataClient['pickUpCost'] = 0;
            $dataClient['pickUp'] = $yesNoAnswer['no']['jp_value'];
        }

        if( ($dataClient['term'] < $optionsCost['entranceFee_condition'] && $plan->name != $generalValue['light_plan']) || ($plan->name == $generalValue['light_plan']) ) {
            $dataClient['entranceFee'] = $optionsCost['entranceFee'];
        } else {
            $dataClient['entranceFee'] = 0;
        }

        return $dataClient;
    }

    public function calculateOptionsCostShortstayPlan($dataClient)
    {
        $yesNoAnswer = config('constants.answer');
        $optionsList = config('constants.options_list.JP');
        $optionsCost = config('constants.options_cost');
        $planType = config('constants.plan.plan_type');
        $generalValue = config('constants.general_value');

        if( in_array($optionsList['Meals']['key'], $dataClient['optionsList']) ) {
            $holidayType = config('constants.holiday_type');

            $holidays = $this->holidayService->getHolidaysInPeriod($dataClient['entrance'], $dataClient['graduation']);
            $holidayClosedClass = 0;
            foreach ($holidays as $holiday) {
                if ($holiday->opened_class == $holidayType['all_class_closed']) {
                    if( date('N', strtotime($holiday->date)) != $generalValue['sunday'] && date('N', strtotime($holiday->date)) != $generalValue['saturday'] ) {
                        $holidayClosedClass++;
                    }
                }
            }
            $totalDays = GlobalFunctions::getDaysBetweenTwoDays($dataClient['entrance'], $dataClient['graduation']);
            $dataClient['mealCost'] = $optionsCost[$planType['short']]['meals']['value'] * ($totalDays - $holidayClosedClass);
            $dataClient['meals'] = $yesNoAnswer['yes']['jp_value'];
        } else {
            $dataClient['mealCost'] = 0;
            $dataClient['meals'] = $yesNoAnswer['no']['jp_value'];
        }

        if( in_array($optionsList['Pick up']['key'], $dataClient['optionsList']) ) {
            if( date('N', strtotime($dataClient['checkIn'])) == 7 ) {
                $dataClient['pickUpCost'] = $optionsCost[$planType['short']]['pickUp']['sunday'];
            } else {
                $dataClient['pickUpCost'] = $optionsCost[$planType['short']]['pickUp']['weekday'];
            }
            $dataClient['pickUp'] = $yesNoAnswer['yes']['jp_value'];
        } else {
            $dataClient['pickUpCost'] = 0;
            $dataClient['pickUp'] = $yesNoAnswer['no']['jp_value'];
        }
        $dataClient['entranceFee'] = 0;

        return $dataClient;
    }

    public function calculateCostWithLongstayPlan($dataClient)
    {
        $language = $this->getLanguage();
        $holidayType = config('constants.holiday_type');
        $optionsCost = config('constants.options_cost');
        if($language != "JP"){
            $optionsCost = config('constants.options_cost_en');
        }
        $planType = config('constants.plan.plan_type');
        $enrollConstants = config('constants.enroll_simulation');
        $generalValue = config('constants.general_value');

        // Get cost for visa
        if( $dataClient['term'] <= $optionsCost['visa']['less_4']['key']) {
            $dataClient['visa'] = $optionsCost['visa']['less_4']['value'];
        } elseif ( $dataClient['term'] <= $optionsCost['visa']['less_8']['key'] ) {
            $dataClient['visa'] = $optionsCost['visa']['less_8']['value'];
        } elseif ( $dataClient['term'] <= $optionsCost['visa']['less_12']['key'] ) {
            $dataClient['visa'] = $optionsCost['visa']['less_12']['value'];
        } elseif ( $dataClient['term'] <= $optionsCost['visa']['less_16']['key'] ) {
            $dataClient['visa'] = $optionsCost['visa']['less_16']['value'];
        } elseif ( $dataClient['term'] <= $optionsCost['visa']['less_20']['key'] ) {
            $dataClient['visa'] = $optionsCost['visa']['less_20']['value'];
        } else {
            $dataClient['visa'] = $optionsCost['visa']['other'];
        }

        // Get cost for acri
        if( $dataClient['term'] > $optionsCost['acri_long_plan_condition'] ) {
            $dataClient['acri'] = $optionsCost['acri'];
        } else {
            $dataClient['acri'] = 0;
        }

        $dataClient['emigration'] = 0;

        // Get cost for electrical charge
        // No Stay (Walk-in) and Hotels don't have electrical fee
        if($dataClient['accommodationId1'] == '-1' || $dataClient['accommodationId1'] == '2' || $dataClient['accommodationId1'] == '3' ||
            $dataClient['accommodationId1'] == '7' || $dataClient['accommodationId1'] == '8') {
            $dataClient['electricalCharge'] = 0;
        } else {
            $dataClient['electricalCharge'] = $dataClient['term'] * $optionsCost[$planType['long']]['electricalCharge'];
        }

        $term = $this->termService->findByName($dataClient['term']);
        $dataClient['term'] = $term->name;
        $building = $this->buildingService->findById($dataClient['buildingId']);
        $dataClient['building'] = $building->name;

        $longstayPrice = $this->longstayService->findByAccommodationPlanTermRoom($dataClient['accommodationId1'], $dataClient['planId'], $term->getKey(), $dataClient['roomId1'], $dataClient['checkIn']);
        $holidays = $this->holidayService->getHolidaysInPeriod($dataClient['entrance'], $dataClient['graduation']);

        // Count holidays which all classes are opened
        $numStudyInHoliday = 0;
        foreach ($holidays as $holiday) {
            if($holiday->opened_class == $holidayType['all_class_opened'])
                $numStudyInHoliday++;
        }
        // save holiday fee
        $dataClient['holidayFee'] = $numStudyInHoliday * $enrollConstants['additional_study_cost_long_plan'];
        if($language != "JP"){
            $dataClient['holidayFee'] = $numStudyInHoliday * $enrollConstants['additional_study_cost_long_plan_en'];
        }

        // Calculate tuitiona and accommodation cost.
        if( empty($longstayPrice) ) {
            $dataClient['subTotal'] = $numStudyInHoliday * $enrollConstants['additional_study_cost_long_plan'];
            if($language != "JP"){
                $dataClient['subTotal'] = $numStudyInHoliday * $enrollConstants['additional_study_cost_long_plan_en'];
            }

        } else {
            $dataClient['subTotal'] = $longstayPrice->price + $numStudyInHoliday * $enrollConstants['additional_study_cost_long_plan'];
            if($language != "JP"){
                $dataClient['subTotal'] = $longstayPrice->price_en + $numStudyInHoliday * $enrollConstants['additional_study_cost_long_plan_en'];
            }
        }

        // Calculate total cost.
        $dataClient['totalCost'] = $dataClient['subTotal'] + $dataClient['mealCost'] + $dataClient['specialCost']
            + $dataClient['beginnerCost'] + $dataClient['pickUpCost'] + $dataClient['entranceFee']
            + $dataClient['remittanceFee'];

        // Get name of accommodation and room to send mail
        $accommodation1 = $this->accommodationService->findById($dataClient['accommodationId1']);
        if($accommodation1->name == $generalValue['executive_room'] || $accommodation1->name == $generalValue['deluxe_room']) {
            $dataClient['accommodationRoom1'] = $accommodation1->name . $dataClient['numOf'] . $generalValue['name_use'];
        } else {
            $dataClient['accommodationRoom1'] = $accommodation1->name . $this->roomService->findById($dataClient['roomId1'])->name;
        }

        if( !empty($dataClient['accommodationId2']) && !empty($dataClient['roomId2']) ) {
            $accommodation2 = $this->accommodationService->findById($dataClient['accommodationId2']);
            if($accommodation2->name == $generalValue['executive_room'] || $accommodation2->name == $generalValue['deluxe_room']) {
                $dataClient['accommodationRoom2'] = $accommodation2->name . $dataClient['numOf'] . $generalValue['name_use'];
            } else {
                $dataClient['accommodationRoom2'] = $accommodation2->name . $this->roomService->findById($dataClient['roomId2'])->name;
            }
        } else {
            $dataClient['accommodationRoom2'] = $enrollConstants['no_accommodation_request'];
        }

        // Get ssp cost.
        $dataClient['ssp'] = $optionsCost['ssp'];

        // Calculate total cost in php.
        $dataClient['totalCostPhp'] = $dataClient['ssp'] + $dataClient['visa'] + $dataClient['acri'] + $dataClient['emigration']
            + $dataClient['electricalCharge'] + $optionsCost['idcard'];

        return $dataClient;
    }

    public function calculateCostWithShortstayPlan($dataClient)
    {
        $holidayType = config('constants.holiday_type');
        $dayType = config('constants.shortstay_class.day_type');
        $optionsCost = config('constants.options_cost');
        $planType = config('constants.plan.plan_type');
        $generalValue = config('constants.general_value');
        $enrollValue = config('constants.enroll_simulation');

        $building = $this->buildingService->findById($dataClient['buildingId']);
        $dataClient['building'] = $building->name;

        $plan = $this->planService->findById($dataClient['planId']);
        $priceWeekday = 0;
        $priceHoliday = 0;

        // Get short plan prices. Special case, " 超短期+オンライン120 " will have prices which are calculated by the onther plans.
        if( $plan->name == $generalValue['very_short_plan_120_tickets'] ) {
            $shortstayPrices = $this->shortstayService->getVeryShort10planPrice($dataClient['checkIn']);
            foreach ($shortstayPrices as $shortstayPrice) {
                if( $shortstayPrice->day_type == $dayType['weekday'] ) {
                    $priceWeekday = $shortstayPrice->price;
                }
                if( $shortstayPrice->day_type == $dayType['holiday'] ) {
                    $priceHoliday = $shortstayPrice->price;
                }
            }
        } else {
            $shortstayPrices = $this->shortstayService->getShortstayPricesForSimulations($dataClient['planId'], $dataClient['checkIn']);
            foreach ($shortstayPrices as $shortstayPrice) {
                if( $shortstayPrice->day_type == $dayType['weekday'] ) {
                    $priceWeekday = $shortstayPrice->price;
                }
                if( $shortstayPrice->day_type == $dayType['holiday'] ) {
                    $priceHoliday = $shortstayPrice->price;
                }
            }
        }

        $holidays = $this->holidayService->getHolidaysInPeriod($dataClient['entrance'], $dataClient['graduation']);
        $holidaysString = [];
        $notOpenedDay = 0;

        // Count holidays which all classed are closed.
        foreach ($holidays as $holiday) {
            array_push($holidaysString, $holiday->date);
            if($holiday->opened_class == $holidayType['all_class_closed']) {
                $notOpenedDay++;
            }
        }

        // Count holidays which all classes are opened
        $numStudyInHoliday = 0;
        foreach ($holidays as $holiday) {
            array_push($holidaysString, $holiday->date);
            if($holiday->opened_class == $holidayType['all_class_opened'])
                $numStudyInHoliday++;
        }

        // save holiday fee
        $dataClient['holidayFee'] = $numStudyInHoliday * $priceHoliday;

        // Count normal studying days which are not holidays or weekends.
        $studyingDay = GlobalFunctions::getWorkingDays($dataClient['entrance'], $dataClient['graduation'], $holidaysString);
        // Count total days user studies.
        $totalDay = GlobalFunctions::getDaysBetweenTwoDays($dataClient['entrance'], $dataClient['graduation']);
        // Count total days user use accommodation.
        $totalDayAccommodation = GlobalFunctions::getDaysBetweenTwoDays($dataClient['checkIn'], $dataClient['checkOut']) - 1;

        // Calculate tuition
        if( $plan->name == $generalValue['very_short_plan_120_tickets'] ) {
            $studyingPrice = $studyingDay * $priceWeekday + ($totalDay - $studyingDay - $notOpenedDay) * $priceHoliday + $enrollValue['ticket_price'];
        } else {
            $studyingPrice = $studyingDay * $priceWeekday + ($totalDay - $studyingDay - $notOpenedDay) * $priceHoliday;
        }

        if( $dataClient['accommodationId1'] != $generalValue['no_accommodation_id']) {
            $accommodationPrice = $this->accommodationPricesService->getPriceWithAccommodationRoom($dataClient['accommodationId1'], $dataClient['roomId1'], $dataClient['checkIn']);

            // Get name of accommodation and room to send mail.
            $accommodation1 = $this->accommodationService->findById($dataClient['accommodationId1']);
            if($accommodation1->name == $generalValue['executive_room'] || $accommodation1->name == $generalValue['deluxe_room']) {
                $dataClient['accommodationRoom1'] = $accommodation1->name . $dataClient['numOf'] . $generalValue['name_use'];
            } else {
                $dataClient['accommodationRoom1'] = $accommodation1->name . $this->roomService->findById($dataClient['roomId1'])->name;
            }

            if( !empty($dataClient['accommodationId2']) && !empty($dataClient['roomId2']) ) {
                $accommodation2 = $this->accommodationService->findById($dataClient['accommodationId2']);
                if($accommodation2->name == $generalValue['executive_room'] || $accommodation2->name == $generalValue['deluxe_room']) {
                    $dataClient['accommodationRoom2'] = $accommodation2->name . $dataClient['numOf'] . $generalValue['name_use'];
                } else {
                    $dataClient['accommodationRoom2'] = $accommodation2->name . $this->roomService->findById($dataClient['roomId2'])->name;
                }
            } else {
                $dataClient['accommodationRoom2'] = $enrollValue['no_accommodation_request'];
            }

            // Calculate tuition and accommodation cost
            if( empty($accommodationPrice) ) {
                $dataClient['subTotal'] = $studyingPrice;
            } else {
                $dataClient['subTotal'] = $studyingPrice + $totalDayAccommodation * $accommodationPrice->price;
            }
        } else {
            $dataClient['accommodationRoom1'] = $enrollValue['no_stay_value'];
            $dataClient['accommodationRoom2'] = $enrollValue['no_stay_value'];

            $dataClient['subTotal'] = $studyingPrice;
        }
        $dataClient['totalCost'] = $dataClient['subTotal'] + $dataClient['mealCost'] + $dataClient['specialCost']
            + $dataClient['beginnerCost'] + $dataClient['pickUpCost'] + $dataClient['entranceFee']
            + $dataClient['remittanceFee'];

        // Get ssp cost
        if( $dataClient['term'] >= $optionsCost['ssp_condition'] ) {
            $dataClient['ssp'] = $optionsCost['ssp'];
        } else {
            $dataClient['ssp'] = 0;
        }

        // Calculate visa cost
        if( (float) $dataClient['term'] / $generalValue['days_of_week'] <= $optionsCost['visa']['less_4']['key']) {
            $dataClient['visa'] = $optionsCost['visa']['less_4']['value'];
        } elseif ( (float) $dataClient['term'] / $generalValue['days_of_week'] <= $optionsCost['visa']['less_8']['key'] ) {
            $dataClient['visa'] = $optionsCost['visa']['less_8']['value'];
        } elseif ( (float) $dataClient['term'] / $generalValue['days_of_week'] <= $optionsCost['visa']['less_12']['key'] ) {
            $dataClient['visa'] = $optionsCost['visa']['less_12']['value'];
        } elseif ( (float) $dataClient['term'] / $generalValue['days_of_week'] <= $optionsCost['visa']['less_16']['key'] ) {
            $dataClient['visa'] = $optionsCost['visa']['less_16']['value'];
        } elseif ( (float) $dataClient['term'] / $generalValue['days_of_week'] <= $optionsCost['visa']['less_20']['key'] ) {
            $dataClient['visa'] = $optionsCost['visa']['less_20']['value'];
        } else {
            $dataClient['visa'] = $optionsCost['visa']['other'];
        }
        // Calculate acri cost
        if( $dataClient['term'] >= $optionsCost['acri_short_plan_condition'] ) {
            $dataClient['acri'] = $optionsCost['acr'];
        } else {
            $dataClient['acri'] = 0;
        }
        $dataClient['emigration'] = 0;
        // Calculate electrical charge cost
        // No Stay (Walk-in) and Hotels don't have electrical fee
        if($dataClient['accommodationId1'] == '-1' || $dataClient['accommodationId1'] == '2' || $dataClient['accommodationId1'] == '3' ||
            $dataClient['accommodationId1'] == '7' || $dataClient['accommodationId1'] == '8') {
            $dataClient['electricalCharge'] = 0;
        } else {
            $dataClient['electricalCharge'] = (GlobalFunctions::getDaysBetweenTwoDays($dataClient['checkIn'], $dataClient['checkOut']) - 1) * $optionsCost[$planType['short']]['electricalCharge'];
        }

        // Calculate total cost in php
        $dataClient['totalCostPhp'] = $dataClient['ssp'] + $dataClient['visa'] + $dataClient['acri'] + $dataClient['emigration']
            + $dataClient['electricalCharge'] + $optionsCost['idcard'];

        // Change term show to use to send mail
        if( $dataClient['term'] == 1 ) {
            $dataClient['term'] = $dataClient['term'] . ' day';
        } else {
            $dataClient['term'] = $dataClient['term'] . ' days';
        }

        return $dataClient;
    }

    /**
     * @param $randomNumber
     * @param $data
     * @param $term
     * @param $optionsList
     */
    public function saveStudentApply($randomNumber, $data, $term, $optionsList)
    {
       //TODO Hyde sava to databases;
        $studentApply = array(
            "apply_no" => $randomNumber,
            "edit_id" => md5($randomNumber."i@mas+r!n&"),
            "student_name" => $data['name'],
            "passport_name" => $data['passportName'],
            "birthday" => date('Y-m-d H:i:s', strtotime($data['birthday'])),
            "phone" => $data['phone'],
            "email" => $data['email'],
            "sex" => $data["sex"] == "男性" || $data["sex"] == "M" ? 1 : 2,
            "age" => $data['age'],
            "student_status" => 1, //Default - New status
            "nationality" => $data['nationality'],
            "country_code" => $this->getLanguage(),
            "address" => $data['address'],
            "phone" => $data['phone'],
            "email" => $data['email'],
            "job" => $data['job'],
            "emergency_contact" => $data['emergencyContact'],
            "email_family" => $data['emailFamily'],
            "skype_id" => $data['skypeId'],
            "line_id" => $data['lineId'],
            "term" => $term, //plan Long

            "plan_id" => $data['planId'],
            "course" => $this->getPlanName($data['planId'],$this->getLanguage()),
            "building_id" => $data['buildingId'],
            "campus" => $data['buildingId']==1 ? 'ITP':'SFC',
            "accommodation_id1" => isset($data['accommodationId1'])?$data['accommodationId1']:null,
            "accommodation_id2" => isset($data['accommodationId2'])?$data['accommodationId2']:null,
            "room_id1" => isset($data['roomId1'])?$data['roomId1']:null,
            "room_id2" => isset($data['roomId2'])?$data['roomId2']:null,
            "num_of_person" => $data['numOf'],
//            "agent_name" => array_key_exists("agentName", $data) ? "" : "QQE",
            "agent_name" => $data['agentName'] == "" ? "QQ":$data['agentName'],
            "agent_email" => $data['agentEmail'],

            "options_special" => $optionsList['Special Options']['key'] == 'specialOption' ? 1 : 0,
            "options_pickup" => $optionsList['Pick up']['key'] == 'pickUp' ? 1 : 0,
            "options_meals" => $optionsList['Meals']['key'] == 'meals' ? 1 : 0,
            "checkin_date" => date('Y-m-d H:i:s', strtotime($data['checkIn'])),
            "checkout_date" => date('Y-m-d H:i:s', strtotime($data['checkOut'])),
            "total_cost" => $data['totalCost'],
            "total_cost_php" => $data['totalCostPhp'],

            "remittance_fee" => $data['remittanceFee'],
            "special_cost" => $data['specialCost'],
            "beginner_cost" => $data['beginnerCost'],
            "meal_cost" => $data['mealCost'],
            "pickup_cost" => $data['pickUpCost'],
            "entrance_fee" => $data['entranceFee'],
            "visa_fee_php" => $data['visa'],
            "acri_fee_php" => $data['acri'],
            "emigration_fee_php" => $data['emigration'],
            "electrical_fee_php" => $data['electricalCharge'],
            "ssp_fee_php" => $data['ssp'],
            "holiday_fee" => $data['holidayFee'],
            "sub_total" => $data['subTotal']
        );
        $this->studentApplyService->create($studentApply);
    }

    /**
     * @return string
     */
    public function getLanguage()
    {
        $language = \Request::header('lan');
        if (empty($language) || $language == "") {
            $language = "JP";
        }
        return strtoupper($language);//now we can use ?lan=jp/jP/Jp/JP/en/En/EN.... 
    }

    /**
     * @return string
     */
    public function getPlanName($planId, $lan){
        $planName = $this->planService->allCountryPlan($lan);
        foreach ($planName as $plan) {
            if($planId == $plan['id']){
                $planName = $plan['name'];
            }
        }
        return $planName;
    }


    /**
     * @param $language
     * @return mixed
     */
    public function getOptionList($language)
    {
        $optionsList = config('constants.options_list.' . $language);
        if (!$optionsList) {
            $optionsList = config('constants.options_list.EN');
            return $optionsList;
        }
        return $optionsList;
    }
}
