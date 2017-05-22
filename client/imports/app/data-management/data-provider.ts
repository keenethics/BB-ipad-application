import { Meteor } from 'meteor/meteor';
import { MeteorObservable } from 'meteor-rxjs';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { OfflineDataProvider } from '../offline/offline-data-provider';

import {
  BusinessData,
  BusinessDataUnit,
  ColumnNamesCollection
} from '../../../../both/data-management';

import { SumBusinessUnitsPipe } from './sum-bu.pipe';

@Injectable()
export class DataProvider {
  private _data: BehaviorSubject<BusinessDataUnit[]> = new BehaviorSubject([]);

  constructor(private _odp: OfflineDataProvider) { }

  get data$() {
    return this._data.asObservable();
  }

  query(queryObject: any = {}, calc?: any) {
    this._odp.findIn(BusinessData, queryObject, 'businessData')
      .then((data: any) => {
        if (calc) data = calc(data);
        this._data.next(data);
      });
  }

  getDataImmediately(queryObject: any = {}, projection?: any) {
    return this._odp.findIn(BusinessData, queryObject, 'businessData', projection);
  }
}
