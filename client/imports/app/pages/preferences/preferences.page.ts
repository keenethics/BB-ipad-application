import { Component, ViewEncapsulation } from '@angular/core';
import { NavController } from 'ionic-angular';

import styles from './preferences.page.scss';
import template from './preferences.page.html';

import { RolesController } from '../../authorization';

import {
  ProfileSettingsPage,
  UserManagementPage,
  SwichersPage
} from '../index';

@Component({
  selector: 'preferences-page',
  template,
  styles: [styles],
  encapsulation: ViewEncapsulation.None
})
export class PreferencesPage {
  public pages: {icon: string, title: string, selector: string, component: any, guard: Function }[] = [];

  constructor(private roles: RolesController) {
    this.pages = [
      { icon: 'icon-swichers', title: 'PREFERENCES', selector: 'swichers-page', component: SwichersPage, guard: () => true },
      { icon: 'icon-preferences', title: 'PROFILE SETTINGS', selector: 'profile-settings-page', component: ProfileSettingsPage, guard: () => true },
      { icon: 'icon-user', title: 'USER LIST', selector: 'user-management-page', component: UserManagementPage, guard: () => {
        return this.roles.userIsInRole(Meteor.userId(), 'Administrator');
      } },
      // { icon: 'icon-types-and-units', title: 'TYPES AND UNITS', selector: 'types-and-units', component: null }
    ];
  }
};
