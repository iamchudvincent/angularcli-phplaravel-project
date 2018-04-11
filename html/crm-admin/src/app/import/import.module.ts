// Angular Imports
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { ModalModule, DatepickerModule, TooltipModule} from 'ngx-bootstrap';

// This Module's Components
import { ImportComponent } from './import.component';

// This Service's Provider
import { ImportService } from './shared/import.service';
import { ConfigService } from '../shared/config.service'

@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        ModalModule.forRoot()
    ],
    declarations: [
        ImportComponent,
    ],
    exports: [
        ImportComponent,
    ],
    providers: [
        ImportService,
        ConfigService
    ]
})
export class ImportModule {
    
}
