import { Component, ViewRef } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';

import template from './home.page.html';

import { Authorization } from '../../authorization/authorization';

import { SigninPage } from '../signin/signin.page';

@Component({
  selector: 'home-page',
  template,
})
export class HomePage {
  constructor(
    public navCtrl: NavController,
    private menuCtrl: MenuController,
    private auth: Authorization
  ) {
  }

  ionViewCanEnter() {
    return this.auth.isLoggedIn();
  }

  menuToggle() {
    this.menuCtrl.toggle();
  }
}
