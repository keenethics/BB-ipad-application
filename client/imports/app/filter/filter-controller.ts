import { Injectable } from '@angular/core';
import { DataProvider } from '../data-management/data-provider';

import {
  CalculationFilter,
  SelectionFilter,
  IFilter,
  ICalculationFilter,
  ISelectionFilter
} from './abstarct';

@Injectable()
export class FilterControllerT {
  private _calculationFilters = new Map<string, ICalculationFilter<any>>();
  private _selectionFilters = new Map<string, ISelectionFilter<any>>();

  constructor(
    _filters: IFilter<any, any>[],
    private _dataProvider: DataProvider
  ) {
    // TODO NEXT ALL THINGS!!!
    // 1. Right types.
    // 2. Change name of 'use' function.
    // 3. Implement order in calculation.
    // 4. Implement state of all filters.
    // 5. Update state in stream.
    if (_filters) this.registerFilters(_filters);
  }

  registerFilters(f: IFilter<any, any> | IFilter<any, any>[]) {
    const register = (filter: IFilter<any, any>) => {
      const filterName = filter.constructor.name;

      if (filter instanceof CalculationFilter) {
        this._calculationFilters.set(filterName, filter as ICalculationFilter<any>);
      } else if (filter instanceof SelectionFilter) {
        this._selectionFilters.set(filterName, filter);
      }
    };

    if (Array.isArray(f)) {
      f.forEach(filter => register(filter));
    } else {
      register(f);
    }
  }

  // ?????
  use() {
    const query = this._makeQueryObject();
    this._dataProvider.getDataImmediately(query)
      .then((data: any[]) => {
        const filteredData = this._calculateData(data);
        console.log(filteredData);
      });
  }

  private _makeQueryObject() {
    const filters = Array.from(this._selectionFilters.values());
    return makeQueryObject(filters, { country: 'Poland' });
  }

  private _calculateData(data: any[]) {
    const filters = Array.from(this._calculationFilters.values());
    return calculateData(data, filters);
  }
}

function makeQueryObject(filters: ISelectionFilter<any>[], query: any = {}) {
  return filters.reduce((q, f) => {
    return { ...q, ...f.getQuery() };
  }, query);
}

function calculateData(data: any[], filters: ICalculationFilter<any>[]) {
  return filters.reduce((acc, f) => {
    return f.calc(acc);
  }, data);
}
