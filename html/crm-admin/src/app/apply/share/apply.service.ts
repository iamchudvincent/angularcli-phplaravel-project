import { Injectable } from '@angular/core';
import { Http, Headers, Response, Request, RequestMethod, URLSearchParams, RequestOptions } from '@angular/http';
import { CoolHttp, HttpHeader } from 'angular2-cool-http';
import { ConfigService } from '../../shared/config.service';
import { Observable } from 'rxjs/Observable';
// import { AppSettings } from '../../app.setting';
import { LocalStorageService } from 'ng2-webstorage';
import {
    ApplySearchModel, StudentApplyModel, ImportDataFullErrorModel, ImportDataLineErrorModel, ExportFilterModel,
    InvoiceDiscountModel, StudentApplyGroupModel, ExtensionInvoiceModel, InvoiceModel, RefundInvoiceModel
} from './apply.model';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

@Injectable()
export class ApplyService {
    private url = 'app/admin/apply';
    responseData: any;
    private AppSettings;
    private headers = new Headers({
        'jwt': this.localStorageService.retrieve('token')
    }); // ... Set content type to JSON
    private options = new RequestOptions({ headers: this.headers });

    constructor(private localStorageService: LocalStorageService,
        private http: Http,
        public configService: ConfigService) { }

    downloadExcelFile(filterObj: ApplySearchModel): Observable<Response> {
        const url = 'app/admin/apply/studentexport';
        if (this.configService.config) {
            return this.createObservable(filterObj, this.configService.config, url);
        } else {
            return this.configService.loadConfiguration().mergeMap(() => {
                return this.createObservable(filterObj, this.configService.config, url);
            });
        }
    }

    downloadPickUpExcelFile(filterObj: ApplySearchModel): Observable<Response> {
        const url = 'app/admin/apply/pickupexport';
        if (this.configService.config) {
            return this.createObservable(filterObj, this.configService.config, url);
        } else {
            return this.configService.loadConfiguration().mergeMap(() => {
                return this.createObservable(filterObj, this.configService.config, url);
            });
        }
    }

    downloadClassListFile(filterObj: ApplySearchModel): Observable<Response> {
        const url = 'app/admin/apply/classlistexport';
        if (this.configService.config) {
            return this.createObservable(filterObj, this.configService.config, url);
        } else {
            return this.configService.loadConfiguration().mergeMap(() => {
                return this.createObservable(filterObj, this.configService.config, url);
            });
        }
    }

    downloadInvoiceListFile(filterObj: ApplySearchModel): Observable<Response> {
        const url = 'app/admin/apply/invoicelistexport';
        if (this.configService.config) {
            return this.createObservable(filterObj, this.configService.config, url);
        } else {
            return this.configService.loadConfiguration().mergeMap(() => {
                return this.createObservable(filterObj, this.configService.config, url);
            });
        }
    }

    downloadGAInvoiceListFile(filterObj: ApplySearchModel): Observable<Response> {
        const url = 'app/admin/apply/gainvoicelistexport';
        if (this.configService.config) {
            return this.createObservable(filterObj, this.configService.config, url);
        } else {
            return this.configService.loadConfiguration().mergeMap(() => {
                return this.createObservable(filterObj, this.configService.config, url);
            });
        }
    }

    downloadCampExcelFile(filterObj: ApplySearchModel): Observable<Response> {
        const url = 'app/admin/apply/campexport';
        if (this.configService.config) {
            return this.createObservable(filterObj, this.configService.config, url);
        } else {
            return this.configService.loadConfiguration().mergeMap(() => {
                return this.createObservable(filterObj, this.configService.config, url);
            });
        }
    }

