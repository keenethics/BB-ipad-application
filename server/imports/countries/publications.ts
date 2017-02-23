import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { MarketCountries } from '../../../both/countries/market-countries.collection';

Meteor.publish('market-countries', function (markets: string[]) {
  check(markets, [String]);
  return MarketCountries.find({ _id: { $in: markets } });
});
