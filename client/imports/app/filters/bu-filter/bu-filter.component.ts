import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  ViewEncapsulation
} from '@angular/core';

import { BuFilter } from './bu-filter';
import { FilterController } from '../filter-controller';

import template from './bu-filter.component.html';
import styles from './bu-filter.component.scss';

@Component({
  selector: 'bu-filter',
  template,
  styles: [styles],
  encapsulation: ViewEncapsulation.None
})
export class BuFilterComponnet {
  private queryObject: any;
  private buTitles: string[];

  constructor(
    public filter: BuFilter,
    private filterCtrl: FilterController
  ) {
  }

  ngOnInit() {
    this.filterCtrl.currentFilter$.subscribe((qObj) => {
      this.queryObject = qObj;
      this.queryObject.n3 = 'Total';
    });

    this.filter.buTitles$.subscribe((titles) => {
      this.buTitles = titles;
    });
  }

  checkToggle(title: string) {
    const state = this.isInQueryObject(title);
    if (state) {
      this.select({ title });
    } else {
      this.select({ title });
    }
  }

  select(item: { title: any }) {
    if (this.isInQueryObject(item.title)) {
      if (item.title === 'Total') this.queryObject.n2 = { $in: [] };

      if (this.queryObject.n2 === 'Total') {
        this.queryObject.n2 = { $in: this.buTitles.map((t: any) => t.value).filter((t) => t !== item.title && t !== 'Total') };
      } else {
        this.queryObject.n2 = { $in: this.queryObject.n2.$in.filter((t: any) => t !== item.title) };
      }
    } else {
      if (item.title === 'Total') {
        this.queryObject.n2 = 'Total';
      } else {
        this.queryObject.n2.$in.push(item.title);

        if (this.queryObject.n2.$in.length === 10) {
          this.queryObject.n2 = 'Total';
        }
      }
    }

    this.filterCtrl.currentFilter$ = this.queryObject;
  }

  isInQueryObject(title: string | string[]) {
    if (this.queryObject.n2 === 'Total') return true;

    const titlesArr = Array.isArray(title) ? title : [title];
    for (let i = 0; i < titlesArr.length; i++) {
      if (this.queryObject.n2.$in) {
        return (this.queryObject.n2.$in.indexOf(titlesArr[i]) !== -1);
      } else {
        return this.queryObject.n2 === titlesArr[i];
      }
    }
    return false;
  }
}
