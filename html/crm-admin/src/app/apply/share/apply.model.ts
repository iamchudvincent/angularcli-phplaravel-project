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
    public addDateFrom: string;
    public addDateTo: string;
    public gradDateFrom: string;
    public gradDateTo: string;
    public transferDate: string;
    public searchCheckedList: string;
}

export class ExportFilterModel {
    constructor() { }
    public id: number;
    public id_number: string;
    public apply_no: string;
    public edit_id: string;
    public visit_id: number;
    public student_name: string;
    public passport_name: string;
    public passport_id: string;
    public birthday: string;
    public sex: number;
    public autumn_campaign: number;
    public camp_name: string;
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
    public sfc_to_itp: string;
    public itp_to_sfc: string;
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
    public adjustments_php: number;
    public others_php: number;
    public room_update_php: number;
    public photocopy_php: number;
    public meal_total_php: number;
    public total_cost_php: number;
    public ga_payment_status: number;
    public ga_payment_confirm_by: string;
    public invoice_payment_status: number;
    public invoice_payment_confirm_by: string;

    public isInvoiceConfirmed: number ;
    public isExtInvoiceConfirmed: number ;
    public isExtInvoiceConfirmed_2: number ;
    public isExtInvoiceConfirmed_3: number ;
    public isRefundInvoiceConfirmed: number ;
    public invoice_number: string;
    public ext_invoice_number: string;
    public ext_invoice_number_2: string;
    public ext_invoice_number_3: string;
    public refund_invoice_number: string;
    public custom1_label: string;
    public custom1_fee: number;
    public payment: string;
    public price_jpy: number;
    public ex_price_jpy: number;
    public special_holiday_jpy: number;
    public transfer_fee: number;
    public extension_fee_jpy: number;
    public additional_lesson_fee: number;
    public ex_sub_total: number;
    public commission: number;
    public commission_percentage: number;
    public commission_reason: string;
    public receipt_number: string;
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

    public total_payment_php: number;
    public commission_php: number;
    public tuition_accommo_php: number;
    public exc_rate_php: number;
    public mode_payment: string;
    public status_payment: string;
    public paid_by: string;

    public note_for_op: string;
    public note_for_teacher: string;
    public note_for_student: string;
    public arrival_date: string;
    public departure_date: string;
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
    public visit_id: number;
    public student_name: string;
    public passport_name: string;
    public passport_id: string;
    public student_status: string;
    public repeater: number;
    public birthday: string;
    public sex: number;
    public autumn_campaign: number;
    public camp_name: string;
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
    public hotel_name: string;
    public dormitory_room_id: string;
    public term: string;

    public checkin_date: string;
    public checkout_date: string;
    public entrance_date: string;
    public graduation_date: string;
    public sfc_to_itp: string;
    public itp_to_sfc: string;
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
    public adjustments_php: number;
    public others_php: number;
    public room_update_php: number;
    public photocopy_php: number;
    public meal_total_php: number;
    public total_cost_php: number;
    public ga_payment_status: number;
    public ga_payment_confirm_by: string;
    public invoice_payment_status: number;
    public invoice_payment_confirm_by: string;

    public isInvoiceConfirmed: number ;
    public isExtInvoiceConfirmed: number ;
    public isExtInvoiceConfirmed_2: number ;
    public isExtInvoiceConfirmed_3: number ;
    public isRefundInvoiceConfirmed: number ;
    public invoice_number: string;
    public ext_invoice_number: string;
    public ext_invoice_number_2: string;
    public ext_invoice_number_3: string;
    public refund_invoice_number: string;
    public custom1_label: string;
    public custom1_fee: number;
    public payment: string;
    public price_jpy: number;
    public ex_price_jpy: number;
    public special_holiday_jpy: number;
    public transfer_fee: number;
    public extension_fee_jpy: number;
    public additional_lesson_fee: number;
    public ex_sub_total: number;
    public commission: number;
    public commission_percentage: number;
    public commission_reason: string;
    public receipt_number: string;
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

    public total_payment_php: number;
    public commission_php: number;
    public tuition_accommo_php: number;
    public exc_rate_php: number;
    public mode_payment: string;
    public status_payment: string;
    public paid_by: string;

    public note_for_op: string;
    public note_for_teacher: string;
    public note_for_student: string;
    public arrival_date: string;
    public departure_date: string;
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
    public user_name: string;
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
    public apply_id: string;
    public discount: number;
    public who_discounted: string;
    public reason: string;
    public created_at: string;
    public updated_at: string;
}

