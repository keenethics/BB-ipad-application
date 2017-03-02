import { Meteor } from 'meteor/meteor';
import * as Baby from 'babyparse';
import { toCamelCase } from '../../../both/helpers/to-camel-case';

import { MarketCountries } from '../../../both/countries/market-countries.collection';
import { AvailableCountries } from '../../../both/countries/available-countries.collection';
import { setMarketCountries, setAvailableCountries } from '../../../both/countries/helpers';

import {
  BusinessData,
  BusinessDataUnit,
  ColumnNamesCollection,
  UnitsTitles
} from '../../../both/data-management';

export const uploadFile = new ValidatedMethod({
  name: 'data.upload',
  validate: new SimpleSchema({
    fileData: { type: String },
  }).validator(),
  run({ fileData }) {
    if (!this.userId) {
      throw new Meteor.Error('premission denied', 'Please login first.');
    }

    if (!Roles.userIsInRole(this.userId, ['DataUpload', 'Administrator'])) {
      throw new Meteor.Error('premission denied', 'You are not a data manager.');
    }

    const parsedData = Baby.parse(fileData, { skipEmptyLines: true, delimiter: ';' }).data;
    const keys: string[] = parsedData[0];

    const columnNames = {};
    keys.forEach((key) => {
      columnNames[toCamelCase(key.toLowerCase())] = key;
    });
    ColumnNamesCollection.update({}, columnNames, { upsert: true });

    BusinessData.remove({});

    parsedData.forEach((item: string[], index: number) => {
      if (index !== 0) {
        const doc = {} as BusinessDataUnit;
        keys.forEach((key, i) => {
          doc[toCamelCase(key.toLowerCase())] = item[i];
        });
        BusinessData.insert(doc);
      }
    });

    const titles = (BusinessData as any)
      .aggregate([{ $group: { _id: null, titles: { $addToSet: '$n2' } } }])[0]
      .titles as string[];
    UnitsTitles.remove({});
    titles.forEach(t => UnitsTitles.insert({ title: t }));

    MarketCountries.remove({});
    AvailableCountries.remove({});

    setMarketCountries();
    setAvailableCountries();

    return 'Data uploaded!';
  }
});
