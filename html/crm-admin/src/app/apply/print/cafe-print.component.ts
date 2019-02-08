import {Component, OnInit, Input} from "@angular/core";

@Component({
  moduleId: module.id,
  selector: 'cafe-print-student',
  templateUrl: './cafe-print.component.html',
})
export class CafePrintComponent implements OnInit {
    @Input() qqeCafeList: Array<any> = [{}];
    @Input() qqeCafeListSec: Array<any> = [{}];
    @Input() qqeCafeListThird: Array<any> = [{}];
    @Input() qqeCafeListFourth: Array<any> = [{}];
    constructor() {
    }
  ngOnInit() {
  }
}