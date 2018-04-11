import { Injectable } from '@angular/core';
import { Http, Headers, Response, Request, RequestMethod, URLSearchParams, RequestOptions } from '@angular/http';
import { ConfigService } from '../../shared/config.service';
import { Observable } from 'rxjs/Observable';
// import { AppSettings } from '../../app.setting';
import { LocalStorageService } from 'ng2-webstorage';

@Injectable()
export class LogsService {
  responseData: any;
  private headers = new Headers({
    'jwt': this.localStorageService.retrieve('token'),
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }); // ... Set content type to JSON
  private AppSettings;

  private options = new RequestOptions({ headers: this.headers });

  constructor(private localStorageService: LocalStorageService,
    private http: Http,
    private configService: ConfigService) { }

  listLogs(): Observable<Response> {
    let url = 'app/admin/logs';
    if (this.configService.config) {
      this.AppSettings = this.configService.config;
      return this.http.get(this.AppSettings['API_ENDPOINT'] + url, this.options).map((res: Response) => res.json());
    }
    return this.configService.loadConfiguration().mergeMap(() => {
      this.AppSettings = this.configService.config;
      return this.http.get(this.AppSettings['API_ENDPOINT'] + url, this.options).map((res: Response) => res.json());
    });
  }

  getLog(date: string): Observable<Response> {
    const url = 'app/admin/logs/' + date;
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
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.setRequestHeader('jwt', this.localStorageService.retrieve('token'));
      xhr.responseType = 'blob';

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            const contentType = 'text/plain; charset=UTF-8';
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
