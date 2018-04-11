import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserModule, By } from '@angular/platform-browser';
import { Component, DebugElement, ViewChild } from '@angular/core';
import { Location, CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute, Params } from '@angular/router';
import { Headers, BaseRequestOptions, Http, Response, HttpModule } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';
import { LocalStorageService } from 'ng2-webstorage';
import { AlertModule, ModalModule, DatepickerModule } from 'ngx-bootstrap';

import { LogsComponent } from './logs.component';

import { LogsService } from './shared/log.service';
import { LoginModel } from '../login/shared/login.model';
import { LoginService } from '../login/shared/login.service';
import { ConfigService } from '../shared/config.service'

let comp: LogsComponent;
let fixture: ComponentFixture<LogsComponent>;

let userLogin = new LoginModel();
userLogin.email = "administrator@secure.janeto.com";
userLogin.password = "janeto"
describe('LogsComponent', () => {
  beforeEach((done) => {
    TestBed.configureTestingModule({
      declarations: [
        LogsComponent
      ],
      imports: [
        HttpModule,
        BrowserModule,
        ModalModule.forRoot(),
        DatepickerModule.forRoot(),
        NgxMyDatePickerModule
      ],
      providers: [
        LocalStorageService,
        LogsService,
        ConfigService,
        LoginService
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(LogsComponent);
    comp = fixture.componentInstance;
    comp.ngOnInit();
    setTimeout(() => {
      done();
    }, 1000);
  });

  it('download list log success', async(() => {
    let loginService = TestBed.get(LoginService) as LoginService;
    let localStorageService = TestBed.get(LocalStorageService) as LocalStorageService;
    fixture.detectChanges();
    loginService.submit(userLogin).subscribe(
      (res) => {
        localStorageService.store("token", res["token"]);
        comp.getListFile();
        fixture.whenStable().then(() => {
          setTimeout(() => {
            expect(fixture.debugElement.queryAll(By.css(".content")).length).toEqual(comp.listLogs.length);
          }, 500)
        })
      }
    )
  }));

  it('download file log success', async(() => {
    let loginService = TestBed.get(LoginService) as LoginService;
    let localStorageService = TestBed.get(LocalStorageService) as LocalStorageService;
    fixture.detectChanges();
    loginService.submit(userLogin).subscribe(
      (res) => {
        localStorageService.store("token", res["token"]);
        let logService = TestBed.get(LogsService) as LogsService;

        logService.listLogs().subscribe(
          (res_1) => {
            fixture.debugElement.query(By.css('#' + res_1["logs"][0].startDateOfWeek)).nativeElement.click();
            fixture.whenStable().then(() => {
              setTimeout(() => {
                expect(comp.blobFile).toBeDefined();
                expect(comp.blobFile.size).toBeGreaterThan(0);
              }, 500)
            })
          }
        )
      }
    )
  }));
});
