import { Injectable } from '@angular/core';
import { Headers, BaseRequestOptions, RequestOptions, Http, Response } from '@angular/http';
import { LoginModel } from './login.model';
import { ConfigService } from '../../shared/config.service';
import { Observable } from 'rxjs/Observable';
// import { AppSettings } from '../../app.setting'

@Injectable()
export class LoginService {
  private AppSettings;

  constructor(private http: Http, public configService: ConfigService) { }

  submit(data: LoginModel): Observable<Response> {
    const url = 'app/admin/login';
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }); // ... Set content type to JSON
    const options = new RequestOptions({ headers: headers });
    if (this.configService.config) {
      this.AppSettings = this.configService.config;
      return this.http.post(this.AppSettings['API_ENDPOINT'] + url, data, options).map((res: Response) => res.json());
    }
    return this.configService.loadConfiguration().mergeMap(() => {
      this.AppSettings = this.configService.config;
      return this.http.post(this.AppSettings['API_ENDPOINT'] + url, data, options).map((res: Response) => res.json());
    });
  }
}
