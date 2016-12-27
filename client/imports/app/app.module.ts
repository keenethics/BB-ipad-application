import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule }      from '@angular/common';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AuthorizationModule } from './authorization/authorization.module';
import { AppComponent } from './app.component';
import { D3MAP_DECLARATIONS } from './d3map';

import { HomePage } from '../pages/home/home.page';
import { LoginPage } from '../pages/login/login.page';

import 'ionic-angular/css/ionic.min.css';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    IonicModule.forRoot(AppComponent),
    FormsModule,
    ReactiveFormsModule,
    AuthorizationModule,
  ],
  declarations: [
    AppComponent,
    ...D3MAP_DECLARATIONS,
    HomePage,
    LoginPage
  ],
  bootstrap: [
    IonicApp
  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
  ],
  entryComponents: [
    AppComponent,
    HomePage,
    LoginPage
  ]
})
export class AppModule { }