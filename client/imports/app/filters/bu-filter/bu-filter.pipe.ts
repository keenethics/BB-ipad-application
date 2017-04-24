import { Pipe, PipeTransform } from '@angular/core';
import { SumBusinessUnitsPipe } from '../../data-management';

@Pipe({
  name: 'buFilter'
})
export class BuFilterPipe implements PipeTransform {
  transform(data: any[], identifier: string) {
    const uniqueData = data.reduce((acc, item) => {
      const result = acc.filter((i: any) => (
        i.n2 === item.n2 &&
        i.market === item.market &&
        i.country === item.coountry &&
        i.city === item.city &&
        i.n3 === item.n3
      ));

      if (!result.length) acc.push(item);

      return acc;
    }, []);

    return new SumBusinessUnitsPipe().transform(uniqueData, (identifier as string).toLowerCase());
  }
}
