import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sumBu'
})
export class SumBusinessUnitsPipe implements PipeTransform {
  transform(arr: any[], groupBy: string): any[] {
    const result = arr.reduce((acc: Map<string, any>, item) => {
      const key = item[groupBy] || 0;
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
}
