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
  template,
})
export class RangeFilterComponent {
  private _currentValue: IRangeValue;

  // TODO: Generate from real data
  private _values: number[] = [1, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 150, 200, 250, 300, 350, 400, 450, 500, 600, 700, 800, 900, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 6000, 7000, 8000, 9000, 10000, 15000, 20000];

  @ViewChild(Range) private _range: Range;

  @Input() set currentValue(val: IRangeValue) {
    this._currentValue = this._valueToIndex(val);
  }

  @Input() min: number;
  @Input() max: number;
  @Input() title: string;

  @Output() onChange = new EventEmitter();

  public get lowerVal() {
    return this._range && this._range.value && !isInitialValue(this._range.value) ?
      this._indexToValue(this._range.value).lower : '';
  }

  public get upperVal() {
    return this._range && this._range.value && !isInitialValue(this._range.value) ?
      this._indexToValue(this._range.value).upper : '';
  }

  private _handleChange({ value }: Range) {
    const filterValue = this._indexToValue(value);
    this.onChange.emit(filterValue);
  }

  private _indexToValue({ lower, upper }: IRangeValue) {
    return {
      lower: this._values[lower],
      upper: this._values[upper]
    };
  }

  private _valueToIndex({ lower, upper }: IRangeValue) {
    const lowerClosest = getClosestNumber(lower, this._values);
    const upperClosest = getClosestNumber(upper, this._values);

    return {
      lower: this._values.indexOf(lowerClosest),
      upper: this._values.indexOf(upperClosest)
    };
  }
}

function getClosestNumber(num: number, arr: number[]) {
  let mid;
  let lower = 0;
  let upper = arr.length - 1;

  while (upper - lower > 1) {
    mid = Math.floor((lower + upper) / 2);
    if (arr[mid] < num) {
      lower = mid;
    } else {
      upper = mid;
    }
  }

  if (num - arr[lower] <= arr[upper] - num) {
    return arr[lower];
  }

  return arr[upper];
}

function isInitialValue({ lower, upper }: IRangeValue) {
  return lower === 1 && upper === 1;
}
