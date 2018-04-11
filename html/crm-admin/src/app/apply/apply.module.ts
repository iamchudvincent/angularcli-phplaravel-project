import {BrowserModule} from "@angular/platform-browser";
import {HttpModule} from "@angular/http";
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ApplyComponent} from "./apply.component";
import {PrintComponent} from "./print/print.component";
import {ApplyService} from "./share/apply.service";
import {FormsModule} from "@angular/forms";

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
        CommonModule,
        DatepickerModule.forRoot(),
        ModalModule.forRoot(),
        NgxMyDatePickerModule,
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
        PrintComponent
    ],
    exports: [
        ApplyComponent,
    ]
})
export class ApplyModule {
}
