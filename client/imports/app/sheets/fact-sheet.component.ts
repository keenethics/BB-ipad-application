import {
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

// import template from './overview-sheet.component.html';
// import styles from './overview-sheet.component.scss';

@Component({
  selector: 'fact-sheet',
  template: 'FACTHEET',
})
export class FactSheetComponent {
  @Input() data: any[];
  @Output() onClickEmitter = new EventEmitter();
}
