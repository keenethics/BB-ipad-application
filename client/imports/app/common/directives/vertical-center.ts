import { Directive, HostListener, Renderer, ElementRef } from '@angular/core';
import { runAsync } from '../../../../../both/helpers/run-async';

@Directive({ selector: '[vertical-center]' })
export class VerticalCenter {
  constructor(private _element: ElementRef) {
    runAsync(() => this.setMarginTop());
  }

  @HostListener('resize')
  @HostListener('window:resize')
  setMarginTop() {
    if (this._element.nativeElement.parentElement) {
      const pHeight = this._element.nativeElement.parentElement.clientHeight;
      const eHeight = this._element.nativeElement.clientHeight;
      const marginTop = pHeight / 2 - eHeight / 2 - 20;
      this._element.nativeElement.style.marginTop = marginTop + 'px';
    }
  }
}
