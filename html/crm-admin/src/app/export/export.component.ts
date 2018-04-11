import { Component, OnInit } from '@angular/core';
import { ExportFilterModel } from './shared/export.model';
import { IMyOptions, IMyDateModel } from 'ngx-mydatepicker';
import * as moment from 'moment';
import * as $ from 'jquery';

import { ReservationService } from '../reservation/shared/reservation.service';
import { ExportService } from './shared/export.service';

@Component({
    selector: 'export',
    templateUrl: 'export.component.html',
    styleUrls: ['export.component.scss']
})
export class ExportComponent implements OnInit {
    title = 'Export Page';

    public isModalShown: boolean = false;
    public saveDataLoadEvent: any;
    public stayTypeOptions: Array<any> = [{}];
    public genderOptions: Array<any> = [{}];
    public roomTypeOptions: Array<any> = [{}];
    public buildingOptions: Array<any> = [{}];
    public blobFile: any = null;
    public dateInvalie = {
        dateFrom: false,
        dateTo: false
    };
    public selectDatePickerOptions: IMyOptions = {
        // other options...
        dateFormat: 'yyyy/mm/dd',
    };
    public dateType = {
        dateFrom: 0,
        dateTo: 1
    };

    public errorMessage = {
        dateFromAfterDateTo: 'Date from is after date to',
        dateToBeforeDateFrom: 'Date to is before date from',
        buildingRequried: 'Building is required',
        stayTypeRequired: 'Stay type is required',
        roomTypeRequired: 'Room type is required',
    };

    public nationalSelected;
    filterObj: ExportFilterModel;

    constructor(private reservationService: ReservationService, private exportService: ExportService) { }

    ngOnInit() {
        $('.bg-faded:first').css('align-items', 'center');
        this.isModalShown = true;
        this.filterObj = new ExportFilterModel();
        this.saveDataLoadEvent = new ExportFilterModel();
        this.reservationService.getDataForFilter().subscribe(
            res => {
                this.isModalShown = false;
                this.genderOptions = this.formatInputSelect2(res.json().genders, null, true);
                this.roomTypeOptions = this.formatInputSelect2(res.json().roomTypes, 'roomType');
                this.buildingOptions = this.formatInputSelect2(res.json().buildings, null);
                this.stayTypeOptions = this.formatInputSelect2([{ id: 'dormitory', name: 'Dormitory' }, { id: 'other', name: 'Others' }], null);

                this.filterObj.gender = this.genderOptions[0].id;
                this.filterObj.roomTypeId = this.roomTypeOptions[0].id;
                this.filterObj.stayType = this.stayTypeOptions[0].id;
                this.filterObj.buildingId = this.buildingOptions[0].id;
                this.saveDataLoadEvent = {
                    dateFrom: this.setNgxDatepickerModel(new Date()),
                    dateTo: this.setNgxDatepickerModel(new Date())
                }
                this.filterObj.dateFrom = moment().format(this.selectDatePickerOptions.dateFormat);
            },
            error => {
                this.isModalShown = false;
            }
        );
    }

    public checkDateValidation(oldValue, event, type) {
        if (type == this.dateType.dateFrom) {
            let dateFrom = moment(event.jsdate);
            let dateTo = moment(this.saveDataLoadEvent.dateTo.jsdate)

            if (dateFrom.isSameOrBefore(dateTo)) {
                this.dateInvalie.dateFrom = false;
                this.dateInvalie.dateTo = false;
                this.saveDataLoadEvent.dateFrom = event;
            } else {
                this.dateInvalie.dateFrom = true;
                this.saveDataLoadEvent.dateFrom = oldValue;
            }
        } else {
            let dateFrom = moment(this.saveDataLoadEvent.dateFrom.jsdate);
            let dateTo = moment(event.jsdate)

            if (dateTo.isSameOrAfter(dateFrom)) {
                this.dateInvalie.dateFrom = false;
                this.dateInvalie.dateTo = false;
                this.saveDataLoadEvent.dateTo = event;
            } else {
                this.dateInvalie.dateTo = true;
                this.saveDataLoadEvent.dateTo = oldValue;
            }
        }
    }

    public onHidden(): void {
        this.isModalShown = false;
    }

