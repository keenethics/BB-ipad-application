import {
  Component,
  ViewRef,
  AfterViewInit,
  ViewChild,
  ViewEncapsulation,
  OnInit,
  OnDestroy
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { NavController, MenuController, Content } from 'ionic-angular';

import template from './home.page.html';
import styles from './home.page.scss';

import { Authorization } from '../../authorization/authorization';
import { DataProvider } from '../../data-management';

import { SigninPage } from '../signin/signin.page';

@Component({
  selector: 'home-page',
  template,
  styles: [styles],
  encapsulation: ViewEncapsulation.None
})
export class HomePage implements AfterViewInit, OnInit, OnDestroy {
  private dataSubscr: Subscription;
  public mapWidth: number = 0;
  public mapHeight: number = 0;
  public markets: string[] = [];
  public countries: string[] = [];
  public cities: string[] = [];
  public data: any[] = [];

  @ViewChild(Content) content: Content;

  constructor(
    private navCtrl: NavController,
    private menuCtrl: MenuController,
    private auth: Authorization,
    private dataProvider: DataProvider
  ) {
  }

  ngOnInit() {
    this.dataSubscr = this.dataProvider.data$
      .subscribe((data: any[]) => {
        this.data = data;
        data.forEach((item) => {
          if (
            this.markets.indexOf(item.market) === -1 &&
            item.market !== 'Total Regions' &&
            item.market
          ) {
            this.markets.push(item.market);
          }

          if (
            this.countries.indexOf(item.country) === -1 &&
            item.country !== 'Total Market' &&
            item.country
          ) {
            this.countries.push(item.country);
          }

          if (
            this.cities.indexOf(item.city) === -1 &&
            item.city !== 'Total Country' &&
            item.city
          ) {
            this.cities.push(item.city);
          }
        });

        this.markets.sort();
        this.countries.sort();
        this.cities.sort();
      });
  }

  ngOnDestroy() {
    this.dataSubscr.unsubscribe();
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
