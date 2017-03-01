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

  constructor(
    public filter: BuFilter,
    private filterCtrl: FilterController
  ) {
  }

  ngOnInit() {
    this.filterCtrl.currentFilter$.subscribe((qObj) => {
      this.queryObject = qObj;
    });
  }

  checkToggle(title: string) {
    const state = this.isInQueryObject(title);
    if (state) {
      this.select({ title, value: false });
    } else {
      this.select({ title, value: true });
    }
  }

  select(item: { title: any, value: boolean }) {
    if (item.title === 'Total') {
      this.queryObject.n2 = 'Total';
      this.filterCtrl.currentFilter$ = this.queryObject;
      return;
    }

    if (item.value) {
      // if (this.queryObject.n2.$in) {
      //   if (Array.isArray(item.title)) {
      //     item.title.forEach((t) => {
      //       if (this.queryObject.n2.$in.indexOf(t) === -1) {
      //         this.queryObject.n2.$in.push(t);
      //       }
      //     });
      //   } else {
      //     if (this.queryObject.n2.$in.indexOf(item.title) === -1) {
      //       this.queryObject.n2.$in.push(item.title);
      //     }
      //   }
      // } else {
      this.queryObject.n2 = { $in: Array.isArray(item.title) ? [...item.title] : [item.title] };
      // }
    } else {
      if (Array.isArray(item.title)) {
        item.title.forEach((t: any) => {
          this.queryObject.n2.$in = this.queryObject.n2.$in.filter((i: string) => i !== t);
        });
      } else {
        this.queryObject.n2.$in = this.queryObject.n2.$in.filter((i: string) => i !== item.title);
      }

      if (!this.queryObject.n2.$in.length) this.queryObject.n2 = 'Total';
    }
    this.filterCtrl.currentFilter$ = this.queryObject;
  }

  isInQueryObject(title: string | string[]) {
    const titlesArr = Array.isArray(title) ? title : [title];

    for (let i = 0; i < titlesArr.length; i++) {
      if (this.queryObject.n2.$in) {
        return (this.queryObject.n2.$in.indexOf(titlesArr[i]) !== -1);
      } else {
        return this.queryObject.n2 === titlesArr[i];
      }
    }
  }
}
