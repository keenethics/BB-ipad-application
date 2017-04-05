import { Injectable } from '@angular/core';
import { MeteorObservable } from 'meteor-rxjs';
import { BehaviorSubject, Observable } from 'rxjs';
import { DataUpdates } from '../../../../both/data-management';

@Injectable()
export class DataUpdateInfo {
  private _info: BehaviorSubject<Info>;

  get info$(): Observable<Info> {
    return this._info.asObservable();
  }

  constructor() {
    const { status, lastDataUpdateDate } = DataUpdates.findOne() || {status: '', lastDataUpdateDate: null};
    this._info = new BehaviorSubject({
      status,
      updateDate: lastDataUpdateDate
    });

    MeteorObservable.subscribe('dataUpdates').subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        const { status, lastDataUpdateDate } = DataUpdates.findOne() || {status: '', lastDataUpdateDate: null};
        this._info.next({
          status,
          updateDate: lastDataUpdateDate
        });
      });
    });
  }
}

interface Info {
  status: string;
  updateDate: Date;
};
