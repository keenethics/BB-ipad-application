import { Component, ViewChild, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Platform, Nav, MenuController } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { MeteorObservable } from 'meteor-rxjs';

import { DataUpdates } from '../../../both/data-management/data-updates.collections';

import { Authorization } from './authorization/authorization';
import { DataProvider, SumBusinessUnitsPipe } from './data-management';
import { FilterController } from './filters';
import { ToastsManager } from '../app/common/toasts-manager';
// import { TextProvider } from './notifications';

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
    public dataProvider: DataProvider,
    private filterCtrl: FilterController
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
    this.initializeApp();
    this.filterCtrl.currentFilter$.subscribe((f: any) => {
      this.dataProvider.query(f, (arr: any[]) => {
        const uniqueData = arr.reduce((acc, item) => {
          const result = acc
            .filter((accItem: any) => accItem.n2 === item.n2)
            .filter((accItem: any) => accItem.market === item.market)
            .filter((accItem: any) => accItem.country === item.country)
            .filter((accItem: any) => accItem.city === item.city)
            .filter((accItem: any) => accItem.n3 === item.n3) as any[];

          if (!result.length) acc.push(item);

          return acc;
        }, []);

        return new SumBusinessUnitsPipe().transform(uniqueData, (f.identifier as string).toLowerCase());
      });
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
    });

    MeteorObservable.subscribe('dataUpdates').subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        const lastDataUpdate = DataUpdates.findOne().lastDataUpdateDate as Date;
        if (lastDataUpdate.toString() !== localStorage.getItem('lastDataUpdate')) {
          localStorage.setItem('lastDataUpdate', lastDataUpdate.toString());
          localStorage.removeItem('filters');
          this.toastCtrl.okToast('data_updated');
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
}
