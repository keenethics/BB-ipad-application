import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Platform, Nav, MenuController, ToastController } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { Authorization } from './authorization/authorization';

import { HomePage } from './pages/home/home.page';
import { SigninPage } from './pages/signin/signin.page';
import { CreateUserPage } from './pages/create-user/create-user.page';

import template from './app.component.html';
import styles from './app.component.scss';

@Component({
  selector: 'app',
  template,
  styles: [styles]
})
export class AppComponent {
  @ViewChild(Nav) navCtrl: Nav;

  userId: string;
  pages: Array<{title: string, component: any}>;

  private subscriptions: any[] = [];
  public rootPage = this.auth.isLoggedIn() ? HomePage : SigninPage;

  constructor(
    public platform: Platform,
    private auth: Authorization,
    private menuCtrl: MenuController,
    private toastCtrl: ToastController
  ) {
    this.pages = [
      { title: 'Home page', component: HomePage },
      { title: 'Create user', component: CreateUserPage }
    ];
  }

  ngOnInit() {
    this.initializeApp();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscr) => {
      subscr.unsubscribe();
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }

  openPage(page: any) {
    this.navCtrl.setRoot(page.component, {}, {animate: true, direction: 'forward'});
  }

  logout() {
    this.auth.logout().then(() => {
      this.navCtrl.setRoot(SigninPage);
    });
  }
}
