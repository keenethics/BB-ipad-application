import { Injectable } from '@angular/core';
import { DataProvider } from '../../data-management';

@Injectable()
export class CountrySelector {
  constructor(private _dataProvider: DataProvider) { }

  getPayloadObject(countryTitles: string[]) {
    return new Promise((res, rej) => {
      this._dataProvider.getDataImmediately({
        n2: 'Total',
        country: { $in: countryTitles },
        category: 'Landing point',
        identifier: 'Country'
      })
        .then((data: any[]) => {
          const unit = data[0];
          unit ? res({ label: unit.country, category: 'Country', data: [unit] }) : rej();
        });
    });
  }
}
