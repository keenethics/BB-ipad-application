import { Injectable } from '@angular/core';
import { WindowSize } from '../../common/window-size';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class PreferencesTabbarController {
  private _isVisibleSubject = new BehaviorSubject(true);

  constructor(private _ws: WindowSize) {}

  public get isTabbarVisible$() {
    return this._isVisibleSubject.asObservable();
  }

  public toggleTabbar(value: boolean) {
    if (this._ws.isSmallDisplay) {
      this._isVisibleSubject.next(value);
    }
  }
}
