// Angular Imports
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// This Module's Components
import { ReservationComponent } from './reservation.component';
import { ReservationService } from './shared/reservation.service';
import { ConfigService } from '../shared/config.service';
import { AlertModule, ModalModule, DatepickerModule, PopoverModule, TooltipModule } from 'ngx-bootstrap';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';
import { PerfectScrollbarModule, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { SelectModule } from 'ng2-select';

const PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
};

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        ModalModule.forRoot(),
        DatepickerModule.forRoot(),
        AlertModule.forRoot(),
        TooltipModule.forRoot(),
        PopoverModule.forRoot(),
        NgxMyDatePickerModule,
        PerfectScrollbarModule.forRoot(PERFECT_SCROLLBAR_CONFIG),
        SelectModule
    ],
    declarations: [
        ReservationComponent,
    ],
    exports: [
        ReservationComponent,
    ],
    providers: [
        ReservationService,
        ConfigService
    ]
})
export class ReservationModule {

}
