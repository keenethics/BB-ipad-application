import { Injectable, HostListener } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class WindowSize {
  private _isSmallDisplay: boolean;
  private _onChangeSizeSubject = new BehaviorSubject(window.innerWidth);

  constructor() {
    this.registerEvents();
    this.setWindowSizeFlag(window.innerWidth);
  }

  get isSmallDisplay() {
    return this._isSmallDisplay;
  }

  get onChangeSize$() {
    return this._onChangeSizeSubject.asObservable();
  }

  checkSize() {
    this.setWindowSizeFlag(window.innerWidth);
  }

  private registerEvents() {
    window.addEventListener('resize', (event) => {
      this.onResize(event);
    });
  }

  private onResize(event: any) {
    this._onChangeSizeSubject.next(event.target.innerWidth);
    this.setWindowSizeFlag(event.target.innerWidth);
  }

  private setWindowSizeFlag(width: number) {
    this._isSmallDisplay = width <= 830;
  }
}
