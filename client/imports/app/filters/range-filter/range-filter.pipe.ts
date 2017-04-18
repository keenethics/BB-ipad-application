import { Pipe, PipeTransform } from '@angular/core';
import { BusinessDataUnit } from '../../../../../both/data-management';

@Pipe({
  name: 'rangeFilter'
})
export class RangeFilterPipe implements PipeTransform {
  transform(data: BusinessDataUnit[], lower: number, upper: number, period: string = 'actual') {
    if (typeof (lower) === 'undefined' || typeof (upper) === 'undefined') return data;

    return data.filter(d => (d.periods[period] >= lower) && (d.periods[period] <= upper));
  }
}
