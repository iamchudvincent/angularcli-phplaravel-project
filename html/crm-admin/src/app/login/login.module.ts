// Angular Imports
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

// This Module's Components
import { LoginComponent } from './login.component';

// This Service's Provider
import { LoginService } from './shared/login.service';
import { ConfigService } from '../shared/config.service'

@NgModule({
    imports: [        
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule
    ],
    declarations: [
        LoginComponent,
    ],
    exports: [
        LoginComponent,
    ],
    providers: [
        LoginService,
        ConfigService
    ]
})
export class LoginModule {

}
