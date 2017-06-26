import { Component, ViewChild, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Platform, Nav, MenuController } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { MeteorObservable } from 'meteor-rxjs';
import * as bowser from 'bowser';

import { DataUpdates } from '../../../both/data-management/data-updates.collections';

import { Authorization } from './authorization/authorization';
import { DataProvider, SumBusinessUnitsPipe } from './data-management';
import { ToastsManager } from '../app/common/toasts-manager';
import { WindowSize } from '../app/common/window-size';

import { HomePage } from './pages/home/home.page';
import { SigninPage } from './pages/signin/signin.page';
import { CreateUserPage } from './pages/create-user/create-user.page';
import { UploadDataPage } from './pages/upload-data/upload-data.page';
import { ProfileSettingsPage } from './pages/profile-settings/profile-settings.page';
import { UserManagementPage } from './pages/user-management/user-management.page';
import { SplashscreenPage } from './pages/splashscreen/splashscreen.page';

import template from './app.component.html';
import styles from './app.component.scss';
import theme from './theme.scss';


import 'intl';

declare const FilePicker: any;

@Component({
  selector: 'app',
  template,
  styles: [styles]
})
export class AppComponent {
  @ViewChild(Nav) navCtrl: Nav;

  userId: string;
  pages: Array<{ title: string, component: any }>;

  private subscriptions: any[] = [];
  public rootPage = SplashscreenPage;

  constructor(
    public platform: Platform,
    private auth: Authorization,
    private menuCtrl: MenuController,
    private toastCtrl: ToastsManager,
    private windowSize: WindowSize,
    public dataProvider: DataProvider
  ) {
    this.pages = [
      { title: 'Home page', component: HomePage },
      { title: 'Create user', component: CreateUserPage },
      { title: 'Upload file', component: UploadDataPage },
      { title: 'Profile setting', component: ProfileSettingsPage },
      { title: 'Uasers management', component: UserManagementPage }
    ];
  }

  ngAfterViewInit() {
    this._setBrowserClass();
    this.initializeApp();

    this.auth.user$.subscribe((u) => {
      this.navCtrl.setRoot('Signin');
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscr) => {
      subscr.unsubscribe();
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      StatusBar.overlaysWebView(true);
      StatusBar.styleLightContent();
      Splashscreen.hide();

      this.windowSize.onChangeSize$.subscribe((size) => {
        if (this.windowSize.isSmallDisplay) {
          StatusBar.hide();
        } else {
          StatusBar.show();
        }
      });
    });

    MeteorObservable.subscribe('dataUpdates').subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        const updates = DataUpdates.findOne();
        const lastDataUpdate = updates ? updates.lastDataUpdateDate as Date || '' : '';
        if (lastDataUpdate) {
          if (lastDataUpdate.toString() !== localStorage.getItem('lastDataUpdate')) {
            localStorage.setItem('lastDataUpdate', lastDataUpdate.toString());
            localStorage.removeItem('filters');
            this.toastCtrl.okToast('data_updated');
          }
        }
      });
    });
  }

  openPage(page: any) {
    this.navCtrl.setRoot(page.component, {}, { animate: true, direction: 'forward' });
  }

  logout() {
    this.auth.logout().then(() => {
      this.navCtrl.setRoot(SigninPage);
    });
  }

  private _setBrowserClass() {
    if (bowser.msie) {
      document.body.classList.add('ms');
    }
  }
}
