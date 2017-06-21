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
  @Input() private category: string;
  @Output() private onChange = new EventEmitter();

  constructor() { }

  select(event: any) {
    this.onChange.emit(event.value);
  }
}
