import {
  Component,
  ViewEncapsulation
} from '@angular/core';

import { FilterController } from '../filter-controller';

import template from './reset-filters-button.component.html';
import style from './reset-filters-button.component.scss';

@Component({
  selector: 'reset-filters-button',
  encapsulation: ViewEncapsulation.None,
  styles: [style],
  template
})
export class ResetFiltersButtonComponent {
  constructor(private _filter: FilterController) {

  }

  reset() {
    this._filter.resetFilter();
  }
}
