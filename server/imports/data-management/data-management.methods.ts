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

const HIGHT_LEVEL_CATEGORIES = new Map([
  ['Opening', 'Opening'],
  ['IN Employee Ramp Up Replacements', 'Ramp up'],
  ['IN Employee From PNA/LOA', 'Others'],
  ['IN Employee Transfer Position from other BG/Function', 'Others'],
  ['IN Employee Acquisition Insourcing', 'Ramp up'],
  ['IN Employee Transfer from own BG/Function', 'Others'],
  ['OUT Employee Voluntary Leave', 'Ramp down'],
  ['OUT Employee Restructuring', 'Ramp down'],
  ['OUT Employee Employee moving to other BG/Function', 'Others'],
  ['OUT Employee To PNA/LOA', 'Others'],
  ['OUT Employee Transfer to other BG/Function', 'Others'],
  ['OUT Employee Divestment Outsourcing', 'Ramp down'],
  ['OUT Employee Transfer to own BG/Function', 'Others'],
  ['IN Contractor New Contract', 'Ramp up'],
  ['IN Contractor Acquisition Insourcing', 'Ramp down'],
  ['IN Contractor Transfer from own BG/Function', 'Others'],
  ['OUT Contractor End of Contract', 'Ramp down'],
  ['OUT Contractor Divestment Outsourcing', 'Ramp down'],
  ['OUT Contractor Transfer to own BG/Function', 'Others'],
  ['Landing point', 'Landing point'],
  ['IN Employee New External Hire', 'Ramp up'],
  ['IN Employee Attrition Replacement by ext hire', 'Ramp up'],
  ['IN Employee Internal Move IN', 'Others'],
  ['OUT Employee Internal Move OUT', 'Others'],
  ['IN Contractor Internal Move IN', 'Others'],
  ['OUT Contractor Internal Move OUT', 'Others']
]);

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

    // 1. Add periods like separate value and add highLevelCategory
    const businessData = parsedData.map((item: string[], index: number) => {
      if (index !== 0) {
        // from parsed data
        let doc = keys.reduce((acc: any, key, i) => {
          if (key) acc[toCamelCase(key.toLowerCase())] = item[i];
          return acc;
        }, {});

        // longitude latitude
        const { city, market, country } = doc;

        const cords = GeoCoordinates.findOne({
          country: new RegExp(`^${country}$`, 'i'),
          market: new RegExp(`^${market}$`, 'i'),
          city: new RegExp(`^${city}$`, 'i')
        });

        if (cords) {
          const { longitude, latitude } = cords;
          doc = Object.assign({ longitude, latitude }, doc);
        } else {
          doc = Object.assign({ longitude: 'NO CORDS', latitude: 'NO CORDS' }, doc);
        }

        // periods
        doc = Object.keys(doc).reduce((acc: any, key) => {
          if (key.toLowerCase() === 'actual' || !isNaN(Number(key))) {
            acc.periods[key] = doc[key];
          } else {
            acc[key] = doc[key];
          }
          return acc;
        }, { periods: {} });

        // highLevelCategory
        doc['highLevelCategory'] = HIGHT_LEVEL_CATEGORIES.get(doc.category);
        doc['identifier'] = 'City';

        return doc;
      }
    }).filter((item) => item);

    const totalsMetropolis = businessData.reduce((acc: Map<string, any>, item) => {
      const key = item['n1'] + item['n2'] + item['metropolis'] + item['resourceType'] + item['highLevelCategory'];
      const total = acc.get(key);
      if (!total) {
        item = Object.assign({}, item);
        item.city = 'Total';
        item.identifier = 'Metropolis';
        acc.set(key, item);
      } else {
        const keys = Object.getOwnPropertyNames(total.periods);
        for (let i = 0; i < keys.length; i++) {
          const result = +total.periods[keys[i]] + +item.periods[keys[i]];
          if (isNaN(result)) return acc;
          total.periods[keys[i]] = result;
        }
        acc.set(key, total);
      }
      return acc;
    }, new Map()) as Map<string, any>;

    const totalsCountry = Array.from(totalsMetropolis.values()).reduce((acc: Map<string, any>, item) => {
      const key = item['n1'] + item['n2'] + item['country'] + item['resourceType'] + item['highLevelCategory'];
      const total = acc.get(key);
      if (!total) {
        item = Object.assign({}, item);
        item.metropolis = 'Total';
        item.identifier = 'Country';
        acc.set(key, item);
      } else {
        const keys = Object.getOwnPropertyNames(total.periods);
        for (let i = 0; i < keys.length; i++) {
          const result = +total.periods[keys[i]] + +item.periods[keys[i]];
          if (isNaN(result)) return acc;
          total.periods[keys[i]] = result;
        }
        acc.set(key, total);
      }
      return acc;
    }, new Map()) as Map<string, any>;

    const totalsMarket = Array.from(totalsCountry.values()).reduce((acc: Map<string, any>, item) => {
      const key = item['n1'] + item['n2'] + item['market'] + item['resourceType'] + item['highLevelCategory'];
      const total = acc.get(key);
      if (!total) {
        item = Object.assign({}, item);
        item.country = 'Total';
        item.identifier = 'Market';
        acc.set(key, item);
      } else {
        const keys = Object.getOwnPropertyNames(total.periods);
        for (let i = 0; i < keys.length; i++) {
          const result = +total.periods[keys[i]] + +item.periods[keys[i]];
          if (isNaN(result)) return acc;
          total.periods[keys[i]] = result;
        }
        acc.set(key, total);
      }
      return acc;
    }, new Map()) as Map<string, any>;

    const totals = Array.from(totalsMarket.values()).reduce((acc: Map<string, any>, item) => {
      const key = item['n1'] + item['n2'] + item['resourceType'] + item['highLevelCategory'];
      const total = acc.get(key);
      if (!total) {
        item = Object.assign({}, item);
        item.market = 'Total';
        item.identifier = 'Global';
        acc.set(key, item);
      } else {
        const keys = Object.getOwnPropertyNames(total.periods);
        for (let i = 0; i < keys.length; i++) {
          const result = +total.periods[keys[i]] + +item.periods[keys[i]];
          if (isNaN(result)) return acc;
          total.periods[keys[i]] = result;
        }
        acc.set(key, total);
      }
      return acc;
    }, new Map()) as Map<string, any>;

    const allData = [
      ...businessData,
      ...Array.from(totalsMetropolis.values()),
      ...Array.from(totalsCountry.values()),
      ...Array.from(totalsMarket.values()),
      ...Array.from(totals.values())
    ];

    const uniqueData = allData.reduce((acc, item) => {
      const key =
        item['n1'] +
        item['n2'] +
        item['market'] +
        item['city'] +
        item['country'] +
        item['metropolis'] +
        item['resourceType'] +
        item['highLevelCategory'];

      const uniqueItem = acc.get(key);

      if (!uniqueItem && item.n1) {
        acc.set(key, item);
      }

      return acc;
    }, new Map());

    Array.from(uniqueData.values()).forEach((d: any) => {
      BusinessData.insert(d);
    });

    // const exludedFields = ['_id', 'n3', 'n4', 'city', 'pLLineBusiness', 'reasoning', 'values'];
    // const cityTotals = businessData.reduce((acc, item) => {
    //   debugger
    //   const isInAcc = Boolean(acc.filter((accItem: any) => isObjectEquivalent(accItem, item, exludedFields)).length);
    //   if (!isInAcc) {
    //     const { n1, n2, market, country, metropolis, resourceType, hcLc, category } = item;
    //     const group = BusinessData.find({ n1, n2, market, country, metropolis, resourceType, hcLc, category }).fetch();
    //     const total = getTotalFromGroup(group, 'city');
    //     acc.push(total);
    //     return acc;
    //   }
    //   return acc;
    // }, []) as any[];

    // BusinessData.remove({});

    // cityTotals.forEach((item) => {
    //   BusinessData.insert(item);
    // });

    // const test = businessData.reduce((acc, item) => {
    //   acc.forEach((accItem: any) => {
    //     if (!isObjectEquivalent(item, accItem, ['actual', '2017', '2016'])) {
    //       acc.push(item);
    //     }
    //   });
    // }, []);

    // const testGroup = getDataGroup(
    //   businessData,
    //   businessData[0],
    //   ['n3', 'n4', 'city', 'pLLineBusiness', 'reasoning', 'values']
    // );

    // const total = getTotalFromGroup(testGroup, 'city');

    // const exludedFields = ['n3', 'n4', 'city', 'pLLineBusiness', 'reasoning', 'values'];
    // const totalCities = businessData.reduce((acc, item, index, source) => {
    //   const isInAcc = Boolean(acc.filter((accItem: any) => isObjectEquivalent(accItem, item, exludedFields)).length);

    //   if (isInAcc) return acc;

    //   const group = getDataGroup(source, item, exludedFields);
    //   const groupTotal = getTotalFromGroup(group, 'city');
    //   acc.push(groupTotal);

    //   return acc;
    // }, []);

    // function isObjectEquivalent(a: any, b: any, exludedFields: string[] = []) {
    //   const aProps = Object.getOwnPropertyNames(a).filter(p => exludedFields.indexOf(p) === -1);
    //   const bProps = Object.getOwnPropertyNames(b).filter(p => exludedFields.indexOf(p) === -1);

    //   if (aProps.length !== bProps.length) return false;

    //   for (let i = 0; i < aProps.length; i++) {
    //     if (a[aProps[i]] !== b[bProps[i]]) return false;
    //   }

    //   return true;
    // }

    // function getDataGroup(source: any[], pattern: any, exludedFields: string[] = []) {
    //   return source.filter((item) => {
    //     return isObjectEquivalent(pattern, item, exludedFields);
    //   });
    // }

    // function getTotalFromGroup(group: any[], totalBy: string) {
    //   group[0][totalBy] = 'Total';
    //   return group.reduce((acc, item) => {
    //     Object.getOwnPropertyNames(acc.values).forEach(key => {
    //       acc.values[key] = parseInt(acc.values[key], 10) + parseInt(item.values[key], 10);
    //     });
    //     return acc;
    //   });
    // }

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
