import {
  Component,
  ViewRef,
  AfterViewInit,
  ViewChild,
  ViewEncapsulation,
  OnInit,
  OnDestroy,
  ViewContainerRef,
  EventEmitter
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { NavController, MenuController, Content } from 'ionic-angular';

import template from './home.page.html';
import styles from './home.page.scss';

import { Authorization } from '../../authorization/authorization';
import { DataProvider } from '../../data-management';
import { SheetsController, OverviewSheetComponent, SheetsPortalComponent } from '../../sheets';
import { FilterController, RangeFilterController } from '../../filters';

import { SigninPage } from '../signin/signin.page';
import { SwitchersPage } from '../switchers/switchers.page';
import { ProfileSettingsPage } from '../profile-settings/profile-settings.page';
import { UserManagementPage } from '../user-management/user-management.page';

@Component({
  selector: 'home-page',
  template,
  styles: [styles],
  encapsulation: ViewEncapsulation.None
})
export class HomePage implements AfterViewInit {
  private rangeSubscr: Subscription;
  public isZoomActive: boolean;
  public mapWidth: number = 0;
  public mapHeight: number = 0;
  public filters: any[] = [];
  public isMenuOpen = false;
  public mapSettings: any = {};
  public autoZoom = false;
  public onDeselectMarkerEmiter = new EventEmitter();
  public dataRange: any;

  @ViewChild(Content) content: Content;
  @ViewChild(SheetsPortalComponent, { read: ViewContainerRef }) sheetsPortal: ViewContainerRef;

  constructor(
    private navCtrl: NavController,
    private menuCtrl: MenuController,
    private auth: Authorization,
    private dataProvider: DataProvider,
    private sheetsCtrl: SheetsController,
    private filterCtrl: FilterController,
    private rangeCtrl: RangeFilterController
  ) {
    this.mapSettings = JSON.parse(localStorage.getItem('mapSettings')) ||
      { charts: false, scaling: false, labels: false, values: false };
  }

  ngOnInit() {
    this.rangeSubscr = this.rangeCtrl.value$.subscribe((v) => {
      this.dataRange = v;
    });
  }

  ngOnDestroy() {
    this.rangeSubscr.unsubscribe();
  }

  ngAfterViewInit() {
    const { height, width } = this.content;
    this.mapWidth = width.bind(this.content);
    this.mapHeight = height.bind(this.content);
    this.sheetsCtrl.onSheetDestroy.subscribe(() => {
      this.onDeselectMarkerEmiter.emit();
    });
  }

  ionViewCanEnter() {
    return this.auth.isLoggedIn();
  }

  menuToggle(id: string) {
    this.autoZoom = true;
    this.menuCtrl.toggle(id || '');
    this.isMenuOpen = !this.isMenuOpen;
  }

  showOverview(data: any) {
    this.sheetsCtrl.create(OverviewSheetComponent, this.sheetsPortal, data);
  }

  resetFilters(page: string) {
    if (page === 'home') {
      this.autoZoom = false;
      this.filterCtrl.resetFilter(); return;
    }
  }

  selectCountry(countryNames: any) {
    this.filterCtrl.selectCountry(countryNames);
  }
}
