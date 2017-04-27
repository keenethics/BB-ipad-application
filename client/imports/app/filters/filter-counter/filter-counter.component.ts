import {
  Component,
  Host,
  ViewEncapsulation,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { FilterController } from '../filter-controller';
import { RangeFilterController } from '../range-filter/range-filter-controller';

import template from './filter-counter.component.html';
import style from './filter-counter.component.scss';

@Component({
  selector: 'filter-counter',
  template,
  styles: [style],
  encapsulation: ViewEncapsulation.None
})
export class FilterCounterComponent implements OnDestroy {
  public filtersCount: number;
  private _placesCount: number;
  private _isRangeUsed: boolean;
  private _placesSubscr: Subscription;
  private _rangeSubscr: Subscription;

  constructor(
    private _filter: FilterController,
    private _rangeFilterCtrl: RangeFilterController
  ) {

  }

  ngOnInit() {
    this._subscribe();
  }

  ngOnDestroy() {
    this._unsubscribe();
  }

  private setFilterCount() {
    if (this._isRangeUsed) {
      this.filtersCount = this._placesCount + 1;
    } else {
      this.filtersCount = this._placesCount;
    }
  };

  private _subscribe() {
    this._placesSubscr = this._filter.activeFilters$.subscribe((f: any[]) => {
      this._placesCount = f.length;
      this.setFilterCount();
    });

    this._rangeSubscr = this._rangeFilterCtrl.isUsed$.subscribe((val) => {
      this._isRangeUsed = val;
      this.setFilterCount();
    });
  }

  private _unsubscribe() {
    this._placesSubscr.unsubscribe();
    this._rangeSubscr.unsubscribe();
  }
}