    public downloadFile() {
        if (this.validFilterModel().length == 0) {
            this.filterObj.dateFrom = moment(this.saveDataLoadEvent.dateFrom.jsdate).format("YYYY-MM-DD");
            this.filterObj.dateTo = moment(this.saveDataLoadEvent.dateTo.jsdate).format("YYYY-MM-DD");
            this.isModalShown = true;
            this.exportService.downloadFile(this.convertToBE(this.filterObj)).delay(300).subscribe(
                res => {
                    this.isModalShown = false;
                    this.blobFile = res;
                    this.pDownloadFile(res, (this.filterObj.stayType == this.stayTypeOptions[0].id) ? "crm_dormitory_data.csv" : "crm_others_data.csv");
                },
                error => {
                    this.isModalShown = false;
                    if (error.status == 500) {
                        alert(error.statusText);
                    }
                }
            )
        } else {

        }
    }

    private pDownloadFile(blobData, fileName) {
        let a = $('<a id=\'downloadFile\' style=\'display: none;\'/>');
        let downloadUrl = null;

        if (this.detectIE() == false) {
            if (navigator.msSaveBlob) {
                downloadUrl = navigator.msSaveBlob(blobData, fileName);
            } else {
                downloadUrl = window.URL.createObjectURL(blobData);
            }

            a.attr('href', downloadUrl);
            a.attr('download', fileName);
            $('body').append(a);
            a[0].click();

            window.URL.revokeObjectURL(downloadUrl);
            a.remove();
        } else {
            window.navigator.msSaveOrOpenBlob(blobData, fileName);
        }
    }

    private formatInputSelect2(input, type, convertoString: boolean = false): any {
        let output = [];
        if (type == 'roomType') {
            for (let key in input) {
                output.push({
                    id: input[key].id,
                    text: input[key].type
                });
            }
        } else {
            for (let key in input) {
                output.push({
                    id: input[key].id !== null ? (convertoString ? input[key].id.toString(): input[key].id) : (convertoString ? "3" : 3),
                    text: input[key].name
                });
            }
        }

        return output;
    }

    private setNgxDatepickerModel(time: Date) {
        let date = time.getDate();
        let month = time.getMonth() + 1;
        let year = time.getFullYear();
        return {
            date: {
                day: date,
                month: month,
                year: year
            }
        }
    }

    private validFilterModel() {
        let error: Array<string> = [];
        let dateTo = moment(this.saveDataLoadEvent.dateTo.jsdate);
        let dateFrom = moment(this.saveDataLoadEvent.dateFrom.jsdate);

        if (!this.filterObj.buildingId) {
            error.push(this.errorMessage.buildingRequried);
        }

        if (!this.filterObj.roomTypeId) {
            error.push(this.errorMessage.roomTypeRequired);
        }

        if (!this.filterObj.stayType) {
            error.push(this.errorMessage.stayTypeRequired);
        }

        if (dateFrom.isAfter(dateTo)) {
            error.push(this.errorMessage.dateFromAfterDateTo);
        }

        return error;
    }

    private convertToBE(frontEndModel: ExportFilterModel): ExportFilterModel {
        let backendModel = new ExportFilterModel();
        backendModel.buildingId = frontEndModel.buildingId;
        backendModel.dateFrom = frontEndModel.dateFrom;
        backendModel.dateTo = frontEndModel.dateTo;
        backendModel.stayType = frontEndModel.stayType;

        if (backendModel.stayType == this.stayTypeOptions[this.stayTypeOptions.length - 1].id) {
            backendModel.gender = "null";
            backendModel.roomTypeId = -1;
        } else {
            backendModel.gender = (frontEndModel.gender != this.genderOptions[this.genderOptions.length - 1].id) ? frontEndModel.gender : "null";
            backendModel.roomTypeId = frontEndModel.roomTypeId;
        }

        return backendModel;
    }

    private detectIE() {
        var ua = window.navigator.userAgent;

        // Test values; Uncomment to check result …

        // IE 10
        // ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';

        // IE 11
        // ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';

        // Edge 12 (Spartan)
        // ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';

        // Edge 13
        // ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586';

        var msie = ua.indexOf('MSIE ');
        if (msie > 0) {
            // IE 10 or older => return version number
            return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
        }

        var trident = ua.indexOf('Trident/');
        if (trident > 0) {
            // IE 11 => return version number
            var rv = ua.indexOf('rv:');
            return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
        }

        var edge = ua.indexOf('Edge/');
        if (edge > 0) {
            // Edge (IE 12+) => return version number
            return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
        }

        // other browser
        return false;
    }
}
