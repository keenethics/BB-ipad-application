import { Injectable } from '@angular/core';
import { MeteorObservable } from 'meteor-rxjs';
import { BehaviorSubject, Observable } from 'rxjs';
import { OfflineDataProvider } from '../offline/offline-data-provider';
import { DataUpdates } from '../../../../both/data-management';

@Injectable()
export class DataUpdateInfo {
  private _info: BehaviorSubject<Info>;

  get info$(): Observable<Info> {
    return this._info.asObservable();
  }

  constructor(private _odp: OfflineDataProvider) {
    this._info = new BehaviorSubject(null);

    MeteorObservable.autorun().subscribe(() => {
      // We need this find in collection for meteor reactivity
      DataUpdates.find().fetch();
      this._odp.findIn(DataUpdates, {}, 'dataUpdates')
        .then((data) => {
          this._info.next(data[0]);
        });
    });
  }
}

interface Info {
  status: string;
  lastDataUpdateDate?: Date;
  lastDataUpdateText?: string;
  period?: string;
  fileNames?: {
    oxygenSubmission: string;
    evolutionReport: string;
    geocordinates: string;
  };
};
