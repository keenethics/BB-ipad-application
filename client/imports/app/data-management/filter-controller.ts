import { Injectable } from '@angular/core';
import { DataFilterComponent } from './filter.component';

export class FilterController {
  private filterCmp: DataFilterComponent;

  setFilterComponetn(cmp: DataFilterComponent) {
    this.filterCmp = cmp;
  }

  resetFilter() {
    if (this.filterCmp) this.filterCmp.ngOnInit();
  }
}
