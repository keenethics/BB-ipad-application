import {
  Component,
  ViewEncapsulation,
  OnInit,
  OnChanges,
  AfterViewInit,
  Output,
  Input,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

import template from './main-filter.component.html';
import styles from './main-filter.component.scss';

import { DataProvider } from '../../data-management';
import { BusinessDataUnit } from '../../../../../both/data-management';
import { FilterController } from '../filter-controller';
import { RangeFilterController } from '../range-filter/range-filter-controller';
import { RangeFilterPipe } from '../range-filter/range-filter.pipe';
// import { IRangeValue } from '../range-filter/range-value.model';

import { FilterControllerT } from '../../filter/filter-controller';
import { IRangeValue, IRange } from '../../filter/range-filter/range.interface';

@Component({
  selector: 'main-filter',
  template,
  styles: [styles],
  providers: [DataProvider]
})
export class MainFilterComponent implements OnInit, OnDestroy {
  @Input() data: BusinessDataUnit[];
  @Input() currentQuery: any;

  private _state: any;
  range: IRange;
  searchValue = '';
  appliedPlaces: { label: string, categotry: string, unit: BusinessDataUnit[] }[] = [];

  get category() {
    return (this._state && this._state.filters.identifier) || '';
  }

  get availableUnits() {
    return (this._state && this._state.data.map((u: any) => u[this._state.filters.identifier.toLowerCase()])) || [];
  }

  constructor(
    private dataProvider: DataProvider,
    private filterCtrl: FilterControllerT,
    private rangeFilterCtrl: RangeFilterController
  ) {
    filterCtrl.state$.subscribe(s => {
      this._state = s;
      this.range = s.filters.range;
      this.appliedPlaces = s.filters.places;
      console.log(s);
      window.FC = filterCtrl;
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  changeCategory(category: any) {
    this.filterCtrl.emit('CategoryFilter', category.value);
  }

  setRange(r: IRangeValue) {
    this.filterCtrl.emit('RangeFilter', { range: { value: r } });
  }

  addPlace(place: string) {
    if (!this.appliedPlaces.find(p => p.label === place)) {
      this.setPlaces(place);
    }
  }

  removePlace(place: string) {
    if (this.appliedPlaces.find(p => p.label === place)) {
      this.setPlaces(place);
    }
  }

  setPlaces(place: string) {
    this.filterCtrl.emit('PlacesFilter', {
      label: place,
      category: this.category,
      data: this._state.data
    });
  }
}
