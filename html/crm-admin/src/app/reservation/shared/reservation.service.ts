import { Injectable } from '@angular/core';
import { Headers, BaseRequestOptions, RequestOptions, Http, Response } from '@angular/http';
import { ReservationDateModel, OtherReservationDateModel } from './reservation.model'
import { ConfigService } from '../../shared/config.service';
import { Observable } from 'rxjs/Observable';
// import { AppSettings } from '../../app.setting';
import { LocalStorageService } from 'ng2-webstorage';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class ReservationService {
    private url = 'app/admin/reservation';
    private AppSettings;
    constructor(private http: Http, public configService: ConfigService, private localStorageService: LocalStorageService) { }

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

    checkConfigJson(callback) {
        if (this.configService.config) {
            this.AppSettings = this.configService.config;
            return callback();
        }
        return this.configService.loadConfiguration().mergeMap(() => {
            this.AppSettings = this.configService.config;
            return callback();
        });
    }

    getListBeds(data): Observable<Response> {
        let url = 'app/admin/reservation/filter';
        return this.checkConfigJson(() => {
            return this.http.post(this.AppSettings['API_ENDPOINT'] + url, data, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    getListAccommodations(data): Observable<Response> {
        let url = 'app/admin/other-reservation/filter';
        return this.checkConfigJson(() => {
            return this.http.post(this.AppSettings['API_ENDPOINT'] + url, data, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    getDataForFilter() {
        let url = 'app/admin/get-option-data-filter';
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + url, this.getHeader()).map((res: Response) => res);
        });
    }

    createReservation(data: ReservationDateModel): Observable<Response> {
        return this.checkConfigJson(() => {
            return this.http.post(this.AppSettings['API_ENDPOINT'] + this.url, data, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    deleteReservation(reservationId, data): Observable<Response> {
        return this.checkConfigJson(() => {
            return this.http.delete(this.AppSettings['API_ENDPOINT'] + this.url + '/' + reservationId, this.getHeader(data))
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    getReservation(reservationId): Observable<Response> {
        return this.checkConfigJson(() => {
            return this.http.get(this.AppSettings['API_ENDPOINT'] + this.url + '/' + reservationId, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    updateReservation(reservationId, data: ReservationDateModel): Observable<Response> {
        return this.checkConfigJson(() => {
            return this.http.put(this.AppSettings['API_ENDPOINT'] + this.url + '/' + reservationId, data, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    checkDateDuplicateOrNot(data) {
        return this.checkConfigJson(() => {
            return this.http.post(this.AppSettings['API_ENDPOINT'] + this.url + '/check-date', data, this.getHeader())
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    createOtherReservation(data: OtherReservationDateModel): Observable<Response> {
        let url = 'app/admin/other-reservation';
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'jwt': this.localStorageService.retrieve('token'),
        }); // ... Set content type to JSON
        let options = new RequestOptions({ headers: headers });

        return this.checkConfigJson(() => {
            return this.http.post(this.AppSettings['API_ENDPOINT'] + url, data, options)
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    updateOtherReservation(reservationId, data: OtherReservationDateModel): Observable<Response> {
        let url = 'app/admin/other-reservation';
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'jwt': this.localStorageService.retrieve('token'),
        }); // ... Set content type to JSON
        let options = new RequestOptions({ headers: headers });

        return this.checkConfigJson(() => {
            return this.http.put(this.AppSettings['API_ENDPOINT'] + url + '/' + reservationId, data, options)
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }

    deleteOtherReservation(reservationId, data): Observable<Response> {
        let url = 'app/admin/other-reservation';
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'jwt': this.localStorageService.retrieve('token'),
        }); // ... Set content type to JSON
        let options = new RequestOptions({ headers: headers, body: data });

        return this.checkConfigJson(() => {
            return this.http.delete(this.AppSettings['API_ENDPOINT'] + url + '/' + reservationId, options)
                .map((res: Response) => res)
                .catch((error: any) => Observable.throw(error.json().errors || 'Server error'));
        });
    }
}
