import { Injectable } from '@angular/core';
import { Http, Headers, Response, Request, RequestMethod, URLSearchParams, RequestOptions } from '@angular/http';
import { CoolHttp, HttpHeader } from 'angular2-cool-http';
import { ConfigService } from '../../shared/config.service';
import { Observable } from 'rxjs/Observable';
// import { AppSettings } from '../../app.setting';
import { LocalStorageService } from 'ng2-webstorage';
import {
    ApplySearchModel, StudentApplyModel, ImportDataFullErrorModel, ImportDataLineErrorModel, ExportFilterModel,
    InvoiceDiscountModel
} from './apply.model';

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

    removeHotelReserved(hotelBookingId): Observable<Response> {
        const url_remove_reserved_hotel = 'app/admin/apply/delete-reserved-hotel';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_remove_reserved_hotel + '/' + hotelBookingId, this.getHeader())
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

    updateRoom(dormBldg,accommodationId,roomId,checkIn,checkOut,applyId): Observable<Response> {
        const url_update_room = 'app/admin/apply/update-room';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_update_room + '/' + dormBldg +'/' + accommodationId + '/' + roomId +
                '/' + checkIn + '/' + checkOut + '/' + applyId, this.getHeader())
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

    updateApplyCommission(applyId, commission): Observable<Response> {
        const url_update_commission = 'app/admin/apply/update-apply-commission';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_update_commission + '/' + applyId + '/' + commission, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    getApplyInvoice(invoiceId): Observable<Response> {
        const url_apply_invoice = 'app/admin/apply/apply-invoice';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_apply_invoice + '/' + invoiceId, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    getInvoiceDiscountList(invoiceId): Observable<Response> {
        const url_find_invoice_discount = 'app/admin/apply/find-invoice-discount';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_find_invoice_discount + '/' + invoiceId, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    createInvoiceDiscount(discount,reason,invoiceNumber): Observable<Response> {
        const url_create_invoice_discount = 'app/admin/apply/create-invoice-discount';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_create_invoice_discount + '/' + discount + '/'
                + reason + '/' + invoiceNumber, this.getHeader())
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

    deleteInvoiceDiscount(Id,invoiceNumber,discountAmount): Observable<Response> {
        const url_remove_invoice_discount = 'app/admin/apply/delete-invoice-discount';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_remove_invoice_discount + '/' + Id + '/' + invoiceNumber + '/' + discountAmount, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    getRoomListService(accommodationId,dormBldg,dormRoomType,checkInDate,checkOutDate,applyId) {
        const url_room_list = 'app/admin/apply/get-room-filter';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_room_list + "/" + accommodationId +"/" + dormBldg + "/" + dormRoomType +
                "/" + checkInDate + "/" + checkOutDate + "/" + applyId, this.getHeader()).map((res: Response) => res);
        });
    }

    removeReservedRoom(reservationId,applyId): Observable<Response> {
        const url_remove_reserved_room = 'app/admin/apply/delete-reserved-room';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_remove_reserved_room + '/' + reservationId + '/' + applyId, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    getRoomAvailableService(dateFrom, campus) {
        const url_room_available = 'app/admin/apply/get-total-numbers-avail-room';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_room_available + "/" + dateFrom + "/"  + campus, this.getHeader()).map((res: Response) => res);
        });
    }

    getListGraduatingService(graduateFrom,graduateCampus) {
        const url_graduating_list = 'app/admin/apply/get-list-graduating';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_graduating_list + "/" + graduateFrom + "/"  + graduateCampus, this.getHeader()).map((res: Response) => res);
        });
    }

    getListOfChangingDormRoom(changeFrom) {
        const url_changedormroom_list = 'app/admin/apply/get-list-change-dormroom';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_changedormroom_list + "/" + changeFrom, this.getHeader()).map((res: Response) => res);
        });
    }

    getListOfChangingHotelRoom(changeFrom) {
        const url_changehotelroom_list = 'app/admin/apply/get-list-change-hotelroom';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url_changehotelroom_list + "/" + changeFrom, this.getHeader()).map((res: Response) => res);
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

    updateApply(ApplyId, data: StudentApplyModel): Observable<Response> {
        return this.checkConfigJson(() => {
            return this.http.put(this.AppSettings['API_ENDPOINT'] + this.url + '/' + ApplyId, data, this.getHeader())
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

    deleteFlagApply(ApplyId, data: StudentApplyModel): Observable<Response> {
        return this.checkConfigJson(() => {
            return this.http.put(this.AppSettings['API_ENDPOINT'] + this.url + '/' + ApplyId, data, this.getHeader())
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
