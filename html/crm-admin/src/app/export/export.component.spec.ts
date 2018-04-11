import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { BrowserModule, By } from '@angular/platform-browser';
import { Component, DebugElement, ViewChild, NgModule } from '@angular/core';
import { Location, CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute, Params } from '@angular/router';
import { Headers, BaseRequestOptions, Http, Response, HttpModule } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AlertModule, ModalModule, DatepickerModule } from 'ngx-bootstrap';
import { LocalStorageService } from 'ng2-webstorage';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';
import { FormsModule, ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';

// This Module's Components
import { ExportComponent } from './export.component';
// This Service's Provider
import { ExportService } from './shared/export.service';
import { ConfigService } from '../shared/config.service'
import { LoginService } from '../login/shared/login.service';
import { ReservationService } from '../reservation/shared/reservation.service';
import { LoginModel } from '../login/shared/login.model';

let comp: ExportComponent;
let fixture: ComponentFixture<ExportComponent>;

let userLogin = new LoginModel();
userLogin.email = "administrator@secure.janeto.com";
userLogin.password = "janeto"

describe('ExportComponent', () => {
    let mockRouter = {
        navigate: jasmine.createSpy('navigate')
    };

    beforeEach((done) => {
        TestBed.configureTestingModule({
            declarations: [
                ExportComponent
            ],
            imports: [
                HttpModule,
                BrowserModule,
                ModalModule.forRoot(),
                DatepickerModule.forRoot(),
                NgxMyDatePickerModule,
                FormsModule
            ],
            providers: [
                LocalStorageService,
                ExportService,
                ConfigService,
                LoginService,
                ReservationService,
                { provide: Router, useValue: mockRouter }
            ]
        }).compileComponents();
        fixture = TestBed.createComponent(ExportComponent);
        comp = fixture.componentInstance;
        comp.ngOnInit();
        setTimeout(() => {
            done();
        }, 1000);
    });

    it('download domitory success', (done) => {
        let loginService = TestBed.get(LoginService) as LoginService;
        let reservationService = TestBed.get(ReservationService) as ReservationService;
        let localStorageService = TestBed.get(LocalStorageService) as LocalStorageService;
        loginService.submit(userLogin).subscribe(
            (res) => {
                localStorageService.store("token", res["token"]);
                reservationService.getDataForFilter().subscribe(
                    (resp) => {
                        comp.downloadFile();

                        setTimeout(() => {
                            expect(comp.blobFile).toBeDefined();
                            expect(comp.blobFile.size).toBeGreaterThan(0);
                            done();
                        }, 1000);
                    }
                )
            }
        )
    });
})
