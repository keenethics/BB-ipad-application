import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sep'
})
export class SepPipe implements PipeTransform {
  transform(str: number | string) {
    if (!str) return '0';
    return str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
}
