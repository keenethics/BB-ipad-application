import { NgModule } from '@angular/core';

import { IonicModule } from 'ionic-angular';
import { MapModule } from '../map/map.module';
import { CommonAppModule } from '../common/common-app.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataManagementModule } from '../data-management';
import { SheetsModule } from '../sheets';
import { SettingsModule } from '../settings';

import { HomePage } from './home/home.page';
import { SigninPage } from './signin/signin.page';
import { CreateUserPage } from './create-user/create-user.page';
import { UploadDataPage } from './upload-data/upload-data.page';
import { TestDataPage } from './test-data/test-data.page';
import { SwichersPage } from './swichers/swichers.page';
import { ProfileSettingsPage } from './profile-settings/profile-settings.page';
import { EditUserPage } from './edit-user/edit-user.page';
import { UserManagementPage } from './user-management/user-management.page';

const PAGES = [
  HomePage,
  SigninPage,
  CreateUserPage,
  UploadDataPage,
  TestDataPage,
  SwichersPage,
  ProfileSettingsPage,
  UserManagementPage,
  EditUserPage
];

@NgModule({
  imports: [
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    MapModule,
    CommonAppModule,
    DataManagementModule,
    SheetsModule,
    SettingsModule
  ],
  declarations: PAGES,
  exports: PAGES,
  entryComponents: PAGES
})
export class PagesModule {

}
