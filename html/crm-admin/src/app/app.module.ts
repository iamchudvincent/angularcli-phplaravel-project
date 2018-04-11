import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { Ng2Webstorage } from 'ng2-webstorage';

import { AppComponent } from './app.component';

// App router
import { appRoutes } from './app.routing'

// App module
import { LoginModule } from './login/login.module';
import { ReservationModule } from './reservation/reservation.module';
import { ExportModule } from './export/export.module';
import { ImportModule } from './import/import.module';
import { LogsModule } from './logs/logs.module';
import { HeaderModule } from './shared/header/header.module';
import { AnalysisModule } from './analysis/analysis.module';
import { ApplyModule } from './apply/apply.module';

// App service
import { HeaderService } from './shared/header/shared/header.service';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    Ng2Webstorage,
    BrowserModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    LoginModule,
    ReservationModule,
    ExportModule,
    ImportModule,
    LogsModule,
    HeaderModule,
    ApplyModule,
    AnalysisModule
  ],
  providers: [
    HeaderService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
