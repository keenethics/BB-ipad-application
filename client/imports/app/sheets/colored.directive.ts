import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

@Directive({
  selector: '[colored]'
})
export class ColoredDirective {
  @Input('colored') colored: any;

  constructor(private elRef: ElementRef) { }

  ngOnChanges(changes: any) {
    if (changes.colored.currentValue) {
      (this.elRef.nativeElement as HTMLElement).classList.add('colored');
      this.setBackgroundColor(changes.colored.currentValue);
    }
  }

  setBackgroundColor(value: number) {
    let color = '';
    if (value <= -50) {
      color = 'red';
    } else if (value <= -25 && value > -50) {
      color = 'yellow';
    }

    (this.elRef.nativeElement as HTMLElement).classList.add(color || 'transparent');
  }
}
