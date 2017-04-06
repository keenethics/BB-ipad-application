'use strict';

const fs = require('fs');
const Baby = require('babyparse');
const mongoClient = require('mongodb').MongoClient;

const toCamelCase = (str) => {
  return str.replace(/^([A-Z])|[\s-_&/](\w)/g, (match, p1, p2) => {
    if (p2) return p2.toUpperCase();
    return p1.toLowerCase();
  });
}

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

const mongoUrl = process.argv[2];
const currentData = fs.readFileSync(__dirname + '/temp1', 'utf8');
const histData = fs.readFileSync(__dirname + '/temp2', 'utf8');

const parsedData = Baby.parse(currentData, { skipEmptyLines: true, delimiter: ';' }).data;
const parsedHistData = Baby.parse(histData, { skipEmptyLines: true, delimiter: ';' }).data;

mongoClient.connect(mongoUrl, (err, db) => {
  if (err) {
    db.close();
    throw err;
  }

  const ColumnNamesCollection = db.collection('column-names');
  const GeoCoordinates = db.collection('geo-coordinates');
  const BusinessDataSources = db.collection('business-data-sources');
  const BusinessData = db.collection('business-data');

  GeoCoordinates.find({}, (err, geoCoordinatesCursor) => {
    if (err) {
      db.close();
      throw err;
    }

    geoCoordinatesCursor.toArray((err, geoCoordinates) => {
      if (err) {
        db.close();
        throw err;
      }

      try {
        const keys = parsedData[0];
        const columnNames = {};
        keys.forEach((key) => {
          if (key) columnNames[toCamelCase(key.toLowerCase())] = key;
        });
        ColumnNamesCollection.update({}, columnNames, { upsert: true });

        console.log('Mapping source objects...');
        process.send({ status: 'up_data_map_sources' });

        const currentDataSources = parsedData.map((item, index) => {
          if (index !== 0) {
            let doc = keys.reduce((acc, key, i) => {
              if (key) acc[toCamelCase(key.toLowerCase())] = item[i];
              return acc;
            }, {});

            doc = Object.keys(doc).reduce((acc, key) => {
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
        }).filter((item) => item);

        const histKeys = parsedHistData[0];
        const histDataSources = parsedHistData.map((item, index) => {
          if (index !== 0) {
            let doc = histKeys.reduce((acc, key, i) => {
              if (key) acc[toCamelCase(key.toLowerCase())] = item[i];
              return acc;
            }, {});

            doc = Object.keys(doc).reduce((acc, key) => {
              if (key.toLowerCase() === 'actual' || key.toLowerCase() === '2017ytd' || key.toLowerCase() === '2015-12' || !isNaN(Number(key))) {
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
        }).filter((item) => item);

        const businessDataSources = currentDataSources.concat(histDataSources);

        function sumData(data, highLevelCategory, n2, cityKey) {
          const filtered = data
            .filter((item) => item['resourceTypeKey'] === 'TotalInternals')
            .filter((item) => item['n2'] === n2)
            .filter((item) => item['highLevelCategory'] === highLevelCategory)
            .filter((item) => item['cityKey'] === cityKey);

          if (filtered.length) {
            return filtered.reduce((acc, item) => {
              acc.periods['actual'] = (+acc.periods['actual'] || 0) + (+item.periods['actual'] || 0);
              acc.periods['2017'] = (+acc.periods['2017'] || 0) + (+item.periods['2017'] || 0);
              acc.periods['2018'] = (+acc.periods['2018'] || 0) + (+item.periods['2018'] || 0);

              acc.periods['2017Ytd'] = (+acc.periods['2017Ytd'] || 0) + (+item.periods['2017Ytd'] || 0);
              acc.periods['201512'] = (+acc.periods['201512'] || 0) + (+item.periods['201512'] || 0);
              acc.periods['2016'] = (+acc.periods['2016'] || 0) + (+item.periods['2016'] || 0);

              return Object.assign({}, acc);
            });
          }

          return null;
        }

        function sumGroup(group) {
          return group.reduce((acc, item) => {
            acc.periods['actual'] = (+acc.periods['actual'] || 0) + (+item.periods['actual'] || 0);
            acc.periods['2017'] = (+acc.periods['2017'] || 0) + (+item.periods['2017'] || 0);
            acc.periods['2018'] = (+acc.periods['2018'] || 0) + (+item.periods['2018'] || 0);

            acc.periods['2017Ytd'] = (+acc.periods['2017Ytd'] || 0) + (+item.periods['2017Ytd'] || 0);
            acc.periods['201512'] = (+acc.periods['201512'] || 0) + (+item.periods['201512'] || 0);
            acc.periods['2016'] = (+acc.periods['2016'] || 0) + (+item.periods['2016'] || 0);

            return acc;
          }, Object.assign({}, group[0], {
            periods: {
              'actual': 0,
              '2017': 0,
              '2018': 0,
              '2017Ytd': 0,
              '201512': 0,
              '2016': 0
            }
          }));
        }

        function setCords(data) {
          return data.map((item) => {
            if (!item) return;
            const city = item.city;
            const market = item.market;
            const country = item.country;

            const cords = geoCoordinates
              .filter((i) => i.country === country)
              .filter((i) => i.market === market)
              .filter((i) => i.city === city)[0];

            if (cords) {
              const longitude = cords.longitude;
              const latitude = cords.latitude;
              item = Object.assign({ longitude: longitude, latitude: latitude }, item);
            } else {
              item = Object.assign({ longitude: 'NO CORDS', latitude: 'NO CORDS' }, item);
            }

            return item;
          }).filter(item => item);
        }

        const highLevelCategories = Array.from(new Set(HIGHT_LEVEL_CATEGORIES.values()));
        const BUs = Array.from(new Set(businessDataSources.map((i) => i.n2)));
        const cities = Array.from(new Set(businessDataSources.map((i) => i.city)));
        const countries = Array.from(new Set(businessDataSources.map((i) => i.country)));
        const markets = Array.from(new Set(businessDataSources.map((i) => i.market)));
        const cityKeys = Array.from(new Set(businessDataSources.map((i) => i.cityKey)));
        const resourceTypes = Array.from(new Set(businessDataSources.map((i) => i.resourceType)));

        console.log('Maped object: ');
        console.log(businessDataSources[businessDataSources.length - 1]);

        console.log('Sum sources...');
        process.send({ status: 'up_data_sum_sources' });

        const totalN3 = [];
        const totalMNs = [];

        cityKeys.forEach((cityKey) => {
          highLevelCategories.forEach((category) => {
            let totalMN = null;
            BUs.forEach((n2) => {
              const bu = sumData(businessDataSources, category, n2, cityKey);
              if (bu) {
                bu.n3 = 'Total';

                if (!totalMN) {
                  totalMN = Object.assign({}, bu, { periods: {} });
                  totalMN.n2 = 'Total';
                  totalMN.periods['actual'] = +bu.periods['actual'] || 0;
                  totalMN.periods['2017'] = +bu.periods['2017'] || 0;
                  totalMN.periods['2018'] = +bu.periods['2018'] || 0;

                  totalMN.periods['2017Ytd'] = +bu.periods['2017Ytd'] || 0;
                  totalMN.periods['201512'] = +bu.periods['201512'] || 0;
                  totalMN.periods['2016'] = +bu.periods['2016'] || 0;

                } else {
                  totalMN.periods['actual'] = (+totalMN.periods['actual'] || 0) + (+bu.periods['actual'] || 0);
                  totalMN.periods['2017'] = (+totalMN.periods['2017'] || 0) + (+bu.periods['2017'] || 0);
                  totalMN.periods['2018'] = (+totalMN.periods['2018'] || 0) + (+bu.periods['2018'] || 0);

                  totalMN.periods['2017Ytd'] = (+totalMN.periods['2017Ytd'] || 0) + (+bu.periods['2017Ytd'] || 0);
                  totalMN.periods['201512'] = (+totalMN.periods['201512'] || 0) + (+bu.periods['201512'] || 0);
                  totalMN.periods['2016'] = (+totalMN.periods['2016'] || 0) + (+bu.periods['2016'] || 0);
                }

                totalN3.push(bu);
              }
            });
            totalMNs.push(totalMN);
          });
        });

        // const groupBy = (sourceArr, keys, maches) => {
        //   maches = maches || {};
        //   return Array.from(sourceArr.reduce((acc, item) => {

        //     for (const machKey of Object.keys(maches)) {
        //       if (maches[machKey] !== item[machKey]) return acc;
        //     }

        //     const key = keys.reduce((acc, keysItem) => {
        //       return acc + item[keysItem];
        //     }, '');

        //     if (!acc[key]) {
        //       acc.set(key, [item]);
        //     } else {
        //       acc.get(key).push(item);
        //     }

        //     return acc;
        //   }, new Map()).values());
        // };

        // const totalN3 = groupBy(
        //   businessDataSources,
        //   ['n2', 'highLevelCategory', 'cityKey'],
        //   { resourceTypeKey: "TotalInternals" }
        // ).map((group) => {
        //   console.log(group)
        //   const sumItem = sumGroup(group);
        //   sumItem.n3 = 'Total';
        //   return sumItem;
        // });

        // console.log(totalN3.length);

        // const totalMNs = groupBy(
        //   totalN3,
        //   ['highLevelCategory', 'cityKey']
        // ).map((group) => {
        //   const sumItem = sumGroup(group);
        //   sumItem.n2 = 'Total';
        //   return sumItem;
        // });

        // console.log(totalMNs.length);

        console.log('Calculating cities totals...');
        process.send({ status: 'up_data_calc_cities_totals' });

        const cityTotals = totalN3.concat(totalMNs);

        BUs.push('Total');
        highLevelCategories.push('Total');

        const countryTotals = [];
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

        console.log(countryTotals[countryTotals.length - 1]);

        console.log('Calculating markets totals...');
        process.send({ status: 'up_data_calc_markets_totals' });

        const marketTotals = [];
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

        console.log(marketTotals[marketTotals.length - 1]);

        console.log('Calculating global totals...');
        process.send({ status: 'up_data_calc_globals_totals' });

        const globalTotals = [];
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

        console.log(globalTotals[globalTotals.length - 1]);
        console.log('Add coorinates...');


        const allData = cityTotals.concat(countryTotals, marketTotals, globalTotals);

        const dataWithCords = setCords(allData);
        const sourcesDataWithCords = setCords(businessDataSources);

        console.log(dataWithCords[dataWithCords.length - 1]);

        console.log('Insert data to DB...');
        process.send({ status: 'up_data_insert_db' });

        BusinessDataSources.remove({});
        BusinessData.remove({});

        dataWithCords.forEach((d) => {
          BusinessData.insert(d);
        });

        sourcesDataWithCords.forEach((d) => {
          BusinessDataSources.insert(d);
        });
      } catch (e) {
        throw e;
      } finally {
        db.close();
      }
    });
  });
});
