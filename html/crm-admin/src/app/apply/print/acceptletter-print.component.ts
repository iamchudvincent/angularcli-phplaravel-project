import {Component, OnInit, Input} from "@angular/core";

@Component({
  moduleId: module.id,
  selector: 'acceptletter-print-student',
  templateUrl: './acceptletter-print.component.html',
})
export class AcceptLetterPrintComponent implements OnInit {
    @Input() acceptLetterList: Array<any> = [{}];
    @Input() today: number = Date.now();
    constructor() {
    }
  ngOnInit() {
  }
}