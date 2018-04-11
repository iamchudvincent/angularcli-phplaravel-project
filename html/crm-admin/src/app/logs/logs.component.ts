import { Component, OnInit } from '@angular/core';
import { IMyOptions, IMyDateModel } from 'ngx-mydatepicker';
import * as moment from 'moment';
import * as $ from 'jquery';
import { LocalStorageService } from 'ng2-webstorage';

import { LogsService } from './shared/log.service';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss']
})
export class LogsComponent implements OnInit {

  public listLogs: Array<any> = [];
  public selectDatePickerOptions: IMyOptions = {
    // other options...
    dateFormat: 'yyyy/mm/dd',
  };
  public isModalShown: boolean = false;
  public blobFile = null;
  public dateType = {
    dateFrom: 0,
    dateTo: 1
  }
  constructor(private logService: LogsService, private localStorageService: LocalStorageService) { }

  ngOnInit() {
    this.isModalShown = true;
    this.getListFile();
  }

  public getListFile() {
    this.logService.listLogs().subscribe(
      (res) => {
        this.listLogs = res["logs"];
        this.isModalShown = false;
      }
    ),
      (error) => {
        this.isModalShown = false;
        console.log(error);
        alert();
      }
  }

  public download(logContent) {
    this.isModalShown = true;
    this.logService.getLog(logContent.startDateOfWeek).subscribe(
      (res) => {
        this.blobFile = res;
        this.pDownloadFile(res, logContent.name);
        this.isModalShown = false;
      },
      (error) => {
        this.isModalShown = false;
        alert('Download file error');
      }
    )
  }

  public onHidden() {
    this.isModalShown = false;
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
