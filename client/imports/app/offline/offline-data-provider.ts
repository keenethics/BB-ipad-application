import { Injectable } from '@angular/core';
import { MeteorObservable } from 'meteor-rxjs';
import { LocalCollectionsManager } from './local-collections-manager';
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
              res(mongoCollection.find(selector, options).fetch());
            }, (err) => {
              sbscr.unsubscribe();
              rej(err);
            });
        } else {
          res(mongoCollection.find(selector, options).fetch());
        }
      } else {
        this._storageManager.localCollectionData(mongoCollection)
          .then((col: Mongo.Collection<any>) => {
            res(col.find(selector, options).fetch());
          });
      }
    });
  }
}
