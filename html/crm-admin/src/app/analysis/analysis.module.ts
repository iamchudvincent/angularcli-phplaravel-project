// Angular Imports
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { ModalModule, DatepickerModule, TooltipModule} from 'ngx-bootstrap';
import { SelectModule } from 'ng2-select';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';

// This Module's Components
import { AnalysisComponent } from './analysis.component';
import { ReservationService } from '../reservation/shared/reservation.service';
import { AnalysisService } from './shared/analysis.service';
import { ConfigService } from '../shared/config.service';

@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        FormsModule,
        SelectModule,
        DatepickerModule.forRoot(),
        ModalModule.forRoot(),
        NgxMyDatePickerModule,
    ],
    declarations: [
        AnalysisComponent,
    ],
    exports: [
        AnalysisComponent,
    ],
    providers: [
        AnalysisService,
        ConfigService,
        ReservationService
    ]
})
export class AnalysisModule {

}
