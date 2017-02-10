import { Meteor } from 'meteor/meteor';
import { MeteorObservable } from 'meteor-rxjs';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import {
  BusinessData,
  BusinessDataUnit,
  ColumnNames,
  ColumnNamesCollection
} from '../../../../both/data-management';

@Injectable()
export class DataProvider {
  private _data: BehaviorSubject<BusinessDataUnit[]> = new BehaviorSubject([]);
  private _subscription: any;
  private _columnNames: BehaviorSubject<ColumnNames> = new BehaviorSubject(null);

  constructor() {
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

  query(queryObject: any = {}) {
    const result = BusinessData.find(queryObject).fetch();

    if (this._subscription) {
      this._subscription.unsubscribe();
    }

    this._subscription = MeteorObservable.subscribe('businessData', queryObject)
      .subscribe(() => {
        const data = BusinessData.find(queryObject).fetch();
        this._data.next(data);
      });
  }
}
