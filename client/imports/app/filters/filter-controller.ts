import { Injectable, EventEmitter } from '@angular/core';
import { DataFilterComponent } from './data-filter/filter.component';
import { BehaviorSubject, Observable } from 'rxjs';

export class FilterController {
  private filterCmp: DataFilterComponent;
  private currentFilter = new BehaviorSubject(this.getFromStorage());

  constructor() {

  }

  get currentFilter$(): Observable<any> {
    return this.currentFilter.asObservable();
  }

  set currentFilter$(f) {
    this.currentFilter.next(f);
    const { category, activeFilters, filterQueryObject } = this.getFromStorage();
    this.saveToStorage(category, activeFilters, filterQueryObject, f);
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
}