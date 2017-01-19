import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener
} from '@angular/core';

import template from './overview-sheet.component.html';
import styles from './sheets.styles.scss';

@Component({
  selector: 'overview-sheet',
  template,
  styles: [styles]
})
export class OverviewSheetComponent {
  @Output() onClickEmitter = new EventEmitter();
  @Output() onCloseEmitter = new EventEmitter();

  public openFactSheet() {
    this.onClickEmitter.emit();
  }

  public close() {
    this.onCloseEmitter.emit();
  }
}
