import { Injectable } from '@angular/core';
import { CalculationFilter, ICalculationFilter } from '../abstarct';

interface IRangeValue {
  lower: number;
  upper: number;
};

@Injectable()
export class RangeFilter extends CalculationFilter implements ICalculationFilter<IRangeValue> {
  constructor() {
    super();
  }
  // ?????
  use(p: IRangeValue) {
    return [] as any;
  }

  calc(data: any[]) {
    return data.filter(d => (d.periods.actual <= 1000) && (d.periods.actual >= 100));
  }
}
