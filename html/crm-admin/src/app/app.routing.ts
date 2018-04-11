import { Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ExportComponent } from './export/export.component';
import { ImportComponent } from './import/import.component';
import { ReservationComponent } from './reservation/reservation.component';
import { HeaderComponent } from './shared/header/header.component';
import { LogsComponent } from './logs/logs.component';
import { AnalysisComponent } from './analysis/analysis.component';
import { ApplyComponent } from './apply/apply.component';

export const appRoutes: Routes = [
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'export', component: ExportComponent
  },
  {
    path: 'import', component: ImportComponent
  },
  {
    path: 'reservation', component: ReservationComponent
  },
  {
    path: 'logs', component: LogsComponent
  },
  {
    path: 'analysis', component: AnalysisComponent
  },
  {
    path: 'student', component: ApplyComponent
  },
  {
    path: '**',
    redirectTo: '/login',
    pathMatch: 'full'
  }
];