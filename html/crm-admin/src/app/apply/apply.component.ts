import {Component, OnInit, ViewChild, ElementRef} from "@angular/core";
import {ApplyService} from "./share/apply.service";
import {
    ApplySearchModel, StudentApplyModel, ImportDataFullErrorModel, ExportFilterModel, InvoiceDiscountModel,
    StudentApplyGroupModel, ExtensionInvoiceModel, InvoiceModel, RefundInvoiceModel
} from './share/apply.model';
import * as _ from 'lodash';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {IMyOptions, IMyDateModel} from 'ngx-mydatepicker';
//import {IMyDrpOptions, IMyDateRangeModel} from 'mydaterangepicker'; install future datepickuprange
import * as moment from 'moment';
import * as $ from 'jquery';
import {By} from '@angular/platform-browser';

import {LocalStorageService} from 'ng2-webstorage';
import {ConfigService} from '../shared/config.service';
import {getHtmlTagDefinition} from "@angular/compiler";
import {PlatformLocation } from '@angular/common';
import {print} from "util";
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

@Component({
    selector: 'student-apply',
    templateUrl: './apply.component.html',
    styleUrls: ['./apply.component.scss'],
})
export class ApplyComponent implements OnInit {
    public user: any = null;
    public today: number = Date.now();
    public filterObj: ApplySearchModel;
    public passportName: String;
    public checkIn: String;
    public checkOut: String;
    public checkRoomFrom: String;
    public checkRoomFromStudents: String;
    public checkEmptyBedFrom: String;
    public checkEmptyBedTo: String;
    public checkRoomCampus: String;
    public checkEmptyBedCampus: String;
    public selectYear: number;
    public selectWeekCampus: String;
    public checkRoomType: String;
    public checkStayType: String;
    public checkEmptyBedStayType: String;
    public availRoomWeek: any[];
    public emptyBedsWeek: any[];
    public listGradStud: any[];
    public gradFrom: String;
    public listChangeDormRoom: any[];
    public listChangeHotelsRoom: any[];
    public listChangeWalkinsRoom: any[];
    public listChangeCondosRoom: any[];
    public listChangeHotelRoom: any[];
    public listChangePlan: any[];
    public listCountPlan: any[];
    public changeRoomFrom: String;
    public changeRoomTo: String;
    public changePlanFrom: String;
    public changePlanTo: String;
    public countPlanFrom: String;
    public countPlanTo: String;
    public countPlanCampus: String;
    public countCntCode: String;
    public cafeFrom: String;
    public cafeTo: String;
    public weeklyFrom: String;
    public weeklyTo: String;
    public cafeCampus: String;
    public weeklyCampus: String;
    public listCountCafeFirst: any[];
    public listCountCafeSecond: any[];
    public listCountCafeThird: any[];
    public listCountCafeFourth: any[];
    public gradRoomCampus: String;
    public building: String;
    public studentStat: String;
    public cntCode: String;
    public dormitory_room_id: String;
    public studentApply: StudentApplyModel = new StudentApplyModel();
    public studentGroupApply: StudentApplyGroupModel = new StudentApplyGroupModel();
    public invoiceDiscountByPercentage: InvoiceDiscountModel = new InvoiceDiscountModel();
    public invoiceDiscountByInput: InvoiceDiscountModel = new InvoiceDiscountModel();
    public extensionInvoice: ExtensionInvoiceModel = new ExtensionInvoiceModel();
    public refundInvoice: RefundInvoiceModel = new RefundInvoiceModel();
    public invoiceModel: InvoiceModel = new InvoiceModel();
    public list: Array<any> = [{}];
    public printTemplateList: Array<any> = [{}];
    public logList: Array<any> = [{}];
    public invoiceDiscountList: Array<any> = [{}];
    public refundDiscountList: Array<any> = [{}];
    public extensionInvoiceList: Array<any> = [{}];
    public countAllList: number;
    public perPage: number;
    public countryCodes: any[];
    public campusCodes: any[];
    public stayTypes: any[];
    public stayTypesItp: any[];
    public stayTypesSfc: any[];
    public roomTypes: any[];
    public roomTypesZ: any[];
    public roomTypesWF: any[];
    public roomTypesEX: any[];
    public roomTypesDX: any[];
    public planTypes: any[];
    public availableRoomList: any[];
    public countRestrictStudentDorm: number;
    public countRestrictStudentOthers: number;
    public countRestrictStudentWalkin: number;
    public studentStatus: any[];
    public paymentCheck: boolean;
    public registerCheckCommision: boolean;
    public tuitionCheckCommision: boolean;
    public holidayCheckCommision: boolean;
    public transferCheckCommision: boolean;
    public discountCheckCommision: boolean;
    public registerCheckDiscount: boolean;
    public tuitionCheckDiscount: boolean;
    public holidayCheckDiscount: boolean;
    public transferCheckDiscount: boolean;
    public discountCheckDiscount: boolean;
    public addDateFrom: String;
    public addDateTo: String;
    public gradDateFrom: String;
    public gradDateTo: String;
    public transferDate: String;
    public registerCheckExtCommision: boolean;
    public tuitionCheckExtCommision: boolean;
    public holidayCheckExtCommision: boolean;
    public roomupgradeCheckExtCommision: boolean;
    public planupgradeCheckExtCommision: boolean;
    public discountCheckExtCommision: boolean;

    public isModalShown: boolean = false;
    public file = null;
    public filePath = '';
    public import_success: boolean = false;
    public error_data: ImportDataFullErrorModel;
    public blobFile: any = null;
    public currPage: any = null;
    public p: number;
    public percentageDiscount: number;
    public percentageCommission: number;
    public totalInvoice: number;
    public selectDiscountBy: number;
    public selectCommissionBy: number;
    public selectInvoice: number;
    public processing = false;
    public arriveTimeHour: number;
    public arriveTimeMin: number;
    public chosenCheckInDate: String;
    public chosenCheckOutDate: String;
    public selectDormBldg: number;
    public selectVisitorType: number;
    public selectDormRoomType: String;
    public selectAccommodation: String;
    public selectSearchFilter: String;
    public selectPlan: String;
    public originUrl: String;
    public reservedRoomsList: Array<any> = [{}];
    public reservedCondoRoomsList: Array<any> = [{}];
    public reservedHotelsRoomsList: Array<any> = [{}];
    public reservedWalkinRoomsList: Array<any> = [{}];
    public reservedHotelsList: Array<any> = [{}];
    public reservedRoomsLogs: Array<any> = [{}];
    public paymentUnconfirmedList: Array<any> = [{}];
    public paymentConfirmedList: Array<any> = [{}];
    public percentQuantity = [];
    public arrivalHourCount = [];
    public arrivalMinCount = [];
    public numbWeeks: number;
    public deleteFlag = 1;
    public invoiceUnlock = 1;
    public invoiceLock = 2;
    public invoiceExtUnlock = 1;
    public invoiceExtLock = 2;
    public invoiceRfdUnlock = 1;
    public invoiceRfdLock = 2;
    public reserveStatusId: number;
    public loading: boolean = false;
    public courseList: Array<any> = [{}];
    public courseLogsList: Array<any> = [{}];
    public roomMemo: String;
    public phRateInvoice: number;
    public salesFrom: String;
    public salesTo: String;
    public campBookFrom: String;
    public campBookTo: String;
    public listSalesReport: any[];
    public listCampBookReport: any[];
    public selectCampus: number;
    public selectPrint: number;
    public checkedList = [];
    public changeStudentStat: String;
    public campArriveTimeHour: number;
    public campArriveTimeMin: number;
    public listOfYears: any[];
    public numberOfTermsPerMOnthPerNation: any[];
    public numberOfStudentsPerWeeksPerNationWithInternsGuardians: any[];
    public numberOfStudentsPerWeeksByCampus: any[];

