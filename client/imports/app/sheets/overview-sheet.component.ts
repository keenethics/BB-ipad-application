import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener
} from '@angular/core';

import template from './overview-sheet.component.html';
import styles from './overview-sheet.component.scss';

@Component({
  selector: 'overview-sheet',
  template,
  styles: [styles]
})
export class OverviewSheetComponent {
  // @Input() data: any[];
  // @Output() onClickEmitter = new EventEmitter();
}
