import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import template from './home.page.html';

@Component({
  selector: 'home-page',
  template,
})
export class HomePage {

  constructor(public navCtrl: NavController) {
    
  }

}
