import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { RouterModule } from '@angular/router';
import { AccountsModule } from './accounts';

import { AppComponent } from './app.component';
import { routes, ROUTES_PROVIDERS } from './app.routes';
import { D3MAP_DECLARATIONS } from './d3map';
import { HOME_DECLARATIONS } from './home';
import { AUTHGUARD_PROVIDERS } from './guards/index';

import { FormsModule }   from '@angular/forms';

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    AccountsModule,
    FormsModule
  ],
  declarations: [
    AppComponent,
    ...D3MAP_DECLARATIONS,
    ...HOME_DECLARATIONS
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