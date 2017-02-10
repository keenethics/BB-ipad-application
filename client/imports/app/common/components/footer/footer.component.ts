import {
  Component,
  EventEmitter,
  Output,
  Input
} from '@angular/core';

import template from './footer.component.html';

@Component({
  selector: 'footer',
  template
})
export class FooterComponent {
  @Input('activeButtonTitle') activeButtonTitle: string;
  @Output('onSelect') onSelect = new EventEmitter();

  selectPage(event: any) {
    this.onSelect.emit(event.value);
  }
}
