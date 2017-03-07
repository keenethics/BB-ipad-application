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
  UnitsTitles,
  GeoCoordinates
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
      if (key) columnNames[toCamelCase(key.toLowerCase())] = key;
    });
    ColumnNamesCollection.update({}, columnNames, { upsert: true });

    BusinessData.remove({});

    const businessData = parsedData.map((item: string[], index: number) => {
      if (index !== 0) {
        // from parsed data
        let doc = keys.reduce((acc: any, key, i) => {
          if (key) acc[toCamelCase(key.toLowerCase())] = item[i];
          return acc;
        }, {});

        // totals

        // longitude latitude
        // const { city, market, country } = doc;

        // const cords = GeoCoordinates.findOne({
        //   country: new RegExp(`^${country}$`, 'i'),
        //   market: new RegExp(`^${market}$`, 'i'),
        //   city: new RegExp(`^${city}$`, 'i')
        // });

        // if (cords) {
        //   const { longitude, latitude } = cords;
        //   doc = Object.assign({ longitude, latitude }, doc);
        // } else {
        //   doc = Object.assign({ longitude: 'NO CORDS', latitude: 'NO CORDS' }, doc);
        // }

        doc = Object.keys(doc).reduce((acc: any, key) => {
          if (key.toLowerCase() === 'actual' || !isNaN(Number(key))) {
            acc.values[key] = doc[key];
          } else {
            acc[key] = doc[key];
          }
          return acc;
        }, { values: {} });

        return doc;

        // BusinessData.insert(doc);
      }
    }).filter((item) => item);

    const metropolises = Array.from(new Set(businessData.map((item: any) => item.metropolis)).values());
    metropolises.forEach((m) => {
      if (!m) return;

      const total = businessData.reduce((acc, d) => {
        if (d.metropolis === m) {
          if (!acc) {
            acc = d;
            acc.city = 'Total';
            acc.metropolis = 'Total';
          } else {
            acc.values.actual + parseInt(d.values.actual, 10);
          }
        }
        return acc;
      }, null);

      console.log(`Metropolis ${m}: ${total.values.actual}`);
      businessData.push(total);
    });

    // const countries = Array.from(new Set(businessData.map((item: any) => item.country)).values());
    // countries.forEach((c) => {
    //   if (!c) return;

    //   const total = businessData.reduce((acc, d) => {
    //     if (d.country === c && ) return acc + parseInt(d.values.actual, 10);
    //     return acc;
    //   }, 0);

    //   console.log(`Country ${c}: ${total}`);
    // });

    // const markets = Array.from(new Set(businessData.map((item: any) => item.market)).values());
    // markets.forEach((m) => {
    //   if (!m) return;

    //   const total = businessData.reduce((acc, d) => {
    //     if (d.market === m) return acc + parseInt(d.values.actual, 10);
    //     return acc;
    //   }, 0);

    //   console.log(`Market ${m}: ${total}`);
    // });

    // const titles = (BusinessData as any)
    //   .aggregate([{ $group: { _id: null, titles: { $addToSet: '$n2' } } }])[0]
    //   .titles as string[];
    // UnitsTitles.remove({});
    // titles.forEach(t => UnitsTitles.insert({ title: t }));

    // MarketCountries.remove({});
    // AvailableCountries.remove({});

    // setMarketCountries();
    // setAvailableCountries();

    return 'Data uploaded!';
  }
});

export const uploadCoordinates = new ValidatedMethod({
  name: 'data.uploadCoordinates',
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

    GeoCoordinates.remove({});

    parsedData.forEach((item: string[], index: number) => {
      if (index !== 0) {
        const doc = {} as any;
        keys.forEach((key, i) => {
          doc[toCamelCase(key.toLowerCase())] = item[i];
        });
        GeoCoordinates.insert(doc);
      }
    });

    return 'Coordinates uploaded!';
  }
});
