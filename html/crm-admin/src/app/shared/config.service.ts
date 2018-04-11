import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class ConfigService {
  private url = './assets/config.json'; //'crm-admin/assets/config.json'
  constructor(private http: Http) { }
  public config: Object;
  public flag: boolean = false;
  loadConfiguration() {
    let obs = new Observable(observer => {
      this.check(observer);
    });
    return obs;
  }
  check(observer) {
    if (this.config) {
      observer.next();
    } else {
      if (!this.flag) {
        this.flag = true;
        this.http.get(this.url).subscribe(res => {
          this.flag = false;
          this.config = res.json();
          observer.next();
        }, (err) => {
          setTimeout(function () {
            this.flag = false;
            this.check(observer);
          }, 500);
          console.log(err);
        });
      } else {
        setTimeout(() => {
          this.check(observer);
        }, 200);
      }
    }
  }
}
