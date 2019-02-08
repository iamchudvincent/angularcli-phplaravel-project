import {Component, OnInit, Input} from "@angular/core";

@Component({
  moduleId: module.id,
  selector: 'ga-print-student',
  templateUrl: './ga-print.component.html',
})
export class GaPrintComponent implements OnInit {
    @Input() gaInvoiceTemplates: Array<any> = [{}];
    @Input() userName: String;
    @Input() gaToday: number = Date.now();
    constructor() {
    }
  ngOnInit() {
  }
}