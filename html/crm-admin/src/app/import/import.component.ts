import { Component, OnInit, ElementRef } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ImportService } from './shared/import.service';
import * as $ from 'jquery';
import { ImportDataErrorModel, ImportDataFullErrorModel, ImportDataLineErrorModel } from './shared/import.model';
import { LocalStorageService } from 'ng2-webstorage';
// import { AppSettings } from '../app.setting';
import { ConfigService } from '../shared/config.service';

@Component({
    selector: 'import',
    templateUrl: 'import.component.html',
    styleUrls: ['import.component.scss']
})
export class ImportComponent implements OnInit {
    title = 'Import Page';

    public isModalShown: boolean = false;
    public file = null;
    public filePath = '';
    public import_success: boolean = false;
    public error_data: ImportDataFullErrorModel;
    public blobFile: any = null;
    public user: any = null;
    public isRegister: boolean = false;
    private mimeType: Array<string> = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/csv'
    ];
    public AppSettings;
    public error_code = {
        'bed_id_required': 'bed_id error',
        'bed_id_invalid': 'bed_id error',
        'memo_more_1000': 'memo more than 1000',
        'nationality_id_invalid': 'nationality_id error',
        'import_file_required': 'import file required',
        'date_from_required': 'date_from error',
        'date_from_invalid': 'date_from error',
        'date_to_required': 'date_to error',
        'date_to_invalid': 'date_to error',
        'date_range_conflict_import_data': 'date range conflict import data',
        'date_range_conflict_database': 'date range conflict database',
        'reservation_status_id_required': 'reservation_status_id error',
        'reservation_status_id_invalid': 'reservation_status_id error',
        'nationality_id_required': 'nationality_id is required',
        'file_type_invalid': 'file type is invalid',
        'date_from_after_date_to': 'date from after date to',
        'reservation_status_id_should_not_be_one': 'reservation status should be not 1'
    };

    constructor(private _elementRef: ElementRef,
        private importService: ImportService,
        private localStorageService: LocalStorageService,
        public configService: ConfigService) { }

    ngOnInit() {
        this.error_data = new ImportDataFullErrorModel();
        this.user = this.localStorageService.retrieve('user');
        if (this.configService.config) {
            this.AppSettings = this.configService.config;
             this.isRegister = this.checkRole();
        } else {
            this.configService.loadConfiguration().subscribe(() => {
                this.AppSettings = this.configService.config;
                 this.isRegister = this.checkRole();
            });
        }
    }

    onChange(event) {
        if (event.srcElement) {
            this.file = event.srcElement.files[0];
            this.filePath = this._elementRef.nativeElement.querySelector('#upload-file').value;
        } else {
            this.file = this._elementRef.nativeElement.querySelector('#upload-file').files[0];
            this.filePath = this._elementRef.nativeElement.querySelector('#upload-file').value;
        }
    }

    private checkRole() {
        return (this.user && this.user.role && (this.user.role.name === this.AppSettings['Role']['Admin']
            || this.user.role.name === this.AppSettings['Role']['Register']));
    }

    uploadFile() {
        if (this.file) {
            if (this.mimeType.indexOf(this.file.type) > -1) {
                this.isModalShown = true;
                this.importService.uploadData(this.file).subscribe(
                    (res) => {
                        this.import_success = true;
                        this.isModalShown = false;
                    },
                    (error) => {
                        this.import_success = false;
                        this.isModalShown = false;
                        let errors = error.json();
                        if (error.status === 400) {
                            if (errors.data && errors.data instanceof Array) {
                                this.error_data = errors;
                            } else if (errors) {
                                alert(this.error_code.file_type_invalid);
                            }

                        } else if (error.status === 500) {
                            alert('Server error 500');
                        }
                    }
                )
            } else {
                alert(this.error_code.file_type_invalid);
            }
        } else {
            alert(this.error_code.import_file_required);
        }
    }

    public onHidden(): void {
        this.isModalShown = false;
    }

    public downloadTemplate(): void {
        this.importService.downloadTemplate().subscribe(
            res => {
                this.downloadFile(res, 'import_template.csv');
                this.blobFile = res;
            },
            error => {
                if (error.status === 500) {
                    alert(error.statusText);
                }
            }
        )
    }

    public checkDate(date): boolean {
        return (date instanceof Date);
    }

    public downloadBedIds(): void {
        this.importService.downloadBedIds().subscribe(
            res => {
                this.downloadFile(res, 'beds_id_data.csv');
                this.blobFile = res;
            },
            error => {
                if (error.status === 500) {
                    alert(error.statusText);
                }
            }
        )
    }

    private downloadFile(blobData, fileName) {
        let a = $('<a id=\'downloadFile\' style=\'display: none;\'/>');
        let downloadUrl = null;

        if (this.detectIE() == false) {
            // Internet Explorer 6-11        
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
