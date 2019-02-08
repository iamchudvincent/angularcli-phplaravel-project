import {Component, OnInit, Input} from "@angular/core";

@Component({
  moduleId: module.id,
  selector: 'grad-print-student',
  templateUrl: './grad-print.component.html',
})
export class GradPrintComponent implements OnInit {
    @Input() gradlist: Array<any> = [{}];
    constructor() {
    }
  ngOnInit() {
  }
}