import { Component, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';

import styles from './preferences.page.scss';
import template from './preferences.page.html';

import { RolesController, Authorization } from '../../authorization';
import { PreferencesTabbarController } from './preferences-tab-bar-controller';
import { runAsync } from '../../../../../both/helpers';

import {
  ProfileSettingsPage,
  UserManagementPage,
  SwitchersPage,
  UploadDataPage,
  InfoPage,
  FilterPage,
  SigninPage
} from '../index';

@Component({
  selector: 'preferences-page',
  template,
  styles: [styles],
  encapsulation: ViewEncapsulation.None
})
export class PreferencesPage implements AfterViewInit {
  public pages: { icon: string, title: string, segment: string, selector: string, component: any, guard: Function }[] = [];

  constructor(
    private roles: RolesController,
    private platform: Platform,
    private auth: Authorization,
    private navCtrl: NavController,
    private tabbarCtrl: PreferencesTabbarController
  ) {
    this.pages = [
      {
        icon: 'icon-switchers',
        title: 'PREFERENCES',
        segment: 'preferences',
        selector: 'switchers-page',
        component: SwitchersPage,
        guard: () => true
      },
      {
        icon: 'icon-preferences',
        title: 'PROFILE SETTINGS',
        segment: 'profile',
        selector: 'profile-settings-page',
        component: ProfileSettingsPage,
        guard: () => this._isOnline()
      },
      {
        icon: 'icon-user',
        title: 'USER LIST',
        segment: 'users',
        selector: 'user-management-page',
        component: UserManagementPage,
        guard: () => (this._isInRole(['Administrator']) && this._isOnline())
      },
      {
        icon: 'icon-upload',
        title: 'DATA',
        segment: 'data',
        selector: 'upload-data-page',
        component: UploadDataPage,
        guard: () => (this._isInRole(['Administrator', 'DataUpload']) && this._isOnline())
      },
      {
        icon: 'information-circle',
        title: 'INFO',
        segment: 'info',
        selector: 'info-page',
        component: InfoPage,
        guard: () => true
      }
    ];
  }

  ionViewCanEnter() {
    return this.auth.isLoggedIn() || !!runAsync(() => this.navCtrl.setRoot('Signin'));
  }

  ngAfterViewInit() {
    const tabbar = document.querySelector('preferences-page .tabbar') as HTMLDivElement;
    this.tabbarCtrl.isTabbarVisible$.subscribe((val: boolean) => {
      tabbar.style.display = val ? 'flex' : 'none';
    });
  }

  _isInRole(roles: string[]) {
    return this.roles.userIsInRole(Meteor.userId(), roles);
  }

  _isOnline() {
    return Meteor.status().connected;
  }
};
