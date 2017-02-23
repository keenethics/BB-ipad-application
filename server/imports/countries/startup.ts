import { Meteor } from 'meteor/meteor';
import { MarketCountries } from '../../../both/countries/market-countries.collection';
import { setMarketCountries } from '../../../both/countries/helpers';

Meteor.startup(() => {
  if (MarketCountries.find({}).count() === 0) {
    setMarketCountries();
  }
});
