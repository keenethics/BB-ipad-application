import {
  Component,
  ViewRef,
  AfterViewInit,
  ViewChild,
  ViewEncapsulation,
  OnInit,
  OnDestroy,
  ViewContainerRef
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { NavController, MenuController, Content } from 'ionic-angular';

import template from './home.page.html';
import styles from './home.page.scss';

import { Authorization } from '../../authorization/authorization';
import { DataProvider, DataFilterComponent } from '../../data-management';
import { SheetsController, OverviewSheetComponent, SheetsPortalComponent } from '../../sheets';

import { SigninPage } from '../signin/signin.page';

@Component({
  selector: 'home-page',
  template,
  styles: [styles],
  encapsulation: ViewEncapsulation.None
})
export class HomePage implements AfterViewInit {
  private dataSubscr: Subscription;
  public mapWidth: number = 0;
  public mapHeight: number = 0;
  public filters: any[] = [];
  public isMenuOpen = false;

  @ViewChild(Content) content: Content;
  @ViewChild(SheetsPortalComponent, { read: ViewContainerRef }) sheetsPortal: ViewContainerRef;

  constructor(
    private navCtrl: NavController,
    private menuCtrl: MenuController,
    private auth: Authorization,
    private dataProvider: DataProvider,
    private sheetsCtrl: SheetsController
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

  menuToggle(id: string) {
    this.menuCtrl.toggle(id || '');
    this.isMenuOpen = !this.isMenuOpen;
  }

  showOverview(data: any) {
    this.sheetsCtrl.create(OverviewSheetComponent, this.sheetsPortal, data);
  }
}
