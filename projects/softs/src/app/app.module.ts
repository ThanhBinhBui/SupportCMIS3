import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app.routes';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { ShareModule } from './Share/share.module';
import { ConfigService } from '../app/config/services/config.service';
import { BnNgIdleService } from 'bn-ng-idle';
import { ScadaModule } from './scada/scada.module';

export function initializeApp(configService: ConfigService): any {
    return (): Promise<any> => {
        return configService.load();
    };
}

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        AppRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        CoreModule,
        ShareModule,
        ScadaModule
    ],
    declarations: [
        AppComponent        
    ],
    providers: [
        BnNgIdleService,
        ConfigService,
        { provide: APP_INITIALIZER, useFactory: initializeApp, deps: [ConfigService], multi: true },
        // { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        // { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
