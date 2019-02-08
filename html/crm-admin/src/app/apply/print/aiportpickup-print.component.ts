import {Component, OnInit, Input} from "@angular/core";

@Component({
  moduleId: module.id,
  selector: 'aiportpickup-print-student',
  templateUrl: './aiportpickup-print.component.html',
})
export class AirportPickupPrintComponent implements OnInit {
    @Input() airportPickUpList: Array<any> = [{}];
    constructor() {
    }
  ngOnInit() {
  }
}