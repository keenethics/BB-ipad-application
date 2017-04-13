import { Pipe, PipeTransform } from '@angular/core';
import { SumBusinessUnitsPipe } from '../../data-management';

@Pipe({
  name: 'buFilter'
})
export class BuFilterPipe implements PipeTransform {
  transform(data: any[], identifier: string) {
    const uniqueData = data.reduce((acc, item) => {
      const result = acc
        .filter((accItem: any) => accItem.n2 === item.n2)
        .filter((accItem: any) => accItem.market === item.market)
        .filter((accItem: any) => accItem.country === item.country)
        .filter((accItem: any) => accItem.city === item.city)
        .filter((accItem: any) => accItem.n3 === item.n3) as any[];

      if (!result.length) acc.push(item);

      return acc;
    }, []);

    return new SumBusinessUnitsPipe().transform(uniqueData, (identifier as string).toLowerCase());
  }
}
