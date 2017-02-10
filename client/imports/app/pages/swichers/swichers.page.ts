import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { HomePage } from '../home/home.page';

import styles from './swichers.page.scss';
import template from './swichers.page.html';

@Component({
  selector: 'swichers-page',
  template,
  styles: [styles]
})
export class SwichersPage {
  public swichersState: any;
  constructor(private navCtrl: NavController) { }

  ionViewDidEnter() {
    this.swichersState = JSON.parse(localStorage.getItem('mapSettings'));
  }

  applySettingsToMap(swichersState: any) {
    localStorage.setItem('mapSettings', JSON.stringify(swichersState));
    this.navCtrl.setRoot(HomePage);
  }

  openPage(name: string) {
    switch (name) {
      case 'home': this.navCtrl.setRoot(HomePage); return;
    }
  }
};
