import {Component, OnInit, Input} from "@angular/core";

@Component({
  moduleId: module.id,
  selector: 'dorm-print-student',
  templateUrl: './dorm-print.component.html',
})
export class DormPrintComponent implements OnInit {
    @Input() dormchangelist: Array<any> = [{}];
    @Input() hotelchangeList: Array<any> = [{}];
    @Input() walkinchangeList: Array<any> = [{}];
    @Input() condochangeList: Array<any> = [{}];
    constructor() {
    }
  ngOnInit() {
  }
}