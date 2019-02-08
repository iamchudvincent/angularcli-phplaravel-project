import {BrowserModule} from "@angular/platform-browser";
import {HttpModule} from "@angular/http";
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ApplyComponent} from "./apply.component";
import {PrintComponent} from "./print/print.component";
import {GradPrintComponent} from "./print/grad-print.component";
import {GaPrintComponent} from "./print/ga-print.component";
import {DormPrintComponent} from "./print/dorm-print.component";
import {SchedulePrintComponent} from "./print/schedule-print.component";
import {CafePrintComponent} from "./print/cafe-print.component";
import {AirportPickupPrintComponent} from "./print/aiportpickup-print.component";
import {AcceptLetterPrintComponent} from "./print/acceptletter-print.component";
import {ApplyService} from "./share/apply.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import {DatepickerModule, ModalModule, TabsModule} from "ngx-bootstrap";
import {NgxMyDatePickerModule} from "ngx-mydatepicker";
import {ConfigService} from "../shared/config.service";
import {PerfectScrollbarConfigInterface, PerfectScrollbarModule} from "ngx-perfect-scrollbar";
import {NgxPaginationModule} from 'ngx-pagination';

const PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
};

@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        DatepickerModule.forRoot(),
        ModalModule.forRoot(),
        NgxMyDatePickerModule.forRoot(),
        HttpModule,
        PerfectScrollbarModule.forRoot(PERFECT_SCROLLBAR_CONFIG),
        BrowserModule,
        TabsModule.forRoot(),
        NgxPaginationModule
    ],
    providers: [
        ApplyService,
        ConfigService,
    ],
    declarations: [
        ApplyComponent,
        PrintComponent,
        GradPrintComponent,
        GaPrintComponent,
        DormPrintComponent,
        SchedulePrintComponent,
        CafePrintComponent,
        AirportPickupPrintComponent,
        AcceptLetterPrintComponent
    ],
    exports: [
        ApplyComponent,
    ]
})
export class ApplyModule {
}
