import {
  Component,
  Host,
  ViewEncapsulation,
  OnDestroy
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
export class FilterCounterComponent implements OnDestroy {
  public filtersCount: number;
  private _subscr: Subscription;

  constructor(private _filter: FilterController) {
    this._subscr = _filter.activeFilters$.subscribe((f: any[]) => {
      this.filtersCount = f.length;
    });
  }

  ngOnDestroy() {
    this._subscr.unsubscribe();
  }
}
