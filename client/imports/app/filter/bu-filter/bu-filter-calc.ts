import { Injectable } from '@angular/core';
import { BusinessDataUnit } from '../../../../../both/data-management';
import { Calculation, ICalculation } from '../abstarct';

@Injectable()
export class BuFilterCalc extends Calculation implements ICalculation<void, void> {
  private _state: string[] = [];

  constructor() {
    super();
  }

  setState() { }

  getState() { }

  reset() { }

  calc(data: any[], state: any) {
    return calc(data, state.filters.identifier);
  };
}

function calc(data: any[], groupBy: string = 'Global') {
  const result = data.reduce((acc: Map<string, any>, item: BusinessDataUnit) => {
    const key = item[groupBy.toLowerCase()] || 0;
    const total = acc.get(key);
    if (!total) {
      acc.set(key, item);
    } else {
      const keys = Object.getOwnPropertyNames(total.periods);
      for (let i = 0; i < keys.length; i++) {
        const result = +total.periods[keys[i]] + +item.periods[keys[i]];
        if (isNaN(result)) return acc;
        total.periods[keys[i]] = result;
      }
      acc.set(key, total);
    }
    return acc;
  }, new Map()) as Map<string, any>;

  return Array.from(result.values());
}
