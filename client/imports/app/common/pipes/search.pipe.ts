import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {
  transform(arr: string[], searchValue: string): any[] {
    const res = arr.filter((item) => {
      return item.toLowerCase()
        .indexOf(searchValue.toLowerCase()) !== -1;
    });
    return res;
  }
}
