import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ViewChild,
  OnChanges,
  AfterViewInit
} from '@angular/core';
import { Range } from 'ionic-angular';
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
  @Input() title: string;
  @Input() segments: number;

  @Output() onChange = new EventEmitter();

  private handleChange(r: Range) {
    this.onChange.emit(Object.assign(this._currentValue));
  }
}
