import { Injectable } from '@angular/core';
import { DataFilterComponent } from './filter.component';

export class FilterController {
  private filterCmp: DataFilterComponent;

  setFilterComponetn(cmp: DataFilterComponent) {
    this.filterCmp = cmp;
  }

  resetFilter() {
    if (this.filterCmp) this.filterCmp.resetFilter();
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
