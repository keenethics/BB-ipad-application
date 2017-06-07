import { Injectable } from '@angular/core';
import { MeteorObservable } from 'meteor-rxjs';
import { BusinessData, UnitsTitles, DataUpdates } from '../../../../both/data-management';
import { AvailableCountries, MarketCountries } from '../../../../both/countries';


@Injectable()
export class LocalCollectionsManager {
  private _localCollections: Map<string, any> = new Map();

  fetchToStorrage() {
    const fetchPromises: Promise<any>[] = [];

    const collections = [
      [BusinessData, 'businessData', {}],
      [UnitsTitles, 'unitsTitles', {}],
      [DataUpdates, 'dataUpdates', {}],
      [AvailableCountries, 'available-countries', {}],
      [MarketCountries, 'market-countries', { _id: { $in: ['GCHN', 'NAM', 'LAT', 'INDIA', 'APJ', 'MEA', 'EUROPE'] } }]
    ];

    const localCollections = createLocalCollections(collections, this._localCollections);

    localCollections.forEach((lc) => {
      fetchPromises.push((fetchCollection as any)(...lc));
    });

    return Promise.all(fetchPromises);
  }

  getCollection(mongoCollection: any) {
    return new Promise((res) => {
      const create = () => {
        const col = createLocalCollection(mongoCollection);
        this._localCollections.set(col._name, col);
        return col;
      };

      let collection = this._localCollections.get(`local-${mongoCollection._name}`);

      if (collection) {
        res(collection);
      } else {
        collection = create();
        collection.addListener('loaded', () => {
          res(collection);
        });
      }
    });
  }
}

function createLocalCollections(mongoCollections: (string | Mongo.Collection<any> | any)[][], localCollectionsMap: Map<string, any>): (string | Mongo.Collection<any> | any)[][] {
  return mongoCollections.map(c => {
    const mCol = c[0] as any;

    const lc = createLocalCollection(mCol);
    if (lc) {
      localCollectionsMap.set(lc._name, lc);
      return [...c, lc];
    } else {
      return [...c, localCollectionsMap.get(`local-${mCol._name}`)];
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

function fetchCollection(collection: Mongo.Collection<any>, subscrName: string, query: any, localCollection: any) {
  return new Promise((res, rej) => {
    const sbscr = MeteorObservable.subscribe(subscrName, query)
      .subscribe((err) => {
        const collectionData = collection.find({}).fetch();
        localCollection.clear();

        collectionData.forEach((item) => {
          localCollection.insert(item);
        });

        sbscr.unsubscribe();
        res();
      }, (err) => {
        rej(err);
      });
  });
}