export class StudentApplyGroupModel {
    constructor() { }
    public groupAddCheckin: String;
    public groupAddCheckout: String;
    public groupAddCampus: number;
    public groupAddAccommodation: String;
    public groupAddCampName: String;
    public groupAddPassportName: String;
    public groupAddVisitType: String;
    public groupdAddAgency: String;
    public groupdAddGender: number;
    public groupAddCountry: String;
    public selectGroupAddType: number;
    public groupAddHowMany: number;
}

export class ExtensionInvoiceModel {
    constructor() { }

    public id: number;
    public sa_id: number;
    public sa_passport_name: string;
    public ext_invoice_number: string;
    public ext_checkin_date: string;
    public ext_checkout_date: string;
    public ext_term: number;
    public ext_building_id: number;
    public ext_accommodation_id: number;
    public ext_room_id: number;
    public ext_room_name: string;
    public ext_plan_id: number;
    public ext_course: string;
    public ext_holidays: string;
    public ext_entrance_fee: number;
    public ext_tuition_accommodation_fee: number;
    public ext_room_upgrade_fee: number;
    public ext_plan_upgrade_fee: number;
    public ext_holiday_fee: number;
    public ext_other1_label: string;
    public ext_other1_fee: number;
    public ext_other2_label: string;
    public ext_other2_fee: number;
    public ext_agent_commission: number;
    public ext_commission_percentage: number;
    public ext_discount: number;
    public ext_isInvoiceConfirmed: number;
    public ext_total_cost: number;
    public ext_ssp_fee_php: number;
    public ext_visa_fee_php: number;
    public ext_student_id_card_php: number;
    public ext_electrical_fee_php: number;
    public ext_i_card_fee_php: number;
    public ext_textbook_fee_php: number;
    public ext_departure_date: string;
    public ext_extention_fee_php: number;
    public ext_immigration_fee_php: number;
    public ext_acri_fee_php: number;
    public ext_photocopy_php: number;
    public ext_meal_total_php: number;
    public ext_ecc_php: number;
    public ext_adjustments_php: number;
    public created_at: string;
    public updated_at: string;
}


export class RefundInvoiceModel {
    constructor() { }

    public id: number;
    public sa_id_refund: number;
    public sa_passport_name: string;
    public refund_invoice_number: string;
    public rfd_checkin_date: string;
    public rfd_checkout_date: string;
    public rfd_term: number;
    public rfd_building_id: number;
    public rfd_accommodation_id: number;
    public rfd_room_id: number;
    public rfd_room_name: string;
    public rfd_plan_id: number;
    public rfd_course: string;
    public rfd_holidays: string;
    public rfd_entrance_fee: number;
    public rfd_tuition_accommodation_fee: number;
    public rfd_room_upgrade_fee: number;
    public rfd_plan_upgrade_fee: number;
    public rfd_holiday_fee: number;
    public rfd_other1_label: string;
    public rfd_other1_fee: number;
    public rfd_other2_label: string;
    public rfd_other2_fee: number;
    public rfd_agent_commission: number;
    public rfd_commission_percentage: number;
    public rfd_discount: number;
    public rfd_isInvoiceConfirmed: number;
    public rfd_total_cost: number;
    public rfd_ssp_fee_php: number;
    public rfd_visa_fee_php: number;
    public rfd_student_id_card_php: number;
    public rfd_electrical_fee_php: number;
    public rfd_i_card_fee_php: number;
    public rfd_textbook_fee_php: number;
    public rfd_departure_date: string;
    public rfd_extention_fee_php: number;
    public rfd_immigration_fee_php: number;
    public rfd_acri_fee_php: number;
    public rfd_photocopy_php: number;
    public rfd_meal_total_php: number;
    public rfd_ecc_php: number;
    public rfd_adjustments_php: number;
    public created_at: string;
    public updated_at: string;
}

export class InvoiceModel {
    constructor() { }

    public id: number;
    public sa_id_number: number;

    public invoice_number: string;
    public checkin_date: string;
    public checkout_date: string;
    public due_date: string;
    public holidays: string;

    public term: string;
    public custom1_label: string;
    public custom1_fee: number;

    public remittance_fee: number;
    public entrance_fee: number;
    public holiday_fee: number;
    public transfer_fee: number;
    public sub_total: number;
    public discount: number;
    public commission: number;
    public commission_percentage: number;
    public commission_reason: string;
    public total_cost: number;
    public total_cost_php: number;

    public ssp_fee_php: number;
    public visa_fee_php: number;
    public id_card: number;
    public electrical_fee_php: number;
    public i_card_cost: number;
    public extention_fee_php: number;
    public immigration_fee_php: number;
    public acri_fee_php: number;
    public photocopy_php: number;
    public meal_total_php: number;
    public ecc: number;
    public adjustments_php: number;
    public room_update_php: number;
    public others_php: number;
    public departure_date: string;
    public approved_date: string;

    public created_at: string;
    public updated_at: string;
}
   