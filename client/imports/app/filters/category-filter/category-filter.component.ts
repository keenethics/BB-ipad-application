import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  AfterViewInit,
  OnChanges
} from '@angular/core';

import template from './category-filter.component.html';
import styles from './category-filter.component.scss';

import { FilterController } from '../filter-controller';

@Component({
  selector: 'category-filter',
  styles: [styles],
  encapsulation: ViewEncapsulation.None,
  template
})
export class CategoryFilterComponent {
  private category: string;

  constructor(private filterCtrl: FilterController) {
    try {
      this.category = filterCtrl.getFromStorage().category;
    } catch (e) {
      this.category = 'global';
    }

    this.filterCtrl.onChangeCategory.subscribe((category: string) => {
      if (this.category !== category) {
        this.category = category;
      }
    });
  }

  select(event: any) {
    this.category = event.value;
    this.filterCtrl.emitChangeCategory(this.category);
  }
}
