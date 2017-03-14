import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sep'
})
export class ExcludePipe implements PipeTransform {
  transform(arr: any[] = [], exclude: any[] = []): any[] {
    return arr.filter(item => exclude.indexOf(item) === -1);
  }
}
