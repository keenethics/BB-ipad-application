import { Component, ViewEncapsulation } from '@angular/core';
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
export class InfoPage {
  public version: string;

  constructor(public dataInfo: DataUpdateInfo) {
    this.version = (Meteor.settings.public as any).version;
  }
}
