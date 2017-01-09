import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { RouterModule } from '@angular/router';
import { AccountsModule } from './accounts';

import { AppComponent } from './app.component';
import { routes, ROUTES_PROVIDERS } from './app.routes';
import { D3MAP_DECLARATIONS } from './d3map';
import { SITE_DECLARATIONS } from './site';
import { HOME_DECLARATIONS } from './home';
import { AUTHGUARD_PROVIDERS } from './guards/index';
import { USERS_DECLARATIONS } from './users';

import { UserPipe } from '../pipes/user.name.pipe'
import { FormsModule }   from '@angular/forms';
import { FileDropModule } from "angular2-file-drop";

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    AccountsModule,
    FormsModule,
    FileDropModule
  ],
  declarations: [
    AppComponent,
    UserPipe,
    ...D3MAP_DECLARATIONS,
    ...SITE_DECLARATIONS,
    ...HOME_DECLARATIONS,
    ...USERS_DECLARATIONS
  ],
  bootstrap: [
    AppComponent
  ],
  providers: [
    ...AUTHGUARD_PROVIDERS,
    ...ROUTES_PROVIDERS
  ],
})
export class AppModule {}