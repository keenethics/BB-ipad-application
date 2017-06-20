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
import { runAsync } from '../../../../../both/helpers';

import { SigninPage } from '../signin/signin.page';
import { SwitchersPage } from '../switchers/switchers.page';
import { ProfileSettingsPage } from '../profile-settings/profile-settings.page';
import { UserManagementPage } from '../user-management/user-management.page';

import { FilterController } from '../../filter/filter-controller';
import { CountrySelector } from '../../filter/places-filter/country-selector';

@Component({
  selector: 'home-page',
  template,
  styles: [styles],
  encapsulation: ViewEncapsulation.None
})
export class HomePage implements AfterViewInit {
  public isZoomActive: boolean;
  public mapWidth: number = 0;
  public mapHeight: number = 0;
  public filters: any[] = [];
  public isMenuOpen = false;
  public mapSettings: any = {};
  public autoZoom = false;
  public onDeselectMarkerEmiter = new EventEmitter();
  public dataRange: any;
  public filterIdentifier: string = 'Global';

  private _state: any;

  @ViewChild(Content) content: Content;
  @ViewChild(SheetsPortalComponent, { read: ViewContainerRef }) sheetsPortal: ViewContainerRef;

  constructor(
    private navCtrl: NavController,
    private menuCtrl: MenuController,
    private auth: Authorization,
    private dataProvider: DataProvider,
    private sheetsCtrl: SheetsController,
    private filterCtrl: FilterController,
    private countrySelector: CountrySelector
  ) {
    this.mapSettings = JSON.parse(localStorage.getItem('mapSettings')) ||
      { charts: false, scaling: false, labels: false, values: false };
  }

  ngOnInit() {
    this.filterCtrl.state$.subscribe(s => this._state = s);
    this.filterCtrl.filter();
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
    return this.auth.isLoggedIn() || !!runAsync(() => this.navCtrl.setRoot('Signin'));
  }

  menuToggle(id: string) {
    this.autoZoom = true;
    this.menuCtrl.toggle(id || '');
    this.isMenuOpen = !this.isMenuOpen;
  }

  showOverview(data: any) {
    this.sheetsCtrl.create(OverviewSheetComponent, this.sheetsPortal, data);
  }

  changeCategory(category: string) {
    this.filterCtrl.emit('CategoryFilter', category);
  }

  selectCountry(country: string[]) {
    this.countrySelector.getPayloadObject(country)
      .then((payload) => {
        this.filterCtrl.emit('PlacesFilter', payload);
      });
  }
}
