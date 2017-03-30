import { Component, ViewEncapsulation } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';

import styles from './preferences.page.scss';
import template from './preferences.page.html';

import { RolesController } from '../../authorization';

import {
  ProfileSettingsPage,
  UserManagementPage,
  SwitchersPage,
  UploadDataPage
} from '../index';

@Component({
  selector: 'preferences-page',
  template,
  styles: [styles],
  encapsulation: ViewEncapsulation.None
})
export class PreferencesPage {
  public pages: { icon: string, title: string, selector: string, component: any, guard: Function }[] = [];

  constructor(private roles: RolesController, private platform: Platform) {
    this.pages = [
      { icon: 'icon-switchers', title: 'PREFERENCES', selector: 'switchers-page', component: SwitchersPage, guard: () => true },
      { icon: 'icon-preferences', title: 'PROFILE SETTINGS', selector: 'profile-settings-page', component: ProfileSettingsPage, guard: () => true },
      {
        icon: 'icon-user', title: 'USER LIST', selector: 'user-management-page', component: UserManagementPage, guard: () => {
          return this.roles.userIsInRole(Meteor.userId(), 'Administrator');
        }
      },
      {
        icon: 'icon-upload', title: 'UPLOAD DATA', selector: 'upload-data-page', component: UploadDataPage,
        guard: () => (this.roles.userIsInRole(Meteor.userId(), ['Administrator', 'DataUpload']) && this.platform.is('core'))
      }
      // { icon: 'icon-types-and-units', title: 'TYPES AND UNITS', selector: 'types-and-units', component: null }
    ];
  }
};
