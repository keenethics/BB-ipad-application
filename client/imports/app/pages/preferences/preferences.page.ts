import { Component, ViewEncapsulation } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';

import styles from './preferences.page.scss';
import template from './preferences.page.html';

import { RolesController } from '../../authorization';

import {
  ProfileSettingsPage,
  UserManagementPage,
  SwitchersPage,
  UploadDataPage,
  InfoPage,
  FilterPage
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
      {
        icon: 'icon-switchers',
        title: 'PREFERENCES',
        selector: 'switchers-page',
        component: SwitchersPage,
        guard: () => true
      },
      {
        icon: 'icon-preferences',
        title: 'PROFILE SETTINGS',
        selector: 'profile-settings-page',
        component: ProfileSettingsPage,
        guard: () => this._isOnline()
      },
      {
        icon: 'icon-user',
        title: 'USER LIST',
        selector: 'user-management-page',
        component: UserManagementPage,
        guard: () => (this._isInRole(['Administrator']) && this._isOnline())
      },
      {
        icon: 'icon-upload',
        title: 'DATA',
        selector: 'upload-data-page',
        component: UploadDataPage,
        guard: () => (this._isInRole(['Administrator', 'DataUpload']) && this._isOnline())
      },
      {
        icon: 'information-circle',
        title: 'INFO',
        selector: 'info-page',
        component: InfoPage,
        guard: () => true
      }
    ];
  }

  _isInRole(roles: string[]) {
    return this.roles.userIsInRole(Meteor.userId(), roles);
  }

  _isOnline() {
    return Meteor.status().connected;
  }
};
