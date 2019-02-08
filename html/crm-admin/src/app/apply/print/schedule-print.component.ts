import {Component, OnInit, Input} from "@angular/core";

@Component({
  moduleId: module.id,
  selector: 'schedule-print-student',
  templateUrl: './schedule-print.component.html',
})
export class SchedulePrintComponent implements OnInit {
    @Input() schedulelist: Array<any> = [{}];
    constructor() {
    }
  ngOnInit() {
  }
}