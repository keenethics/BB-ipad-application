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
export class RangeFilterComponent implements OnChanges {
  private _currentValue: IRangeValue;

  @Input() set currentValue(val: IRangeValue) {
    this._currentValue = Object.assign({}, val);
  }

  @Input() min: number;
  @Input() max: number;
  @Input() title: string;
  @Input() segments: number;

  @Output() onChange = new EventEmitter();

  @ViewChild(Range) range: Range;

  ngAfterViewInit() {
    this.range.createTicks();
  }

  ngOnChanges(changes: any) {
    if (changes.min && changes.min.currentValue) {
      this.range.createTicks();
      console.log(this.range);
    }
  }

  getStep() {
    const step = (this.max - this.min) / this.segments;
    return Math.floor(step) || 1;
  }

  private handleChange(r: Range) {
    this._currentValue = this.correctValue(r.value);
    this.onChange.emit(Object.assign(this._currentValue));
    this.range.updateBar();
  }

  private correctValue(val: IRangeValue): IRangeValue {
    if (val.upper > this.max - this.range.step) val.upper = this.max;
    if (val.lower < this.min + this.range.step) val.lower = this.min;

    return Object.assign({}, val);
  }
}
