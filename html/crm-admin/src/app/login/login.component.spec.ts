import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { BrowserModule, By } from '@angular/platform-browser';
import { Component, DebugElement } from '@angular/core';
import { Location, CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { LoginService } from './shared/login.service';
import { LoginModel } from './shared/login.model';
import { LocalStorageService } from 'ng2-webstorage';
import { Router, RouterModule, ActivatedRoute, Params } from '@angular/router';
import { Headers, BaseRequestOptions, Http, Response, HttpModule } from '@angular/http';
import { ConfigService } from '../shared/config.service';
import { Observable } from 'rxjs/Observable';
import { LoginComponent } from './login.component';

let comp: LoginComponent;
let fixture: ComponentFixture<LoginComponent>;

let dataTest = {
    'email': 'administrator@secure.janeto.com',
    'password': 'janeto'
}

let errMess = ["Email or password is incorrect"];

describe('LoginComponent', () => {
    let mockRouter = {
        navigate: jasmine.createSpy('navigate')
    };
    beforeEach((done) => {
        TestBed.configureTestingModule({
            declarations: [
                LoginComponent
            ],
            imports: [
                BrowserModule,
                FormsModule,
                ReactiveFormsModule,
                HttpModule
            ],
            providers: [
                LocalStorageService,
                LoginService,
                ConfigService,
                FormBuilder,
                { provide: Router, useValue: mockRouter }
            ]
        }).compileComponents();
        fixture = TestBed.createComponent(LoginComponent);
        comp = fixture.componentInstance;
        comp.ngOnInit();
        setTimeout(() => {
            done();
        }, 2000);
    });
    it('Login with a valid email address', (done) => {        
        comp.loginForm.controls['email'].setValue(dataTest.email);
        comp.loginForm.controls['password'].setValue(dataTest.password);
        comp.login();
        setTimeout(() => {
            expect(localStorage.getItem("token")).toBeDefined();
            // expect(mockRouter).toHaveBeenCalledWith(['/export']);
            done();
        }, 500)
    })
    it('Login with an invalid email address', (done) => {
        comp.loginForm.controls['email'].setValue("hongthom.com");
        comp.loginForm.controls['password'].setValue("janeto#123");
        comp.login();
        setTimeout(function () {
            expect(comp.errMess).toBeDefined();
            done();
        }, 500)
    })
    it('Login with the valid email address and an incorrect password', (done) => {
        comp.loginForm.controls['email'].setValue(dataTest.email);
        comp.loginForm.controls['password'].setValue("janeto#123");
        comp.login();
        setTimeout(function () {
            expect(comp.errMess).toBeDefined();
            done();
        }, 500)
    })
    it('Login with the invalid email address and an incorrect password', (done) => {
        comp.loginForm.controls['email'].setValue("hongthom@gmail.com");
        comp.loginForm.controls['password'].setValue("janeto#123");
        comp.login();
        setTimeout(function () {
            expect(comp.errMess).toBeDefined();
            done();
        }, 500)
    })
    it('Login with null email address', (done) => {
        comp.loginForm.controls['email'].setValue("");
        comp.loginForm.controls['password'].setValue("janeto#123");
        comp.login();
        setTimeout(function () {
            expect(comp.errMess).toBeDefined();
            done();
        }, 500)
    })
    it('Login with email address is null and password is null', (done) => {
        comp.loginForm.controls['email'].setValue("hongthom@gmail.com");
        comp.loginForm.controls['password'].setValue("");
        comp.login();
        setTimeout(function () {
            expect(comp.errMess).toBeDefined();
            done();
        }, 500)
    })
})

