import {Component, OnInit, ViewChild, ElementRef} from "@angular/core";
import {ApplyService} from "./share/apply.service";
import {
    ApplySearchModel, StudentApplyModel, ImportDataFullErrorModel, ExportFilterModel, InvoiceDiscountModel
} from './share/apply.model';
import * as _ from 'lodash';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {IMyOptions, IMyDateModel} from 'ngx-mydatepicker';
import * as moment from 'moment';
import * as $ from 'jquery';
import {By} from '@angular/platform-browser';

import {LocalStorageService} from 'ng2-webstorage';
import {ConfigService} from '../shared/config.service';
import {getHtmlTagDefinition} from "@angular/compiler";
import {PlatformLocation } from '@angular/common';

@Component({
    selector: 'student-apply',
    templateUrl: './apply.component.html',
    styleUrls: ['./apply.component.scss'],
})
export class ApplyComponent implements OnInit {
    public today: number = Date.now();
    public filterObj: ApplySearchModel;
    public passportName: String;
    public checkIn: String;
    public checkOut: String;
    public checkRoomFrom: String;
    public checkRoomCampus: String;
    public availRoomWeek: any[];
    public listGradStud: any[];
    public gradFrom: String;
    public listChangeDormRoom: any[];
    public listChangeHotelRoom: any[];
    public changeRoomFrom: String;
    public gradRoomCampus: String;
    public building: String;
    public studentStat: String;
    public cntCode: String;
    public dormitory_room_id: String;
    public studentApply: StudentApplyModel = new StudentApplyModel();
    public invoiceDiscountByPercentage: InvoiceDiscountModel = new InvoiceDiscountModel();
    public invoiceDiscountByInput: InvoiceDiscountModel = new InvoiceDiscountModel();
    public list: Array<any> = [{}];
    public logList: Array<any> = [{}];
    public invoiceDiscountList: Array<any> = [{}];
    public countAllList: number;
    public perPage: number;
    public countryCodes: any[];
    public campusCodes: any[];
    public stayTypes: any[];
    public roomTypes: any[];
    public roomTypesZ: any[];
    public roomTypesWF: any[];
    public roomTypesEX: any[];
    public roomTypesDX: any[];
    public planTypes: any[];
    public availableRoomList: any[];
    public studentStatus: any[];
    public paymentCheck: boolean;

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
    public selectDormRoomType: String;
    public selectAccommodation: String;
    public originUrl: String;
    public reservedRoomsList: Array<any> = [{}];
    public reservedHotelsList: Array<any> = [{}];
    public paymentUnconfirmedList: Array<any> = [{}];
    public paymentConfirmedList: Array<any> = [{}];

    private mimeType: Array<string> = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/csv',
        'application/pdf'
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

    constructor(private _elementRef: ElementRef,
                private localStorageService: LocalStorageService,
                public configService: ConfigService,
                private applyService: ApplyService,
                private platformLocation: PlatformLocation) {
        this.originUrl = (platformLocation as any).location.origin;
    }

    ngOnInit() {
        this.filterObj = new ApplySearchModel();
        this.search();
        this.getCountryCode();
        this.getCampusCode();
        this.getStaytypes();
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
            checkRoomFrom: this.setNgxDatepickerModel(new Date()),
            gradFrom: this.setNgxDatepickerModel(new Date()),
            changeRoomFrom: this.setNgxDatepickerModel(new Date())
        };
        this.checkRoomCampus = "1";
        this.gradRoomCampus = "1";

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

    public checkGraduating(){
        this.loadGraduatingList();
        this.listGraduatingModal.show();
    }

    public checkRoomChange(){
        this.loadChangeRoomList();
        this.listRoomChangeModal.show();
    }

    public invoiceSend(id) {
        if (id != 0) {
            this.getApplyInvoice(id);
            this.getInvoiceDiscountList(id);
        } else {
            this.studentApply = new StudentApplyModel();
            this.invoiceDiscountByPercentage = new InvoiceDiscountModel();
            this.invoiceDiscountByInput = new InvoiceDiscountModel();
        }
        this.sendInvoiceModal.show();
    }

