import { Meteor } from 'meteor/meteor';
import { MeteorObservable } from 'meteor-rxjs';
import { Injectable } from '@angular/core';

import { Data } from '../../../../both/data-management/data.collection';

@Injectable()
export class DataManager {
  constructor() {

  }

  uploadData(file: File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        Meteor.call('data.upload', {
          fileData: reader.result
        }, (err: Meteor.Error, res: string) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        });
      };

      reader.readAsText(file);
    });
  }

  getAllData() {
    return MeteorObservable.subscribe('allData')
      .map(() => {
        return Data.find({}).fetch().map((item: any) => {
          delete item._id;
          return item;
        });
      });
  }

  getDataByQuery(query: any) {
    return MeteorObservable.subscribe('allData')
    .map(() => {
      return Data.find(query).fetch();
    });
  }
}
