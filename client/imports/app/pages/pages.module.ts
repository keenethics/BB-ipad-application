import { NgModule } from '@angular/core';

import { IonicModule } from 'ionic-angular';
import { MapModule } from '../d3map/map.module';
import { CommonAppModule } from '../common/common-app.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HomePage } from './home/home.page';
import { SigninPage } from './signin/signin.page';
import { CreateUserPage } from './create-user/create-user.page';
import { UploadDataPage } from './upload-data/upload-data.page';
import { TestDataPage } from './test-data/test-data.page';
const PAGES = [
  HomePage,
  SigninPage,
  CreateUserPage,
  UploadDataPage,
  TestDataPage
];

@NgModule({
  imports: [
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    MapModule,
    CommonAppModule
  ],
  declarations: PAGES,
  exports: PAGES,
  entryComponents: PAGES
})
export class PagesModule {

}
