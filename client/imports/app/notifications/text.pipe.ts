import { Pipe, PipeTransform } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { TextProvider } from './text-provider';

@Pipe({
  name: 'text',
  pure: false
})
export class TextPipe implements PipeTransform {
  constructor(private _textProvider: TextProvider) {}

  transform(key: string) {
    return this._textProvider.text(key);
  }
}

