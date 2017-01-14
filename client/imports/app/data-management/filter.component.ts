import {
  Component,
  ViewEncapsulation,
  OnInit,
  OnChanges,
  Output,
  Input,
  EventEmitter
} from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import template from './filter.component.html';
import styles from './filter.component.scss';

import { DataProvider } from './data-provider';

@Component({
  selector: 'data-filter',
  template,
  styles: [styles],
  providers: [DataProvider],
  encapsulation: ViewEncapsulation.None
})
export class DataFilterComponent implements OnInit {
  private dataSubscr: Subscription;
  public filterForm: FormGroup;

  @Output() onFilterChange = new EventEmitter();

  constructor(
    private fromBuilder: FormBuilder,
    private dataProvider: DataProvider
  ) { }

  ngOnInit() {
    this.dataProvider.data$.subscribe((data: any) => {

    });
  }

  buildFilterForm(data: any) {
    this.fromBuilder.group({});
  }
}
