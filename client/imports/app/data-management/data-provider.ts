import { Meteor } from 'meteor/meteor';
import { MeteorObservable } from 'meteor-rxjs';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import 'rxjs/add/operator/startWith';

import { Data } from '../../../../both/data-management/data.collection';

@Injectable()
export class DataProvider {
  private dataSubscriber: Subscriber<any>;
  public isDataReady: boolean = false;
  public data$: Observable<any>;

  constructor() {
    this.initDataObservable();
  }

  private initDataObservable() {
    MeteorObservable.subscribe('allData')
      .subscribe(() => {
        this.isDataReady = true;
        const data = Data.find({}).fetch();
        this.dataSubscriber.next(data);
      });

    this.data$ = new Observable((sub: Subscriber<any>) => {
      this.dataSubscriber = sub;
    }).startWith([]);
  }

  // getAllData() {
  //   return MeteorObservable.subscribe('allData')
  //     .map(() => {
  //       return Data.find({}).fetch().map((item: any) => {
  //         delete item._id;
  //         return item;
  //       });
  //     });
  // }

  // getDataByQuery(query: any) {
  //   return MeteorObservable.subscribe('allData')
  //     .map(() => {
  //       return Data.find(query).fetch();
  //     });
  // }

  query(queryObject: any = {}) {
    const result = Data.find(queryObject).fetch();
    this.dataSubscriber.next(result);
  }
}
