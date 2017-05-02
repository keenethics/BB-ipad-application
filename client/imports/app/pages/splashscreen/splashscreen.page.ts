import { Component, ViewEncapsulation } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';

import { Authorization } from '../../authorization/authorization';
import { HomePage } from '../home/home.page';
import { SigninPage } from '../signin/signin.page';

import styles from './splashscreen.page.scss';
import template from './splashscreen.page.html';

@Component({
  selector: 'splashscreen-page',
  template,
  styles: [styles],
  encapsulation: ViewEncapsulation.None
})
export class SplashscreenPage {

  constructor(
    private _navCtrl: NavController,
    private _auth: Authorization,
    private _plt: Platform
  ) {
    console.log(this._plt.is('ios'));
  }

  login() {
    this._navCtrl.setRoot(this._auth.isLoggedIn() ? HomePage : SigninPage, {}, {
      animate: true,
      direction: 'forward'
    });
  }
};
