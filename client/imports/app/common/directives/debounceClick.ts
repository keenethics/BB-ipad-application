import {
  Directive,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  OnChanges
} from '@angular/core';
import { Observable } from 'rxjs';


@Directive({
  selector: '[debounceClick]'
})
export class DebounceClick {
  @Input('delay') delay: number = 0;
  @Output('debounceClick') onClick = new EventEmitter();

  constructor(private elRef: ElementRef) { }

  ngOnChanges(changes: any) {
    if (changes.delay.currentValue) {
      const eventStream = Observable
        .fromEvent(this.elRef.nativeElement, 'click')
        .debounceTime(this.delay);

      eventStream.subscribe(() => this.onClick.emit());
    }
  }
}
