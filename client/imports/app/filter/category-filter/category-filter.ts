import { Injectable } from '@angular/core';
import { SelectionFilter, ISelectionFilter } from '../abstarct';
@Injectable()
export class CategoryFilter extends SelectionFilter implements ISelectionFilter<string> {
  constructor() {
    super();
  }
  // ?????
  use(a: string) {
    console.log(a);
  }

  getQuery() {
    return { identifier: 'Country' };
  }
}
