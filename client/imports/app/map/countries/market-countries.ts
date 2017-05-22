import { Injectable } from '@angular/core';
import { MeteorObservable } from 'meteor-rxjs';
import { Subscription } from 'rxjs';
import { OfflineDataProvider } from '../../offline/offline-data-provider';
import { MarketCountries } from '../../../../../both/countries/market-countries.collection';

@Injectable()
export class MarketCountriesProvider {
  constructor(private _odp: OfflineDataProvider) {

  }
  getMarketsCoutries(markets: string[]) {
    // return new Promise((resolve, reject) => {

    //   this.subscr = MeteorObservable.subscribe('market-countries', markets).subscribe((err) => {
    //     if (err) reject();
    //     const result = MarketCountries.find({}).fetch();
    //     resolve(result);
    //   });
    // });
    return this._odp.findIn(MarketCountries, { _id: { $in: markets } }, 'market-countries');
  }
}
