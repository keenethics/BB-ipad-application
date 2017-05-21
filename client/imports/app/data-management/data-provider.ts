import { Meteor } from 'meteor/meteor';
import { MeteorObservable } from 'meteor-rxjs';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { LocalCollectionsManager } from '../offline/local-collections-manager';

import {
  BusinessData,
  BusinessDataUnit,
  ColumnNamesCollection
} from '../../../../both/data-management';

import { SumBusinessUnitsPipe } from './sum-bu.pipe';

@Injectable()
export class DataProvider {
  private _data: BehaviorSubject<BusinessDataUnit[]> = new BehaviorSubject([]);
  private _subscription: any;
  private _columnNames: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(private _lcManager: LocalCollectionsManager) {
    this.subscribeToPublications();
  }

  private subscribeToPublications() {
    MeteorObservable.subscribe('columnNames')
      .subscribe(() => {
        const columnNames = ColumnNamesCollection.findOne({});
        if (columnNames) {
          delete columnNames._id;
          this._columnNames.next(columnNames);
        }
      });
  }

  get data$() {
    return this._data.asObservable();
  }

  get columnNames$() {
    return this._columnNames.asObservable();
  }

  query(queryObject: any = {}, calc?: any) {
    if (isConnected()) {
      if (this._subscription) {
        this._subscription.unsubscribe();
      }
      this._subscription = MeteorObservable.subscribe('businessData', queryObject)
        .subscribe(() => {
          let data = BusinessData.find(queryObject).fetch();
          if (calc) data = calc(data);
          this._data.next(data);
        });
    } else {
      const lData = this._lcManager.getCollection(BusinessData);
      let data = lData ? lData.find(queryObject).fetch() : [];
      if (calc) data = calc(data);
      this._data.next(data);
    }
  }

  getDataImmediately(queryObject: any = {}, projection?: any) {
    return new Promise((resolve) => {
      if (isConnected()) {
        if (this._subscription) {
          this._subscription.unsubscribe();
        }
        this._subscription = MeteorObservable.subscribe('businessData', queryObject, projection)
          .subscribe(() => {
            resolve(BusinessData.find(queryObject).fetch());
          });
      } else {
        const lData = this._lcManager.getCollection(BusinessData);
        resolve(lData ? lData.find(queryObject).fetch() : []);
      }
    });
  }
}

function isConnected() {
  return Meteor.status().connected;
}
