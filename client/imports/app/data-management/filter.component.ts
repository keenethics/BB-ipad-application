import {
  Component,
  ViewEncapsulation,
  OnInit,
  OnChanges,
  AfterViewInit,
  Output,
  Input,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

import template from './filter.component.html';
import styles from './filter.component.scss';

import { DataProvider } from './data-provider';
import { BusinessDataUnit, ColumnNames } from '../../../../both/data-management';
import { FilterController } from './filter-controller';

@Component({
  selector: 'data-filter',
  template,
  styles: [styles],
  providers: [DataProvider]
})
export class DataFilterComponent implements OnInit, OnDestroy {
  private businessData: BusinessDataUnit[];
  private filters: any[];
  private query: any;
  private filterQuery: any;
  private dataSubscr: Subscription;

  public options: string[];
  public searchValue: string;
  public category: string;
  public isFilterVisible = false;

  @Input() data: BusinessDataUnit[];
  @Output() onFilterChange = new EventEmitter();

  constructor(private dataProvider: DataProvider, private filterCtrl: FilterController) {
    filterCtrl.setFilterComponetn(this);
  }

  ngOnInit() {
    this.query = {
      n2: 'Total',
      identifier: '',
      highLevelCategory: 'Landing point',
      period: 'Actuals'
    };

    this.category = '';
    this.filters = [];
    this.options = [];
    this.searchValue = '';

    this.filterQuery = Object.assign({}, this.query);

    this.changeCategory();

    this.dataSubscr = this.dataProvider.data$.subscribe((data) => {
      this.data = data;
      this.options = this.getOptions(this.category);
    });
  }

  ngOnDestroy() {
    this.dataSubscr.unsubscribe();
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
    switch (this.category) {
      case 'market': {
        this.filterQuery = {
          n2: 'Total',
          identifier: 'Market',
          highLevelCategory: 'Landing point',
          period: 'Actuals'
        };
        this.query.identifier = 'Market';
        this.onFilterChange.emit(this.query);
        break;
      };
      case 'country': {
        this.filterQuery = Object.assign({}, this.query);
        delete this.filterQuery.country;
        delete this.filterQuery.city;
        this.filterQuery.identifier = 'Country';
        this.query.identifier = 'Country';
        this.onFilterChange.emit(this.query);
        break;
      };
      case 'city': {
        this.filterQuery = Object.assign({}, this.query);
        delete this.filterQuery.city;
        this.filterQuery.identifier = 'City';
        this.query.identifier = 'City';
        this.onFilterChange.emit(this.query);
        break;
      }
      default: {
        this.query.identifier = 'Global';
        this.category = 'market';
        this.filterQuery.identifier = 'Market';
        this.onFilterChange.emit(this.query);
        break;
      }
    }

    this.options = [];
    this.dataProvider.query(this.filterQuery);
  }

  selectOption(option: string) {
    if (option && this.filters.filter(f => f.label === option).length === 0) {
      this.filters.push({
        label: option,
        category: this.category,
        unit: this.data.filter((item) => item[this.category] === option)[0]
      });
    }

    this.query[this.category] = {
      $in: this.filters.map((f) => f.unit.identifier.toLowerCase() === this.category ? f.label : null).filter(f => f)
    };

    switch (this.category) {
      case 'market': {
        this.query.identifier = 'Country';
        this.filterQuery = Object.assign({}, this.query);
        break;
      };
      case 'country': {
        this.query.identifier = 'City';
        this.filterQuery = Object.assign({}, this.query);
        break;
      };
      case 'city': {
        this.query.identifier = 'City';
        this.filterQuery = Object.assign({}, this.query);
        delete this.filterQuery.city;
        break;
      };
    }
    this.onFilterChange.emit(this.query);

    switch (this.category) {
      case 'market': this.category = 'country'; break;
      case 'country': this.category = 'city'; break;
    }
    this.dataProvider.query(this.filterQuery);
  }

  removeOption(filterItem: any) {
    if (filterItem) {
      this.filters = this.filters.filter(f => {
        return filterItem.unit[filterItem.category] !== f.unit[filterItem.category];
      });
    }

    delete this.query.market;
    delete this.query.country;
    delete this.query.city;

    this.filters.forEach((f) => {
      if (f.unit.identifier === 'Market') {
        if (this.query.market && this.query.market.$in.indexOf(f.label) === -1) {
          this.query.market.$in.push(f.label);
        } else {
          this.query.market = { $in: [f.label] };
        }
      }

      if (f.unit.identifier === 'Country') {
        if (this.query.country && this.query.country.$in.indexOf(f.label) === -1) {
          this.query.country.$in.push(f.label);
        } else {
          this.query.country = { $in: [f.label] };
        }
      }

      if (f.unit.identifier === 'City') {
        if (this.query.city && this.query.city.$in.indexOf(f.label) === -1) {
          this.query.city.$in.push(f.label);
        } else {
          this.query.city = { $in: [f.label] };
        }
      }
    });

    switch (this.category) {
      case 'market': {
        this.query.identifier = 'Market';
        this.dataProvider.query(this.query);
        break;
      };
      case 'country': {
        this.query.identifier = 'Country';
        this.dataProvider.query(this.query);
        break;
      };
      case 'city': {
        this.query.identifier = 'City';
        this.dataProvider.query(this.query);
        break;
      };
    }

    this.onFilterChange.emit(this.query);
  }
}
