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

import template from './main-filter.component.html';
import styles from './main-filter.component.scss';

import { DataProvider } from '../../data-management';
import { BusinessDataUnit } from '../../../../../both/data-management';
import { FilterController } from '../filter-controller';

@Component({
  selector: 'main-filter',
  template,
  styles: [styles],
  providers: [DataProvider]
})
export class MainFilterComponent implements OnInit, OnDestroy {
  private businessData: BusinessDataUnit[];
  private filters: any[];
  private query: any;
  private filterQuery: any;
  private dataSubscr: Subscription;
  private selectedCountry: string;

  public options: string[];
  public searchValue: string;
  public category: string;
  public isFilterVisible = false;

  @Input() data: BusinessDataUnit[];
  @Input() currentQuery: any;

  constructor(private dataProvider: DataProvider, private filterCtrl: FilterController) { }

  ngOnInit() {
    const filtersState = this.filterCtrl.getFromStorage();
    if (filtersState) {
      this.query = filtersState.mapQueryObject;
      this.filterQuery = filtersState.filterQueryObject;
      this.filters = filtersState.activeFilters;
      this.category = filtersState.category;
    } else {
      this.initFilters();
    }

    this.options = [];
    this.searchValue = '';

    this.changeCategory();
    this.subscribe();
  }

  ngOnDestroy() {
    this.unsubscribe();
  }

  ngOnChanges(changes: any) {
    if (changes.data.currentValue.length > 0 && this.options.length === 0) {
      this.options = this.getOptions(this.category);
    }

    if (changes.data) {
      this.selectCountry();
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

  initFilters() {
    this.query = {
      identifier: 'Global',
      highLevelCategory: 'Landing point',
      resourceTypeKey: 'TotalInternals',
      n2: 'Total'
    };

    this.filterQuery = Object.assign({}, this.query);
    this.filterQuery.n2 = 'Total';
    this.filters = [];
    this.category = 'global';

    this.options = [];
    this.searchValue = '';

    this.filterCtrl.saveToStorage(this.category, this.filters, this.filterQuery, this.query);
    this.filterCtrl.activeFilters$ = this.filters;
  }

  resetFilter() {
    this.initFilters();

    this.changeCategory();

    if (this.dataSubscr) this.dataSubscr.unsubscribe();
    this.dataSubscr = this.dataProvider.data$.subscribe((data) => {
      this.data = data;
      this.options = this.getOptions(this.category);
    });
  }

  changeCategory() {
    switch (this.category) {
      case 'market': {
        this.filterQuery = {
          identifier: 'Market',
          highLevelCategory: 'Landing point'
        };
        this.query.identifier = 'Market';
        break;
      };
      case 'country': {
        this.filterQuery = Object.assign({}, this.query);
        delete this.filterQuery.country;
        delete this.filterQuery.city;
        this.filterQuery.identifier = 'Country';
        this.query.identifier = 'Country';
        break;
      };
      case 'city': {
        this.filterQuery = Object.assign({}, this.query);
        delete this.filterQuery.city;
        this.filterQuery.identifier = 'City';
        this.query.identifier = 'City';
        break;
      }
      default: {
        this.query.identifier = 'Global';
        this.category = 'global';
        this.filterQuery.identifier = 'Market';
        break;
      }
    }

    this.filterQuery.n2 = 'Total';

    this.doDataQuery(this.query);
    this.filterCtrl.onChangeCategory.emit(this.category);
    this.options = [];
    this.dataProvider.query(this.filterQuery);
    this.filterCtrl.saveToStorage(this.category, this.filters, this.filterQuery, this.query);
    this.searchValue = '';
  }

  selectCountry() {
    if (this.selectedCountry) {
      new DataProvider().getDataImmediately({ country: this.selectedCountry, identifier: 'Country' }, { limit: 1 })
        .then((data: any[]) => {
          const unit = data.filter((item: any) => item.country === this.selectedCountry)[0];
          if (!this.filters.filter((item: any) => item.label === this.selectedCountry).length) {
            this.filters.push({
              label: this.selectedCountry,
              category: 'country',
              unit
            });
          }
          this.filterCtrl.activeFilters$ = this.filters;
          this.selectedCountry = '';
          this.filterCtrl.saveToStorage(this.category, this.filters, this.filterQuery, this.query);
        });
    }
  }

  selectOption(option: string) {
    if (typeof option !== 'string') return;

    if (option && this.filters.filter(f => f.label === option).length === 0) {
      const unit = this.data.filter((item) => item[this.category] === option)[0];
      if (unit) {
        this.filters.push({
          label: option,
          category: this.category,
          unit
        });
      } else {
        return;
      }
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
        delete this.filterQuery.city;
        break;
      };
      case 'city': {
        this.query.identifier = 'City';
        this.filterQuery = Object.assign({}, this.query);
        delete this.filterQuery.city;
        break;
      };
    }
    this.filterQuery.n2 = 'Total';

    this.doDataQuery(this.query);

    switch (this.category) {
      case 'market': this.category = 'country'; break;
      case 'country': this.category = 'city'; break;
    }

    this.filterCtrl.activeFilters$ = this.filters;
    this.dataProvider.query(this.filterQuery);
    this.filterCtrl.saveToStorage(this.category, this.filters, this.filterQuery, this.query);
    this.searchValue = '';
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

    this.filterCtrl.activeFilters$ = this.filters;
    this.doDataQuery(this.query);
    this.filterCtrl.saveToStorage(this.category, this.filters, this.filterQuery, this.query);
  }

  private doDataQuery(filterObj: any, isVirtualOfficesIncluded: boolean = false) {
    if (!isVirtualOfficesIncluded) filterObj.city = Object.assign({ $nin: ['Non Nokia Site', 'Virtual Office'] }, filterObj.city);
    this.filterCtrl.currentFilter$ = filterObj;
  }

  private subscribe() {
    this.dataSubscr = this.dataProvider.data$.subscribe((data) => {
      this.data = data.filter((d: BusinessDataUnit) => ((d.city !== 'Non Nokia Site') && (d.city !== 'Virtual Office')));
      this.options = this.getOptions(this.category);
    });

    this.filterCtrl.onChangeCategory.subscribe((category: string) => {
      if (this.category !== category) {
        this.category = category;
        this.changeCategory();
      }
    });

    this.filterCtrl.onSelectCountry.subscribe((name: string) => {
      if (this.query.country) {
        const countries: string[] = this.query.country.$in;
        if (countries.indexOf(name) === -1) countries.push(name);
      } else {
        this.query.country = { $in: [name] };
      }
      this.selectedCountry = name;
      this.doDataQuery(this.query);
    });

    this.filterCtrl.onInitFilters.subscribe(() => {
      this.initFilters();
    });

    this.filterCtrl.onResetFilters.subscribe(() => {
      this.resetFilter();
    });
  }

  private unsubscribe() {
    this.filterCtrl.onChangeCategory.unsubscribe();
    this.filterCtrl.onSelectCountry.unsubscribe();
    if (this.dataSubscr) this.dataSubscr.unsubscribe();
  }
}
