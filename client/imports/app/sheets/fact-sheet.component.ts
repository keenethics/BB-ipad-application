import {
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import template from './fact-sheet.component.html';
import styles from './sheets.styles.scss';

@Component({
  selector: 'fact-sheet',
  template,
  styles: [styles]
})
export class FactSheetComponent {
  @Input() selectedItem: any;
  @Output() onCloseEmitter = new EventEmitter();

  ngOnInit() {
    console.log(this.selectedItem);
  }

  public close() {
    this.onCloseEmitter.emit();
  }
}
