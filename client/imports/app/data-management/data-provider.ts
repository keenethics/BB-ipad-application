import { Meteor } from 'meteor/meteor';
import { MeteorObservable } from 'meteor-rxjs';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Data } from '../../../../both/data-management/data.collection';

@Injectable()
export class DataProvider {
  private _data: BehaviorSubject<any[]> = new BehaviorSubject([]);

  constructor() {
    this.initDataObservable();
  }

  private initDataObservable() {
    MeteorObservable.subscribe('allData')
      .subscribe(() => {
        const data = Data.find({}).fetch();
        this._data.next(data);
      });
  }

  get data$() {
    return this._data.asObservable();
  }

  query(queryObject: any = {}) {
    const result = Data.find(queryObject).fetch();
    this._data.next(result);
  }
}
