import { Component, ViewEncapsulation } from '@angular/core';
import { NavController } from 'ionic-angular';

import { HomePage } from '../home/home.page';
import { ProfileSettingsPage } from '../profile-settings/profile-settings.page';
import { UserManagementPage } from '../user-management/user-management.page';
import { SigninPage } from '../signin/signin.page';

import styles from './switchers.page.scss';
import template from './switchers.page.html';

@Component({
  selector: 'switchers-page',
  template,
  styles: [styles],
  encapsulation: ViewEncapsulation.None
})
export class SwitchersPage {
  public switchersState: any;

  constructor(private navCtrl: NavController) {}

  ionViewDidEnter() {
    this.switchersState = JSON.parse(localStorage.getItem('mapSettings'));
  }

  applySettingsToMap(switchersState: any) {
    localStorage.setItem('mapSettings', JSON.stringify(switchersState));
  }
};
