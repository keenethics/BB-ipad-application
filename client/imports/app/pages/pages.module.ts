import { NgModule } from '@angular/core';

import { IonicModule } from 'ionic-angular';
import { MapModule } from '../map/map.module';
import { CommonAppModule } from '../common/common-app.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataManagementModule } from '../data-management';
import { SheetsModule } from '../sheets';
import { FilterModule } from '../filter/fitler.module';
import { SettingsModule } from '../settings';
import { OfflineModule } from '../offline/offline.module';

import { HomePage } from './home/home.page';
import { SigninPage } from './signin/signin.page';
import { CreateUserPage } from './create-user/create-user.page';
import { UploadDataPage } from './upload-data/upload-data.page';
import { TestDataPage } from './test-data/test-data.page';
import { SwitchersPage } from './switchers/switchers.page';
import { ProfileSettingsPage } from './profile-settings/profile-settings.page';
import { EditUserPage } from './edit-user/edit-user.page';
import { UserManagementPage } from './user-management/user-management.page';
import { PreferencesPage } from './preferences/preferences.page';
import { SplashscreenPage } from './splashscreen/splashscreen.page';
import { InfoPage } from './info/info.page';
import { FilterPage } from './filter/filter.page';

import { PreferencesTabbarController } from './preferences/preferences-tab-bar-controller';

import {
  FooterComponent,
  HeaderComponent,
  PaginationComponent
} from './components';

const PAGES = [
  HomePage,
  SigninPage,
  CreateUserPage,
  UploadDataPage,
  TestDataPage,
  SwitchersPage,
  ProfileSettingsPage,
  UserManagementPage,
  EditUserPage,
  PreferencesPage,
  SplashscreenPage,
  InfoPage,
  FilterPage
];

const COMPONENTS = [
  FooterComponent,
  HeaderComponent,
  PaginationComponent
];

const SERVICES = [
  PreferencesTabbarController
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
    SettingsModule,
    OfflineModule,
    FilterModule
  ],
  providers: SERVICES,
  declarations: [...PAGES, ...COMPONENTS],
  exports: [...PAGES, ...COMPONENTS],
  entryComponents: PAGES
})
export class PagesModule {

}
