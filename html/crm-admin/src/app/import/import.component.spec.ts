import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { BrowserModule, By } from '@angular/platform-browser';
import { Component, DebugElement, ViewChild } from '@angular/core';
import { Location, CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute, Params } from '@angular/router';
import { Headers, BaseRequestOptions, Http, Response, HttpModule } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AlertModule, ModalModule, DatepickerModule } from 'ngx-bootstrap';
import { LocalStorageService } from 'ng2-webstorage';
// This Module's Components
import { ImportComponent } from './import.component';
// This Service's Provider
import { ImportService } from './shared/import.service';
import { ConfigService } from '../shared/config.service'
import { LoginService } from '../login/shared/login.service';
import { LoginModel } from '../login/shared/login.model';

let comp: ImportComponent;
let fixture: ComponentFixture<ImportComponent>;

let userLogin = new LoginModel();
userLogin.email = "administrator@secure.janeto.com";
userLogin.password = "janeto"

describe('ImportComponent', () => {
    let mockRouter = {
        navigate: jasmine.createSpy('navigate')
    };

    beforeEach((done) => {
        TestBed.configureTestingModule({
            declarations: [
                ImportComponent
            ],
            imports: [
                HttpModule,
                BrowserModule,
                ModalModule.forRoot()
            ],
            providers: [
                LocalStorageService,
                ImportService,
                ConfigService,
                LoginService,
                { provide: Router, useValue: mockRouter }
            ]
        }).compileComponents();
        fixture = TestBed.createComponent(ImportComponent);
        comp = fixture.componentInstance;
        comp.ngOnInit();
        setTimeout(() => {
            done();
        }, 1000);
    });

    it('download template success', (done) => {
        let loginService = TestBed.get(LoginService) as LoginService;
        let localStorageService = TestBed.get(LocalStorageService) as LocalStorageService;

        loginService.submit(userLogin).subscribe(
            (res) => {
                localStorageService.store("token", res["token"]);
                
                comp.downloadTemplate();
                
                setTimeout(() => {
                    expect(comp.blobFile).toBeDefined();
                    expect(comp.blobFile.size).toBeGreaterThan(0);
                    done();
                }, 1000);
            }
        )
    });

    it('download bed_id list success', (done) => {
        let loginService = TestBed.get(LoginService) as LoginService;
        let localStorageService = TestBed.get(LocalStorageService) as LocalStorageService;

        loginService.submit(userLogin).subscribe(
            (res) => {
                localStorageService.store("token", res["token"]);
                
                comp.downloadBedIds();
                
                setTimeout(() => {
                    expect(comp.blobFile).toBeDefined();
                    expect(comp.blobFile.size).toBeGreaterThan(0);
                    done();
                }, 1000);
            }
        )
    });
})
