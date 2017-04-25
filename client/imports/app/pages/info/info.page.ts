import { Component, ViewEncapsulation, OnDestroy } from '@angular/core';
import { DataUpdateInfo } from '../../data-management';
import { MeteorObservable } from 'meteor-rxjs';

import template from './info.page.html';
import style from './info.page.scss';

@Component({
  selector: 'info-page',
  template,
  styles: [style],
  encapsulation: ViewEncapsulation.None
})
export class InfoPage implements OnDestroy {
  public version: string;
  public info: any;
  private _subscr: any;

  constructor(public dataInfo: DataUpdateInfo) {
    this.version = (Meteor.settings.public as any).version;
    this._subscr = dataInfo.info$.subscribe(info => {
      this.info = info;
    });
  }

  ngOnDestroy() {
    if (this._subscr) this._subscr.unsubscribe();
  }
}
