import { Injectable, HostListener } from '@angular/core';

@Injectable()
export class WindowSize {
  private _isSmallDisplay: boolean;

  constructor() {
    this.registerEvents();
    this.setWindowSizeFlag(window.innerWidth);
  }

  get isSmallDisplay() {
    return this._isSmallDisplay;
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
    this.setWindowSizeFlag(event.target.innerWidth);
  }

  private setWindowSizeFlag(width: number) {
    this._isSmallDisplay = width <= 830;
  }
}
