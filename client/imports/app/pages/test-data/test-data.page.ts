import { Component } from '@angular/core';
import { MenuController } from 'ionic-angular';

import { ToastsManager } from '../../common/toasts-manager';
import { DataProvider } from '../../data-management';

import template from './test-data.page.html';

@Component({
  selector: 'test-data-page',
  template,
  styles: [`ion-col[width-7] {
                -webkit-flex: 0 0 7%;
                -ms-flex: 0 0 7%;
                flex: 0 0 7%;
                max-width: 7%;
            }`]
})
export class TestDataPage {
  public data: any;
  public columnsNames: string[];
  constructor(
    private dataProvider: DataProvider,
    private menuCtrl: MenuController
  ) {
    this.data = [];
  }

  ngOnInit() {
    this.dataProvider.data$.subscribe((data) => {
      this.data = data.map((item: any) => {
        delete item._id;
        return item;
      });
      if ((!this.columnsNames) && data[0]) {
        this.columnsNames = Object.keys(data[0]);
      }
    });

    this.dataProvider.query();
  }

  menuToggle() {
    this.menuCtrl.toggle();
  }
};
