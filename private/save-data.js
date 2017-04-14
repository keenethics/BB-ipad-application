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

const groupBy = (sourceArr, keys, maches) => {
  maches = maches || {};
  return Array.from(sourceArr.reduce((acc, item) => {

    for (const machKey of Object.keys(maches)) {
      if (maches[machKey] !== item[machKey]) return acc;
    }

    const key = keys.reduce((acc, keysItem) => {
      return acc + item[keysItem];
    }, '');

    if (!acc.get(key)) {
      acc.set(key, [item]);
    } else {
      acc.get(key).push(item);
    }

    return acc;
  }, new Map()).values());
};

const sumGroup = (group) => {
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

        console.log('Sum sources...');
        process.send({ status: 'up_data_sum_sources' });

        const totalN3 = groupBy(
          businessDataSources,
          ['n2', 'highLevelCategory', 'cityKey'],
          { resourceTypeKey: "TotalInternals" }
        ).map((group) => {
          const sumItem = sumGroup(group);
          sumItem.n3 = 'Total';
          return sumItem;
        });

        const totalMNs = groupBy(
          totalN3,
          ['highLevelCategory', 'cityKey']
        ).map((group) => {
          const sumItem = sumGroup(group);
          sumItem.n2 = 'Total';
          return sumItem;
        });

        console.log('Calculating cities totals...');
        process.send({ status: 'up_data_calc_cities_totals' });

        const cityTotals = totalN3.concat(totalMNs);
        const countryTotals = groupBy(
          cityTotals,
          ['n2', 'highLevelCategory', 'country']
        ).map(group => {
          const sumItem = sumGroup(group);
          sumItem['city'] = 'Total';
          sumItem['metropolis'] = 'Total';
          sumItem['identifier'] = 'Country';
          return sumItem;
        });

        console.log('Calculating markets totals...');
        process.send({ status: 'up_data_calc_markets_totals' });

        const marketTotals = groupBy(
          countryTotals,
          ['n2', 'highLevelCategory', 'market']
        ).map(group => {
          const sumItem = sumGroup(group);
          sumItem['country'] = 'Total';
          sumItem['identifier'] = 'Market';
          return sumItem;
        });

        console.log('Calculating global totals...');
        process.send({ status: 'up_data_calc_globals_totals' });

        const globalTotals = groupBy(
          marketTotals,
          ['n2', 'highLevelCategory']
        ).map(group => {
          const sumItem = sumGroup(group);
          sumItem['market'] = 'Total';
          sumItem['identifier'] = 'Global';
          return sumItem;
        });

        console.log('Add coorinates...');

        const allData = cityTotals.concat(countryTotals, marketTotals, globalTotals);

        const setCords = (data) => {
          return data.map((item) => {
            if (!item) return;
            const city = item.city;
            const market = item.market;
            const country = item.country;

            const cords = geoCoordinates
              .filter((i) => (
                i.country === country &&
                i.market === market &&
                i.city === city
              ))[0];

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

        const dataWithCords = setCords(allData);
        const sourcesDataWithCords = setCords(businessDataSources);

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
