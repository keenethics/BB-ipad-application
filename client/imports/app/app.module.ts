import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule }      from '@angular/common';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { BrowserModule } from '@angular/platform-browser';

import { RouterModule } from '@angular/router';
import { AccountsModule } from './accounts';

import { AppComponent } from './app.component';
import { routes, ROUTES_PROVIDERS } from './app.routes';
import { D3MAP_DECLARATIONS } from './d3map';
import { HOME_DECLARATIONS } from './home';
import { AUTHGUARD_PROVIDERS } from './guards/index';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HomePage } from '../pages/home/home.page';
import { LoginPage } from '../pages/login/login.page';

import 'ionic-angular/css/ionic.min.css';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    IonicModule.forRoot(AppComponent),
    AccountsModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    AppComponent,
    ...D3MAP_DECLARATIONS,
    ...HOME_DECLARATIONS,
    HomePage,
    LoginPage
  ],
  bootstrap: [
    IonicApp
  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    ...AUTHGUARD_PROVIDERS,
    ...ROUTES_PROVIDERS
  ],
  entryComponents: [
    AppComponent,
    HomePage,
    LoginPage
  ]
})
export class AppModule { }