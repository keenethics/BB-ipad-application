import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sep'
})
export class SepPipe implements PipeTransform {
  transform(str: number | string) {
    if (!str) return '';
    return str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
}
