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
      color = 'rgb(189,61,62)';
    } else if (value <= -25 && value > -50) {
      color = 'rgb(227,136,12)';
    } else if (value <= -10 && value > -25) {
      color = 'rgb(255,196,1)';
    }
    (this.elRef.nativeElement as HTMLElement).style.color = color;
  }
}
