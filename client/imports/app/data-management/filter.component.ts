import {
  Component,
  ViewEncapsulation,
  OnInit,
  OnChanges,
  Output,
  Input,
  EventEmitter
} from '@angular/core';
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
  private dataSubscr: Subscription;;
  markets: string[] = [];
  countries: string[] = [];
  cities: string[] = [];

  currentCity: string = '';
  currentMarket: string = '';
  currentCountry: string = '';

  @Output() onFilterChange = new EventEmitter();

  constructor(public dataProvider: DataProvider) {

  }

  ngOnInit() {
    this.dataProvider.data$.subscribe((data: any) => {
      this.createSelectorsOptionsFromData(data);
    });
  }

  private createSelectorsOptionsFromData(data: any[]) {
    if (Array.isArray(data)) {
      data.forEach((item) => {
        if (
          this.markets.indexOf(item.market) === -1 &&
          item.market !== 'Total Regions' &&
          item.market
        ) {
          this.markets.push(item.market);
        }

        if (
          this.countries.indexOf(item.country) === -1 &&
          item.country !== 'Total Market' &&
          item.country
        ) {
          this.countries.push(item.country);
        }

        if (
          this.cities.indexOf(item.city) === -1 &&
          item.city !== 'Total Country' &&
          item.city
        ) {
          this.cities.push(item.city);
        }
      });

      this.markets.sort();
      this.countries.sort();
      this.cities.sort();
    }
  }

  applyFilterMarket(market: string) {
    this.currentCity = '';
    this.currentCountry = '';
    this.onFilterChange.emit({ type: 'market', value: market });
  }

  applyFilterCountry(country: string) {
    this.currentCity = '';
    this.currentMarket = '';
    this.onFilterChange.emit({ type: 'country', value: country });
  }

  applyFilterCity(city: string) {
    this.currentMarket = '';
    this.currentCountry = '';
    this.onFilterChange.emit({ type: 'city', value: city });
  }
}
