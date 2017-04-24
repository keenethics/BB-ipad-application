import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';
import { IRangeValue } from './range-value.model';

import template from './range-filter.component.html';
import style from './range-filter.component.scss';

@Component({
  selector: 'range-filter',
  encapsulation: ViewEncapsulation.None,
  styles: [style],
  template
})
export class RangeFilterComponent {
  private _currentValue: IRangeValue;

  @Input() set currentValue(val: IRangeValue) {
    this._currentValue = Object.assign({}, val);
  }

  @Input() min: number;
  @Input() max: number;
  @Output() onChange = new EventEmitter();

  handleChange(val: IRangeValue) {
    this.onChange.emit(Object.assign(this._currentValue));
  }
}
