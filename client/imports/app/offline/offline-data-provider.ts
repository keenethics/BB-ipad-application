import { Injectable } from '@angular/core';
import { MeteorObservable } from 'meteor-rxjs';
import { LocalCollectionsManager } from './local-collections-manager';

@Injectable()
export class OfflineDataProvider {
  constructor(private _lcManager: LocalCollectionsManager) { }

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
        res(this._lcManager.getCollection(mongoCollection).find(selector, options).fetch());
      }
    });
  }
}
