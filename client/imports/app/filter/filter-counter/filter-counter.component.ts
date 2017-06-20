import {
  Component,
  Host,
  ViewEncapsulation,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { FilterController } from '../filter-controller';

import template from './filter-counter.component.html';
import style from './filter-counter.component.scss';

@Component({
  selector: 'filter-counter',
  template,
  styles: [style],
  encapsulation: ViewEncapsulation.None
})
export class FilterCounterComponent implements OnInit {
  public filterCount = 0;

  constructor(
    private _filterCtrl: FilterController
  ) { }

  ngOnInit() {
    this._filterCtrl.state$.map(s => s.filters).subscribe((s) => {
      this.filterCount = getFilterCount(s.places, s.range.value);
    });
  }
}

function getFilterCount(places: any[] = [], rangeValue: { upper: number, lower: number }) {
  const { upper, lower } = rangeValue;
  const rangeConunt = (upper !== 100000) || (lower !== 1) ? 1 : 0;
  return places.length + rangeConunt;
}
