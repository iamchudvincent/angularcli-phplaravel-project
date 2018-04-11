<?php
/**
 * Created by PhpStorm.
 * User: DELL
 * Date: 4/10/2017
 * Time: 11:51 AM
 */

namespace App\Entities;


use Illuminate\Database\Eloquent\Model;

class student_apply extends Model
{
    public function dormitoryRoomReservationList()
    {
        return $this->belongsToMany('App\Entities\reservations');
    }
    protected $fillable = ['id_number','apply_no','edit_id','student_name','passport_name','birthday','sex','age','nationality','country_code',     'course','campus','address','phone','email',
        'job','emergency_contact','email_family','skype_id','line_id','student_status','repeater',
        'life_overseas','english_skill','studied_before','how_know_qqe','memo',
        'options_meals','autumn_campaign','options_pickup','options_special_option','options_beginner_option','options_island_hopping','options_oslob',
        'plan_id','building_id','num_of_person','accommodation_id1','room_id1','accommodation_id2','room_id2','dormitory_room_name','dormitory_room_id','term',
        'checkin_date','checkout_date','entrance_date','graduation_date','application_from','agent_name','agent_email',
        'campaign_code','sub_total','meal_cost','pickup_cost','special_cost','beginner_cost','remittance_fee','holiday_fee','entrance_fee','total_cost',
        'ssp_fee_php','visa_fee_php','acri_fee_php','id_card','emigration_fee_php','electrical_fee_php','total_cost_php',
        'note_for_op','arrival_date','flight_no','arrival_time','dommi_space','sfc_to_itp','itp_to_sfc','note_for_teacher','note_for_student','online','ss',
        'log_of_changes','aya_plan','invoice_number','payment','price_jpy','ex_price_jpy','special_holiday_jpy','transfer_fee','extension_fee_jpy','additional_lesson_fee',
        'ex_sub_total','commission','discount','i_card_cost','ecc','extention_fee_php','due_date','note_for_gatta','paid_date','option_fee',
        'enrollment_fee_repeater','enrollment_fee_course','enrollment_number_weeks','pick_up_request','pick_up_briefing','pick_up_day','domi_info_application','domi_info_campus',
        'super_short_weekdays','super_short_weekends','accommodation_cost','days_of_lesson','sevenh_tenh','changing_fee','payment_pending','paid_amount','aya_plan_fee',
        'staff','driver','delete_flag','created_at','updated_at'];
}