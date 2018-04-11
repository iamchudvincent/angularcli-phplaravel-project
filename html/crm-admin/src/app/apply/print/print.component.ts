import {Component, OnInit, Input} from "@angular/core";

@Component({
  moduleId: module.id,
  selector: 'print-student',
  templateUrl: './print.component.html',
})
export class PrintComponent implements OnInit {
    @Input() list: Array<any> = [{}];
    constructor() {
    }
  ngOnInit() {
  }
}