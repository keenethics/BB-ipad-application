import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'objAsArr'
})
export class ObjectAsArray implements PipeTransform {
  transform(obj: any, keysAsValues: boolean): any[] {
    const keys = Object.keys(obj);

    if (keysAsValues) return keys;

    return keys.map((key: string) => {
      return obj[key];
    });
  }
}
