// Angular Imports
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { ModalModule, DatepickerModule, TooltipModule} from 'ngx-bootstrap';
import { SelectModule } from 'ng2-select';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';

// This Module's Components
import { ExportComponent } from './export.component';

// This Service's Provider
import { ExportService } from './shared/export.service';
import { ConfigService } from '../shared/config.service';
import { ReservationService } from '../reservation/shared/reservation.service';

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
        ExportComponent,
    ],
    exports: [
        ExportComponent,
    ],
    providers: [
        ExportService,
        ConfigService,
        ReservationService
    ]
})
export class ExportModule {

}
