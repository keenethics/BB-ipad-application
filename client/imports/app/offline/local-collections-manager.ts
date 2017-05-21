import { Injectable } from '@angular/core';
import { MeteorObservable } from 'meteor-rxjs';
import { BusinessData } from '../../../../both/data-management/business-data.collection';

@Injectable()
export class LocalCollectionsManager {
  private _localCollections: Map<string, any> = new Map();

  constructor() {
    window.BusinessData = BusinessData;
    window.groundData = this.fetchToStorrage.bind(this);

    MeteorObservable.autorun().subscribe(() => {
      console.log({ ...Meteor.status() });
    });
  }

  fetchToStorrage() {
    return new Promise((res, rej) => {
      const sbscr = MeteorObservable.subscribe('businessData', {})
        .subscribe(() => {
          const data = BusinessData.find({}).fetch();
          const localCollections = createLocalCollections([BusinessData], this._localCollections);
          const lbd = localCollections[0];

          lbd.clear();

          data.forEach((bu) => {
            lbd.insert(bu);
          });

          window.LocalData = lbd;
          console.log(data, ' -> GROUNDED');
          sbscr.unsubscribe();
          res();
        });
    });
  }

  getCollection(mongoCollection: any) {
    const create = () => {
      const col = createLocalCollection(mongoCollection);
      this._localCollections.set(col._name, col);
      return col;
    };

    return this._localCollections.get(`local-${mongoCollection._name}`) || create();
  }
}


function createLocalCollections(mongoCollections: any[], localCollectionsMap: Map<string, any>) {
  return mongoCollections.map(c => {
    const lc = createLocalCollection(c);
    if (lc) {
      localCollectionsMap.set(lc._name, lc);
      return lc;
    } else {
      return localCollectionsMap.get(`local-${c._name}`);
    }
  });
};

function createLocalCollection(mongoCollection: any) {
  try {
    return new Ground.Collection(`local-${mongoCollection._name}`, { connection: null });
  } catch (err) {
    return null;
  }
}
