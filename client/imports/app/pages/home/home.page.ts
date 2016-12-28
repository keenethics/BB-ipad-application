import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Authorization } from '../../authorization/authorization';

import template from './home.page.html';

@Component({
  selector: 'home-page',
  template,
})
export class HomePage {

  constructor(public navCtrl: NavController, private auth: Authorization) {
  }

  ionViewCanEnter() {
    return new Promise((resolve, reject) => {
      if (this.auth.isLoggedIn()) {
        resolve();
      }

      reject('Please log in first.');
    });
  }

}
