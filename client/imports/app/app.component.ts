import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Platform, Nav, MenuController, ToastController } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { Authorization } from './authorization/authorization';

import { HomePage } from './pages/home/home.page';
import { SigninPage } from './pages/signin/signin.page';
import { SignupPage } from './pages/signup/signup.page';

import template from './app.component.html';
import styles from './app.component.scss';

@Component({
  selector: 'app',
  template,
  styles: [styles]
})
export class AppComponent {
  @ViewChild(Nav) nav: Nav;

  userId: string;
  pages: Array<{title: string, component: any}>;

  private subscriptions: any[] = [];

  constructor(
    public platform: Platform,
    private auth: Authorization,
    private menuCtrl: MenuController,
    private toastCtrl: ToastController
  ) {
    this.pages = [
      { title: 'Home page', component: HomePage },
      { title: 'Sign up', component: SignupPage }
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
      this.checkUser();
    });
  }

  checkUser() {
    if (!this.userId) {
      this.nav.setRoot(SigninPage, {}, {animate: true, direction: 'forward'});
    }

    const userIdSubscr = this.auth.userId.subscribe((id) => {
      if (!id) {
        this.userId = null;
        this.nav.setRoot(SigninPage, {}, {animate: true, direction: 'forward'});
      } else {
        this.userId = id;
        this.nav.setRoot(HomePage, {}, {animate: true, direction: 'forward'});
      }
    });

    this.subscriptions.push(userIdSubscr);
  }

  openPage(page: any) {
    this.nav.setRoot(page.component);
  }

  logout() {
    this.auth.logout();
  }
}