export class ApplySearchModel {
    constructor() { }
    public passportName: string;
    public checkIn: string;
    public checkOut: string;
    public building: string;
    public studentStat: string;
    public cntCode: string;
    public currentPage: number;
    public paymentCheck: boolean;
}

export class ExportFilterModel {
    constructor() { }
    public id: number;
    public id_number: string;
    public apply_no: string;
    public edit_id: string;
    public student_name: string;
    public passport_name: string;
    public birthday: string;
    public sex: number;
    public autumn_campaign: number;
    public age: number;
    public nationality: string;
    public country_code: string;
    public course: string;
    public campus: string;
    public delete_flag: number;
    public address: string;
    public phone: string;
    public email: string;
    public job: string;
    public emergency_contact: string;
    public email_family: string;
    public skype_id: string;
    public line_id: string;

    public life_overseas: string;
    public english_skill: string;
    public studied_before: string;
    public how_know_qqe: string;
    public memo: string;

    public options_meals: number;
    public options_pickup: number;
    public options_special_option: number;
    public options_beginner_option: number;
    public options_island_hopping: number;
    public options_oslob: number;

    public plan_id: number;
    public building_id: number;
    public num_of_person: number;
    public accommodation_id1: string;
    public room_id1: string;
    public accommodation_id2: string;
    public room_id2: string;
    public term: string;

    public checkin_date: string;
    public checkout_date: string;
    public entrance_date: string;
    public graduation_date: string;
    public application_from: string;

    public agent_name: string;
    public agent_email: string;

    public campaign_code: string;
    public sub_total: number;
    public meal_cost: number;
    public pickup_cost: number;
    public special_cost: number;
    public beginner_cost: number;
    public remittance_fee: number;
    public entrance_fee: number;
    public holiday_fee: number;
    public total_cost: number;

    public ssp_fee_php: number ;
    public visa_fee_php: number;
    public acri_fee_php: number;
    public id_card: number;
    public emigration_fee_php: number;
    public electrical_fee_php: number;
    public total_cost_php: number;

    public invoice_number: string;
    public payment: string;
    public price_jpy: number;
    public ex_price_jpy: number;
    public special_holiday_jpy: number;
    public transfer_fee: number;
    public extension_fee_jpy: number;
    public additional_lesson_fee: number;
    public ex_sub_total: number;
    public commission: number;
    public discount: number;
    public i_card_cost: number;
    public ecc: number;
    public extention_fee_php: number;

    public due_date: string;
    public note_for_gatta: string;
    public paid_date: string;
    public option_fee: number;
    public enrollment_fee_repeater: string;
    public enrollment_fee_course: string;
    public enrollment_number_weeks: string;
    public pick_up_request: string;
    public pick_up_briefing: string;
    public pick_up_day: string;

    public domi_info_application: string;
    public domi_info_campus: string;
    public super_short_weekdays: string;
    public super_short_weekends: string;
    public accommodation_cost: number;
    public days_of_lesson: string;
    public sevenh_tenh: string;

    public changing_fee: number;
    public payment_pending: number;
    public paid_amount: number;
    public aya_plan_fee: number;

    public note_for_op: string;
    public arrival_date: string;
    public flight_no: string;
    public arrival_time: string;
    public staff: string;
    public driver: string;
    public created_at: string;
    public updated_at: string;
}

export class StudentApplyModel {
    constructor() { }
    public id: number;
    public id_number: string;
    public apply_no: string;
    public edit_id: string;
    public student_name: string;
    public passport_name: string;
    public student_status: string;
    public repeater: number;
    public birthday: string;
    public sex: number;
    public autumn_campaign: number;
    public age: number;
    public nationality: string;
    public country_code: string;
    public course: string;
    public campus: string;
    public delete_flag: number;
    public address: string;
    public phone: string;
    public email: string;
    public job: string;
    public emergency_contact: string;
    public email_family: string;
    public skype_id: string;
    public line_id: string;

    public life_overseas: string;
    public english_skill: string;
    public studied_before: string;
    public how_know_qqe: string;
    public memo: string;

    public options_meals: number;
    public options_pickup: number;
    public options_special_option: number;
    public options_beginner_option: number;
    public options_island_hopping: number;
    public options_oslob: number;

    public plan_id: number;
    public building_id: number;
    public num_of_person: number;
    public accommodation_id1: string;
    public room_id1: string;
    public accommodation_id2: string;
    public room_id2: string;
    public dormitory_room_name: string;
    public dormitory_room_id: string;
    public term: string;

    public checkin_date: string;
    public checkout_date: string;
    public entrance_date: string;
    public graduation_date: string;
    public application_from: string;

    public agent_name: string;
    public agent_email: string;

    public campaign_code: string;
    public sub_total: number;
    public meal_cost: number;
    public pickup_cost: number;
    public special_cost: number;
    public beginner_cost: number;
    public remittance_fee: number;
    public entrance_fee: number;
    public holiday_fee: number;
    public total_cost: number;

    public ssp_fee_php: number ;
    public visa_fee_php: number;
    public acri_fee_php: number;
    public id_card: number;
    public emigration_fee_php: number;
    public electrical_fee_php: number;
    public total_cost_php: number;

    public invoice_number: string;
    public payment: string;
    public price_jpy: number;
    public ex_price_jpy: number;
    public special_holiday_jpy: number;
    public transfer_fee: number;
    public extension_fee_jpy: number;
    public additional_lesson_fee: number;
    public ex_sub_total: number;
    public commission: number;
    public discount: number;
    public i_card_cost: number;
    public ecc: number;
    public extention_fee_php: number;

    public due_date: string;
    public note_for_gatta: string;
    public paid_date: string;
    public option_fee: number;
    public enrollment_fee_repeater: string;
    public enrollment_fee_course: string;
    public enrollment_number_weeks: string;
    public pick_up_request: string;
    public pick_up_briefing: string;
    public pick_up_day: string;

    public domi_info_application: string;
    public domi_info_campus: string;
    public super_short_weekdays: string;
    public super_short_weekends: string;
    public accommodation_cost: number;
    public days_of_lesson: string;
    public sevenh_tenh: string;

    public changing_fee: number;
    public payment_pending: number;
    public paid_amount: number;
    public aya_plan_fee: number;

    public note_for_op: string;
    public arrival_date: string;
    public flight_no: string;
    public arrival_time: string;
    public staff: string;
    public driver: string;
    public created_at: string;
    public updated_at: string;
}

export class ImportDataFullErrorModel {
    constructor() { 
        this.data = [];
        this.errors = [];
    }
    public data: Array<StudentApplyModel>;
    public errors: Array<ImportDataLineErrorModel>;
}

export class ImportDataLineErrorModel {
    constructor() { }

    public row: number;
    public errors: Array<string>;
}
export class ChangeLogModel {
    constructor() { }
    public id: number;
    public email_address: string;
    public deleted_flag: number;
    public operator_id: number;
    public operator_role_id: number;
    public method_name: string;
    public params_json: string;
    public result_json: string;
    public remote_addr_ip: string;
    public request_uri: string;
    public user_agent: string;
    public server_name: string;
    public host_name: string;
    public created_at: string;
    public updated_at: string;
}

export class InvoiceDiscountModel {
    constructor() { }
    public id: number;
    public student_invoice_no: string;
    public discount: number;
    public who_discounted: string;
    public reason: string;
    public created_at: string;
    public updated_at: string;
}

   