import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'cut'
})
export class CutPipe implements PipeTransform {
  transform(str: string, count: number) {
    return str.substr(0, count || 2);
  }
}
