import { Component, OnInit, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { CommonModule } from '@angular/common';
import {
  RoomsAndBedsModel, EventsModel, ListBedsModel,
  ReservationDateModel, StatusIconModel, FilterModel,
  AccommodationsModel, OtherReservationDateModel, ListAccommodationsModel
} from './shared/reservation.model';
import { ReservationService } from './shared/reservation.service';
import { ReservationConfig } from './shared/reservation.config';
import * as moment from 'moment';
import * as $ from 'jquery';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { IMyOptions, IMyDateModel } from 'ngx-mydatepicker';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { LocalStorageService } from 'ng2-webstorage';
// import { AppSettings } from '../app.setting';
import { ConfigService } from '../shared/config.service';

@Component({
  moduleId: module.id,
  selector: 'reservation',
  templateUrl: 'reservation.component.html',
  styleUrls: ['reservation.component.scss']
})
export class ReservationComponent implements OnInit {
  @ViewChild('autoShownModal') public autoShownModal: ModalDirective;
  public nationalSelected;
  public user: any = null;
  public isRegister: boolean = false;
  filterObj: FilterModel;
  saveDataLoadEvent: any;
  isOtherReservation = false;
  public stayPlanDefined = [{ id: 1, name: 'Dormitory' }, { id: 2, name: 'Others' }];
  public AppSettings;
  public activeFilter: any;
  public lastModified;
  public lastModifiedBy;
  public selectDateModel;
  public roomsAndBeds: Array<EventsModel>;
  public accommodations: Array<AccommodationsModel>;
  public thisMonth: Date = new Date();
  public months = new Array(
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  );
  public dates_in_month = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
  public days_in_week = new Array('Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat');
  public days = [];
  public groupWeeks = [];
  public groupMonths = [];
  public groupEvents = [];
  public tentativeIcon: StatusIconModel = {
    id: 2,
    src: 'assets/img/Tentative_s.svg'
  };
  public reservedIcon: StatusIconModel = {
    id: 3,
    src: 'assets/img/Reserved_s.svg'
  };
  public presentIcon: StatusIconModel = {
    id: 4,
    src: 'assets/img/Present_s.svg'
  };
  public startDate: Date;
  public config = {
    totalDays: ReservationConfig.totalDays
  };
  public selectDatePickerOptions: IMyOptions = {
    // other options...
    dateFormat: 'yyyy/mm/dd',
  };
  public isModalShown: boolean = true;
  public displayFilter = {
    dateFrom: '',
    dateTo: '',
    status: [],
    country: []
  };
  public firstDayOfMonth;
  public dateToDefaut;
  public dupplicateCheckOut: boolean = false;
  public dupplicateCheckIn: boolean = false;

  /////thao

  public checkIn: Date;
  public checkOut: Date;
  public statusFromDb: Array<any> = [];
  public flagFromDb: Array<any> = [];
  public genders: Array<any> = [];
  public errorString: string;
  public titlePopup: string;
  public subTitlePopup: string;
  ///Options for ng2-select
  public schoolOptions: Array<any> = [];
  public stayPlanOptions: Array<any> = [];
  public genderOptions: Array<any> = [];
  public roomTypeOptions: Array<any> = [];
  public statusOptions: Array<any> = [];
  public countryOptions: Array<any> = [];
  ////
  public hotelStatusList: Array<any> = [];
  public reservation;
  @ViewChild('lgModal') public lgModal: ModalDirective;
  @ViewChild('staticModal') public staticModal: ModalDirective;
  @ViewChild('warningModal') public warningModal: ModalDirective;
  @ViewChild('filterDateFrom') public filterDateFrom;
  @ViewChild('filterDateTo') public filterDateTo;
  public todayStyling = [{ date: new Date().setHours(0, 0, 0, 0), mode: 'day', clazz: 'custom-class' }];

  public isSelectNation: boolean = false;
  public currentIndexCheckIn: number;
  public currentIndexCheckOut: number;
  public checkInDatepickerId: string;
  public checkOutDatepickerId: string;
  public saveCurrentMonthCheckIn: number;
  public saveCurrentMonthCheckOut: number;
  public totalColumnCalendar: number = 41;
  public isShowMoreFilter: boolean = false;
  public cloneMoreFilter;
  public isWarningPopupShown = false;
  public isStaticPopupShown = false;

  public statusArr = [{
    id: 2,
    name: 'Tentative',
    className: 'tentative',
    active: true
  }, {
    id: 3,
    name: 'Reserved',
    className: 'reserved',
    active: false
  }, {
    id: 4,
    name: 'Present',
    className: 'present',
    active: false
  }, {
    id: 5,
    name: 'Closed',
    className: 'closed',
    active: false
  }, {
    id: 6,
    name: 'Maintenance',
    className: 'maintenance',
    active: false
  }];
  oldPopover;
  popoverComponent;
  popoverIsOpen = false;
  popNationalListComponent;

  constructor(private reservationService: ReservationService,
    private router: Router,
    private localStorage: LocalStorageService,
    private _routeParams: ActivatedRoute,
    private localStorageService: LocalStorageService,
    public configService: ConfigService
  ) { };

  ngOnInit() {
    this.showModal();
    if (this.configService.config) {
      this.AppSettings = this.configService.config;
    } else {
      this.configService.loadConfiguration().subscribe(() => {
        this.AppSettings = this.configService.config;
      });
    }
    this.filterObj = new FilterModel();
    this.saveDataLoadEvent = new FilterModel();
    let paramsFilter = this._routeParams.snapshot.params;
    this.user = this.localStorageService.retrieve('user');
    this.filterObj = {
      'buildingId': 1,
      'gender': -1,
      'roomTypeId': -1,
      'stayPlanId': 1
    } as FilterModel;
    if (!_.isEmpty(paramsFilter)) {
      let tempParams = _.clone(paramsFilter);
      if (tempParams.buildingId) {
        tempParams.buildingId = parseInt(tempParams.buildingId);
      }
      if (tempParams.gender) {
        tempParams.gender = parseInt(tempParams.gender);
      }
      if (tempParams.roomTypeId) {
        tempParams.roomTypeId = parseInt(tempParams.roomTypeId);
      }
      if (tempParams.stayPlanId) {
        tempParams.stayPlanId = parseInt(tempParams.stayPlanId);
      }
      if (tempParams.status) {
        tempParams.status = parseInt(tempParams.status);
      }
      if (tempParams.nationalityId) {
        tempParams.nationalityId = parseInt(tempParams.nationalityId);
      }
      this.filterObj = _.merge(this.filterObj, tempParams);
    }

    parseInt(paramsFilter.stayPlanId) === 2 ? this.isOtherReservation = true : this.isOtherReservation = false;
    this.firstDayOfMonth = new Date(this.thisMonth.getFullYear(), this.thisMonth.getMonth(), 1);
    this.dateToDefaut = new Date(this.thisMonth.getFullYear(), this.thisMonth.getMonth(), ReservationConfig.totalDays);
    let start = this.filterObj.arrival ? new Date(this.filterObj.arrival) : this.firstDayOfMonth;
    this.resetDateRange();
    this.initDataPopup();
    $('.bg-faded:first').css('align-items', 'center');
    this.selectDateModel = this.setNgxDatepickerModel(start);

    this.reservationService.getDataForFilter().subscribe(
      res => {
        this.statusFromDb = res.json().reservationStatuses;
        this.flagFromDb = res.json().nationalities;
        this.genders = res.json().genders;
        this.hotelStatusList = res.json().hotelStatuses;
        this.genderOptions = this.formatInputSelect2(this.genders, null);
        this.roomTypeOptions = this.formatInputSelect2(res.json().roomTypes, 'roomType');
        this.schoolOptions = this.formatInputSelect2(res.json().buildings, null);
        this.statusOptions = this.formatInputSelect2(this.statusFromDb, null);
        this.countryOptions = [{ id: -1, text: 'All' }];
        this.countryOptions = _.union(this.countryOptions, this.formatInputSelect2(this.flagFromDb, null));
        this.stayPlanOptions = this.formatInputSelect2(this.stayPlanDefined, null);
        let building;
        let stayPlan;
        let gender;
        let roomType;
        let status;
        let country;
        this.saveDataLoadEvent.dateFrom = this.setNgxDatepickerModel(this.firstDayOfMonth);
        this.saveDataLoadEvent.dateTo = this.setNgxDatepickerModel(this.dateToDefaut);
        this.displayFilter.dateFrom = moment(this.firstDayOfMonth).format('YYYY/MM/DD');
        this.displayFilter.dateTo = moment(this.dateToDefaut).format('YYYY/MM/DD');
        if (!_.isEmpty(paramsFilter)) {
          building = _.find(this.schoolOptions, (u) => {
            return parseInt(paramsFilter.buildingId) === u.id;
          });
          gender = _.find(this.genderOptions, (u) => {
            return parseInt(paramsFilter.gender) === u.id;
          });
          roomType = _.find(this.roomTypeOptions, (u) => {
            return parseInt(paramsFilter.roomTypeId) === u.id;
          });
          status = _.find(this.statusOptions, (u) => {
            return parseInt(paramsFilter.status) === u.id;
          });
          country = _.find(this.countryOptions, (u) => {
            return parseInt(paramsFilter.nationalityId) === u.id;
          });
          stayPlan = _.find(this.stayPlanOptions, (u) => {
            return parseInt(paramsFilter.stayPlanId) === u.id;
          });
          this.saveDataLoadEvent.dateFrom = paramsFilter.dateFrom ? this.setNgxDatepickerModel(new Date(paramsFilter.dateFrom)) : this.setNgxDatepickerModel(new Date());
          this.saveDataLoadEvent.dateTo = paramsFilter.dateTo ? this.setNgxDatepickerModel(new Date(paramsFilter.dateTo)) : this.setNgxDatepickerModel(new Date());
          this.displayFilter.dateFrom = paramsFilter.dateFrom ? moment(new Date(paramsFilter.dateFrom)).format('YYYY/MM/DD') : moment(new Date()).format('YYYY/MM/DD');
          this.displayFilter.dateTo = paramsFilter.dateTo ? moment(new Date(paramsFilter.dateTo)).format('YYYY/MM/DD') : moment(new Date()).format('YYYY/MM/DD');
          this.saveDataLoadEvent.stayPlanId = parseInt(paramsFilter.stayPlanId);
        }
        this.activeFilter = {
          building: building ? building : this.schoolOptions[0],
          stayPlan: stayPlan ? stayPlan : this.stayPlanOptions[0],
          gender: gender ? gender : this.genderOptions[0],
          roomType: roomType ? roomType : this.roomTypeOptions[0],
          status: status ? [status] : [this.statusOptions[0]],
          country: country ? [country] : [this.countryOptions[0]]
        };
        this.displayFilter.status = this.activeFilter.status;
        this.displayFilter.country = this.activeFilter.country;
        this.calendar(start, this.filterObj);
      }
    );

  };

  ngAfterViewInit() {
    $('body').click((e) => {
      if (e.target.className.indexOf('btn-other-reservation') === -1) {
        if (this.popoverIsOpen) {
          this.popoverComponent.hide();
        }
      }
      if (e.target.className.indexOf('national-flag') === -1 &&
        e.target.className.indexOf('flag-selected') === -1 &&
        e.target.className.indexOf('nation-text') === -1 &&
        e.target.className.indexOf('select-nation') === -1) {
        if (this.isSelectNation) {
          setTimeout(() => {
            if (this.isSelectNation && $('.national-flag-list').get(0)) {
              this.popNationalListComponent.hide();
              this.isSelectNation = !this.isSelectNation;
            }
          }, -1);
        }
      }
    });
  }

  /////////////////////////FUNCTION///////////////////////////////
  public selectNationality(e) {
    $('#input-popup').animate({
      scrollTop: $('#input-popup').get(0).scrollHeight
    }, 0);
    this.isSelectNation = !this.isSelectNation;
    if (this.isSelectNation) {
      this.popNationalListComponent = e;
      setTimeout(() => {
        if (this.isSelectNation && $('.national-flag-list').get(0)) {
          $($('.national-flag-list').get(0).parentElement.parentElement).addClass('national-flag-popover');
        }
      }, -1);
    }
  }

  private hidePopover(e, id) {
    this.popoverComponent = e;
    this.popoverIsOpen = true;
    if (!this.oldPopover) {
      $('#' + id).addClass('trigger');
      this.oldPopover = _.clone(e);
      e.show();
      setTimeout(() => {
        $($('.popover-content-other-reservation').get(0).parentElement.parentElement).addClass('other-reservation-popover');
      }, -1);
    } else {
      if (this.oldPopover.popover.elementRef.nativeElement.nextElementSibling.id === id) {
        if (e.popover.elementRef.nativeElement.nextElementSibling.className.indexOf('trigger') === -1) {
          $('#' + id).addClass('trigger');
          e.show();
          setTimeout(() => {
            $($('.popover-content-other-reservation').get(0).parentElement.parentElement).addClass('other-reservation-popover');
          }, -1);
        } else {
          e.hide();
          $('#' + id).removeClass('trigger');
        }
      } else if (e.popover.elementRef.nativeElement.nextElementSibling.className.indexOf('trigger') === -1) {
        this.oldPopover.hide();
        $('#' + this.oldPopover.popover.elementRef.nativeElement.nextElementSibling.id).removeClass('trigger');
        e.show();
        setTimeout(() => {
          $($('.popover-content-other-reservation').get(0).parentElement.parentElement).addClass('other-reservation-popover');
        }, -1);
        $('#' + id).addClass('trigger');
        this.oldPopover = _.clone(e);
      }
    }
  }
  public checkRole(userId, reservationId) {
    if (this.user && this.user.role && this.AppSettings) {
      if (this.user.role.name === this.AppSettings['Role']['Admin']) {
        return true;
      } else if (this.user.role.name === this.AppSettings['Role']['Register']) {
        if (userId === undefined && reservationId === undefined) {
          return true;
        } else {
          return this.user.id === userId ? true : false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  public setNgxDatepickerModel(time: Date) {
    let date = time.getDate();
    let month = time.getMonth() + 1;
    let year = time.getFullYear();
    let monthString;
    let dateString;
    if (month < 10) {
      monthString = '0' + month;
    } else {
      monthString = month;
    }
    if (date < 10) {
      dateString = '0' + date;
    } else {
      dateString = date;
    }
    return {
      date: {
        day: date,
        month: month,
        year: year
      },
      formatted: year + '/' + monthString + '/' + dateString
    };
  }

  public showResultFilter() {
    for (let i in this.saveDataLoadEvent) {
      if (i == 'dateFrom' || i === 'dateTo') {
        if (this.saveDataLoadEvent[i].jsdate) {
          this.saveDataLoadEvent[i] = this.saveDataLoadEvent[i] ? moment(this.saveDataLoadEvent[i].jsdate).format('YYYY-MM-DD') : delete this.saveDataLoadEvent[i];
        } else if (this.saveDataLoadEvent[i].date) {
          let cloneDate = _.clone(this.saveDataLoadEvent[i].date);
          let dateString = cloneDate.year + '-' + cloneDate.month + '-' + cloneDate.day;
          this.saveDataLoadEvent[i] = moment(new Date(dateString)).format('YYYY-MM-DD');
        } else if (this.saveDataLoadEvent[i] === '') {
          delete this.saveDataLoadEvent[i]
        }
      }
      if (i === 'gender') {
        this.saveDataLoadEvent[i] = this.saveDataLoadEvent[i] === 3 ? 'null' : this.saveDataLoadEvent[i];
      }
      if (i === 'stayPlanId') {
        if (parseInt(this.saveDataLoadEvent[i]) === 2) {
          this.isOtherReservation = true;
        } else {
          this.isOtherReservation = false;
        }
      }
    }
    this.filterObj = _.merge(this.filterObj, this.saveDataLoadEvent);
    if (this.filterObj.nationalityId == -1) {
      delete this.filterObj.nationalityId;
    }
    let cloneFilterObj = _.clone(this.filterObj);
    if (this.isOtherReservation) {
      delete cloneFilterObj.gender;
      delete cloneFilterObj.roomTypeId;
      delete cloneFilterObj.status;
      delete cloneFilterObj.dateFrom;
      delete cloneFilterObj.dateTo;
      delete cloneFilterObj.nationalityId;
    }
    this.router.navigate(['/reservation', cloneFilterObj]);
    this.showModal();
    this.calendar(this.startDate, this.filterObj);
  }

  public showModal(): void {
    this.isModalShown = true;
  }

  public hideModal(): void {
    this.autoShownModal.hide();
  }

  public onHidden(): void {
    this.isModalShown = false;
  }

  public onSelectDateChanged(event: IMyDateModel) {
    // event properties are: event.date, event.jsdate, event.formatted and event.epoc
    this.showModal();
    if (event.formatted) {
      this.calendar(new Date(event.formatted), this.filterObj);
    } else {
      this.calendar(new Date(this.thisMonth.getFullYear(), this.thisMonth.getMonth(), 1), this.filterObj);
    }
  }

  public today() {
    this.showModal();
    this.calendar(new Date(), this.filterObj);
    this.selectDateModel = this.setNgxDatepickerModel(new Date());
  }

  public nextWeek() {
    this.showModal();
    let nextDay = this.startDate.getDate() + 7;
    let nextWeek = this.calendar(new Date(this.startDate.getFullYear(), this.startDate.getMonth(), nextDay), this.filterObj);
    this.selectDateModel = this.setNgxDatepickerModel(new Date(this.startDate.getFullYear(), this.startDate.getMonth(), nextDay));
  }

  public previousWeek() {
    this.showModal();
    let preDay = this.startDate.getDate() - 7;
    this.calendar(new Date(this.startDate.getFullYear(), this.startDate.getMonth(), preDay), this.filterObj);
    this.selectDateModel = this.setNgxDatepickerModel(new Date(this.startDate.getFullYear(), this.startDate.getMonth(), preDay));
  }

  public nextMonth() {
    this.showModal();
    let nextMonth = this.startDate.getMonth() + 1;
    this.calendar(new Date(this.startDate.getFullYear(), nextMonth, this.startDate.getDate()), this.filterObj);
    this.selectDateModel = this.setNgxDatepickerModel(new Date(this.startDate.getFullYear(), nextMonth, this.startDate.getDate()));
  }

  public previousMonth() {
    this.showModal();
    let preMonth = this.startDate.getMonth() - 1;
    this.calendar(new Date(this.startDate.getFullYear(), preMonth, this.startDate.getDate()), this.filterObj);
    this.selectDateModel = this.setNgxDatepickerModel(new Date(this.startDate.getFullYear(), preMonth, this.startDate.getDate()));
  }

  public groupEvent(index, roomsAndBeds, days, callback) {
    let roomAndBed = roomsAndBeds[index];
    let colspan = 0;
    let group = [];
    for (let i = 0; i < days.length; i++) {
      let day = days[i];
      colspan++;
      let room = day.rooms[index];
      if (i !== days.length - 1) {
        if (room && !room.isEmpty && room.info &&
          roomAndBed.gender === room.info.gender &&
          roomAndBed.roomType === room.info.roomType &&
          roomAndBed.dormitoryRoomName === room.info.dormitoryRoomName &&
          roomAndBed.bed === room.info.bed) {
          if (room.isStart) {
            if (i > 0 && (colspan - 1) > 0) {
              const obj = days[i - 1].rooms[index];
              obj.colspan = colspan - 1;
              obj.date = days[i - 1].date;
              obj.month = days[i - 1].month;
              const _dateTo = moment(new Date(
                days[i - 1].year,
                days[i - 1].numMonth - 1,
                days[i - 1].date
              )).format('YYYY-MM-DD');
              const _dateFrom = moment(new Date(
                days[i - 1].year,
                days[i - 1].numMonth - 1,
                days[i - 1].date - (colspan - 2)
              )).format('YYYY-MM-DD');
              obj.dateFrom = _dateFrom;
              obj.dateTo = _dateTo;
              obj.reservationInfo = {
                bed: roomAndBed.bed,
                bedId: roomAndBed.bedId,
                dormitoryRoomName: roomAndBed.dormitoryRoomName,
                gender: roomAndBed.gender,
                roomType: roomAndBed.roomType
              };
              group.push(obj);
              colspan = 1;
            }
            if (room.isEnd) {
              let obj: any;
              obj = room;
              if (room.isDupplicate) {
                obj.info.reservationDate = days[i + 1].rooms[index].info.reservationDate;
              }
              // obj = room;
              obj.colspan = colspan;
              obj.date = day.date;
              obj.month = day.month;
              obj.reservationInfo = {
                bed: roomAndBed.bed,
                bedId: roomAndBed.bedId,
                dormitoryRoomName: roomAndBed.dormitoryRoomName,
                gender: roomAndBed.gender,
                roomType: roomAndBed.roomType
              };
              group.push(obj);
              colspan = 0;
            }
          } else if (room.isEnd) {
            let obj = room;
            obj.colspan = colspan;
            obj.date = day.date;
            obj.month = day.month;
            obj.reservationInfo = {
              bed: roomAndBed.bed,
              bedId: roomAndBed.bedId,
              dormitoryRoomName: roomAndBed.dormitoryRoomName,
              gender: roomAndBed.gender,
              roomType: roomAndBed.roomType
            };
            group.push(obj);
            colspan = 0;
          }
        } else {
          if (day.day === 'Sat') {
            let _dateTo = moment(new Date(
              day.year,
              day.numMonth - 1,
              day.date
            )).format('YYYY-MM-DD');
            let _dateFrom = moment(new Date(
              day.year,
              day.numMonth - 1,
              day.date - (colspan - 1)
            )).format('YYYY-MM-DD');
            let obj = {
              isEmpty: true,
              colspan: colspan,
              dateTo: _dateTo,
              month: day.month,
              dateFrom: _dateFrom,
              reservationInfo: {
                bed: roomAndBed.bed,
                bedId: roomAndBed.bedId,
                dormitoryRoomName: roomAndBed.dormitoryRoomName,
                gender: roomAndBed.gender,
                roomType: roomAndBed.roomType
              }
            };
            group.push(obj);
            colspan = 0;
          }
        }
      } else if (i === days.length - 1) {
        if (room && !room.isEmpty && room.info &&
          roomAndBed.gender === room.info.gender &&
          roomAndBed.roomType === room.info.roomType &&
          roomAndBed.dormitoryRoomName === room.info.dormitoryRoomName &&
          roomAndBed.bed === room.info.bed) {
          if (room.isStart) {
            if (i > 0 && (colspan - 1) > 0) {
              let _dateTo = moment(new Date(
                days[i - 1].year,
                days[i - 1].numMonth - 1,
                days[i - 1].date
              )).format('YYYY-MM-DD');
              let _dateFrom = moment(new Date(
                days[i - 1].year,
                days[i - 1].numMonth - 1,
                days[i - 1].date - (colspan - 2)
              )).format('YYYY-MM-DD');
              let obj = days[i - 1].rooms[index];
              obj.colspan = colspan - 1;
              obj.date = days[i - 1].date;
              obj.month = days[i - 1].month;
              obj.reservationInfo = {
                bed: roomAndBed.bed,
                bedId: roomAndBed.bedId,
                dormitoryRoomName: roomAndBed.dormitoryRoomName,
                gender: roomAndBed.gender,
                roomType: roomAndBed.roomType
              };
              obj.dateTo = _dateTo;
              obj.dateFrom = _dateFrom;
              group.push(obj);
              colspan = 1;
              obj = room;
              obj.colspan = colspan;
              obj.date = day.date;
              obj.month = day.month;
              obj.reservationInfo = {
                bed: roomAndBed.bed,
                bedId: roomAndBed.bedId,
                dormitoryRoomName: roomAndBed.dormitoryRoomName,
                gender: roomAndBed.gender,
                roomType: roomAndBed.roomType
              };
              group.push(obj);
            } else if (i > 0 && colspan === 1) {
              let obj = room;
              obj.colspan = colspan;
              obj.date = day.date;
              obj.month = day.month;
              obj.reservationInfo = {
                bed: roomAndBed.bed,
                bedId: roomAndBed.bedId,
                dormitoryRoomName: roomAndBed.dormitoryRoomName,
                gender: roomAndBed.gender,
                roomType: roomAndBed.roomType
              };
              group.push(obj);
            }
          } else {
            let obj = room;
            obj.colspan = colspan;
            obj.date = day.date;
            obj.month = day.month;
            obj.reservationInfo = {
              bed: roomAndBed.bed,
              bedId: roomAndBed.bedId,
              dormitoryRoomName: roomAndBed.dormitoryRoomName,
              gender: roomAndBed.gender,
              roomType: roomAndBed.roomType
            };
            group.push(obj);
            colspan = 0;
          }
        } else {
          let _dateTo = moment(new Date(
            day.year,
            day.numMonth - 1,
            day.date
          )).format('YYYY-MM-DD');
          let _dateFrom = moment(new Date(
            day.year,
            day.numMonth - 1,
            day.date - (colspan - 1)
          )).format('YYYY-MM-DD');
          let obj = {
            isEmpty: true,
            colspan: colspan,
            dateTo: _dateTo,
            month: day.month,
            dateFrom: _dateFrom,
            reservationInfo: {
              bed: roomAndBed.bed,
              bedId: roomAndBed.bedId,
              dormitoryRoomName: roomAndBed.dormitoryRoomName,
              gender: roomAndBed.gender,
              roomType: roomAndBed.roomType
            }
          };
          group.push(obj);
          colspan = 0;
        }

      }
    }
    roomAndBed['events'] = group;
    index++;
    if (index < roomsAndBeds.length) {
      this.groupEvent(index, roomsAndBeds, days, callback);
    } else {
      callback(roomsAndBeds);
    }
  }

  public groupWeek(isWeek, days) {
    let group = [];
    let colspan = 0;
    let dateFrom;
    days.forEach((day, index) => {
      if (colspan === 0) {
        dateFrom = {
          date: day.date,
          month: day.numMonth,
          year: day.year
        };
      }
      colspan++;
      if (isWeek && day.day === 'Sat' ||
        !isWeek && day.date === this.dates_in_month[day.numMonth - 1] ||
        index === (days.length - 1)) {
        let obj = {
          colspan: colspan,
          month: !isWeek ? day.month : '',
          dateFrom: dateFrom,
          dateTo: {
            date: day.date,
            month: day.numMonth,
            year: day.year
          }
        };
        isWeek ? delete obj.month : '';
        group.push(obj);
        colspan = 0;
      }
    });
    return group;
  }

  /////////////////DO NOT DETELE THIS FUNCTION///////////////
  // public groupRowRoomType(index, roomsAndBeds, callback) {
  //     if (index < roomsAndBeds.length) {
  //         let roomAndBed = roomsAndBeds[index];
  //         if (index > 0 && roomAndBed.gender === roomsAndBeds[index - 1].gender && roomAndBed.roomType === roomsAndBeds[index - 1].roomType && roomAndBed.dormitoryRoomName === roomsAndBeds[index - 1].dormitoryRoomName) {
  //             roomAndBed.rowspan = 0;
  //         } else {
  //             let rowspan = _.filter(roomsAndBeds, (_roomAndBed: any) => {
  //                 return roomAndBed.gender === _roomAndBed.gender && roomAndBed.roomType === _roomAndBed.roomType && roomAndBed.dormitoryRoomName === _roomAndBed.dormitoryRoomName;
  //             });
  //             roomAndBed.rowspan = rowspan.length;
  //         }
  //         index++;
  //     }
  //     if (index === roomsAndBeds.length) {
  //         callback(roomsAndBeds);
  //     } else {
  //         this.groupRowRoomType(index, roomsAndBeds, callback);
  //     }
  // }
  ///////////////////////////////////////////////////////////////


  public loadEvents(dateStart: Date, filterObj, callback) {
    let arrival = moment(new Date(dateStart)).format('YYYY-MM-DD');
    if (!this.isOtherReservation) {
      filterObj.arrival = arrival;
      this.reservationService.getListBeds(filterObj).subscribe((res) => {
        if (res) {
          let obj: ListBedsModel = res.json();
          this.lastModified = obj.lastUpdated.replace(' ', 'T');
          this.lastModifiedBy = obj.lastUpdatedBy;
          let events: Array<EventsModel> = _.clone(obj.beds);
          this.roomsAndBeds = _.clone(obj.beds);

          _.forEach(events, (event) => {
            _.forEach(event.reservationDate, (_date) => {
              _date['_dateFrom'] = this.convertDateTimeStringToObject(_date.dateFrom);
              _date['_dateTo'] = this.convertDateTimeStringToObject(_date.dateTo);
            });
          });
          callback(events);
        }
      }, (err) => {
        this.parseErrorToString(err[0]);
        if (err[0] === 'token_expired') {
          this.localStorage.clear('token');
          this.router.navigate(['/login']);
        } else {
          this.router.navigate(['/reservation']);
        }
        this.hideModal();
      });
    } else {
      filterObj.arrival = arrival;
      this.reservationService.getListAccommodations({
        arrival: filterObj.arrival,
        buildingId: filterObj.buildingId
      }).subscribe((res) => {
        if (res) {
          let obj: ListAccommodationsModel = res.json();
          this.lastModified = obj.lastUpdated;
          this.lastModifiedBy = obj.lastUpdatedBy;
          let accommodations: Array<AccommodationsModel> = _.clone(obj.accommodations);
          this.accommodations = _.clone(obj.accommodations);
          _.forEach(accommodations, (accommodation) => {
            _.forEach(accommodation.otherReservationDate, (_date) => {
              _date['_dateFrom'] = this.convertDateTimeStringToObject(_date.dateFrom);
              _date['_dateTo'] = this.convertDateTimeStringToObject(_date.dateTo);
            });
          });
          callback(accommodations);
        }
      }, (err) => {
        this.parseErrorToString(err[0]);
        if (err[0] === 'token_expired') {
          this.localStorage.clear('token');
          this.router.navigate(['/login']);
        } else {
          this.router.navigate(['/reservation']);
        }
        this.hideModal();
      });
    }
  }

  public convertDateTimeStringToObject(time: String) {
    let _time = time.split(' ')[0].split('-');
    let year = parseInt(_time[0]);
    let month = parseInt(_time[1]);
    let date = parseInt(_time[2]);
    let obj;
    if (month <= 12 && date <= 31) {
      obj = {
        date: date,
        month: month,
        year: year
      };
    } else {
      obj = 'Wrong type!';
    }
    return obj;
  }

  public forReservationDate(index, room, obj, callback) {
    if (room && room.reservationDate.length > 0) {
      let flag = false;
      let _date = room.reservationDate[index];
      let _event: Object = {
        isEmpty: true,
        reservationInfo: {
          bed: room.bed,
          bedId: room.bedId,
          dormitoryRoomName: room.dormitoryRoomName,
          gender: room.gender,
          roomType: room.roomType
        }
      };
      let timePresent = new Date(obj.year, obj.numMonth - 1, obj.date).getTime();
      let timeFrom = new Date(_date.dateFrom).getTime();
      let timeTo = new Date(_date.dateTo).getTime();
      let isDupplicate = _.find(room.reservationDate, (o: any) => {
        let timeFromNextEvent = new Date(o.dateFrom).getTime();
        let timeToNextEvent = new Date(o.dateTo).getTime();
        return (timePresent === timeFromNextEvent && timePresent === timeTo && timeTo !== timeToNextEvent) ||
          (timePresent === timeFrom && timePresent === timeToNextEvent && timePresent !== timeTo);
      });
      let timeToday = new Date().getTime();
      if (isDupplicate) {
        _event = {
          isStart: true,
          isEnd: true,
          isEmpty: false,
          isDupplicate: true,
          info: {
            bed: room.bed,
            bedId: room.bedId,
            dormitoryRoomName: room.dormitoryRoomName,
            gender: room.gender,
            reservationDate: _date,
            roomType: room.roomType
          }
        };
        flag = true;
      } else if (timePresent === timeFrom && timePresent === timeTo) {
        _event = {
          isStart: true,
          isEnd: true,
          isEmpty: false,
          info: {
            bed: room.bed,
            bedId: room.bedId,
            dormitoryRoomName: room.dormitoryRoomName,
            gender: room.gender,
            reservationDate: _date,
            roomType: room.roomType
          }
        };
        flag = true;
      } else if (timePresent === timeFrom) {
        _event = {
          isStart: true,
          isEnd: false,
          isEmpty: false,
          info: {
            bed: room.bed,
            bedId: room.bedId,
            dormitoryRoomName: room.dormitoryRoomName,
            gender: room.gender,
            reservationDate: _date,
            roomType: room.roomType
          }
        };
        flag = true;
      } else if (timePresent === timeTo) {
        _event = {
          isStart: false,
          isEnd: true,
          isEmpty: false,
          info: {
            bed: room.bed,
            bedId: room.bedId,
            dormitoryRoomName: room.dormitoryRoomName,
            gender: room.gender,
            reservationDate: _date,
            roomType: room.roomType
          }
        };
        flag = true;
      } else if (timePresent < timeTo && timePresent > timeFrom) {
        _event = {
          isStart: false,
          isEnd: false,
          isEmpty: false,
          info: {
            bed: room.bed,
            bedId: room.bedId,
            dormitoryRoomName: room.dormitoryRoomName,
            gender: room.gender,
            reservationDate: _date,
            roomType: room.roomType
          }
        };
        flag = true;
      }
      if (timeFrom <= timeToday) {
        _event['isBeforeToday'] = true;
      }
      if (flag) {
        callback(_event);
      } else {
        index++;
        if (index === room.reservationDate.length) {
          callback(_event);
        } else {
          this.forReservationDate(index, room, obj, callback);
        }
      }
    } else {
      callback({
        isEmpty: true
      });
    }
  }

  private rooms = [];
  public forRoomsAndBeds(index, roomsAndBeds, obj, callback) {
    if (roomsAndBeds.length > 0) {
      let roomAndBed = roomsAndBeds[index];
      this.forReservationDate(0, roomAndBed, obj, (res) => {
        this.rooms.push(res);
        index++;
        if (index === roomsAndBeds.length) {
          obj.rooms = this.rooms;
          this.rooms = [];
          callback(obj);
        } else {
          this.forRoomsAndBeds(index, roomsAndBeds, obj, callback);
        }
      });
    } else {
      callback(obj);
    }
  }

  public calendar(start: Date, filterObj) {
    this.loadEvents(start, filterObj, (events) => {
      this.days = [];
      let _date = new Date();
      let date = _date.getDate();

      this.startDate = start;
      let dateStart = start.getDate();
      let dayStart = start.getDay();
      let yearStart = start.getFullYear();
      let monthStart = start.getMonth();

      this.firstDayOfMonth = start;
      this.dateToDefaut = new Date(yearStart, monthStart, ReservationConfig.totalDays + dateStart - 1);

      if (yearStart <= 200) {
        yearStart += 1900;
      }
      if (yearStart % 4 === 0 && yearStart !== 1900) {
        this.dates_in_month[1] = 29;
      } else {
        this.dates_in_month[1] = 28;
      }
      let totalDaysInMonth = this.dates_in_month[monthStart];
      let totalDaysInNextMonth;
      let nextMonth;
      if (monthStart + 1 === 12) {
        nextMonth = 0;
        totalDaysInNextMonth = this.dates_in_month[nextMonth];
      } else {
        nextMonth = monthStart + 1;
        totalDaysInNextMonth = this.dates_in_month[nextMonth];
      }
      let total = this.config.totalDays + (dateStart - 1);
      let isToday = false;
      let firstDay = 1;
      for (let i = dateStart; i <= total; i++) {
        if (date === i) {
          isToday = true;
        } else {
          isToday = false;
        }

        let day_in_week = this.days_in_week[dayStart];
        dayStart++;
        if (dayStart === 7) {
          dayStart = 0;
        }
        let obj: any = {
          date: i,
          day: day_in_week,
          month: this.months[monthStart],
          numMonth: monthStart + 1,
          year: yearStart,
          isToday: isToday,
          rooms: [],
          otherReservation: []
        };
        if (i > totalDaysInMonth) {
          obj.date = firstDay;
          firstDay++;
          if (monthStart + 1 === 12) {
            obj.year = yearStart + 1;
          }
          obj.month = this.months[nextMonth];
          obj.numMonth = nextMonth + 1;
          if (firstDay > totalDaysInNextMonth) {
            firstDay = 1;
            nextMonth++;
          }
        }
        if (!this.isOtherReservation) {
          delete obj.otherReservation;
          this.forRoomsAndBeds(0, events, obj, (res) => {
            this.days.push(res);
          });
        } else {
          delete obj.rooms;
          let otherReservation = [];
          _.forEach(events, (accommodation) => {
            _.forEach(accommodation.otherReservationDate, (otherReservationDate) => {
              let timePresent = new Date(yearStart, monthStart, i).getTime();
              let timeFrom = new Date(otherReservationDate.dateFrom).getTime();
              let timeTo = new Date(otherReservationDate.dateTo).getTime();
              if (timePresent >= timeFrom && timePresent <= timeTo) {
                otherReservation.push(otherReservationDate);
              }
            });
          });
          obj.otherReservation = otherReservation;
          this.days.push(obj);
        }
      }
      this.groupWeeks = this.groupWeek(true, this.days);
      this.groupMonths = this.groupWeek(false, this.days);
      if (!this.isOtherReservation) {
        if (this.roomsAndBeds.length > 0) {
          this.groupEvent(0, this.roomsAndBeds, this.days, (group) => {
            this.roomsAndBeds = group;
            this.roomsAndBeds.forEach(roomAndBed => {
              roomAndBed.dormitoryRoomName.length > 10 ? roomAndBed.dormitoryRoomName = roomAndBed.dormitoryRoomName.substring(0, 10) + '...' : '';
            });
            this.calculateOpenDay(0, this.groupWeeks, this.roomsAndBeds, (groupWeeks) => {
              this.groupWeeks = groupWeeks;
            });
          });
        }
      } else {
        this.forAccommodations(0, this.accommodations, this.days, this.groupWeeks, (accommodation) => {
          this.accommodations = accommodation;
        });
      }
      this.hideModal();
      setTimeout(function () {
        $('.linked-scrollbar-fixed').attr('data-scrolling', 'false');

        $('.linked-scrollbar-fixed').scroll(function () {
          if ($(this).attr('data-scrolling') === 'false') {
            $('.linked-scrollbar-fixed').not(this).attr('data-scrolling', 'true');
            $('.linked-scrollbar-fixed').not(this).scrollLeft($(this).scrollLeft());
          }
          $(this).attr('data-scrolling', 'false');
        });
      });
    });
  }

  public calculateOpenDay(i, groupWeeks, roomsAndBeds, callback) {
    let groupWeek = groupWeeks[i];
    let timeWeekFrom = new Date(groupWeek.dateFrom.year, groupWeek.dateFrom.month - 1, groupWeek.dateFrom.date).getTime();
    let timeWeekTo = new Date(groupWeek.dateTo.year, groupWeek.dateTo.month - 1, groupWeek.dateTo.date).getTime();
    let open = 0;
    let haveEvent = false;
    for (let j = 0; j < roomsAndBeds.length; j++) {
      let roomAndBed = roomsAndBeds[j];
      if (roomAndBed.reservationDate.length > 0) {
        for (let k = 0; k < roomAndBed.reservationDate.length; k++) {
          let reservationDate = roomAndBed.reservationDate[k];
          let timeEventFrom = new Date(reservationDate.dateFrom).getTime();
          let timeEventTo = new Date(reservationDate.dateTo).getTime();
          if (timeWeekFrom <= timeEventFrom && timeEventTo <= timeWeekTo ||
            timeEventFrom <= timeWeekFrom && timeEventTo <= timeWeekTo && timeWeekFrom <= timeEventTo ||
            timeWeekFrom <= timeEventFrom && timeWeekTo <= timeEventTo && timeEventFrom <= timeWeekTo ||
            timeEventFrom <= timeWeekFrom && timeWeekTo <= timeEventTo) {
            haveEvent = true;
            break;
          } else {
            haveEvent = false;
          }
        }
      } else {
        haveEvent = false;
      }
      if (!haveEvent) {
        open++;
      }
    }
    groupWeek.open = open;
    i++;
    if (i === groupWeeks.length) {
      callback(groupWeeks);
    } else {
      this.calculateOpenDay(i, groupWeeks, roomsAndBeds, callback);
    }
  }

  public forGroupWeeks(index, groupWeeks, day, callback) {
    let groupWeek = groupWeeks[index];
    let timeWeekFrom = new Date(groupWeek.dateFrom.year, groupWeek.dateFrom.month - 1, groupWeek.dateFrom.date);
    let timeWeekTo = new Date(groupWeek.dateTo.year, groupWeek.dateTo.month - 1, groupWeek.dateTo.date);
    let timePresent = new Date(day.year, day.numMonth - 1, day.date).getTime();
    if (timeWeekFrom.getTime() <= timePresent && timeWeekTo.getTime() >= timePresent) {
      let week = {
        from: moment(new Date(timeWeekFrom)).format('YYYY-MM-DD'),
        to: moment(new Date(timeWeekTo)).format('YYYY-MM-DD')
      };
      callback(week);
      return;
    }
    index++;
    if (index === groupWeeks.length) {
      callback();
    } else {
      this.forGroupWeeks(index, groupWeeks, day, callback);
    }
  }

  public forAccommodations(index, accommodations, days, groupWeeks, callback) {
    let accommodation = accommodations[index];
    let accommodationDays = [];
    let obj;
    _.forEach(days, (day: any) => {
      obj = _.clone(day);
      delete obj.otherReservation;
      this.forGroupWeeks(0, this.groupWeeks, day, (_day) => {
        if (_day) {
          obj.week = _day;
        }
        obj.otherReservations = _.filter(day.otherReservation, (otherReservation: any) => {
          return otherReservation.accommodationId === accommodation.accommodationId;
        });
        accommodationDays.push(obj);
      });
    });
    accommodation.days = accommodationDays;
    index++;
    if (index === accommodations.length) {
      callback(accommodations);
    } else {
      this.forAccommodations(index, accommodations, days, groupWeeks, callback);
    }
  }

  public loadStatus(stt, type) {
    let statusArray = [];
    if (type === 1) {
      statusArray = this.statusFromDb;
    } else {
      statusArray = this.hotelStatusList;
    }
    return _.find(statusArray, (status) => {
      return status.id === stt;
    })
  }



  //thao

  public initDataPopup() {
    if (!this.isOtherReservation) {
      this.reservation = new ReservationDateModel();
    } else {
      this.reservation = new OtherReservationDateModel();
      this.reservation.hotelStatusId = 1;
    }

    this.reservation.reservationStatusId = 2;
  }

  public onPopupHidden(): void {
    this.isSelectNation = false;
  }

  public parseTitlePopup(objTitle) {
    if (!this.isOtherReservation) {
      let idx = this.genders.map(function (e) {
        return e.id
      }).indexOf(objTitle.gender);
      let buildingObj = _.find(this.schoolOptions, (u) => {
        return u.id === this.filterObj.buildingId;
      });
      this.titlePopup = objTitle.dormitoryRoomName + ' ' + objTitle.bed;
      this.subTitlePopup = objTitle.roomType + ', ' + this.genders[idx].name + ', ' + buildingObj.text;
    } else {
      let buildingObj = _.find(this.schoolOptions, (u) => {
        return u.id === this.filterObj.buildingId;
      });
      this.titlePopup = objTitle.name;
      this.subTitlePopup = ', ' + buildingObj !== undefined ? buildingObj.text : '';
    }
  }

  public formatInputSelect2(input, type): any {
    let output = [];
    if (type === 'roomType') {
      for (let key in input) {
        output.push({
          id: input[key].id,
          text: input[key].type
        });
      }
    } else {
      for (let key in input) {
        output.push({
          id: input[key].id !== null ? input[key].id : 3,
          text: input[key].name
        });
      }
    }

    return output;
  }

  public showMoreFilter() {
    this.isShowMoreFilter = true;
    this.cloneMoreFilter = _.clone(this.saveDataLoadEvent);
  }

  public applyMoreFilter() {
    this.isShowMoreFilter = false;
    if (!this.saveDataLoadEvent.status) {
      this.saveDataLoadEvent.status = -1;
    }
    if (!this.saveDataLoadEvent.nationalityId) {
      this.saveDataLoadEvent.nationalityId = -1;
    }
    this.displayFilter.dateFrom = this.saveDataLoadEvent.dateFrom.formatted ? this.saveDataLoadEvent.dateFrom.formatted : this.displayFilter.dateFrom;
    this.displayFilter.dateTo = this.saveDataLoadEvent.dateTo.formatted ? this.saveDataLoadEvent.dateTo.formatted : this.displayFilter.dateTo;
    this.displayFilter.country = [(_.find(this.countryOptions, (u) => {
      return this.saveDataLoadEvent.nationalityId === u.id;
    }))];
    this.displayFilter.status = [(_.find(this.statusOptions, (u) => {
      return this.saveDataLoadEvent.status === u.id;
    }))];
  }

  public resetFilter() {
    this.saveDataLoadEvent.dateFrom = this.setNgxDatepickerModel(this.firstDayOfMonth);
    this.saveDataLoadEvent.dateTo = this.setNgxDatepickerModel(this.dateToDefaut);
    this.activeFilter.status = [this.statusOptions[0]];
    this.activeFilter.country = [this.countryOptions[0]];
    this.saveDataLoadEvent.status = this.statusOptions[0].id;
    this.saveDataLoadEvent.nationalityId = this.countryOptions[0].id;
  }

  public cancelMoreFilter() {
    let status;
    let country;
    this.isShowMoreFilter = false;
    this.saveDataLoadEvent.dateFrom = this.cloneMoreFilter.dateFrom.date ? this.cloneMoreFilter.dateFrom : this.setNgxDatepickerModel(new Date(this.cloneMoreFilter.dateFrom));
    this.saveDataLoadEvent.dateTo = this.cloneMoreFilter.dateTo.date ? this.cloneMoreFilter.dateTo : this.setNgxDatepickerModel(new Date(this.cloneMoreFilter.dateTo));
    this.cloneMoreFilter.status ? this.saveDataLoadEvent.status = this.cloneMoreFilter.status : delete this.saveDataLoadEvent.status;
    this.cloneMoreFilter.nationalityId ? this.saveDataLoadEvent.nationalityId = this.cloneMoreFilter.nationalityId : delete this.saveDataLoadEvent.nationalityId;
    status = _.find(this.statusOptions, (u) => {
      return this.saveDataLoadEvent.status === u.id;
    });
    country = _.find(this.countryOptions, (u) => {
      return this.saveDataLoadEvent.nationalityId === u.id;
    });
    this.activeFilter.status = status ? [status] : [this.statusOptions[0]];
    this.activeFilter.country = country ? [country] : [this.countryOptions[0]];
  }



  public checkDateDuplicateOrNot(id, date, bedId, type) {
    let obj = {
      reservationId: id,
      date: moment(date).format('YYYY-MM-DD'),
      bedId: bedId,
      type: type
    };

    this.reservationService.checkDateDuplicateOrNot(obj).subscribe(
      res => {
        if (res.json().result) {
          if (obj.type === 1) {
            this.dupplicateCheckOut = true;
          } else {
            this.dupplicateCheckIn = true;
          }
        }
      });
  }

  public openModal(obj, dateFrom, dateTo, reservationInfo) {
    this.saveCurrentMonthCheckOut = undefined;
    this.saveCurrentMonthCheckIn = undefined;
    if (!this.isOtherReservation) {
      this.lgModal.show();
      this.initDomitory(obj, dateFrom, dateTo, reservationInfo);
    } else {
      this.lgModal.show();
      this.initOtherReservation(obj, dateFrom, dateTo, reservationInfo);
    }
  }

  public initDomitory(obj, dateFrom, dateTo, reservationInfo) {
    if (obj && obj.reservationDate && obj.reservationDate.id) {
      this.showModal();
      this.parseTitlePopup(obj);
      this.reservation = new ReservationDateModel();
      this.reservationService.getReservation(obj.reservationDate.id).subscribe(
        res => {
            let cloneObj = _.clone(res.json());
            this.reservation = cloneObj as ReservationDateModel;
            this.checkIn = moment(this.reservation.dateFrom, 'YYYY-MM-DD').toDate();
            this.checkOut = moment(this.reservation.dateTo, 'YYYY-MM-DD').toDate();


            if (this.reservation.reservationStatusId === 1) {
              this.fillColorStatus(0);
            } else {
              let indexMapId = this.statusFromDb.map(function (e) {
                return e.id;
              }).indexOf(this.reservation.reservationStatusId);

              let indexMapName = this.statusArr.map(function (e) {
                return e.name;
              }).indexOf(this.statusFromDb[indexMapId].name);

              this.fillColorStatus(indexMapName);
            }

            let indexFlagMapId = this.flagFromDb.map(function (e) {
              return e.id;
            }).indexOf(this.reservation.nationalityId);
            this.nationalSelected = this.flagFromDb[indexFlagMapId];
            this.hideModal();
          },
          err => {
            this.parseErrorToString(err[0]);
          }
      )
    } else {
      this.initDataPopup();
      this.fillColorStatus(0);
      this.nationalSelected = null;
      this.parseTitlePopup(reservationInfo);
      this.checkIn = moment(dateFrom, 'YYYY-MM-DD').toDate();
      this.checkOut = moment(dateTo, 'YYYY-MM-DD').toDate();
      this.reservation.bedId = reservationInfo.bedId;
    }
  }

  public initOtherReservation(obj, dateFrom, dateTo, reservationInfo) {
    if (obj && obj.otherReservationDate && obj.otherReservationDate.id) {
      this.parseTitlePopup(obj);
      this.reservation = new OtherReservationDateModel();
      let cloneObj = _.clone(obj.otherReservationDate);
      this.reservation = cloneObj as OtherReservationDateModel;
      this.checkIn = moment(this.reservation.dateFrom, 'YYYY-MM-DD').toDate();
      this.checkOut = moment(this.reservation.dateTo, 'YYYY-MM-DD').toDate();
      if (this.reservation.reservationStatusId === 1) {
        this.fillColorStatus(0);
      } else {
        let indexMapId = this.statusFromDb.map(function (e) {
          return e.id;
        }).indexOf(this.reservation.reservationStatusId);

        let indexMapName = this.statusArr.map(function (e) {
          return e.name;
        }).indexOf(this.statusFromDb[indexMapId].name);

        this.fillColorStatus(indexMapName);
      }

      let indexFlagMapId = this.flagFromDb.map(function (e) {
        return e.id;
      }).indexOf(this.reservation.nationalityId);
      this.nationalSelected = this.flagFromDb[indexFlagMapId];
      let indexHotelStatus = this.hotelStatusList.map((e) => {
        return e.id;
      }).indexOf(this.reservation.hotelStatusId);
      this.fillColorHotelStatus(indexHotelStatus);
    } else {
      this.initDataPopup();
      this.fillColorStatus(0);
      this.fillColorHotelStatus(1);
      this.nationalSelected = null;
      this.parseTitlePopup(reservationInfo);
      this.checkIn = moment(dateFrom, 'YYYY-MM-DD').toDate();
      this.checkOut = moment(dateTo, 'YYYY-MM-DD').toDate();
      this.reservation.accommodationId = reservationInfo.accommodationId;
    }
  }
  public acceptWarning(reservation) {
    if (reservation.id) {
      this.updateReservation(reservation);
    } else {
      this.createReservation(reservation);
    }
  }

  public updateReservation(reservation) {
    this.showModal();
    setTimeout(() => {
      let error = this.validateForm(reservation);
      if (error) {
        this.parseErrorToString(error);
      } else {
        if (this.reservation.nationalityId == null) delete this.reservation.nationalityId;
        this.reservationService.updateReservation(reservation.id, reservation).subscribe(
          res => {
            this.reservation = res.json() as ReservationDateModel;
            this.calendar(this.startDate, this.filterObj);
            this.lgModal.hide();
            this.warningModal.hide();
          },
          err => {
            this.parseErrorToString(err[0]);
          }
        );
      }
    })
  }

  public createReservation(reservation) {
    this.showModal();
    setTimeout(() => {
      let error = this.validateForm(reservation);
      if (error) {
        this.parseErrorToString(error);
      } else {
        this.reservationService.createReservation(reservation).subscribe(
          res => {
            this.reservation = res.json() as ReservationDateModel;
            this.calendar(this.startDate, this.filterObj);
            this.warningModal.hide();
            this.lgModal.hide();
          },
          err => {
            this.parseErrorToString(err[0]);
          }
        );
      }
    });
  }

  public createOtherReservation(reservation) {
    this.showModal();
    setTimeout(() => {
      let error = this.validateForm(reservation);
      if (error) {
        this.parseErrorToString(error);
      } else {
        this.reservationService.createOtherReservation(reservation).subscribe(
          res => {
            this.reservation = res.json() as OtherReservationDateModel;
            this.calendar(this.startDate, this.filterObj);
            this.warningModal.hide();
            this.lgModal.hide();
          },
          err => {
            this.parseErrorToString(err[0]);
          }
        );
      }
    });
  }

  public updateOtherReservation(reservation) {
    this.showModal();
    setTimeout(() => {
      let error = this.validateForm(reservation);
      if (error) {
        this.parseErrorToString(error);
      } else {
        if (this.reservation.nationalityId == null) delete this.reservation.nationalityId;
        this.reservationService.updateOtherReservation(reservation.id, reservation).subscribe(
          res => {
            this.reservation = res.json() as OtherReservationDateModel;
            this.calendar(this.startDate, this.filterObj);
            this.lgModal.hide();
            this.warningModal.hide();
          },
          err => {
            this.parseErrorToString(err[0]);
          }
        );
      }
    });
  }

  public applyReservation(reservation) {
    reservation.dateFrom = moment(this.checkIn).format('YYYY-MM-DD');
    reservation.dateTo = moment(this.checkOut).format('YYYY-MM-DD');
    if (!this.isOtherReservation) {
      if (reservation.id) {
        if (this.dupplicateCheckOut || this.dupplicateCheckIn) {
          this.warningModal.show();
        } else {
          this.updateReservation(reservation);
        }
      } else {
        if (this.dupplicateCheckOut || this.dupplicateCheckIn) {
          this.warningModal.show();
        } else {
          this.createReservation(reservation);
        }
      }
    } else { //Other reservation
      if (reservation.id) {
        this.updateOtherReservation(reservation);
      } else {
        this.createOtherReservation(reservation);
      }
    }
  }

  public deleteReservation(id) {
    this.showModal();
    setTimeout(() => {
      let objLastUpdated = {
        'lastUpdated': this.reservation.lastUpdated
      };
      if (!this.isOtherReservation) {
        this.reservationService.deleteReservation(id, objLastUpdated).subscribe(
          res => {
            this.reservation = new ReservationDateModel;
            this.calendar(this.startDate, this.filterObj);
            this.staticModal.hide();
            this.lgModal.hide();
          },
          err => {
            this.parseErrorToString(err[0]);
          }
        );
      } else {
        this.reservationService.deleteOtherReservation(id, objLastUpdated).subscribe(
          res => {
            this.reservation = new OtherReservationDateModel;
            this.calendar(this.startDate, this.filterObj);
            this.staticModal.hide();
            this.lgModal.hide();
          },
          err => {
            this.parseErrorToString(err[0]);
          }
        );
      }
    });
  }

  public getDate(date): number {
    return date && date.getTime() || new Date().getTime();
  }

  public selectNation(flatObj): any {
    this.nationalSelected = flatObj;
    this.isSelectNation = false;
    this.reservation.nationalityId = flatObj.id;
  }

  public fillColorStatus(index) {
    for (let i = 0; i < this.statusArr.length; i++) {
      this.statusArr[i].active = false;
    }
    this.statusArr[index].active = true;
  }

  public selectStatus(index) {
    this.fillColorStatus(index);
    let idx = this.statusFromDb.map(function (e) {
      return e.name;
    }).indexOf(this.statusArr[index].name);
    if (idx > -1) {
      this.reservation.reservationStatusId = this.statusFromDb[idx].id;
    }
  }

  public fillColorHotelStatus(index) {
    for (let i = 0; i < this.hotelStatusList.length; i++) {
      this.hotelStatusList[i].active = false;
    }
    this.hotelStatusList[index].active = true;
  }

  public selectHotelStatus(index) {
    this.fillColorHotelStatus(index);
    this.reservation.hotelStatusId = this.hotelStatusList[index].id;
  }

  public validateForm(reservation) {
    if (new Date(reservation.dateFrom) > new Date(reservation.dateTo)) {
      return 'dateFrom_after_dateTo';
    } else if (!reservation.nationalityId && (reservation.reservationStatusId === 2 ||
      reservation.reservationStatusId === 3 ||
      reservation.reservationStatusId === 4)) {
      return 'national_null';
    } else {
      return '';
    }
  }

  public parseErrorToString(error) {
    let message = 'Error!';
    if (error) {
      message = error;
      if (error === 'reservation_data_changed') {
        message = 'This reservation has been already changed by the other user. Please refresh the page';
        this.staticModal.hide();
      } else if (error === 'date_from_before_date_to') {
        message = 'Date from before date to';
      } else if (error === 'dateFrom_after_dateTo') {
        message = 'Check-in date should be earlier than check-out date.';
      } else if (error === 'national_null') {
        message = 'Please select Nationality.';
      } else {
        message = 'The bed can\'t be reserved in the term. Please check the schedule of the bed.';
      }
    }
    alert(message);
    if (this.isWarningPopupShown) {
      this.warningModal.hide();
    } else if (this.isStaticPopupShown) {
      this.staticModal.hide();
    }
    setTimeout(() => {
      this.hideModal();
    });
  }

  public resetDateRange() {
    $('table tbody td.active').removeClass('first');
    $('table tbody td.active').removeClass('last');
    $('table tbody td.active').removeClass('active');
  }

  public onActiveDateChange(event, side): any {
    let currentActiveMonth = event.getMonth();
    if (side === 'left') {
      this.saveCurrentMonthCheckIn = currentActiveMonth;
    } else {
      this.saveCurrentMonthCheckOut = currentActiveMonth;
    }
    setTimeout(() => {
      $('table td button.custom-class span').removeClass('text-muted');
      if (event.getFullYear() === this.checkIn.getFullYear() || event.getFullYear() === this.checkOut.getFullYear()) {
        this.calculateRangeDate(currentActiveMonth, side);
      }
    });
  }

  public onChangeCheckIn(event) {
    setTimeout(() => {
      let checkInCurrentDateId = $('.left-side tbody tr td').has('button.btn-info')[0].id;
      let arrDateIdCheckIn: string[] = checkInCurrentDateId.split('-');
      this.checkInDatepickerId = arrDateIdCheckIn[0] + '--' + arrDateIdCheckIn[2];
      this.currentIndexCheckIn = parseInt(arrDateIdCheckIn[3]);
      this.dupplicateCheckIn = false;
      $('[aria-labelledby=\'' + this.checkInDatepickerId + '-title\'] td button.custom-class span').removeClass('text-muted');
      if (this.checkIn && this.checkOut) {
        this.resetDateRange();
        if (!this.isOtherReservation) {
          this.checkDateDuplicateOrNot(this.reservation.id ? this.reservation.id : 0, this.checkIn, this.reservation.bedId, 2);
        }
        let currentMonthCheckIn = this.checkIn.getMonth();
        let currentMonthCheckOut = this.checkOut.getMonth();
        if (this.checkOut.getTime() < this.checkIn.getTime()) return;
        if (this.saveCurrentMonthCheckOut === undefined) {
          this.saveCurrentMonthCheckOut = currentMonthCheckOut;
        }
        this.calculateRangeDate(currentMonthCheckIn, 'left');
        if (currentMonthCheckOut === this.saveCurrentMonthCheckOut) {
          this.calculateRangeDate(currentMonthCheckOut, 'right');
        } else if (this.saveCurrentMonthCheckOut > currentMonthCheckIn || this.saveCurrentMonthCheckOut < currentMonthCheckOut) {
          this.calculateRangeDate(this.saveCurrentMonthCheckOut, 'right');
        }
      }
    });
  }

  public onChangeCheckOut(event) {
    setTimeout(() => {
      let checkOutCurrentDateId = $('.right-side tbody tr td').has('button.btn-info')[0].id;
      let arrDateIdCheckOut: string[] = checkOutCurrentDateId.split('-');
      this.checkOutDatepickerId = arrDateIdCheckOut[0] + '--' + arrDateIdCheckOut[2];
      this.currentIndexCheckOut = parseInt(arrDateIdCheckOut[3]);
      this.dupplicateCheckOut = false;
      $('[aria-labelledby=\'' + this.checkOutDatepickerId + '-title\'] td button.custom-class span').removeClass('text-muted');
      if (this.checkIn && this.checkOut) {
        this.resetDateRange();
        if (!this.isOtherReservation) {
          this.checkDateDuplicateOrNot(this.reservation.id ? this.reservation.id : 0, this.checkOut, this.reservation.bedId, 1);
        }
        let currentMonthCheckIn = this.checkIn.getMonth();
        let currentMonthCheckOut = this.checkOut.getMonth();
        if (this.saveCurrentMonthCheckIn === undefined) {
          this.saveCurrentMonthCheckIn = currentMonthCheckIn;
        }
        if (this.checkOut.getTime() < this.checkIn.getTime()) return;
        if (currentMonthCheckIn === this.saveCurrentMonthCheckIn) {
          this.calculateRangeDate(currentMonthCheckIn, 'left');
        } else if (this.saveCurrentMonthCheckIn >= currentMonthCheckIn && this.saveCurrentMonthCheckIn <= currentMonthCheckOut) {
          this.calculateRangeDate(this.saveCurrentMonthCheckIn, 'left');
        }
        this.calculateRangeDate(currentMonthCheckOut, 'right');
      }
    });
  }

  public calculateRangeDate(currentActiveMonth, side): any {
    if (this.checkIn && this.checkOut) {
      let checkInMonth = this.checkIn.getMonth();
      let checkInDay = this.checkIn.getDate();
      let checkOutMonth = this.checkOut.getMonth();
      let checkOutDay = this.checkOut.getDate();

      if (this.checkOut.getTime() < this.checkIn.getTime()) return;

      if (currentActiveMonth === checkInMonth && currentActiveMonth === checkOutMonth) {
        this.activeRange(this.currentIndexCheckIn, this.currentIndexCheckOut, side);
      } else if (currentActiveMonth === checkInMonth) {
        this.activeRange(this.currentIndexCheckIn, this.totalColumnCalendar, side);
      } else if (currentActiveMonth === checkOutMonth) {
        this.activeRange(0, this.currentIndexCheckOut, side);
      } else if (currentActiveMonth > checkInMonth && currentActiveMonth < checkOutMonth) {
        this.activeRange(0, this.totalColumnCalendar, side);
      } else {
        // $('table tbody td.active').removeClass('active');
        return;
      }
    }
  }

  public activeRange(startIndex, endIndex, side) {
    $('table thead tr:first-child th:first-child button').html('<i class=\'fa fa-angle-left\' aria-hidden=\'true\'></i>');
    $('table thead tr:first-child th:last-child button').html('<i class=\'fa fa-angle-right\' aria-hidden=\'true\'></i>');

    var arrColumnLeft = $('[aria-labelledby=\'' + this.checkInDatepickerId + '-title\'] td:not(:has(button span.text-muted))');
    var arrColumnRight = $('[aria-labelledby=\'' + this.checkOutDatepickerId + '-title\'] td:not(:has(button span.text-muted))');
    var saveIndexLeft;
    var saveIndexRight;
    
    if (parseInt($(arrColumnLeft[0]).text()) > parseInt($(arrColumnLeft[1]).text())) {
      var dateRemove = arrColumnLeft[0];
      var id = $(dateRemove).attr('id');
      saveIndexLeft = parseInt(id.split('-')[3]);
    }
    if (parseInt($(arrColumnLeft[arrColumnLeft.length - 1]).text()) < parseInt($(arrColumnLeft[arrColumnLeft.length - 2]).text())) {
      var dateRemove = arrColumnLeft[arrColumnLeft.length - 1];
      var id = $(dateRemove).attr('id');
      saveIndexLeft = parseInt(id.split('-')[3]);
    }
    if (parseInt($(arrColumnRight[0]).text()) > parseInt($(arrColumnRight[1]).text())) {
      var dateRemove = arrColumnRight[0];
      var id = $(dateRemove).attr('id');
      saveIndexRight = parseInt(id.split('-')[3]);
    }
    if (parseInt($(arrColumnRight[arrColumnRight.length - 1]).text()) < parseInt($(arrColumnRight[arrColumnRight.length - 2]).text())) {
      var dateRemove = arrColumnRight[arrColumnRight.length - 1];
      var id = $(dateRemove).attr('id');
      saveIndexRight = parseInt(id.split('-')[3]);
    }
    
    for (var i = startIndex; i <= endIndex; i++) {
      if (side === 'left') {
        if (saveIndexLeft !== i) {
          $('#' + this.checkInDatepickerId + '-' + i + ':not(:has(button span.text-muted))').addClass('active');
        }
        if (i === startIndex) {
          $('#' + this.checkInDatepickerId + '-' + i).addClass('first');
        }
        if (i === endIndex) {
          $('#' + this.checkInDatepickerId + '-' + i).addClass('last');
        }
      } else {
        if (saveIndexRight !== i) {
          $('#' + this.checkOutDatepickerId + '-' + i + ':not(:has(button span.text-muted))').addClass('active');
        }
        if (i === startIndex) {
          $('#' + this.checkOutDatepickerId + '-' + i).addClass('first');
        }
        if (i === endIndex) {
          $('#' + this.checkOutDatepickerId + '-' + i).addClass('last');
        }
      }
    }
    setTimeout(() => {
      var arrActiveColumnLeft = $('[aria-labelledby=\'' + this.checkInDatepickerId + '-title\'] tr > td.active');
      var arrActiveColumnRight = $('[aria-labelledby=\'' + this.checkOutDatepickerId + '-title\'] tr > td.active');
      $(arrActiveColumnLeft[0]).addClass('first');
      $(arrActiveColumnLeft[arrActiveColumnLeft.length - 1]).addClass('last');
      $(arrActiveColumnRight[0]).addClass('first');
      $(arrActiveColumnRight[arrActiveColumnRight.length - 1]).addClass('last');
    })
  }
}