    private mimeType: Array<string> = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/csv',
        'application/pdf',
        'application/wps-office.xls',
        'application/wps-office.xlt',
        'application/wps-office.xltx',
        'application/wps-office.xlsx'
    ];
    private mimeTypeHotel: Array<string> = [
        'application/pdf'
    ];
    public AppSettings;
    public error_code = {
        'apply_no_required': 'apply number required',
        'apply_no_invalid': 'apply number is invalid/already exists',
        'student_name_required': 'student name required',
        'passport_name_required': 'passport name required',
        'birthday_required': 'birthday required',
        'birthday_invalid': 'birthday error',
        'sex_required': 'gender/sex required',
        'age_required': 'age required',
        'nationality_invalid': 'nationality error',
        'nationality_required': 'nationality is required',
        'address_required': 'address required',
        'phone_required': 'phone required',
        'email_required': 'email required',
        'checkin_date_required': 'check-in date required',
        'checkout_date_required': 'check-out date required',
        'checkin_date_invalid': 'checkin_date error',
        'checkout_date_invalid': 'checkout_date error',
        'date_range_conflict_import_data': 'date range conflict import data',
        'date_range_conflict_database': 'date range conflict database',
        'checkin_date_after_checkout_date': 'checkin date is after checkout date',
        'file_type_invalid': 'file type is invalid',
        'import_file_required': 'import file required'
    };

    public myDatePickerOptions: IMyOptions = {
        dateFormat: 'yyyy-mm-dd',
        markWeekends: {marked: true, color: 'red'},
        markCurrentDay: true,
        sunHighlight: false,
        showWeekNumbers: true,
        firstDayOfWeek: 'su',
    };

    public myDatePickerOptionsDisabledWeekends: IMyOptions = {
        dateFormat: 'yyyy-mm-dd',
        markWeekends: {marked: true, color: 'red'},
        markCurrentDay: true,
        sunHighlight: false,
        showWeekNumbers: true,
        firstDayOfWeek: 'su',
        disableWeekends: true,
        disableWeekdays: ['tu', 'we','th','fr'],
    };
    public myDatePickerOptionsEnabledWeekends: IMyOptions = {
        dateFormat: 'yyyy-mm-dd',
        markWeekends: {marked: true, color: 'red'},
        markCurrentDay: true,
        sunHighlight: false,
        showWeekNumbers: true,
        firstDayOfWeek: 'su',
        disableWeekdays: ['mo','tu', 'we','th','fr','sa'],
    };
    public myDatePickerOptionsEnabledWeekendsSatOnly: IMyOptions = {
        dateFormat: 'yyyy-mm-dd',
        markWeekends: {marked: true, color: 'red'},
        markCurrentDay: true,
        sunHighlight: false,
        showWeekNumbers: true,
        firstDayOfWeek: 'su',
        disableWeekdays: ['mo','tu', 'we','th','fr','su'],
    };

    public saveDataLoadEvent: any;
    public stayTypeOptions: Array<any> = [{}];
    public dateInvalid = {
        dateFrom: false,
        dateTo: false,
        birthday_date: false
    };
    public dateType = {
        dateFrom: 0,
        dateTo: 1,
        birthday_date: 2
    };
    filterExportObj: ExportFilterModel;

    @ViewChild('editApplyModal') public editApplyModal: ModalDirective;
    @ViewChild('editRoomApplyModal') public editRoomApplyModal: ModalDirective;
    @ViewChild('ImportExportModal') public ImportExportModal: ModalDirective;
    @ViewChild('roomAvailableModal') public roomAvailableModal: ModalDirective;
    @ViewChild('loadRoomsModal') public loadRoomsModal: ModalDirective;
    @ViewChild('sendInvoiceModal') public sendInvoiceModal: ModalDirective;
    @ViewChild('listGraduatingModal') public listGraduatingModal: ModalDirective;
    @ViewChild('listRoomChangeModal') public listRoomChangeModal: ModalDirective;
    @ViewChild('listPlanChangeModal') public listPlanChangeModal: ModalDirective;
    @ViewChild('listPlanCountModal') public listPlanCountModal: ModalDirective;
    @ViewChild('editCourseApplyModal') public editCourseApplyModal: ModalDirective;
    @ViewChild('pickUpModal') public pickUpModal: ModalDirective;
    @ViewChild('listCafeModal') public listCafeModal: ModalDirective;
    @ViewChild('listWeeklyReportModal') public listWeeklyReportModal: ModalDirective;
    @ViewChild('listSalesReportModal') public listSalesReportModal: ModalDirective;
    @ViewChild('createStudentsModal') public createStudentsModal: ModalDirective;
    @ViewChild('groupAddModal') public groupAddModal: ModalDirective;
    @ViewChild('campAddModal') public campAddModal: ModalDirective;
    @ViewChild('extensionInvoiceModal') public extensionInvoiceModal: ModalDirective;
    @ViewChild('refundInvoiceModal') public refundInvoiceModal: ModalDirective;
    @ViewChild('listCampBookingReportModal') public listCampBookingReportModal: ModalDirective;
    @ViewChild('autoShownModal') public autoShownModal: ModalDirective;
    @ViewChild('weeksCountModal') public weeksCountModal: ModalDirective;
    @ViewChild('studentsCountModal') public studentsCountModal: ModalDirective;
    @ViewChild('emptyBedsModal') public emptyBedsModal: ModalDirective;
    @ViewChild('editInvoiceModal') public editInvoiceModal: ModalDirective;
    @ViewChild('editExtensionInvoiceModal') public editExtensionInvoiceModal: ModalDirective;
    @ViewChild('editRefundInvoiceModal') public editRefundInvoiceModal: ModalDirective;
    @ViewChild('printablesModal') public printablesModal: ModalDirective;

    campForm: FormGroup;

    constructor(private _elementRef: ElementRef,
                private localStorageService: LocalStorageService,
                public configService: ConfigService,
                private applyService: ApplyService,
                private platformLocation: PlatformLocation,private _fb: FormBuilder) {
        this.originUrl = (platformLocation as any).location.origin;
    }

    ngOnInit() {
        //this.numbWeeks = moment.duration(this.tobb.diff(this.fromaa)).asWeeks();
        this.user = this.localStorageService.retrieve('user');
        this.filterObj = new ApplySearchModel();
        this.search();
        this.getCountryCode();
        this.getCampusCode();
        this.getStaytypes();
        this.getStaytypesItp();
        this.getStaytypesSfc();
        this.getRoomtypes();
        this.getRoomTypesZ();
        this.getRoomTypesWF();
        this.getRoomTypesDX();
        this.getRoomTypesEX();
        this.getPlantypes();
        this.getStudentstatus();
        this.error_data = new ImportDataFullErrorModel();
        this.filterExportObj = new ExportFilterModel();
        this.saveDataLoadEvent = {
            birthday_date: this.setNgxDatepickerModel(new Date(this.studentApply.birthday)),
            dateFrom: this.setNgxDatepickerModel(new Date(this.studentApply.checkin_date)),
            dateTo: this.setNgxDatepickerModel(new Date(this.studentApply.checkout_date)),
            checkRoomFrom: this.setNgxDatepickerModel(this.getSunday(new Date())),
            checkRoomFromStudents: this.setNgxDatepickerModel(this.getSunday(new Date())),
            gradFrom: this.setNgxDatepickerModel(this.getMonday(new Date())),
            changeRoomFrom: this.setNgxDatepickerModel(this.getSunday(new Date())),
            changeRoomTo: this.setNgxDatepickerModel(this.getSaturday(new Date())),
            changePlanFrom: this.setNgxDatepickerModel(this.getSunday(new Date())),
            changePlanTo: this.setNgxDatepickerModel(this.getSaturday(new Date())),
            countPlanFrom: this.setNgxDatepickerModel(this.getSunday(new Date())),
            countPlanTo: this.setNgxDatepickerModel(this.getSaturday(new Date())),
            checkEmptyBedFrom: this.setNgxDatepickerModel(this.getSunday(new Date())),
            checkEmptyBedTo: this.setNgxDatepickerModel(this.getSaturday(new Date())),
            cafeFrom: this.setNgxDatepickerModel(this.getSunday(new Date())),
            cafeTo: this.setNgxDatepickerModel(this.getSaturday(new Date())),
            weeklyFrom: this.setNgxDatepickerModel(this.getSunday(new Date())),
            weeklyTo: this.setNgxDatepickerModel(this.getSaturday(new Date())),
            salesFrom: this.setNgxDatepickerModel(this.getFirstdayOfTheMonth(new Date())),
            campBookFrom: this.setNgxDatepickerModel(this.getFirstdayOfTheMonth(new Date())),
            campBookTo: this.setNgxDatepickerModel(new Date()),
            paid_date: this.setNgxDatepickerModel(this.studentApply.paid_date?new Date(this.studentApply.paid_date):this.getDayAWeekBeforeArrival(new Date(this.studentApply.checkin_date))),
            salesTo: this.setNgxDatepickerModel(new Date()),
            groupAddCheckin: this.setNgxDatepickerModel(this.getSunday(new Date())),
            groupAddCheckout: this.setNgxDatepickerModel(this.getSaturday(new Date())),
            campAddCheckin: this.setNgxDatepickerModel(this.getSunday(new Date())),
            campAddCheckout: this.setNgxDatepickerModel(this.getSaturday(new Date())),
            campAddStartDate: this.setNgxDatepickerModel(this.getSunday(new Date())),
            campAddGradDate: this.setNgxDatepickerModel(this.getSaturday(new Date())),
            campAddBirthdate: this.setNgxDatepickerModel(new Date()),
            campAddArrivalDate: this.setNgxDatepickerModel(new Date()),
            campAddBirthdate2: this.setNgxDatepickerModel(new Date()),
            campAddArrivalDate2: this.setNgxDatepickerModel(new Date()),
            campAddBirthdate3: this.setNgxDatepickerModel(new Date()),
            campAddArrivalDate3: this.setNgxDatepickerModel(new Date()),
            selectCheckIn_date: this.setNgxDatepickerModel(new Date(this.studentApply.checkin_date)),
            selectCheckOut_date: this.setNgxDatepickerModel(new Date(this.studentApply.checkout_date)),
            sfctoitp_date: this.setNgxDatepickerModel(new Date(this.studentApply.sfc_to_itp)),
            itptosfc_date: this.setNgxDatepickerModel(new Date(this.studentApply.itp_to_sfc)),
            checkIn_date: this.setNgxDatepickerModel(new Date(this.studentApply.checkin_date)),
            checkOut_date: this.setNgxDatepickerModel(new Date(this.studentApply.checkout_date)),
            start_date: this.setNgxDatepickerModel(new Date(this.studentApply.entrance_date)),
            graduate_date: this.setNgxDatepickerModel(new Date(this.studentApply.graduation_date)),
            due_date: this.setNgxDatepickerModel(this.invoiceModel.due_date?new Date(this.invoiceModel.due_date):new Date()),
            arrive_date: this.setNgxDatepickerModel(new Date(this.studentApply.arrival_date)),
            invoice_checkin: this.setNgxDatepickerModel(new Date(this.invoiceModel.checkin_date)),
            invoice_checkout: this.setNgxDatepickerModel(new Date(this.invoiceModel.checkout_date)),
            approved_date: this.setNgxDatepickerModel(this.invoiceModel.approved_date?new Date(this.invoiceModel.approved_date):new Date()),
            departure_date: this.setNgxDatepickerModel(this.invoiceModel.departure_date?new Date(this.invoiceModel.departure_date):new Date(this.studentApply.checkout_date)),
        };
        this.checkRoomCampus = "1";
        this.gradRoomCampus = "1";
        this.countPlanCampus = "1";
        this.countCntCode = "1";
        this.cafeCampus = "1";
        this.weeklyCampus = "1";
        this.selectCampus = 1;
        this.selectPrint = 1;
        this.selectYear = (new Date()).getFullYear();
        this.selectWeekCampus = "1";
        this.percentQuantity = Array(101).fill(0).map((x, i) => i);
        this.arrivalHourCount = Array(23).fill(0).map((x, i) => i + 1);
        this.arrivalMinCount = Array(59).fill(0).map((x, i) => i + 1);
        this.changeStudentStat = "1";
        this.checkStayType = "1";
        this.checkEmptyBedCampus = "1";
        this.checkEmptyBedStayType = "1";
    }

    getCopyOfOptions(): IMyOptions {
        return JSON.parse(JSON.stringify(this.myDatePickerOptionsEnabledWeekends));
    }

    public getSunday(d) {
        // Sunday of Previous Week
        d = new Date(d);
        var day = d.getDay(),
            diff = d.getDate() - day + (day == 0 ? -6 : 0);
        return new Date(d.setDate(diff));
    }

    public getMonday(d) {
        // Monday of Current Week
        d = new Date(d);
        var day = d.getDay(),
            diff = d.getDate() - day + (day == 0 ? -6 : 1);
        return new Date(d.setDate(diff));
    }

    public getFirstdayOfTheMonth(d) {
        d = new Date(d);
        var date = d, y = date.getFullYear(), m = date.getMonth();
        return new Date(y, m, 1);
    }

    public getDayAWeekBeforeArrival(d) {
        d = new Date(d);
        var to = d.setTime(d.getTime() - (d.getDay() ? d.getDay() : 7) * 24 * 60 * 60 * 1000);
        return new Date(to);
    }

    public getSaturday(d) {
        // Saturday of Current Week
        d = new Date(d);
        var day = d.getDay(),
            diff = d.getDate() - day + (day == 0 ? -6 : 6);
        return new Date(d.setDate(diff));
    }

    private setNgxDatepickerModel(time: Date) {
        let date = time.getDate();
        let month = time.getMonth() + 1;
        let year = time.getFullYear();
        return {
            date: {
                day: date,
                month: month,
                year: year
            },
            jsdate: moment(time).format('YYYY-MM-DD') + "T00:00:00.000Z"
        }
    }

    update(value) {
        this.studentApply.student_status = value;
    }

    public errorMessage = {
        dateFromAfterDateTo: 'Date from is after date to',
    };

    public moreActions() {
        this.ImportExportModal.show();
    }

    public checkAvailableRooms() {
        this.loadAvailableRooms();
        this.roomAvailableModal.show();
    }

    public checkNumberOfWeeks() {
        this.getYears();
        this.loadNumberOfWeeks();
        this.weeksCountModal.show();
    }

    public checkNumberOfStudentsPerWeek() {
        this.loadNumberOfStudentsPerWeeks();
        this.studentsCountModal.show();
    }

    public checkEmptyBeds() {
        this.loadEmptyBeds();
        this.emptyBedsModal.show();
    }

    public checkGraduating() {
        this.loadGraduatingList();
        this.listGraduatingModal.show();
    }

    public checkRoomChange() {
        this.loadChangeRoomList();
        this.listRoomChangeModal.show();
    }

    public checkPlanChange() {
        this.loadChangePlanList();
        this.listPlanChangeModal.show();
    }

    public getPlanCount() {
        this.loadPlanCountList();
        this.listPlanCountModal.show();

    }

    public getCafeList() {
        //this.loadCafeList();
        //this.listCafeModal.show();
    }

    public getWeeklyReportList() {
        this.loadWeeklyReportList();
        this.listWeeklyReportModal.show();

    }

    public getSalesReportList() {
        this.loadSalesReportList();
        this.showModal();
        this.listSalesReportModal.show();

    }

    public getCampBookingReportList() {
        this.loadCampBookingReportList();
        this.listCampBookingReportModal.show();

    }

    public saveInvoiceDueDate(applyId, invoiceId) {
        this.applyService.updateApplyInvoiceDueDate(applyId).subscribe(
            res => {
                let rs = res.json();
                this.getApplyInvoice(applyId, invoiceId);
            });
    }

    public saveInvoiceDiscount(apply_id, discount, reason, invoice_number) {
        this.processing = true;
        this.invoiceDiscountByPercentage.discount = Math.round(discount);
        this.invoiceDiscountByInput.discount = Math.round(discount);
        this.applyService.createInvoiceDiscount(apply_id, Math.round(discount), encodeURIComponent(reason), invoice_number).subscribe(res => {
            this.applyService.getInvoiceDiscountList(apply_id, invoice_number).subscribe((result) => {
                this.invoiceDiscountList = result.json();
                if (this.invoiceDiscountList) {
                    this.invoiceDiscountByInput.discount = null;
                    this.invoiceDiscountByInput.reason = '';
                    this.percentageDiscount = null;
                    this.invoiceDiscountByPercentage.reason = '';
                    var sum = 0;
                    for (let a of this.invoiceDiscountList) {
                        sum = sum + a['discount'];
                        this.totalInvoice = sum;
                    }
                    this.applyService.updateApplyDiscount(apply_id, this.totalInvoice).subscribe(
                        res => {
                            let rs = res.json();
                            this.sendInvoiceModal.hide();
                            this.extensionInvoiceModal.hide();
                            this.studentApply = new StudentApplyModel();
                            this.search();
                            this.processing = false;
                        });
                }
            });
        });
    }

    public saveExtInvoiceDiscount(apply_id, discount, reason, invoice_number) {
        this.processing = true;
        this.invoiceDiscountByPercentage.discount = Math.round(discount);
        this.invoiceDiscountByInput.discount = Math.round(discount);
        this.applyService.createInvoiceDiscount(apply_id, Math.round(discount), encodeURIComponent(reason), invoice_number).subscribe(res => {
            this.applyService.getInvoiceDiscountList(apply_id, invoice_number).subscribe((result) => {
                this.invoiceDiscountList = result.json();
                if (this.invoiceDiscountList) {
                    this.invoiceDiscountByInput.discount = null;
                    this.invoiceDiscountByInput.reason = '';
                    this.percentageDiscount = null;
                    this.invoiceDiscountByPercentage.reason = '';
                    var sum = 0;
                    for (let a of this.invoiceDiscountList) {
                        sum = sum + a['discount'];
                        this.totalInvoice = sum;
                    }
                    this.applyService.updateExtensionInvoiceDiscount(apply_id, this.totalInvoice).subscribe(
                        res => {
                            let rs = res.json();
                            this.extensionInvoiceModal.hide();
                            this.studentApply = new StudentApplyModel();
                            this.search();
                            this.processing = false;
                        });
                }
            });
        });
    }

    public saveRfdInvoiceDiscount(apply_id, discount, reason, invoice_number) {
        this.processing = true;
        this.invoiceDiscountByPercentage.discount = Math.round(discount);
        this.invoiceDiscountByInput.discount = Math.round(discount);
        this.applyService.createInvoiceDiscount(apply_id, Math.round(discount), encodeURIComponent(reason), invoice_number).subscribe(res => {
            this.applyService.getInvoiceDiscountList(apply_id, invoice_number).subscribe((result) => {
                this.invoiceDiscountList = result.json();
                if (this.invoiceDiscountList) {
                    this.invoiceDiscountByInput.discount = null;
                    this.invoiceDiscountByInput.reason = '';
                    this.percentageDiscount = null;
                    this.invoiceDiscountByPercentage.reason = '';
                    var sum = 0;
                    for (let a of this.invoiceDiscountList) {
                        sum = sum + a['discount'];
                        this.totalInvoice = sum;
                    }
                    this.applyService.updateRefundInvoiceDiscount(apply_id, this.totalInvoice).subscribe(
                        res => {
                            let rs = res.json();
                            this.refundInvoiceModal.hide();
                            this.studentApply = new StudentApplyModel();
                            this.search();
                            this.processing = false;
                        });
                }
            });
        });
    }

    public removeInvoiceDiscount(applyId, id, invoiceNumber, discountAmount) {
        this.processing = true;
        this.applyService.deleteInvoiceDiscount(applyId, id, invoiceNumber, discountAmount).subscribe(res => {
            let rs = res.json();
            this.sendInvoiceModal.hide();
            this.invoiceDiscountByInput = new InvoiceDiscountModel();
            this.invoiceDiscountByPercentage = new InvoiceDiscountModel();
            this.search();
            this.processing = false;
        });
    }

    public removeExtInvoiceDiscount(applyId, id, invoiceNumber, discountAmount) {
        this.processing = true;
        this.applyService.deleteExtInvoiceDiscount(applyId, id, invoiceNumber, discountAmount).subscribe(res => {
            let rs = res.json();
            this.extensionInvoiceModal.hide();
            this.invoiceDiscountByInput = new InvoiceDiscountModel();
            this.invoiceDiscountByPercentage = new InvoiceDiscountModel();
            this.search();
            this.processing = false;
        });
    }

    public removeRfdInvoiceDiscount(applyId, id, invoiceNumber, discountAmount) {
        this.processing = true;
        this.applyService.deleteRfdInvoiceDiscount(applyId, id, invoiceNumber, discountAmount).subscribe(res => {
            let rs = res.json();
            this.refundInvoiceModal.hide();
            this.invoiceDiscountByInput = new InvoiceDiscountModel();
            this.invoiceDiscountByPercentage = new InvoiceDiscountModel();
            this.search();
            this.processing = false;
        });
    }

    public saveCommission(apply_id, commission) {
        this.processing = true;
        this.studentApply.commission = Math.round(commission);
        this.studentApply.commission_percentage = this.percentageCommission? this.percentageCommission * 100 : 0;
        this.studentApply.commission_reason = this.invoiceModel.commission_reason ? this.invoiceModel.commission_reason : 'blank';
        this.applyService.updateApplyCommission(encodeURIComponent(this.studentApply.commission_reason),this.studentApply.commission, this.studentApply.commission_percentage,apply_id).subscribe(
            res => {
                let rs = res.json();
                this.sendInvoiceModal.hide();
                this.studentApply = new StudentApplyModel();
                this.search();
                this.processing = false;
                this.percentageCommission = null;
            });

    }

    public saveExtensionInvoiceCommission(apply_id, commission) {
        this.processing = true;
        this.extensionInvoice.ext_agent_commission = Math.round(commission);
        this.extensionInvoice.ext_commission_percentage = this.percentageCommission?this.percentageCommission * 100:0;
        this.applyService.updateApplyExtensionInvCommission(apply_id, this.extensionInvoice.ext_agent_commission, this.extensionInvoice.ext_commission_percentage).subscribe(
            res => {
                let rs = res.json();
                this.extensionInvoiceModal.hide();
                this.extensionInvoice = new ExtensionInvoiceModel();
                this.search();
                this.processing = false;
                this.percentageCommission = null;
            });

    }

    public saveRefundInvoiceCommission(apply_id, commission) {
        this.processing = true;
        this.refundInvoice.rfd_agent_commission = Math.round(commission);
        this.refundInvoice.rfd_commission_percentage = this.percentageCommission?this.percentageCommission * 100:0;
        this.applyService.updateApplyRefundInvCommission(apply_id, this.refundInvoice.rfd_agent_commission, this.refundInvoice.rfd_commission_percentage).subscribe(
            res => {
                let rs = res.json();
                this.refundInvoiceModal.hide();
                this.refundInvoice = new RefundInvoiceModel();
                this.search();
                this.processing = false;
                this.percentageCommission = null;
            });

    }

    public removeWalkin(applyId) {
        this.applyService.deleteWalkin(applyId).subscribe(res => {
            let rs = res.json();
            this.editRoomApplyModal.hide();
            this.dormitory_room_id = null;
            this.availableRoomList = null;
            this.countRestrictStudentDorm = null;
            this.countRestrictStudentOthers = null;
            this.countRestrictStudentWalkin = null;
            this.search();
        });
    }

    public confirmGAPayment(apply_id) {
        this.processing = true;
        this.applyService.updateApplyGAPaymentStatus(apply_id).subscribe(
            res => {
                let rs = res.json();
                this.editInvoiceModal.hide();
                this.invoiceModel = new InvoiceModel();
                this.studentApply = new StudentApplyModel();
                this.search();
                this.processing = false;
            });
    }

    public confirmInvoicePayment(apply_id) {
        this.processing = true;
        this.applyService.updateApplyInvoicePaymentStatus(apply_id).subscribe(
            res => {
                let rs = res.json();
                this.editApplyModal.hide();
                this.studentApply = new StudentApplyModel();
                this.search();
                this.processing = false;
            });
    }

    public loadNumberOfWeeks() {
        this.getNumberOfWeeksPerNation();
    }

    public loadNumberOfStudentsPerWeeks() {
        this.getNumberOfStudentsPerWeeks();
    }

    public loadAvailableRooms() {
        this.getTotalNumberOfAvailableRoom();
    }

    public loadEmptyBeds() {
        this.getTotalNumberOfEmptyBeds();
    }

    public loadGraduatingList() {
        this.getListOfGraduatingStudents();
    }

    public loadChangeRoomList() {
        this.getListOfChangingDormRoom();
        this.getListOfChangingHotelRoom();
        this.getListOfChangingHotelsRoom();
        this.getListOfChangingWalkinsRoom();
        this.getListOfChangingCondosRoom();
    }

    public loadChangePlanList() {
        this.getListOfChangePlan();
    }

    public loadPlanCountList() {
        this.getListOfPlanCount();
    }

    public loadCafeList() {
        this.getListOfCafe();
    }

    public loadWeeklyReportList() {
        this.getListOfWeeklyReport();
    }

    public loadSalesReportList() {
        this.getSalesReport();
        this.showModal();
    }

    public loadCampBookingReportList() {
        this.getCampBookingReport();
    }

    public editRoomApply(id) {
        if (id != 0) {
            this.getApply(id);
        } else {
            this.studentApply = new StudentApplyModel();
        }
        this.loadReservedRooms(id);
        this.loadCondoReservedRooms(id);
        this.loadHotelsReservedRooms(id);
        this.loadWalkinReservedRooms(id);
        this.loadReservedRoomsLogs(id);
        this.loadReservedHotels(id);
        this.editRoomApplyModal.show();
    }

    public openEditInvoice(id) {
        if (id != 0) {
            this.getApply(id);
            this.getInvoiceFromStudentApply(id);
        } else {
            this.invoiceModel = new InvoiceModel();
        }
        this.editInvoiceModal.show();
    }

    public closeEditInvoiceModal() {
        this.editInvoiceModal.hide();
    }

    public openEditExtensionInvoice(id) {
        if (id != 0) {
            this.getApply(id);
            this.getExtensionInvoiceFromStudentApply(id);
        } else {
            this.extensionInvoice = new ExtensionInvoiceModel();
        }
        this.editExtensionInvoiceModal.show();
    }

    public closeEditExtensionInvoice() {
        this.editExtensionInvoiceModal.hide();
    }

    public openEditRefundInvoice(id) {
        if (id != 0) {
            this.getApply(id);
            this.getRefundInvoiceFromStudentApply(id);
        } else {
            this.refundInvoice = new RefundInvoiceModel();
        }
        this.editRefundInvoiceModal.show();
    }

    public closeEditRefundInvoice() {
        this.editRefundInvoiceModal.hide();
    }

    public editCourseApply(id) {
        if (id != 0) {
            this.getApply(id);
        } else {
            this.studentApply = new StudentApplyModel();
        }
        this.loadCourses(id);
        this.loadCourseLogs(id);
        this.editCourseApplyModal.show();
    }

    // get Course list
    public loadCourses(applyId) {
        this.applyService.getCourseList(applyId).subscribe((res) => {
            this.courseList = res.json();
        });
    }

    // get Course Logs list
    public loadCourseLogs(applyId) {
        this.applyService.getCourseLogsList(applyId).subscribe((res) => {
            this.courseLogsList = res.json();
        });
    }

    public loadRoomList(id) {
        this.dormitory_room_id = null;
        this.reserveStatusId = null;
        this.roomMemo = null;
        this.getRoomList(id);
    }

    public removeRoomReserved(reservedRoomName, reservedRoomType, reservationId, applyId) {
        this.processing = true;
        this.applyService.removeReservedRoom(reservedRoomName, reservedRoomType, reservationId, applyId).subscribe(res => {
            let rs = res.json();
            this.editRoomApplyModal.hide();
            this.dormitory_room_id = null;
            this.availableRoomList = null;
            this.countRestrictStudentDorm = null;
            this.countRestrictStudentOthers = null;
            this.countRestrictStudentWalkin = null;
            this.search();
            this.processing = false;
        });
    }

    public removeCondoRoomReserved(reservedRoomName, reservedRoomType, reservationId, applyId) {
        this.processing = true;
        this.applyService.removeCondoReservedRoom(reservedRoomName, reservedRoomType, reservationId, applyId).subscribe(res => {
            let rs = res.json();
            this.editRoomApplyModal.hide();
            this.dormitory_room_id = null;
            this.availableRoomList = null;
            this.countRestrictStudentDorm = null;
            this.countRestrictStudentOthers = null;
            this.countRestrictStudentWalkin = null;
            this.search();
            this.processing = false;
        });
    }

    public removeHotelsRoomReserved(reservedRoomName, reservedRoomType, reservationId, applyId) {
        this.processing = true;
        this.applyService.removeHotelsReservedRoom(reservedRoomName, reservedRoomType, reservationId, applyId).subscribe(res => {
            let rs = res.json();
            this.editRoomApplyModal.hide();
            this.dormitory_room_id = null;
            this.availableRoomList = null;
            this.countRestrictStudentDorm = null;
            this.countRestrictStudentOthers = null;
            this.countRestrictStudentWalkin = null;
            this.search();
            this.processing = false;
        });
    }

    public removeWalkinRoomReserved(reservedRoomName, reservedRoomType, reservationId, applyId) {
        this.processing = true;
        this.applyService.removeWalkinReservedRoom(reservedRoomName, reservedRoomType, reservationId, applyId).subscribe(res => {
            let rs = res.json();
            this.editRoomApplyModal.hide();
            this.dormitory_room_id = null;
            this.availableRoomList = null;
            this.countRestrictStudentDorm = null;
            this.countRestrictStudentOthers = null;
            this.countRestrictStudentWalkin = null;
            this.search();
            this.processing = false;
        });
    }

    changeToReservedStatus(reserveId) {
        this.processing = true;
        this.applyService.changeToReservedStatus(reserveId).subscribe(res => {
            let rs = res.json();
            this.editRoomApplyModal.hide();
            this.dormitory_room_id = null;
            this.availableRoomList = null;
            this.search();
            this.processing = false;
        });
    }

    changeToPresentStatus(reserveId) {
        this.processing = true;
        this.applyService.changeToPresentStatus(reserveId).subscribe(res => {
            let rs = res.json();
            this.editRoomApplyModal.hide();
            this.dormitory_room_id = null;
            this.availableRoomList = null;
            this.search();
            this.processing = false;
        });
    }

    changeToCondoReservedStatus(reserveId) {
        this.processing = true;
        this.applyService.changeToCondoReservedStatus(reserveId).subscribe(res => {
            let rs = res.json();
            this.editRoomApplyModal.hide();
            this.dormitory_room_id = null;
            this.availableRoomList = null;
            this.search();
            this.processing = false;
        });
    }

    changeToCondoPresentStatus(reserveId) {
        this.processing = true;
        this.applyService.changeToCondoPresentStatus(reserveId).subscribe(res => {
            let rs = res.json();
            this.editRoomApplyModal.hide();
            this.dormitory_room_id = null;
            this.availableRoomList = null;
            this.search();
            this.processing = false;
        });
    }

    changeToHotelsReservedStatus(reserveId) {
        this.processing = true;
        this.applyService.changeToHotelsReservedStatus(reserveId).subscribe(res => {
            let rs = res.json();
            this.editRoomApplyModal.hide();
            this.dormitory_room_id = null;
            this.availableRoomList = null;
            this.search();
            this.processing = false;
        });
    }

    changeToHotelsPresentStatus(reserveId) {
        this.processing = true;
        this.applyService.changeToHotelsPresentStatus(reserveId).subscribe(res => {
            let rs = res.json();
            this.editRoomApplyModal.hide();
            this.dormitory_room_id = null;
            this.availableRoomList = null;
            this.search();
            this.processing = false;
        });
    }

    changeToWalkinReservedStatus(reserveId) {
        this.processing = true;
        this.applyService.changeToWalkinReservedStatus(reserveId).subscribe(res => {
            let rs = res.json();
            this.editRoomApplyModal.hide();
            this.dormitory_room_id = null;
            this.availableRoomList = null;
            this.search();
            this.processing = false;
        });
    }

    changeToWalkinPresentStatus(reserveId) {
        this.processing = true;
        this.applyService.changeToWalkinPresentStatus(reserveId).subscribe(res => {
            let rs = res.json();
            this.editRoomApplyModal.hide();
            this.dormitory_room_id = null;
            this.availableRoomList = null;
            this.search();
            this.processing = false;
        });
    }

    public openPickupModal() {
        this.pickUpModal.show();
    }

    public openPrintablesModal() {
        this.printablesModal.show();
    }

    public openCreateStudentModal() {
        this.createStudentsModal.show();
    }

    public openGroupAddModal() {
        this.groupAddModal.show();
    }

    public openCampAddModal() {
        this.campAddModal.show();
    }

    public downloadClassListFile() {
        this.processing = true;
        this.filterObj = {
            "passportName": this.passportName,
            "building": this.building,
            "studentStat": this.studentStat,
            "cntCode": this.cntCode,
            "checkIn": this.checkIn,
            "checkOut": this.checkOut,
            "currentPage": this.p,
            "paymentCheck": this.paymentCheck,
            "addDateFrom": this.addDateFrom,
            "addDateTo": this.addDateTo,
            "gradDateFrom": this.gradDateFrom,
            "gradDateTo": this.gradDateTo,
            "transferDate": this.transferDate,
            "searchCheckedList": this.checkedList.toString(),
        } as ApplySearchModel;
        this.applyService.downloadClassListFile(this.filterObj).delay(300).subscribe(
            res => {
                this.isModalShown = false;
                this.blobFile = res;
                this.pDownloadFile(res, "Super-Flash-List.xlsx");
                this.processing = false;
            },
            error => {
                this.isModalShown = false;
                if (error.status == 500) {
                    alert(error.statusText);
                }
                this.processing = false;
            }
        )
    }

    public downloadInvoiceListFile() {
        this.processing = true;
        this.filterObj = {
            "passportName": this.passportName,
            "building": this.building,
            "studentStat": this.studentStat,
            "cntCode": this.cntCode,
            "checkIn": this.checkIn,
            "checkOut": this.checkOut,
            "currentPage": this.p,
            "paymentCheck": this.paymentCheck,
            "addDateFrom": this.addDateFrom,
            "addDateTo": this.addDateTo,
            "gradDateFrom": this.gradDateFrom,
            "gradDateTo": this.gradDateTo,
            "transferDate": this.transferDate,
            "searchCheckedList": this.checkedList.toString(),
        } as ApplySearchModel;
        this.applyService.downloadInvoiceListFile(this.filterObj).delay(300).subscribe(
            res => {
                this.isModalShown = false;
                this.blobFile = res;
                this.pDownloadFile(res, "Invoice-List.xlsx");
                this.processing = false;
            },
            error => {
                this.isModalShown = false;
                if (error.status == 500) {
                    alert(error.statusText);
                }
                this.processing = false;
            }
        )
    }

    public downloadGAInvoiceListFile() {
        this.processing = true;
        this.filterObj = {
            "passportName": this.passportName,
            "building": this.building,
            "studentStat": this.studentStat,
            "cntCode": this.cntCode,
            "checkIn": this.checkIn,
            "checkOut": this.checkOut,
            "currentPage": this.p,
            "paymentCheck": this.paymentCheck,
            "addDateFrom": this.addDateFrom,
            "addDateTo": this.addDateTo,
            "gradDateFrom": this.gradDateFrom,
            "gradDateTo": this.gradDateTo,
            "transferDate": this.transferDate,
            "searchCheckedList": this.checkedList.toString(),
        } as ApplySearchModel;
        this.applyService.downloadGAInvoiceListFile(this.filterObj).delay(300).subscribe(
            res => {
                this.isModalShown = false;
                this.blobFile = res;
                this.pDownloadFile(res, "General-Affairs-Invoice-List.xlsx");
                this.processing = false;
            },
            error => {
                this.isModalShown = false;
                if (error.status == 500) {
                    alert(error.statusText);
                }
                this.processing = false;
            }
        )
    }

    public downloadPickUpFile() {
        this.processing = true;
        this.filterObj = {
            "passportName": this.passportName,
            "building": this.building,
            "studentStat": this.studentStat,
            "cntCode": this.cntCode,
            "checkIn": this.checkIn,
            "checkOut": this.checkOut,
            "currentPage": this.p,
            "paymentCheck": this.paymentCheck,
            "addDateFrom": this.addDateFrom,
            "addDateTo": this.addDateTo,
            "gradDateFrom": this.gradDateFrom,
            "gradDateTo": this.gradDateTo,
            "transferDate": this.transferDate,
            "searchCheckedList": this.checkedList.toString(),
        } as ApplySearchModel;
        this.applyService.downloadPickUpExcelFile(this.filterObj).delay(300).subscribe(
            res => {
                this.isModalShown = false;
                this.blobFile = res;
                this.pDownloadFile(res, "Pickup-Excel-List.xlsx");
                this.processing = false;
            },
            error => {
                this.isModalShown = false;
                if (error.status == 500) {
                    alert(error.statusText);
                }
                this.processing = false;
            }
        )
    }

    public downloadFile() {
        this.processing = true;
        this.filterObj = {
            "passportName": this.passportName,
            "building": this.building,
            "studentStat": this.studentStat,
            "cntCode": this.cntCode,
            "checkIn": this.checkIn,
            "checkOut": this.checkOut,
            "currentPage": this.p,
            "paymentCheck": this.paymentCheck,
            "addDateFrom": this.addDateFrom,
            "addDateTo": this.addDateTo,
            "gradDateFrom": this.gradDateFrom,
            "gradDateTo": this.gradDateTo,
            "transferDate": this.transferDate,
            "searchCheckedList": this.checkedList.toString(),
        } as ApplySearchModel;
        this.applyService.downloadExcelFile(this.filterObj).delay(300).subscribe(
            res => {
                this.isModalShown = false;
                this.blobFile = res;
                this.pDownloadFile(res, "Export-student-data.xlsx");
                this.processing = false;
            },
            error => {
                this.isModalShown = false;
                if (error.status == 500) {
                    alert(error.statusText);
                }
                this.processing = false;
            }
        )
    }

    public downloadFileCampTemplate() {
        this.processing = true;
        this.filterObj = {
        } as ApplySearchModel;
        this.applyService.downloadCampExcelFile(this.filterObj).delay(300).subscribe(
            res => {
                this.isModalShown = false;
                this.blobFile = res;
                this.pDownloadFile(res, "Camp-student-template.xlsx");
                this.processing = false;
            },
            error => {
                this.isModalShown = false;
                if (error.status == 500) {
                    alert(error.statusText);
                }
                this.processing = false;
            }
        )
    }

    uploadCampFile() {
        this.processing = true;
        if (this.file) {
            if (this.mimeType.indexOf(this.file.type) > -1) {
                this.isModalShown = true;
                this.applyService.uploadCampData(this.file).subscribe(
                    (res) => {
                        this.import_success = true;
                        this.isModalShown = false;
                        this.processing = false;
                        this.search();
                    },
                    (error) => {
                        this.import_success = false;
                        this.isModalShown = false;
                        this.processing = false;
                        let errors = error.json();
                        if (error.status === 400) {
                            if (errors.data && errors.data instanceof Array) {
                                this.error_data = errors;
                            } else if (errors) {
                                alert(this.error_code.file_type_invalid);
                            }

                        } else if (error.status === 500) {
                            alert('Server error 500');
                        }
                    }
                )
            } else {
                alert(this.error_code.file_type_invalid);
                this.processing = false;
            }
        } else {
            alert(this.error_code.import_file_required);
            this.processing = false;
        }
    }

    private pDownloadFile(blobData, fileName) {
        let a = $('<a id=\'downloadFile\' style=\'display: none;\'/>');
        let downloadUrl = null;

        if (this.detectIE() == false) {
            if (navigator.msSaveBlob) {
                downloadUrl = navigator.msSaveBlob(blobData, fileName);
            } else {
                downloadUrl = window.URL.createObjectURL(blobData);
            }

            a.attr('href', downloadUrl);
            a.attr('download', fileName);
            $('body').append(a);
            a[0].click();

            window.URL.revokeObjectURL(downloadUrl);
            a.remove();
        } else {
            window.navigator.msSaveOrOpenBlob(blobData, fileName);
        }
    }

    private convertToBE(frontEndModel: ExportFilterModel): ExportFilterModel {
        let backendModel = new ExportFilterModel();
        //backendModel.buildingId = frontEndModel.buildingId;
        backendModel.apply_no = frontEndModel.apply_no;
        backendModel.student_name = frontEndModel.student_name;
        backendModel.passport_name = frontEndModel.passport_name;
        backendModel.birthday = frontEndModel.birthday;
        backendModel.sex = frontEndModel.sex;
        backendModel.age = frontEndModel.age;

        backendModel.nationality = frontEndModel.nationality;
        backendModel.country_code = frontEndModel.country_code;
        backendModel.course = frontEndModel.course;
        backendModel.campus = frontEndModel.campus;
        backendModel.address = frontEndModel.address;
        backendModel.phone = frontEndModel.phone;

        backendModel.email = frontEndModel.email;
        backendModel.job = frontEndModel.job;
        backendModel.emergency_contact = frontEndModel.emergency_contact;
        backendModel.email_family = frontEndModel.email_family;
        backendModel.skype_id = frontEndModel.skype_id;
        backendModel.line_id = frontEndModel.line_id;

        backendModel.checkin_date = frontEndModel.checkin_date;
        backendModel.checkout_date = frontEndModel.checkout_date;


        return backendModel;
    }

    private validFilterModel() {
        let error: Array<string> = [];
        let dateTo = moment(this.saveDataLoadEvent.dateTo.jsdate);
        let dateFrom = moment(this.saveDataLoadEvent.dateFrom.jsdate);

        if (dateFrom.isAfter(dateTo)) {
            error.push(this.errorMessage.dateFromAfterDateTo);
        }

        return error;
    }


    public checkDateValidation(oldValue, event, type) {
        if (type == this.dateType.dateFrom) {
            let dateFrom = moment(event.jsdate);
            let dateTo = moment(this.saveDataLoadEvent.dateTo.jsdate)

            if (dateFrom.isSameOrBefore(dateTo)) {
                this.dateInvalid.dateFrom = false;
                this.dateInvalid.dateTo = false;
                this.saveDataLoadEvent.dateFrom = event;
            } else {
                this.dateInvalid.dateFrom = true;
                this.saveDataLoadEvent.dateFrom = oldValue;
            }
        } else {
            let dateFrom = moment(this.saveDataLoadEvent.dateFrom.jsdate);
            let dateTo = moment(event.jsdate)

            if (dateTo.isSameOrAfter(dateFrom)) {
                this.dateInvalid.dateFrom = false;
                this.dateInvalid.dateTo = false;
                this.saveDataLoadEvent.dateTo = event;
            } else {
                this.dateInvalid.dateTo = true;
                this.saveDataLoadEvent.dateTo = oldValue;
            }
        }
    }

    private detectIE() {
        var ua = window.navigator.userAgent;

        // Test values; Uncomment to check result …

        // IE 10
        // ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';

        // IE 11
        // ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';

        // Edge 12 (Spartan)
        // ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';

        // Edge 13
        // ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586';

        var msie = ua.indexOf('MSIE ');
        if (msie > 0) {
            // IE 10 or older => return version number
            return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
        }

        var trident = ua.indexOf('Trident/');
        if (trident > 0) {
            // IE 11 => return version number
            var rv = ua.indexOf('rv:');
            return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
        }

        var edge = ua.indexOf('Edge/');
        if (edge > 0) {
            // Edge (IE 12+) => return version number
            return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
        }

        // other browser
        return false;
    }

    updateChecked(option, event) {
        if(event.target.checked) {
            this.checkedList.push(option.id);
        } else {
            for(var i=0 ; i < this.list.length; i++) {
                if(this.checkedList[i] == option.id){
                    this.checkedList.splice(i,1);
                }
            }
        }
        console.log(this.checkedList);
    }

    onChangeDormitorySelection(event) {
        this.availableRoomList = null;
        this.countRestrictStudentDorm = null;
        this.countRestrictStudentOthers = null;
        this.countRestrictStudentWalkin = null;
        this.dormitory_room_id = null;
    }

    onChangeSelectYear(event) {
        this.numberOfTermsPerMOnthPerNation = null;
        this.loadNumberOfWeeks();
        this.weeksCountModal.show();
    }

    onChangeSelectEmptyBedCampus(event) {
        this.checkEmptyBedStayType = null;
        this.emptyBedsWeek = null;
    }

    onChangeSelectEmptyBedStay(event) {
        this.emptyBedsWeek = null;
    }

    onChangeSchoolSelection(event) {
        this.availableRoomList = null;
        this.countRestrictStudentDorm = null;
        this.countRestrictStudentOthers = null;
        this.countRestrictStudentWalkin = null;
        this.selectAccommodation = null;
        this.selectVisitorType = null;
        this.selectSearchFilter = null;
        this.dormitory_room_id = null;
    }

    onChangeGroupAddSelect(event) {
        this.studentGroupApply.groupAddHowMany = 1;
        if (this.studentGroupApply.selectGroupAddType == 2) {
            this.studentGroupApply.groupAddHowMany = 2;
        }
    }

    onChangeSelect(event) {
        if (event.srcElement) {
            this.file = event.srcElement.files[0];
            this.filePath = this._elementRef.nativeElement.querySelector('#upload-camp-file').value;
        } else {
            this.file = this._elementRef.nativeElement.querySelector('#upload-camp-file').files[0];
            this.filePath = this._elementRef.nativeElement.querySelector('#upload-camp-file').value;
        }
    }

    onChangeSelectPDF(event) {
        if (event.srcElement) {
            this.file = event.srcElement.files[0];
            this.filePath = this._elementRef.nativeElement.querySelector('#upload-pdf').value;
        } else {
            this.file = this._elementRef.nativeElement.querySelector('#upload-pdf').files[0];
            this.filePath = this._elementRef.nativeElement.querySelector('#upload-pdf').value;
        }
    }

    onChangeCountrySelection(event) {
        this.listCountPlan = null;
    }

    onChangeCafeCampus(event) {
        this.numberOfStudentsPerWeeksPerNationWithInternsGuardians = null;
    }

    onChangePlanSelection(event) {

    }


    uploadFile() {
        this.processing = true;
        if (this.file) {
            if (this.mimeType.indexOf(this.file.type) > -1) {
                this.isModalShown = true;
                this.applyService.uploadData(this.file).subscribe(
                    (res) => {
                        this.import_success = true;
                        this.isModalShown = false;
                        this.processing = false;
                        this.search();
                    },
                    (error) => {
                        this.import_success = false;
                        this.isModalShown = false;
                        this.processing = false;
                        let errors = error.json();
                        if (error.status === 400) {
                            if (errors.data && errors.data instanceof Array) {
                                this.error_data = errors;
                            } else if (errors) {
                                alert(this.error_code.file_type_invalid);
                            }

                        } else if (error.status === 500) {
                            alert('Server error 500');
                        }
                    }
                )
            } else {
                alert(this.error_code.file_type_invalid);
                this.processing = false;
            }
        } else {
            alert(this.error_code.import_file_required);
            this.processing = false;
        }
    }

    uploadHotelFile(hotelBookingId) {
        this.processing = true;
        if (this.file) {
            if (this.mimeTypeHotel.indexOf(this.file.type) > -1) {
                this.isModalShown = true;
                this.applyService.uploadHotelData(this.file, hotelBookingId).subscribe(
                    (res) => {
                        this.import_success = true;
                        this.isModalShown = false;
                        this.processing = false;
                        this.search();
                        this.editRoomApplyModal.hide();
                        this.dormitory_room_id = null;
                        this.availableRoomList = null;
                        this.countRestrictStudentDorm = null;
                        this.countRestrictStudentOthers = null;
                        this.countRestrictStudentWalkin = null;
                        this.selectAccommodation = null;
                        this.selectDormRoomType = null;
                        this.selectDormBldg = null;
                        this.import_success = false;
                    },
                    (error) => {
                        this.import_success = false;
                        this.isModalShown = false;
                        this.processing = false;
                        let errors = error.json();
                        if (error.status === 400) {
                            if (errors.data && errors.data instanceof Array) {
                                this.error_data = errors;
                            } else if (errors) {
                                alert(this.error_code.file_type_invalid);
                            }

                        } else if (error.status === 500) {
                            alert('Server error 500');
                        }
                    }
                )
            } else {
                alert(this.error_code.file_type_invalid);
                this.processing = false;
            }
        } else {
            alert(this.error_code.import_file_required);
            this.processing = false;
        }
    }

    downloadHotelFile(hotelBookingId, studentName) {
        this.processing = true;
        this.filterObj = {
            "passportName": this.passportName,
            "checkIn": this.checkIn,
            "checkOut": this.checkOut
        } as ApplySearchModel;
        this.applyService.downloadHotelData(this.filterObj, hotelBookingId).delay(300).subscribe(
            res => {
                this.isModalShown = false;
                this.blobFile = res;
                this.pDownloadFile(res, studentName + '_' + "Booking-File.pdf");
                this.processing = false;
            },
            error => {
                this.isModalShown = false;
                if (error.status == 500) {
                    alert(error.statusText);
                }
                this.processing = false;
            }
        )
    }

    removeHotelReserved(accommodationName, hotelBookingId, applyId) {
        this.applyService.removeHotelReserved(accommodationName, hotelBookingId, applyId).subscribe(res => {
            let rs = res.json();
            this.editRoomApplyModal.hide();
            this.dormitory_room_id = null;
            this.availableRoomList = null;
            this.countRestrictStudentDorm = null;
            this.countRestrictStudentOthers = null;
            this.countRestrictStudentWalkin = null;
            this.selectAccommodation = null;
            this.selectDormRoomType = null;
            this.selectDormBldg = null;
            this.search();
        });
    }


    onRoomSelectionChange(entry): void {
        this.studentApply.dormitory_room_name = entry;
    }

    //get countrycode values from json
    public getCountryCode() {
        this.applyService.getCntryCode().subscribe(data => { this.countryCodes = data; });
    }

    //get countrycode values from json
    public getCampusCode() {
        this.applyService.getCmpsCode().subscribe(data => { this.campusCodes = data; });
    }

    //get Stay types from json
    public getStaytypes() {
        this.applyService.getStaytypes().subscribe(data => { this.stayTypes = data; });
    }

    //get Stay types ITP from json
    public getStaytypesItp() {
        this.applyService.getStaytypesItp().subscribe(data => { this.stayTypesItp = data; });
    }

    //get Stay types SFC from json
    public getStaytypesSfc() {
        this.applyService.getStaytypesSfc().subscribe(data => { this.stayTypesSfc = data; });
    }

    //get Room types from json
    public getRoomtypes() {
        this.applyService.getRoomtypes().subscribe(data => { this.roomTypes = data; });
    }

    //get Room types Alba Uno  from json
    public getRoomTypesZ() {
        this.applyService.getRoomTypesZ().subscribe(data => { this.roomTypesZ = data; });
    }

    //get Room types Waterfront from json
    public getRoomTypesWF() {
        this.applyService.getRoomTypesWF().subscribe(data => { this.roomTypesWF = data; });
    }

    //get Room types Deluxe from json
    public getRoomTypesDX() {
        this.applyService.getRoomTypesDX().subscribe(data => { this.roomTypesDX = data; });
    }

    //get Room types Executive from json
    public getRoomTypesEX() {
        this.applyService.getRoomTypesEX().subscribe(data => { this.roomTypesEX = data; });
    }

    //get Plan types from json
    public getPlantypes() {
        this.applyService.getPlantypes().subscribe(data => { this.planTypes = data; });
    }

    //get Student status from json
    public getStudentstatus() {
        this.applyService.getStudentstatus().subscribe(data => { this.studentStatus = data; });
    }

    //get years
    public getYears() {
        this.applyService.getYears().subscribe((res) => { this.listOfYears = res.json(); });
    }

    public clearCheckedList() {
        this.checkedList = [];
        this.search();
    }

    public search() {
        this.filterObj = {
            "passportName": this.passportName,
            "building": this.building,
            "studentStat": this.studentStat,
            "cntCode": this.cntCode,
            "checkIn": this.checkIn,
            "checkOut": this.checkOut,
            "currentPage": this.p,
            "paymentCheck": this.paymentCheck,
            "addDateFrom": this.addDateFrom,
            "addDateTo": this.addDateTo,
            "gradDateFrom": this.gradDateFrom,
            "gradDateTo": this.gradDateTo,
            "transferDate": this.transferDate,
            "searchCheckedList": this.checkedList.toString(),
        } as ApplySearchModel;
        this.applyService.applyList(this.filterObj).subscribe((res) => {
            this.list = res.json().list.data;
            this.printTemplateList = res.json().printTemplateList.data;
            this.countAllList = res.json().list.total;
            this.perPage = res.json().list.per_page;
            this.currPage = res.json().list.current_page;
        });
    }

    public editApply(id) {
        this.saveEditId(id);
        this.loadPaymentsUnconfirmed(id);
        this.loadPaymentsConfirmed(id);
        this.getExtensionInvoiceFromStudentApply(id);
        if (id != 0) {
            this.getApply(id);
            this.applyService.changeLogList(id).subscribe((res) => {
                this.logList = res.json();
            });
        } else {
            this.studentApply = new StudentApplyModel();
        }
        this.editApplyModal.show();
    }

    public invoiceSend(invoiceId, applyId) {
        this.selectInvoice = null;
        if (invoiceId != 0) {
            //this.saveInvoiceDueDate(applyId, invoiceId); //automatic due_date is 3 weeks after creation of Invoice
            this.getApply(applyId);
            //this.getInvoiceFromStudentApply(applyId);
            this.getApplyInvoice(applyId, invoiceId);
            this.getInvoiceDiscountList(applyId, invoiceId);
            this.loadReservedRooms(applyId);
            this.loadCondoReservedRooms(applyId);
            this.loadHotelsReservedRooms(applyId);
            this.loadWalkinReservedRooms(applyId);
            this.loadReservedRoomsLogs(applyId);
            this.loadReservedHotels(applyId);
            this.loadCourses(applyId);
            this.loadCourseLogs(applyId);
        } else {
            this.studentApply = new StudentApplyModel();
            this.invoiceDiscountByPercentage = new InvoiceDiscountModel();
            this.invoiceDiscountByInput = new InvoiceDiscountModel();
        }
        this.sendInvoiceModal.show();
    }

    public editExtensionInvoice(id, invoiceId) {
        if (id != 0) {
            this.getApply(id);
            this.getExtensionInvoice(id, invoiceId);
        } else {
            this.extensionInvoice = new ExtensionInvoiceModel();
        }
        this.extensionInvoiceModal.show();
    }

    public editRefundInvoice(id, refundInvoiceId, originalInvoiceId) {
        if (id != 0) {
            this.getApply(id);
            this.getApplyInvoice(id, originalInvoiceId);
            this.getInvoiceDiscountList(id, originalInvoiceId);
            this.loadReservedRooms(id);
            this.loadCondoReservedRooms(id);
            this.loadHotelsReservedRooms(id);
            this.loadWalkinReservedRooms(id);
            this.loadReservedRoomsLogs(id);
            this.loadReservedHotels(id);
            this.loadCourses(id);
            this.loadCourseLogs(id);
            this.getRefundInvoice(id, refundInvoiceId);
        } else {
            this.refundInvoice = new RefundInvoiceModel();
        }
        this.refundInvoiceModal.show();
    }

    private getApply(id) {
        this.applyService.getApply(id).subscribe(
            res => {
                let cloneObj = _.clone(res.json());
                this.studentApply = cloneObj as StudentApplyModel;
                this.saveDataLoadEvent = {
                    birthday_date: this.setNgxDatepickerModel(new Date(this.studentApply.birthday)),
                    checkIn_date: this.setNgxDatepickerModel(new Date(this.studentApply.checkin_date)),
                    checkOut_date: this.setNgxDatepickerModel(new Date(this.studentApply.checkout_date)),
                    start_date: this.setNgxDatepickerModel(new Date(this.studentApply.entrance_date)),
                    graduate_date: this.setNgxDatepickerModel(new Date(this.studentApply.graduation_date)),
                    paid_date: this.setNgxDatepickerModel(this.studentApply.paid_date?new Date(this.studentApply.paid_date):this.getDayAWeekBeforeArrival(new Date(this.studentApply.checkin_date))),
                    due_date: this.setNgxDatepickerModel(this.invoiceModel.due_date?new Date(this.invoiceModel.due_date):new Date()),
                    arrive_date: this.setNgxDatepickerModel(new Date(this.studentApply.arrival_date)),
                    invoice_checkin: this.setNgxDatepickerModel(new Date(this.invoiceModel.checkin_date)),
                    invoice_checkout: this.setNgxDatepickerModel(new Date(this.invoiceModel.checkout_date)),
                    approved_date: this.setNgxDatepickerModel(this.invoiceModel.approved_date?new Date(this.invoiceModel.approved_date):new Date()),
                    departure_date: this.setNgxDatepickerModel(this.invoiceModel.departure_date?new Date(this.invoiceModel.departure_date):new Date(this.studentApply.checkout_date)),
                    sfctoitp_date: this.setNgxDatepickerModel(new Date(this.studentApply.sfc_to_itp)),
                    itptosfc_date: this.setNgxDatepickerModel(new Date(this.studentApply.itp_to_sfc)),
                    checkRoomFrom: this.setNgxDatepickerModel(this.getSunday(new Date())),
                    checkRoomFromStudents: this.setNgxDatepickerModel(this.getSunday(new Date())),
                    gradFrom: this.setNgxDatepickerModel(this.getMonday(new Date())),
                    changeRoomFrom: this.setNgxDatepickerModel(this.getSunday(new Date())),
                    changeRoomTo: this.setNgxDatepickerModel(this.getSaturday(new Date())),
                    changePlanFrom: this.setNgxDatepickerModel(this.getSunday(new Date())),
                    changePlanTo: this.setNgxDatepickerModel(this.getSaturday(new Date())),
                    countPlanFrom: this.setNgxDatepickerModel(this.getSunday(new Date())),
                    countPlanTo: this.setNgxDatepickerModel(this.getSaturday(new Date())),
                    checkEmptyBedFrom: this.setNgxDatepickerModel(this.getSunday(new Date())),
                    checkEmptyBedTo: this.setNgxDatepickerModel(this.getSaturday(new Date())),
                    cafeFrom: this.setNgxDatepickerModel(this.getSunday(new Date())),
                    cafeTo: this.setNgxDatepickerModel(this.getSaturday(new Date())),
                    weeklyFrom: this.setNgxDatepickerModel(this.getSunday(new Date())),
                    weeklyTo: this.setNgxDatepickerModel(this.getSaturday(new Date())),
                    salesFrom: this.setNgxDatepickerModel(this.getFirstdayOfTheMonth(new Date())),
                    campBookFrom: this.setNgxDatepickerModel(this.getFirstdayOfTheMonth(new Date())),
                    campBookTo: this.setNgxDatepickerModel(new Date()),
                    salesTo: this.setNgxDatepickerModel(new Date()),
                    groupAddCheckin: this.setNgxDatepickerModel(this.getSunday(new Date())),
                    groupAddCheckout: this.setNgxDatepickerModel(this.getSaturday(new Date())),
                    campAddCheckin: this.setNgxDatepickerModel(this.getSunday(new Date())),
                    campAddCheckout: this.setNgxDatepickerModel(this.getSaturday(new Date())),
                    campAddStartDate: this.setNgxDatepickerModel(this.getSunday(new Date())),
                    campAddGradDate: this.setNgxDatepickerModel(this.getSaturday(new Date())),
                    campAddBirthdate: this.setNgxDatepickerModel(new Date()),
                    campAddArrivalDate: this.setNgxDatepickerModel(new Date()),
                    campAddBirthdate2: this.setNgxDatepickerModel(new Date()),
                    campAddArrivalDate2: this.setNgxDatepickerModel(new Date()),
                    campAddBirthdate3: this.setNgxDatepickerModel(new Date()),
                    campAddArrivalDate3: this.setNgxDatepickerModel(new Date()),
                    selectCheckIn_date: this.setNgxDatepickerModel(new Date(this.studentApply.checkin_date)),
                    selectCheckOut_date: this.setNgxDatepickerModel(new Date(this.studentApply.checkout_date))
                };
                this.selectDormBldg = this.studentApply.building_id;
                this.selectAccommodation = this.studentApply.accommodation_id1;
                this.selectDormRoomType = this.studentApply.room_id1?this.studentApply.room_id1:'1';
                this.selectVisitorType = 1;
                this.selectSearchFilter = "1";
            })
    }

    private getApplyInvoice(applyId, invoiceId) {
        this.applyService.getApplyInvoice(applyId, invoiceId).subscribe(
            res => {
                let cloneObj = _.clone(res.json().data);
                this.studentApply = cloneObj as StudentApplyModel;
                let cloneObject = _.clone(res.json().invoiceInfo);
                this.invoiceModel = cloneObject as InvoiceModel;
                this.saveDataLoadEvent = {
                    birthday_date: this.setNgxDatepickerModel(new Date(this.studentApply.birthday)),
                    checkIn_date: this.setNgxDatepickerModel(new Date(this.studentApply.checkin_date)),
                    checkOut_date: this.setNgxDatepickerModel(new Date(this.studentApply.checkout_date)),
                    start_date: this.setNgxDatepickerModel(new Date(this.studentApply.entrance_date)),
                    graduate_date: this.setNgxDatepickerModel(new Date(this.studentApply.graduation_date)),
                    paid_date: this.setNgxDatepickerModel(this.studentApply.paid_date?new Date(this.studentApply.paid_date):this.getDayAWeekBeforeArrival(new Date(this.studentApply.checkin_date))),
                    due_date: this.setNgxDatepickerModel(this.invoiceModel.due_date?new Date(this.invoiceModel.due_date):new Date()),
                    arrive_date: this.setNgxDatepickerModel(new Date(this.studentApply.arrival_date)),
                    invoice_checkin: this.setNgxDatepickerModel(new Date(this.invoiceModel.checkin_date)),
                    invoice_checkout: this.setNgxDatepickerModel(new Date(this.invoiceModel.checkout_date)),
                    approved_date: this.setNgxDatepickerModel(this.invoiceModel.approved_date?new Date(this.invoiceModel.approved_date):new Date()),
                    departure_date: this.setNgxDatepickerModel(this.invoiceModel.departure_date?new Date(this.invoiceModel.departure_date):new Date(this.studentApply.checkout_date)),
                    sfctoitp_date: this.setNgxDatepickerModel(new Date(this.studentApply.sfc_to_itp)),
                    itptosfc_date: this.setNgxDatepickerModel(new Date(this.studentApply.itp_to_sfc)),
                    checkRoomFrom: this.setNgxDatepickerModel(this.getSunday(new Date())),
                    checkRoomFromStudents: this.setNgxDatepickerModel(this.getSunday(new Date())),
                    gradFrom: this.setNgxDatepickerModel(this.getMonday(new Date())),
                    changeRoomFrom: this.setNgxDatepickerModel(this.getSunday(new Date())),
                    changeRoomTo: this.setNgxDatepickerModel(this.getSaturday(new Date())),
                    changePlanFrom: this.setNgxDatepickerModel(this.getSunday(new Date())),
                    changePlanTo: this.setNgxDatepickerModel(this.getSaturday(new Date())),
                    countPlanFrom: this.setNgxDatepickerModel(this.getSunday(new Date())),
                    countPlanTo: this.setNgxDatepickerModel(this.getSaturday(new Date())),
                    checkEmptyBedFrom: this.setNgxDatepickerModel(this.getSunday(new Date())),
                    checkEmptyBedTo: this.setNgxDatepickerModel(this.getSaturday(new Date())),
                    groupAddCheckin: this.setNgxDatepickerModel(this.getSunday(new Date())),
                    groupAddCheckout: this.setNgxDatepickerModel(this.getSaturday(new Date())),
                    campAddCheckin: this.setNgxDatepickerModel(this.getSunday(new Date())),
                    campAddCheckout: this.setNgxDatepickerModel(this.getSaturday(new Date())),
                    campAddStartDate: this.setNgxDatepickerModel(this.getSunday(new Date())),
                    campAddGradDate: this.setNgxDatepickerModel(this.getSaturday(new Date())),
                    campAddBirthdate: this.setNgxDatepickerModel(new Date()),
                    campAddArrivalDate: this.setNgxDatepickerModel(new Date()),
                    campAddBirthdate2: this.setNgxDatepickerModel(new Date()),
                    campAddArrivalDate2: this.setNgxDatepickerModel(new Date()),
                    campAddBirthdate3: this.setNgxDatepickerModel(new Date()),
                    campAddArrivalDate3: this.setNgxDatepickerModel(new Date()),
                    cafeFrom: this.setNgxDatepickerModel(this.getSunday(new Date())),
                    cafeTo: this.setNgxDatepickerModel(this.getSaturday(new Date())),
                    weeklyFrom: this.setNgxDatepickerModel(this.getSunday(new Date())),
                    weeklyTo: this.setNgxDatepickerModel(this.getSaturday(new Date())),
                    salesFrom: this.setNgxDatepickerModel(this.getFirstdayOfTheMonth(new Date())),
                    campBookFrom: this.setNgxDatepickerModel(this.getFirstdayOfTheMonth(new Date())),
                    campBookTo: this.setNgxDatepickerModel(new Date()),
                    salesTo: this.setNgxDatepickerModel(new Date()),
                    selectCheckIn_date: this.setNgxDatepickerModel(new Date(this.studentApply.checkin_date)),
                    selectCheckOut_date: this.setNgxDatepickerModel(new Date(this.studentApply.checkout_date))
                };
                this.phRateInvoice = res.json().phTuitionFee;

            })
    }

    private getExtensionInvoiceFromStudentApply(applyId) {
        this.applyService.getExtenionInvoice(applyId).subscribe(
            res => {
                let cloneObj = _.clone(res.json());
                this.extensionInvoice = cloneObj as ExtensionInvoiceModel;
                this.saveDataLoadEvent = {
                    selectCheckIn_date: this.setNgxDatepickerModel(new Date(this.extensionInvoice.ext_checkin_date ?
                        this.extensionInvoice.ext_checkin_date : this.studentApply.checkin_date)),
                    selectCheckOut_date: this.setNgxDatepickerModel(new Date(this.extensionInvoice.ext_checkout_date ?
                        this.extensionInvoice.ext_checkout_date : this.studentApply.checkout_date)),
                    birthday_date: this.setNgxDatepickerModel(new Date(this.studentApply.birthday)),
                    dateFrom: this.setNgxDatepickerModel(new Date(this.studentApply.checkin_date)),
                    dateTo: this.setNgxDatepickerModel(new Date(this.studentApply.checkout_date)),
                    checkRoomFrom: this.setNgxDatepickerModel(this.getSunday(new Date())),
                    checkRoomFromStudents: this.setNgxDatepickerModel(this.getSunday(new Date())),
                    gradFrom: this.setNgxDatepickerModel(this.getMonday(new Date())),
                    changeRoomFrom: this.setNgxDatepickerModel(this.getSunday(new Date())),
                    changeRoomTo: this.setNgxDatepickerModel(this.getSaturday(new Date())),
                    changePlanFrom: this.setNgxDatepickerModel(this.getSunday(new Date())),
                    changePlanTo: this.setNgxDatepickerModel(this.getSaturday(new Date())),
                    countPlanFrom: this.setNgxDatepickerModel(this.getSunday(new Date())),
                    countPlanTo: this.setNgxDatepickerModel(this.getSaturday(new Date())),
                    checkEmptyBedFrom: this.setNgxDatepickerModel(this.getSunday(new Date())),
                    checkEmptyBedTo: this.setNgxDatepickerModel(this.getSaturday(new Date())),
                    cafeFrom: this.setNgxDatepickerModel(this.getSunday(new Date())),
                    cafeTo: this.setNgxDatepickerModel(this.getSaturday(new Date())),
                    weeklyFrom: this.setNgxDatepickerModel(this.getSunday(new Date())),
                    weeklyTo: this.setNgxDatepickerModel(this.getSaturday(new Date())),
                    salesFrom: this.setNgxDatepickerModel(this.getFirstdayOfTheMonth(new Date())),
                    campBookFrom: this.setNgxDatepickerModel(this.getFirstdayOfTheMonth(new Date())),
                    campBookTo: this.setNgxDatepickerModel(new Date()),
                    salesTo: this.setNgxDatepickerModel(new Date()),
                    groupAddCheckin: this.setNgxDatepickerModel(this.getSunday(new Date())),
                    groupAddCheckout: this.setNgxDatepickerModel(this.getSaturday(new Date())),
                    campAddCheckin: this.setNgxDatepickerModel(this.getSunday(new Date())),
                    campAddCheckout: this.setNgxDatepickerModel(this.getSaturday(new Date())),
                    campAddStartDate: this.setNgxDatepickerModel(this.getSunday(new Date())),
                    campAddGradDate: this.setNgxDatepickerModel(this.getSaturday(new Date())),
                    campAddBirthdate: this.setNgxDatepickerModel(new Date()),
                    campAddArrivalDate: this.setNgxDatepickerModel(new Date()),
                    campAddBirthdate2: this.setNgxDatepickerModel(new Date()),
                    campAddArrivalDate2: this.setNgxDatepickerModel(new Date()),
                    campAddBirthdate3: this.setNgxDatepickerModel(new Date()),
                    sfctoitp_date: this.setNgxDatepickerModel(new Date(this.studentApply.sfc_to_itp)),
                    itptosfc_date: this.setNgxDatepickerModel(new Date(this.studentApply.itp_to_sfc)),
                    campAddArrivalDate3: this.setNgxDatepickerModel(new Date()),
                    checkIn_date: this.setNgxDatepickerModel(new Date(this.studentApply.checkin_date)),
                    checkOut_date: this.setNgxDatepickerModel(new Date(this.studentApply.checkout_date)),
                    start_date: this.setNgxDatepickerModel(new Date(this.studentApply.entrance_date)),
                    graduate_date: this.setNgxDatepickerModel(new Date(this.studentApply.graduation_date)),
                    paid_date: this.setNgxDatepickerModel(this.studentApply.paid_date?new Date(this.studentApply.paid_date):this.getDayAWeekBeforeArrival(new Date(this.studentApply.checkin_date))),
                    due_date: this.setNgxDatepickerModel(this.invoiceModel.due_date?new Date(this.invoiceModel.due_date):new Date()),
                    arrive_date: this.setNgxDatepickerModel(new Date(this.studentApply.arrival_date)),
                    invoice_checkin: this.setNgxDatepickerModel(new Date(this.invoiceModel.checkin_date)),
                    invoice_checkout: this.setNgxDatepickerModel(new Date(this.invoiceModel.checkout_date)),
                    approved_date: this.setNgxDatepickerModel(this.invoiceModel.approved_date?new Date(this.invoiceModel.approved_date):new Date()),
                    departure_date: this.setNgxDatepickerModel(this.invoiceModel.departure_date?new Date(this.invoiceModel.departure_date):new Date(this.studentApply.checkout_date)),
                };
            })


        this.applyService.getExtenionInvoicePhpRate(applyId).subscribe((res) => {
            this.phRateInvoice = res.json();
        });
    }


    private getRefundInvoiceFromStudentApply(applyId) {
        this.applyService.getRefundInvoice(applyId).subscribe(
            res => {
                let cloneObj = _.clone(res.json());
                this.refundInvoice = cloneObj as RefundInvoiceModel;
                this.saveDataLoadEvent = {
                    selectCheckIn_date: this.setNgxDatepickerModel(new Date(this.refundInvoice.rfd_checkin_date ?
                        this.refundInvoice.rfd_checkin_date : this.studentApply.checkin_date)),
                    selectCheckOut_date: this.setNgxDatepickerModel(new Date(this.refundInvoice.rfd_checkout_date ?
                        this.refundInvoice.rfd_checkout_date : this.studentApply.checkout_date)),
                    birthday_date: this.setNgxDatepickerModel(new Date(this.studentApply.birthday)),
                    dateFrom: this.setNgxDatepickerModel(new Date(this.studentApply.checkin_date)),
                    dateTo: this.setNgxDatepickerModel(new Date(this.studentApply.checkout_date)),
                    checkRoomFrom: this.setNgxDatepickerModel(this.getSunday(new Date())),
                    checkRoomFromStudents: this.setNgxDatepickerModel(this.getSunday(new Date())),
                    gradFrom: this.setNgxDatepickerModel(this.getMonday(new Date())),
                    changeRoomFrom: this.setNgxDatepickerModel(this.getSunday(new Date())),
                    changeRoomTo: this.setNgxDatepickerModel(this.getSaturday(new Date())),
                    changePlanFrom: this.setNgxDatepickerModel(this.getSunday(new Date())),
                    changePlanTo: this.setNgxDatepickerModel(this.getSaturday(new Date())),
                    countPlanFrom: this.setNgxDatepickerModel(this.getSunday(new Date())),
                    countPlanTo: this.setNgxDatepickerModel(this.getSaturday(new Date())),
                    checkEmptyBedFrom: this.setNgxDatepickerModel(this.getSunday(new Date())),
                    checkEmptyBedTo: this.setNgxDatepickerModel(this.getSaturday(new Date())),
                    cafeFrom: this.setNgxDatepickerModel(this.getSunday(new Date())),
                    cafeTo: this.setNgxDatepickerModel(this.getSaturday(new Date())),
                    weeklyFrom: this.setNgxDatepickerModel(this.getSunday(new Date())),
                    weeklyTo: this.setNgxDatepickerModel(this.getSaturday(new Date())),
                    salesFrom: this.setNgxDatepickerModel(this.getFirstdayOfTheMonth(new Date())),
                    campBookFrom: this.setNgxDatepickerModel(this.getFirstdayOfTheMonth(new Date())),
                    campBookTo: this.setNgxDatepickerModel(new Date()),
                    salesTo: this.setNgxDatepickerModel(new Date()),
                    groupAddCheckin: this.setNgxDatepickerModel(this.getSunday(new Date())),
                    groupAddCheckout: this.setNgxDatepickerModel(this.getSaturday(new Date())),
                    campAddCheckin: this.setNgxDatepickerModel(this.getSunday(new Date())),
                    campAddCheckout: this.setNgxDatepickerModel(this.getSaturday(new Date())),
                    campAddStartDate: this.setNgxDatepickerModel(this.getSunday(new Date())),
                    campAddGradDate: this.setNgxDatepickerModel(this.getSaturday(new Date())),
                    campAddBirthdate: this.setNgxDatepickerModel(new Date()),
                    campAddArrivalDate: this.setNgxDatepickerModel(new Date()),
                    campAddBirthdate2: this.setNgxDatepickerModel(new Date()),
                    campAddArrivalDate2: this.setNgxDatepickerModel(new Date()),
                    campAddBirthdate3: this.setNgxDatepickerModel(new Date()),
                    sfctoitp_date: this.setNgxDatepickerModel(new Date(this.studentApply.sfc_to_itp)),
                    itptosfc_date: this.setNgxDatepickerModel(new Date(this.studentApply.itp_to_sfc)),
                    campAddArrivalDate3: this.setNgxDatepickerModel(new Date()),
                    checkIn_date: this.setNgxDatepickerModel(new Date(this.studentApply.checkin_date)),
                    checkOut_date: this.setNgxDatepickerModel(new Date(this.studentApply.checkout_date)),
                    start_date: this.setNgxDatepickerModel(new Date(this.studentApply.entrance_date)),
                    graduate_date: this.setNgxDatepickerModel(new Date(this.studentApply.graduation_date)),
                    paid_date: this.setNgxDatepickerModel(this.studentApply.paid_date?new Date(this.studentApply.paid_date):this.getDayAWeekBeforeArrival(new Date(this.studentApply.checkin_date))),
                    due_date: this.setNgxDatepickerModel(this.invoiceModel.due_date?new Date(this.invoiceModel.due_date):new Date()),
                    arrive_date: this.setNgxDatepickerModel(new Date(this.studentApply.arrival_date)),
                    invoice_checkin: this.setNgxDatepickerModel(new Date(this.invoiceModel.checkin_date)),
                    invoice_checkout: this.setNgxDatepickerModel(new Date(this.invoiceModel.checkout_date)),
                    approved_date: this.setNgxDatepickerModel(this.invoiceModel.approved_date?new Date(this.invoiceModel.approved_date):new Date()),
                    departure_date: this.setNgxDatepickerModel(this.invoiceModel.departure_date?new Date(this.invoiceModel.departure_date):new Date(this.studentApply.checkout_date)),
                };
            })


        this.applyService.getRefundInvoicePhpRate(applyId).subscribe((res) => {
            this.phRateInvoice = res.json();
        });
    }


    private getInvoiceFromStudentApply(applyId) {
        this.applyService.getInvoice(applyId).subscribe(
            res => {
                let cloneObj = _.clone(res.json());
                this.invoiceModel = cloneObj as InvoiceModel;
                this.saveDataLoadEvent = {
                    selectCheckIn_date: this.setNgxDatepickerModel(new Date(this.invoiceModel.checkin_date ?
                        this.invoiceModel.checkin_date : this.studentApply.checkin_date)),
                    selectCheckOut_date: this.setNgxDatepickerModel(new Date(this.invoiceModel.checkout_date ?
                        this.invoiceModel.checkout_date : this.studentApply.checkout_date)),
                    birthday_date: this.setNgxDatepickerModel(new Date(this.studentApply.birthday)),
                    dateFrom: this.setNgxDatepickerModel(new Date(this.studentApply.checkin_date)),
                    dateTo: this.setNgxDatepickerModel(new Date(this.studentApply.checkout_date)),
                    checkRoomFrom: this.setNgxDatepickerModel(this.getSunday(new Date())),
                    checkRoomFromStudents: this.setNgxDatepickerModel(this.getSunday(new Date())),
                    gradFrom: this.setNgxDatepickerModel(this.getMonday(new Date())),
                    changeRoomFrom: this.setNgxDatepickerModel(this.getSunday(new Date())),
                    changeRoomTo: this.setNgxDatepickerModel(this.getSaturday(new Date())),
                    changePlanFrom: this.setNgxDatepickerModel(this.getSunday(new Date())),
                    changePlanTo: this.setNgxDatepickerModel(this.getSaturday(new Date())),
                    countPlanFrom: this.setNgxDatepickerModel(this.getSunday(new Date())),
                    countPlanTo: this.setNgxDatepickerModel(this.getSaturday(new Date())),
                    checkEmptyBedFrom: this.setNgxDatepickerModel(this.getSunday(new Date())),
                    checkEmptyBedTo: this.setNgxDatepickerModel(this.getSaturday(new Date())),
                    cafeFrom: this.setNgxDatepickerModel(this.getSunday(new Date())),
                    cafeTo: this.setNgxDatepickerModel(this.getSaturday(new Date())),
                    weeklyFrom: this.setNgxDatepickerModel(this.getSunday(new Date())),
                    weeklyTo: this.setNgxDatepickerModel(this.getSaturday(new Date())),
                    salesFrom: this.setNgxDatepickerModel(this.getFirstdayOfTheMonth(new Date())),
                    campBookFrom: this.setNgxDatepickerModel(this.getFirstdayOfTheMonth(new Date())),
                    campBookTo: this.setNgxDatepickerModel(new Date()),
                    salesTo: this.setNgxDatepickerModel(new Date()),
                    groupAddCheckin: this.setNgxDatepickerModel(this.getSunday(new Date())),
                    groupAddCheckout: this.setNgxDatepickerModel(this.getSaturday(new Date())),
                    campAddCheckin: this.setNgxDatepickerModel(this.getSunday(new Date())),
                    campAddCheckout: this.setNgxDatepickerModel(this.getSaturday(new Date())),
                    campAddStartDate: this.setNgxDatepickerModel(this.getSunday(new Date())),
                    campAddGradDate: this.setNgxDatepickerModel(this.getSaturday(new Date())),
                    campAddBirthdate: this.setNgxDatepickerModel(new Date()),
                    campAddArrivalDate: this.setNgxDatepickerModel(new Date()),
                    campAddBirthdate2: this.setNgxDatepickerModel(new Date()),
                    campAddArrivalDate2: this.setNgxDatepickerModel(new Date()),
                    campAddBirthdate3: this.setNgxDatepickerModel(new Date()),
                    sfctoitp_date: this.setNgxDatepickerModel(new Date(this.studentApply.sfc_to_itp)),
                    itptosfc_date: this.setNgxDatepickerModel(new Date(this.studentApply.itp_to_sfc)),
                    campAddArrivalDate3: this.setNgxDatepickerModel(new Date()),
                    checkIn_date: this.setNgxDatepickerModel(new Date(this.studentApply.checkin_date)),
                    checkOut_date: this.setNgxDatepickerModel(new Date(this.studentApply.checkout_date)),
                    start_date: this.setNgxDatepickerModel(new Date(this.studentApply.entrance_date)),
                    graduate_date: this.setNgxDatepickerModel(new Date(this.studentApply.graduation_date)),
                    paid_date: this.setNgxDatepickerModel(this.studentApply.paid_date?new Date(this.studentApply.paid_date):this.getDayAWeekBeforeArrival(new Date(this.studentApply.checkin_date))),
                    due_date: this.setNgxDatepickerModel(this.invoiceModel.due_date?new Date(this.invoiceModel.due_date):new Date()),
                    arrive_date: this.setNgxDatepickerModel(new Date(this.studentApply.arrival_date)),
                    invoice_checkin: this.setNgxDatepickerModel(new Date(this.invoiceModel.checkin_date)),
                    invoice_checkout: this.setNgxDatepickerModel(new Date(this.invoiceModel.checkout_date)),
                    approved_date: this.setNgxDatepickerModel(this.invoiceModel.approved_date?new Date(this.invoiceModel.approved_date):new Date()),
                    departure_date: this.setNgxDatepickerModel(this.invoiceModel.departure_date?new Date(this.invoiceModel.departure_date):new Date(this.studentApply.checkout_date)),
                };
            })


        this.applyService.getInvoicePhpRate(applyId).subscribe((res) => {
            this.phRateInvoice = res.json();
        });
    }

    private getExtensionInvoice(applyId,invoiceId) {
        this.getInvoiceDiscountList(applyId, invoiceId);
        this.applyService.getExtenionInvoice(applyId).subscribe(
            res => {
                let cloneObj = _.clone(res.json());
                this.extensionInvoice = cloneObj as ExtensionInvoiceModel;
                this.saveDataLoadEvent = {
                    selectCheckIn_date: this.setNgxDatepickerModel(new Date(this.extensionInvoice.ext_checkin_date ?
                        this.extensionInvoice.ext_checkin_date : this.studentApply.checkin_date)),
                    selectCheckOut_date: this.setNgxDatepickerModel(new Date(this.extensionInvoice.ext_checkout_date ?
                        this.extensionInvoice.ext_checkout_date : this.studentApply.checkout_date)),
                    birthday_date: this.setNgxDatepickerModel(new Date(this.studentApply.birthday)),
                    dateFrom: this.setNgxDatepickerModel(new Date(this.studentApply.checkin_date)),
                    dateTo: this.setNgxDatepickerModel(new Date(this.studentApply.checkout_date)),
                    checkRoomFrom: this.setNgxDatepickerModel(this.getSunday(new Date())),
                    checkRoomFromStudents: this.setNgxDatepickerModel(this.getSunday(new Date())),
                    gradFrom: this.setNgxDatepickerModel(this.getMonday(new Date())),
                    changeRoomFrom: this.setNgxDatepickerModel(this.getSunday(new Date())),
                    changeRoomTo: this.setNgxDatepickerModel(this.getSaturday(new Date())),
                    changePlanFrom: this.setNgxDatepickerModel(this.getSunday(new Date())),
                    changePlanTo: this.setNgxDatepickerModel(this.getSaturday(new Date())),
                    countPlanFrom: this.setNgxDatepickerModel(this.getSunday(new Date())),
                    countPlanTo: this.setNgxDatepickerModel(this.getSaturday(new Date())),
                    checkEmptyBedFrom: this.setNgxDatepickerModel(this.getSunday(new Date())),
                    checkEmptyBedTo: this.setNgxDatepickerModel(this.getSaturday(new Date())),
                    cafeFrom: this.setNgxDatepickerModel(this.getSunday(new Date())),
                    cafeTo: this.setNgxDatepickerModel(this.getSaturday(new Date())),
                    weeklyFrom: this.setNgxDatepickerModel(this.getSunday(new Date())),
                    weeklyTo: this.setNgxDatepickerModel(this.getSaturday(new Date())),
                    salesFrom: this.setNgxDatepickerModel(this.getFirstdayOfTheMonth(new Date())),
                    campBookFrom: this.setNgxDatepickerModel(this.getFirstdayOfTheMonth(new Date())),
                    campBookTo: this.setNgxDatepickerModel(new Date()),
                    salesTo: this.setNgxDatepickerModel(new Date()),
                    groupAddCheckin: this.setNgxDatepickerModel(this.getSunday(new Date())),
                    groupAddCheckout: this.setNgxDatepickerModel(this.getSaturday(new Date())),
                    campAddCheckin: this.setNgxDatepickerModel(this.getSunday(new Date())),
                    campAddCheckout: this.setNgxDatepickerModel(this.getSaturday(new Date())),
                    campAddStartDate: this.setNgxDatepickerModel(this.getSunday(new Date())),
                    campAddGradDate: this.setNgxDatepickerModel(this.getSaturday(new Date())),
                    campAddBirthdate: this.setNgxDatepickerModel(new Date()),
                    campAddArrivalDate: this.setNgxDatepickerModel(new Date()),
                    campAddBirthdate2: this.setNgxDatepickerModel(new Date()),
                    campAddArrivalDate2: this.setNgxDatepickerModel(new Date()),
                    campAddBirthdate3: this.setNgxDatepickerModel(new Date()),
                    sfctoitp_date: this.setNgxDatepickerModel(new Date(this.studentApply.sfc_to_itp)),
                    itptosfc_date: this.setNgxDatepickerModel(new Date(this.studentApply.itp_to_sfc)),
                    campAddArrivalDate3: this.setNgxDatepickerModel(new Date()),
                    checkIn_date: this.setNgxDatepickerModel(new Date(this.studentApply.checkin_date)),
                    checkOut_date: this.setNgxDatepickerModel(new Date(this.studentApply.checkout_date)),
                    start_date: this.setNgxDatepickerModel(new Date(this.studentApply.entrance_date)),
                    graduate_date: this.setNgxDatepickerModel(new Date(this.studentApply.graduation_date)),
                    paid_date: this.setNgxDatepickerModel(this.studentApply.paid_date?new Date(this.studentApply.paid_date):this.getDayAWeekBeforeArrival(new Date(this.studentApply.checkin_date))),
                    due_date: this.setNgxDatepickerModel(this.invoiceModel.due_date?new Date(this.invoiceModel.due_date):new Date()),
                    arrive_date: this.setNgxDatepickerModel(new Date(this.studentApply.arrival_date)),
                    invoice_checkin: this.setNgxDatepickerModel(new Date(this.invoiceModel.checkin_date)),
                    invoice_checkout: this.setNgxDatepickerModel(new Date(this.invoiceModel.checkout_date)),
                    approved_date: this.setNgxDatepickerModel(this.invoiceModel.approved_date?new Date(this.invoiceModel.approved_date):new Date()),
                    departure_date: this.setNgxDatepickerModel(this.invoiceModel.departure_date?new Date(this.invoiceModel.departure_date):new Date(this.studentApply.checkout_date)),
                };
            })

        this.applyService.getExtenionInvoicePhpRate(applyId).subscribe((res) => {
            this.phRateInvoice = res.json();
        });
    }

    private getRefundInvoice(applyId,invoiceId) {
        this.getRefundDiscountList(applyId, invoiceId);
        this.applyService.getRefundInvoice(applyId).subscribe(
            res => {
                let cloneObj = _.clone(res.json());
                this.refundInvoice = cloneObj as RefundInvoiceModel;
                this.saveDataLoadEvent = {
                    selectCheckIn_date: this.setNgxDatepickerModel(new Date(this.refundInvoice.rfd_checkin_date ?
                        this.refundInvoice.rfd_checkin_date : this.studentApply.checkin_date)),
                    selectCheckOut_date: this.setNgxDatepickerModel(new Date(this.refundInvoice.rfd_checkout_date ?
                        this.refundInvoice.rfd_checkout_date : this.studentApply.checkout_date)),
                    birthday_date: this.setNgxDatepickerModel(new Date(this.studentApply.birthday)),
                    dateFrom: this.setNgxDatepickerModel(new Date(this.studentApply.checkin_date)),
                    dateTo: this.setNgxDatepickerModel(new Date(this.studentApply.checkout_date)),
                    checkRoomFrom: this.setNgxDatepickerModel(this.getSunday(new Date())),
                    checkRoomFromStudents: this.setNgxDatepickerModel(this.getSunday(new Date())),
                    gradFrom: this.setNgxDatepickerModel(this.getMonday(new Date())),
                    changeRoomFrom: this.setNgxDatepickerModel(this.getSunday(new Date())),
                    changeRoomTo: this.setNgxDatepickerModel(this.getSaturday(new Date())),
                    changePlanFrom: this.setNgxDatepickerModel(this.getSunday(new Date())),
                    changePlanTo: this.setNgxDatepickerModel(this.getSaturday(new Date())),
                    countPlanFrom: this.setNgxDatepickerModel(this.getSunday(new Date())),
                    countPlanTo: this.setNgxDatepickerModel(this.getSaturday(new Date())),
                    checkEmptyBedFrom: this.setNgxDatepickerModel(this.getSunday(new Date())),
                    checkEmptyBedTo: this.setNgxDatepickerModel(this.getSaturday(new Date())),
                    cafeFrom: this.setNgxDatepickerModel(this.getSunday(new Date())),
                    cafeTo: this.setNgxDatepickerModel(this.getSaturday(new Date())),
                    weeklyFrom: this.setNgxDatepickerModel(this.getSunday(new Date())),
                    weeklyTo: this.setNgxDatepickerModel(this.getSaturday(new Date())),
                    salesFrom: this.setNgxDatepickerModel(this.getFirstdayOfTheMonth(new Date())),
                    campBookFrom: this.setNgxDatepickerModel(this.getFirstdayOfTheMonth(new Date())),
                    campBookTo: this.setNgxDatepickerModel(new Date()),
                    salesTo: this.setNgxDatepickerModel(new Date()),
                    groupAddCheckin: this.setNgxDatepickerModel(this.getSunday(new Date())),
                    groupAddCheckout: this.setNgxDatepickerModel(this.getSaturday(new Date())),
                    campAddCheckin: this.setNgxDatepickerModel(this.getSunday(new Date())),
                    campAddCheckout: this.setNgxDatepickerModel(this.getSaturday(new Date())),
                    campAddStartDate: this.setNgxDatepickerModel(this.getSunday(new Date())),
                    campAddGradDate: this.setNgxDatepickerModel(this.getSaturday(new Date())),
                    campAddBirthdate: this.setNgxDatepickerModel(new Date()),
                    campAddArrivalDate: this.setNgxDatepickerModel(new Date()),
                    campAddBirthdate2: this.setNgxDatepickerModel(new Date()),
                    campAddArrivalDate2: this.setNgxDatepickerModel(new Date()),
                    campAddBirthdate3: this.setNgxDatepickerModel(new Date()),
                    sfctoitp_date: this.setNgxDatepickerModel(new Date(this.studentApply.sfc_to_itp)),
                    itptosfc_date: this.setNgxDatepickerModel(new Date(this.studentApply.itp_to_sfc)),
                    campAddArrivalDate3: this.setNgxDatepickerModel(new Date()),
                    checkIn_date: this.setNgxDatepickerModel(new Date(this.studentApply.checkin_date)),
                    checkOut_date: this.setNgxDatepickerModel(new Date(this.studentApply.checkout_date)),
                    start_date: this.setNgxDatepickerModel(new Date(this.studentApply.entrance_date)),
                    graduate_date: this.setNgxDatepickerModel(new Date(this.studentApply.graduation_date)),
                    paid_date: this.setNgxDatepickerModel(this.studentApply.paid_date?new Date(this.studentApply.paid_date):this.getDayAWeekBeforeArrival(new Date(this.studentApply.checkin_date))),
                    due_date: this.setNgxDatepickerModel(this.invoiceModel.due_date?new Date(this.invoiceModel.due_date):new Date()),
                    arrive_date: this.setNgxDatepickerModel(new Date(this.studentApply.arrival_date)),
                    invoice_checkin: this.setNgxDatepickerModel(new Date(this.invoiceModel.checkin_date)),
                    invoice_checkout: this.setNgxDatepickerModel(new Date(this.invoiceModel.checkout_date)),
                    approved_date: this.setNgxDatepickerModel(this.invoiceModel.approved_date?new Date(this.invoiceModel.approved_date):new Date()),
                    departure_date: this.setNgxDatepickerModel(this.invoiceModel.departure_date?new Date(this.invoiceModel.departure_date):new Date(this.studentApply.checkout_date)),
                };
            })

        this.applyService.getRefundInvoicePhpRate(applyId).subscribe((res) => {
            this.phRateInvoice = res.json();
        });
    }

    private getInvoiceDiscountList(applyId, invoiceId) {
        this.applyService.getInvoiceDiscountList(applyId, invoiceId).subscribe((res) => {
            this.invoiceDiscountList = res.json();
        });
    }

    private getRefundDiscountList(applyId, invoiceId) {
        this.applyService.getInvoiceDiscountList(applyId, invoiceId).subscribe((res) => {
            this.refundDiscountList = res.json();
        });
    }

    public statusChange(){
        this.processing = true;
        this.applyService.updateMultipleStudentStatus(this.checkedList,this.changeStudentStat).subscribe(
            res => {
                let rs = res.json();
                this.search();
                this.processing = false;
                this.checkedList = [];
            });
    }

    public saveEditId(id) {
        this.applyService.updateEditId(id).subscribe(
            res => {
                let rs = res.json();
            });
    }

    public saveOrUpdate() {
        this.processing = true;
        if (this.studentApply.id) {
            this.studentApply.birthday = moment(this.saveDataLoadEvent.birthday_date.jsdate).format('YYYY-MM-DD');
            this.studentApply.checkin_date = moment(this.saveDataLoadEvent.checkIn_date.jsdate).format('YYYY-MM-DD');
            this.studentApply.checkout_date = moment(this.saveDataLoadEvent.checkOut_date.jsdate).format('YYYY-MM-DD');
            this.studentApply.entrance_date = moment(this.saveDataLoadEvent.start_date.jsdate).format('YYYY-MM-DD');
            this.studentApply.graduation_date = moment(this.saveDataLoadEvent.graduate_date.jsdate).format('YYYY-MM-DD');
            this.studentApply.due_date = moment(this.saveDataLoadEvent.due_date.jsdate).format('YYYY-MM-DD');
            this.studentApply.paid_date = moment(this.saveDataLoadEvent.paid_date.jsdate).format('YYYY-MM-DD');
            this.studentApply.arrival_date = moment(this.saveDataLoadEvent.arrive_date.jsdate).format('YYYY-MM-DD');
            this.studentApply.departure_date = moment(this.saveDataLoadEvent.departure_date.jsdate).format('YYYY-MM-DD');

            if(this.saveDataLoadEvent.sfctoitp_date == null) {
                this.studentApply.sfc_to_itp = null;
            } else {
                this.studentApply.sfc_to_itp = moment(this.saveDataLoadEvent.sfctoitp_date.jsdate).format('YYYY-MM-DD');
                if(this.studentApply.sfc_to_itp == '1970-01-01') {
                    this.studentApply.sfc_to_itp = null;
                }
            }
            if(this.saveDataLoadEvent.itptosfc_date == null) {
                this.studentApply.itp_to_sfc = null;
            } else {
                this.studentApply.itp_to_sfc = moment(this.saveDataLoadEvent.itptosfc_date.jsdate).format('YYYY-MM-DD');
                if(this.studentApply.itp_to_sfc == '1970-01-01') {
                    this.studentApply.itp_to_sfc = null;
                }
            }

            this.studentApply.building_id = this.studentApply.campus == 'ITP' ? 1 : 2;
            if (this.studentApply.country_code != 'JP') {
                this.studentApply.total_cost = ((this.studentApply.entrance_fee + this.studentApply.holiday_fee +
                    this.studentApply.transfer_fee + this.studentApply.sub_total) - (this.studentApply.commission + this.studentApply.discount));
            }
            this.studentApply.total_cost_php = this.studentApply.ssp_fee_php + this.studentApply.i_card_cost + this.studentApply.visa_fee_php +
                this.studentApply.id_card + this.studentApply.electrical_fee_php + this.studentApply.room_update_php +
                this.studentApply.photocopy_php + this.studentApply.meal_total_php + this.studentApply.others_php +
                this.studentApply.adjustments_php;

            /* sales invoice fields */
            this.studentApply.total_payment_php = ((this.studentApply.entrance_fee + this.studentApply.holiday_fee + this.studentApply.transfer_fee +
                this.studentApply.sub_total - this.studentApply.discount) * this.studentApply.exc_rate_php);
            this.studentApply.commission_php = this.studentApply.commission;
            this.studentApply.tuition_accommo_php = this.studentApply.sub_total;

            if (this.arriveTimeHour == -1 || this.arriveTimeMin == -1) {
                this.studentApply.arrival_time = null;
            }
            if (this.arriveTimeHour >= 0 && this.arriveTimeMin >= 0) {
                if (this.arriveTimeHour == 0 && this.arriveTimeMin == 0) {
                    this.studentApply.arrival_time = this.studentApply.arrival_date + ' 00:00:00';
                } else if (this.arriveTimeHour == null || this.arriveTimeMin == null) {
                    this.studentApply.arrival_time = this.studentApply.arrival_time;
                } else {
                    this.studentApply.arrival_time = this.studentApply.arrival_date + ' ' + this.arriveTimeHour + ':' + this.arriveTimeMin + ':' + '00';
                }
            }

            this.applyService.updateApply(this.studentApply.id, this.studentApply).subscribe(
                res => {
                    let rs = res.json();
                    this.editApplyModal.hide();
                    this.studentApply = new StudentApplyModel();
                    this.processing = false;
                    this.search();
                    this.arriveTimeHour = null;
                    this.arriveTimeMin = null;
                });
        } else {
            this.applyService.createApply(this.studentApply).subscribe(
                res => {
                    let rs = res.json();
                    this.editApplyModal.hide();
                    this.studentApply = new StudentApplyModel();
                    this.processing = false;
                    this.search();
                    this.arriveTimeHour = null;
                    this.arriveTimeMin = null;
                });
        }
    }

    public saveRoomSelection() {
        if (this.studentApply.id) {
            this.processing = true;
            this.chosenCheckInDate = moment(this.saveDataLoadEvent.selectCheckIn_date.jsdate).format('YYYY-MM-DD');
            this.chosenCheckOutDate = moment(this.saveDataLoadEvent.selectCheckOut_date.jsdate).format('YYYY-MM-DD');
            this.roomMemo = this.roomMemo ? this.roomMemo : 'EMPTY';
            this.applyService.updateRoom(this.roomMemo, this.reserveStatusId, this.selectDormBldg, this.selectVisitorType,
                this.selectAccommodation, this.dormitory_room_id, this.chosenCheckInDate,
                this.chosenCheckOutDate, this.studentApply.id).subscribe(
                res => {
                    let rs = res.json();
                    this.editRoomApplyModal.hide();
                    this.studentApply = new StudentApplyModel();
                    this.search();
                    this.dormitory_room_id = null;
                    this.availableRoomList = null;
                    this.countRestrictStudentDorm = null;
                    this.countRestrictStudentOthers = null;
                    this.countRestrictStudentWalkin = null;
                    this.selectAccommodation = null;
                    this.selectDormRoomType = null;
                    this.selectDormBldg = null;
                    this.selectVisitorType = null;
                    this.selectSearchFilter = null;
                    this.reserveStatusId = null;
                    this.roomMemo = null;
                    this.processing = false;
                });
        }
    }

    public saveHotelSelection() {
        if (this.studentApply.id) {
            this.processing = true;
            this.chosenCheckInDate = moment(this.saveDataLoadEvent.selectCheckIn_date.jsdate).format('YYYY-MM-DD');
            this.chosenCheckOutDate = moment(this.saveDataLoadEvent.selectCheckOut_date.jsdate).format('YYYY-MM-DD');
            this.roomMemo = this.roomMemo ? this.roomMemo : 'EMPTY';
            this.applyService.updateRoom(this.roomMemo, this.reserveStatusId, this.selectDormBldg, this.selectVisitorType,
                this.selectAccommodation, this.dormitory_room_id, this.chosenCheckInDate,
                this.chosenCheckOutDate, this.studentApply.id).subscribe(
                res => {
                    let rs = res.json();
                    this.editRoomApplyModal.hide();
                    this.studentApply = new StudentApplyModel();
                    this.search();
                    this.dormitory_room_id = null;
                    this.availableRoomList = null;
                    this.selectAccommodation = null;
                    this.selectDormRoomType = null;
                    this.selectDormBldg = null;
                    this.selectVisitorType = null;
                    this.selectSearchFilter = null;
                    this.roomMemo = null;
                    this.reserveStatusId = null;
                    this.processing = false;
                });
        }
    }

    public closeEditRoomApplyModal() {
        this.editRoomApplyModal.hide();
        this.dormitory_room_id = null;
        this.availableRoomList = null;
        this.countRestrictStudentDorm = null;
        this.countRestrictStudentOthers = null;
        this.countRestrictStudentWalkin = null;
        this.selectAccommodation = null;
        this.selectDormRoomType = null;
        this.selectDormBldg = null;
        this.selectVisitorType = null;
        this.selectSearchFilter = null;
        this.reserveStatusId = null;
        this.roomMemo = null;
        this.import_success = false;
    }

    public saveCourseSelection() {
        if (this.studentApply.id) {
            this.processing = true;
            this.chosenCheckInDate = moment(this.saveDataLoadEvent.selectCheckIn_date.jsdate).format('YYYY-MM-DD');
            this.chosenCheckOutDate = moment(this.saveDataLoadEvent.selectCheckOut_date.jsdate).format('YYYY-MM-DD');
            this.applyService.updateCourse(this.selectDormBldg, this.selectPlan,
                this.chosenCheckInDate, this.chosenCheckOutDate, this.studentApply.id).subscribe(
                res => {
                    let rs = res.json();
                    this.editCourseApplyModal.hide();
                    this.studentApply = new StudentApplyModel();
                    this.search();
                    this.selectPlan = null;
                    this.processing = false;
                });
        }
    }

    public saveRefundInvoice() {
        this.processing = true;
        this.refundInvoice.sa_id_refund = this.studentApply.id;
        this.refundInvoice.sa_passport_name = this.studentApply.passport_name ? this.studentApply.passport_name : this.studentApply.student_name;
        this.refundInvoice.rfd_checkin_date = moment(this.saveDataLoadEvent.selectCheckIn_date.jsdate).format('YYYY-MM-DD');
        this.refundInvoice.rfd_checkout_date = moment(this.saveDataLoadEvent.selectCheckOut_date.jsdate).format('YYYY-MM-DD');
        if (this.refundInvoice.id) {
            this.refundInvoice.rfd_total_cost = ((this.refundInvoice.rfd_entrance_fee + this.refundInvoice.rfd_tuition_accommodation_fee +
                this.refundInvoice.rfd_room_upgrade_fee + this.refundInvoice.rfd_plan_upgrade_fee + this.refundInvoice.rfd_other1_fee +
                this.refundInvoice.rfd_other2_fee + this.refundInvoice.rfd_holiday_fee) -
                (this.refundInvoice.rfd_agent_commission + this.refundInvoice.rfd_discount));
            this.applyService.updateRefundInvoice(this.refundInvoice.sa_id_refund, this.refundInvoice).subscribe(
                res => {
                    let rs = res.json();
                    this.editRefundInvoiceModal.hide();
                    this.refundInvoice = new RefundInvoiceModel();
                    this.search();
                    this.processing = false;

                });
        } else {
            this.applyService.createRefundInvoice(this.refundInvoice).subscribe(
                res => {
                    let rs = res.json();
                    this.editRefundInvoiceModal.hide();
                    this.refundInvoice = new RefundInvoiceModel();
                    this.search();
                    this.processing = false;
                });
        }
    }

    public saveExtensionInvoice() {
        this.processing = true;
        this.extensionInvoice.sa_id = this.studentApply.id;
        this.extensionInvoice.sa_passport_name = this.studentApply.passport_name ? this.studentApply.passport_name : this.studentApply.student_name;
        this.extensionInvoice.ext_checkin_date = moment(this.saveDataLoadEvent.selectCheckIn_date.jsdate).format('YYYY-MM-DD');
        this.extensionInvoice.ext_checkout_date = moment(this.saveDataLoadEvent.selectCheckOut_date.jsdate).format('YYYY-MM-DD');
        if (this.extensionInvoice.id) {
            this.extensionInvoice.ext_total_cost = ((this.extensionInvoice.ext_entrance_fee + this.extensionInvoice.ext_tuition_accommodation_fee +
                this.extensionInvoice.ext_room_upgrade_fee + this.extensionInvoice.ext_plan_upgrade_fee + this.extensionInvoice.ext_other1_fee +
                this.extensionInvoice.ext_other2_fee + this.extensionInvoice.ext_holiday_fee) -
                (this.extensionInvoice.ext_agent_commission + this.extensionInvoice.ext_discount));
            this.applyService.updateExtensionInvoice(this.extensionInvoice.sa_id, this.extensionInvoice).subscribe(
                res => {
                    let rs = res.json();
                    this.editExtensionInvoiceModal.hide();
                    this.extensionInvoice = new ExtensionInvoiceModel();
                    this.search();
                    this.processing = false;

                });
        } else {
            this.applyService.createExtensionInvoice(this.extensionInvoice).subscribe(
                res => {
                    let rs = res.json();
                    this.editExtensionInvoiceModal.hide();
                    this.extensionInvoice = new ExtensionInvoiceModel();
                    this.search();
                    this.processing = false;
                });
        }
    }

    public saveOrUpdateInvoice() {
        this.processing = true;
        this.invoiceModel.sa_id_number = this.studentApply.id;
        this.invoiceModel.checkin_date = moment(this.saveDataLoadEvent.invoice_checkin.jsdate).format('YYYY-MM-DD');
        this.invoiceModel.checkout_date = moment(this.saveDataLoadEvent.invoice_checkout.jsdate).format('YYYY-MM-DD');
        this.invoiceModel.due_date = moment(this.saveDataLoadEvent.due_date.jsdate).format('YYYY-MM-DD');
        this.invoiceModel.approved_date = moment(this.saveDataLoadEvent.approved_date.jsdate).format('YYYY-MM-DD');
        this.invoiceModel.departure_date = moment(this.saveDataLoadEvent.departure_date.jsdate).format('YYYY-MM-DD');
        if (this.invoiceModel.sa_id_number) {
            this.invoiceModel.total_cost_php = this.invoiceModel.ssp_fee_php + this.invoiceModel.i_card_cost + this.invoiceModel.visa_fee_php +
                this.invoiceModel.id_card + this.invoiceModel.electrical_fee_php + this.invoiceModel.room_update_php +
                this.invoiceModel.photocopy_php + this.invoiceModel.meal_total_php + this.invoiceModel.others_php +
                this.invoiceModel.adjustments_php;
            this.applyService.updateInvoice(this.invoiceModel.sa_id_number, this.invoiceModel).subscribe(
                res => {
                    let rs = res.json();
                    this.editInvoiceModal.hide();
                    this.invoiceModel = new InvoiceModel();
                    this.processing = false;
                    this.search();

                });
        }
        else {
            this.applyService.createInvoice(this.invoiceModel).subscribe(
                res => {
                    let rs = res.json();
                    this.editInvoiceModal.hide();
                    this.invoiceModel = new InvoiceModel();
                    this.processing = false;
                    this.search();

                });
        }
    }

    public removeCourse(courseId, applyId) {
        this.processing = true;
        this.applyService.deleteCourse(courseId, applyId).subscribe(res => {
            let rs = res.json();
            this.editCourseApplyModal.hide();
            this.selectPlan = null;
            this.selectDormBldg = null;
            this.search();
            this.processing = false;
        });
    }

    public closeEditCourseApplyModal() {
        this.editCourseApplyModal.hide();
        this.selectDormBldg = null;
        this.selectPlan = null;
        this.import_success = false;
    }

    public closeExtensionInvoiceModal() {
        this.extensionInvoiceModal.hide();
        this.import_success = false;
    }

    // get Room List
    public getRoomList(applyId) {
        this.chosenCheckInDate = moment(this.saveDataLoadEvent.selectCheckIn_date.jsdate).format('YYYY-MM-DD');
        this.chosenCheckOutDate = moment(this.saveDataLoadEvent.selectCheckOut_date.jsdate).format('YYYY-MM-DD');
        this.applyService.getRoomListService(this.selectAccommodation, this.selectDormBldg, this.selectDormRoomType,
            this.chosenCheckInDate, this.chosenCheckOutDate, this.selectVisitorType, this.selectSearchFilter, applyId)
            .subscribe(res => {
                this.availableRoomList = res.json().filderBedList;
                this.countRestrictStudentDorm = res.json().countStudentDorm;
                this.countRestrictStudentOthers = res.json().countStudentOthers;
                this.countRestrictStudentWalkin = res.json().countStudentWalkin;
            });
    }

    // get Reserved rooms list
    public loadReservedRooms(applyId) {
        this.applyService.getReservedRoomsList(applyId).subscribe((res) => {
            this.reservedRoomsList = res.json();
            if (this.reservedRoomsList) {
                for (let a of this.reservedRoomsList) {
                    let from = moment(a.date_from, "YYYY-MM-DD");
                    let to = moment(a.date_to, "YYYY-MM-DD");
                    this.numbWeeks = moment.duration(to.diff(from)).asWeeks();
                }
            }
        });
    }

    // get Condo reserved rooms list
    public loadCondoReservedRooms(applyId) {
        this.applyService.getCondoReservedRoomsList(applyId).subscribe((res) => {
            this.reservedCondoRoomsList = res.json();
            if (this.reservedCondoRoomsList) {
                for (let a of this.reservedCondoRoomsList) {
                    let from = moment(a.date_from, "YYYY-MM-DD");
                    let to = moment(a.date_to, "YYYY-MM-DD");
                    this.numbWeeks = moment.duration(to.diff(from)).asWeeks();
                }
            }
        });
    }

    // get Hotels reserved rooms list
    public loadHotelsReservedRooms(applyId) {
        this.applyService.getHotelsReservedRoomsList(applyId).subscribe((res) => {
            this.reservedHotelsRoomsList = res.json();
            if (this.reservedHotelsRoomsList) {
                for (let a of this.reservedHotelsRoomsList) {
                    let from = moment(a.date_from, "YYYY-MM-DD");
                    let to = moment(a.date_to, "YYYY-MM-DD");
                    this.numbWeeks = moment.duration(to.diff(from)).asWeeks();
                }
            }
        });
    }

    // get Walkin reserved rooms list
    public loadWalkinReservedRooms(applyId) {
        this.applyService.getWalkinReservedRoomsList(applyId).subscribe((res) => {
            this.reservedWalkinRoomsList = res.json();
            if (this.reservedWalkinRoomsList) {
                for (let a of this.reservedWalkinRoomsList) {
                    let from = moment(a.date_from, "YYYY-MM-DD");
                    let to = moment(a.date_to, "YYYY-MM-DD");
                    this.numbWeeks = moment.duration(to.diff(from)).asWeeks();
                }
            }
        });
    }

    // get Reserved room logs list
    public loadReservedRoomsLogs(applyId) {
        this.applyService.getReservedRoomsLogsList(applyId).subscribe((res) => {
            this.reservedRoomsLogs = res.json();
        });
    }

    // get Hotel Reserved list
    public loadReservedHotels(applyId) {
        this.applyService.getReservedHotelsList(applyId).subscribe((res) => {
            this.reservedHotelsList = res.json();
        });
    }

    // get total number of weeks/terms per month
    public getNumberOfWeeksPerNation() {
        this.processing = true;
        this.applyService.getTermsReportService(this.selectYear)
            .subscribe(res => {
                this.numberOfTermsPerMOnthPerNation = res.json();
                this.processing = false;
            });
    }

    // get total number of students per week/s
    public getNumberOfStudentsPerWeeks() {
        this.processing = true;
        this.checkRoomFromStudents = moment(this.saveDataLoadEvent.checkRoomFromStudents.jsdate).format('YYYY-MM-DD');
        this.applyService.getStudentsCountService(this.checkRoomFromStudents)
            .subscribe(res => {
                this.numberOfStudentsPerWeeksByCampus = res.json();
                this.processing = false;
            });
    }

    // get total number of available room
    public getTotalNumberOfAvailableRoom() {
        this.processing = true;
        this.checkRoomFrom = moment(this.saveDataLoadEvent.checkRoomFrom.jsdate).format('YYYY-MM-DD');
        this.applyService.getRoomAvailableService(this.checkRoomFrom, this.checkRoomCampus, this.checkRoomType, this.checkStayType)
            .subscribe(res => {
                this.availRoomWeek = res.json();
                this.processing = false;
            });
    }

    // get list of graduating students
    public getListOfGraduatingStudents() {
        this.processing = true;
        this.gradFrom = moment(this.saveDataLoadEvent.gradFrom.jsdate).format('YYYY-MM-DD');
        this.applyService.getListGraduatingService(this.gradFrom, this.gradRoomCampus)
            .subscribe(res => {
                this.listGradStud = res.json();
                this.processing = false;
            });
    }

    // get total number of empty beds
    public getTotalNumberOfEmptyBeds() {
        this.processing = true;
        this.checkEmptyBedFrom = moment(this.saveDataLoadEvent.checkEmptyBedFrom.jsdate).format('YYYY-MM-DD');
        this.checkEmptyBedTo = moment(this.saveDataLoadEvent.checkEmptyBedTo.jsdate).format('YYYY-MM-DD');
        this.applyService.getEmptyBedsService(this.checkEmptyBedFrom, this.checkEmptyBedTo, this.checkEmptyBedCampus, this.checkEmptyBedStayType)
            .subscribe(res => {
                this.emptyBedsWeek = res.json();
                this.processing = false;
            });
    }

    // get list of changing dormitory room
    public getListOfChangingDormRoom() {
        this.processing = true;
        this.changeRoomFrom = moment(this.saveDataLoadEvent.changeRoomFrom.jsdate).format('YYYY-MM-DD');
        this.changeRoomTo = moment(this.saveDataLoadEvent.changeRoomTo.jsdate).format('YYYY-MM-DD');
        this.applyService.getListOfChangingDormRoom(this.changeRoomFrom, this.changeRoomTo, this.selectCampus)
            .subscribe(res => {
                this.listChangeDormRoom = res.json();
                this.processing = false;
            });
    }

    // get list of changing hotel room
    public getListOfChangingHotelRoom() {
        this.processing = true;
        this.changeRoomFrom = moment(this.saveDataLoadEvent.changeRoomFrom.jsdate).format('YYYY-MM-DD');
        this.changeRoomTo = moment(this.saveDataLoadEvent.changeRoomTo.jsdate).format('YYYY-MM-DD');
        this.applyService.getListOfChangingHotelRoom(this.changeRoomFrom, this.changeRoomTo, this.selectCampus)
            .subscribe(res => {
                this.listChangeHotelRoom = res.json();
                this.processing = false;
            });
    }

    // get list of changing HOTELS room
    public getListOfChangingHotelsRoom() {
        this.processing = true;
        this.changeRoomFrom = moment(this.saveDataLoadEvent.changeRoomFrom.jsdate).format('YYYY-MM-DD');
        this.changeRoomTo = moment(this.saveDataLoadEvent.changeRoomTo.jsdate).format('YYYY-MM-DD');
        this.applyService.getListOfChangingHotelsRoom(this.changeRoomFrom, this.changeRoomTo, this.selectCampus)
            .subscribe(res => {
                this.listChangeHotelsRoom = res.json();
                this.processing = false;
            });
    }

    // get list of changing WALK-INS room
    public getListOfChangingWalkinsRoom() {
        this.processing = true;
        this.changeRoomFrom = moment(this.saveDataLoadEvent.changeRoomFrom.jsdate).format('YYYY-MM-DD');
        this.changeRoomTo = moment(this.saveDataLoadEvent.changeRoomTo.jsdate).format('YYYY-MM-DD');
        this.applyService.getListOfChangingWalkinsRoom(this.changeRoomFrom, this.changeRoomTo, this.selectCampus)
            .subscribe(res => {
                this.listChangeWalkinsRoom = res.json();
                this.processing = false;
            });
    }

    // get list of changing CONDO room
    public getListOfChangingCondosRoom() {
        this.processing = true;
        this.changeRoomFrom = moment(this.saveDataLoadEvent.changeRoomFrom.jsdate).format('YYYY-MM-DD');
        this.changeRoomTo = moment(this.saveDataLoadEvent.changeRoomTo.jsdate).format('YYYY-MM-DD');
        this.applyService.getListOfChangingCondosRoom(this.changeRoomFrom, this.changeRoomTo, this.selectCampus)
            .subscribe(res => {
                this.listChangeCondosRoom = res.json();
                this.processing = false;
            });
    }

    public getListOfChangePlan() {
        this.processing = true;
        this.changePlanFrom = moment(this.saveDataLoadEvent.changePlanFrom.jsdate).format('YYYY-MM-DD');
        this.changePlanTo = moment(this.saveDataLoadEvent.changePlanTo.jsdate).format('YYYY-MM-DD');
        this.applyService.getListOfChangePlan(this.changePlanFrom, this.changePlanTo, this.selectCampus)
            .subscribe(res => {
                this.listChangePlan = res.json();
                this.processing = false;
            });
    }

    public getListOfPlanCount() {
        this.processing = true;
        this.countPlanFrom = moment(this.saveDataLoadEvent.countPlanFrom.jsdate).format('YYYY-MM-DD');
        this.countPlanTo = moment(this.saveDataLoadEvent.countPlanTo.jsdate).format('YYYY-MM-DD');
        this.applyService.getPlanCountListService(this.countPlanFrom, this.countPlanTo, this.countPlanCampus, this.countCntCode)
            .subscribe(res => {
                this.listCountPlan = res.json().planList;
                this.processing = false;
            });
    }

    public getListOfCafe() {
        this.processing = true;
        this.cafeFrom = moment(this.saveDataLoadEvent.cafeFrom.jsdate).format('YYYY-MM-DD');
        this.cafeTo = moment(this.saveDataLoadEvent.cafeTo.jsdate).format('YYYY-MM-DD');
        this.applyService.getCafeListService(this.cafeFrom, this.cafeTo, this.cafeCampus)
            .subscribe(res => {
                this.listCountCafeFirst = res.json().cafeListFirstWeek;
                this.listCountCafeSecond = res.json().cafeListSecondWeek;
                this.listCountCafeThird = res.json().cafeListThirdWeek;
                this.listCountCafeFourth = res.json().cafeListFourthWeek;
                this.processing = false;
            });
    }

    public getListOfWeeklyReport() {
        this.processing = true;
        this.weeklyFrom = moment(this.saveDataLoadEvent.weeklyFrom.jsdate).format('YYYY-MM-DD');
        this.applyService.getWeeklyReportListService(this.weeklyFrom, this.weeklyCampus)
            .subscribe(res => {
                this.numberOfStudentsPerWeeksPerNationWithInternsGuardians = res.json();
                this.processing = false;
            });
    }

    public getSalesReport() {
        this.processing = true;
        this.salesFrom = moment(this.saveDataLoadEvent.salesFrom.jsdate).format('YYYY-MM-DD');
        this.salesTo = moment(this.saveDataLoadEvent.salesTo.jsdate).format('YYYY-MM-DD');
        this.applyService.getSalesReportService(this.salesFrom,this.salesTo)
            .subscribe(res => {
                this.listSalesReport = res.json().allSalesReport;
                this.processing = false;
            });
    }

    public getCampBookingReport() {
        this.processing = true;
        this.campBookFrom = moment(this.saveDataLoadEvent.campBookFrom.jsdate).format('YYYY-MM-DD');
        this.campBookTo = moment(this.saveDataLoadEvent.campBookTo.jsdate).format('YYYY-MM-DD');
        this.applyService.getCampBookReportService(this.campBookFrom,this.campBookTo,this.weeklyCampus)
            .subscribe(res => {
                this.listCampBookReport = res.json().allCampBookReport;
                this.processing = false;
            });
    }

    public createGroupStudentApply() {
        this.processing = true;
        this.studentGroupApply.groupAddCheckin = moment(this.saveDataLoadEvent.groupAddCheckin.jsdate).format('YYYY-MM-DD');
        this.studentGroupApply.groupAddCheckout = moment(this.saveDataLoadEvent.groupAddCheckout.jsdate).format('YYYY-MM-DD');
        this.applyService.createGroupApply(this.studentGroupApply).subscribe(
            res => {
                let rs = res.json();
                this.studentGroupApply = new StudentApplyGroupModel();
                this.groupAddModal.hide();
                this.search();
                this.processing = false;
            });
    }

    // get Payments Unconfirmed list
    public loadPaymentsUnconfirmed(applyId) {
        this.applyService.getPaymentsUnconfirmed(applyId).subscribe((res) => {
            this.paymentUnconfirmedList = res.json();
        });
    }

    // get Payments Confirmed list
    public loadPaymentsConfirmed(applyId) {
        this.applyService.getPaymentsConfirmed(applyId).subscribe((res) => {
            this.paymentConfirmedList = res.json();
        });
    }

    // confirm payment
    public confirmPayment(paymentId) {
        this.processing = true;
        this.applyService.confirmStudentPayment(paymentId)
            .subscribe(res => {
                this.editApplyModal.hide();
                this.search();
                this.processing = false;
            });
    }

    public deleteApply(id) {
        this.applyService.deleteApply(id).subscribe(
            res => {
                this.search();
            }
        );
    }

    public updateDeleteFlag(id) {
        if (id) {
            this.loading = true;
            this.applyService.deleteFlagApply(id, this.deleteFlag).subscribe(
                res => {
                    let rs = res.json();
                    this.studentApply = new StudentApplyModel();
                    this.search();
                    this.loading = false;
                });
        }
    }

    public lockInvoice(id) {
        this.processing = true;
        if (id) {
            this.loading = true;
            this.applyService.updateIsInvoiceConfirmedFlag(id, this.invoiceLock).subscribe(
                res => {
                    let rs = res.json();
                    this.sendInvoiceModal.hide();
                    this.studentApply = new StudentApplyModel();
                    this.search();
                    this.processing = false;
                });
        }
    }

    public unlockInvoice(id) {
        this.processing = true;
        if (id) {
            this.loading = true;
            this.applyService.updateIsInvoiceConfirmedFlag(id, this.invoiceUnlock).subscribe(
                res => {
                    let rs = res.json();
                    this.sendInvoiceModal.hide();
                    this.studentApply = new StudentApplyModel();
                    this.search();
                    this.processing = false;
                });
        }
    }

    public lockExtInvoice(id) {
        this.processing = true;
        if (id) {
            this.loading = true;
            this.applyService.updateIsExtInvoiceConfirmedFlag(id, this.invoiceExtLock).subscribe(
                res => {
                    let rs = res.json();
                    this.extensionInvoiceModal.hide();
                    this.search();
                    this.processing = false;
                });
        }
    }

    public unlockExtInvoice(id) {
        this.processing = true;
        if (id) {
            this.loading = true;
            this.applyService.updateIsExtInvoiceConfirmedFlag(id, this.invoiceExtUnlock).subscribe(
                res => {
                    let rs = res.json();
                    this.extensionInvoiceModal.hide();
                    this.search();
                    this.processing = false;
                });
        }
    }

    public lockRfdInvoice(id) {
        this.processing = true;
        if (id) {
            this.loading = true;
            this.applyService.updateIsRfdInvoiceConfirmedFlag(id, this.invoiceRfdLock).subscribe(
                res => {
                    let rs = res.json();
                    this.refundInvoiceModal.hide();
                    this.search();
                    this.processing = false;
                });
        }
    }

    public unlockRfdInvoice(id) {
        this.processing = true;
        if (id) {
            this.loading = true;
            this.applyService.updateIsRfdInvoiceConfirmedFlag(id, this.invoiceRfdUnlock).subscribe(
                res => {
                    let rs = res.json();
                    this.refundInvoiceModal.hide();
                    this.search();
                    this.processing = false;
                });
        }
    }

    public showModal(): void {
        this.loading = true;
    }

    public hideModal(): void {
        this.autoShownModal.hide();
    }

    public onHidden(): void {
        this.hideModal();
        this.loading = false;
    }

    public generateInvoiceNo(id) {
        this.processing = true;
        this.applyService.updateInvoiceNumber(id).subscribe(
            res => {
                let rs = res.json();
                this.editInvoiceModal.hide();
                this.search();
                this.processing = false;
            });
    }

    public generateExtInvoiceNo(id) {
        this.processing = true;
        this.applyService.updateExtInvoiceNumber(id).subscribe(
            res => {
                let rs = res.json();
                //this.extensionInvoiceModal.hide();
                this.editApplyModal.hide();
                this.processing = false;
            });
    }

    public removeInvoiceNo(applyId){
        this.applyService.deleteInvoiceNumber(applyId).subscribe(res => {
            let rs = res.json();
            this.editApplyModal.hide();
            this.processing = false;
            this.search();
        });
    }

    public removeExtendedInvoiceNo(applyId){
        this.applyService.deleteExtendedInvoiceNumber(applyId).subscribe(res => {
            let rs = res.json();
            this.editExtensionInvoiceModal.hide();
            this.processing = false;
            this.search();
        });
    }

    public removeRefundInvoiceNo(applyId){
        this.applyService.deleteExtendedInvoiceNumber(applyId).subscribe(res => {
            let rs = res.json();
            this.editRefundInvoiceModal.hide();
            this.processing = false;
            this.search();
        });
    }

    public printPerAirportPickup(campus, passport_name, sex, country_code, course, room_id1, options_pickup,
                                 options_meals, term, arrival_date, flight_no, arrival_time, checkin_date,
                                 checkout_date, note_for_student,accommodation_id1) {
        let printTemplateContents, popupWin;
        let checkIn, checkOut, arrivalDate, arrivalTime, cleanArriveTime;
        let roomType = '';
        checkIn = new Date(checkin_date);
        checkOut = new Date(checkout_date);
        arrivalDate = new Date(arrival_date);
        arrivalTime = new Date(arrival_time);
        cleanArriveTime = arrivalTime.toLocaleTimeString().replace(/:(\d{2}) (?=[AP]M)/, " ");
        let numeric = {day: 'numeric', month: 'numeric'};

        if(accommodation_id1 != 7 && accommodation_id1 != 8) {
            if (room_id1 == 1 || room_id1 == 6 || room_id1 == 9 || room_id1 == 12 || room_id1 == 15) {
                roomType = ' Single';
                if(accommodation_id1 == 2) {
                    roomType = ' AU-Single';
                } else if(accommodation_id1 == 3){
                    roomType = ' WF-Single';
                } else if (accommodation_id1 == 5) {
                    roomType = ' EX-Single';
                } else if (accommodation_id1 == 6) {
                    roomType = ' DX-Single';
                } else if (accommodation_id1 == 9) {
                    roomType = ' C-Single';
                }
            }
            else if (room_id1 == 2 || room_id1 == 7 || room_id1 == 10 || room_id1 == 13 || room_id1 == 16) {
                roomType = ' Twin';
                if(accommodation_id1 == 2) {
                    roomType = ' AU-Twin';
                } else if(accommodation_id1 == 3){
                    roomType = ' WF-Twin';
                } else if (accommodation_id1 == 5) {
                    roomType = ' EX-Twin';
                } else if (accommodation_id1 == 6) {
                    roomType = ' DX-Twin';
                } else if (accommodation_id1 == 9) {
                    roomType = ' C-Twin';
                }
            }
            else if (room_id1 == 3 || room_id1 == 8 || room_id1 == 11 || room_id1 == 14 || room_id1 == 17) {
                roomType = ' Triple';
                if(accommodation_id1 == 2) {
                    roomType = ' AU-Triple';
                } else if(accommodation_id1 == 3){
                    roomType = ' WF-Triple';
                } else if (accommodation_id1 == 5) {
                    roomType = ' EX-Triple';
                } else if (accommodation_id1 == 6) {
                    roomType = ' DX-Triple';
                } else if (accommodation_id1 == 9) {
                    roomType = ' C-Triple';
                }
            }
            else if (room_id1 == 4) {
                roomType = ' Quad';
                if(accommodation_id1 == 2) {
                    roomType = ' AU-Quad';
                } else if(accommodation_id1 == 3){
                    roomType = ' WF-Quad';
                } else if (accommodation_id1 == 5) {
                    roomType = ' EX-Quad';
                } else if (accommodation_id1 == 6) {
                    roomType = ' DX-Quad';
                } else if (accommodation_id1 == 9) {
                    roomType = ' C-Quad';
                }
            }
            else if (room_id1 == 5) {
                roomType = ' Hex';
                if(accommodation_id1 == 2) {
                    roomType = ' AU-Hex';
                } else if(accommodation_id1 == 3){
                    roomType = ' WF-Hex';
                } else if (accommodation_id1 == 5) {
                    roomType = ' EX-Hex';
                } else if (accommodation_id1 == 6) {
                    roomType = ' DX-Hex';
                } else if (accommodation_id1 == 9) {
                    roomType = ' C-Hex';
                }
            }
        } else {
            roomType = ' (walkin)';
        }

        printTemplateContents = document.getElementById('airport-pickup-template').innerHTML;
        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        popupWin.document.open();
        popupWin.document.write(`
              <html>
              <title>Airport Pickup</title>
                <head>
                  <style>
                    @media print{
                      @page {size: portrait; margin: 8mm;}  
                      span.yellow {
                        background-color: yellow !important;
                        -webkit-print-color-adjust: exact; 
                      }
                      span.red {
                        color: red !important;
                        font-weight: bold !important;
                        -webkit-print-color-adjust: exact; 
                      }        
                    }               
                  </style>
                </head>
                <body onload="window.print();window.close()">
                  <div align="center">
                    <span><img height="25%" width="80%" src="assets/images/header-invoice.png"/></span>
                  </div>
                  <div style="width:100%;text-align:center;font-size:15pt;"><b>行程最後確認表</b></div>
                  <table style="width:100%;text-align: left;border-collapse: collapse;font-size:14pt;"
                           border="1">
                           <tr>
                               <td>Campus<br>校區</td>
                               <td>${campus}</td>
                               <td>Note for Student</td>
                               <td colspan="3">${note_for_student}</td>
                           </tr>
                           <tr>
                               <td>Name<br>名字</td>
                               <td>${passport_name}</td>
                               <td>Gender<br>性别</td>
                               <td>${sex}</td>
                               <td colspan="2"></td>
                           </tr>
                           <tr>
                               <td>Nationality<br>國籍</td>
                               <td>${country_code}</td>
                               <td>Course<br>課程</td>
                               <td>${course}</td>
                               <td>Room type<br>房間型態</td>
                               <td>${roomType}</td>
                           </tr>
                           <tr>
                               <td>Pickup<br>接機</td>
                               <td>${options_pickup}</td>
                               <td>Meal<br>含餐</td>
                               <td>${options_meals}</td>
                               <td>Weeks<br>週數</td>
                               <td>${term}</td>
                           </tr>
                           <tr>
                               <td>Arrival date<br>抵達日期</td>
                               <td>${arrivalDate.toLocaleDateString('en-US', numeric)}</td>
                               <td>FLIGHT NO<br>班機號碼</td>
                               <td>${flight_no}</td>
                               <td>Arrival time<br>抵達時間</td>
                               <td>${cleanArriveTime}</td>
                           </tr>
                           <tr>
                               <td>Check in date<br>入住日期</td>
                               <td>${checkIn.toLocaleDateString('en-US', numeric)}</td>
                               <td>Check out date<br>退房日期</td>
                               <td>${checkOut.toLocaleDateString('en-US', numeric)}</td>
                               <td>Pick up staff<br>接機聯繫人</td>
                               <td>Rain:  0995-295-6323<br>Denise: 0945-149-6424   </td>
                           </tr>
                    </table>
                    ${printTemplateContents}
                </body>
              </html>`
        );
        popupWin.document.close();

    }

    public printPerAirportPickupEn(campus, passport_name, sex, country_code, course, room_id1,
                                   options_pickup, options_meals, term, arrival_date, flight_no,
                                   arrival_time, checkin_date, checkout_date, note_for_student,accommodation_id1) {
        let printTemplateContents, popupWin;
        let checkIn, checkOut, arrivalDate, arrivalTime, cleanArriveTime;
        let roomType = '';
        checkIn = new Date(checkin_date);
        checkOut = new Date(checkout_date);
        arrivalDate = new Date(arrival_date);
        arrivalTime = new Date(arrival_time);
        cleanArriveTime = arrivalTime.toLocaleTimeString().replace(/:(\d{2}) (?=[AP]M)/, " ");
        let numeric = {day: 'numeric', month: 'numeric'};

        if(accommodation_id1 != 7 && accommodation_id1 != 8) {
            if (room_id1 == 1 || room_id1 == 6 || room_id1 == 9 || room_id1 == 12 || room_id1 == 15) {
                roomType = ' Single';
                if(accommodation_id1 == 2) {
                    roomType = ' AU-Single';
                } else if(accommodation_id1 == 3){
                    roomType = ' WF-Single';
                } else if (accommodation_id1 == 5) {
                    roomType = ' EX-Single';
                } else if (accommodation_id1 == 6) {
                    roomType = ' DX-Single';
                } else if (accommodation_id1 == 9) {
                    roomType = ' C-Single';
                }
            }
            else if (room_id1 == 2 || room_id1 == 7 || room_id1 == 10 || room_id1 == 13 || room_id1 == 16) {
                roomType = ' Twin';
                if(accommodation_id1 == 2) {
                    roomType = ' AU-Twin';
                } else if(accommodation_id1 == 3){
                    roomType = ' WF-Twin';
                } else if (accommodation_id1 == 5) {
                    roomType = ' EX-Twin';
                } else if (accommodation_id1 == 6) {
                    roomType = ' DX-Twin';
                } else if (accommodation_id1 == 9) {
                    roomType = ' C-Twin';
                }
            }
            else if (room_id1 == 3 || room_id1 == 8 || room_id1 == 11 || room_id1 == 14 || room_id1 == 17) {
                roomType = ' Triple';
                if(accommodation_id1 == 2) {
                    roomType = ' AU-Triple';
                } else if(accommodation_id1 == 3){
                    roomType = ' WF-Triple';
                } else if (accommodation_id1 == 5) {
                    roomType = ' EX-Triple';
                } else if (accommodation_id1 == 6) {
                    roomType = ' DX-Triple';
                } else if (accommodation_id1 == 9) {
                    roomType = ' C-Triple';
                }
            }
            else if (room_id1 == 4) {
                roomType = ' Quad';
                if(accommodation_id1 == 2) {
                    roomType = ' AU-Quad';
                } else if(accommodation_id1 == 3){
                    roomType = ' WF-Quad';
                } else if (accommodation_id1 == 5) {
                    roomType = ' EX-Quad';
                } else if (accommodation_id1 == 6) {
                    roomType = ' DX-Quad';
                } else if (accommodation_id1 == 9) {
                    roomType = ' C-Quad';
                }
            }
            else if (room_id1 == 5) {
                roomType = ' Hex';
                if(accommodation_id1 == 2) {
                    roomType = ' AU-Hex';
                } else if(accommodation_id1 == 3){
                    roomType = ' WF-Hex';
                } else if (accommodation_id1 == 5) {
                    roomType = ' EX-Hex';
                } else if (accommodation_id1 == 6) {
                    roomType = ' DX-Hex';
                } else if (accommodation_id1 == 9) {
                    roomType = ' C-Hex';
                }
            }
        } else {
            roomType = ' (walkin)';
        }

        printTemplateContents = document.getElementById('airport-pickup-template-en').innerHTML;
        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        popupWin.document.open();
        popupWin.document.write(`
              <html>
              <title>Airport Pickup</title>
                <head>
                  <style>
                    @media print{
                      @page {size: portrait; margin: 10mm;}  
                      span.yellow {
                        background-color: yellow !important;
                        -webkit-print-color-adjust: exact; 
                      }
                      span.red {
                        color: red !important;
                        font-weight: bold !important;
                        -webkit-print-color-adjust: exact; 
                      }        
                    }               
                  </style>
                </head>
                <body onload="window.print();window.close()">
                  <div align="center">
                    <span><img height="25%" width="80%" src="assets/images/header-invoice.png"/></span>
                  </div>
                  <div style="width:100%;text-align:center;font-size:15pt;"><b>Confirmation Letter</b></div>
                  <table style="width:100%;text-align: left;border-collapse: collapse;font-size:14pt;"
                           border="1">
                           <tr>
                               <td style="padding-top:10px;padding-bottom:10px;">Campus</td>
                               <td>${campus}</td>
                               <td style="padding-top:10px;padding-bottom:10px;">Note for Student</td>
                               <td colspan="3">${note_for_student}</td>
                           </tr>
                           <tr>
                               <td style="padding-top:10px;padding-bottom:10px;">Name</td>
                               <td>${passport_name}</td>
                               <td style="padding-top:10px;padding-bottom:10px;">Gender</td>
                               <td>${sex}</td>
                               <td colspan="2"></td>
                           </tr>
                           <tr>
                               <td style="padding-top:10px;padding-bottom:10px;">Nationality</td>
                               <td>${country_code}</td>
                               <td style="padding-top:10px;padding-bottom:10px;">Course</td>
                               <td>${course}</td>
                               <td style="padding-top:10px;padding-bottom:10px;">Room type</td>
                               <td>${roomType}</td>
                           </tr>
                           <tr>
                               <td style="padding-top:10px;padding-bottom:10px;">Pickup</td>
                               <td>${options_pickup}</td>
                               <td style="padding-top:10px;padding-bottom:10px;">Meal</td>
                               <td>${options_meals}</td>
                               <td style="padding-top:10px;padding-bottom:10px;">Weeks</td>
                               <td>${term}</td>
                           </tr>
                           <tr>
                               <td style="padding-top:10px;padding-bottom:10px;">Arrival date</td>
                               <td>${arrivalDate.toLocaleDateString('en-US', numeric)}</td>
                               <td style="padding-top:10px;padding-bottom:10px;">FLIGHT NO</td>
                               <td>${flight_no}</td>
                               <td style="padding-top:10px;padding-bottom:10px;">Arrival time</td>
                               <td>${cleanArriveTime}</td>
                           </tr>
                           <tr>
                               <td style="padding-top:10px;padding-bottom:10px;">Check in date</td>
                               <td>${checkIn.toLocaleDateString('en-US', numeric)}</td>
                               <td style="padding-top:10px;padding-bottom:10px;">Check out date</td>
                               <td>${checkOut.toLocaleDateString('en-US', numeric)}</td>
                               <td style="padding-top:10px;padding-bottom:10px;"></td>
                               <td></td>
                           </tr>
                    </table>
                    ${printTemplateContents}
                </body>
              </html>`
        );
        popupWin.document.close();

    }

    public printAllAirportPickup(): void {
        let printContentsTemplate, popupWin;
        printContentsTemplate = document.getElementById('print-all-airport-pickup-template').innerHTML;
        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        popupWin.document.open();
        popupWin.document.write(`
          <html>
          <title>Airport Pickup Template</title>
            <head>
              <style>
                @media print{
                  @page {size: portrait; margin: 6mm;}
                  table.template {page-break-after:always}
                  span.yellow {
                    background-color: yellow !important;
                    -webkit-print-color-adjust: exact; 
                  }
                  span.red {
                    color: red !important;
                    font-weight: bold !important;
                    -webkit-print-color-adjust: exact; 
                  }
                  span.page{
                      page-break-after: always;
                  }
                }             
              </style>
            </head>
            <body onload="window.print();window.close()">
              ${printContentsTemplate}     
            </body>
          </html>`
        );
        popupWin.document.close();
    }

    public printAllAcceptLetter(): void {
        let printContentsTemplate, popupWin;
        printContentsTemplate = document.getElementById('print-all-accept-letter-template').innerHTML;
        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        popupWin.document.open();
        popupWin.document.write(`
          <html>
          <title>Acceptance Letter Template</title>
            <head>
              <style>
                @media print{
                  @page {size: portrait; margin: 16mm;}
                  table.template {page-break-after:always}
                  span.yellow {
                    background-color: yellow !important;
                    -webkit-print-color-adjust: exact; 
                  }
                  span.red {
                    color: red !important;
                    font-weight: bold !important;
                    -webkit-print-color-adjust: exact; 
                  }
                  span.page{
                      page-break-after: always;
                  }
                }             
              </style>
            </head>
            <body onload="window.print();window.close()">
              ${printContentsTemplate}     
            </body>
          </html>`
        );
        popupWin.document.close();
    }

    public printGraduateList() {
        let printContents, popupWin, printContentsTemplate;
        printContents = document.getElementById('gradlist-section').innerHTML;
        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        popupWin.document.open();
        popupWin.document.write(`
             <html>
             <title>Graduate List</title>
             <head>
             <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                 <style>
                  @media print{
                    @page {size: landscape; margin: 2mm;}
                    table th, table td { border:1px solid #000;padding:0.5em;}
                    thead.thead-inverse {
                      background-color: yellow !important;
                      -webkit-print-color-adjust: exact; 
                    }
                  }      
                </style>
             </head>
             <body onload="window.print();window.close()">
              ${printContents} 
              </body>
              </html>`
        );
        popupWin.document.close();

    }

    public printDormChangeList() {
        let printContents, popupWin, printContentsTemplate;
        if(this.selectPrint == 1) {
            printContents = document.getElementById('alldormhotelchangelist-section').innerHTML;
        } else if(this.selectPrint == 2) {
            printContents = document.getElementById('dormchangelist-section').innerHTML;
        } else if(this.selectPrint == 3) {
            printContents = document.getElementById('hotelchangelist-section').innerHTML;
        } else if(this.selectPrint == 4) {
            printContents = document.getElementById('walkinchangelist-section').innerHTML;
        } else {
            printContents = document.getElementById('condochangelist-section').innerHTML;
        }
        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        popupWin.document.open();
        popupWin.document.write(`
             <html>
             <title>Dormitory & Hotel Change List</title>
             <head>
             <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                 <style>
                  @media print{
                    @page {size: landscape; margin: 2mm;}
                    table th, table td { border:1px solid #000;padding:0.5em;}
                    thead.thead-inverse {
                      background-color: yellow !important;
                      -webkit-print-color-adjust: exact; 
                    }
                  }      
                </style>
             </head>
             <body onload="window.print();window.close()">
              ${printContents} 
              </body>
              </html>`
        );
        popupWin.document.close();

    }

    public printCafeList() {
        let printContents, popupWin;
        printContents = document.getElementById('cafelist-section').innerHTML;
        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        popupWin.document.open();
        popupWin.document.write(`
             <html>
             <title>QQE Cafe List</title>
             <head>
             <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                 <style>
                  @media print{
                    @page {size: landscape; margin: 2mm;}
                    table th, table td { border:1px solid #000;padding:0.5em;}
                    thead.thead-inverse {
                      background-color: lightpink !important;
                      -webkit-print-color-adjust: exact; 
                    }
                  }      
                </style>
             </head>
             <body onload="window.print();window.close()">
              ${printContents} 
              </body>
              </html>`
        );
        popupWin.document.close();

    }

    public printGAAllInvoices(): void {
        let printContentsTemplate, popupWin;
        printContentsTemplate = document.getElementById('all-ga-invoice-template').innerHTML;
        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        popupWin.document.open();
        popupWin.document.write(`
          <html>
          <title>General Affairs Invoice Template</title>
            <head>
              <style>
                @media print{
                  @page {size: portrait; margin: 0.5mm;}
                  table.template {page-break-after:always}
                  span.yellow {
                    background-color: yellow !important;
                    -webkit-print-color-adjust: exact; 
                  }
                  span.red {
                    color: red !important;
                    font-weight: bold !important;
                    -webkit-print-color-adjust: exact; 
                  }
                  span.page{
                      page-break-after: always;
                  }
                }             
              </style>
            </head>
            <body onload="window.print();window.close()">
              ${printContentsTemplate}     
            </body>
          </html>`
        );
        popupWin.document.close();
    }

    public printList(): void {
        let printContents, popupWin, printContentsTemplate;
        printContents = document.getElementById('list-section').innerHTML;
        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        popupWin.document.open();
        popupWin.document.write(`
            <html>
            <title>Pickup List</title>
              <head>
                <style>
                  @media print{
                    @page {size: landscape; margin: 2mm;}
                    table th, table td { border:1px solid #000;padding;0.5em;}
                    thead.thead-inverse {
                      background-color: yellow !important;
                      -webkit-print-color-adjust: exact; 
                    }
                  }      
                </style>
              </head>
              <body onload="window.print();window.close()">
                ${printContents}     
              </body>
            </html>`
        );
        popupWin.document.close();
    }

    public printTemplate(): void {
        let printContentsTemplate, popupWin;
        printContentsTemplate = document.getElementById('print-all-section-template').innerHTML;
        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        popupWin.document.open();
        popupWin.document.write(`
          <html>
          <title>Template</title>
            <head>
              <style>
                @media print{
                  @page {size: portrait; margin: 6mm;}
                  table.template {page-break-after:always}
                  span.yellow {
                    background-color: yellow !important;
                    -webkit-print-color-adjust: exact; 
                  }
                  span.red {
                    color: red !important;
                    font-weight: bold !important;
                    -webkit-print-color-adjust: exact; 
                  }
                  span.page{
                      page-break-after: always;
                  }
                }             
              </style>
            </head>
            <body onload="window.print();window.close()">
              ${printContentsTemplate}     
            </body>
          </html>`
        );
        popupWin.document.close();
    }

    public printTemplateOthers(): void {
        let printContentsTemplate, popupWin;
        printContentsTemplate = document.getElementById('print-all-section-template').innerHTML;
        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        popupWin.document.open();
        popupWin.document.write(`
          <html dir="rtl" lang="ar">
          <title>Template</title>
            <head>
              <style>
                @media print{
                  @page {size: portrait; margin: 6mm;}
                  table.template {page-break-after:always}
                  span.yellow {
                    background-color: yellow !important;
                    -webkit-print-color-adjust: exact; 
                  }
                  span.red {
                    color: red !important;
                    font-weight: bold !important;
                    -webkit-print-color-adjust: exact; 
                  }
                  span.page{
                      page-break-after: always;
                  }
                }             
              </style>
            </head>
            <body onload="window.print();window.close()">
              ${printContentsTemplate}     
            </body>
          </html>`
        );
        popupWin.document.close();
    }

    public printPerTemplate(passport_name, student_name, id, term, country_code, campus, dorm_name, hotelwalkin) {
        let printTemplateContents, popupWin;
        if (campus == "ITP") {
            if (country_code == "JP") {
                printTemplateContents = document.getElementById('it-jp-template').innerHTML;
                popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
                popupWin.document.open();
                popupWin.document.write(`
              <html>
              <title>Template</title>
                <head>
                  <style>
                    @media print{
                      @page {size: portrait; margin: 10mm;}  
                      span.yellow {
                        background-color: yellow !important;
                        -webkit-print-color-adjust: exact; 
                      }
                      span.red {
                        color: red !important;
                        font-weight: bold !important;
                        -webkit-print-color-adjust: exact; 
                      }        
                    }               
                  </style>
                </head>
                <body onload="window.print();window.close()">
                  <strong><u>
                  ${passport_name}</u>様 &emsp; ID番号 ${id} &emsp; 週数 ${term} &emsp; 
                  宿舍 ${dorm_name} ${hotelwalkin} &emsp; 
                  </strong>
                    ${printTemplateContents}
                </body>
              </html>`
                );
                popupWin.document.close();
            } else if (country_code == "CN") {
                printTemplateContents = document.getElementById('it-ch-template').innerHTML;
                popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
                popupWin.document.open();
                popupWin.document.write(`
              <html>
              <title>Template</title>
                <head>
                  <style>
                    @media print{
                      @page {size: portrait; margin: 5mm;}
                      span.yellow {
                        background-color: yellow !important;
                        -webkit-print-color-adjust: exact; 
                      }
                      span.red {
                        color: red !important;
                        font-weight: bold !important;
                        -webkit-print-color-adjust: exact; 
                      }    
                    }               
                  </style>
                </head>
                <body onload="window.print();window.close()">
                  <strong><u>
                  ${passport_name}</u> &emsp; ID號碼 ${id} &emsp; 周數 ${term} &emsp; 
                  宿舍 ${dorm_name} ${hotelwalkin} &emsp; 
                  </strong>
                  <br/>
                    ${printTemplateContents}
                </body>
              </html>`
                );
                popupWin.document.close();
            } else if (country_code == "TW") {
                printTemplateContents = document.getElementById('it-tw-template').innerHTML;
                popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
                popupWin.document.open();
                popupWin.document.write(`
              <html>
              <title>Template</title>
                <head>
                  <style>
                    @media print{
                      @page {size: portrait; margin: 5mm;}
                      span.yellow {
                        background-color: yellow !important;
                        -webkit-print-color-adjust: exact; 
                      }
                      span.red {
                        color: red !important;
                        font-weight: bold !important;
                        -webkit-print-color-adjust: exact; 
                      }    
                    }               
                  </style>
                </head>
                <body onload="window.print();window.close()">
                  <strong><u>
                  ${passport_name}</u> &emsp; ID號碼 ${id} &emsp; 週数 ${term} &emsp; 
                  宿舍 ${dorm_name} ${hotelwalkin} &emsp; 
                  </strong>
                  <br/>
                  <div style="font-size:15px;">${printTemplateContents}</div>               
                </body>
              </html>`
                );
                popupWin.document.close();
            } else if (country_code == "RU") {
                printTemplateContents = document.getElementById('it-ru-template').innerHTML;
                popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
                popupWin.document.open();
                popupWin.document.write(`
              <html>
              <title>Template</title>
                <head>
                  <style>
                    @media print{
                      @page {size: portrait; margin: 5mm;}
                      span.yellow {
                        background-color: yellow !important;
                        -webkit-print-color-adjust: exact; 
                      }
                      span.red {
                        color: red !important;
                        font-weight: bold !important;
                        -webkit-print-color-adjust: exact; 
                      }    
                    }               
                  </style>
                </head>
                <body onload="window.print();window.close()">
                  <strong><u>
                  ${passport_name}</u> &emsp; ID ${id} &emsp; Weeks ${term} &emsp; 
                  Dorm ${dorm_name} ${hotelwalkin} &emsp; 
                  </strong>
                  <br/>
                  <div style="font-size:19px;">${printTemplateContents}</div>               
                </body>
              </html>`
                );
                popupWin.document.close();
            } else if (country_code == "KR") {
                printTemplateContents = document.getElementById('it-kr-template').innerHTML;
                popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
                popupWin.document.open();
                popupWin.document.write(`
              <html>
              <title>Template</title>
                <head>
                  <style>
                    @media print{
                      @page {size: portrait; margin: 5mm;}
                      span.yellow {
                        background-color: yellow !important;
                        -webkit-print-color-adjust: exact; 
                      }
                      span.red {
                        color: red !important;
                        font-weight: bold !important;
                        -webkit-print-color-adjust: exact; 
                      }    
                    }               
                  </style>
                </head>
                <body onload="window.print();window.close()">
                  <strong><u>
                  ${passport_name}</u> &emsp; ID ${id} &emsp; Weeks ${term} &emsp; 
                  Dorm ${dorm_name} ${hotelwalkin} &emsp; 
                  </strong>
                  <br/>
                  <div style="font-size:17px;">${printTemplateContents}</div>               
                </body>
              </html>`
                );
                popupWin.document.close();
            } else if (country_code == "VN") {
                printTemplateContents = document.getElementById('it-vt-template').innerHTML;
                popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
                popupWin.document.open();
                popupWin.document.write(`
                <html>
                <title>Template</title>
                  <head>
                    <style>
                      @media print{
                        @page {size: portrait; margin: 6mm;}  
                        span.yellow {
                          background-color: yellow !important;
                          -webkit-print-color-adjust: exact; 
                        }
                        span.red {
                          color: red !important;
                          font-weight: bold !important;
                          -webkit-print-color-adjust: exact; 
                        }       
                      }               
                    </style>
                  </head>
                  <body onload="window.print();window.close()">
                    <strong><u>
                    <div style="font-size:14pt;">${passport_name}</u>&emsp;Số ID ${id}&emsp;Tuần ${term}&emsp;    
                    Ký túc xá ${dorm_name} ${hotelwalkin}</div>
                    </strong>
                      <div>${printTemplateContents}</div>
                  </body>
                </html>`
                );
                popupWin.document.close();
            } else if (country_code == "IR") {
                printTemplateContents = document.getElementById('it-ir-template').innerHTML;
                popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
                popupWin.document.open();
                popupWin.document.write(`
                <html dir="rtl" lang="ar">
                <title>Template</title>
                  <head>
                    <style>
                      @media print{
                        @page {size: portrait; margin: 6mm;}  
                        span.yellow {
                          background-color: yellow !important;
                          -webkit-print-color-adjust: exact; 
                        }
                        span.red {
                          color: red !important;
                          font-weight: bold !important;
                          -webkit-print-color-adjust: exact; 
                        }       
                      }               
                    </style>
                  </head>
                  <body onload="window.print();window.close()">
                    <strong><u>
                    <div style="font-size:14pt;">${passport_name}</u>&emsp;ID ${id}&emsp;Weeks ${term}&emsp;
                    Dorm ${dorm_name} ${hotelwalkin}  </div>
                    </strong>
                    <br/>
                      <div>${printTemplateContents}</div>
                  </body>
                </html>`
                );
                popupWin.document.close();
            } else if (country_code == "ARAB") {
                printTemplateContents = document.getElementById('it-sau-template').innerHTML;
                popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
                popupWin.document.open();
                popupWin.document.write(`
                <html dir="rtl" lang="ar">
                <title>Template</title>
                  <head>
                    <style>
                      @media print{
                        @page {size: portrait; margin: 6mm;}  
                        span.yellow {
                          background-color: yellow !important;
                          -webkit-print-color-adjust: exact; 
                        }
                        span.red {
                          color: red !important;
                          font-weight: bold !important;
                          -webkit-print-color-adjust: exact; 
                        }       
                      }               
                    </style>
                  </head>
                  <body onload="window.print();window.close()">
                    <strong><u>
                    <div style="font-size:14pt;">${passport_name}</u>&emsp;ID ${id}&emsp;Weeks ${term}&emsp;  
                    Dorm ${dorm_name} ${hotelwalkin} </div>
                    </strong>
                    <br/>
                      <div>${printTemplateContents}</div>
                  </body>
                </html>`
                );
                popupWin.document.close();
            }

        } else if (campus === "SFC") {
            if (country_code === "CN") {
                printTemplateContents = document.getElementById('sfc-ch-template').innerHTML;
                popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
                popupWin.document.open();
                popupWin.document.write(`
                <html>
                <title>Template</title>
                  <head>
                    <style>
                      @media print{
                        @page {size: portrait; margin: 5mm;}  
                        span.yellow {
                          background-color: yellow !important;
                          -webkit-print-color-adjust: exact; 
                        }
                        span.red {
                          color: red !important;
                          font-weight: bold !important;
                          -webkit-print-color-adjust: exact; 
                        }       
                      }               
                    </style>
                  </head>
                  <body onload="window.print();window.close()">
                    <strong><u>
                    ${passport_name}</u> &emsp; ID號碼 ${id} &emsp; 週数 ${term} &emsp; 
                    宿舍 ${dorm_name} ${hotelwalkin} &emsp; 
                    </strong>
                    <br/>
                      ${printTemplateContents}
                  </body>
                </html>`
                );
                popupWin.document.close();
            } else if (country_code == 'JP') {
                printTemplateContents = document.getElementById('sfc-jp-template').innerHTML;
                popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
                popupWin.document.open();
                popupWin.document.write(`
                <html>
                <title>Template</title>
                  <head>
                    <style>
                      @media print{
                        @page {size: portrait; margin: 5mm;}  
                        span.yellow {
                          background-color: yellow !important;
                          -webkit-print-color-adjust: exact; 
                        }
                        span.red {
                          color: red !important;
                          font-weight: bold !important;
                          -webkit-print-color-adjust: exact; 
                        }       
                      }               
                    </style>
                  </head>
                  <body onload="window.print();window.close()">
                    <strong><u>
                    ${passport_name}</u>様&emsp;ID番号 ${id}&emsp;週数 ${term}&emsp;
                    宿舍 ${dorm_name} ${hotelwalkin}
                    </strong>
                    <br/>
                      ${printTemplateContents}
                  </body>
                </html>`
                );
                popupWin.document.close();
            } else if (country_code == 'TW') {
                printTemplateContents = document.getElementById('sfc-tw-template').innerHTML;
                popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
                popupWin.document.open();
                popupWin.document.write(`
                <html>
                <title>Template</title>
                  <head>
                    <style>
                      @media print{
                        @page {size: portrait; margin: 5mm;}  
                        span.yellow {
                          background-color: yellow !important;
                          -webkit-print-color-adjust: exact; 
                        }
                        span.red {
                          color: red !important;
                          font-weight: bold !important;
                          -webkit-print-color-adjust: exact; 
                        }       
                      }               
                    </style>
                  </head>
                  <body onload="window.print();window.close()">
                    <strong><u>
                    ${passport_name}</u>様 &emsp; ID番号 ${id} &emsp; 週数 ${term} &emsp; 
                    宿舍 ${dorm_name} ${hotelwalkin} &emsp; 
                    </strong>
                    <br/>
                      <div style="font-size:15px;">${printTemplateContents}</div>
                  </body>
                </html>`
                );
                popupWin.document.close();
            } else if (country_code == 'KR') {
                printTemplateContents = document.getElementById('sfc-kr-template').innerHTML;
                popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
                popupWin.document.open();
                popupWin.document.write(`
                <html>
                <title>Template</title>
                  <head>
                    <style>
                      @media print{
                        @page {size: portrait; margin: 5mm;}  
                        span.yellow {
                          background-color: yellow !important;
                          -webkit-print-color-adjust: exact; 
                        }
                        span.red {
                          color: red !important;
                          font-weight: bold !important;
                          -webkit-print-color-adjust: exact; 
                        }       
                      }               
                    </style>
                  </head>
                  <body onload="window.print();window.close()">
                    <strong><u>
                    ${passport_name}</u>님 &emsp; ID번호 ${id} &emsp; 주 ${term} &emsp; 
                    기숙사 ${dorm_name} ${hotelwalkin} &emsp; 
                    </strong>
                    <br/><br/>
                      <div style="font-size:16px;">${printTemplateContents}</div>
                  </body>
                </html>`
                );
                popupWin.document.close();
            } else if (country_code == "RU") {
                printTemplateContents = document.getElementById('sfc-ru-template').innerHTML;
                popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
                popupWin.document.open();
                popupWin.document.write(`
                <html>
                <title>Template</title>
                  <head>
                    <style>
                      @media print{
                        @page {size: portrait; margin: 5mm;}  
                        span.yellow {
                          background-color: yellow !important;
                          -webkit-print-color-adjust: exact; 
                        }
                        span.red {
                          color: red !important;
                          font-weight: bold !important;
                          -webkit-print-color-adjust: exact; 
                        }       
                      }               
                    </style>
                  </head>
                  <body onload="window.print();window.close()">
                    <strong><u>
                    ${passport_name}</u> Name &emsp; ID ${id} &emsp; Weeks ${term} &emsp; 
                    Dorm ${dorm_name} ${hotelwalkin} &emsp; 
                    </strong>
                    <br/><br/>
                      <div style="font-size:18px;">${printTemplateContents}</div>
                  </body>
                </html>`
                );
                popupWin.document.close();
            } else if (country_code == "VN") {
                printTemplateContents = document.getElementById('sfc-vt-template').innerHTML;
                popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
                popupWin.document.open();
                popupWin.document.write(`
                <html>
                <title>Template</title>
                  <head>
                    <style>
                      @media print{
                        @page {size: portrait; margin: 5mm;}  
                        span.yellow {
                          background-color: yellow !important;
                          -webkit-print-color-adjust: exact; 
                        }
                        span.red {
                          color: red !important;
                          font-weight: bold !important;
                          -webkit-print-color-adjust: exact; 
                        }       
                      }               
                    </style>
                  </head>
                  <body onload="window.print();window.close()">
                    <strong><u>
                    ${passport_name}</u>&emsp;Số ID ${id}&emsp;Tuần ${term}&emsp;   
                    Ký túc xá ${dorm_name} ${hotelwalkin} 
                    </strong>
                    <br/>
                      <div style="font-size:15px;">${printTemplateContents}</div>
                  </body>
                </html>`
                );
                popupWin.document.close();
            } else if (country_code == "IR") {
                printTemplateContents = document.getElementById('sfc-ir-template').innerHTML;
                popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
                popupWin.document.open();
                popupWin.document.write(`
                <html dir="rtl" lang="ar">
                <title>Template</title>
                  <head>
                    <style>
                      @media print{
                        @page {size: portrait; margin: 6mm;}  
                        span.yellow {
                          background-color: yellow !important;
                          -webkit-print-color-adjust: exact; 
                        }
                        span.red {
                          color: red !important;
                          font-weight: bold !important;
                          -webkit-print-color-adjust: exact; 
                        }       
                      }               
                    </style>
                  </head>
                  <body onload="window.print();window.close()">
                    <strong><u>
                    <div style="font-size:14pt;">${passport_name}</u>&emsp;ID ${id}&emsp;Weeks ${term}&emsp; 
                    Dorm ${dorm_name} ${hotelwalkin}  </div>
                    </strong>
                    <br/>
                      <div>${printTemplateContents}</div>
                  </body>
                </html>`
                );
                popupWin.document.close();
            } else if (country_code == "ARAB") {
                printTemplateContents = document.getElementById('sfc-sau-template').innerHTML;
                popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
                popupWin.document.open();
                popupWin.document.write(`
                <html dir="rtl" lang="ar">
                <title>Template</title>
                  <head>
                    <style>
                      @media print{
                        @page {size: portrait; margin: 6mm;}  
                        span.yellow {
                          background-color: yellow !important;
                          -webkit-print-color-adjust: exact; 
                        }
                        span.red {
                          color: red !important;
                          font-weight: bold !important;
                          -webkit-print-color-adjust: exact; 
                        }       
                      }               
                    </style>
                  </head>
                  <body onload="window.print();window.close()">
                    <strong><u>
                    <div style="font-size:14pt;">${passport_name}</u>&emsp;ID ${id}&emsp;Weeks ${term}&emsp;
                    Dorm ${dorm_name} ${hotelwalkin}  </div>
                    </strong>
                    <br/>
                      <div>${printTemplateContents}</div>
                  </body>
                </html>`
                );
                popupWin.document.close();
            }

        }
    }

    public printRfdInvoice(country_code, gender, agent_name, passport_name, refund_invoice_number, rfd_checkin_date, rfd_checkout_date, rfd_term, rfd_building_id,
                           rfd_accommodation_id, rfd_room_id, rfd_room_name, rfd_plan_id, rfd_course, rfd_holidays, rfd_entrance_fee, rfd_tuition_accommodation_fee,
                           rfd_room_upgrade_fee, rfd_plan_upgrade_fee, rfd_holiday_fee, rfd_other1_label, rfd_other1_fee, rfd_other2_label, rfd_other2_fee, rfd_agent_commission,
                           rfd_total_cost, rfd_ssp_fee_php, rfd_visa_fee_php, rfd_student_id_card_php, rfd_electrical_fee_php, rfd_i_card_fee_php, rfd_textbook_fee_php,
                           rfd_departure_date, rfd_extention_fee_php, rfd_immigration_fee_php, rfd_acri_fee_php, rfd_photocopy_php, rfd_meal_total_php, rfd_ecc_php,
                           rfd_adjustments_php,rfd_isInvoiceConfirmed,rfd_commission_percentage,refundDiscountList,rfd_discount,phRateInvoice,selectInvoice,
                           sub_total,entrance_fee,pickup_cost,meal_cost,special_holiday_jpy,transfer_fee,
                           extension_fee_jpy,additional_lesson_fee,remittance_fee,special_cost, beginner_cost,
                           discount,commission,sa_country_code,id_number, student_name,sa_passport_name,checkin_date,checkout_date,
                           course,dormitory_room_name,room_id1,term,invoice_number,accommodation_id1,invoiceDiscountList,entrance_date,
                           graduation_date,campus,options_meals,options_pickup,arrival_date,flight_no,arrival_time,memo,domi_info_campus,due_date,
                           commissionPercentange,ssp_fee_php,id_card,electrical_fee_php,i_card_cost,ecc,extention_fee_php,holiday_fee,reservedRoomsList,reservedHotelsList,
                           option_fee_jpy,holidays,courseList,commissionPercentangeInt,sa_phRateInvoice,sa_agent_name,isInvoiceConfirmed,custom1_label,custom1_fee,reservedCondoRoomsList,
                           reservedHotelsRoomsList,reservedWalkinRoomsList,commissionReason,approved_date) {

        let printContentsConfirmationPage, popupWin, roomType;
        let arrivalDate, arrivalTime, cleanArriveTime, checkIn, checkOut,checkInOrig,checkOutOrig, accommodationType, salutation, gndr, entranceDate, gradDate, dueDate, displayAgentName;
        let subTotalNonJPDollars, totalInvoiceNonJPDollars,discountReason,discountValueYen,discountValueDollars,i,len,discountReasonOrig,discountValueDollarsOrig;
        let subTotalNonJPDollarsOrig, totalInvoiceNonJPDollarsOrig, totalAgent, totalDirect;

        let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let currentDate = new Date();
        let day = currentDate.getDate();
        let month = monthNames[currentDate.getMonth()];
        let year = currentDate.getFullYear();

        let accomoName, accomoCondoName, reservedAccomoRoomtype, accommodationHotelOthers, reservedAccomoWalkinRoomtype,
            reservedAccomoHotel, courseStudent, reservedAccomoCondoRoomtype, reservedAccomoHotelsRoomtype;

        let approved = "assets/images/blank.jpg";

        if(rfd_isInvoiceConfirmed == 2) {
            approved = "assets/images/dry_seal5.jpg";
        }

        subTotalNonJPDollars = (rfd_entrance_fee + rfd_holiday_fee + rfd_room_upgrade_fee + rfd_plan_upgrade_fee + rfd_tuition_accommodation_fee + rfd_other1_fee + rfd_other2_fee) - (rfd_discount);
        totalInvoiceNonJPDollars = ((rfd_entrance_fee + rfd_holiday_fee + rfd_room_upgrade_fee + rfd_plan_upgrade_fee + rfd_tuition_accommodation_fee + rfd_other1_fee + rfd_other2_fee) - (rfd_agent_commission + rfd_discount));

        subTotalNonJPDollarsOrig = (entrance_fee + holiday_fee + transfer_fee + sub_total) - discount;
        totalInvoiceNonJPDollarsOrig = ((entrance_fee + holiday_fee + transfer_fee + sub_total) - (commission + discount));

        totalAgent = ((entrance_fee + holiday_fee + transfer_fee + sub_total) - (commission + discount)) - ((rfd_entrance_fee + rfd_holiday_fee + rfd_room_upgrade_fee + rfd_plan_upgrade_fee + rfd_tuition_accommodation_fee + rfd_other1_fee + rfd_other2_fee) - (rfd_agent_commission + rfd_discount));
        totalDirect = (entrance_fee + holiday_fee + transfer_fee + sub_total - discount) - (rfd_entrance_fee + rfd_holiday_fee + rfd_room_upgrade_fee + rfd_plan_upgrade_fee + rfd_tuition_accommodation_fee + rfd_other1_fee + rfd_other2_fee - rfd_discount);

        checkIn = new Date(rfd_checkin_date);
        checkOut = new Date(rfd_checkout_date);
        checkInOrig = new Date(checkin_date);
        checkOutOrig = new Date(checkout_date);

        for (i = 0, len = invoiceDiscountList.length, discountReasonOrig = ""; i < len; i++) {
            discountReasonOrig += invoiceDiscountList[i]['reason'] + "<br>";
        }

        for (i = 0, len = invoiceDiscountList.length, discountValueDollarsOrig = ""; i < len; i++) {
            discountValueDollarsOrig += "-$" + invoiceDiscountList[i]['discount'] + "<br>";
        }

        for (i = 0, len = refundDiscountList.length, discountReason = ""; i < len; i++) {
            discountReason += refundDiscountList[i]['reason'] + "<br>";
        }

        for (i = 0, len = refundDiscountList.length, discountValueDollars = ""; i < len; i++) {
            discountValueDollars += "-$" + refundDiscountList[i]['discount'] + "<br>";
        }

        roomType = '';
        if (rfd_room_id == 1) {
            roomType = '(SINGLE)';
        }
        else if (rfd_room_id == 2) {
            roomType = '(TWIN)';
        }
        else if (rfd_room_id == 3) {
            roomType = '(TRIPLE)';
        }
        else if (rfd_room_id == 4) {
            roomType = '(QUAD)';
        }
        else if (rfd_room_id == 5) {
            roomType = '(HEX)';
        }


        accommodationType = '';
        if (rfd_accommodation_id == '1') {
            accommodationType = 'Share House';
        }
        else if (rfd_accommodation_id == '4') {
            accommodationType = 'Share Room'
        }
        else if (rfd_accommodation_id == '5') {
            accommodationType = 'Executive Room'
        }
        else if (rfd_accommodation_id == '6') {
            accommodationType = 'Deluxe Room'
        }
        else if (rfd_accommodation_id == '2') {
            accommodationType = 'Alba Uno'
        }
        else if (rfd_accommodation_id == '3') {
            accommodationType = 'WaterFront'
        }
        else if (rfd_accommodation_id == '7') {
            accommodationType = 'Walk In'
        }
        else if (rfd_accommodation_id == '8') {
            accommodationType = 'Walk In'
        }
        else if (rfd_accommodation_id == '-1') {
            accommodationType = 'Walk In'
        }

        salutation = 'Mr.';
        if (gender == 2) {
            salutation = 'Ms.';
        }
        gndr = 'Male';
        if (gender == 2) {
            gndr = 'Female';
        }

        if (country_code == 'TW' || country_code == 'CN') {
            displayAgentName = '';
        } else {
            displayAgentName = agent_name;
        }

        /*Dormitory Rooms*/
        for (i = 0, len = reservedRoomsList.length, reservedAccomoRoomtype = ""; i < len; i++) {
            if (reservedRoomsList[i]['accommodation_name'] == '1') {
                accomoName = 'Share House'
            }
            else if (reservedRoomsList[i]['accommodation_name'] == '4') {
                accomoName = 'Share Room'
            }
            else if (reservedRoomsList[i]['accommodation_name'] == '5') {
                accomoName = 'Executive Room'
            }
            else if (reservedRoomsList[i]['accommodation_name'] == '6') {
                accomoName = 'Deluxe Room'
            }
            else if (reservedRoomsList[i]['accommodation_name'] == '7') {
                accomoName = 'Walk In'
            }
            else if (reservedRoomsList[i]['accommodation_name'] == '8') {
                accomoName = 'Walk In'
            }
            else if (reservedRoomsList[i]['accommodation_name'] == '-1') {
                accomoName = 'Walk In'
            }
            reservedAccomoRoomtype += (reservedRoomsList[i]['building_id']==1?'ITP ':'SFC ')
                + accomoName + " (" + (reservedRoomsList[i]['room_type'].toUpperCase()) + ") " + "<br>";
        }

        /*Condo Rooms*/
        for (i = 0, len = reservedCondoRoomsList.length, reservedAccomoCondoRoomtype = ""; i < len; i++) {
            if (reservedCondoRoomsList[i]['accommodation_name'] == '9') {
                accomoCondoName = 'Condo'
            }
            reservedAccomoCondoRoomtype += (reservedCondoRoomsList[i]['building_id']==1?'ITP ':'SFC ')
                + accomoCondoName + "<br>";
        }

        /*Hotels Rooms*/
        for (i = 0, len = reservedHotelsRoomsList.length, reservedAccomoHotelsRoomtype = ""; i < len; i++) {
            if (reservedHotelsRoomsList[i]['accommodation_name'] == '2') {
                accomoCondoName = 'Alba Uno'
            } else {
                accomoCondoName = 'Waterfront'
            }
            reservedAccomoHotelsRoomtype += (reservedHotelsRoomsList[i]['building_id']==1?'ITP ':'SFC ')
                + accomoCondoName + "<br>";
        }

        /*Walkin Rooms*/
        for (i = 0, len = reservedWalkinRoomsList.length, reservedAccomoWalkinRoomtype = ""; i < len; i++) {
            if (reservedWalkinRoomsList[i]['accommodation_name'] == '7') {
                accomoCondoName = 'Walk In'
            } else {
                accomoCondoName = 'Walk In'
            }
            reservedAccomoWalkinRoomtype += (reservedWalkinRoomsList[i]['building_id']==1?'ITP ':'SFC ')
                + accomoCondoName + "<br>";
        }

        /*Hotel / Walkin Rooms*/
        for (i = 0, len = reservedHotelsList.length, reservedAccomoHotel = ""; i < len; i++) {
            reservedAccomoHotel += reservedHotelsList[i]['accommodation'] + "<br>";
        }

        for (i = 0, len = courseList.length, courseStudent = ""; i < len; i++) {
            courseStudent += courseList[i]['memo'].slice(4, 100) + "<br>";
        }

        if(selectInvoice == 2) {
            printContentsConfirmationPage = document.getElementById('print-non-jp-invoice-dollars').innerHTML;
            popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
            popupWin.document.open();
            popupWin.document.write(`
             <html>
             <title>INVOICE-${refund_invoice_number}</title>
             <head>
             <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                 <style>
                     @media print{
                     @page {size: portrait; margin: 0.5mm;}
                      table.template {page-break-after:always}
                      span.yellow {
                          background-color: yellow !important;
                          -webkit-print-color-adjust: exact;
                          }
                      }
                 </style>
              </head>
              <body onload="window.print();window.close()">
                <div style="text-align: right;width: 100%; float:right"><span style="margin-right:4em;font-size: 12pt"><br><b>NO. ${refund_invoice_number}</b></span></div>
                <div align="center"><span><img height="25%" width="75%" src="assets/images/header-invoice.png"/></span></div>
                <span>
                    <img style="position:absolute;right: 0px;top: 55px; z-index: -1;opacity:0.5" height="15%" width="20%" 
                        src="${approved}"/>
                </span>
                <div style="width:100%;margin-bottom: 20px;">
                    <b><div style="margin-right:5em;font-size: 13pt;float:right">Date: ${month} ${day},${year}</div></b>
                    <b><div style="margin-left:5em;font-size: 13pt;float:left">${displayAgentName}</div></b>
                </div>
                <div style="width:100%;text-align: center;font-size: 14pt">
                    <span style="font-weight: bold"><span style="font-size: 15pt;">INVOICE</span><br>
                        This is to bill ${salutation} ${passport_name}<br>
                    </span>
                </div>
                <div style="width:100%;text-align: left;margin-left:5em;font-size: 13pt"> for the following breakdown:</div>
                <div style="width:100%;text-align: left;margin-left:5em;font-size: 13pt;
                    margin-bottom: 20px;"> Period Covered Original:
                    <b>${term} week(s) &nbsp;&nbsp;${checkInOrig.toLocaleDateString()} ~ ${checkInOrig.toLocaleDateString()}</b>
                </div>
                <table style="width:80%;text-align: center;font-size: 14pt;font-weight: bolder;
                            float:right; margin-left:45%;margin-right:11%;margin-bottom: 5px;" border="0">
                    <tr style="font-size: 16pt;line-height: 30px;">
                        <th style="text-align: center;border-bottom: 1px solid #000;">Description</th>
                        <th style="text-align: center;border-bottom: 1px solid #000;">Unit Price</th>
                        <th style="text-align: center;border-bottom: 1px solid #000;">Pax</th>
                        <th style="text-align: center;border-bottom: 1px solid #000;">Total Amount</th>
                    </tr>
                    <tr>
                        <td>Registration Fee</td>
                        <td>${entrance_fee?'$':'$'}${entrance_fee}</td>
                        <td>${entrance_fee?'1':'0'}</td>
                        <td>${entrance_fee?'$':'$'}${entrance_fee}</td>
                    </tr>
                    <tr>
                        <td>Tuition & Accommodation<br>
                        <span style="font-size:12pt;">${reservedAccomoRoomtype}
                        ${reservedAccomoCondoRoomtype}
                        ${reservedAccomoHotelsRoomtype}
                        ${reservedAccomoWalkinRoomtype}
                        ${courseStudent}
                        </span>
                        </td>
                        <td>${sub_total?'$':'$'}${sub_total}</td>
                        <td>${sub_total?'1':'0'}</td>
                        <td>${sub_total?'$':'$'}${sub_total}</td>
                    </tr>
                    <tr>
                        <td>Holiday Fee</td>
                        <td>${holiday_fee?'$':'$'}${holiday_fee}</td>
                        <td>${holiday_fee?'1':'0'}</td>
                        <td>${holiday_fee?'$':'$'}${holiday_fee}</td>
                    </tr>
                    <tr>
                        <td style="font-size:11pt;text-align:center;">${holidays}</td>
                    </tr>
                    <tr>
                        <td>Transfer Fee</td>
                        <td>${transfer_fee?'$':'$'}${transfer_fee}</td>
                        <td>${transfer_fee?'1':'0'}</td>
                        <td>${transfer_fee?'$':'$'}${transfer_fee}</td>
                    </tr>
                    <tr style="color: red">
                        <td>${discountReasonOrig}</td>
                        <td>${discountValueDollarsOrig}</td>
                        <td></td>
                        <td>${discountValueDollarsOrig}</td>
                    </tr>
                    <tr>
                        <td style="border-top: 1px solid #000;" colspan="3"><b>Sub Total:</b></td>
                        <td style="border-top: 1px solid #000;">
                            <div style="width:100%;text-align: center">
                                <span style="font-size: 15pt;font-weight: bolder">
                                    <b> $${subTotalNonJPDollarsOrig}</b>
                                </span>
                            </div>
                        </td>
                    </tr>
                    <tr style="color:red;">
                        <td>Agent Commission
                        ${commissionPercentangeInt?'(':''}${commissionPercentangeInt?commissionPercentangeInt.toFixed(0):''}${commissionPercentangeInt?'%)':''}
                        </td>
                        <td>-$${commission}</td>
                        <td></td>
                        <td>-$${commission}</td>
                    </tr>
                    <tr style="color:black;font-size:12pt;">
                        <td>${commissionReason}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr style="line-height: 30px;">
                        <td style="border-top: 1px solid #000;"><strong style="color:blue">Total Amount</strong></td>
                        <td style="border-top: 1px solid #000;" colspan="2"><b>US DOLLARS:</b></td>
                        <td style="border-top: 1px solid #000;">
                            <div style="width:100%;text-align: center">
                                <span style="font-size: 16pt;font-weight: bolder">
                                    <b>$${totalInvoiceNonJPDollarsOrig}</b>
                                </span>
                            </div>
                        </td>
                    </tr>
                </table>
                <div style="width:100%;text-align: left;margin-left:5em;font-size: 13pt;
                    margin-bottom: 10px;"> Period Covered Refund:
                    <b>${rfd_term} week(s) &nbsp;&nbsp;${checkIn.toLocaleDateString()} ~ ${checkOut.toLocaleDateString()}</b>
                </div>
                <table style="width:80%;text-align: center;font-size: 14pt;font-weight: bolder;
                            float:right; margin-left:45%;margin-right:11%;margin-bottom: 5px;" border="0">
                    <tr style="font-size: 16pt;line-height: 30px;">
                        <th style="text-align: center;border-bottom: 1px solid #000;">Description</th>
                        <th style="text-align: center;border-bottom: 1px solid #000;">Unit Price</th>
                        <th style="text-align: center;border-bottom: 1px solid #000;">Pax</th>
                        <th style="text-align: center;border-bottom: 1px solid #000;">Total Amount</th>
                    </tr>
                    <tr>
                        <td>Registration Fee</td>
                        <td>${rfd_entrance_fee?'$':'$'}${rfd_entrance_fee}</td>
                        <td>${rfd_entrance_fee?'1':'0'}</td>
                        <td>${rfd_entrance_fee?'$':'$'}${rfd_entrance_fee}</td>
                    </tr>
                    <tr>
                        <td>Tuition & Accommodation<br>
                        <span style="font-size:12pt;">${accommodationType}
                        ${roomType}
                        ${rfd_course}
                        </span>
                        </td>
                        <td>${rfd_tuition_accommodation_fee?'$':'$'}${rfd_tuition_accommodation_fee}</td>
                        <td>${rfd_tuition_accommodation_fee?'1':'0'}</td>
                        <td>${rfd_tuition_accommodation_fee?'$':'$'}${rfd_tuition_accommodation_fee}</td>
                    </tr>
                    <tr>
                        <td>${rfd_room_upgrade_fee?'Room Upgrade':''}</td>
                        <td>${rfd_room_upgrade_fee?'$':''}${rfd_room_upgrade_fee?rfd_room_upgrade_fee:''}</td>
                        <td>${rfd_room_upgrade_fee?'1':''}</td>
                        <td>${rfd_room_upgrade_fee?'$':''}${rfd_room_upgrade_fee?rfd_room_upgrade_fee:''}</td>
                    </tr>
                    <tr>
                        <td>${rfd_plan_upgrade_fee?'Plan Upgrade':''}</td>
                        <td>${rfd_plan_upgrade_fee?'$':''}${rfd_plan_upgrade_fee?rfd_plan_upgrade_fee:''}</td>
                        <td>${rfd_plan_upgrade_fee?'1':''}</td>
                        <td>${rfd_plan_upgrade_fee?'$':''}${rfd_plan_upgrade_fee?rfd_plan_upgrade_fee:''}</td>
                    </tr>
                    <tr>
                        <td>${rfd_other1_label?rfd_other1_label:''}</td>
                        <td>${rfd_other1_fee?'$':''}${rfd_other1_fee?rfd_other1_fee:''}</td>
                        <td>${rfd_other1_fee?'1':''}</td>
                        <td>${rfd_other1_fee?'$':''}${rfd_other1_fee?rfd_other1_fee:''}</td>
                    </tr>
                    <tr>
                        <td>${rfd_other2_label?rfd_other2_label:''}</td>
                        <td>${rfd_other2_fee?'$':''}${rfd_other2_fee?rfd_other2_fee:''}</td>
                        <td>${rfd_other2_fee?'1':''}</td>
                        <td>${rfd_other2_fee?'$':''}${rfd_other2_fee?rfd_other2_fee:''}</td>
                    </tr>
                    <tr>
                        <td>Holiday Fee</td>
                        <td>${rfd_holiday_fee?'$':'$'}${rfd_holiday_fee}</td>
                        <td>${rfd_holiday_fee?'1':'0'}</td>
                        <td>${rfd_holiday_fee?'$':'$'}${rfd_holiday_fee}</td>
                    </tr>
                    <tr>
                        <td style="font-size:11pt;text-align:center;">${rfd_holidays}</td>
                    </tr>
                    <tr style="color: red">
                        <td>${discountReason}</td>
                        <td>${discountValueDollars}</td>
                        <td></td>
                        <td>${discountValueDollars}</td>
                    </tr>
                    <tr>
                        <td style="border-top: 1px solid #000;" colspan="3"><b>Sub Total:</b></td>
                        <td style="border-top: 1px solid #000;">
                            <div style="width:100%;text-align: center">
                                <span style="font-size: 15pt;font-weight: bolder">
                                    <b> $${subTotalNonJPDollars}</b>
                                </span>
                            </div>
                        </td>
                    </tr>
                    <tr style="color:red;">
                        <td>Agent Commission(${rfd_commission_percentage.toFixed(0)}%)</td>
                        <td>-$${rfd_agent_commission}</td>
                        <td></td>
                        <td>-$${rfd_agent_commission}</td>
                    </tr>
                    <tr style="line-height: 30px;">
                        <td style="border-top: 1px solid #000;"><strong style="color:blue">Total Amount</strong></td>
                        <td style="border-top: 1px solid #000;" colspan="2"><b>US DOLLARS:</b></td>
                        <td style="border-top: 1px solid #000;">
                            <div style="width:100%;text-align: center">
                                <span style="font-size: 16pt;font-weight: bolder">
                                    <b>$${totalInvoiceNonJPDollars}</b>
                                </span>
                            </div>
                        </td>
                    </tr>
                </table>
                <table style="margin-bottom: 80px;width:80%;text-align: center;font-size: 14pt;font-weight: bolder; float:right; margin-left:45%;margin-right:11%;" border="0">
                    <tr>
                        <td>Original Invoice</td>
                        <td colspan="3">
                            <div style="width:100%;text-align: center">
                            <span style="font-size: 13pt;font-weight: bolder">
                                <b>${totalInvoiceNonJPDollarsOrig}</b>
                            </span>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>Refund Invoice</td>
                        <td colspan="3">
                            <div style="width:100%;text-align: center">
                            <span style="font-size: 13pt;font-weight: bolder">
                                <b>${totalInvoiceNonJPDollars}</b>
                            </span>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>Total</td>
                        <td colspan="3">
                            <div style="width:100%;text-align: center">
                            <span style="font-size: 13pt;font-weight: bolder">
                                <b>${totalAgent}</b>
                            </span>
                            </div>
                        </td>
                    </tr>
                </table>            
                <div style="text-align: right;width: 100%; float:right"><span style="margin-right:4em;font-size: 12pt"><br><br><br><b>NO. ${refund_invoice_number}</b></span></div>
                <div align="center"><span><img height="25%" width="75%" src="assets/images/header-invoice.png"/></span></div>
                <span>
                    <img style="position:absolute;right: 0px;bottom: -230px; z-index: -1;opacity:0.5" height="15%" width="20%" 
                        src="${approved}"/>
                </span>
                <div style="width:100%;text-align: right">
                    <b><span style="margin-right:5em;font-size: 14pt">Date: ${month} ${day},${year}</span></b>
                </div>
                <div style="width:100%;text-align: center;font-size: 14pt">
                    <span style="font-weight: bold"><span style="font-size: 15pt;">INVOICE</span><br>
                        This is to bill ${salutation} ${passport_name}<br>
                    </span>
                </div>
                <div style="width:100%;text-align: left;margin-left:5em;font-size: 13pt"> for the following breakdown:</div>
                <div style="width:100%;text-align: left;margin-left:5em;font-size: 13pt;
                    margin-bottom: 20px;"> Period Covered Original:
                    <b>${term} week(s) &nbsp;&nbsp;${checkInOrig.toLocaleDateString()} ~ ${checkOutOrig.toLocaleDateString()}</b>
                </div>
                <table style="width:80%;text-align: center;font-size: 14pt;font-weight: bolder;
                            float:right; margin-left:45%;margin-right:11%;margin-bottom: 5px;" border="0">
                    <tr style="font-size: 16pt;line-height: 30px;">
                        <th style="text-align: center;border-bottom: 1px solid #000;">Description</th>
                        <th style="text-align: center;border-bottom: 1px solid #000;">Unit Price</th>
                        <th style="text-align: center;border-bottom: 1px solid #000;">Pax</th>
                        <th style="text-align: center;border-bottom: 1px solid #000;">Total Amount</th>
                    </tr>
                    <tr>
                        <td>Registration Fee</td>
                        <td>${entrance_fee?'$':'$'}${entrance_fee}</td>
                        <td>${entrance_fee?'1':'0'}</td>
                        <td>${entrance_fee?'$':'$'}${entrance_fee}</td>
                    </tr>
                    <tr>
                        <td>Tuition & Accommodation<br>
                        <span style="font-size:12pt;">${reservedAccomoRoomtype}
                        ${reservedAccomoCondoRoomtype}
                        ${reservedAccomoHotelsRoomtype}
                        ${reservedAccomoWalkinRoomtype}
                        ${courseStudent}
                        </span>
                        </td>
                        <td>${sub_total?'$':'$'}${sub_total}</td>
                        <td>${sub_total?'1':'0'}</td>
                        <td>${sub_total?'$':'$'}${sub_total}</td>
                    </tr>
                    <tr>
                        <td>Holiday Fee</td>
                        <td>${holiday_fee?'$':'$'}${holiday_fee}</td>
                        <td>${holiday_fee?'1':'0'}</td>
                        <td>${holiday_fee?'$':'$'}${holiday_fee}</td>
                    </tr>
                    <tr>
                        <td style="font-size:11pt;text-align:center;">${holidays}</td>
                    </tr>
                    <tr>
                        <td>Transfer Fee</td>
                        <td>${transfer_fee?'$':'$'}${transfer_fee}</td>
                        <td>${transfer_fee?'1':'0'}</td>
                        <td>${transfer_fee?'$':'$'}${transfer_fee}</td>
                    </tr>
                    <tr style="color: red">
                        <td>${discountReasonOrig}</td>
                        <td>${discountValueDollarsOrig}</td>
                        <td></td>
                        <td>${discountValueDollarsOrig}</td>
                    </tr>
                    <tr>
                        <td style="border-top: 1px solid #000;" colspan="3"><b>Sub Total:</b></td>
                        <td style="border-top: 1px solid #000;">
                            <div style="width:100%;text-align: center">
                                <span style="font-size: 15pt;font-weight: bolder">
                                    <b> $${subTotalNonJPDollarsOrig}</b>
                                </span>
                            </div>
                        </td>
                    </tr>
                    <tr style="line-height: 30px;">
                        <td style="border-top: 1px solid #000;"><strong style="color:blue">Total Amount</strong></td>
                        <td style="border-top: 1px solid #000;" colspan="2"><b>US DOLLARS:</b></td>
                        <td style="border-top: 1px solid #000;">
                            <div style="width:100%;text-align: center">
                                <span style="font-size: 16pt;font-weight: bolder">
                                    <b>$${subTotalNonJPDollarsOrig}</b>
                                </span>
                            </div>
                        </td>
                    </tr>
                </table>
                <div style="width:100%;text-align: left;margin-left:5em;font-size: 13pt;
                    margin-bottom: 10px;"> Period Covered Refund:
                    <b>${rfd_term} week(s) &nbsp;&nbsp;${checkIn.toLocaleDateString()} ~ ${checkOut.toLocaleDateString()}</b>
                </div>
                <table style="width:80%;text-align: center;font-size: 14pt;font-weight: bolder;
                            float:right; margin-left:45%;margin-right:11%;margin-bottom: 5px;" border="0">
                    <tr style="font-size: 16pt;line-height: 30px;">
                        <th style="text-align: center;border-bottom: 1px solid #000;">Description</th>
                        <th style="text-align: center;border-bottom: 1px solid #000;">Unit Price</th>
                        <th style="text-align: center;border-bottom: 1px solid #000;">Pax</th>
                        <th style="text-align: center;border-bottom: 1px solid #000;">Total Amount</th>
                    </tr>
                    <tr>
                        <td>Registration Fee</td>
                        <td>${rfd_entrance_fee?'$':'$'}${rfd_entrance_fee}</td>
                        <td>${rfd_entrance_fee?'1':'0'}</td>
                        <td>${rfd_entrance_fee?'$':'$'}${rfd_entrance_fee}</td>
                    </tr>
                    <tr>
                        <td>Tuition & Accommodation<br>
                        <span style="font-size:12pt;">${accommodationType}
                        ${roomType}
                        ${rfd_course}
                        </span>
                        </span>
                        </td>
                        <td>${rfd_tuition_accommodation_fee?'$':'$'}${rfd_tuition_accommodation_fee}</td>
                        <td>${rfd_tuition_accommodation_fee?'1':'0'}</td>
                        <td>${rfd_tuition_accommodation_fee?'$':'$'}${rfd_tuition_accommodation_fee}</td>
                    </tr>
                    <tr>
                        <td>${rfd_room_upgrade_fee?'Room Upgrade':''}</td>
                        <td>${rfd_room_upgrade_fee?'$':''}${rfd_room_upgrade_fee?rfd_room_upgrade_fee:''}</td>
                        <td>${rfd_room_upgrade_fee?'1':''}</td>
                        <td>${rfd_room_upgrade_fee?'$':''}${rfd_room_upgrade_fee?rfd_room_upgrade_fee:''}</td>
                    </tr>
                    <tr>
                        <td>${rfd_plan_upgrade_fee?'Plan Upgrade':''}</td>
                        <td>${rfd_plan_upgrade_fee?'$':''}${rfd_plan_upgrade_fee?rfd_plan_upgrade_fee:''}</td>
                        <td>${rfd_plan_upgrade_fee?'1':''}</td>
                        <td>${rfd_plan_upgrade_fee?'$':''}${rfd_plan_upgrade_fee?rfd_plan_upgrade_fee:''}</td>
                    </tr>
                    <tr>
                        <td>${rfd_other1_label?rfd_other1_label:''}</td>
                        <td>${rfd_other1_fee?'$':''}${rfd_other1_fee?rfd_other1_fee:''}</td>
                        <td>${rfd_other1_fee?'1':''}</td>
                        <td>${rfd_other1_fee?'$':''}${rfd_other1_fee?rfd_other1_fee:''}</td>
                    </tr>
                    <tr>
                        <td>${rfd_other2_label?rfd_other2_label:''}</td>
                        <td>${rfd_other2_fee?'$':''}${rfd_other2_fee?rfd_other2_fee:''}</td>
                        <td>${rfd_other2_fee?'1':''}</td>
                        <td>${rfd_other2_fee?'$':''}${rfd_other2_fee?rfd_other2_fee:''}</td>
                    </tr>
                    <tr>
                        <td>Holiday Fee</td>
                        <td>${rfd_holiday_fee?'$':'$'}${rfd_holiday_fee}</td>
                        <td>${rfd_holiday_fee?'1':'0'}</td>
                        <td>${rfd_holiday_fee?'$':'$'}${rfd_holiday_fee}</td>
                    </tr>
                    <tr>
                        <td style="font-size:11pt;text-align:center;">${rfd_holidays}</td>
                    </tr>
                    <tr style="color: red">
                        <td>${discountReason}</td>
                        <td>${discountValueDollars}</td>
                        <td></td>
                        <td>${discountValueDollars}</td>
                    </tr>
                    <tr>
                        <td style="border-top: 1px solid #000;" colspan="3"><b>Sub Total:</b></td>
                        <td style="border-top: 1px solid #000;">
                            <div style="width:100%;text-align: center">
                                <span style="font-size: 15pt;font-weight: bolder">
                                    <b> $${subTotalNonJPDollars}</b>
                                </span>
                            </div>
                        </td>
                    </tr>
                    <tr style="line-height: 30px;">
                        <td style="border-top: 1px solid #000;"><strong style="color:blue">Total Amount</strong></td>
                        <td style="border-top: 1px solid #000;" colspan="2"><b>US DOLLARS:</b></td>
                        <td style="border-top: 1px solid #000;">
                            <div style="width:100%;text-align: center">
                                <span style="font-size: 16pt;font-weight: bolder">
                                    <b>$${subTotalNonJPDollars}</b>
                                </span>
                            </div>
                        </td>
                    </tr>
                </table>
                <table style="width:80%;text-align: center;font-size: 14pt;font-weight: bolder; float:right; margin-left:45%;margin-right:11%;margin-bottom: 5px;" border="0">
                    <tr>
                        <td>Original Invoice</td>
                        <td colspan="3">
                            <div style="width:100%;text-align: center">
                            <span style="font-size: 13pt;font-weight: bolder">
                                <b>${subTotalNonJPDollarsOrig}</b>
                            </span>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>Refund Invoice</td>
                        <td colspan="3">
                            <div style="width:100%;text-align: center">
                            <span style="font-size: 13pt;font-weight: bolder">
                                <b>${subTotalNonJPDollars}</b>
                            </span>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>Total</td>
                        <td colspan="3">
                            <div style="width:100%;text-align: center">
                            <span style="font-size: 13pt;font-weight: bolder">
                                <b>${totalDirect}</b>
                            </span>
                            </div>
                        </td>
                    </tr>
                </table>
              </body>
              </html>`
            );
            popupWin.document.close();
        } else {
            popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
            popupWin.document.open();
            popupWin.document.write(`
               <html>
               <title>INVOICE-${refund_invoice_number}</title>
               <head>
               <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
               <style>
                   @media print{
                   @page {size: portrait; margin: 15.5mm;}
                   table.template {page-break-after:always}
                   tr.darkgray {
                          background-color: darkgray !important;
                          -webkit-print-color-adjust: exact;
                          }
               }
               </style>
               </head>
               <body onload="window.print();window.close()">
               <div align="center">
               <table style="width:80%;margin-bottom: 25px;font-size:14pt;">
               <tr>
                   <td>Invoice No</td>
                   <td style="font-size:16pt;font-weight: bolder">${refund_invoice_number}</td>
                   <td align="right" style="font-size:12pt;">${currentDate.toLocaleDateString()}</td>
               </tr>
               </table>
               <table style="width:80%;margin-bottom: 15px;font-size:14pt;">
               <tr>
                   <td style="text-decoration: underline;font-weight: bolder">Student Name</td>
                   <td style="font-size:16pt;font-weight: bolder">${passport_name}</td>
                   <td align="center" style="font-size:16pt;font-weight: bolder">QQ ENGLISH</td>
               </tr>
               </table>
               <table style="width:80%;margin-bottom:50px;">
               <tr align="right">
                   <td colspan="3">REAL GREATENGLISH CORPORATION</td>
               </tr>
               <tr align="right">
                   <td colspan="3">7th Floor Skyrise 4 Building, Cebu I.T Park,<br> Apas, Cebu City, Philippines 6000</td>
               </tr>
               <tr align="right">
                   <td colspan="3">Tel:+63(0)32-479-9042</td>
               </tr>
               <tr align="right">
                   <td colspan="3">Email: info@qqenglish.jp</td>
               </tr>
               </table>
               <table style="width:80%;margin-bottom: 15px;font-size:14pt;">
               <tr style="font-size:14pt;font-weight: bolder">
                   <td align="center">TOTAL:</td>
                   <td align="right" style="border-bottom: 1px solid #000;">${phRateInvoice}</td>
                   <td>PHP</td>
               </tr>
               </table>
               </div>
               <div align="center">
                <table style="width:80%;border-collapse: collapse;border: 1px solid black;margin-bottom:90px;">
                    <tr class="darkgray">
                        <th style="border: 1px solid black;text-align:center;">Description</th>
                        <th style="border: 1px solid black;text-align:center;">Unit Price</th>
                        <th style="border: 1px solid black;text-align:center;">Pax</th>
                        <th style="border: 1px solid black;text-align:center;">Amount</th>
                    </tr>
                    <tr>
                        <td align="left" style="border: 1px solid black;">Tuition fee</td>
                        <td align="right" style="border: 1px solid black;">${phRateInvoice}</td>
                        <td align="right" style="border: 1px solid black;color: red">1</td>
                        <td align="center" style="border: 1px solid black;color: red">${phRateInvoice}</td>
                    </tr>
                    <tr>
                        <td align="left" style="border: 1px solid black;padding: 10px 10px 10px"></td>
                        <td align="right" style="border: 1px solid black;"></td>
                        <td align="right" style="border: 1px solid black;color: red"></td>
                        <td align="center" style="border: 1px solid black;color: red"></td>
                    </tr>
                    <tr>
                        <td align="left" style="border: 1px solid black;padding: 10px 10px 10px"></td>
                        <td align="right" style="border: 1px solid black;"></td>
                        <td align="right" style="border: 1px solid black;color: red"></td>
                        <td align="center" style="border: 1px solid black;color: red"></td>
                    </tr>
                    <tr>
                        <td align="left" style="border: 1px solid black;padding: 10px 10px 10px"></td>
                        <td align="right" style="border: 1px solid black;"></td>
                        <td align="right" style="border: 1px solid black;color: red"></td>
                        <td align="center" style="border: 1px solid black;color: red"></td>
                    </tr>
                    <tr>
                        <td align="left" style="border: 1px solid black;padding: 10px 10px 10px"></td>
                        <td align="right" style="border: 1px solid black;"></td>
                        <td align="right" style="border: 1px solid black;color: red"></td>
                        <td align="center" style="border: 1px solid black;color: red"></td>
                    </tr>
                    <tr>
                        <td align="left" style="border: 1px solid black;padding: 10px 10px 10px"></td>
                        <td align="right" style="border: 1px solid black;"></td>
                        <td align="right" style="border: 1px solid black;color: red"></td>
                        <td align="center" style="border: 1px solid black;color: red"></td>
                    </tr>
                    <tr>
                        <td align="left" style="border: 1px solid black;padding: 10px 10px 10px"></td>
                        <td align="right" style="border: 1px solid black;"></td>
                        <td align="right" style="border: 1px solid black;color: red"></td>
                        <td align="center" style="border: 1px solid black;color: red"></td>
                    </tr>
                    <tr>
                        <td align="left" style="border: 1px solid black;padding: 10px 10px 10px"></td>
                        <td align="right" style="border: 1px solid black;"></td>
                        <td align="right" style="border: 1px solid black;color: red"></td>
                        <td align="center" style="border: 1px solid black;color: red"></td>
                    </tr>
                    <tr>
                        <td align="left" style="border: 1px solid black;padding: 10px 10px 10px"></td>
                        <td align="right" style="border: 1px solid black;"></td>
                        <td align="right" style="border: 1px solid black;color: red"></td>
                        <td align="center" style="border: 1px solid black;color: red"></td>
                    </tr>
                    <tr>
                        <td align="left" style="border: 1px solid black;padding: 10px 10px 10px"></td>
                        <td align="right" style="border: 1px solid black;"></td>
                        <td align="right" style="border: 1px solid black;color: red"></td>
                        <td align="center" style="border: 1px solid black;color: red"></td>
                    </tr>
                    <tr>
                        <td align="left" style="border: 1px solid black;padding: 10px 10px 10px"></td>
                        <td align="right" style="border: 1px solid black;"></td>
                        <td align="right" style="border: 1px solid black;color: red"></td>
                        <td align="center" style="border: 1px solid black;color: red"></td>
                    </tr>
                    <tr>
                        <td align="left" style="border: 1px solid black;padding: 10px 10px 10px"></td>
                        <td align="right" style="border: 1px solid black;"></td>
                        <td align="right" style="border: 1px solid black;color: red"></td>
                        <td align="center" style="border: 1px solid black;color: red"></td>
                    </tr>
                    <tr class="darkgray">
                        <td colspan="2" align="left">Total amount to be paid to RGE</td>
                        <td align="right">PHP</td>
                        <td align="center" style="border:1px solid black;">${phRateInvoice}</td>
                    </tr>
                </table>
                <table style="width:80%;font-size:12pt;">
                    <tr>
                        <td style="font-size:12pt;"><b>Bank account</b></td>
                        <td align="right" style="font-weight:bolder">Payable to</td>
                        <td align="center">REAL GREATENGLISH CORPORATION</td>
                    </tr>
                    <tr>
                        <td align="right" colspan="2" style="font-weight:bolder">Bank Name</td>
                        <td align="center">Unionbank of the Philippines</td>
                    </tr>
                    <tr>
                        <td align="right" colspan="2" style="font-weight:bolder">Branch</td>
                        <td align="center">Asiatown I.T. Park Branch</td>
                    </tr>
                    <tr>
                        <td align="right" colspan="2" style="font-weight:bolder">Account Number</td>
                        <td align="center">001430001656</td>
                    </tr>
                    <tr>
                        <td align="right" colspan="2" style="font-weight:bolder">Swift Code</td>
                        <td align="center">UBPHPHMM</td>
                    </tr>
                </table>
               </div> 
          </body>
          </html>`);
            popupWin.document.close();
        }

    }

    public printExtInvoice(country_code, gender, agent_name, passport_name, ext_invoice_number, ext_checkin_date, ext_checkout_date, ext_term, ext_building_id,
                           ext_accommodation_id, ext_room_id, ext_room_name, ext_plan_id, ext_course, ext_holidays, ext_entrance_fee, ext_tuition_accommodation_fee,
                           ext_room_upgrade_fee, ext_plan_upgrade_fee, ext_holiday_fee, ext_other1_label, ext_other1_fee, ext_other2_label, ext_other2_fee, ext_agent_commission,
                           ext_total_cost, ext_ssp_fee_php, ext_visa_fee_php, ext_student_id_card_php, ext_electrical_fee_php, ext_i_card_fee_php, ext_textbook_fee_php,
                           ext_departure_date, ext_extention_fee_php, ext_immigration_fee_php, ext_acri_fee_php, ext_photocopy_php, ext_meal_total_php, ext_ecc_php,
                           ext_adjustments_php,ext_isInvoiceConfirmed,ext_commission_percentage,invoiceDiscountList,ext_discount,phRateInvoice,selectInvoice) {

        let printContentsConfirmationPage, popupWin, roomType;
        let arrivalDate, arrivalTime, cleanArriveTime, checkIn, checkOut, accommodationType, salutation, gndr, entranceDate, gradDate, dueDate, displayAgentName;
        let subTotalNonJPDollars, totalInvoiceNonJPDollars,discountReason,discountValueYen,discountValueDollars,i,len;

        let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let currentDate = new Date();
        let day = currentDate.getDate();
        let month = monthNames[currentDate.getMonth()];
        let year = currentDate.getFullYear();

        let approved = "assets/images/blank.jpg";

        if(ext_isInvoiceConfirmed == 2) {
            approved = "assets/images/dry_seal5.jpg";
        }

        subTotalNonJPDollars = (ext_entrance_fee + ext_holiday_fee + ext_room_upgrade_fee + ext_plan_upgrade_fee + ext_tuition_accommodation_fee + ext_other1_fee + ext_other2_fee) - (ext_discount);
        totalInvoiceNonJPDollars = ((ext_entrance_fee + ext_holiday_fee + ext_room_upgrade_fee + ext_plan_upgrade_fee + ext_tuition_accommodation_fee + ext_other1_fee + ext_other2_fee) - (ext_agent_commission + ext_discount));

        checkIn = new Date(ext_checkin_date);
        checkOut = new Date(ext_checkout_date);

        for (i = 0, len = invoiceDiscountList.length, discountReason = ""; i < len; i++) {
            discountReason += invoiceDiscountList[i]['reason'] + "<br>";
        }

        for (i = 0, len = invoiceDiscountList.length, discountValueDollars = ""; i < len; i++) {
            discountValueDollars += "-$" + invoiceDiscountList[i]['discount'] + "<br>";
        }

        roomType = '';
        if (ext_room_id == 1) {
            roomType = '(SINGLE)';
        }
        else if (ext_room_id == 2) {
            roomType = '(TWIN)';
        }
        else if (ext_room_id == 3) {
            roomType = '(TRIPLE)';
        }
        else if (ext_room_id == 4) {
            roomType = '(QUAD)';
        }
        else if (ext_room_id == 5) {
            roomType = '(HEX)';
        }


        accommodationType = '';
        if (ext_accommodation_id == '1') {
            accommodationType = 'Share House';
        }
        else if (ext_accommodation_id == '4') {
            accommodationType = 'Share Room'
        }
        else if (ext_accommodation_id == '5') {
            accommodationType = 'Executive Room'
        }
        else if (ext_accommodation_id == '6') {
            accommodationType = 'Deluxe Room'
        }
        else if (ext_accommodation_id == '2') {
            accommodationType = 'Alba Uno'
        }
        else if (ext_accommodation_id == '3') {
            accommodationType = 'WaterFront'
        }
        else if (ext_accommodation_id == '7') {
            accommodationType = 'Walk In'
        }
        else if (ext_accommodation_id == '8') {
            accommodationType = 'Walk In'
        }
        else if (ext_accommodation_id == '-1') {
            accommodationType = 'Walk In'
        }

        salutation = 'Mr.';
        if (gender == 2) {
            salutation = 'Ms.';
        }
        gndr = 'Male';
        if (gender == 2) {
            gndr = 'Female';
        }

        if (country_code == 'TW' || country_code == 'CN') {
            displayAgentName = '';
        } else {
            displayAgentName = agent_name;
        }


        if(selectInvoice == 2) {
            printContentsConfirmationPage = document.getElementById('print-non-jp-invoice-dollars').innerHTML;
            popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
            popupWin.document.open();
            popupWin.document.write(`
             <html>
             <title>INVOICE-${ext_invoice_number}</title>
             <head>
             <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                 <style>
                     @media print{
                     @page {size: portrait; margin: 0.5mm;}
                      table.template {page-break-after:always}
                      span.yellow {
                          background-color: yellow !important;
                          -webkit-print-color-adjust: exact;
                          }
                      }
                 </style>
              </head>
              <body onload="window.print();window.close()">
                <div style="text-align: right;width: 100%; float:right"><span style="margin-right:4em;font-size: 12pt"><br><b>NO. ${ext_invoice_number}</b></span></div>
                <div align="center"><span><img height="25%" width="75%" src="assets/images/header-invoice.png"/></span></div>
                <span>
                    <img style="position:absolute;right: 0px;top: 55px; z-index: -1;opacity:0.5" height="15%" width="20%" 
                        src="${approved}"/>
                </span>
                <div style="width:100%;margin-bottom: 20px;">
                    <b><div style="margin-right:5em;font-size: 13pt;float:right">Date: ${month} ${day},${year}</div></b>
                    <b><div style="margin-left:5em;font-size: 13pt;float:left">${displayAgentName}</div></b>
                </div>
                <div style="width:100%;text-align: center;font-size: 14pt">
                    <span style="font-weight: bold"><span style="font-size: 15pt;">INVOICE</span><br>
                        This is to bill ${salutation} ${passport_name}<br>
                    </span>
                </div>
                <div style="width:100%;text-align: left;margin-left:5em;font-size: 13pt"> for the following breakdown:</div>
                <div style="width:100%;text-align: left;margin-left:5em;font-size: 13pt;
                    margin-bottom: 10px;"> Period Covered:
                    <b>${ext_term} week(s) &nbsp;&nbsp;${checkIn.toLocaleDateString()} ~ ${checkOut.toLocaleDateString()}</b>
                </div>
                <table style="width:80%;text-align: center;font-size: 14pt;font-weight: bolder;
                            float:right; margin-left:45%;margin-right:11%;margin-bottom: 5px;" border="0">
                    <tr style="font-size: 16pt;line-height: 30px;">
                        <th style="text-align: center;border-bottom: 1px solid #000;">Description</th>
                        <th style="text-align: center;border-bottom: 1px solid #000;">Unit Price</th>
                        <th style="text-align: center;border-bottom: 1px solid #000;">Pax</th>
                        <th style="text-align: center;border-bottom: 1px solid #000;">Total Amount</th>
                    </tr>
                    <tr>
                        <td>Registration Fee</td>
                        <td>${ext_entrance_fee?'$':'$'}${ext_entrance_fee}</td>
                        <td>${ext_entrance_fee?'1':'0'}</td>
                        <td>${ext_entrance_fee?'$':'$'}${ext_entrance_fee}</td>
                    </tr>
                    <tr>
                        <td>Tuition & Accommodation<br>
                        <span style="font-size:12pt;">${accommodationType}
                        ${roomType}
                        ${ext_course}
                        </span>
                        </td>
                        <td>${ext_tuition_accommodation_fee?'$':'$'}${ext_tuition_accommodation_fee}</td>
                        <td>${ext_tuition_accommodation_fee?'1':'0'}</td>
                        <td>${ext_tuition_accommodation_fee?'$':'$'}${ext_tuition_accommodation_fee}</td>
                    </tr>
                    <tr>
                        <td>Room Upgrade</td>
                        <td>${ext_room_upgrade_fee?'$':'$'}${ext_room_upgrade_fee}</td>
                        <td>${ext_room_upgrade_fee?'1':'0'}</td>
                        <td>${ext_room_upgrade_fee?'$':'$'}${ext_room_upgrade_fee}</td>
                    </tr>
                    <tr>
                        <td>Plan Upgrade</td>
                        <td>${ext_plan_upgrade_fee?'$':'$'}${ext_plan_upgrade_fee}</td>
                        <td>${ext_plan_upgrade_fee?'1':'0'}</td>
                        <td>${ext_plan_upgrade_fee?'$':'$'}${ext_plan_upgrade_fee}</td>
                    </tr>
                    <tr>
                        <td>${ext_other1_label?ext_other1_label:''}</td>
                        <td>${ext_other1_fee?'$':''}${ext_other1_fee?ext_other1_fee:''}</td>
                        <td>${ext_other1_fee?'1':''}</td>
                        <td>${ext_other1_fee?'$':''}${ext_other1_fee?ext_other1_fee:''}</td>
                    </tr>
                    <tr>
                        <td>${ext_other2_label?ext_other2_label:''}</td>
                        <td>${ext_other2_fee?'$':''}${ext_other2_fee?ext_other2_fee:''}</td>
                        <td>${ext_other2_fee?'1':''}</td>
                        <td>${ext_other2_fee?'$':''}${ext_other2_fee?ext_other2_fee:''}</td>
                    </tr>
                    <tr>
                        <td>Holiday Fee</td>
                        <td>${ext_holiday_fee?'$':'$'}${ext_holiday_fee}</td>
                        <td>${ext_holiday_fee?'1':'0'}</td>
                        <td>${ext_holiday_fee?'$':'$'}${ext_holiday_fee}</td>
                    </tr>
                    <tr>
                        <td style="font-size:11pt;text-align:center;">${ext_holidays}</td>
                    </tr>
                    <tr style="color: red">
                        <td>${discountReason}</td>
                        <td>${discountValueDollars}</td>
                        <td></td>
                        <td>${discountValueDollars}</td>
                    </tr>
                    <tr>
                        <td style="border-top: 1px solid #000;" colspan="3"><b>Sub Total:</b></td>
                        <td style="border-top: 1px solid #000;">
                            <div style="width:100%;text-align: center">
                                <span style="font-size: 15pt;font-weight: bolder">
                                    <b> $${subTotalNonJPDollars}</b>
                                </span>
                            </div>
                        </td>
                    </tr>
                    <tr style="color:red;">
                        <td>Agent Commission(${ext_commission_percentage.toFixed(0)}%)</td>
                        <td>-$${ext_agent_commission}</td>
                        <td></td>
                        <td>-$${ext_agent_commission}</td>
                    </tr>
                    <tr style="line-height: 30px;">
                        <td style="border-top: 1px solid #000;"><strong style="color:blue">Total Amount</strong></td>
                        <td style="border-top: 1px solid #000;" colspan="2"><b>US DOLLARS:</b></td>
                        <td style="border-top: 1px solid #000;">
                            <div style="width:100%;text-align: center">
                                <span style="font-size: 16pt;font-weight: bolder">
                                    <b>$${totalInvoiceNonJPDollars}</b>
                                </span>
                            </div>
                        </td>
                    </tr>
                </table>
                <div style="float: left;margin-left: 5em; font-size: 12pt;">
                        <div style="float:left"><br><strong
                                            style="color:blue">Payment In the School</strong><br><br>
                            SSP<br>
                            VISA Extension Fee<br>
                            Student ID<br>
                            Electricity Fee<br>
                            I-Card<br>
                            Text book<br>
                        </div>
                        <div style="float:right"><br><br><br>
                            Php ${ext_ssp_fee_php}<br>
                            Vary<br>
                            Php ${ext_student_id_card_php}<br>
                            Php ${ext_electrical_fee_php}<br>
                            Php ${ext_i_card_fee_php}<br>
                            Vary<br>
                        </div>
                </div>
                  ${printContentsConfirmationPage}
                <div style="text-align: right;width: 100%; float:right"><span style="margin-right:4em;font-size: 12pt"><br><br><br><b>NO. ${ext_invoice_number}</b></span></div>
                <div align="center"><span><img height="25%" width="75%" src="assets/images/header-invoice.png"/></span></div>
                <span>
                    <img style="position:absolute;right: 0px;bottom: -230px; z-index: -1;opacity:0.5" height="15%" width="20%" 
                        src="${approved}"/>
                </span>
                <div style="width:100%;text-align: right">
                    <b><span style="margin-right:5em;font-size: 14pt">Date: ${month} ${day},${year}</span></b>
                </div>
                <div style="width:100%;text-align: center;font-size: 14pt">
                    <span style="font-weight: bold"><span style="font-size: 15pt;">INVOICE</span><br>
                        This is to bill ${salutation} ${passport_name}<br>
                    </span>
                </div>
                <div style="width:100%;text-align: left;margin-left:5em;font-size: 13pt"> for the following breakdown:</div>
                <div style="width:100%;text-align: left;margin-left:5em;font-size: 13pt;
                    margin-bottom: 10px;"> Period Covered:
                    <b>${ext_term} week(s) &nbsp;&nbsp;${checkIn.toLocaleDateString()} ~ ${checkOut.toLocaleDateString()}</b>
                </div>
                <table style="width:80%;text-align: center;font-size: 14pt;font-weight: bolder;
                            float:right; margin-left:45%;margin-right:11%;margin-bottom: 5px;" border="0">
                    <tr style="font-size: 16pt;line-height: 30px;">
                        <th style="text-align: center;border-bottom: 1px solid #000;">Description</th>
                        <th style="text-align: center;border-bottom: 1px solid #000;">Unit Price</th>
                        <th style="text-align: center;border-bottom: 1px solid #000;">Pax</th>
                        <th style="text-align: center;border-bottom: 1px solid #000;">Total Amount</th>
                    </tr>
                    <tr>
                        <td>Registration Fee</td>
                        <td>${ext_entrance_fee?'$':'$'}${ext_entrance_fee}</td>
                        <td>${ext_entrance_fee?'1':'0'}</td>
                        <td>${ext_entrance_fee?'$':'$'}${ext_entrance_fee}</td>
                    </tr>
                    <tr>
                        <td>Tuition & Accommodation<br>
                        <span style="font-size:12pt;">${accommodationType}
                        ${roomType}
                        ${ext_course}
                        </span>
                        </span>
                        </td>
                        <td>${ext_tuition_accommodation_fee?'$':'$'}${ext_tuition_accommodation_fee}</td>
                        <td>${ext_tuition_accommodation_fee?'1':'0'}</td>
                        <td>${ext_tuition_accommodation_fee?'$':'$'}${ext_tuition_accommodation_fee}</td>
                    </tr>
                    <tr>
                        <td>Room Upgrade</td>
                        <td>${ext_room_upgrade_fee?'$':'$'}${ext_room_upgrade_fee}</td>
                        <td>${ext_room_upgrade_fee?'1':'0'}</td>
                        <td>${ext_room_upgrade_fee?'$':'$'}${ext_room_upgrade_fee}</td>
                    </tr>
                    <tr>
                        <td>Plan Upgrade</td>
                        <td>${ext_plan_upgrade_fee?'$':'$'}${ext_plan_upgrade_fee}</td>
                        <td>${ext_plan_upgrade_fee?'1':'0'}</td>
                        <td>${ext_plan_upgrade_fee?'$':'$'}${ext_plan_upgrade_fee}</td>
                    </tr>
                    <tr>
                        <td>${ext_other1_label?ext_other1_label:''}</td>
                        <td>${ext_other1_fee?'$':''}${ext_other1_fee?ext_other1_fee:''}</td>
                        <td>${ext_other1_fee?'1':''}</td>
                        <td>${ext_other1_fee?'$':''}${ext_other1_fee?ext_other1_fee:''}</td>
                    </tr>
                    <tr>
                        <td>${ext_other2_label?ext_other2_label:''}</td>
                        <td>${ext_other2_fee?'$':''}${ext_other2_fee?ext_other2_fee:''}</td>
                        <td>${ext_other2_fee?'1':''}</td>
                        <td>${ext_other2_fee?'$':''}${ext_other2_fee?ext_other2_fee:''}</td>
                    </tr>
                    <tr>
                        <td>Holiday Fee</td>
                        <td>${ext_holiday_fee?'$':'$'}${ext_holiday_fee}</td>
                        <td>${ext_holiday_fee?'1':'0'}</td>
                        <td>${ext_holiday_fee?'$':'$'}${ext_holiday_fee}</td>
                    </tr>
                    <tr>
                        <td style="font-size:11pt;text-align:center;">${ext_holidays}</td>
                    </tr>
                    <tr style="color: red">
                        <td>${discountReason}</td>
                        <td>${discountValueDollars}</td>
                        <td></td>
                        <td>${discountValueDollars}</td>
                    </tr>
                    <tr>
                        <td style="border-top: 1px solid #000;" colspan="3"><b>Sub Total:</b></td>
                        <td style="border-top: 1px solid #000;">
                            <div style="width:100%;text-align: center">
                                <span style="font-size: 15pt;font-weight: bolder">
                                    <b> $${subTotalNonJPDollars}</b>
                                </span>
                            </div>
                        </td>
                    </tr>
                    <tr style="line-height: 30px;">
                        <td style="border-top: 1px solid #000;"><strong style="color:blue">Total Amount</strong></td>
                        <td style="border-top: 1px solid #000;" colspan="2"><b>US DOLLARS:</b></td>
                        <td style="border-top: 1px solid #000;">
                            <div style="width:100%;text-align: center">
                                <span style="font-size: 16pt;font-weight: bolder">
                                    <b>$${subTotalNonJPDollars}</b>
                                </span>
                            </div>
                        </td>
                    </tr>
                </table>
                <div style="float: left;margin-left: 5em; font-size: 12pt;">
                        <div style="float:left"><br><strong
                                            style="color:blue">Payment In the School</strong><br><br>
                            SSP<br>
                            VISA Extension Fee<br>
                            Student ID<br>
                            Electricity Fee<br>
                            I-Card<br>
                            Text book<br>
                        </div>
                        <div style="float:right"><br><br><br>
                            Php ${ext_ssp_fee_php}<br>
                            Vary<br>
                            Php ${ext_student_id_card_php}<br>
                            Php ${ext_electrical_fee_php}<br>
                            Php ${ext_i_card_fee_php}<br>
                            Vary<br>
                        </div>
                </div>
                  ${printContentsConfirmationPage}
              </body>
              </html>`
            );
            popupWin.document.close();
        } else {
            popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
            popupWin.document.open();
            popupWin.document.write(`
               <html>
               <title>INVOICE-${ext_invoice_number}</title>
               <head>
               <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
               <style>
                   @media print{
                   @page {size: portrait; margin: 15.5mm;}
                   table.template {page-break-after:always}
                   tr.darkgray {
                          background-color: darkgray !important;
                          -webkit-print-color-adjust: exact;
                          }
               }
               </style>
               </head>
               <body onload="window.print();window.close()">
               <div align="center">
               <table style="width:80%;margin-bottom: 25px;font-size:14pt;">
               <tr>
                   <td>Invoice No</td>
                   <td style="font-size:16pt;font-weight: bolder">${ext_invoice_number}</td>
                   <td align="right" style="font-size:12pt;">${currentDate.toLocaleDateString()}</td>
               </tr>
               </table>
               <table style="width:80%;margin-bottom: 15px;font-size:14pt;">
               <tr>
                   <td style="text-decoration: underline;font-weight: bolder">Student Name</td>
                   <td style="font-size:16pt;font-weight: bolder">${passport_name}</td>
                   <td align="center" style="font-size:16pt;font-weight: bolder">QQ ENGLISH</td>
               </tr>
               </table>
               <table style="width:80%;margin-bottom:50px;">
               <tr align="right">
                   <td colspan="3">REAL GREATENGLISH CORPORATION</td>
               </tr>
               <tr align="right">
                   <td colspan="3">7th Floor Skyrise 4 Building, Cebu I.T Park,<br> Apas, Cebu City, Philippines 6000</td>
               </tr>
               <tr align="right">
                   <td colspan="3">Tel:+63(0)32-479-9042</td>
               </tr>
               <tr align="right">
                   <td colspan="3">Email: info@qqenglish.jp</td>
               </tr>
               </table>
               <table style="width:80%;margin-bottom: 15px;font-size:14pt;">
               <tr style="font-size:14pt;font-weight: bolder">
                   <td align="center">TOTAL:</td>
                   <td align="right" style="border-bottom: 1px solid #000;">${phRateInvoice}</td>
                   <td>PHP</td>
               </tr>
               </table>
               </div>
               <div align="center">
                <table style="width:80%;border-collapse: collapse;border: 1px solid black;margin-bottom:90px;">
                    <tr class="darkgray">
                        <th style="border: 1px solid black;text-align:center;">Description</th>
                        <th style="border: 1px solid black;text-align:center;">Unit Price</th>
                        <th style="border: 1px solid black;text-align:center;">Pax</th>
                        <th style="border: 1px solid black;text-align:center;">Amount</th>
                    </tr>
                    <tr>
                        <td align="left" style="border: 1px solid black;">Tuition fee</td>
                        <td align="right" style="border: 1px solid black;">${phRateInvoice}</td>
                        <td align="right" style="border: 1px solid black;color: red">1</td>
                        <td align="center" style="border: 1px solid black;color: red">${phRateInvoice}</td>
                    </tr>
                    <tr>
                        <td align="left" style="border: 1px solid black;padding: 10px 10px 10px"></td>
                        <td align="right" style="border: 1px solid black;"></td>
                        <td align="right" style="border: 1px solid black;color: red"></td>
                        <td align="center" style="border: 1px solid black;color: red"></td>
                    </tr>
                    <tr>
                        <td align="left" style="border: 1px solid black;padding: 10px 10px 10px"></td>
                        <td align="right" style="border: 1px solid black;"></td>
                        <td align="right" style="border: 1px solid black;color: red"></td>
                        <td align="center" style="border: 1px solid black;color: red"></td>
                    </tr>
                    <tr>
                        <td align="left" style="border: 1px solid black;padding: 10px 10px 10px"></td>
                        <td align="right" style="border: 1px solid black;"></td>
                        <td align="right" style="border: 1px solid black;color: red"></td>
                        <td align="center" style="border: 1px solid black;color: red"></td>
                    </tr>
                    <tr>
                        <td align="left" style="border: 1px solid black;padding: 10px 10px 10px"></td>
                        <td align="right" style="border: 1px solid black;"></td>
                        <td align="right" style="border: 1px solid black;color: red"></td>
                        <td align="center" style="border: 1px solid black;color: red"></td>
                    </tr>
                    <tr>
                        <td align="left" style="border: 1px solid black;padding: 10px 10px 10px"></td>
                        <td align="right" style="border: 1px solid black;"></td>
                        <td align="right" style="border: 1px solid black;color: red"></td>
                        <td align="center" style="border: 1px solid black;color: red"></td>
                    </tr>
                    <tr>
                        <td align="left" style="border: 1px solid black;padding: 10px 10px 10px"></td>
                        <td align="right" style="border: 1px solid black;"></td>
                        <td align="right" style="border: 1px solid black;color: red"></td>
                        <td align="center" style="border: 1px solid black;color: red"></td>
                    </tr>
                    <tr>
                        <td align="left" style="border: 1px solid black;padding: 10px 10px 10px"></td>
                        <td align="right" style="border: 1px solid black;"></td>
                        <td align="right" style="border: 1px solid black;color: red"></td>
                        <td align="center" style="border: 1px solid black;color: red"></td>
                    </tr>
                    <tr>
                        <td align="left" style="border: 1px solid black;padding: 10px 10px 10px"></td>
                        <td align="right" style="border: 1px solid black;"></td>
                        <td align="right" style="border: 1px solid black;color: red"></td>
                        <td align="center" style="border: 1px solid black;color: red"></td>
                    </tr>
                    <tr>
                        <td align="left" style="border: 1px solid black;padding: 10px 10px 10px"></td>
                        <td align="right" style="border: 1px solid black;"></td>
                        <td align="right" style="border: 1px solid black;color: red"></td>
                        <td align="center" style="border: 1px solid black;color: red"></td>
                    </tr>
                    <tr>
                        <td align="left" style="border: 1px solid black;padding: 10px 10px 10px"></td>
                        <td align="right" style="border: 1px solid black;"></td>
                        <td align="right" style="border: 1px solid black;color: red"></td>
                        <td align="center" style="border: 1px solid black;color: red"></td>
                    </tr>
                    <tr>
                        <td align="left" style="border: 1px solid black;padding: 10px 10px 10px"></td>
                        <td align="right" style="border: 1px solid black;"></td>
                        <td align="right" style="border: 1px solid black;color: red"></td>
                        <td align="center" style="border: 1px solid black;color: red"></td>
                    </tr>
                    <tr class="darkgray">
                        <td colspan="2" align="left">Total amount to be paid to RGE</td>
                        <td align="right">PHP</td>
                        <td align="center" style="border:1px solid black;">${phRateInvoice}</td>
                    </tr>
                </table>
                <table style="width:80%;font-size:12pt;">
                    <tr>
                        <td style="font-size:12pt;"><b>Bank account</b></td>
                        <td align="right" style="font-weight:bolder">Payable to</td>
                        <td align="center">REAL GREATENGLISH CORPORATION</td>
                    </tr>
                    <tr>
                        <td align="right" colspan="2" style="font-weight:bolder">Bank Name</td>
                        <td align="center">Unionbank of the Philippines</td>
                    </tr>
                    <tr>
                        <td align="right" colspan="2" style="font-weight:bolder">Branch</td>
                        <td align="center">Asiatown I.T. Park Branch</td>
                    </tr>
                    <tr>
                        <td align="right" colspan="2" style="font-weight:bolder">Account Number</td>
                        <td align="center">001430001656</td>
                    </tr>
                    <tr>
                        <td align="right" colspan="2" style="font-weight:bolder">Swift Code</td>
                        <td align="center">UBPHPHMM</td>
                    </tr>
                </table>
               </div> 
          </body>
          </html>`);
            popupWin.document.close();
        }

    }

    public printInvoice(age,gender,invoiceTemplate,paid_amount,sub_total,entrance_fee,pickup_cost,meal_cost,special_holiday_jpy,transfer_fee,
                        extension_fee_jpy,additional_lesson_fee,remittance_fee,special_cost, beginner_cost,
                        discount,commission,country_code,id_number, student_name,passport_name,checkin_date,checkout_date,
                        course,dormitory_room_name,room_id1,term,invoice_number,accommodation_id1,invoiceDiscountList,entrance_date,
                        graduation_date,campus,options_meals,options_pickup,arrival_date,flight_no,arrival_time,memo,domi_info_campus,due_date,
                        commissionPercentange,ssp_fee_php,id_card,electrical_fee_php,i_card_cost,ecc,extention_fee_php,holiday_fee,reservedRoomsList,reservedHotelsList,
                        option_fee_jpy,holidays,courseList,commissionPercentangeInt,phRateInvoice,agent_name,isInvoiceConfirmed,custom1_label,custom1_fee,reservedCondoRoomsList,
                        reservedHotelsRoomsList,reservedWalkinRoomsList,commissionReason,approved_date) {

        let printContentsConfirmationPage, printContentsInvoiceSecondPage, printContentsInvoicePage, popupWin, roomType,
            optionsMeals, optionsPickup;
        let arrivalDate, arrivalTime, cleanArriveTime, checkIn, checkOut, accommodationType, salutation, gndr,
            entranceDate, gradDate, dueDate, displayAgentName;
        let subTotalCommissionJPYen, subTotalJPYen, subTotalNonJPYen, subTotalNonJPDollars, totalInvoiceJPYen,
            totalInvoiceNonJPYen, totalInvoiceNonJPDollars;

        let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let currentDate = new Date();
        let approvedDate = new Date(approved_date);
        let day = approvedDate.getDate();
        let month = monthNames[approvedDate.getMonth()];
        let year = approvedDate.getFullYear();
        let discountReason, discountValueYen, discountValueDollars, i, len;
        let accomoName, accomoCondoName, reservedAccomoRoomtype, accommodationHotelOthers, reservedAccomoWalkinRoomtype,
            reservedAccomoHotel, courseStudent, reservedAccomoCondoRoomtype, reservedAccomoHotelsRoomtype;
        let approved = "assets/images/blank.jpg";

        if(isInvoiceConfirmed == 2) {
            approved = "assets/images/dry_seal5.jpg";
        }

        subTotalCommissionJPYen = sub_total;
        subTotalJPYen = (entrance_fee + sub_total + transfer_fee + remittance_fee + holiday_fee + custom1_fee) - discount;
        subTotalNonJPYen = (sub_total + entrance_fee + transfer_fee + remittance_fee + holiday_fee + custom1_fee);
        subTotalNonJPDollars = (entrance_fee + holiday_fee + transfer_fee + sub_total) - discount;

        totalInvoiceJPYen = (sub_total + entrance_fee + custom1_fee + transfer_fee + remittance_fee + holiday_fee) - (discount + commission);
        totalInvoiceNonJPYen = (sub_total + entrance_fee + custom1_fee + transfer_fee + remittance_fee + holiday_fee) - (discount);
        totalInvoiceNonJPDollars = ((entrance_fee + holiday_fee + transfer_fee + sub_total) - (commission + discount));

        for (i = 0, len = invoiceDiscountList.length, discountReason = ""; i < len; i++) {
            discountReason += invoiceDiscountList[i]['reason'] + "<br>";
        }

        for (i = 0, len = invoiceDiscountList.length, discountValueYen = ""; i < len; i++) {
            discountValueYen += "¥" + invoiceDiscountList[i]['discount'] + "<br>";
        }

        for (i = 0, len = invoiceDiscountList.length, discountValueDollars = ""; i < len; i++) {
            discountValueDollars += "-$" + invoiceDiscountList[i]['discount'] + "<br>";
        }

        /*Dormitory Rooms*/
        for (i = 0, len = reservedRoomsList.length, reservedAccomoRoomtype = ""; i < len; i++) {
            if (reservedRoomsList[i]['accommodation_name'] == '1') {
                accomoName = 'Share House'
            }
            else if (reservedRoomsList[i]['accommodation_name'] == '4') {
                accomoName = 'Share Room'
            }
            else if (reservedRoomsList[i]['accommodation_name'] == '5') {
                accomoName = 'Executive Room'
            }
            else if (reservedRoomsList[i]['accommodation_name'] == '6') {
                accomoName = 'Deluxe Room'
            }
            else if (reservedRoomsList[i]['accommodation_name'] == '7') {
                accomoName = 'Walk In'
            }
            else if (reservedRoomsList[i]['accommodation_name'] == '8') {
                accomoName = 'Walk In'
            }
            else if (reservedRoomsList[i]['accommodation_name'] == '-1') {
                accomoName = 'Walk In'
            }
            reservedAccomoRoomtype += (reservedRoomsList[i]['building_id']==1?'ITP ':'SFC ')
                + accomoName + " (" + (reservedRoomsList[i]['room_type'].toUpperCase()) + ") " + "<br>";
        }

        /*Condo Rooms*/
        for (i = 0, len = reservedCondoRoomsList.length, reservedAccomoCondoRoomtype = ""; i < len; i++) {
            if (reservedCondoRoomsList[i]['accommodation_name'] == '9') {
                accomoCondoName = 'Condo'
            }
            reservedAccomoCondoRoomtype += (reservedCondoRoomsList[i]['building_id']==1?'ITP ':'SFC ')
                + accomoCondoName + "<br>";
        }

        /*Hotels Rooms*/
        for (i = 0, len = reservedHotelsRoomsList.length, reservedAccomoHotelsRoomtype = ""; i < len; i++) {
            if (reservedHotelsRoomsList[i]['accommodation_name'] == '2') {
                accomoCondoName = 'Alba Uno'
            } else {
                accomoCondoName = 'Waterfront'
            }
            reservedAccomoHotelsRoomtype += (reservedHotelsRoomsList[i]['building_id']==1?'ITP ':'SFC ')
                + accomoCondoName + "<br>";
        }

        /*Walkin Rooms*/
        for (i = 0, len = reservedWalkinRoomsList.length, reservedAccomoWalkinRoomtype = ""; i < len; i++) {
            if (reservedWalkinRoomsList[i]['accommodation_name'] == '7') {
                accomoCondoName = 'Walk In'
            } else {
                accomoCondoName = 'Walk In'
            }
            reservedAccomoWalkinRoomtype += (reservedWalkinRoomsList[i]['building_id']==1?'ITP ':'SFC ')
                + accomoCondoName + "<br>";
        }

        /*Hotel / Walkin Rooms*/
        for (i = 0, len = reservedHotelsList.length, reservedAccomoHotel = ""; i < len; i++) {
            reservedAccomoHotel += reservedHotelsList[i]['accommodation'] + "<br>";
        }

        for (i = 0, len = courseList.length, courseStudent = ""; i < len; i++) {
            courseStudent += courseList[i]['memo'].slice(4, 100) + "<br>";
        }

        checkIn = new Date(checkin_date);
        checkOut = new Date(checkout_date);
        entranceDate = new Date(entrance_date);
        gradDate = new Date(graduation_date);
        arrivalDate = new Date(arrival_date);
        if(arrival_time == '1900-01-01 00:00:00') {
            cleanArriveTime = '';
        } else {
            arrivalTime = new Date(arrival_time);
            cleanArriveTime = arrivalTime.toLocaleTimeString().replace(/:(\d{2}) (?=[AP]M)/, " ");
        }
        if(due_date == '1900-01-01 00:00:00') {
            dueDate = '';
        } else {
            dueDate = new Date(due_date).toLocaleDateString('en-US');
        }


        roomType = '';
        if (room_id1 == 1 || room_id1 == 6 || room_id1 == 9 || room_id1 == 12 || room_id1 == 15) {
            roomType = '-SINGLE';
        }
        else if (room_id1 == 2 || room_id1 == 7 || room_id1 == 10 || room_id1 == 13 || room_id1 == 16) {
            roomType = '-TWIN';
        }
        else if (room_id1 == 3 || room_id1 == 8 || room_id1 == 11 || room_id1 == 14 || room_id1 == 17) {
            roomType = '-TRIPLE';
        }
        else if (room_id1 == 4) {
            roomType = '-QUAD';
        }
        else if (room_id1 == 5) {
            roomType = '-HEX';
        }


        accommodationType = '';
        if (accommodation_id1 == '1') {
            accommodationType = '-Share House';
        }
        else if (accommodation_id1 == '4') {
            accommodationType = '-Share Room'
        }
        else if (accommodation_id1 == '5') {
            accommodationType = '-Executive Room'
        }
        else if (accommodation_id1 == '6') {
            accommodationType = '-Deluxe Room'
        }

        accommodationHotelOthers = '';
        if (accommodation_id1 == '2') {
            accommodationHotelOthers = '-Alba Uno'
        }
        else if (accommodation_id1 == '3') {
            accommodationHotelOthers = '-WaterFront'
        }
        else if (accommodation_id1 == '7') {
            accommodationHotelOthers = '-Walk In'
        }
        else if (accommodation_id1 == '8') {
            accommodationHotelOthers = '-Walk In'
        }
        else if (accommodation_id1 == '-1') {
            accommodationHotelOthers = '-Walk In'
        }

        salutation = 'Mr.';
        if (gender == 2) {
            salutation = 'Ms.';
        }

        gndr = 'Male';
        if (gender == 2) {
            gndr = 'Female';
        }

        optionsMeals = 'NO';
        if (options_meals == 1) {
            optionsMeals = 'YES';
        }

        optionsPickup = 'NO';
        if (options_pickup == 1) {
            optionsPickup = 'YES';
        }


        if (country_code == 'TW' || country_code == 'CN') {
            displayAgentName = '';
        } else {
            displayAgentName = agent_name;
        }

        if (invoiceTemplate == 0) {
            printContentsConfirmationPage = document.getElementById('print-jp-invoice-confirmation-page-agent').innerHTML;
            printContentsInvoicePage = document.getElementById('print-jp-invoice-invoice-page').innerHTML;
            popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
            popupWin.document.open();
            popupWin.document.write(`
             <html>
             <title>INVOICE-${invoice_number}</title>
             <head>
             <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                 <style>
                     @media print{
                     @page {
                        size: A4;
                        margin: 2;
                    }
                    @media print {
                        html, body {
                            width: 210mm;
                            height: 297mm;        
                        }
                        .page {
                            margin: 0;
                            border: initial;
                            border-radius: initial;
                            width: initial;
                            min-height: initial;
                            box-shadow: initial;
                            background: initial;
                            page-break-after: always;
                        }
                      table.template {page-break-after:always}
                      span.yellow {
                          background-color: yellow !important;
                          -webkit-print-color-adjust: exact;
                          }
                      tr.lightgray {
                          background-color: lightgray !important;
                          -webkit-print-color-adjust: exact;
                          }
                       tr.borderLine {
                          border-bottom: 1px solid #000;
                          -webkit-print-color-adjust: exact;
                       }
                      }
                 </style>
              </head>
              <body onload="window.print();window.close()">
                <br><br>
                <div align="center"><span><img height="15%" width="80%" src="assets/images/header-invoice.png"/></span></div>
                <div style="width:100%;text-align: center;font-weight: bolder;font-size: 15pt"><b>Confirmation Letter</b></div>
                <div style="width:100%;text-align: left;font-size: 15pt"><span style="margin-left:2em">Reservation number</span><br>
                    <b><span style="margin-left:5em">${id_number}</span></b>
                </div>
                <div style="width:100%;text-align: center;font-size: 15pt">
                    <br>Thank you for choosing QQ English for your upcoming studies abroad.<br>
                    We are pleased to confirm the following arrangements for you and/or your guests.<br><br>
                </div>
                <table frame="box" style="width:80%;text-align: center;font-size: 13pt;font-weight: bolder;
                float:right; margin-left:45%;margin-right:11%;outline-style: solid;margin-bottom: 30px;" border="0">
                    <tr style="line-height: 30px;">
                        <td style="text-align: center;border-bottom: 1px solid #000;">Name:</td>
                        <td style="text-align: left;border-bottom: 1px solid #000;">${passport_name}</td>
                        <td style="text-align: left;border-bottom: 1px solid #000;">${gndr}</td>
                    </tr>
                    <tr>
                        <td style="text-align: center;border-bottom: 1px solid #000;">&nbsp;</td>
                        <td style="text-align: left;border-bottom: 1px solid #000;">${age} Yrs old</td>
                        <td style="text-align: left;border-bottom: 1px solid #000;">${country_code}</td>
                    </tr>
                    <tr>
                        <td style="text-align: center;border-bottom: 1px solid #000;">Accommodation:</td>
                        <td style="text-align: left;border-bottom: 1px solid #000;">
                            ${roomType}
                            ~
                        </td>
                        <td style="text-align: left;border-bottom: 1px solid #000;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td style="text-align: center;border-bottom: 1px solid #000;">&nbsp;</td>
                        <td style="text-align: left;border-bottom: 1px solid #000;">${checkIn.toLocaleDateString('en-US')} &emsp;&emsp; ~  </td>
                        <td style="text-align: left;border-bottom: 1px solid #000;">${checkOut.toLocaleDateString('en-US')}</td>
                    </tr>
                    <tr>
                        <td style="text-align: center;border-bottom: 1px solid #000;">Course:</td>
                        <td style="text-align: left;border-bottom: 1px solid #000;">${course.substring(1, course.length)}</td>
                        <td style="text-align: left;border-bottom: 1px solid #000;">${term} week(s)/day(s)</td>
                    </tr>
                    <tr>
                        <td style="text-align: center;border-bottom: 1px solid #000;">&nbsp;</td>
                        <td style="text-align: left;border-bottom: 1px solid #000;">${entranceDate.toLocaleDateString('en-US')} &emsp;&emsp; ~ </td>
                        <td style="text-align: left;border-bottom: 1px solid #000;">${gradDate.toLocaleDateString('en-US')}</td>
                    </tr>
                    <tr>
                        <td style="text-align: center;border-bottom: 1px solid #000;">Campus:</td>
                        <td style="text-align: left;border-bottom: 1px solid #000;">${campus}</td>
                        <td style="text-align: left;border-bottom: 1px solid #000;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td style="text-align: center;border-bottom: 1px solid #000;">Arrival Date:</td>
                        <td style="text-align: left;border-bottom: 1px solid #000;">${arrivalDate.toLocaleDateString('en-US')} </td>
                        <td style="text-align: left;border-bottom: 1px solid #000;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td style="text-align: center;border-bottom: 1px solid #000;">Flight Number:</td>
                        <td style="text-align: left;border-bottom: 1px solid #000;">${flight_no} </td>
                        <td style="text-align: left;border-bottom: 1px solid #000;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td style="text-align: center;border-bottom: 1px solid #000;">Arrival Time:</td>
                        <td style="text-align: left;border-bottom: 1px solid #000;">${cleanArriveTime} </td>
                        <td style="text-align: left;border-bottom: 1px solid #000;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td style="text-align: center;border-bottom: 1px solid #000;">Remarks:</td>
                        <td style="text-align: left;border-bottom: 1px solid #000;">${memo} </td>
                        <td style="text-align: left;border-bottom: 1px solid #000;">&nbsp;</td>
                    </tr>
                    <tr style="line-height: 30px;">
                        <td style="text-align: center;">Domi Info:</td>
                        <td style="text-align: left;">${domi_info_campus} </td>
                        <td style="text-align: left;">&nbsp;</td>
                    </tr>
                </table>
                ${printContentsConfirmationPage}<br><br>
                <div align="center"><span><img height="15%" width="80%" src="assets/images/header-invoice.png"/></span></div>
                <div style="width:100%;text-align: center;font-weight: bolder;font-size: 15pt"><b>I N V O I C E</b></div>
                <div style="text-align: left;font-size: 13pt;width: 45%; float:left"><span style="margin-left:2em">Reservation number</span><br>
                     <b><span style="margin-left:5em;font-size: 13pt">${id_number}</span></b>
                </div>
                <div style="text-align: right;font-size: 13pt;width: 55%; float:right"><span style="margin-right:2em">Invoice number</span> <br>
                     <b><span style="margin-right:2em;font-size: 13pt">${invoice_number}</span></b>
                </div>
                <div style="width:100%;text-align:center;font-size: 14pt;font-weight: bolder">
                    This is bill  <b>${salutation} ${passport_name}</b>
                </div>
                <div>
                <div style="text-align: left;font-size: 13pt;width: 45%; float:left"><span style="margin-left:2em">for the following breakdown:</span></div>
                <div style="text-align: right;font-size: 13pt;width: 55%; float:right;margin-bottom:5px;">
                    <span style="margin-right:6em">Due date</span><br>
                    <b><span style="margin-right:5em">${dueDate}</span></b>
                </div>
                <table frame="box" style="width:80%;text-align: center;font-size: 12pt;
                     float:right; margin-left:45%;margin-right:11%;outline-style: solid;margin-bottom: 5px;" border="0">
                     <tr style="line-height: 20px;font-size: 14pt;font-weight: bolder" class="borderLine">
                         <th style="text-align: center;border-bottom: 1px solid #000;">Description</th>
                         <th style="border-bottom: 1px solid #000;">Unit Price</th>
                         <th style="border-bottom: 1px solid #000;">Total Amount</th>
                     </tr>
                     <tr>
                         <td>Registration Fee</td>
                         <td>${entrance_fee?'1':'0'}</td>
                         <td>${entrance_fee?'¥':'¥'}${entrance_fee}</td>
                     </tr>
                     <tr>
                        <td><span style="color:red;">*</span>Tuition Fee<br>
                        <span style="font-size:12pt;">
                        ${reservedAccomoRoomtype}
                        ${reservedAccomoCondoRoomtype}
                        ${reservedAccomoHotelsRoomtype}
                        ${reservedAccomoWalkinRoomtype}
                        ${courseStudent}
                        </span>
                         </td>
                         <td>${sub_total?'1':'0'}</td>
                         <td>${sub_total?'¥':'¥'}${sub_total}</td>
                     </tr>
                     <tr>
                         <td>Special Holiday</td>
                         <td>${holiday_fee?'1':'0'}</td>
                         <td>${holiday_fee?'¥':'¥'}${holiday_fee}</td>
                     </tr>
                     <tr>
                         <td>Transfer Fee</td>
                         <td>${transfer_fee?'1':'0'}</td>
                         <td>${transfer_fee?'¥':'¥'}${transfer_fee}</td>
                     </tr>
                     <tr>
                         <td>Remittance Fee</td>
                         <td>${remittance_fee?'1':'0'}</td>
                         <td>${remittance_fee?'¥':'¥'}${remittance_fee}</td>
                     </tr>
                    <tr>
                        <td>${custom1_label?custom1_label:''}</td>
                        <td>${custom1_fee?'1':''}</td>
                        <td>${custom1_fee?'¥':''}${custom1_fee?custom1_fee:''}</td>
                    </tr>
                     <tr style="color: red">
                         <td>${discountReason}</td>
                         <td></td>
                         <td>${discountValueYen}</td>
                     </tr>
                     <tr>
                         <td style="border-top: 1px solid #000;">Sub Total</td>
                         <td style="border-top: 1px solid #000;"></td>
                         <td style="border-top: 1px solid #000;">¥${subTotalJPYen}</td>
                     </tr>
                     <tr style="color:red">
                         <td>Commission ${commissionPercentange?commissionPercentange.toFixed(0):''}${commissionPercentange?'%':''} of *Tuition</td>
                         <td></td>
                         <td>-¥ ${commission}</td>
                     </tr>
                     <tr style="color:black;font-size:12pt;">
                        <td>${commissionReason}</td>
                        <td></td>
                        <td></td>
                    </tr>
                     <tr style="font-size: 13pt;line-height:25px;">
                         <td style="font-weight: bold;border-top: 1px solid #000;">Total Amount:</td>
                         <td style="border-top: 1px solid #000;"></td>
                         <td style="font-weight: bold;border-top: 1px solid #000;">
                             ¥${totalInvoiceJPYen}
                         </td>
                     </tr>
                 </table>
                  <div style="float:left">
                        <span style="margin-left:6em"><strong style="color:blue">Payment In the School</strong></span>
                        <table frame="box" style="margin-left:4em;text-align: center;font-size: 12pt;font-weight: bolder;
                            outline-style: solid;margin-bottom:4px;" border="0">
                            <tr>
                                <th style="text-align: center;">Visa Extention Fee</th>
                                <th style="text-align: center;">Vary</th>
                            </tr>
                            <tr>
                                <td>SSP</td>
                                <td>Php ${ssp_fee_php}</td>
                            </tr>
                            <tr>
                                <td>Student ID</td>
                                <td>Php ${id_card}</td>
                            </tr>
                            <tr>
                                <td>Electricity Fee</td>
                                <td>Php ${electrical_fee_php}</td>
                            </tr>
                            <tr>
                                <td>I-Card</td>
                                <td>Php ${i_card_cost}</td>
                            </tr>
                            <tr>
                                <td>ECC</td>
                                <td>Php ${ecc}</td>
                            </tr>
                            <tr>
                                <td>Extension Fee</td>
                                <td>Php ${extention_fee_php}</td>
                            </tr>
                        </table>
                  </div>
                 ${printContentsInvoicePage}
                 <div style="width: 45%; float:left">
                        <div style="text-align: left;font-size: 11pt;font-weight: bold">
                            <span style="margin-left:5em"><strong style="color:blue">Account Number</strong><br></span>
                            <span style="margin-left:5em">カ）キュウキュウ　イングリッシュ <br></span>
                            <span style="margin-left:5em">三菱東京UFJ銀行<br></span>
                        </div>
                 </div>
                 <div style="width: 55%; float:right">
                        <div style="text-align: left;font-size: 11pt;font-weight: bold">
                            <span style="margin-left:5em">笹塚支店<br></span>
                            <span style="margin-left:5em">普通　1316002<br></span>
                            <span style="margin-left:5em">口座名義　株式会社QQ English<br></span>
                            <span style="margin-left:5em">Due date ${dueDate}<br></span>
                        </div>
                 </div>
              </body>
              `);
            popupWin.document.close();
        }
        else if (invoiceTemplate == 1) {
            printContentsInvoiceSecondPage = document.getElementById('print-non-jp-invoice-yen').innerHTML;
            printContentsInvoicePage = document.getElementById('print-jp-invoice-invoice-page').innerHTML;
            printContentsConfirmationPage = document.getElementById('print-jp-invoice-confirmation-page').innerHTML;
            popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
            popupWin.document.open();
            popupWin.document.write(`
            <html>
            <title>INVOICE-${invoice_number}</title>
            <head>
             <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                 <style>
                     @media print{
                     @page {
                        size: A4;
                        margin: 2;
                    }
                    @media print {
                        html, body {
                            width: 210mm;
                            height: 297mm;        
                        }
                        .page {
                            margin: 0;
                            border: initial;
                            border-radius: initial;
                            width: initial;
                            min-height: initial;
                            box-shadow: initial;
                            background: initial;
                            page-break-after: always;
                        }
                      table.template {page-break-after:always}
                      span.yellow {
                          background-color: yellow !important;
                          -webkit-print-color-adjust: exact;
                          }
                      tr.lightgray {
                          background-color: lightgray !important;
                          -webkit-print-color-adjust: exact;
                          }
                       tr.borderLine {
                          border-bottom: 1px solid #000;
                          -webkit-print-color-adjust: exact;
                       }
                      }
                 </style>
              </head>
             <body onload="window.print();window.close()">
                <br><br>
                <div align="center"><span><img height="15%" width="80%" src="assets/images/header-invoice.png"/></span></div>
                <div style="width:100%;text-align: center;font-weight: bolder;font-size: 15pt"><b>Confirmation Letter</b></div>
                <div style="width:100%;text-align: left;font-size: 15pt"><span style="margin-left:2em">Reservation number</span><br>
                    <b><span style="margin-left:5em">${id_number}</span></b>
                </div>
                <div style="width:100%;text-align: center;font-size: 15pt">
                    <br>Thank you for choosing QQ English for your upcoming studies abroad.<br>
                    We are pleased to confirm the following arrangements for you and/or your guests.<br><br>
                </div>
                <table frame="box" style="width:80%;text-align: center;font-size: 13pt;font-weight: bolder;
                float:right; margin-left:45%;margin-right:11%;outline-style: solid;margin-bottom: 30px;" border="0">
                    <tr style="line-height: 30px;">
                        <td style="text-align: center;border-bottom: 1px solid #000;">Name:</td>
                        <td style="text-align: left;border-bottom: 1px solid #000;">${passport_name}</td>
                        <td style="text-align: left;border-bottom: 1px solid #000;">${gndr}</td>
                    </tr>
                    <tr>
                        <td style="text-align: center;border-bottom: 1px solid #000;">&nbsp;</td>
                        <td style="text-align: left;border-bottom: 1px solid #000;">${age} Yrs old</td>
                        <td style="text-align: left;border-bottom: 1px solid #000;">${country_code}</td>
                    </tr>
                    <tr>
                        <td style="text-align: center;border-bottom: 1px solid #000;">Accommodation:</td>
                        <td style="text-align: left;border-bottom: 1px solid #000;">
                            ${roomType}
                            ~
                        </td>
                        <td style="text-align: left;border-bottom: 1px solid #000;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td style="text-align: center;border-bottom: 1px solid #000;">&nbsp;</td>
                        <td style="text-align: left;border-bottom: 1px solid #000;">${checkIn.toLocaleDateString('en-US')} &emsp;&emsp; ~  </td>
                        <td style="text-align: left;border-bottom: 1px solid #000;">${checkOut.toLocaleDateString('en-US')}</td>
                    </tr>
                    <tr>
                        <td style="text-align: center;border-bottom: 1px solid #000;">Course:</td>
                        <td style="text-align: left;border-bottom: 1px solid #000;">${course.substring(1, course.length)}</td>
                        <td style="text-align: left;border-bottom: 1px solid #000;">${term} week(s)/day(s)</td>
                    </tr>
                    <tr>
                        <td style="text-align: center;border-bottom: 1px solid #000;">&nbsp;</td>
                        <td style="text-align: left;border-bottom: 1px solid #000;">${entranceDate.toLocaleDateString('en-US')} &emsp;&emsp; ~ </td>
                        <td style="text-align: left;border-bottom: 1px solid #000;">${gradDate.toLocaleDateString('en-US')}</td>
                    </tr>
                    <tr>
                        <td style="text-align: center;border-bottom: 1px solid #000;">Campus:</td>
                        <td style="text-align: left;border-bottom: 1px solid #000;">${campus}</td>
                        <td style="text-align: left;border-bottom: 1px solid #000;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td style="text-align: center;border-bottom: 1px solid #000;">Arrival Date:</td>
                        <td style="text-align: left;border-bottom: 1px solid #000;">${arrivalDate.toLocaleDateString('en-US')} </td>
                        <td style="text-align: left;border-bottom: 1px solid #000;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td style="text-align: center;border-bottom: 1px solid #000;">Flight Number:</td>
                        <td style="text-align: left;border-bottom: 1px solid #000;">${flight_no} </td>
                        <td style="text-align: left;border-bottom: 1px solid #000;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td style="text-align: center;border-bottom: 1px solid #000;">Arrival Time:</td>
                        <td style="text-align: left;border-bottom: 1px solid #000;">${cleanArriveTime} </td>
                        <td style="text-align: left;border-bottom: 1px solid #000;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td style="text-align: center;border-bottom: 1px solid #000;">Remarks:</td>
                        <td style="text-align: left;border-bottom: 1px solid #000;">${memo} </td>
                        <td style="text-align: left;border-bottom: 1px solid #000;">&nbsp;</td>
                    </tr>
                    <tr style="line-height: 30px;">
                        <td style="text-align: center;">Domi Info:</td>
                        <td style="text-align: left;">${domi_info_campus} </td>
                        <td style="text-align: left;">&nbsp;</td>
                    </tr>
                </table>
                ${printContentsConfirmationPage}<br><br>
            <div align="center"><img height=15% width=80% src="assets/images/header-invoice.png"/></div>
            <div style="text-align: left;font-size: 13pt;width: 45%; float:left"><span style="margin-left:2em">Reservation number</span><br>
                <b><span style="margin-left:5em;font-size: 13pt">${id_number}</span></b>
            </div>
            <div style="text-align: right;font-size: 13pt;width: 55%; float:right"><span style="margin-right:2em">Invoice number</span> <br>
                <b><span style="margin-right:2em;font-size: 13pt">${invoice_number}</span></b>
            </div>
            <div style="width:100%;text-align: center;margin-bottom:15px;font-size: 14pt;"><b>${salutation} ${passport_name}</b>
                <br> ${checkIn.toLocaleDateString('en-US')} ~ ${checkOut.toLocaleDateString('en-US')}
                <br>
            </div>
            <div style="width:100%;text-align: left;margin-bottom:15px;;font-size: 13pt;"><span style="margin-left:2em">for the following breakdown:</span></div>
            <table frame="box" style="width:80%;text-align: center;font-size: 13pt;
                   float:right; margin-left:45%;margin-right:11%;outline-style: solid;margin-bottom: 15px;" border="0">
                <tr style="line-height: 30px;font-size: 15pt;font-weight: bolder;">
                    <th style="text-align: center;border-bottom: 1px solid #000;">Description</th>
                    <th style="text-align: center;border-bottom: 1px solid #000;">Unit Price</th>
                    <th style="text-align: center;border-bottom: 1px solid #000;">Total Amount</th>
                </tr>
                <tr>
                    <td>Registration Fee</td>
                    <td>${entrance_fee?'1':'0'}</td>
                    <td>${entrance_fee?'¥':'¥'}${entrance_fee}</td>
                </tr>
                <tr>
                    <td>Tuition Fee
                        <br>
                        <span style="font-size:12pt;">
                        ${reservedAccomoRoomtype}
                        ${reservedAccomoCondoRoomtype}
                        ${reservedAccomoHotelsRoomtype}
                        ${reservedAccomoWalkinRoomtype}
                        ${courseStudent}
                        </span>
                    </td>
                    <td>${sub_total?'1':'0'}</td>
                    <td>${sub_total?'¥':'¥'}${sub_total}</td>
                </tr>
                <tr>
                    <td>Special Holiday</td>
                    <td>${holiday_fee?'1':'0'}</td>
                    <td>${holiday_fee?'¥':'¥'}${holiday_fee}</td>
                </tr>
                <tr>
                    <td>Transfer Fee</td>
                    <td>${transfer_fee?'1':'0'}</td>
                    <td>${transfer_fee?'¥':'¥'}${transfer_fee}</td>
                </tr>
                <tr>
                    <td>Remittance fee</td>
                    <td>${remittance_fee?'1':'0'}</td>
                    <td>${remittance_fee?'¥':'¥'}${remittance_fee}</td>
                </tr>
                <tr>
                    <td>${custom1_label?custom1_label:''}</td>
                    <td>${custom1_fee?'1':''}</td>
                    <td>${custom1_fee?'¥':''}${custom1_fee?custom1_fee:''}</td>
                </tr>
                <tr style="color: red">
                    <td>${discountReason}</td>
                    <td></td>
                    <td>${discountValueYen}</td>
                </tr>
                <tr style="line-height:25px;font-weight:bolder;font-size:15pt;">
                    <td style="border-top: 1px solid #000;">Total Amount:</td>
                    <td style="border-top: 1px solid #000;"></td>
                    <td style="border-top: 1px solid #000;">¥${totalInvoiceNonJPYen}</td>
                </tr>
            </table>
            <div style="float:left">
                <span style="margin-left:6em"><strong style="color:blue">Payment In the School</strong></span>
                <table frame="box" style="margin-left:4em;text-align: center;font-size: 12pt;font-weight: bolder;
                    outline-style: solid;" border="0">
                <tr>
                    <th>Visa Extention Fee</th>
                    <th>Vary</th>
                </tr>
                <tr>
                    <td>SSP</td>
                    <td>Php ${ssp_fee_php}</td>
                </tr>
                <tr>
                    <td>Student ID</td>
                    <td>Php ${id_card}</td>
                </tr>
                <tr>
                    <td>Electricity Fee</td>
                    <td>Php ${electrical_fee_php}</td>
                </tr>
                <tr>
                    <td>I-Card</td>
                    <td>Php ${i_card_cost}</td>
                </tr>
                <tr>
                    <td>ECC</td>
                    <td>Php ${ecc}</td>
                </tr>
                <tr>
                    <td>Extension Fee</td>
                    <td>Php ${extention_fee_php}</td>
                </tr>
                </table>
            </div>
            ${printContentsInvoiceSecondPage}
            <div style="width: 45%; float:left; margin-top:7px;">
                <div style="text-align: left;font-size: 11pt;font-weight: bold">
                    <span style="margin-left:5em"><strong style="color:blue">Account Number</strong><br></span>
                    <span style="margin-left:5em">カ）キュウキュウイングリッシュ<br></span>
                    <span style="margin-left:5em">三菱UFJ銀行<br></span>
                </div>
            </div>
            <div style="width: 55%; float:right; margin-top:7px;">
                <div style="text-align: left;font-size: 11pt;font-weight: bold">
                    <span style="margin-left:5em">笹塚支店<br></span>
                    <span style="margin-left:5em">当座　0741396<br></span>
                    <span style="margin-left:5em">Due date ${dueDate}<br></span>
                </div>
            </div>
            </body>
            </html>`
            );
            popupWin.document.close();
        }
        else if (invoiceTemplate == 2) {
            printContentsConfirmationPage = document.getElementById('print-non-jp-invoice-dollars').innerHTML;
            popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
            popupWin.document.open();
            popupWin.document.write(`
             <html>
             <title>INVOICE-${invoice_number}</title>
             <head>
             <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                 <style>
                     @media print{
                     @page {size: portrait; margin: 0.5mm;}
                      table.template {page-break-after:always}
                      span.yellow {
                          background-color: yellow !important;
                          -webkit-print-color-adjust: exact;
                          }
                      }
                 </style>
              </head>
              <body onload="window.print();window.close()">
                <div style="text-align: right;width: 100%; float:right"><span style="margin-right:4em;font-size: 12pt"><br><b>NO. ${invoice_number}</b></span></div>
                <div align="center"><span><img height="30%" width="80%" src="assets/images/header-invoice.png"/></span></div>
                <span>
                    <img style="position:absolute;right: 0px;top: 55px; z-index: -1;opacity:0.5" height="15%" width="20%" 
                        src="${approved}"/>
                </span>
                <div style="width:100%;margin-bottom: 20px;">
                    <b><div style="margin-right:5em;font-size: 13pt;float:right">Date: ${month} ${day},${year}</div></b>
                    <b><div style="margin-left:5em;font-size: 13pt;float:left">${displayAgentName}</div></b>
                </div>
                <div style="width:100%;text-align: center;font-size: 14pt">
                    <span style="font-weight: bold"><span style="font-size: 15pt;">INVOICE</span><br>
                        This is to bill ${salutation} ${passport_name}<br>
                    </span>
                </div>
                <div style="width:100%;text-align: left;margin-left:5em;font-size: 13pt"> for the following breakdown:</div>
                <div style="width:100%;text-align: left;margin-left:5em;font-size: 13pt;
                    margin-bottom: 20px;"> Period Covered:
                    <b>${term} week(s) &nbsp;&nbsp;${checkIn.toLocaleDateString()} ~ ${checkOut.toLocaleDateString()}</b>
                </div>
                <table style="width:80%;text-align: center;font-size: 14pt;font-weight: bolder;
                            float:right; margin-left:45%;margin-right:11%;margin-bottom: 5px;" border="0">
                    <tr style="font-size: 16pt;line-height: 30px;">
                        <th style="text-align: center;border-bottom: 1px solid #000;">Description</th>
                        <th style="text-align: center;border-bottom: 1px solid #000;">Unit Price</th>
                        <th style="text-align: center;border-bottom: 1px solid #000;">Pax</th>
                        <th style="text-align: center;border-bottom: 1px solid #000;">Total Amount</th>
                    </tr>
                    <tr>
                        <td>Registration Fee</td>
                        <td>${entrance_fee?'$':'$'}${entrance_fee}</td>
                        <td>${entrance_fee?'1':'0'}</td>
                        <td>${entrance_fee?'$':'$'}${entrance_fee}</td>
                    </tr>
                    <tr>
                        <td>Tuition & Accommodation<br>
                        <span style="font-size:12pt;">${reservedAccomoRoomtype}
                        ${reservedAccomoCondoRoomtype}
                        ${reservedAccomoHotelsRoomtype}
                        ${reservedAccomoWalkinRoomtype}
                        ${courseStudent}
                        </span>
                        </td>
                        <td>${sub_total?'$':'$'}${sub_total}</td>
                        <td>${sub_total?'1':'0'}</td>
                        <td>${sub_total?'$':'$'}${sub_total}</td>
                    </tr>
                    <tr>
                        <td>Holiday Fee</td>
                        <td>${holiday_fee?'$':'$'}${holiday_fee}</td>
                        <td>${holiday_fee?'1':'0'}</td>
                        <td>${holiday_fee?'$':'$'}${holiday_fee}</td>
                    </tr>
                    <tr>
                        <td style="font-size:11pt;text-align:center;">${holidays}</td>
                    </tr>
                    <tr>
                        <td>Transfer Fee</td>
                        <td>${transfer_fee?'$':'$'}${transfer_fee}</td>
                        <td>${transfer_fee?'1':'0'}</td>
                        <td>${transfer_fee?'$':'$'}${transfer_fee}</td>
                    </tr>
                    <tr style="color: red">
                        <td>${discountReason}</td>
                        <td>${discountValueDollars}</td>
                        <td></td>
                        <td>${discountValueDollars}</td>
                    </tr>
                    <tr>
                        <td style="border-top: 1px solid #000;" colspan="3"><b>Sub Total:</b></td>
                        <td style="border-top: 1px solid #000;">
                            <div style="width:100%;text-align: center">
                                <span style="font-size: 15pt;font-weight: bolder">
                                    <b> $${subTotalNonJPDollars}</b>
                                </span>
                            </div>
                        </td>
                    </tr>
                    <tr style="color:red;">
                        <td>Agent Commission
                        ${commissionPercentangeInt?'(':''}${commissionPercentangeInt?commissionPercentangeInt.toFixed(0):''}${commissionPercentangeInt?'%)':''}
                        </td>
                        <td>-$${commission}</td>
                        <td></td>
                        <td>-$${commission}</td>
                    </tr>
                    <tr style="color:black;font-size:12pt;">
                        <td>${commissionReason}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr style="line-height: 30px;">
                        <td style="border-top: 1px solid #000;"><strong style="color:blue">Total Amount</strong></td>
                        <td style="border-top: 1px solid #000;" colspan="2"><b>US DOLLARS:</b></td>
                        <td style="border-top: 1px solid #000;">
                            <div style="width:100%;text-align: center">
                                <span style="font-size: 16pt;font-weight: bolder">
                                    <b>$${totalInvoiceNonJPDollars}</b>
                                </span>
                            </div>
                        </td>
                    </tr>
                </table>
                <div style="float: left;margin-left: 5em; font-size: 13pt;">
                        <div style="float:left"><br><strong
                                            style="color:blue">Payment In the School</strong><br><br>
                            SSP<br>
                            VISA Extension Fee<br>
                            Student ID<br>
                        </div>
                        <div style="float:left;margin-left: 0.2em;"><br><br><br>
                            Php ${ssp_fee_php}<br>
                            Vary<br>
                            Php ${id_card}<br>
                        </div>
                        <div style="float:left;margin-left: 5em;"><br><strong
                                            style="color:blue"></strong><br><br>
                            Electricity Fee<br>
                            I-Card<br>
                            Text book<br>
                        </div>
                        <div style="float:right;margin-left: 2em;"><br><br><br>
                            Php ${electrical_fee_php}<br>
                            Php ${i_card_cost}<br>
                            Vary<br>
                        </div>
                </div>
                <div style="float: left;margin-left: 5em; font-size: 13pt;">
                    <div style="width: 30%; float:left"><br><strong style="color:blue">ACCOUNT NUMBER</strong><br><br>
                        BANK NAME:<br>
                        ACCOUNT NUMBER:<br>
                        COMPANY NAME:<br>
                        BANK ADDRESS:<br><br>
                        SWIFT CODE:<br>
                        BRANCH CODE:<br>
                        DUE DATE:<br>
                    </div>
                    <div style="width: 70%; float:right;margin-bottom: 150px;"><br><br><br>
                        METROPOLITAN BANK AND TRUST COMPANY<br>
                        602-7602-908956<br>
                        REAL GREATENGLISH CORPORATION<br>
                        CEBU SALINAS BRANCH - AMON TRADING CORP. <br>BLDG.,SALINAS DRIVE, CEBU CITY 6000
                        MBTCPHMM<br>
                        602<br>
                        ${dueDate}<br>
                    </div>
                </div>
                <div style="text-align: right;width: 100%; float:right"><span style="margin-right:4em;font-size: 12pt"><br><br><br><b>NO. ${invoice_number}</b></span></div>
                <div align="center"><span><img height="30%" width="80%" src="assets/images/header-invoice.png"/></span></div>
                <span>
                    <img style="position:absolute;right: 0px;bottom: -230px; z-index: -1;opacity:0.5" height="15%" width="20%" 
                        src="${approved}"/>
                </span>
                <div style="width:100%;text-align: right">
                    <b><span style="margin-right:5em;font-size: 14pt">Date: ${month} ${day},${year}</span></b>
                </div>
                <div style="width:100%;text-align: center;font-size: 14pt">
                    <span style="font-weight: bold"><span style="font-size: 15pt;">INVOICE</span><br>
                        This is to bill ${salutation} ${passport_name}<br>
                    </span>
                </div>
                <div style="width:100%;text-align: left;margin-left:5em;font-size: 13pt"> for the following breakdown:</div>
                <div style="width:100%;text-align: left;margin-left:5em;font-size: 13pt;
                    margin-bottom: 20px;"> Period Covered:
                    <b>${term} week(s) &nbsp;&nbsp;${checkIn.toLocaleDateString()} ~ ${checkOut.toLocaleDateString()}</b>
                </div>
                <table style="width:80%;text-align: center;font-size: 14pt;font-weight: bolder;
                            float:right; margin-left:45%;margin-right:11%;margin-bottom: 5px;" border="0">
                    <tr style="font-size: 16pt;line-height: 30px;">
                        <th style="text-align: center;border-bottom: 1px solid #000;">Description</th>
                        <th style="text-align: center;border-bottom: 1px solid #000;">Unit Price</th>
                        <th style="text-align: center;border-bottom: 1px solid #000;">Pax</th>
                        <th style="text-align: center;border-bottom: 1px solid #000;">Total Amount</th>
                    </tr>
                    <tr>
                        <td>Registration Fee</td>
                        <td>${entrance_fee?'$':'$'}${entrance_fee}</td>
                        <td>${entrance_fee?'1':'0'}</td>
                        <td>${entrance_fee?'$':'$'}${entrance_fee}</td>
                    </tr>
                    <tr>
                        <td>Tuition & Accommodation<br>
                        <span style="font-size:12pt;">${reservedAccomoRoomtype}
                        ${reservedAccomoCondoRoomtype}
                        ${reservedAccomoHotelsRoomtype}
                        ${reservedAccomoWalkinRoomtype}
                        ${courseStudent}
                        </span>
                        </td>
                        <td>${sub_total?'$':'$'}${sub_total}</td>
                        <td>${sub_total?'1':'0'}</td>
                        <td>${sub_total?'$':'$'}${sub_total}</td>
                    </tr>
                    <tr>
                        <td>Holiday Fee</td>
                        <td>${holiday_fee?'$':'$'}${holiday_fee}</td>
                        <td>${holiday_fee?'1':'0'}</td>
                        <td>${holiday_fee?'$':'$'}${holiday_fee}</td>
                    </tr>
                    <tr>
                        <td style="font-size:11pt;text-align:center;">${holidays}</td>
                    </tr>
                    <tr>
                        <td>Transfer Fee</td>
                        <td>${transfer_fee?'$':'$'}${transfer_fee}</td>
                        <td>${transfer_fee?'1':'0'}</td>
                        <td>${transfer_fee?'$':'$'}${transfer_fee}</td>
                    </tr>
                    <tr style="color: red">
                        <td>${discountReason}</td>
                        <td>${discountValueDollars}</td>
                        <td></td>
                        <td>${discountValueDollars}</td>
                    </tr>
                    <tr>
                        <td style="border-top: 1px solid #000;" colspan="3"><b>Sub Total:</b></td>
                        <td style="border-top: 1px solid #000;">
                            <div style="width:100%;text-align: center">
                                <span style="font-size: 15pt;font-weight: bolder">
                                    <b> $${subTotalNonJPDollars}</b>
                                </span>
                            </div>
                        </td>
                    </tr>
                    <tr style="line-height: 30px;">
                        <td style="border-top: 1px solid #000;"><strong style="color:blue">Total Amount</strong></td>
                        <td style="border-top: 1px solid #000;" colspan="2"><b>US DOLLARS:</b></td>
                        <td style="border-top: 1px solid #000;">
                            <div style="width:100%;text-align: center">
                                <span style="font-size: 16pt;font-weight: bolder">
                                    <b>$${subTotalNonJPDollars}</b>
                                </span>
                            </div>
                        </td>
                    </tr>
                </table>
                <div style="float: left;margin-left: 5em; font-size: 13pt;">
                        <div style="float:left"><br><strong
                                            style="color:blue">Payment In the School</strong><br><br>
                            SSP<br>
                            VISA Extension Fee<br>
                            Student ID<br>
                        </div>
                        <div style="float:left;margin-left: 0.2em;"><br><br><br>
                            Php ${ssp_fee_php}<br>
                            Vary<br>
                            Php ${id_card}<br>
                        </div>
                        <div style="float:left;margin-left: 5em;"><br><strong
                                            style="color:blue"></strong><br><br>
                            Electricity Fee<br>
                            I-Card<br>
                            Text book<br>
                        </div>
                        <div style="float:right;margin-left: 2em;"><br><br><br>
                            Php ${electrical_fee_php}<br>
                            Php ${i_card_cost}<br>
                            Vary<br>
                        </div>
                </div>
                <div style="float: left;margin-left: 5em; font-size: 13pt;">
                    <div style="width: 30%; float:left"><br><strong style="color:blue">ACCOUNT NUMBER</strong><br><br>
                        BANK NAME:<br>
                        ACCOUNT NUMBER:<br>
                        COMPANY NAME:<br>
                        BANK ADDRESS:<br><br>
                        SWIFT CODE:<br>
                        BRANCH CODE:<br>
                        DUE DATE:<br>
                    </div>
                    <div style="width: 70%; float:right;margin-bottom: 150px;"><br><br><br>
                        METROPOLITAN BANK AND TRUST COMPANY<br>
                        602-7602-908956<br>
                        REAL GREATENGLISH CORPORATION<br>
                        CEBU SALINAS BRANCH - AMON TRADING CORP. <br>BLDG.,SALINAS DRIVE, CEBU CITY 6000
                        MBTCPHMM<br>
                        602<br>
                        ${dueDate}<br>
                    </div>
                </div>
              </body>
              </html>`
            );
            popupWin.document.close();
        } else {
            popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
            popupWin.document.open();
            popupWin.document.write(`
               <html>
               <title>INVOICE-${invoice_number}</title>
               <head>
               <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
               <style>
                   @media print{
                   @page {size: portrait; margin: 15.5mm;}
                   table.template {page-break-after:always}
                   tr.darkgray {
                          background-color: darkgray !important;
                          -webkit-print-color-adjust: exact;
                          }
               }
               </style>
               </head>
               <body onload="window.print();window.close()">
               <div align="center">
               <table style="width:80%;margin-bottom: 25px;font-size:14pt;">
               <tr>
                   <td>Invoice No</td>
                   <td style="font-size:16pt;font-weight: bolder">${invoice_number}</td>
                   <td align="right" style="font-size:12pt;">${currentDate.toLocaleDateString()}</td>
               </tr>
               </table>
               <table style="width:80%;margin-bottom: 15px;font-size:14pt;">
               <tr>
                   <td style="text-decoration: underline;font-weight: bolder">Student Name</td>
                   <td style="font-size:16pt;font-weight: bolder">${passport_name}</td>
                   <td align="center" style="font-size:16pt;font-weight: bolder">QQ ENGLISH</td>
               </tr>
               </table>
               <table style="width:80%;margin-bottom:50px;">
               <tr align="right">
                   <td colspan="3">REAL GREATENGLISH CORPORATION</td>
               </tr>
               <tr align="right">
                   <td colspan="3">7th Floor Skyrise 4 Building, Cebu I.T Park,<br> Apas, Cebu City, Philippines 6000</td>
               </tr>
               <tr align="right">
                   <td colspan="3">Tel:+63(0)32-479-9042</td>
               </tr>
               <tr align="right">
                   <td colspan="3">Email: info@qqenglish.jp</td>
               </tr>
               </table>
               <table style="width:80%;margin-bottom: 15px;font-size:14pt;">
               <tr style="font-size:14pt;font-weight: bolder">
                   <td align="center">TOTAL:</td>
                   <td align="right" style="border-bottom: 1px solid #000;">${phRateInvoice}</td>
                   <td>PHP</td>
               </tr>
               </table>
               </div>
               <div align="center">
                <table style="width:80%;border-collapse: collapse;border: 1px solid black;margin-bottom:90px;">
                    <tr class="darkgray">
                        <th style="border: 1px solid black;text-align:center;">Description</th>
                        <th style="border: 1px solid black;text-align:center;">Unit Price</th>
                        <th style="border: 1px solid black;text-align:center;">Pax</th>
                        <th style="border: 1px solid black;text-align:center;">Amount</th>
                    </tr>
                    <tr>
                        <td align="left" style="border: 1px solid black;">Tuition fee</td>
                        <td align="right" style="border: 1px solid black;">${phRateInvoice}</td>
                        <td align="right" style="border: 1px solid black;color: red">1</td>
                        <td align="center" style="border: 1px solid black;color: red">${phRateInvoice}</td>
                    </tr>
                    <tr>
                        <td align="left" style="border: 1px solid black;padding: 10px 10px 10px"></td>
                        <td align="right" style="border: 1px solid black;"></td>
                        <td align="right" style="border: 1px solid black;color: red"></td>
                        <td align="center" style="border: 1px solid black;color: red"></td>
                    </tr>
                    <tr>
                        <td align="left" style="border: 1px solid black;padding: 10px 10px 10px"></td>
                        <td align="right" style="border: 1px solid black;"></td>
                        <td align="right" style="border: 1px solid black;color: red"></td>
                        <td align="center" style="border: 1px solid black;color: red"></td>
                    </tr>
                    <tr>
                        <td align="left" style="border: 1px solid black;padding: 10px 10px 10px"></td>
                        <td align="right" style="border: 1px solid black;"></td>
                        <td align="right" style="border: 1px solid black;color: red"></td>
                        <td align="center" style="border: 1px solid black;color: red"></td>
                    </tr>
                    <tr>
                        <td align="left" style="border: 1px solid black;padding: 10px 10px 10px"></td>
                        <td align="right" style="border: 1px solid black;"></td>
                        <td align="right" style="border: 1px solid black;color: red"></td>
                        <td align="center" style="border: 1px solid black;color: red"></td>
                    </tr>
                    <tr>
                        <td align="left" style="border: 1px solid black;padding: 10px 10px 10px"></td>
                        <td align="right" style="border: 1px solid black;"></td>
                        <td align="right" style="border: 1px solid black;color: red"></td>
                        <td align="center" style="border: 1px solid black;color: red"></td>
                    </tr>
                    <tr>
                        <td align="left" style="border: 1px solid black;padding: 10px 10px 10px"></td>
                        <td align="right" style="border: 1px solid black;"></td>
                        <td align="right" style="border: 1px solid black;color: red"></td>
                        <td align="center" style="border: 1px solid black;color: red"></td>
                    </tr>
                    <tr>
                        <td align="left" style="border: 1px solid black;padding: 10px 10px 10px"></td>
                        <td align="right" style="border: 1px solid black;"></td>
                        <td align="right" style="border: 1px solid black;color: red"></td>
                        <td align="center" style="border: 1px solid black;color: red"></td>
                    </tr>
                    <tr>
                        <td align="left" style="border: 1px solid black;padding: 10px 10px 10px"></td>
                        <td align="right" style="border: 1px solid black;"></td>
                        <td align="right" style="border: 1px solid black;color: red"></td>
                        <td align="center" style="border: 1px solid black;color: red"></td>
                    </tr>
                    <tr>
                        <td align="left" style="border: 1px solid black;padding: 10px 10px 10px"></td>
                        <td align="right" style="border: 1px solid black;"></td>
                        <td align="right" style="border: 1px solid black;color: red"></td>
                        <td align="center" style="border: 1px solid black;color: red"></td>
                    </tr>
                    <tr>
                        <td align="left" style="border: 1px solid black;padding: 10px 10px 10px"></td>
                        <td align="right" style="border: 1px solid black;"></td>
                        <td align="right" style="border: 1px solid black;color: red"></td>
                        <td align="center" style="border: 1px solid black;color: red"></td>
                    </tr>
                    <tr>
                        <td align="left" style="border: 1px solid black;padding: 10px 10px 10px"></td>
                        <td align="right" style="border: 1px solid black;"></td>
                        <td align="right" style="border: 1px solid black;color: red"></td>
                        <td align="center" style="border: 1px solid black;color: red"></td>
                    </tr>
                    <tr class="darkgray">
                        <td colspan="2" align="left">Total amount to be paid to RGE</td>
                        <td align="right">PHP</td>
                        <td align="center" style="border:1px solid black;">${phRateInvoice}</td>
                    </tr>
                </table>
                <table style="width:80%;font-size:12pt;">
                    <tr>
                        <td style="font-size:12pt;"><b>Bank account</b></td>
                        <td align="right" style="font-weight:bolder">Payable to</td>
                        <td align="center">REAL GREATENGLISH CORPORATION</td>
                    </tr>
                    <tr>
                        <td align="right" colspan="2" style="font-weight:bolder">Bank Name</td>
                        <td align="center">Unionbank of the Philippines</td>
                    </tr>
                    <tr>
                        <td align="right" colspan="2" style="font-weight:bolder">Branch</td>
                        <td align="center">Asiatown I.T. Park Branch</td>
                    </tr>
                    <tr>
                        <td align="right" colspan="2" style="font-weight:bolder">Account Number</td>
                        <td align="center">001430001656</td>
                    </tr>
                    <tr>
                        <td align="right" colspan="2" style="font-weight:bolder">Swift Code</td>
                        <td align="center">UBPHPHMM</td>
                    </tr>
                </table>
               </div> 
          </body>
          </html>`);
            popupWin.document.close();
        }
    }


    public printAcceptLetter(passport_name,passport_id,checkin_date,checkout_date,campus,gender) {
        let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let currentDate = new Date();
        let day = currentDate.getDate();
        let month = monthNames[currentDate.getMonth()];
        let year = currentDate.getFullYear();
        let checkIn = new Date(checkin_date);
        let checkInday = checkIn.getDate();
        let checkInmonth = monthNames[checkIn.getMonth()];
        let checkInyear = checkIn.getFullYear();
        let checkOut = new Date(checkout_date);
        let checkOutday = checkOut.getDate();
        let checkOutmonth = monthNames[checkOut.getMonth()];
        let checkOutyear = checkOut.getFullYear();
        let printAcceptTemplate, popupWin;
        let salutation = 'Mr.';
            if(gender == 2){ salutation = 'Ms.'; }

        if (campus == "ITP") {
            printAcceptTemplate = document.getElementById('itp-accept-template').innerHTML;
            popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
            popupWin.document.open();
            popupWin.document.write(`
              <html>
              <title>Acceptance Letter ITP</title>
                <head>
                  <style>
                    @media print{
                      @page {size: portrait; margin: 16mm;}
                      table.template {page-break-after:always}
                      span.yellow {
                        background-color: yellow !important;
                        -webkit-print-color-adjust: exact; 
                      }
                      span.red {
                        color: red !important;
                        font-weight: bold !important;
                        -webkit-print-color-adjust: exact; 
                      }
                      span.page{
                          page-break-after: always;
                      }
                    }             
                  </style>
                </head>
                <body onload="window.print();window.close()">
                <div align="center">
                    <span><img height="25%" width="80%" src="assets/images/header-invoice.png"/></span>
                </div>
                <div style="font-size:13pt;">
                    <div style="width:100%;text-align:center;font-size:25pt;color:deepskyblue;margin-bottom:25px;"><b>Letter of Acceptance<br/></b></div>
                    <div style="width:100%;text-align:left;"> To :    <b>${passport_name} ${passport_id?'(Passport number:':''} ${passport_id}${passport_id?')':''}</b></div>
                    <div style="width:100%;text-align:left;margin-bottom:10px;"> From :    Admissions Office, Real Great English Corporation</div>
                    <div style="width:100%;text-align:left"> Date :    <b>${month} ${day}, ${year}</b></div>
                    <div style="width:100%;text-align:left"> Re :    Confirmation of Enrollment</div>
                        <span style="font-size:15pt">${printAcceptTemplate}</span>
                    <div style="width:100%;text-align:left"> Name :    <b>${salutation} ${passport_name}</b></div>
                    <div style="width:100%;text-align:left"> Course Date :    <b>${checkInmonth} ${checkInday}, ${checkInyear} to  ${checkOutmonth} ${checkOutday}, ${checkOutyear}</b></div>
                    <div style="width:100%;text-align:left">
                        <img height="30%" width="50%"src="assets/images/hr_manager_e_signature.jpg"/>
                    </div>
                </div>    
                </body>
              </html>`
            );
            popupWin.document.close();
        } else {
            printAcceptTemplate = document.getElementById('sfc-accept-template').innerHTML;
            popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
            popupWin.document.open();
            popupWin.document.write(`
              <html>
              <title>Acceptance Letter SFC</title>
                <head>
                  <style>
                    @media print{
                      @page {size: portrait; margin: 16mm;}
                      table.template {page-break-after:always}
                      span.yellow {
                        background-color: yellow !important;
                        -webkit-print-color-adjust: exact; 
                      }
                      span.red {
                        color: red !important;
                        font-weight: bold !important;
                        -webkit-print-color-adjust: exact; 
                      }
                      span.page{
                          page-break-after: always;
                      }
                    }             
                  </style>
                </head>
                <body onload="window.print();window.close()">
                <div align="center">
                    <span><img height="25%" width="80%" src="assets/images/header-invoice.png"/></span>
                </div>
                <div style="font-size:13pt;">
                    <div style="width:100%;text-align:center;font-size:25pt;color:deepskyblue;margin-bottom:25px;"><b>Letter of Acceptance<br/></b></div>
                    <div style="width:100%;text-align:left;"> To :    <b>${passport_name} ${passport_id?'(Passport number:':''} ${passport_id}${passport_id?')':''}</b></div>
                    <div style="width:100%;text-align:left;margin-bottom:10px;"> From :    Admissions Office, Real Great English Corporation</div>
                    <div style="width:100%;text-align:left"> Date :    <b>${month} ${day}, ${year}</b></div>
                    <div style="width:100%;text-align:left"> Re :    Confirmation of Enrollment</div>
                        <span style="font-size:15pt">${printAcceptTemplate}</span>
                    <div style="width:100%;text-align:left"> Name :    <b>${salutation} ${passport_name}</b></div>
                    <div style="width:100%;text-align:left"> Course Date :    <b>${checkInmonth} ${checkInday}, ${checkInyear} to  ${checkOutmonth} ${checkOutday}, ${checkOutyear}</b></div>
                    <div style="width:100%;text-align:left">
                        <img height="30%" width="50%"src="assets/images/hr_manager_e_signature.jpg"/>
                    </div>
                </div>     
                </body>
              </html>`
            );
            popupWin.document.close();
        }
    }

    public printGAInvoice(passport_name,user_name,term,ecc,extention_fee_php,emigration_fee_php,electrical_fee_php,ssp_fee_php,id_card,visa_fee_php,acri_fee_php,
    i_card_cost,room_update_php,photocopy_php,meal_total_php,adjustments_php,departure_date,others_php) {
        let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let currentDate = new Date();
        let day = currentDate.getDate();
        let month = monthNames[currentDate.getMonth()];
        let year = currentDate.getFullYear();
        let departureDate = new Date(departure_date);
        let departDay = departureDate.getDate();
        let departMonth = monthNames[departureDate.getMonth()];
        let departYear = departureDate.getFullYear();
        let popupWin, totalPaymentPhp;

        if(departYear == 1970) {
            if(departDay == 1) { departDay = 0;}
            if (departMonth == 'January') { departMonth = ''; }
        }

        totalPaymentPhp = electrical_fee_php + ssp_fee_php + id_card + visa_fee_php  + i_card_cost + room_update_php + photocopy_php + meal_total_php + adjustments_php + others_php;
        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        popupWin.document.open();
        popupWin.document.write(`
              <html>
              <title>GA Invoice-${passport_name}</title>
                <head>
                  <style>
                    @media print{
                      @page {size: portrait; margin: 0.5mm;}
                      table.template {page-break-after:always}
                      span.yellow {
                        background-color: yellow !important;
                        -webkit-print-color-adjust: exact; 
                      }
                      span.red {
                        color: red !important;
                        font-weight: bold !important;
                        -webkit-print-color-adjust: exact; 
                      }
                      span.page{
                          page-break-after: always;
                      }
                    }             
                  </style>
                </head>
                <body onload="window.print();window.close()">
                <span id="ga-invoice-template" style="font-size:9pt;">
                <!--Admin-->
                <div align="center">
                    <span style="width:100%;float:left">
                        <img height="5%" width="13%" src="assets/images/qqenglishlogo.png"/>
                        <div style="width:85%;text-align:right;text-decoration:underline">
                            <strong>Admin Copy</strong>
                        </div>
                    </span>
                </div>
                <div align="center">
                    <table style="width:85%;text-align: left;border-collapse: collapse;margin-bottom:10px;
                    font-family:Trebuchet MS, Tahoma, Verdana, Arial, sans-serif;font-size:9pt;">
                        <tr style="line-height:30px;">
                            <td>Name</td>
                            <td colspan="3" style="text-align:center;outline: thin solid black;">${passport_name}</td>
                            <td></td>
                            <td  style="text-align:center;">Date</td>
                            <td style="text-align:center;border-bottom: 1px solid black">${month} ${day}, ${year}</td>
                        </tr>
                    </table>
                    <table style="width:85%;text-align: left;border-collapse: collapse;margin-bottom:10px;
                    font-family:Trebuchet MS, Tahoma, Verdana, Arial, sans-serif;font-size:9pt;">
                        <tr style="line-height:30px;">
                            <td>week/weeks</td>
                            <td colspan="3" style="text-align:center;outline: thin dotted black;">${term}</td>
                        </tr>
                        <tr style="text-align:right">
                            <td colspan="4"></td>
                            <td>SSP</td>
                            <td></td>
                            <td style="outline: thin dotted black;">Php&emsp;&emsp;&emsp;${ssp_fee_php}</td>
                        </tr>
                        <tr style="text-align:right">
                            <td colspan="4"></td>
                            <td>I-Card</td>
                            <td></td>
                            <td style="outline: thin dotted black;">Php&emsp;&emsp;&emsp;${i_card_cost}</td>
                        </tr>
                        <tr style="text-align:right">
                            <td colspan="2" rowspan="2" style="text-align:center;
                            border-bottom: thin solid black;border-top: thin solid black;
                            border-left: thin solid black;border-right: thin solid black;">
                                Departure<br>Date
                            </td>
                            <td  colspan="2" rowspan="2" style="text-align:center;
                            border-bottom: thin solid black;border-top: thin solid black;
                            border-right: thin solid black;">${departDay?departDay:''}-${departMonth}</td>
                            <td>VISA</td>
                            <td></td>
                            <td style="outline: thin dotted black;">Php&emsp;&emsp;&emsp;${visa_fee_php}</td>
                        </tr>
                        <tr style="text-align:right">
                            <td>ID</td>
                            <td></td>
                            <td style="outline: thin dotted black;">Php&emsp;&emsp;&emsp;${id_card}</td>
                        </tr>
                        <tr style="text-align:right">
                            <td colspan="4"></td>
                            <td>ELEC</td>
                            <td></td>
                            <td style="outline: thin dotted black;">Php&emsp;&emsp;&emsp;${electrical_fee_php}</td>
                        </tr>
                        <tr style="text-align:right">
                            <td colspan="4"></td>
                            <td>Room update</td>
                            <td></td>
                            <td style="outline: thin dotted black;">Php&emsp;&emsp;&emsp;${room_update_php}</td>
                        </tr>
                        <tr style="text-align:right">
                            <td colspan="4"></td>
                            <td>Photocopy</td>
                            <td></td>
                            <td style="outline: thin dotted black;">Php&emsp;&emsp;&emsp;${photocopy_php}</td>
                        </tr>
                        <tr style="text-align:right">
                            <td colspan="4"></td>
                            <td>Meal(extra)</td>
                            <td></td>
                            <td style="outline: thin dotted black;">Php&emsp;&emsp;&emsp;${meal_total_php}</td>
                        </tr>
                        <tr style="text-align:right">
                            <td colspan="4"></td>
                            <td>Others</td>
                            <td></td>
                            <td style="outline: thin dotted black;">Php&emsp;&emsp;&emsp;${others_php}</td>
                        </tr>
                        <tr style="text-align:right">
                            <td colspan="4"></td>
                            <td>Adjust(Other,VISA,etc)</td>
                            <td style="color:orangered;text-align:center"></td>
                            <td style="outline: thin dotted black;">Php&emsp;&emsp;&emsp;${adjustments_php}</td>
                        </tr>
                        <tr style="font-weight:bold;text-align:center">
                            <td colspan="4"></td>
                            <td colspan="2">Total Amount to be paid</td>
                            <td style="text-align:right;outline: thin dotted black;">Php&emsp;&emsp;&emsp;${totalPaymentPhp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                        </tr>
                    </table>
                    <table style="width:85%;text-align: left;border-collapse: collapse;
                    font-family:Trebuchet MS, Tahoma, Verdana, Arial, sans-serif;font-size:9pt;" border="1" >
                        <tr style="line-height:40px;">
                            <td colspan="4">Prepared by: ${user_name}</td>
                            <td colspan="2" rowspan="2">Received by Acct Dept:</td>
                        </tr>
                    </table>
                </div>
                <!--Student-->
                <div align="center">
                    <span style="width:100%;float:left">
                        <img height="5%" width="13%" src="assets/images/qqenglishlogo.png"/>
                        <div style="width:85%;text-align:right;text-decoration:underline">
                            <strong>Student Copy</strong>
                        </div>
                    </span>
                </div>
                <div align="center">
                    <table style="width:85%;text-align: left;border-collapse: collapse;margin-bottom:10px;
                    font-family:Trebuchet MS, Tahoma, Verdana, Arial, sans-serif;font-size:9pt;">
                        <tr style="line-height:30px;">
                            <td>Name</td>
                            <td colspan="3" style="text-align:center;outline: thin solid black;">${passport_name}</td>
                            <td></td>
                            <td  style="text-align:center;">Date</td>
                            <td style="text-align:center;border-bottom: 1px solid black">${month} ${day}, ${year}</td>
                        </tr>
                    </table>
                    <table style="width:85%;text-align: left;border-collapse: collapse;margin-bottom:10px;
                    font-family:Trebuchet MS, Tahoma, Verdana, Arial, sans-serif;font-size:9pt;">
                        <tr style="line-height:30px;">
                            <td>week/weeks</td>
                            <td colspan="3" style="text-align:center;outline: thin dotted black;">${term}</td>
                        </tr>
                        <tr style="text-align:right">
                            <td colspan="4"></td>
                            <td>SSP</td>
                            <td></td>
                            <td style="outline: thin dotted black;">Php&emsp;&emsp;&emsp;${ssp_fee_php}</td>
                        </tr>
                        <tr style="text-align:right">
                            <td colspan="4"></td>
                            <td>I-Card</td>
                            <td></td>
                            <td style="outline: thin dotted black;">Php&emsp;&emsp;&emsp;${i_card_cost}</td>
                        </tr>
                        <tr style="text-align:right">
                            <td colspan="4" style="text-align:center;
                            border-bottom: thin solid black;border-top: thin solid black;
                            border-left: thin solid black;border-right: thin solid black;">
                                PAYMENT RECEIVED
                            </td>
                            <td >VISA</td>
                            <td></td>
                            <td style="outline: thin dotted black;">Php&emsp;&emsp;&emsp;${visa_fee_php}</td>
                        </tr>
                        <tr style="text-align:right">
                            <td colspan="2" rowspan="2" style="text-align:center;
                            border-bottom: thin solid black;border-left: thin solid black;border-right: thin solid black;">
                                <br>Date
                            </td>
                            <td colspan="2" rowspan="2" style="text-align:center;
                            border-bottom: thin solid black;
                            border-left: thin solid black;border-right: thin solid black;">
                                <br>Signature
                            </td>
                            <td>ID</td>
                            <td></td>
                            <td style="outline: thin dotted black;">Php&emsp;&emsp;&emsp;${id_card}</td>
                        </tr>
                        <tr style="text-align:right">
                            <td>ELEC</td>
                            <td></td>
                            <td style="outline: thin dotted black;">Php&emsp;&emsp;&emsp;${electrical_fee_php}</td>
                        </tr>
                        <tr style="text-align:right">
                            <td colspan="4"></td>
                            <td>Room update</td>
                            <td></td>
                            <td style="outline: thin dotted black;">Php&emsp;&emsp;&emsp;${room_update_php}</td>
                        </tr>
                        <tr style="text-align:right">
                            <td colspan="4"></td>
                            <td>Photocopy</td>
                            <td></td>
                            <td style="outline: thin dotted black;">Php&emsp;&emsp;&emsp;${photocopy_php}</td>
                        </tr>
                        <tr style="text-align:right">
                            <td colspan="4"></td>
                            <td>Meal(extra)</td>
                            <td></td>
                            <td style="outline: thin dotted black;">Php&emsp;&emsp;&emsp;${meal_total_php}</td>
                        </tr>
                        <tr style="text-align:right">
                            <td colspan="4"></td>
                            <td>Others</td>
                            <td></td>
                            <td style="outline: thin dotted black;">Php&emsp;&emsp;&emsp;${others_php}</td>
                        </tr>
                        <tr style="text-align:right">
                            <td colspan="4"></td>
                            <td>Adjust(Other,VISA,etc)</td>
                            <td style="color:orangered;text-align:center"></td>
                            <td style="outline: thin dotted black;">Php&emsp;&emsp;&emsp;${adjustments_php}</td>
                        </tr>
                        <tr style="font-weight:bold;text-align:center">
                            <td colspan="4"></td>
                            <td colspan="2">Total Amount to be paid</td>
                            <td style="text-align:right;outline: thin dotted black;">Php&emsp;&emsp;&emsp;${totalPaymentPhp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                        </tr>
                    </table>
                    <table style="width:85%;text-align: left;border-collapse: collapse;
                    font-family:Trebuchet MS, Tahoma, Verdana, Arial, sans-serif;font-size:9pt;" border="1" >
                        <tr style="line-height:40px;">
                            <td colspan="4">Prepared by: ${user_name}</td>
                            <td colspan="2" rowspan="2">Received by Acct Dept:</td>
                        </tr>
                    </table>
                </div>
                <!--Accounting-->
                <div align="center">
                    <span style="width:100%;float:left">
                        <img height="5%" width="13%" src="assets/images/qqenglishlogo.png"/>
                        <div style="width:85%;text-align:right;text-decoration:underline">
                            <strong>Accounting Copy</strong>
                        </div>
                    </span>
                </div>
                <div align="center">
                    <table style="width:85%;text-align: left;border-collapse: collapse;margin-bottom:10px;
                    font-family:Trebuchet MS, Tahoma, Verdana, Arial, sans-serif;font-size:9pt;">
                        <tr style="line-height:30px;">
                            <td>Name</td>
                            <td colspan="3" style="text-align:center;outline: thin solid black;">${passport_name}</td>
                            <td></td>
                            <td  style="text-align:center;">Date</td>
                            <td style="text-align:center;border-bottom: 1px solid black">${month} ${day}, ${year}</td>
                        </tr>
                    </table>
                    <table style="width:85%;text-align: left;border-collapse: collapse;margin-bottom:10px;
                    font-family:Trebuchet MS, Tahoma, Verdana, Arial, sans-serif;font-size:9pt;">
                        <tr style="line-height:30px;">
                            <td>week/weeks</td>
                            <td colspan="3" style="text-align:center;outline: thin dotted black;">&emsp;&emsp;${term}&emsp;&emsp;</td>
                        </tr>
                        <tr style="text-align:right">
                            <td colspan="4"></td>
                            <td>SSP</td>
                            <td></td>
                            <td style="outline: thin dotted black;">Php&emsp;&emsp;&emsp;${ssp_fee_php}</td>
                        </tr>
                        <tr style="text-align:right">
                            <td colspan="4"></td>
                            <td>I-Card</td>
                            <td></td>
                            <td style="outline: thin dotted black;">Php&emsp;&emsp;&emsp;${i_card_cost}</td>
                        </tr>
                        <tr style="text-align:right">
                            <td colspan="4"></td>
                            <td>VISA</td>
                            <td></td>
                            <td style="outline: thin dotted black;">Php&emsp;&emsp;&emsp;${visa_fee_php}</td>
                        </tr>
                        <tr style="text-align:right">
                            <td colspan="4"></td>
                            <td>ID</td>
                            <td></td>
                            <td style="outline: thin dotted black;">Php&emsp;&emsp;&emsp;${id_card}</td>
                        </tr>
                        <tr style="text-align:right">
                            <td colspan="4"></td>
                            <td>ELEC</td>
                            <td></td>
                            <td style="outline: thin dotted black;">Php&emsp;&emsp;&emsp;${electrical_fee_php}</td>
                        </tr>
                        <tr style="text-align:right">
                            <td colspan="4"></td>
                            <td>Room update</td>
                            <td></td>
                            <td style="outline: thin dotted black;">Php&emsp;&emsp;&emsp;${room_update_php}</td>
                        </tr>
                        <tr style="text-align:right">
                            <td colspan="4"></td>
                            <td>Photocopy</td>
                            <td></td>
                            <td style="outline: thin dotted black;">Php&emsp;&emsp;&emsp;${photocopy_php}</td>
                        </tr>
                        <tr style="text-align:right">
                            <td colspan="4"></td>
                            <td>Meal(extra)</td>
                            <td></td>
                            <td style="outline: thin dotted black;">Php&emsp;&emsp;&emsp;${meal_total_php}</td>
                        </tr>
                        <tr style="text-align:right">
                            <td colspan="4"></td>
                            <td>Others</td>
                            <td></td>
                            <td style="outline: thin dotted black;">Php&emsp;&emsp;&emsp;${others_php}</td>
                        </tr>
                        <tr style="text-align:right">
                            <td colspan="4"></td>
                            <td>Adjust(Other,VISA,etc)</td>
                            <td style="color:orangered;text-align:center"></td>
                            <td style="outline: thin dotted black;">Php&emsp;&emsp;&emsp;${adjustments_php}</td>
                        </tr>
                        <tr style="font-weight:bold;text-align:center">
                            <td colspan="4"></td>
                            <td colspan="2">Total Amount to be paid</td>
                            <td style="text-align:right;outline: thin dotted black;">Php&emsp;&emsp;&emsp;${totalPaymentPhp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                        </tr>
                    </table>
                    <table style="width:85%;text-align: left;border-collapse: collapse;
                    font-family:Trebuchet MS, Tahoma, Verdana, Arial, sans-serif;font-size:9pt;" border="1" >
                        <tr style="line-height:20px;">
                            <td colspan="4">Prepared by: ${user_name}</td>
                            <td colspan="2" rowspan="2">
                                <div>
                                    Received by Acct Dept & Signature:
                                </div>
                            </td>
                        </tr>
                    </table>
                </div>
            </span>
            </body>
            </html>`
        );
        popupWin.document.close();
    }

}
