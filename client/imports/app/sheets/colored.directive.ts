import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

@Directive({
  selector: '[colored]'
})
export class ColoredDirective {
  @Input('colored') colored: any;

  constructor(private elRef: ElementRef) {}

  ngOnChanges(changes: any) {
    if (changes.colored.currentValue) {
      this.setBackgroundColor(changes.colored.currentValue);
    }
  }

  setBackgroundColor(value: number) {
    let color = '';
    if (value <= -50) {
      color = 'rgb(255,164,169)';
    } else if (value <= -25 && value > -50) {
      color = 'rgb(255,201,0)';
    } else if (value <= -10 && value > -25) {
      color = 'rgb(255,243,154)';
    }
    (this.elRef.nativeElement as HTMLElement).style.backgroundColor = color;
  }
}
