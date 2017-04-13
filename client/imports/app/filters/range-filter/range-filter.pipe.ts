import { Pipe, PipeTransform } from '@angular/core';
import { BusinessDataUnit } from '../../../../../both/data-management';

@Pipe({
  name: 'rangeFilter'
})
export class RangeFilterPipe implements PipeTransform {
  constructor() { }

  transform(data: BusinessDataUnit[], period?: string) {
    period = period || 'actual';

    const values = data.map(d => d.periods[period]);
    // const min = Math.min(...values);
    // const max = Math.max(...values);
    const min = 100;
    const max = 7000;

    return data.filter(d => (d.periods[period] >= min) && (d.periods[period] <= max));
  }
}
