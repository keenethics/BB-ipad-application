import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { BrowserModule } from '@angular/platform-browser';
import { File } from 'ionic-native';

import { AuthorizationModule } from './authorization/authorization.module';
import { DataManagementModule } from './data-management/data-management.module';
import { SharedModule } from './shared/shared.module';
import { NotificationsModule } from './notifications/notifications.module';
import { OfflineModule } from './offline/offline.module';
import { FilterModule } from './filter/fitler.module';

import Routes from './app.routes';

import { AppComponent } from './app.component';

import '../../stylesheets/global.scss';

@NgModule({
  imports: [
    BrowserModule,
    IonicModule.forRoot(AppComponent, {
      mode: 'ios'
    }, {
      links: Routes
    }),
    AuthorizationModule,
    DataManagementModule,
    SharedModule,
    OfflineModule,
    NotificationsModule,
    FilterModule
  ],
  declarations: [
    AppComponent,
  ],
  bootstrap: [
    IonicApp
  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    File
  ],
  entryComponents: [
    AppComponent
  ],
  exports: [
    SharedModule,
    NotificationsModule,
    OfflineModule
  ]
})
export class AppModule { }
