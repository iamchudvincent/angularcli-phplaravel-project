// Angular Imports
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { ModalModule, DatepickerModule } from 'ngx-bootstrap';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';

// This Module's Components
import { LogsComponent } from './logs.component';

// This Service's Provider
import { LogsService } from './shared/log.service';
import { ConfigService } from '../shared/config.service';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    DatepickerModule.forRoot(),
    ModalModule.forRoot(),
    NgxMyDatePickerModule,
  ],
  declarations: [
    LogsComponent
  ],
  exports: [
    LogsComponent
  ],
    providers: [
        LogsService,
        ConfigService
    ]
})
export class LogsModule { }
