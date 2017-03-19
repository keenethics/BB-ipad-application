import { spawn } from 'threads';
import { toCamelCase } from '../../../both/helpers/to-camel-case';
import { MarketCountries } from '../../../both/countries/market-countries.collection';
import { AvailableCountries } from '../../../both/countries/available-countries.collection';
import { setMarketCountries, setAvailableCountries } from '../../../both/countries/helpers';
import { DataUpdates } from '../../../both/data-management/data-updates.collections';
import {
  BusinessData,
  BusinessDataUnit,
  ColumnNamesCollection,
  UnitsTitles,
  GeoCoordinates,
  BusinessDataSources
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
  ['IN Contractor Acquisition Insourcing', 'Ramp up'],
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

const RESOURCE_TYPES = new Map([
  ['Internals', 'TotalInternals'],
  ['ServCo Internals', 'TotalInternals'],
  ['Externals', 'TotalExternals'],
  ['ServCo Externals', 'TotalExternals'],
  ['Trainees', 'Trainees']
]);


export const calculateData = (parsedData: any) => {
  Meteor.defer(() => {
    const keys: string[] = parsedData[0];
    const columnNames = {};
    keys.forEach((key) => {
      if (key) columnNames[toCamelCase(key.toLowerCase())] = key;
    });
    ColumnNamesCollection.update({}, columnNames, { upsert: true });

    // const threadInputs = {
    //   parsedData: data,
    //   HIGHT_LEVEL_CATEGORIES,
    //   RESOURCE_TYPES
    // };

    // const thread = spawn((inputs: any, done: Function) => {

    //   done({
    //     dataWithCords,
    //     sourcesDataWithCords
    //   });
    // });

    console.time();
    console.log('Calculating data...');

    // const { parsedData, HIGHT_LEVEL_CATEGORIES, RESOURCE_TYPES } = inputs;

    const businessDataSources = parsedData.map((item: string[], index: number) => {
      if (index !== 0) {
        let doc = keys.reduce((acc: any, key, i) => {
          if (key) acc[toCamelCase(key.toLowerCase())] = item[i];
          return acc;
        }, {});

        doc = Object.keys(doc).reduce((acc: any, key) => {
          if (key.toLowerCase() === 'actual' || !isNaN(Number(key))) {
            acc.periods[key] = doc[key];
          } else {
            acc[key] = doc[key];
          }
          return acc;
        }, { periods: {} });

        doc['highLevelCategory'] = HIGHT_LEVEL_CATEGORIES.get(doc.category);
        doc['resourceTypeKey'] = RESOURCE_TYPES.get(doc.resourceType);
        doc['cityKey'] = doc.country + doc.city;
        doc['identifier'] = 'City';

        return doc;
      }
    }).filter((item: BusinessDataUnit) => item);

    function sumData(data: any[], highLevelCategory: string, n2: string, cityKey: string) {
      const filtered = data
        .filter((item) => item['resourceTypeKey'] === 'TotalInternals')
        .filter((item) => item['n2'] === n2)
        .filter((item) => item['highLevelCategory'] === highLevelCategory)
        .filter((item) => item['cityKey'] === cityKey);

      if (filtered.length) {
        return filtered.reduce((acc, item) => {
          acc.periods['actual'] = +acc.periods['actual'] + +item.periods['actual'];
          acc.periods['2017'] = +acc.periods['2017'] + +item.periods['2017'];
          acc.periods['2018'] = +acc.periods['2018'] + +item.periods['2018'];
          return Object.assign({}, acc);
        });
      }

      return null;
    }

    function sumGroup(group: any[]) {
      return group.reduce((acc, item) => {
        acc.periods['actual'] = +acc.periods['actual'] + +item.periods['actual'];
        acc.periods['2017'] = +acc.periods['2017'] + +item.periods['2017'];
        acc.periods['2018'] = +acc.periods['2018'] + +item.periods['2018'];
        return acc;
      }, Object.assign({}, group[0], {
        periods: {
          'actual': 0,
          '2017': 0,
          '2018': 0
        }
      }));
    }

    function setCords(data: BusinessDataUnit[]) {
      return data.map((item) => {
        if (!item) return;
        const { city, market, country } = item;

        const cords = GeoCoordinates.findOne({
          country: new RegExp(`^${country}$`, 'i'),
          market: new RegExp(`^${market}$`, 'i'),
          city: new RegExp(`^${city}$`, 'i')
        });

        if (cords) {
          const { longitude, latitude } = cords;
          item = Object.assign({ longitude, latitude }, item);
        } else {
          item = Object.assign({ longitude: 'NO CORDS', latitude: 'NO CORDS' }, item);
        }

        return item;
      }).filter(item => item);
    }

    const highLevelCategories = Array.from(new Set(HIGHT_LEVEL_CATEGORIES.values()));
    const BUs = Array.from(new Set(businessDataSources.map((i: BusinessDataUnit) => i.n2)));
    const cities = Array.from(new Set(businessDataSources.map((i: BusinessDataUnit) => i.city)));
    const countries = Array.from(new Set(businessDataSources.map((i: BusinessDataUnit) => i.country)));
    const markets = Array.from(new Set(businessDataSources.map((i: BusinessDataUnit) => i.market)));
    const cityKeys = Array.from(new Set(businessDataSources.map((i: BusinessDataUnit) => i.cityKey)));
    const resourceTypes = Array.from(new Set(businessDataSources.map((i: BusinessDataUnit) => i.resourceType)));
    const totalN3: any = [];
    const totalMNs: any = [];

    cityKeys.forEach((cityKey: string) => {
      highLevelCategories.forEach((category: string) => {
        let totalMN: any = null;
        BUs.forEach((n2: string) => {
          const bu = sumData(businessDataSources, category, n2, cityKey);
          if (bu) {
            bu.n3 = 'Total';

            if (!totalMN) {
              totalMN = Object.assign({}, bu, { periods: {} });
              totalMN.n2 = 'Total';
              totalMN.periods['actual'] = +bu.periods['actual'];
              totalMN.periods['2017'] = +bu.periods['2017'];
              totalMN.periods['2018'] = +bu.periods['2018'];
            } else {
              totalMN.periods['actual'] = +totalMN.periods['actual'] + +bu.periods['actual'];
              totalMN.periods['2017'] = +totalMN.periods['2017'] + +bu.periods['2017'];
              totalMN.periods['2018'] = +totalMN.periods['2018'] + +bu.periods['2018'];
            }

            totalN3.push(bu);
          }
        });
        totalMNs.push(totalMN);
      });
    });

    const cityTotals = [...totalN3, ...totalMNs];
    BUs.push('Total');
    highLevelCategories.push('Total');

    const countryTotals: any[] = [];
    countries.forEach((country) => {
      highLevelCategories.forEach((category) => {
        BUs.forEach((n2) => {
          const group = cityTotals
            .filter((item) => item)
            .filter((item) => item['resourceTypeKey'] === 'TotalInternals')
            .filter((item) => item['n2'] === n2)
            .filter((item) => item['highLevelCategory'] === category)
            .filter((item) => item['country'] === country);

          if (group.length) {
            const countryTotal = sumGroup(group);
            countryTotal['city'] = 'Total';
            countryTotal['metropolis'] = 'Total';
            countryTotal['identifier'] = 'Country';
            countryTotals.push(countryTotal);
          }
        });
      });
    });

    const marketTotals: any[] = [];
    markets.forEach((market) => {
      highLevelCategories.forEach((category) => {
        BUs.forEach((n2) => {
          const group = countryTotals
            .filter((item) => item)
            .filter((item) => item['resourceTypeKey'] === 'TotalInternals')
            .filter((item) => item['n2'] === n2)
            .filter((item) => item['highLevelCategory'] === category)
            .filter((item) => item['market'] === market);

          if (group.length) {
            const marketTotal = sumGroup(group);
            marketTotal['country'] = 'Total';
            marketTotal['identifier'] = 'Market';
            marketTotals.push(marketTotal);
          }
        });
      });
    });

    const globalTotals: any[] = [];
    highLevelCategories.forEach((category) => {
      BUs.forEach((n2) => {
        const group = marketTotals
          .filter((item) => item)
          .filter((item) => item['resourceTypeKey'] === 'TotalInternals')
          .filter((item) => item['n2'] === n2)
          .filter((item) => item['highLevelCategory'] === category);

        if (group.length) {
          const globalTotal = sumGroup(group);
          globalTotal['market'] = 'Total';
          globalTotal['identifier'] = 'Global';
          globalTotals.push(globalTotal);
        }
      });
    });

    const allData = [...cityTotals, ...countryTotals, ...marketTotals, ...globalTotals];

    const dataWithCords = setCords(allData);
    const sourcesDataWithCords = setCords(businessDataSources);

    console.log('Inserting data...');

    BusinessDataSources.remove({});
    BusinessData.remove({});

    dataWithCords.forEach((d: any) => {
      BusinessData.insert(d);
    });

    sourcesDataWithCords.forEach((d: any) => {
      BusinessDataSources.insert(d);
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

    console.log('Data uploaded');
    console.timeEnd();

    DataUpdates.update({}, { lastDataUpdateDate: new Date() }, { upsert: true });
  });
};

//   thread
//     .send(threadInputs)
//     .on('message', function (response: any) {
//       const {dataWithCords, sourcesWithCords} = response;

//       thread.kill();
//     })
//     .on('error', function (error: any) {
//       console.error('Worker errored:', error);
//     })
//     .on('exit', function () {
//       console.log('Worker has been terminated.');
//     });
// };



// console.time();
//     console.log('Calculating data...');

//     const keys: string[] = (this as any).params.parsedData[0];

//     const columnNames = {};
//     keys.forEach((key) => {
//       if (key) columnNames[toCamelCase(key.toLowerCase())] = key;
//     });
//     ColumnNamesCollection.update({}, columnNames, { upsert: true });

//     BusinessDataSources.remove({});
//     BusinessData.remove({});

//     const businessDataSources = (this as any).params.parsedData.map((item: string[], index: number) => {
//       if (index !== 0) {
//         let doc = keys.reduce((acc: any, key, i) => {
//           if (key) acc[toCamelCase(key.toLowerCase())] = item[i];
//           return acc;
//         }, {});

//         doc = Object.keys(doc).reduce((acc: any, key) => {
//           if (key.toLowerCase() === 'actual' || !isNaN(Number(key))) {
//             acc.periods[key] = doc[key];
//           } else {
//             acc[key] = doc[key];
//           }
//           return acc;
//         }, { periods: {} });

//         doc['highLevelCategory'] = HIGHT_LEVEL_CATEGORIES.get(doc.category);
//         doc['resourceTypeKey'] = RESOURCE_TYPES.get(doc.resourceType);
//         doc['cityKey'] = doc.country + doc.city;
//         doc['identifier'] = 'City';

//         return doc;
//       }
//     }).filter((item: BusinessDataUnit) => item);

//     function sumData(data: any[], highLevelCategory: string, n2: string, cityKey: string) {
//       const filtered = data
//         .filter((item) => item['resourceTypeKey'] === 'TotalInternals')
//         .filter((item) => item['n2'] === n2)
//         .filter((item) => item['highLevelCategory'] === highLevelCategory)
//         .filter((item) => item['cityKey'] === cityKey);

//       if (filtered.length) {
//         return filtered.reduce((acc, item) => {
//           acc.periods['actual'] = +acc.periods['actual'] + +item.periods['actual'];
//           acc.periods['2017'] = +acc.periods['2017'] + +item.periods['2017'];
//           acc.periods['2018'] = +acc.periods['2018'] + +item.periods['2018'];
//           return Object.assign({}, acc);
//         });
//       }

//       return null;
//     }

//     function sumGroup(group: any[]) {
//       return group.reduce((acc, item) => {
//         acc.periods['actual'] = +acc.periods['actual'] + +item.periods['actual'];
//         acc.periods['2017'] = +acc.periods['2017'] + +item.periods['2017'];
//         acc.periods['2018'] = +acc.periods['2018'] + +item.periods['2018'];
//         return acc;
//       }, Object.assign({}, group[0], {
//         periods: {
//           'actual': 0,
//           '2017': 0,
//           '2018': 0
//         }
//       }));
//     }

//     function setCords(data: BusinessDataUnit[]) {
//       return data.map((item) => {
//         if (!item) return;
//         const { city, market, country } = item;

//         const cords = GeoCoordinates.findOne({
//           country: new RegExp(`^${country}$`, 'i'),
//           market: new RegExp(`^${market}$`, 'i'),
//           city: new RegExp(`^${city}$`, 'i')
//         });

//         if (cords) {
//           const { longitude, latitude } = cords;
//           item = Object.assign({ longitude, latitude }, item);
//         } else {
//           item = Object.assign({ longitude: 'NO CORDS', latitude: 'NO CORDS' }, item);
//         }

//         return item;
//       }).filter(item => item);
//     }

//     const highLevelCategories = Array.from(new Set(HIGHT_LEVEL_CATEGORIES.values()));
//     const BUs = Array.from(new Set(businessDataSources.map((i: BusinessDataUnit) => i.n2)));
//     const cities = Array.from(new Set(businessDataSources.map((i: BusinessDataUnit) => i.city)));
//     const countries = Array.from(new Set(businessDataSources.map((i: BusinessDataUnit) => i.country)));
//     const markets = Array.from(new Set(businessDataSources.map((i: BusinessDataUnit) => i.market)));
//     const cityKeys = Array.from(new Set(businessDataSources.map((i: BusinessDataUnit) => i.cityKey)));
//     const resourceTypes = Array.from(new Set(businessDataSources.map((i: BusinessDataUnit) => i.resourceType)));
//     const totalN3: any = [];
//     const totalMNs: any = [];

//     cityKeys.forEach((cityKey: string) => {
//       highLevelCategories.forEach((category: string) => {
//         let totalMN: any = null;
//         BUs.forEach((n2: string) => {
//           const bu = sumData(businessDataSources, category, n2, cityKey);
//           if (bu) {
//             bu.n3 = 'Total';

//             if (!totalMN) {
//               totalMN = Object.assign({}, bu, { periods: {} });
//               totalMN.n2 = 'Total';
//               totalMN.periods['actual'] = +bu.periods['actual'];
//               totalMN.periods['2017'] = +bu.periods['2017'];
//               totalMN.periods['2018'] = +bu.periods['2018'];
//             } else {
//               totalMN.periods['actual'] = +totalMN.periods['actual'] + +bu.periods['actual'];
//               totalMN.periods['2017'] = +totalMN.periods['2017'] + +bu.periods['2017'];
//               totalMN.periods['2018'] = +totalMN.periods['2018'] + +bu.periods['2018'];
//             }

//             totalN3.push(bu);
//           }
//         });
//         totalMNs.push(totalMN);
//       });
//     });

//     const cityTotals = [...totalN3, ...totalMNs];
//     BUs.push('Total');
//     highLevelCategories.push('Total');

//     const countryTotals: any[] = [];
//     countries.forEach((country) => {
//       highLevelCategories.forEach((category) => {
//         BUs.forEach((n2) => {
//           const group = cityTotals
//             .filter((item) => item)
//             .filter((item) => item['resourceTypeKey'] === 'TotalInternals')
//             .filter((item) => item['n2'] === n2)
//             .filter((item) => item['highLevelCategory'] === category)
//             .filter((item) => item['country'] === country);

//           if (group.length) {
//             const countryTotal = sumGroup(group);
//             countryTotal['city'] = 'Total';
//             countryTotal['metropolis'] = 'Total';
//             countryTotal['identifier'] = 'Country';
//             countryTotals.push(countryTotal);
//           }
//         });
//       });
//     });

//     const marketTotals: any[] = [];
//     markets.forEach((market) => {
//       highLevelCategories.forEach((category) => {
//         BUs.forEach((n2) => {
//           const group = countryTotals
//             .filter((item) => item)
//             .filter((item) => item['resourceTypeKey'] === 'TotalInternals')
//             .filter((item) => item['n2'] === n2)
//             .filter((item) => item['highLevelCategory'] === category)
//             .filter((item) => item['market'] === market);

//           if (group.length) {
//             const marketTotal = sumGroup(group);
//             marketTotal['country'] = 'Total';
//             marketTotal['identifier'] = 'Market';
//             marketTotals.push(marketTotal);
//           }
//         });
//       });
//     });

//     const globalTotals: any[] = [];
//     highLevelCategories.forEach((category) => {
//       BUs.forEach((n2) => {
//         const group = marketTotals
//           .filter((item) => item)
//           .filter((item) => item['resourceTypeKey'] === 'TotalInternals')
//           .filter((item) => item['n2'] === n2)
//           .filter((item) => item['highLevelCategory'] === category);

//         if (group.length) {
//           const globalTotal = sumGroup(group);
//           globalTotal['market'] = 'Total';
//           globalTotal['identifier'] = 'Global';
//           globalTotals.push(globalTotal);
//         }
//       });
//     });

//     const allData = [...cityTotals, ...countryTotals, ...marketTotals, ...globalTotals];

//     const dataWithCords = setCords(allData);
//     const sourcesWithCords = setCords(businessDataSources);
//     console.log('Inserting data...');

//     dataWithCords.forEach((d: any) => {
//       BusinessData.insert(d);
//     });

//     sourcesWithCords.forEach((d: any) => {
//       BusinessDataSources.insert(d);
//     });

//     const titles = (BusinessData as any)
//       .aggregate([{ $group: { _id: null, titles: { $addToSet: '$n2' } } }])[0]
//       .titles as string[];
//     UnitsTitles.remove({});
//     titles.forEach(t => UnitsTitles.insert({ title: t }));

//     MarketCountries.remove({});
//     AvailableCountries.remove({});

//     setMarketCountries();
//     setAvailableCountries();

//     console.log('Data uploaded');
//     console.timeEnd();

//     DataUpdates.update({}, { lastDataUpdateDate: new Date() }, { upsert: true });
