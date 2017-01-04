import { Component } from '@angular/core';
import { MenuController } from 'ionic-angular';

import { ToastsManager } from '../../common/toasts-manager';
import { DataManager } from '../../data-management/data-manager';

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
    private dataManager: DataManager,
    private menuCtrl: MenuController
  ) {
    this.data = [];
  }

  ngOnInit() {
    this.dataManager.getAllData().subscribe((data) => {
      this.data = data;
      if ((!this.columnsNames) && data[0]) {
        this.columnsNames = Object.keys(data[0]);
      }
    });
  }

  menuToggle() {
    this.menuCtrl.toggle();
  }
};
