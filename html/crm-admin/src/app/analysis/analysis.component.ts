import { Component, OnInit } from '@angular/core';
import { IMyOptions, IMyDateModel } from 'ngx-mydatepicker';
import { ReservationService } from '../reservation/shared/reservation.service';
import { AnalysisService } from './shared/analysis.service';
import * as moment from 'moment';
import * as $ from 'jquery';
import { AnalysisFilterModel } from './shared/analysis.model';

@Component({
    moduleId: module.id,
    selector: 'analysis',
    templateUrl: 'analysis.component.html',
    styleUrls: ['analysis.component.scss']
})
export class AnalysisComponent implements OnInit {
    public buildingOptions: Array<any> = [{}];
    public filterObj: AnalysisFilterModel;
    public saveDataLoadEvent: any;
    public blobFile: any = null;
    public selectDatePickerOptions: IMyOptions = {
        // other options...
        dateFormat: 'yyyy/mm/dd',
    };
    public dateType = {
        dateFrom: 0,
        dateTo: 1
    };
    public dateInvalid = {
        dateFrom: false,
        dateTo: false
    }
    public isModalShown: boolean = false;
    public errorMessage = {
        dateFromAfterDateTo: 'Date from is after date to',
        dateToBeforeDateFrom: 'Date to is before date from',
        buildingRequried: 'Building is required'
    };
    constructor(private reservationService: ReservationService, private analysisService: AnalysisService) { }
    ngOnInit() {
        this.isModalShown = true;
        this.filterObj = new AnalysisFilterModel();
        this.saveDataLoadEvent = new AnalysisFilterModel();
        this.reservationService.getDataForFilter().subscribe(
            res => {
                this.isModalShown = false;
                this.buildingOptions = this.formatInputSelect2(res.json().buildings, null);
                this.filterObj.buildingId = this.buildingOptions[0].id;
                this.filterObj.type = 1;
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
        if (type === this.dateType.dateFrom) {
            let dateFrom = moment(event.jsdate);
            let dateTo = moment(this.saveDataLoadEvent.dateTo.jsdate)

            if (dateFrom.isSameOrBefore(dateTo)) {
                this.dateInvalid.dateFrom = false;
                this.dateInvalid.dateTo = false;
                this.saveDataLoadEvent.dateFrom = event;
            } else {
                this.dateInvalid.dateFrom = true;
                this.saveDataLoadEvent.dateFrom = oldValue;
            }
        } else {
            let dateFrom = moment(this.saveDataLoadEvent.dateFrom.jsdate);
            let dateTo = moment(event.jsdate)

            if (dateTo.isSameOrAfter(dateFrom)) {
                this.dateInvalid.dateFrom = false;
                this.dateInvalid.dateTo = false;
                this.saveDataLoadEvent.dateTo = event;
            } else {
                this.dateInvalid.dateTo = true;
                this.saveDataLoadEvent.dateTo = oldValue;
            }
        }
    }
    public downloadFile() {
        if (this.validFilterModel().length === 0) {
            this.filterObj.dateFrom = moment(this.saveDataLoadEvent.dateFrom.jsdate).format('YYYY-MM-DD');
            this.filterObj.dateTo = moment(this.saveDataLoadEvent.dateTo.jsdate).format('YYYY-MM-DD');
            this.isModalShown = true;
            this.analysisService.downloadFile(this.convertToBE(this.filterObj)).delay(300).subscribe(
                res => {
                    this.isModalShown = false;
                    this.blobFile = res;
                    this.pDownloadFile(res, 'Analysis.csv');
                },
                error => {
                    this.isModalShown = false;
                    if (error.status === 500) {
                        alert(error.statusText);
                    }
                }
            );
        }
    }

    private pDownloadFile(blobData, fileName) {
        let a = $('<a id=\'downloadFile\' style=\'display: none;\'/>');
        let downloadUrl = null;

        if (this.detectIE() === false) {
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
                    id: input[key].id !== null ? (convertoString ? input[key].id.toString() : input[key].id) : (convertoString ? '3' : 3),
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

        if (dateFrom.isAfter(dateTo)) {
            error.push(this.errorMessage.dateFromAfterDateTo);
        }

        return error;
    }

    private convertToBE(frontEndModel: AnalysisFilterModel): AnalysisFilterModel {
        let backendModel = new AnalysisFilterModel();
        backendModel.buildingId = frontEndModel.buildingId;
        backendModel.dateFrom = frontEndModel.dateFrom;
        backendModel.dateTo = frontEndModel.dateTo;
        backendModel.type = frontEndModel.type;
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
    public onHidden(): void {
        this.isModalShown = false;
    }

}