    createObservable(filterObj, AppSettings, url) {
        return Observable.create(obs => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', AppSettings.API_ENDPOINT + url, true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Accept', 'application/json');
            xhr.setRequestHeader('jwt', this.localStorageService.retrieve('token'));
            xhr.responseType = 'blob';
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        const contentType = 'application/csv; charset=UTF-8';
                        const blob = new Blob([xhr.response], { type: contentType });
                        obs.next(blob);
                        obs.complete();
                    } else {
                        if (xhr.status !== 500) {
                            obs.error(xhr.response);
                        } else {
                            obs.error(xhr);
                        }
                    }
                }
            };
            xhr.send(JSON.stringify(filterObj));
        });
    }

    uploadData(file: File): Observable<Response> {
        const url_apply = 'app/admin/apply/studentimport';
        const formData: FormData = new FormData();
        formData.append('studentimport', file);
        if (this.configService.config) {
            this.AppSettings = this.configService.config;
            return this.http.post(this.AppSettings['API_ENDPOINT'] + url_apply, formData, this.options).map((res: Response) => res.json());
        }
        return this.configService.loadConfiguration().mergeMap(() => {
            this.AppSettings = this.configService.config;
            return this.http.post(this.AppSettings['API_ENDPOINT'] + url_apply, formData, this.options).map((res: Response) => res.json());
        });
    }

    uploadHotelData(file: File,hotelBookingId): Observable<Response> {
        const url_apply = 'app/admin/apply/hotelbookingfileupload';
        const formData: FormData = new FormData();
        formData.append('hotelbookingfile', file);
        if (this.configService.config) {
            this.AppSettings = this.configService.config;
            return this.http.post(this.AppSettings['API_ENDPOINT'] + url_apply + '/' + hotelBookingId, formData, this.options).map((res: Response) => res.json());
        }
        return this.configService.loadConfiguration().mergeMap(() => {
            this.AppSettings = this.configService.config;
            return this.http.post(this.AppSettings['API_ENDPOINT'] + url_apply, formData, this.options).map((res: Response) => res.json());
        });
    }

    uploadCampData(file: File): Observable<Response> {
        const url_apply = 'app/admin/apply/campimport';
        const formData: FormData = new FormData();
        formData.append('campimport', file);
        if (this.configService.config) {
            this.AppSettings = this.configService.config;
            return this.http.post(this.AppSettings['API_ENDPOINT'] + url_apply, formData, this.options).map((res: Response) => res.json());
        }
        return this.configService.loadConfiguration().mergeMap(() => {
            this.AppSettings = this.configService.config;
            return this.http.post(this.AppSettings['API_ENDPOINT'] + url_apply, formData, this.options).map((res: Response) => res.json());
        });
    }

    downloadHotelData(filterObj: ApplySearchModel,hotelBookingId): Observable<Response> {
        const url = 'app/admin/apply/hotelbookingfiledownload';
        if (this.configService.config) {
            return this.createObservable(filterObj, this.configService.config, url + '/' + hotelBookingId);
        } else {
            return this.configService.loadConfiguration().mergeMap(() => {
                return this.createObservable(filterObj, this.configService.config, url + '/' + hotelBookingId);
            });
        }
    }

    removeHotelReserved(accommodationName,hotelBookingId,applyId): Observable<Response> {
        const url_remove_reserved_hotel = 'app/admin/apply/delete-reserved-hotel';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_remove_reserved_hotel + '/' + accommodationName + '/' + hotelBookingId + '/' + applyId, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    getCntryCode() {
        return this.http.get('assets/data/country-codes.json')
            .map(res => res.json());
    }

    getCmpsCode() {
        return this.http.get('assets/data/campus.json')
            .map(res => res.json());
    }

    getStaytypes() {
        return this.http.get('assets/data/stay-types.json')
            .map(res => res.json());
    }

    getStaytypesItp() {
        return this.http.get('assets/data/stay-types-itp.json')
            .map(res => res.json());
    }

    getStaytypesSfc() {
        return this.http.get('assets/data/stay-types-sfc.json')
            .map(res => res.json());
    }

    getRoomtypes() {
        return this.http.get('assets/data/room-types.json')
            .map(res => res.json());
    }

    getRoomTypesZ(){
        return this.http.get('assets/data/room-types-z.json')
            .map(res => res.json());
    }

    getRoomTypesWF(){
        return this.http.get('assets/data/room-types-wf.json')
            .map(res => res.json());
    }

    getRoomTypesDX(){
        return this.http.get('assets/data/room-types-dx.json')
            .map(res => res.json());
    }

    getRoomTypesEX(){
        return this.http.get('assets/data/room-types-exe.json')
            .map(res => res.json());
    }

    getPlantypes() {
        return this.http.get('assets/data/plan-types.json')
            .map(res => res.json());
    }

    getStudentstatus() {
        return this.http.get('assets/data/student-status.json')
            .map(res => res.json());
    }

    getYears(): Observable<Response> {
        const url_get_years = 'app/admin/apply/get-years';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_get_years, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    applyList(filterObj: ApplySearchModel): Observable<Response> {

        return this.checkConfigJson(() => {
            return this.http.post(this.AppSettings['API_ENDPOINT'] + this.url + '/search', filterObj, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    changeLogList(applyId): Observable<Response> {
        const url_changelog = 'app/admin/apply/find-log';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_changelog + '/' + applyId, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    getRefundInvoice(applyId): Observable<Response> {
        const url_refund_invoice = 'app/admin/apply/find-refund-invoice';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_refund_invoice + '/' + applyId, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    getExtenionInvoice(applyId): Observable<Response> {
        const url_extension_invoice = 'app/admin/apply/find-extension-invoice';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_extension_invoice + '/' + applyId, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    getInvoice(applyId): Observable<Response> {
        const url_invoice = 'app/admin/apply/find-invoice';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_invoice + '/' + applyId, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    getRefundInvoicePhpRate(applyId): Observable<Response> {
        const url_refund_invoice_php_rate = 'app/admin/apply/find-refund-invoice-php-rate';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_refund_invoice_php_rate + '/' + applyId, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    getExtenionInvoicePhpRate(applyId): Observable<Response> {
        const url_extension_invoice_php_rate = 'app/admin/apply/find-extension-invoice-php-rate';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_extension_invoice_php_rate + '/' + applyId, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    getInvoicePhpRate(applyId): Observable<Response> {
        const url_invoice_php_rate = 'app/admin/apply/find-invoice-php-rate';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_invoice_php_rate + '/' + applyId, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    getApply(ApplyId): Observable<Response> {
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + this.url + '/' + ApplyId, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    createApply(data: StudentApplyModel): Observable<Response> {
        return this.checkConfigJson(() => {
            return this.http.post(this.AppSettings['API_ENDPOINT'] + this.url, data, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    updateRoom(roomMemo,reserveStatusId,dormBldg,vistorType,accommodationId,roomId,checkIn,checkOut,applyId): Observable<Response> {
        const url_update_room = 'app/admin/apply/update-room';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_update_room + '/' + roomMemo + '/' + reserveStatusId + '/' + dormBldg + '/' + vistorType +'/'
                + accommodationId + '/' + roomId + '/' + checkIn + '/' + checkOut + '/' + applyId, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    updateCourse(bldg,course,dateFrom,dateTo,applyId): Observable<Response> {
        const url_add_course = 'app/admin/apply/add-course';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_add_course +'/'+ bldg + '/' + course +
                '/' + dateFrom + '/' + dateTo + '/' + applyId, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    deleteCourse(courseId,applyId): Observable<Response> {
        const url_remove_course = 'app/admin/apply/delete-course';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_remove_course + '/' + courseId + '/' + applyId, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    getCourseList(applyId): Observable<Response> {
        const url_find_courses = 'app/admin/apply/find-courses';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_find_courses + '/' + applyId, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    getCourseLogsList(applyId): Observable<Response> {
        const url_find_course_logs = 'app/admin/apply/find-course-logs';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_find_course_logs + '/' + applyId, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    getReservedRoomsList(applyId): Observable<Response> {
        const url_find_reserved_rooms = 'app/admin/apply/find-reserved-rooms';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_find_reserved_rooms + '/' + applyId, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    getCondoReservedRoomsList(applyId): Observable<Response> {
        const url_find_condo_reserved_rooms = 'app/admin/apply/find-condo-reserved-rooms';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_find_condo_reserved_rooms + '/' + applyId, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    getHotelsReservedRoomsList(applyId): Observable<Response> {
        const url_find_hotels_reserved_rooms = 'app/admin/apply/find-hotels-reserved-rooms';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_find_hotels_reserved_rooms + '/' + applyId, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    getWalkinReservedRoomsList(applyId): Observable<Response> {
        const url_find_walkin_reserved_rooms = 'app/admin/apply/find-walkin-reserved-rooms';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_find_walkin_reserved_rooms + '/' + applyId, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    getReservedRoomsLogsList(applyId): Observable<Response> {
        const url_find_reserved_rooms_logs = 'app/admin/apply/find-reserved-rooms-logs';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_find_reserved_rooms_logs + '/' + applyId, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    getReservedHotelsList(applyId): Observable<Response> {
        const url_find_reserved_hotels = 'app/admin/apply/find-reserved-hotels';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_find_reserved_hotels + '/' + applyId, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    updateApplyDiscount(applyId, totalInvoice): Observable<Response> {
        const url_update_discount = 'app/admin/apply/update-apply-discount';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_update_discount + '/' + applyId + '/' + totalInvoice, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    updateExtensionInvoiceDiscount(applyId, totalInvoice): Observable<Response> {
        const url_update_ext_inv_discount = 'app/admin/apply/update-ext-invoice-discount';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_update_ext_inv_discount + '/' + applyId + '/' + totalInvoice, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    updateRefundInvoiceDiscount(applyId, totalInvoice): Observable<Response> {
        const url_update_rfd_inv_discount = 'app/admin/apply/update-rfd-invoice-discount';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_update_rfd_inv_discount + '/' + applyId + '/' + totalInvoice, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    updateApplyCommission(commission_reason,commission,commission_percentage,applyId): Observable<Response> {
        const url_update_commission = 'app/admin/apply/update-apply-commission';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_update_commission + '/' + commission_reason + '/' + commission + '/' + commission_percentage + '/' + applyId, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    updateApplyExtensionInvCommission(applyId, commission, commission_percentage): Observable<Response> {
        const url_update_ext_inv_commission = 'app/admin/apply/update-apply-ext-inv-commission';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_update_ext_inv_commission + '/' + applyId + '/' + commission + '/' + commission_percentage, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    updateApplyRefundInvCommission(applyId, commission, commission_percentage): Observable<Response> {
        const url_update_rfd_inv_commission = 'app/admin/apply/update-apply-rfd-inv-commission';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_update_rfd_inv_commission + '/' + applyId + '/' + commission + '/' + commission_percentage, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    updateApplyGAPaymentStatus(applyId): Observable<Response> {
        const url_update_ga_paymentstatus = 'app/admin/apply/update-apply-ga-paymentstatus';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_update_ga_paymentstatus + '/' + applyId, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    updateApplyInvoicePaymentStatus(applyId): Observable<Response> {
        const url_update_invoice_paymentstatus = 'app/admin/apply/update-apply-invoice-paymentstatus';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_update_invoice_paymentstatus + '/' + applyId, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    updateApplyInvoiceDueDate(applyId): Observable<Response> {
        const url_update_invoice_due_date = 'app/admin/apply/update-invoice-due-date';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_update_invoice_due_date + '/' + applyId, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    getApplyInvoice(applyId, invoiceId): Observable<Response> {
        const url_apply_invoice = 'app/admin/apply/apply-invoice';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_apply_invoice + '/' + applyId + '/' + invoiceId, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    getInvoiceDiscountList(applyId, invoiceId): Observable<Response> {
        const url_find_invoice_discount = 'app/admin/apply/find-invoice-discount';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_find_invoice_discount  + '/' + applyId + '/' + invoiceId, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    createInvoiceDiscount(applyId,discount,reason,invoiceNumber): Observable<Response> {
        const url_create_invoice_discount = 'app/admin/apply/create-invoice-discount';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_create_invoice_discount + '/' + applyId + '/'
                + discount + '/' + reason + '/' + invoiceNumber, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    updateInvoiceDiscount(InvoiceId, data: InvoiceDiscountModel): Observable<Response> {
        const url_update_invoice_discount = 'app/admin/apply/update-invoice-discount';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_update_invoice_discount + '/' + InvoiceId + '/' + data, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    deleteInvoiceDiscount(applyId, Id,invoiceNumber,discountAmount): Observable<Response> {
        const url_remove_invoice_discount = 'app/admin/apply/delete-invoice-discount';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_remove_invoice_discount + '/' + applyId + '/' + Id +
                '/' + invoiceNumber + '/' + discountAmount, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    deleteExtInvoiceDiscount(applyId, Id,invoiceNumber,discountAmount): Observable<Response> {
        const url_remove_ext_invoice_discount = 'app/admin/apply/delete-ext-invoice-discount';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_remove_ext_invoice_discount + '/' + applyId + '/' + Id +
                '/' + invoiceNumber + '/' + discountAmount, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    deleteRfdInvoiceDiscount(applyId, Id,invoiceNumber,discountAmount): Observable<Response> {
        const url_remove_rfd_invoice_discount = 'app/admin/apply/delete-rfd-invoice-discount';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_remove_rfd_invoice_discount + '/' + applyId + '/' + Id +
                '/' + invoiceNumber + '/' + discountAmount, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    deleteWalkin(applyId): Observable<Response> {
        const url_remove_walkin = 'app/admin/apply/delete-walkin';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_remove_walkin + '/' + applyId, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    getRoomListService(accommodationId,dormBldg,dormRoomType,checkInDate,checkOutDate,visitorType,searchFilter,applyId) {
        const url_room_list = 'app/admin/apply/get-room-filter';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_room_list + "/" + accommodationId +"/" + dormBldg + "/" + dormRoomType +
                "/" + checkInDate + "/" + checkOutDate + "/" + visitorType + "/" + searchFilter + "/" + applyId, this.getHeader()).map((res: Response) => res);
        });
    }

    removeReservedRoom(reservedRoomName,reservedRoomType,reservationId,applyId): Observable<Response> {
        const url_remove_reserved_room = 'app/admin/apply/delete-reserved-room';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_remove_reserved_room + '/' + reservedRoomName + '/' + reservedRoomType
                + '/' + reservationId + '/' + applyId, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    removeCondoReservedRoom(reservedRoomName,reservedRoomType,reservationId,applyId): Observable<Response> {
        const url_remove_reserved_room = 'app/admin/apply/delete-reserved-room-condo';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_remove_reserved_room + '/' + reservedRoomName + '/' + reservedRoomType
                + '/' + reservationId + '/' + applyId, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    removeHotelsReservedRoom(reservedRoomName,reservedRoomType,reservationId,applyId): Observable<Response> {
        const url_remove_reserved_room = 'app/admin/apply/delete-reserved-room-hotels';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_remove_reserved_room + '/' + reservedRoomName + '/' + reservedRoomType
                + '/' + reservationId + '/' + applyId, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    removeWalkinReservedRoom(reservedRoomName,reservedRoomType,reservationId,applyId): Observable<Response> {
        const url_remove_reserved_room = 'app/admin/apply/delete-reserved-room-walkin';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_remove_reserved_room + '/' + reservedRoomName + '/' + reservedRoomType
                + '/' + reservationId + '/' + applyId, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    changeToPresentStatus(reserveId): Observable<Response> {
        const url_change_present_status = 'app/admin/apply/change-to-present';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_change_present_status + '/' + reserveId, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    changeToReservedStatus(reserveId): Observable<Response> {
        const url_change_reserved_status = 'app/admin/apply/change-to-reserved';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_change_reserved_status + '/' + reserveId, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    changeToCondoPresentStatus(reserveId): Observable<Response> {
        const url_change_condo_present_status = 'app/admin/apply/change-to-present-condo';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_change_condo_present_status + '/' + reserveId, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    changeToCondoReservedStatus(reserveId): Observable<Response> {
        const url_change_condo_reserved_status = 'app/admin/apply/change-to-reserved-condo';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_change_condo_reserved_status + '/' + reserveId, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    changeToHotelsPresentStatus(reserveId): Observable<Response> {
        const url_change_hotels_present_status = 'app/admin/apply/change-to-present-hotels';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_change_hotels_present_status + '/' + reserveId, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    changeToHotelsReservedStatus(reserveId): Observable<Response> {
        const url_change_hotels_reserved_status = 'app/admin/apply/change-to-reserved-hotels';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_change_hotels_reserved_status + '/' + reserveId, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    changeToWalkinPresentStatus(reserveId): Observable<Response> {
        const url_change_walkin_present_status = 'app/admin/apply/change-to-present-walkin';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_change_walkin_present_status + '/' + reserveId, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    changeToWalkinReservedStatus(reserveId): Observable<Response> {
        const url_change_walkin_reserved_status = 'app/admin/apply/change-to-reserved-walkin';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_change_walkin_reserved_status + '/' + reserveId, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    getRoomAvailableService(dateFrom, campus, roomType, stayType) {
        const url_room_available = 'app/admin/apply/get-total-numbers-avail-room';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_room_available + "/" + dateFrom + "/"  + campus + "/" + stayType, this.getHeader()).map((res: Response) => res);
        });
    }

    getListGraduatingService(graduateFrom,graduateCampus) {
        const url_graduating_list = 'app/admin/apply/get-list-graduating';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_graduating_list + "/" + graduateFrom + "/"  + graduateCampus, this.getHeader()).map((res: Response) => res);
        });
    }

    getEmptyBedsService(dateFrom ,dateTo, campus, stayType) {
        const url_empty_beds = 'app/admin/apply/get-total-numbers-empty-beds';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_empty_beds + "/" + dateFrom + "/" + dateTo + "/" + campus + "/" + stayType, this.getHeader()).map((res: Response) => res);
        });
    }

    getListOfChangingDormRoom(changeFrom,changeTo,selectedCampus) {
        const url_changedormroom_list = 'app/admin/apply/get-list-change-dormroom';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_changedormroom_list + "/" + changeFrom + "/" + changeTo + "/" + selectedCampus, this.getHeader()).map((res: Response) => res);
        });
    }

    getListOfChangingHotelsRoom(changeFrom,changeTo,selectedCampus) {
        const url_changehotelsroom_list = 'app/admin/apply/get-list-change-hotelsroom';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_changehotelsroom_list + "/" + changeFrom + "/" + changeTo + "/" + selectedCampus, this.getHeader()).map((res: Response) => res);
        });
    }

    getListOfChangingWalkinsRoom(changeFrom,changeTo,selectedCampus) {
        const url_changewalkinsroom_list = 'app/admin/apply/get-list-change-walkinsroom';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_changewalkinsroom_list + "/" + changeFrom + "/" + changeTo + "/" + selectedCampus, this.getHeader()).map((res: Response) => res);
        });
    }

    getListOfChangingCondosRoom(changeFrom,changeTo,selectedCampus) {
        const url_changecondosroom_list = 'app/admin/apply/get-list-change-condosroom';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_changecondosroom_list + "/" + changeFrom + "/" + changeTo + "/" + selectedCampus, this.getHeader()).map((res: Response) => res);
        });
    }

    getListOfChangingHotelRoom(changeFrom,changeTo,selectedCampus) {
        const url_changehotelroom_list = 'app/admin/apply/get-list-change-hotelroom';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_changehotelroom_list + "/" + changeFrom + "/" + changeTo + "/" + selectedCampus, this.getHeader()).map((res: Response) => res);
        });
    }

    getListOfChangePlan(changePlanFrom,changePlanTo,selectedCampus) {
        const url_changeplan_list = 'app/admin/apply/get-list-change-plan';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_changeplan_list + "/" + changePlanFrom + "/" + changePlanTo + "/" + selectedCampus, this.getHeader()).map((res: Response) => res);
        });
    }

    getPlanCountListService(countPlanFrom,countPlanTo,countPlanCampus,countCntCode) {
        const url_plan_count_list = 'app/admin/apply/get-plan-count';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_plan_count_list + "/" + countPlanFrom +"/" + countPlanTo +
                "/" + countPlanCampus + "/" + countCntCode, this.getHeader()).map((res: Response) => res);
        });
    }

    getCafeListService(cafeFrom,cafeTo,cafeCampus) {
        const url_cafe_count_list = 'app/admin/apply/get-cafe-list';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_cafe_count_list + "/" + cafeFrom +"/" + cafeTo +
                "/" + cafeCampus, this.getHeader()).map((res: Response) => res);
        });
    }

    getWeeklyReportListService(weeklyFrom,selectedCampus) {
        const url_cafe_count_list = 'app/admin/apply/get-weekly-report-list';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_cafe_count_list + "/" + weeklyFrom + "/" + selectedCampus, this.getHeader()).map((res: Response) => res);
        });
    }

    getSalesReportService(salesFrom,salesTo) {
        const url_sales_report_list = 'app/admin/apply/get-sales-report';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_sales_report_list + "/" + salesFrom + "/" + salesTo, this.getHeader()).map((res: Response) => res);
        });
    }

    getCampBookReportService(campFrom,campTo,campus) {
        const url_camp_book_report_list = 'app/admin/apply/get-camp-book-report';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_camp_book_report_list + "/" + campFrom + "/" + campTo + "/" + campus, this.getHeader()).map((res: Response) => res);
        });
    }

    createGroupApply(data: StudentApplyGroupModel): Observable<Response> { /* This Service goes to store StudentApplyController function */
        return this.checkConfigJson(() => {
            return this.http.post(this.AppSettings['API_ENDPOINT'] + this.url, data, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    getTermsReportService(yearFrom) {
        const url_number_of_weeks_report = 'app/admin/apply/get-numbers-weeks-report';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_number_of_weeks_report + "/" + yearFrom, this.getHeader()).map((res: Response) => res);
        });
    }

    getStudentsCountService(dateFrom) {
        const url_number_of_students_report = 'app/admin/apply/get-numbers-students-report';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_number_of_students_report + "/" + dateFrom, this.getHeader()).map((res: Response) => res);
        });
    }

    getPaymentsUnconfirmed(applyId): Observable<Response> {
        const url_find_payments_unconfirmed = 'app/admin/apply/find-payments-unconfirmed';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_find_payments_unconfirmed + '/' + applyId, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    getPaymentsConfirmed(applyId): Observable<Response> {
        const url_find_payments_confirmed = 'app/admin/apply/find-payments-confirmed';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_find_payments_confirmed + '/' + applyId, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    confirmStudentPayment(paymentId): Observable<Response> {
        const url_confirm_payment = 'app/admin/apply/confirm-student-payment';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_confirm_payment + '/' + paymentId, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    updateEditId(ApplyId): Observable<Response> {
        const url_edit_id = 'app/admin/apply/update-edit-id';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_edit_id + '/' + ApplyId, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    updateInvoiceNumber(Id): Observable<Response> {
        const url_invoice_number = 'app/admin/apply/update-invoice-number';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_invoice_number + '/' + Id, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    updateExtInvoiceNumber(Id): Observable<Response> {
        const url_ext_invoice_number = 'app/admin/apply/update-ext-invoice-number';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_ext_invoice_number + '/' + Id, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    updateApply(ApplyId, data: StudentApplyModel): Observable<Response> {
        return this.checkConfigJson(() => {
            return this.http.put(this.AppSettings['API_ENDPOINT'] + this.url + '/' + ApplyId, data, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    updateInvoice(ApplyId, data: InvoiceModel): Observable<Response> {
        return this.checkConfigJson(() => {
            return this.http.put(this.AppSettings['API_ENDPOINT'] + this.url + '/' + ApplyId, data, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    createInvoice(data: InvoiceModel): Observable<Response> {
        return this.checkConfigJson(() => {
            return this.http.post(this.AppSettings['API_ENDPOINT'] + this.url, data, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    updateExtensionInvoice(ApplyId, data: ExtensionInvoiceModel): Observable<Response> {
        return this.checkConfigJson(() => {
            return this.http.put(this.AppSettings['API_ENDPOINT'] + this.url + '/' + ApplyId, data, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    createExtensionInvoice(data: ExtensionInvoiceModel): Observable<Response> {
        return this.checkConfigJson(() => {
            return this.http.post(this.AppSettings['API_ENDPOINT'] + this.url, data, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    updateRefundInvoice(ApplyId, data: RefundInvoiceModel): Observable<Response> {
        return this.checkConfigJson(() => {
            return this.http.put(this.AppSettings['API_ENDPOINT'] + this.url + '/' + ApplyId, data, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    createRefundInvoice(data: RefundInvoiceModel): Observable<Response> {
        return this.checkConfigJson(() => {
            return this.http.post(this.AppSettings['API_ENDPOINT'] + this.url, data, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    deleteApply(ApplyId): Observable<Response> {
        return this.checkConfigJson(() => {
            return this.http.delete(this.AppSettings['API_ENDPOINT'] + this.url + '/' + ApplyId, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    deleteFlagApply(ApplyId, delFlagOne): Observable<Response> {
        const url_del_flag_update = 'app/admin/apply/del-flag-update';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_del_flag_update + '/' + ApplyId+ "/"  + delFlagOne, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    deleteInvoiceNumber(applyId): Observable<Response> {
        const url_remove_invoice_number = 'app/admin/apply/delete-invoice-number';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_remove_invoice_number + '/' + applyId, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    deleteExtendedInvoiceNumber(applyId): Observable<Response> {
        const url_remove_ext_invoice_number = 'app/admin/apply/delete-extended-invoice-number';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_remove_ext_invoice_number + '/' + applyId, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    deleteRefundInvoiceNumber(applyId): Observable<Response> {
        const url_remove_rfd_invoice_number = 'app/admin/apply/delete-refund-invoice-number';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_remove_rfd_invoice_number + '/' + applyId, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    updateMultipleStudentStatus(checkedList,updateStatus): Observable<Response> {
        const url_update_student_status = 'app/admin/apply/update-multiple-student-status';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_update_student_status + '/' + checkedList +
                '/' + updateStatus, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    updateIsInvoiceConfirmedFlag(ApplyId, invoiceLockStatus): Observable<Response> {
        const url_invoice_lock_update = 'app/admin/apply/is-invoice-confirmed-update';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_invoice_lock_update + '/' + ApplyId + "/"  + invoiceLockStatus, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    updateIsExtInvoiceConfirmedFlag(ApplyId, invoiceExtLockStatus): Observable<Response> {
        const url_ext_invoice_lock_update = 'app/admin/apply/is-ext-invoice-confirmed-update';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_ext_invoice_lock_update + '/' + ApplyId + "/"  + invoiceExtLockStatus, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    updateIsRfdInvoiceConfirmedFlag(ApplyId, invoiceRfdLockStatus): Observable<Response> {
        const url_rfd_invoice_lock_update = 'app/admin/apply/is-rfd-invoice-confirmed-update';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_rfd_invoice_lock_update + '/' + ApplyId + "/"  + invoiceRfdLockStatus, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    private checkConfigJson(callback) {
        if (this.configService.config) {
            this.AppSettings = this.configService.config;
            return callback();
        }
        return this.configService.loadConfiguration().mergeMap(() => {
            this.AppSettings = this.configService.config;
            return callback();
        });
    }

    private getHeader(data?) {
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'jwt': this.localStorageService.retrieve('token'),
        }); // ... Set content type to JSON
        let options;
        if (data) {
            options = new RequestOptions({ headers: headers, body: data });
        } else {
            options = new RequestOptions({ headers: headers });
        }
        return options;
    }
}
