import { Injectable, EventEmitter } from '@angular/core';
import { MainFilterComponent } from './main-filter/main-filter.component';
import { BehaviorSubject, Observable } from 'rxjs';
import { MeteorObservable } from 'meteor-rxjs';
import { AvailableCountries } from '../../../../both/countries/available-countries.collection';

@Injectable()
export class FilterController {
  private currentFilter: BehaviorSubject<any>;
  private selectedOptions: BehaviorSubject<any[]>;
  private availableCountries: string[] = [];
  public onChangeCategory = new EventEmitter();
  public onSelectCountry = new EventEmitter();
  public onResetFilters = new EventEmitter();
  public onInitFilters = new EventEmitter();

  constructor() {
    const filters = this.getFromStorage();
    if (filters) {
      const { mapQueryObject, activeFilters } = filters;
      this.currentFilter = new BehaviorSubject(mapQueryObject);
      this.selectedOptions = new BehaviorSubject(activeFilters);
    } else {
      this.initFilters();
      this.currentFilter = new BehaviorSubject({
        identifier: 'Global',
        highLevelCategory: 'Landing point',
        resourceTypeKey: 'TotalInternals',
        n2: 'Total'
      });
      this.selectedOptions = new BehaviorSubject([]);
    }

    MeteorObservable.subscribe('available-countries').subscribe(() => {
      this.availableCountries = AvailableCountries.find({}).fetch().map((c: any) => c.name);
    });
  }

  get currentFilter$(): Observable<any> {
    return this.currentFilter.asObservable();
  }

  set currentFilter$(f) {
    this.currentFilter.next(f);
    try {
      const { category, activeFilters, filterQueryObject } = this.getFromStorage();
      this.saveToStorage(category, activeFilters, filterQueryObject, f);
    } catch (err) {
      this.onInitFilters.emit();
    }
  }

  set activeFilters$(f: any) {
    try {
      const { category, mapQueryObject, filterQueryObject } = this.getFromStorage();
      this.saveToStorage(category, f, filterQueryObject, mapQueryObject);
    } catch (err) {
      console.log(err);
    }
    this.selectedOptions.next(f);
  }

  get activeFilters$() {
    return this.selectedOptions.asObservable();
  }

  initFilters() {
    this.onInitFilters.emit();
  }

  resetFilter() {
    this.onResetFilters.emit();
    localStorage.removeItem('filters');
  }

  saveToStorage(category: string, activeFilters: any[], filterQueryObject: any, mapQueryObject: any) {
    const filters = {
      category,
      activeFilters,
      filterQueryObject,
      mapQueryObject
    };

    localStorage.setItem('filters', JSON.stringify(filters));
  }

  getFromStorage() {
    return JSON.parse(localStorage.getItem('filters'));
  }

  emitChangeCategory(category: string) {
    if (category === 'country' || category === 'city' || category === 'market' || category === 'global') {
      this.onChangeCategory.emit(category);
    }
  }

  selectCountry(names: string[]) {
    if (names.length) {
      const name = names.filter(c => this.availableCountries.indexOf(c) !== -1)[0];
      if (name) {
        this.onSelectCountry.emit(name);
      }
    }
  }
}
