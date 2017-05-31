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
import { IRangeValue, IRange } from '../range-filter/range.interface';

@Component({
  selector: 'main-filter',
  template,
  styles: [styles],
  providers: [DataProvider]
})
export class MainFilterComponent implements OnInit, OnDestroy {
  private _state: any;

  placesListState: IPlacesListState = {
    category: '',
    rangeValue: {
      lower: 0,
      upper: 0
    },
    places: []
  };

  range: IRange;
  searchValue = '';
  appliedPlaces: { label: string, categotry: string, unit: BusinessDataUnit[] }[] = [];

  get category() {
    return (this._state && this._state.filters.identifier) || '';
  }

  get placesList() {
    const { places, category } = this.placesListState;
    return mapToList(places, category);
  }

  constructor(
    private dataProvider: DataProvider,
    private filterCtrl: FilterController,
  ) {
    filterCtrl.state$.subscribe((s: any) => {
      this._state = s;
      this.range = s.filters.range;
      this.appliedPlaces = s.filters.places;
      this._updatePlacesListState(s);
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
      data: this.placesListState.places
    });
  }

  private _updatePlacesListState(s: any) {
    const { identifier, range, places } = s.filters;

    if (identifier !== this.placesListState.category) {
      this.placesListState.category = identifier;
      this.placesListState.places = s.data;
    }

    if (!isRangeValuesEqual(range.value, this.placesListState.rangeValue)) {
      this.placesListState.rangeValue = range.value;
      this.placesListState.places = s.data;
    }

    if (places.length === 0) {
      this.placesListState.places = s.data;
    }
  }
}

function isRangeValuesEqual(a: any, b: any) {
  return (a.lower === b.lower) && (a.upper === b.upper);
}

function mapToList(data: BusinessDataUnit[], identifier: string) {
  if (!data) return [];
  return data.map((u: any) => u[identifier.toLowerCase()]);
}

interface IPlacesListState {
  category: string;
  rangeValue: {
    upper: number;
    lower: number;
  };
  places: BusinessDataUnit[];
}
