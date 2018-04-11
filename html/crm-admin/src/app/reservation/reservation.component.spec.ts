import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { BrowserModule, By } from '@angular/platform-browser';
import { Component, DebugElement, ViewChild } from '@angular/core';
import { Location, CommonModule } from '@angular/common';
import { ReservationService } from './shared/reservation.service';
import { ReservationDateModel } from './shared/reservation.model';
import { LocalStorageService } from 'ng2-webstorage';
import { Router, RouterModule, ActivatedRoute, Params } from '@angular/router';
import { Headers, BaseRequestOptions, Http, Response, HttpModule } from '@angular/http';
import { ConfigService } from '../shared/config.service';
import { Observable } from 'rxjs/Observable';
import { ReservationComponent } from './reservation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertModule, ModalModule, DatepickerModule } from 'ngx-bootstrap';

let comp: ReservationComponent;
let fixture: ComponentFixture<ReservationComponent>;

let reservationId;
let lastUpdated;

let dateFrom = "2120-04-23";
let dateTo = "2120-04-30";

let dataReservationInput = {
    id: 0,
    bedId: 8,
    dateFrom: dateFrom,
    dateTo: dateTo,
    memo: 'Create reservation',
    nationalityId: 4,
    reservationStatusId: 1,
    warning: null,
    lastUpdated: null
}

let dataReservationInfo = {
    bed: 'A',
    bedId: 8,
    dormitoryRoomName: 'Coco2',
    gender: 1,
    roomType: 'single',
    reservationDate: null
}

let titlePopup = dataReservationInfo.dormitoryRoomName + ' ' + dataReservationInfo.bed 
let supTitlePopup = dataReservationInfo.roomType + ', ' + 'Male';

let errMess = ["Email or password is incorrect"];

describe('ReservationComponent', () => {
    let mockRouter = {
        navigate: jasmine.createSpy('navigate')
    };
    beforeEach((done) => {
        TestBed.configureTestingModule({
            declarations: [
                ReservationComponent
            ],
            imports: [
                HttpModule,
                BrowserModule,
                FormsModule,
                ReactiveFormsModule,
                ModalModule.forRoot(),
                DatepickerModule.forRoot(),
                AlertModule.forRoot()
            ],
            providers: [
                LocalStorageService,
                ReservationService,
                ConfigService,
                { provide: Router, useValue: mockRouter }
            ]
        }).compileComponents();
        fixture = TestBed.createComponent(ReservationComponent);
        comp = fixture.componentInstance;
        comp.ngOnInit();
        setTimeout(() => {
            done();
        }, 2000);
    });


    xit('Show popup when click empty', (done) => {
        comp.openModal(null, dateFrom, dateTo, dataReservationInfo);
        setTimeout(() => {
            expect(comp.titlePopup).toEqual(titlePopup);
            expect(comp.subTitlePopup).toEqual(supTitlePopup);
            done();
        }, 2000)
    });

    xit('Show popup when click reservation', (done) => {
        let objInput = dataReservationInfo;
        objInput.reservationDate = dataReservationInput;
        comp.openModal(objInput, dateFrom, dateTo, dataReservationInfo);
        setTimeout(() => {
            expect(comp.titlePopup).toEqual(titlePopup);
            expect(comp.subTitlePopup).toEqual(supTitlePopup);
            done();
        }, 2000)
    });

    it('Create reservation', (done) => {
        comp.applyReservation(dataReservationInput);
        setTimeout(() => {
            expect(comp.reservation.bedId).toEqual(dataReservationInput.bedId);
            expect(comp.reservation.memo).toEqual(dataReservationInput.memo);
            expect(comp.reservation.nationalityId).toEqual(dataReservationInput.nationalityId);
            expect(comp.reservation.reservationStatusId).toEqual(dataReservationInput.reservationStatusId);
            expect(comp.reservation.dateFrom).toContain(dataReservationInput.dateFrom);
            expect(comp.reservation.dateTo).toContain(dataReservationInput.dateTo);
            reservationId = comp.reservation.id;
            lastUpdated = comp.reservation.lastUpdated;
            done();
        }, 2000)
    });

    it('Update reservation', (done) => {
        dataReservationInput.id = reservationId;
        dataReservationInput.lastUpdated = lastUpdated
        dataReservationInput.memo = 'test updated';
        comp.applyReservation(dataReservationInput);
        setTimeout(() => {
            expect(comp.reservation.memo).toEqual(dataReservationInput.memo);
            done();
        }, 2000)
    });

    it('Delete reservation', (done) => {
        comp.deleteReservation(reservationId);
        setTimeout(() => {
            expect(comp.reservation.id).toBeUndefined();
            done();
        }, 1000)
    });
})

