import {
  Component,
  ViewEncapsulation,
  OnInit,
  OnChanges,
  AfterViewInit,
  Output,
  Input,
  EventEmitter
} from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import template from './filter.component.html';
import styles from './filter.component.scss';

import { DataProvider } from './data-provider';
import { BusinessDataUnit, ColumnNames } from '../../../../both/data-management';

@Component({
  selector: 'data-filter',
  template,
  styles: [styles],
  providers: [DataProvider],
  encapsulation: ViewEncapsulation.None
})
export class DataFilterComponent implements OnInit {
  private businessData: BusinessDataUnit[];
  private filters: string[] = [];
  private query: any;

  public options: string[] = [];
  public searchValue = '';
  public category = 'market';
  public isFilterVisible = false;

  @Input() data: BusinessDataUnit[];
  @Output() onFilterChange = new EventEmitter();

  ngOnInit() {
    this.changeCategory();
  }

  ngOnChanges(changes: any) {
    if (changes.data.currentValue.length > 0 && this.options.length === 0) {
      this.options = this.getOptions(this.category);
    }
  }

  getOptions(key: string) {
    const res = this.data
      .reduce((acc, item) => {
        if (item[key] && acc.indexOf(item[key]) === -1) {
          acc.push(item[key]);
          return acc;
        } else {
          return acc;
        }
      }, []).sort();
    return res;
  }

  changeCategory() {
    const query = {
      n2: 'Total',
      identifier: '',
      highLevelCategory: 'Landing point',
      period: 'Actuals'
    };

    switch (this.category) {
      case 'market': query.identifier = 'Market'; break;
      case 'country': query.identifier = 'Country'; break;
      case 'city': query.identifier = 'City'; break;
    }

    this.query = query;
    this.filters = [];
    this.options = [];
    this.onFilterChange.emit(query);
  }

  selectOption(option: string) {
    if (option && this.filters.indexOf(option) === -1) {
      this.filters.push(option);
    }
    // const query = Object.assign({}, this.query);
    this.query[this.category] = { $in: this.filters };

    switch (this.category) {
      case 'market': this.query.identifier = 'Country'; break;
      case 'country': this.query.identifier = 'City'; break;
      case 'city': this.query.identifier = 'City'; break;
    }

    this.onFilterChange.emit(this.query);
  }

  removeOption(option: string) {
    if (option) {
      this.filters = this.filters.filter(item => item !== option);
    }

    if (this.filters.length === 0) {
      delete this.query[this.category];
      switch (this.category) {
        case 'market': this.query.identifier = 'Market'; break;
        case 'country': this.query.identifier = 'Country'; break;
        case 'city': this.query.identifier = 'City'; break;
      }
    } else {
      this.query[this.category] = { $in: this.filters };
    }

    this.onFilterChange.emit(this.query);
  }
}
