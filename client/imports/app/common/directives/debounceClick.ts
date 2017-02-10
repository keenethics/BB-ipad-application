import { Directive, HostListener, Input, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[debounceClick]'
})
export class DebounceClick {
  @Input('debounceTime') debounceTime: string | number;
  @Output('debounceClick') onClick = new EventEmitter();

  @HostListener('click', ['$event', 'option'])
  click(event: MouseEvent, option: string) {
    console.log(this.debounceTime, this.onClick, option);
    this.onClick.emit('Kiev');
    event.stopPropagation();
  };
}
