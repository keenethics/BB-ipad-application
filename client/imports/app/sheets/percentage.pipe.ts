import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'percentage'
})
export class PercentagePipe implements PipeTransform {
  transform(val: any): string {
    return parseFloat(val) ? val.toFixed(2) + '%' : 'n/a';
  }
}
