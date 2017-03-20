import { Injectable, EventEmitter } from '@angular/core';
import { DataFilterComponent } from './data-filter/filter.component';
import { BehaviorSubject, Observable } from 'rxjs';
import { MeteorObservable } from 'meteor-rxjs';
import { AvailableCountries } from '../../../../both/countries/available-countries.collection';

export class FilterController {
  private filterCmp: DataFilterComponent;
  private currentFilter = new BehaviorSubject(this.getFromStorage());
  private availableCountries: string[] = [];
  public onChangeCategory = new EventEmitter();
  public onSelectCountry = new EventEmitter();

  constructor() {
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
      this.filterCmp.initFilters();
     // this.saveToStorage(category, activeFilters, filterQueryObject, f);
    }
  }

  setFilterComponetn(cmp: DataFilterComponent) {
    this.filterCmp = cmp;
  }

  resetFilter() {
    if (this.filterCmp) this.filterCmp.resetFilter();
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