    public saveInvoiceDiscount(apply_id, discount, reason, invoice_number) {
        this.processing = true;
        this.invoiceDiscountByPercentage.discount = Math.round(discount);
        this.invoiceDiscountByInput.discount = Math.round(discount);
        this.applyService.createInvoiceDiscount(Math.round(discount),encodeURIComponent(reason),invoice_number).subscribe(res => {
            this.applyService.getInvoiceDiscountList(invoice_number).subscribe((result) => {
                this.invoiceDiscountList = result.json();
                if(this.invoiceDiscountList){
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
                            this.studentApply = new StudentApplyModel();
                            this.search();
                            this.processing = false;
                        });
                }
            });
        });
    }

    public removeInvoiceDiscount(id,invoiceNumber,discountAmount){
        this.applyService.deleteInvoiceDiscount(id, invoiceNumber, discountAmount).subscribe(res => {
            let rs = res.json();
            this.sendInvoiceModal.hide();
            this.invoiceDiscountByInput = new InvoiceDiscountModel();
            this.invoiceDiscountByPercentage = new InvoiceDiscountModel();
            this.search();
        });
    }

    public saveCommission(apply_id, commission){
        this.processing = true;
        this.studentApply.commission= Math.round(commission);
        this.applyService.updateApplyCommission(apply_id, this.studentApply.commission).subscribe(
            res => {
                let rs = res.json();
                this.sendInvoiceModal.hide();
                this.studentApply = new StudentApplyModel();
                this.search();
                this.processing = false;
                this.percentageCommission = null;
            });

    }

    public loadAvailableRooms() {
        this.getTotalNumberOfAvailableRoom();
    }

    public loadGraduatingList() {
        this.getListOfGraduatingStudents();
    }

    public loadChangeRoomList() {
        this.getListOfChangingDormRoom();
        this.getListOfChangingHotelRoom();
    }

    public editRoomApply(id) {
        if (id != 0) {
            this.getApply(id);
        } else {
            this.studentApply = new StudentApplyModel();
        }
        this.saveDataLoadEvent = {
            selectCheckIn_date: this.setNgxDatepickerModel(new Date()),
            selectCheckOut_date: this.setNgxDatepickerModel(new Date()),
            checkRoomFrom: this.setNgxDatepickerModel(new Date()),
            gradFrom: this.setNgxDatepickerModel(new Date()),
            changeRoomFrom: this.setNgxDatepickerModel(new Date())
        }
        this.loadReservedRooms(id);
        this.loadReservedHotels(id);
        this.editRoomApplyModal.show();
    }

    public loadRoomList(id){
        this.dormitory_room_id = null;
        this.getRoomList(id);
    }

    public removeRoomReserved(reservationId,applyId){
        this.applyService.removeReservedRoom(reservationId,applyId).subscribe(res => {
            let rs = res.json();
            this.editRoomApplyModal.hide();
            this.dormitory_room_id = null;
            this.availableRoomList = null;
            this.search();
        });
    }

    public downloadFile() {
        this.processing = true;
        this.filterObj = {
            "passportName": this.passportName,
            "checkIn": this.checkIn,
            "checkOut": this.checkOut
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

    onChangeDormitorySelection(event){
        this.availableRoomList = null;
        this.dormitory_room_id = null;
    }

    onChangeSelect(event) {
        if (event.srcElement) {
            this.file = event.srcElement.files[0];
            this.filePath = this._elementRef.nativeElement.querySelector('#upload-file').value;
        } else {
            this.file = this._elementRef.nativeElement.querySelector('#upload-file').files[0];
            this.filePath = this._elementRef.nativeElement.querySelector('#upload-file').value;
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
                this.applyService.uploadHotelData(this.file,hotelBookingId).subscribe(
                    (res) => {
                        this.import_success = true;
                        this.isModalShown = false;
                        this.processing = false;
                        this.search();
                        this.editRoomApplyModal.hide();
                        this.dormitory_room_id = null;
                        this.availableRoomList = null;
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

    downloadHotelFile(hotelBookingId,studentName){
        this.processing = true;
        this.filterObj = {
            "passportName": this.passportName,
            "checkIn": this.checkIn,
            "checkOut": this.checkOut
        } as ApplySearchModel;
        this.applyService.downloadHotelData(this.filterObj,hotelBookingId).delay(300).subscribe(
            res => {
                this.isModalShown = false;
                this.blobFile = res;
                this.pDownloadFile(res, studentName+'_'+"Booking-File.pdf");
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

    removeHotelReserved(hotelBookingId){
        this.applyService.removeHotelReserved(hotelBookingId).subscribe(res => {
            let rs = res.json();
            this.editRoomApplyModal.hide();
            this.dormitory_room_id = null;
            this.availableRoomList = null;
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
        this.applyService.getCntryCode()
            .subscribe(data => {
                this.countryCodes = data;
            });
    }

    //get countrycode values from json
    public getCampusCode() {
        this.applyService.getCmpsCode()
            .subscribe(data => {
                this.campusCodes = data;
            });
    }

    //get Stay types from json
    public getStaytypes() {
        this.applyService.getStaytypes()
            .subscribe(data => {
                this.stayTypes = data;
            });
    }

    //get Room types from json
    public getRoomtypes() {
        this.applyService.getRoomtypes()
            .subscribe(data => {
                this.roomTypes = data;
            });
    }

    //get Room types Zelenity  from json
    public getRoomTypesZ() {
        this.applyService.getRoomTypesZ()
            .subscribe(data => {
                this.roomTypesZ = data;
            });
    }

    //get Room types Waterfront from json
    public getRoomTypesWF() {
        this.applyService.getRoomTypesWF()
            .subscribe(data => {
                this.roomTypesWF = data;
            });
    }

    //get Room types Deluxe from json
    public getRoomTypesDX() {
        this.applyService.getRoomTypesDX()
            .subscribe(data => {
                this.roomTypesDX = data;
            });
    }

    //get Room types Executive from json
    public getRoomTypesEX() {
        this.applyService.getRoomTypesEX()
            .subscribe(data => {
                this.roomTypesEX = data;
            });
    }

    //get Plan types from json
    public getPlantypes() {
        this.applyService.getPlantypes()
            .subscribe(data => {
                this.planTypes = data;
            });
    }

    //get Student status from json
    public getStudentstatus() {
        this.applyService.getStudentstatus()
            .subscribe(data => {
                this.studentStatus = data;
            });
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
            "paymentCheck": this.paymentCheck
        } as ApplySearchModel;
        this.applyService.applyList(this.filterObj).subscribe((res) => {
            this.list = res.json().list.data;
            this.countAllList = res.json().list.total;
            this.perPage = res.json().list.per_page;
            this.currPage = res.json().list.current_page;
        });
    }

    public editApply(id) {
        this.saveEditId(id);
        this.loadPaymentsUnconfirmed(id);
        this.loadPaymentsConfirmed(id);
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
                    due_date: this.setNgxDatepickerModel(new Date(this.studentApply.due_date)),
                    paid_date: this.setNgxDatepickerModel(new Date(this.studentApply.paid_date)),
                    arrive_date: this.setNgxDatepickerModel(new Date(this.studentApply.arrival_date)),
                    checkRoomFrom: this.setNgxDatepickerModel(new Date()),
                    gradFrom: this.setNgxDatepickerModel(new Date()),
                    changeRoomFrom: this.setNgxDatepickerModel(new Date())
                }
            })
    }

    private getApplyInvoice(id) {
        this.applyService.getApplyInvoice(id).subscribe(
            res => {
                let cloneObj = _.clone(res.json());
                this.studentApply = cloneObj as StudentApplyModel;
                this.saveDataLoadEvent = {
                    birthday_date: this.setNgxDatepickerModel(new Date(this.studentApply.birthday)),
                    checkIn_date: this.setNgxDatepickerModel(new Date(this.studentApply.checkin_date)),
                    checkOut_date: this.setNgxDatepickerModel(new Date(this.studentApply.checkout_date)),
                    start_date: this.setNgxDatepickerModel(new Date(this.studentApply.entrance_date)),
                    graduate_date: this.setNgxDatepickerModel(new Date(this.studentApply.graduation_date)),
                    due_date: this.setNgxDatepickerModel(new Date(this.studentApply.due_date)),
                    paid_date: this.setNgxDatepickerModel(new Date(this.studentApply.paid_date)),
                    arrive_date: this.setNgxDatepickerModel(new Date(this.studentApply.arrival_date)),
                    checkRoomFrom: this.setNgxDatepickerModel(new Date()),
                    gradFrom: this.setNgxDatepickerModel(new Date()),
                    changeRoomFrom: this.setNgxDatepickerModel(new Date())
                }
            })
    }

    private getInvoiceDiscountList(id) {
        this.applyService.getInvoiceDiscountList(id).subscribe((res) => {
            this.invoiceDiscountList = res.json();
        });
    }

    public saveEditId(id){
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
            this.studentApply.building_id = this.studentApply.campus == 'ITP' ? 1 : 2;
            if(this.arriveTimeHour){
                if(!this.arriveTimeMin){
                    this.arriveTimeMin = 0;
                }
                this.studentApply.arrival_time = '1900-01-01 ' + this.arriveTimeHour + ':' + this.arriveTimeMin + ':' +'00';
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
            this.applyService.updateRoom(this.selectDormBldg,this.selectAccommodation,this.dormitory_room_id,
                this.chosenCheckInDate,this.chosenCheckOutDate,this.studentApply.id).subscribe(
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
                    this.processing = false;
                });
        }
    }

    public saveHotelSelection(){
        if (this.studentApply.id) {
            this.processing = true;
            this.chosenCheckInDate = moment(this.saveDataLoadEvent.selectCheckIn_date.jsdate).format('YYYY-MM-DD');
            this.chosenCheckOutDate = moment(this.saveDataLoadEvent.selectCheckOut_date.jsdate).format('YYYY-MM-DD');
            this.applyService.updateRoom(this.selectDormBldg,this.selectAccommodation,this.dormitory_room_id,
                this.chosenCheckInDate,this.chosenCheckOutDate,this.studentApply.id).subscribe(
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
                    this.processing = false;
                });
        }
    }

    public closeEditRoomApplyModal(){
        this.editRoomApplyModal.hide();
        this.dormitory_room_id = null;
        this.availableRoomList = null;
        this.selectAccommodation = null;
        this.selectDormRoomType = null;
        this.selectDormBldg = null;
        this.import_success = false;
    }

    // get Room List
    public getRoomList(applyId) {
        this.chosenCheckInDate = moment(this.saveDataLoadEvent.selectCheckIn_date.jsdate).format('YYYY-MM-DD');
        this.chosenCheckOutDate = moment(this.saveDataLoadEvent.selectCheckOut_date.jsdate).format('YYYY-MM-DD');
        this.applyService.getRoomListService(this.selectAccommodation,this.selectDormBldg,this.selectDormRoomType,
            this.chosenCheckInDate,this.chosenCheckOutDate,applyId)
            .subscribe(res => {
                this.availableRoomList = res.json();
            });
    }

    // get Reserved rooms list
    public loadReservedRooms(applyId){
        this.applyService.getReservedRoomsList(applyId).subscribe((res) => {
            this.reservedRoomsList = res.json();
        });
    }

    // get Hotel Reserved list
    public loadReservedHotels(applyId){
        this.applyService.getReservedHotelsList(applyId).subscribe((res) => {
            this.reservedHotelsList = res.json();
        });
    }

    // get total number of available room
    public getTotalNumberOfAvailableRoom() {
        this.processing = true;
        this.checkRoomFrom = moment(this.saveDataLoadEvent.checkRoomFrom.jsdate).format('YYYY-MM-DD');
        this.applyService.getRoomAvailableService(this.checkRoomFrom, this.checkRoomCampus)
            .subscribe(res => {
                this.availRoomWeek = res.json();
                this.processing = false;
            });
    }

    // get list of graduating students
    public getListOfGraduatingStudents() {
        this.processing = true;
        this.gradFrom = moment(this.saveDataLoadEvent.gradFrom.jsdate).format('YYYY-MM-DD');
        this.applyService.getListGraduatingService(this.gradFrom,this.gradRoomCampus)
            .subscribe(res => {
                this.listGradStud = res.json();
                this.processing = false;
            });
    }

    // get list of changing dormitory room
    public getListOfChangingDormRoom() {
        this.processing = true;
        this.changeRoomFrom = moment(this.saveDataLoadEvent.changeRoomFrom.jsdate).format('YYYY-MM-DD');
        this.applyService.getListOfChangingDormRoom(this.changeRoomFrom)
            .subscribe(res => {
                this.listChangeDormRoom = res.json();
                this.processing = false;
            });
    }

    // get list of changing hotel room
    public getListOfChangingHotelRoom() {
        this.processing = true;
        this.changeRoomFrom = moment(this.saveDataLoadEvent.changeRoomFrom.jsdate).format('YYYY-MM-DD');
        this.applyService.getListOfChangingHotelRoom(this.changeRoomFrom)
            .subscribe(res => {
                this.listChangeHotelRoom = res.json();
                this.processing = false;
            });
    }

    // get Payments Unconfirmed list
    public loadPaymentsUnconfirmed(applyId){
        this.applyService.getPaymentsUnconfirmed(applyId).subscribe((res) => {
            this.paymentUnconfirmedList = res.json();
        });
    }

    // get Payments Confirmed list
    public loadPaymentsConfirmed(applyId){
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
            this.studentApply.delete_flag = 1;//set 1 not visible
            this.applyService.deleteFlagApply(id, this.studentApply).subscribe(
                res => {
                    let rs = res.json();
                    this.studentApply = new StudentApplyModel();
                    this.search();
                });
        }
    }

  public printList(): void {
      let printContents, popupWin, printContentsTemplate;
      printContents = document.getElementById('list-section').innerHTML;
      popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
      popupWin.document.open();
      popupWin.document.write(`
        <html>
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
    let printContentsTemplate,popupWin;
    printContentsTemplate = document.getElementById('print-all-section-template').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
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
  public printPerTemplate(passport_name,student_name,id,term,country_code,campus,dorm_name) {
    let printTemplateContents, popupWin;
    if(campus == "ITP"){
      if(country_code == "JP"){
        printTemplateContents = document.getElementById('it-jp-template').innerHTML;
        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        popupWin.document.open();
        popupWin.document.write(`
          <html>
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
              ${passport_name}/${student_name}</u>様 &emsp;&emsp; ID番号 ${id} &emsp;&emsp; 週数 ${term} &emsp; 
              宿舍 ${dorm_name} &emsp; 
              </strong>
              <br/>
                ${printTemplateContents}
            </body>
          </html>`
        );
        popupWin.document.close();
      } else if(country_code == "CH"){
        printTemplateContents = document.getElementById('it-ch-template').innerHTML;
        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        popupWin.document.open();
        popupWin.document.write(`
          <html>
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
              ${passport_name}/${student_name}</u> &emsp;&emsp; ID號碼 ${id} &emsp;&emsp; 周數 ${term} &emsp; 
              宿舍 ${dorm_name} &emsp; 
              </strong>
              <br/>
                ${printTemplateContents}
            </body>
          </html>`
        );
        popupWin.document.close();
      } else if(country_code == "TW") {
        printTemplateContents = document.getElementById('it-tw-template').innerHTML;
        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        popupWin.document.open();
        popupWin.document.write(`
          <html>
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
              ${passport_name}/${student_name}</u> &emsp;&emsp; ID號碼 ${id} &emsp;&emsp; 週数 ${term} &emsp; 
              宿舍 ${dorm_name} &emsp; 
              </strong>
              <br/><br/>
              <div style="font-size:15px;">${printTemplateContents}</div>               
            </body>
          </html>`
        );
        popupWin.document.close();
      } else if(country_code == "RU") {
          printTemplateContents = document.getElementById('it-ru-template').innerHTML;
          popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
          popupWin.document.open();
          popupWin.document.write(`
          <html>
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
              ${passport_name}/${student_name}</u> &emsp;&emsp; ID ${id} &emsp;&emsp; Weeks ${term} &emsp; 
              Dorm ${dorm_name} &emsp; 
              </strong>
              <br/><br/>
              <div style="font-size:19px;">${printTemplateContents}</div>               
            </body>
          </html>`
          );
          popupWin.document.close();
      } else if(country_code == "KR") {
          printTemplateContents = document.getElementById('it-kr-template').innerHTML;
          popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
          popupWin.document.open();
          popupWin.document.write(`
          <html>
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
              ${passport_name}/${student_name}</u> &emsp;&emsp; ID ${id} &emsp;&emsp; Weeks ${term} &emsp; 
              Dorm ${dorm_name} &emsp; 
              </strong>
              <br/><br/>
              <div style="font-size:18px;">${printTemplateContents}</div>               
            </body>
          </html>`
          );
          popupWin.document.close();
      }

    } else if(campus === "SFC"){
        if(country_code === "CH"){
          printTemplateContents = document.getElementById('sfc-ch-template').innerHTML;
          popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
          popupWin.document.open();
          popupWin.document.write(`
            <html>
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
                ${passport_name}/${student_name}</u> &emsp;&emsp; ID號碼 ${id} &emsp;&em週数 ${term} &emsp; 
                宿舍 ${dorm_name} &emsp; 
                </strong>
                <br/>
                  ${printTemplateContents}
              </body>
            </html>`
          );
          popupWin.document.close();
        } else if(country_code == 'JP') {
          printTemplateContents = document.getElementById('sfc-jp-template').innerHTML;
          popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
          popupWin.document.open();
          popupWin.document.write(`
            <html>
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
                ${passport_name}/${student_name}</u>様 &emsp;&emsp; ID番号 ${id} &emsp;&emsp; 週数 ${term} &emsp; 
                宿舍 ${dorm_name} &emsp; 
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
                ${passport_name}/${student_name}</u>様 &emsp;&emsp; ID番号 ${id} &emsp;&emsp; 週数 ${term} &emsp; 
                宿舍 ${dorm_name} &emsp; 
                </strong>
                <br/><br/>
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
                ${passport_name}/${student_name}</u>님 &emsp;&emsp; ID번호 ${id} &emsp;&emsp; 주 ${term} &emsp; 
                기숙사 ${dorm_name} &emsp; 
                </strong>
                <br/><br/>
                  <div style="font-size:15px;">${printTemplateContents}</div>
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
                ${passport_name}/${student_name}</u> Name &emsp;&emsp; ID ${id} &emsp;&emsp; Weeks ${term} &emsp; 
                Dorm ${dorm_name} &emsp; 
                </strong>
                <br/><br/>
                  <div style="font-size:18px;">${printTemplateContents}</div>
              </body>
            </html>`
            );
            popupWin.document.close();
        } else if (country_code == "VT") {
            printTemplateContents = document.getElementById('sfc-vt-template').innerHTML;
            popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
            popupWin.document.open();
            popupWin.document.write(`
            <html>
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
                ${passport_name}/${student_name}</u> &emsp;&emsp; Số ID ${id} &emsp;&emsp; Tuần ${term} &emsp; 
                Ký túc xá ${dorm_name} &emsp; 
                </strong>
                <br/><br/>
                  <div style="font-size:15px;">${printTemplateContents}</div>
              </body>
            </html>`
            );
            popupWin.document.close();
        }

      }
  }
  public printInvoice(age,gender,invoiceTemplate,paid_amount,sub_total,entrance_fee,pickup_cost,meal_cost,special_holiday_jpy,transfer_fee,
       extension_fee_jpy,additional_lesson_fee,remittance_fee,special_cost, beginner_cost,
       discount,commission,country_code,id_number, student_name,passport_name,checkin_date,checkout_date,
       course,dormitory_room_name,room_id1,term,invoice_number,accommodation_id1,invoiceDiscountList,entrance_date,
       graduation_date,campus,options_meals,options_pickup,arrival_date,flight_no,arrival_time,memo,domi_info_campus,due_date,
       commissionPercentange,ssp_fee_php,id_card,electrical_fee_php,i_card_cost,ecc,extention_fee_php,holiday_fee) {

      let printContentsConfirmationPage,printContentsInvoicePage,popupWin,roomType,optionsMeals,optionsPickup;
      let arrivalDate,arrivalTime,cleanArriveTime,checkIn,checkOut,accommodationType,salutation,gndr,entranceDate,gradDate,dueDate;
      let subTotalCommissionJPYen,subTotalJPYen, subTotalNonJPYen, subTotalNonJPDollars,totalInvoiceJPYen,totalInvoiceNonJPYen,totalInvoiceNonJPDollars;

      let monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
      let currentDate = new Date();
      let day = currentDate.getDate();
      let month = monthNames[currentDate.getMonth()];
      let year = currentDate.getFullYear();
      let discountReason,discountValueYen,discountValueDollars,i,len;

      subTotalCommissionJPYen = sub_total + meal_cost;
      subTotalJPYen = entrance_fee + pickup_cost + special_holiday_jpy + transfer_fee + extension_fee_jpy +
          remittance_fee + special_cost + additional_lesson_fee + beginner_cost;
      subTotalNonJPYen = (sub_total + entrance_fee + pickup_cost + meal_cost + special_holiday_jpy +
      transfer_fee + extension_fee_jpy + additional_lesson_fee + remittance_fee + special_cost  + beginner_cost);
      subTotalNonJPDollars = (entrance_fee + sub_total) - discount;

      totalInvoiceJPYen = (sub_total + meal_cost + entrance_fee + pickup_cost + special_holiday_jpy + transfer_fee +
          extension_fee_jpy + remittance_fee + special_cost + additional_lesson_fee + beginner_cost) - (discount + commission);
      totalInvoiceNonJPYen = (sub_total + entrance_fee + pickup_cost + meal_cost + special_holiday_jpy + transfer_fee +
          extension_fee_jpy + additional_lesson_fee + remittance_fee + special_cost  + beginner_cost) - (discount + commission);
      totalInvoiceNonJPDollars = ((entrance_fee + sub_total) - (commission + discount));

      for (i = 0, len = invoiceDiscountList.length, discountReason = ""; i < len; i++) {
          discountReason += invoiceDiscountList[i]['reason'] + "<br>";
      }

      for (i = 0, len = invoiceDiscountList.length, discountValueYen = ""; i < len; i++) {
          discountValueYen += "¥" + invoiceDiscountList[i]['discount'] + "<br>";
      }

      for (i = 0, len = invoiceDiscountList.length, discountValueDollars = ""; i < len; i++) {
          discountValueDollars += "-$" +invoiceDiscountList[i]['discount'] + "<br>";
      }

      checkIn = new Date(checkin_date);
      checkOut = new Date(checkout_date);
      entranceDate = new Date(entrance_date);
      gradDate = new Date(graduation_date);
      arrivalDate = new Date(arrival_date);
      arrivalTime = new Date(arrival_time);
      cleanArriveTime = arrivalTime.toLocaleTimeString().replace(/:(\d{2}) (?=[AP]M)/, " ");
      dueDate = new Date(due_date);

      roomType = '';
      if(room_id1 == 1){ roomType = 'Single';}
      else if(room_id1 == 2){ roomType = 'Twin'; }
      else if(room_id1 == 3){ roomType = 'Triple'; }
      else if(room_id1 == 4){ roomType = 'Quad'; }
      else if(room_id1 == 5){ roomType = 'Hex'; }


      accommodationType = '';
      if(accommodation_id1 == '1'){ accommodationType = 'Share House'; }
      else if(accommodation_id1 == '2'){ accommodationType = 'Zelenity Hotel'}
      else if(accommodation_id1 == '3'){ accommodationType = 'WaterFront Hotel'}
      else if(accommodation_id1 == '4'){ accommodationType = 'Share Room'}
      else if(accommodation_id1 == '5'){ accommodationType = 'Exective Room'}
      else if(accommodation_id1 == '6'){ accommodationType = 'Deluxe Room'}
      else if(accommodation_id1 == '7'){ accommodationType = 'Walk In'}
      else if(accommodation_id1 == '8'){ accommodationType = 'Walk In'}

      salutation = 'MR.';
      if(gender == 2){ salutation = 'MS.'; }

      gndr = 'Male';
      if(gender == 2){ gndr = 'Female'; }

      optionsMeals = 'NO';
      if(options_meals == 1){ optionsMeals = 'YES'; }

      optionsPickup = 'NO';
      if(options_pickup == 1){ optionsPickup = 'YES'; }

      if(invoiceTemplate == 0){
          printContentsConfirmationPage = document.getElementById('print-jp-invoice-confirmation-page').innerHTML;
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
            <div><span><img height="15%" width="100%" src="assets/images/header-invoice.png"/></span></div>
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
                    <td style="text-align: left;border-bottom: 1px solid #000;">${student_name}</td>
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
                    <td style="text-align: left;border-bottom: 1px solid #000;">${checkIn.toLocaleDateString('en-GB')} &emsp;&emsp; ~  </td>
                    <td style="text-align: left;border-bottom: 1px solid #000;">${checkOut.toLocaleDateString('en-GB')}</td>
                </tr>
                <tr>
                    <td style="text-align: center;border-bottom: 1px solid #000;">Course:</td>
                    <td style="text-align: left;border-bottom: 1px solid #000;">${course}</td>
                    <td style="text-align: left;border-bottom: 1px solid #000;">${term} week/day(s)</td>
                </tr>
                <tr>
                    <td style="text-align: center;border-bottom: 1px solid #000;">&nbsp;</td>
                    <td style="text-align: left;border-bottom: 1px solid #000;">${entranceDate.toLocaleDateString('en-GB')} &emsp;&emsp; ~ </td>
                    <td style="text-align: left;border-bottom: 1px solid #000;">${gradDate.toLocaleDateString('en-GB')}</td>
                </tr>
                <tr>
                    <td style="text-align: center;border-bottom: 1px solid #000;">Campus:</td>
                    <td style="text-align: left;border-bottom: 1px solid #000;">${campus}</td>
                    <td style="text-align: left;border-bottom: 1px solid #000;">&nbsp;</td>
                </tr>
                <tr>
                    <td style="text-align: center;border-bottom: 1px solid #000;">Meal:</td>
                    <td style="text-align: left;border-bottom: 1px solid #000;">${optionsMeals}</td>
                    <td style="text-align: left;border-bottom: 1px solid #000;">&nbsp;</td>
                </tr>
                <tr>
                    <td style="text-align: center;border-bottom: 1px solid #000;">Pick Up:</td>
                    <td style="text-align: left;border-bottom: 1px solid #000;">${optionsPickup}</td>
                    <td style="text-align: left;border-bottom: 1px solid #000;">&nbsp;</td>
                </tr>
                <tr>
                    <td style="text-align: center;border-bottom: 1px solid #000;">Arrival Date:</td>
                    <td style="text-align: left;border-bottom: 1px solid #000;">${arrivalDate.toLocaleDateString('en-GB')} </td>
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
            ${printContentsConfirmationPage}
            <div><span><img height="15%" width="100%" src="assets/images/header-invoice.png"/></span></div>
            <div style="width:100%;text-align: center;font-weight: bolder;font-size: 15pt"><b>I N V O I C E</b></div>
            <div style="text-align: left;font-size: 13pt;width: 45%; float:left"><span style="margin-left:2em">Reservation number</span><br>
                 <b><span style="margin-left:5em;font-size: 13pt">${id_number}</span></b>
            </div>
            <div style="text-align: right;font-size: 13pt;width: 55%; float:right"><span style="margin-right:2em">Invoice number</span> <br>
                 <b><span style="margin-right:2em;font-size: 13pt">${invoice_number}</span></b>
            </div>
            <div style="width:100%;text-align:center;font-size: 14pt;font-weight: bolder">
                This is bill  <b>${salutation} ${student_name}</b>
            </div>
            <div>
            <div style="text-align: left;font-size: 13pt;width: 45%; float:left"><span style="margin-left:2em">for the following breakdown:</span></div>
            <div style="text-align: right;font-size: 13pt;width: 55%; float:right;margin-bottom:5px;">
                <span style="margin-right:6em">Due date</span><br>
                <b><span style="margin-right:5em">${dueDate.toLocaleDateString('en-GB')}</span></b>
            </div>
            <table frame="box" style="width:80%;text-align: center;font-size: 12pt;
                 float:right; margin-left:45%;margin-right:11%;outline-style: solid;margin-bottom: 5px;" border="0">
                 <tr style="line-height: 20px;font-size: 14pt;font-weight: bolder" class="borderLine">
                     <th style="text-align: center;border-bottom: 1px solid #000;">Description</th>
                     <th style="border-bottom: 1px solid #000;">Unit Price</th>
                     <th style="border-bottom: 1px solid #000;">Total Amount</th>
                 </tr>
                 <tr class="lightgray">
                     <th style="text-align: left;font-size: 13pt;border-bottom: 1px solid #000;">(1) Commission
                         <span>
                             (${commissionPercentange.toFixed(0)}%)
                         </span>
                     </th>
                     <th style="border-bottom: 1px solid #000;"></th>
                     <th style="border-bottom: 1px solid #000;"></th>
                 </tr>
                 <tr>
                     <td style="border-bottom: 1px solid #000;">Tuition Fee<br>
                        <span style="font-size: 11px;">
                            ${course}-${dormitory_room_name}-${roomType}-${term} Week/Day(s)
                        </span>
                     </td>
                     <td style="border-bottom: 1px solid #000;">1</td>
                     <td style="border-bottom: 1px solid #000;">¥${sub_total}</td>
                 </tr>
                 <tr>
                     <td style="border-bottom: 1px solid #000;">Meal</td>
                     <td style="border-bottom: 1px solid #000;">1</td>
                     <td style="border-bottom: 1px solid #000;">¥${meal_cost}</td>
                 </tr>
                 <tr>
                     <td style="border-bottom: 1px solid #000;">Sub Total</td>
                     <td style="border-bottom: 1px solid #000;"></td>
                     <td style="border-bottom: 1px solid #000;">¥${subTotalCommissionJPYen}</td>
                 </tr>
                 <tr style="color:red">
                     <td style="border-bottom: 1px solid #000;">Commission(${commissionPercentange.toFixed(0)}%)</td>
                     <td style="border-bottom: 1px solid #000;"></td>
                     <td style="border-bottom: 1px solid #000;">¥${commission}</td>
                 </tr>
                 <tr class="lightgray">
                     <th style="text-align: left;font-size: 13pt;border-bottom: 1px solid #000;">(2) No Commission</th>
                     <th style="text-align: left;border-bottom: 1px solid #000;"></th>
                     <th style="text-align: center;border-bottom: 1px solid #000;"></th>
                 </tr>
                 <tr>
                     <td style="border-bottom: 1px solid #000;">Registration Fee</td>
                     <td style="border-bottom: 1px solid #000;">1</td>
                     <td style="border-bottom: 1px solid #000;">¥${entrance_fee}</td>
                 </tr>
                 <tr>
                     <td style="border-bottom: 1px solid #000;">Pick up</td>
                     <td style="border-bottom: 1px solid #000;">1</td>
                     <td style="border-bottom: 1px solid #000;">¥${pickup_cost}</td>
                 </tr>
                 <tr>
                     <td style="border-bottom: 1px solid #000;">Special Holiday</td>
                     <td style="border-bottom: 1px solid #000;">1</td>
                     <td style="border-bottom: 1px solid #000;">¥${special_holiday_jpy}</td>
                 </tr>
                 <tr>
                     <td style="border-bottom: 1px solid #000;">Transfer fee</td>
                     <td style="border-bottom: 1px solid #000;">1</td>
                     <td style="border-bottom: 1px solid #000;">¥${transfer_fee}</td>
                 </tr>
                 <tr>
                     <td style="border-bottom: 1px solid #000;">Extension fee</td>
                     <td style="border-bottom: 1px solid #000;">1</td>
                     <td style="border-bottom: 1px solid #000;">¥${extension_fee_jpy}</td>
                 </tr>
                 <tr>
                     <td style="border-bottom: 1px solid #000;">Special option</td>
                     <td style="border-bottom: 1px solid #000;">1</td>
                     <td style="border-bottom: 1px solid #000;">¥${special_cost}</td>
                 </tr>
                 <tr>
                     <td style="border-bottom: 1px solid #000;">Beginner option</td>
                     <td style="border-bottom: 1px solid #000;">1</td>
                     <td style="border-bottom: 1px solid #000;">¥${beginner_cost}</td>
                 </tr>
                 <tr>
                     <td style="border-bottom: 1px solid #000">Additional lesson</td>
                     <td style="border-bottom: 1px solid #000;border-bottom: 1px solid #000">1</td>
                     <td style="border-bottom: 1px solid #000;border-bottom: 1px solid #000">¥${additional_lesson_fee}</td>
                 </tr>
                 <tr>
                     <td style="border-bottom: 1px solid #000;">Remittance fee</td>
                     <td style="border-bottom: 1px solid #000;">1</td>
                     <td style="border-bottom: 1px solid #000;">¥${remittance_fee}</td>
                 </tr>
                 <tr>
                     <td style="border-bottom: 1px solid #000;">Holiday fee</td>
                     <td style="border-bottom: 1px solid #000;">1</td>
                     <td style="border-bottom: 1px solid #000;">¥${holiday_fee}</td>
                 </tr>
                 <tr>
                     <td style="border-bottom: 1px solid #000;">Sub Total</td>
                     <td style="border-bottom: 1px solid #000;"></td>
                     <td style="border-bottom: 1px solid #000;">¥${subTotalJPYen}</td>
                 </tr>
                 <tr style="color: red">
                     <td style="border-bottom: 1px solid #000;">${discountReason}</td>
                     <td style="border-bottom: 1px solid #000;"></td>
                     <td style="border-bottom: 1px solid #000;">${discountValueYen}</td>
                 </tr>
                 <tr style="font-size: 13pt;line-height:15px;">
                     <td style="font-weight: bold">Total Amount:</td>
                     <td></td>
                     <td style="font-weight: bold">
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
                        <span style="margin-left:5em">笹塚支店<br></span>
                        <span style="margin-left:5em">普通　1316002<br></span>
                        <span style="margin-left:5em">口座名義　株式会社QQ English<br></span>
                        <span style="margin-left:5em">Due date ${dueDate.toLocaleDateString('en-GB')}<br></span>
                    </div>
             </div>
          </body>
          `);
          popupWin.document.close();
      }
      else if(invoiceTemplate == 1){
          printContentsConfirmationPage = document.getElementById('print-non-jp-invoice-yen').innerHTML;
          popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
          popupWin.document.open();
          popupWin.document.write(`
        <html>
        <title>INVOICE-${invoice_number}</title>
        <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <style>
        @media print{
        @page {size: portrait; margin: 6mm;}
        }
        </style>
        </head>
        <body onload="window.print();window.close()">
        <span><img height=25% width=100%; src="assets/images/header-invoice.png"/></span>
        <div style="width:100%;text-align: left;font-size: 15pt;"><span style="margin-left:2em">Reservation number</span>
            <br>
            <b><span style="margin-left:5em">${id_number}</span></b>
        </div>
        <div style="width:100%;text-align: center;margin-bottom:15px;font-size: 14pt;"><b>${salutation} ${student_name}</b>
            <br> ${checkIn.toLocaleDateString('en-GB')} ~ ${checkOut.toLocaleDateString('en-GB')}
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
                <td style="border-bottom: 1px solid #000;">Tuition Fee
                    <br>
                    <span style="font-size: 12pt;"> ${course}-${dormitory_room_name}-${roomType} ${term} Week/Day(s)</span>
                </td>
                <td style="border-bottom: 1px solid #000;">1</td>
                <td style="border-bottom: 1px solid #000;">¥${sub_total}</td>
            </tr>
            <tr>
                <td style="border-bottom: 1px solid #000;">Registration Fee</td>
                <td style="border-bottom: 1px solid #000;">1</td>
                <td style="border-bottom: 1px solid #000;">¥${entrance_fee}</td>
            </tr>
            <tr>
                <td style="border-bottom: 1px solid #000;">Pick up</td>
                <td style="border-bottom: 1px solid #000;">1</td>
                <td style="border-bottom: 1px solid #000;">¥${pickup_cost}</td>
            </tr>
            <tr>
                <td style="border-bottom: 1px solid #000;">Meal</td>
                <td style="border-bottom: 1px solid #000;">1</td>
                <td style="border-bottom: 1px solid #000;">¥${meal_cost}</td>
            </tr>
            <tr>
                <td style="border-bottom: 1px solid #000;">Special Holiday</td>
                <td style="border-bottom: 1px solid #000;"></td>
                <td style="border-bottom: 1px solid #000;">¥${special_holiday_jpy}</td>
            </tr>
            <tr>
                <td style="border-bottom: 1px solid #000;">Transfer fee</td>
                <td style="border-bottom: 1px solid #000;"></td>
                <td style="border-bottom: 1px solid #000;">¥${transfer_fee}</td>
            </tr>
            <tr>
                <td style="border-bottom: 1px solid #000;">Extension fee</td>
                <td style="border-bottom: 1px solid #000;"></td>
                <td style="border-bottom: 1px solid #000;">¥${extension_fee_jpy}</td>
            </tr>
            <tr>
                <td style="border-bottom: 1px solid #000;">Additional lesson</td>
                <td style="border-bottom: 1px solid #000;"></td>
                <td style="border-bottom: 1px solid #000;">¥${additional_lesson_fee}</td>
            </tr>
            <tr>
                <td style="border-bottom: 1px solid #000;">Remittance fee</td>
                <td style="border-bottom: 1px solid #000;"></td>
                <td style="border-bottom: 1px solid #000;">¥${remittance_fee}</td>
            </tr>
            <tr>
                <td style="border-bottom: 1px solid #000;">Special option</td>
                <td style="border-bottom: 1px solid #000;"></td>
                <td style="border-bottom: 1px solid #000;">¥${special_cost}</td>
            </tr>
            <tr>
                <td style="border-bottom: 1px solid #000;">Beginner option</td>
                <td style="border-bottom: 1px solid #000;"></td>
                <td style="border-bottom: 1px solid #000;">¥${beginner_cost}</td>
            </tr>
            <tr>
                <td style="border-bottom: 1px solid #000;">Holiday Fee</td>
                <td style="border-bottom: 1px solid #000;"></td>
                <td style="border-bottom: 1px solid #000;">¥${holiday_fee}</td>
            </tr>
            <tr>
                <td style="border-bottom: 1px solid #000;">Sub Total</td>
                <td style="border-bottom: 1px solid #000;"></td>
                <td style="border-bottom: 1px solid #000;">¥${subTotalNonJPYen}</td>
            </tr>
            <tr style="color: red">
                <td style="border-bottom: 1px solid #000;">${discountReason}</td>
                <td style="border-bottom: 1px solid #000;"></td>
                <td style="border-bottom: 1px solid #000;">${discountValueYen}</td>
            </tr>
            <tr style="color: red">
                <td style="border-bottom: 1px solid #000;">Commission</td>
                <td style="border-bottom: 1px solid #000;"></td>
                <td style="border-bottom: 1px solid #000;">¥${commission}</td>
            </tr>
            <tr style="line-height:15px;font-weight:bolder;font-size:15pt;">
                <td>Total Amount:</td>
                <td></td>
                <td>¥${totalInvoiceNonJPYen}</td>
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
        ${printContentsConfirmationPage}
        </body>
        </html>`
          );
          popupWin.document.close();
      }
      else {
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
                 @page {size: portrait; margin: 6mm;}
                  table.template {page-break-after:always}
                  span.yellow {
                      background-color: yellow !important;
                      -webkit-print-color-adjust: exact;
                      }
                  }
             </style>
          </head>
          <body onload="window.print();window.close()">
            <div style="text-align: right;width: 100%; float:right"><span style="margin-right:4em;font-size: 12pt"><b>NO. ${invoice_number}</b></span></div>
            <div><span><img height="30%" width="100%" src="assets/images/header-invoice.png"/></span></div>
            <div style="width:100%;text-align: right">
                <b><span style="margin-right:5em;font-size: 14pt">Date: ${month} ${day},${year}</span></b>
            </div>
            <div style="width:100%;text-align: center;font-size: 16pt">
                <span style="font-weight: bold"><span style="font-size: 17pt;">INVOICE</span><br>
                    This is to bill ${salutation} ${student_name}
                </span>
            </div>
            <div style="width:100%;text-align: left;margin-left:5em;font-size: 13pt"> for the following breakdown:<br><br></div>
            <div style="width:100%;text-align: left;margin-left:5em;font-size: 13pt;
                margin-bottom: 20px;"> Period Covered:
                <b>${term} week/day(s) &nbsp;&nbsp;${checkIn.toLocaleDateString()} ~ ${checkOut.toLocaleDateString()}</b>
            </div>
            <table style="width:80%;text-align: center;font-size: 14pt;font-weight: bolder;
                        float:right; margin-left:45%;margin-right:11%;margin-bottom: 20px;" border="0">
                <tr style="font-size: 16pt;line-height: 30px;">
                    <th style="text-align: center;border-bottom: 1px solid #000;">Description</th>
                    <th style="text-align: center;border-bottom: 1px solid #000;">Unit Price</th>
                    <th style="text-align: center;border-bottom: 1px solid #000;">Pax</th>
                    <th style="text-align: center;border-bottom: 1px solid #000;">Total Amount</th>
                </tr>
                <tr>
                    <td>Registration Fee</td>
                    <td>$${entrance_fee}</td>
                    <td>1</td>
                    <td>$${entrance_fee}</td>
                </tr>
                <tr>
                    <td>Tuition & Accommodation
                        <br>${accommodationType} ${dormitory_room_name}
                    </td>
                    <td>$${sub_total}</td>
                    <td>1</td>
                    <td>$${sub_total}</td>
                </tr>
                <tr>
                    <td>Holiday Fee</td>
                    <td>$${holiday_fee}</td>
                    <td>1</td>
                    <td>$${holiday_fee}</td>
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
                    <td>Agent Commission</td>
                    <td>-$${commission}</td>
                    <td></td>
                    <td>-$${commission}</td>
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
            <div style="float: left;margin-left: 5em; font-size: 14pt;">
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
                        Php ${ssp_fee_php}<br>
                        Vary<br>
                        Php ${id_card}<br>
                        Php ${electrical_fee_php}/week<br>
                        Php ${i_card_cost}<br>
                        Vary<br>
                    </div>
            </div>
              ${printContentsConfirmationPage}
          </body>
          </html>`
          );
          popupWin.document.close();
      }
    }

}
