import { Injectable } from '@angular/core';
import { MeteorObservable } from 'meteor-rxjs';
import { StorageManager } from './storage-manager';
import * as localForage from 'localforage';

@Injectable()
export class OfflineDataProvider {
  constructor(private _storageManager: StorageManager) { }

  public findIn(mongoCollection: Mongo.Collection<any>, selector: any, subscrName?: string, options?: any) {
    return new Promise((res, rej) => {
      if (Meteor.status().connected) {
        if (subscrName) {
          const sbscr = MeteorObservable.subscribe(subscrName, selector, options).subscribe(
            () => {
              sbscr.unsubscribe();
              const data = unique(mongoCollection.find(selector, options).fetch());
              res(data);
            }, (err) => {
              sbscr.unsubscribe();
              rej(err);
            });
        } else {
          const data = unique(mongoCollection.find(selector, options).fetch());
          res(data);
        }
      } else {
        this._storageManager.localCollectionData(mongoCollection)
          .then((col: Mongo.Collection<any>) => {
            res(unique(col.find(selector, options).fetch()));
          });
      }
    });
  }
}

function unique(arr: ({ _id: string })[]) {
  return arr.filter((item, index, self) => {
    return self.findIndex(i => i._id === item._id) === index;
  });
}
