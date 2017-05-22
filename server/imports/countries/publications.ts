import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { MarketCountries } from '../../../both/countries/market-countries.collection';
import { AvailableCountries } from '../../../both/countries/available-countries.collection';


Meteor.publish('market-countries', function (markets: string[]) {
  check(markets, { _id: { $in: [String] }});
  return MarketCountries.find(markets);
});

Meteor.publish('available-countries', function () {
  return AvailableCountries.find({});
});
