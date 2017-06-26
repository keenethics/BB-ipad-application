import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DataProvider } from '../data-management/data-provider';
import { BusinessDataUnit } from '../../../../both/data-management';

import {
  Calculation,
  Selection,
  ICalculation,
  ISelection,
  TFilter
} from './abstarct';


@Injectable()
export class FilterController {
  private _calculationFilters = new Map<string, ICalculation<any, any>>();
  private _selectionFilters = new Map<string, ISelection<any, any>>();
  private _calcOrder: Function[];
  private _filteredData: BusinessDataUnit[];
  private _state: BehaviorSubject<{ filters: any, data: BusinessDataUnit[] }>;
  private _query: BehaviorSubject<any>;
  private _initialState: { filters: any, data: BusinessDataUnit[] };

  public get state$() {
    return this._state.asObservable();
  }

  public get query$() {
    return this._query.asObservable();
  }

  public get initialState() {
    return this._initialState;
  }

  constructor(
    filters: TFilter[],
    private _dataProvider: DataProvider,
    calcOrder: Function[] = makeCalcOrder(filters)
  ) {
    this.registerFilters(filters);
    setFiltersStateFromStorrage(filters);
    this._calcOrder = calcOrder;
    this._query = new BehaviorSubject(this._makeQueryObject());
    const initState = this._getState();
    this._state = new BehaviorSubject(initState);
    this._initialState = initState;
  }

  emit(filterType: Function | string, payload: any) {
    const filterName = getFilterName(filterType);
    const filter = this._calculationFilters.get(filterName) || this._selectionFilters.get(filterName);
    filter.setState(payload);
    this.filter();
  }

  registerFilters(f: TFilter | TFilter[]) {
    const register = (filter: TFilter) => {
      const filterName = filter.constructor.name;
      if (filter instanceof Calculation) {
        this._calculationFilters.set(filterName, filter as ICalculation<any, any>);
      } else if (filter instanceof Selection) {
        this._selectionFilters.set(filterName, filter as ISelection<any, any>);
      }
    };

    if (Array.isArray(f)) {
      f.forEach(filter => register(filter));
    } else {
      register(f);
    }
  }

  unregisterFilters(f: TFilter | TFilter[]) {
    const unregister = (filter: TFilter) => {
      const filterName = filter.constructor.name;
      if (filter instanceof Calculation) {
        this._calculationFilters.delete(filterName);
      } else if (filter instanceof Selection) {
        this._selectionFilters.delete(filterName);
      }
    };

    if (Array.isArray(f)) {
      f.forEach(filter => unregister(filter));
    } else {
      unregister(f);
    }
  }

  filter() {
    this._selectData()
      .then(selectedData => {
        this._filteredData = this._calculateData(selectedData as any);
        const state = this._getState();
        this._state.next(state);
        this._query.next(this._makeQueryObject());
        this.saveToStorrage();
      });
  }

  saveToStorrage() {
    const filters = this._getAllFilters();
    saveToStorrage(filters);
  }

  clearStorrage() {
    const filters = this._getAllFilters();
    clearStorrage(filters);
  }

  reset(exclude: any[] = []) {
    const filters = this._getAllFilters();

    filters.forEach((f) => {
      const filterType = f.constructor;
      const isToExclude = !!exclude.find((item) => (item === filterType) || (item === filterType.name));
      if (!isToExclude) f.reset();
    });
  }

  private _getAllFilters() {
    return [
      ...Array.from(this._calculationFilters.values()),
      ...Array.from(this._selectionFilters.values())
    ];
  }

  private _makeQueryObject() {
    const filters = Array.from(this._selectionFilters.values());
    return makeQueryObject(filters, {
      highLevelCategory: 'Landing point',
      resourceTypeKey: 'TotalInternals',
      n2: 'Total'
    });
  }

  private _getState() {
    const filters = this._getAllFilters();
    return {
      filters: getFiltersState(filters),
      data: this._filteredData || [] as BusinessDataUnit[]
    };
  }

  private _calculateData(data: BusinessDataUnit[]) {
    const filters = Array.from(this._calculationFilters.values());
    const state = this._getState();
    return calculateData(data, filters, this._calcOrder, state);
  }

  private _selectData() {
    const query = this._makeQueryObject();
    return this._dataProvider.getDataImmediately(query);
  }
}

function makeQueryObject(filters: ISelection<any, any>[], query: any = {}) {
  return filters.reduce((q, f) => {
    return { ...q, ...f.getQuery() };
  }, query);
}

function calculateData(data: BusinessDataUnit[], filters: ICalculation<any, any>[], order: Function[], state: any) {
  const sortedFilters = filters.sort((a, b) => order.indexOf(a.constructor) > order.indexOf(b.constructor) ? 1 : -1);
  return filters.reduce((data, f) => {
    return f.calc(data, state);
  }, data);
}

function getFiltersState(filters: TFilter[]) {
  return filters
    .reduce((s, f) => {
      return { ...s, ...f.getState() };
    }, {});
}

function makeCalcOrder(filters: TFilter[]) {
  return filters
    .filter(f => f instanceof Calculation)
    .map(f => f.constructor);
}

function getFilterName(f: Function | string) {
  return typeof (f) !== 'string' ? (f as Function).name : f;
}

function setFiltersStateFromStorrage(filters: TFilter[]) {
  filters.forEach(f => {
    const stateString = localStorage.getItem(`FilterController.${f.constructor.name}`);
    const s = (stateString === 'undefined') || !stateString ? null : JSON.parse(stateString);
    if (s) {
      const key = Object.keys(s)[0];
      f.initState(s[key]);
    }
  });
}

function saveToStorrage(filters: TFilter[]) {
  filters.forEach((f) => {
    localStorage.setItem(`FilterController.${f.constructor.name}`, JSON.stringify(f.getState()));
  });
}

function clearStorrage(filters: TFilter[]) {
  filters.forEach((f) => {
    localStorage.removeItem(`FilterController.${f.constructor.name}`);
  });
}
