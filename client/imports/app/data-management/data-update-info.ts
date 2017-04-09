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
    this._info = new BehaviorSubject(DataUpdates.findOne());

    MeteorObservable.subscribe('dataUpdates').subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        this._info.next(DataUpdates.findOne());
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
    current: string;
    hist: string;
  };
};
