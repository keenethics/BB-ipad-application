import { Injectable } from '@angular/core';
import { Calculation, ICalculation } from '../abstarct';
import { IRangeValue, IRange } from './range.interface';

@Injectable()
export class RangeFilter extends Calculation implements ICalculation<IRange, { range: IRange }> {
  private _state: IRange = {
    min: undefined,
    max: undefined,
    value: {
      lower: undefined,
      upper: undefined
    }
  };

  constructor() {
    super();
  }

  setState(v: IRange) {
    this._state = { ...this._state, ...v };
  }

  getState() {
    return {
      range: this._state
    };
  }

  calc(data: any[]) {
    return calc(data, this._state.value);
  };
}

function calc(data: any[], value: IRangeValue) {
  const { lower, upper } = value;
  return data.filter(d => (d.periods.actual >= lower) && (d.periods.actual <= upper));
}
