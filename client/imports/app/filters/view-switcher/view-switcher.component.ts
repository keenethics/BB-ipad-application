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

import template from './view-switcher.component.html';
import styles from './view-switcher.component.scss';

import { FilterController } from '../filter-controller';

@Component({
  selector: 'view-switcher',
  styles: [styles],
  encapsulation: ViewEncapsulation.None,
  template
})
export class ViewSwitcherComponent {
  private category: string;

  constructor(private filterCtrl: FilterController) {
    try {
      this.category = filterCtrl.getFromStorage().category;
    } catch (e) {
      this.category = '';
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
