import { Injectable } from '@angular/core';
import { MeteorObservable } from 'meteor-rxjs';
import * as localForage from 'localforage';
import * as aes from 'crypto-js/aes';
import * as utf8 from 'crypto-js/enc-utf8';
import { BusinessData, UnitsTitles, DataUpdates } from '../../../../both/data-management';
import { AvailableCountries, MarketCountries } from '../../../../both/countries';

@Injectable()
export class StorageManager {
  fetchToStorage() {
    return new Promise((res, rej) => {
      MeteorObservable.call('data.fetch', {})
        .subscribe((data: any) => {

          localForage.setDriver(localForage.INDEXEDDB)
            .then(() => Promise.all(data.map((item: any) => localForage.setItem(item.name, { data: item.data }))))
            .then((result: any) => res(result));

        }, (err) => rej(err));
    });
  }

  localCollectionData(collection: Mongo.Collection<any>) {
    const c = collection as any;
    return new Promise((resolve, reject) => {
      localForage.getItem((c as any)._name)
        .then((storageCollectionData: any) => {
          if (!storageCollectionData) return resolve(c);

          if (storageCollectionData.data.length && (collection.find().count() !== storageCollectionData.data.length)) {
            const decryptedData = decryptData(storageCollectionData.data, Meteor.user().profile.token);

            decryptedData.forEach((item) => {
              if (!c._collection._docs._map[item._id]) {
                c._collection._docs._map[item._id] = item;
              }
            });
          }

          resolve(collection);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

function decryptData(data: any[], key: string) {
  return data.map((item) => JSON.parse(aes.decrypt(item, key).toString(utf8)));
}
