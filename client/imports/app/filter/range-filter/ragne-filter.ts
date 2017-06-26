import { Injectable } from '@angular/core';
import { BusinessDataUnit } from '../../../../../both/data-management';
import { Calculation, ICalculation } from '../abstarct';
import { IRangeValue, IRange } from './range.interface';

@Injectable()
export class RangeFilter extends Calculation implements ICalculation<{ range: IRange, data?: BusinessDataUnit[] }, { range: IRange }> {
  private _state: IRange = {
    min: 1,
    max: 100000,
    value: {
      lower: 1,
      upper: 100000
    }
  };

  constructor() {
    super();
  }

  setState(payload: { range: IRange, data?: BusinessDataUnit[] }) {
    const range = payload.range;

    this._state = { ...this._state, ...range };
  }

  getState() {
    return {
      range: this._state
    };
  }

  initState(state: any) {
    this._state = state;
  }

  calc(data: any[]) {
    const filteredData = calc(data, this._state.value);
    // this.setState({ range: getMinAndMaxValues(filteredData) as IRange });
    return filteredData;
  };

  reset() {
    this._state = {
      min: 1,
      max: 100000,
      value: {
        lower: 1,
        upper: 100000
      }
    };
  }
}

function calc(data: any[], value: IRangeValue) {
  const { lower, upper } = value;
  return data.filter(d => (d.periods.actual >= lower) && (d.periods.actual <= upper));
}

function getMinAndMaxValues(data: BusinessDataUnit[]) {
  const values = data
    .map(d => d.periods.actual)
    .filter(d => d) as number[];

  const min = Math.min(...values);
  const max = Math.max(...values);

  return {
    min,
    max
  };
}
