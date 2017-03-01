import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import styles from './preferences.page.scss';
import template from './preferences.page.html';

import {
  ProfileSettingsPage,
  UserManagementPage,
  SwichersPage
} from '../index';

@Component({
  selector: 'preferences-page',
  template,
  styles: [styles]
})
export class PreferencesPage {
  public pages: {icon: string, title: string, selector: string, component: any }[] = [];

  constructor() {
    this.pages = [
      { icon: 'icon-preferences', title: 'PROFILE SETTINGS', selector: 'profile-settings-page', component: ProfileSettingsPage },
      { icon: 'icon-user', title: 'USER LIST', selector: 'user-management-page', component: UserManagementPage },
      { icon: 'icon-swichers', title: 'PREFERENCES', selector: 'swichers-page', component: SwichersPage }
    ];
  }
};
