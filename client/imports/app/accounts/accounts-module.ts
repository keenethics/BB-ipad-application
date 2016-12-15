import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {LoginComponent} from './login.component';
import {AuthGuard} from "./annotations";

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    LoginComponent
  ],
  providers: [
    AuthGuard
  ],
  exports: [
    LoginComponent
  ]
})
export class AccountsModule {
}
