import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'percentage'
})
export class PercentagePipe implements PipeTransform {
  transform(val: any): string {
    return !isNaN(val) && isFinite(val) ? Math.round(val) + '%' : '';
  }
}
