import { Injectable } from '@angular/core';
import { MeteorObservable } from 'meteor-rxjs';
import { Subscription } from 'rxjs';
import { MarketCountries } from '../../../../../both/countries/market-countries.collection';

@Injectable()
export class MarketCountriesProvider {
  private subscr: Subscription;

  getMarketsCoutries(markets: string[]) {
    return new Promise((resolve, reject) => {
      if (this.subscr) this.subscr.unsubscribe();

      this.subscr = MeteorObservable.subscribe('market-countries', markets).subscribe((err) => {
        if (err) reject();
        const result = MarketCountries.find({}).fetch();
        resolve(result);
      });
    });
  }
}
