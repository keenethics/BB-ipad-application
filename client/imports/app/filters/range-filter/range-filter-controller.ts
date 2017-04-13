import {
  Injectable
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IRangeValue } from './range-value.model';
import { DataProvider } from '../../data-management';
import { FilterController } from '../filter-controller';

@Injectable()
export class RangeFilterController {
  private _filterCategory: string;
  private _value: BehaviorSubject<IRangeValue>;
  private _rangeState: BehaviorSubject<any>;
  private _min: number = 0;
  private _max: number = 100;
  private _lower: number;
  private _upper: number;
  private _hadMaxRange: boolean = false;
  private _dataProvider: DataProvider = new DataProvider();

  constructor(
    private _filterCtrl: FilterController
  ) {
    const initVal = {
      lower: this._lower,
      upper: this._upper
    };

    this._value = new BehaviorSubject({ ...initVal });

    this._rangeState = new BehaviorSubject({
      min: 0,
      max: 100,
      value: { ...initVal }
    });

    this._filterCtrl.currentFilter$.subscribe((filter) => {
      if (this._filterCategory !== filter.identifier) {
        this.reset();
        this._filterCategory = filter.identifier;
      }
    });
  }

  get value$() {
    return this._value.asObservable();
  }

  get rangeState$() {
    this._getMaxRangeState();
    return this._rangeState.asObservable();
  }

  private _getMaxRangeState() {
    if (this._hadMaxRange) {
      this._nextRangeState();
    } else {
      this._filterCtrl.currentFilter$.subscribe((filter) => {
        this._dataProvider.getDataImmediately(filter)
          .then((data: any[]) => {
            const values = data.map(d => d.periods['actual']);
            this._min = Math.min(...values);
            this._max = Math.max(...values);
            this._lower = this._min;
            this._upper = this._max;
            this._hadMaxRange = true;
            this._nextRangeState();
          });
      });
    }
  }

  private _nextRangeState() {
    this._rangeState.next({
      min: this._min,
      max: this._max,
      value: {
        lower: this._lower,
        upper: this._upper
      }
    });
  }

  updateValue(val: IRangeValue) {
    const { lower, upper } = val;
    if (Number.isInteger(lower) && Number.isInteger(upper)) {
      this._lower = lower;
      this._upper = upper;
      this._value.next({ ...val });
    }
  }

  reset() {
    this._hadMaxRange = false;
    this._min = 0;
    this._max = 100;
    this._lower = undefined;
    this._upper = undefined;
    this._nextRangeState();
    this._value.next({ lower: this._lower, upper: this._upper });
  }
}
