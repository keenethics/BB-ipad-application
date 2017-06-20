import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  ViewEncapsulation
} from '@angular/core';

import { BuTitlesProvider } from './bu-titles-provider';
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
  selectedBuTitles: string[] = [];

  constructor(
    public buTitlesProvider: BuTitlesProvider,
    private filterCtrl: FilterController
  ) {
    filterCtrl.state$.subscribe(s => {
      this.selectedBuTitles = s.filters.businessUnits;
    });
  }

  ngOnInit() { }

  isInSelected(v: string) {
    if (this.selectedBuTitles && (this.selectedBuTitles.indexOf('Total') !== -1)) return true;

    return isInSelected(v, this.selectedBuTitles || []);
  }


  select(v: string) {
    if (v === 'Total') {
      if (this.selectedBuTitles.indexOf('Total') !== -1) {
        this.filterCtrl.emit('BuFilterSelect', {
          unitsTitles: []
        });
      } else {
        this.filterCtrl.emit('BuFilterSelect', {
          unitsTitles: ['Total']
        });
      }
      return;
    }

    if (isInSelected(v, this.selectedBuTitles)) {
      this.filterCtrl.emit('BuFilterSelect', {
        unitsTitles: this.selectedBuTitles.filter(t => t !== v)
      });
    } else {
      this.filterCtrl.emit('BuFilterSelect', {
        unitsTitles: [...this.selectedBuTitles, v]
      });
    }
  }
}

function isInSelected(v: string, selected: string[]) {
  return selected.indexOf(v) !== -1;
};
