import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import template from './header.component.html';

@Component({
  selector: 'header',
  template
})
export class HeaderComponent {
  @Input('isButtonEnabled') isButtonEnabled: boolean;
  @Output('onButtonClick') onButtonClick = new EventEmitter();

  emitButtonClick(menuTitle: string) {
    this.onButtonClick.emit(menuTitle);
  }
}
