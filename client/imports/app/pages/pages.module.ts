import { NgModule } from '@angular/core';

import { IonicModule } from 'ionic-angular';
import { MapModule } from '../map/map.module';
import { CommonAppModule } from '../common/common-app.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataManagementModule } from '../data-management';
import { SheetsModule } from '../sheets';

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
    CommonAppModule,
    DataManagementModule,
    SheetsModule
  ],
  declarations: PAGES,
  exports: PAGES,
  entryComponents: PAGES
})
export class PagesModule {

}