import { Injectable } from '@angular/core';
import { Http, Headers, Response, Request, RequestMethod, URLSearchParams, RequestOptions } from '@angular/http';
import { CoolHttp, HttpHeader } from 'angular2-cool-http';
import { ConfigService } from '../../shared/config.service';
import { Observable } from 'rxjs/Observable';
// import { AppSettings } from '../../app.setting';
import { LocalStorageService } from 'ng2-webstorage';
import { ExportFilterModel } from './export.model';

@Injectable()
export class ExportService {
    private headers = new Headers({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'jwt': this.localStorageService.retrieve('token')
    }); // ... Set content type to JSON
    private options = new RequestOptions({ headers: this.headers });

    constructor(private localStorageService: LocalStorageService,
        private http: Http,
        public configService: ConfigService) { }

    downloadFile(filterObj: ExportFilterModel): Observable<Response> {
        const url = 'app/admin/export';
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
}
