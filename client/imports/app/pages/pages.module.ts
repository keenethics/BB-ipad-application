import { NgModule } from '@angular/core';

import { IonicModule } from 'ionic-angular';
import { MapModule } from '../d3map/map.module';
import { CommonAppModule } from '../common/common-app.module';

import { HomePage } from './home/home.page';
import { SigninPage } from './signin/signin.page';
import { SignupPage } from './signup/signup.page';

const PAGES = [
  HomePage,
  SigninPage,
  SignupPage
];

@NgModule({
  imports: [
    IonicModule,
    MapModule,
    CommonAppModule
  ],
  declarations: PAGES,
  exports: PAGES,
  entryComponents: PAGES
})
export class PagesModule {

}