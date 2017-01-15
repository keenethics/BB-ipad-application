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
  private labels: any;
  private businessData: BusinessDataUnit[];
  private filter: any = {};

  public isFilterVisible = false;

  @Input() exludedFields: string[];
  @Output() onFilterChange = new EventEmitter();

  constructor(
    private fromBuilder: FormBuilder,
    private dataProvider: DataProvider,
  ) { }

  ngOnInit() {
    if (!this.exludedFields) {
      this.exludedFields = [
        '_id',
        'value',
        'longitude',
        'latitude'
      ];
    }

    this.dataProvider.columnNames$.subscribe((names) => {
      this.buildFilterForm(names);
    });

    this.dataProvider.data$.subscribe((data) => {
      this.businessData = data;
      this.setFilterDefaults();
    });
  }

  buildFilterForm(columnNames: ColumnNames) {
    if (!columnNames) return;
    this.labels = {};
    Object.keys(columnNames).forEach((key) => {
      if (this.exludedFields.indexOf(key) === -1) {
        this.labels[key] = columnNames[key];
      }
    });
  }

  getOptions(key: string) {
    return this.businessData
      .reduce((acc, item) => {
        if (item[key] && acc.indexOf(item[key]) === -1) {
          acc.push(item[key]);
          return acc;
        } else {
          return acc;
        }
      }, []).sort();
  }

  handleSelectChange() {
    const query = this.buildQuery(this.filter);
    this.onFilterChange.emit(query);
  }

  buildQuery(filter: any) {
    const query = {};
    Object.keys(filter)
      .forEach((key) => {
        if (filter[key].length > 0) {
          query[key] = { $in: filter[key] };
        }
      });
    return query;
  }

  setFilterDefaults() {
    this.filter = {
      n2: ['Total MN'],
      market: ['EUROPE', 'MEA'],
      country: ['Total Market']
    };

    const query = this.buildQuery(this.filter);
    this.onFilterChange.emit(query);
  }
}
