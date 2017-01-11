import { Component, ViewRef, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NavController, MenuController, Content } from 'ionic-angular';

import template from './home.page.html';
import styles from './home.page.scss';

import { Authorization } from '../../authorization/authorization';

import { SigninPage } from '../signin/signin.page';

@Component({
  selector: 'home-page',
  template,
  styles: [styles],
  encapsulation: ViewEncapsulation.None
})
export class HomePage implements AfterViewInit {
  public mapWidth: number = 0;
  public mapHeight: number = 0;
  @ViewChild(Content) content: Content;

  constructor(
    private navCtrl: NavController,
    private menuCtrl: MenuController,
    private auth: Authorization
  ) {
  }

  ngAfterViewInit() {
    const { height, width } = this.content;
    this.mapWidth = width.bind(this.content);
    this.mapHeight = height.bind(this.content);
  }
  ionViewCanEnter() {
    return this.auth.isLoggedIn();
  }

  menuToggle() {
    this.menuCtrl.toggle();
  }


}
