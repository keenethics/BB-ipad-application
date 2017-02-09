import {
  Component,
  ViewRef,
  AfterViewInit,
  ViewChild,
  ViewEncapsulation,
  OnInit,
  OnDestroy,
  ViewContainerRef,
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { NavController, MenuController, Content } from 'ionic-angular';

import template from './home.page.html';
import styles from './home.page.scss';

import { Authorization } from '../../authorization/authorization';
import { DataProvider, DataFilterComponent } from '../../data-management';
import { SheetsController, OverviewSheetComponent, SheetsPortalComponent } from '../../sheets';
import { FilterController } from '../../data-management';

import { SigninPage } from '../signin/signin.page';
import { SwichersPage } from '../swichers/swichers.page';
import { ProfileSettingsPage } from '../profile-settings/profile-settings.page';

@Component({
  selector: 'home-page',
  template,
  styles: [styles],
  encapsulation: ViewEncapsulation.None
})
export class HomePage implements AfterViewInit {
  private dataSubscr: Subscription;
  public isZoomActive: boolean;
  public mapWidth: number = 0;
  public mapHeight: number = 0;
  public filters: any[] = [];
  public isMenuOpen = false;
  public mapSettings: any = {};
  public autoZoom = false;

  @ViewChild(Content) content: Content;
  @ViewChild(SheetsPortalComponent, { read: ViewContainerRef }) sheetsPortal: ViewContainerRef;

  constructor(
    private navCtrl: NavController,
    private menuCtrl: MenuController,
    private auth: Authorization,
    private dataProvider: DataProvider,
    private sheetsCtrl: SheetsController,
    private filterCtrl: FilterController
  ) {
  }

  ngAfterViewInit() {
    const { height, width } = this.content;
    this.mapWidth = width.bind(this.content);
    this.mapHeight = height.bind(this.content);
    this.filterCtrl.resetFilter();
  }

  ionViewCanEnter() {
    return this.auth.isLoggedIn();
  }

  ionViewDidEnter() {
    this.mapSettings = JSON.parse(localStorage.getItem('mapSettings')) ||
      { charts: false, scaling: false, labels: false, values: false };
  }

  menuToggle(id: string) {
    this.autoZoom = true;
    this.menuCtrl.toggle(id || '');
    this.isMenuOpen = !this.isMenuOpen;
  }

  showOverview(data: any) {
    this.sheetsCtrl.create(OverviewSheetComponent, this.sheetsPortal, data);
  }

  openPage(name: any) {
    switch (name) {
      case 'home': {
        this.autoZoom = false;
        this.filterCtrl.resetFilter(); return;
      };
      case 'swichers': this.navCtrl.setRoot(SwichersPage); return;
      case 'profile-settings': this.navCtrl.setRoot(ProfileSettingsPage); return;
      default: return;
    }
  }
}
