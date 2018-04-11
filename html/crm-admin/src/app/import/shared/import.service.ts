import { Injectable } from '@angular/core';
import { Http, Headers, Response, Request, RequestMethod, URLSearchParams, RequestOptions } from '@angular/http';
import { ConfigService } from '../../shared/config.service';
import { Observable } from 'rxjs/Observable';
// import { AppSettings } from '../../app.setting';
import { LocalStorageService } from 'ng2-webstorage';

@Injectable()
export class ImportService {
  responseData: any;
  private AppSettings;
  private headers = new Headers({
    'jwt': this.localStorageService.retrieve('token')
  }); // ... Set content type to JSON
  private options = new RequestOptions({ headers: this.headers });

  constructor(private localStorageService: LocalStorageService, private http: Http, public configService: ConfigService) { }

  uploadData(file: File): Observable<Response> {
    const url = 'app/admin/import';
    const formData: FormData = new FormData();
    formData.append('import', file);
    if (this.configService.config) {
      this.AppSettings = this.configService.config;
      return this.http.post(this.AppSettings['API_ENDPOINT'] + url, formData, this.options).map((res: Response) => res.json());
    }
    return this.configService.loadConfiguration().mergeMap(() => {
      this.AppSettings = this.configService.config;
      return this.http.post(this.AppSettings['API_ENDPOINT'] + url, formData, this.options).map((res: Response) => res.json());
    });
  }

  downloadTemplate(): Observable<Response> {
    const url = 'app/admin/download-import-template';
    if (this.configService.config) {
      return this.createObservable(this.configService.config, url);
    }
    return this.configService.loadConfiguration().mergeMap(() => {
      return this.createObservable(this.configService.config, url);
    });
  }

  downloadBedIds(): Observable<Response> {
    const url = 'app/admin/download-beds-id';
    if (this.configService.config) {
      return this.createObservable(this.configService.config, url);
    }
    return this.configService.loadConfiguration().mergeMap(() => {
      return this.createObservable(this.configService.config, url);
    });
  }

  createObservable(AppSettings, url) {
    return Observable.create(obs => {
      const xhr = new XMLHttpRequest();

      xhr.open('GET', AppSettings['API_ENDPOINT'] + url, true);
      xhr.setRequestHeader('Content-Type', 'application/csv; charset=UTF-8');
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
      xhr.send();
    });
  }
}
