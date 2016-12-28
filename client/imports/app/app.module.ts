import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AuthorizationModule } from './authorization/authorization.module';
import { CommonAppModule } from './common/common-app.module';
import { PagesModule } from './pages/pages.module';
import { AppComponent } from './app.component';

import 'ionic-angular/css/ionic.min.css';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    IonicModule.forRoot(AppComponent),
    FormsModule,
    ReactiveFormsModule,
    PagesModule,
    AuthorizationModule
  ],
  declarations: [
    AppComponent,
  ],
  bootstrap: [
    IonicApp
  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
  ],
  entryComponents: [
    AppComponent
  ]
})
export class AppModule { }