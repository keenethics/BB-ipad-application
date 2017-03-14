import { Meteor } from 'meteor/meteor';
import { Injectable } from '@angular/core';
import * as Baby from 'babyparse';
import { toCamelCase } from '../../../../both/helpers/to-camel-case';


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


@Injectable()
export class DataUploader {
  constructor() {

  }

  uploadFile(file: File, type: string) {
    return new Promise((resolve, reject) => {
      const methodName = type === 'data' ?
        'data.upload' : type === 'cords' ?
          'data.uploadCoordinates' : reject({ reason: 'No method name' });

      const reader = new FileReader();
      reader.onload = () => {


        const parsedData = Baby.parse(reader.result, { skipEmptyLines: true, delimiter: ';' }).data;
        const keys: string[] = parsedData[0];

        const columnNames = {};
        keys.forEach((key) => {
          if (key) columnNames[toCamelCase(key.toLowerCase())] = key;
        });

        // 1. Add periods like separate value and add highLevelCategory
        const businessData = parsedData.map((item: string[], index: number) => {
          if (index !== 0) {
            // from parsed data
            let doc = keys.reduce((acc: any, key, i) => {
              if (key) acc[toCamelCase(key.toLowerCase())] = item[i];
              return acc;
            }, {});

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
            // doc['identifier'] = 'City';

            return doc;
          }
        }).filter((item) => item);

        // businessData
        //   .filter((item) => item['resourceType'] === 'Internals')
        //   .filter((item) => item['n2'] === 'Global Services')
        //   .filter((item) => item['highLevelCategory'] === 'Opening')
        //   .filter((item) => item['city'] === 'Dublin')
        //   .reduce((acc, item) => {
        //     acc.periods['actual'] = +acc.periods['actual'] + +item.periods['actual'];
        //     acc.periods['2017'] = +acc.periods['2017'] + +item.periods['2017'];
        //     acc.periods['2018'] = +acc.periods['2018'] + +item.periods['2018'];
        //     return acc;
        //   });


        function sumData(data: any[], highLevelCategory: string, n2: string, city: string) {
          const filtered = data
            .filter((item) => item['resourceType'] === 'Internals')
            .filter((item) => item['n2'] === n2)
            .filter((item) => item['highLevelCategory'] === highLevelCategory)
            .filter((item) => item['city'] === city);

          if (filtered.length) {
            return filtered.reduce((acc, item) => {
              acc.periods['actual'] = +acc.periods['actual'] + +item.periods['actual'];
              acc.periods['2017'] = +acc.periods['2017'] + +item.periods['2017'];
              acc.periods['2018'] = +acc.periods['2018'] + +item.periods['2018'];
              return acc;
            });
          }

          return null;
        }

        // const byHighLevelCategories: any = [];

        // const highLevelCategories = new Set(HIGHT_LEVEL_CATEGORIES.values())
        //   .forEach((category) => {
        //     const bu = sumData(businessData, category, 'Dublin');
        //     if (bu) {
        //       bu.n3 = 'Total';
        //       byHighLevelCategories.push(bu);
        //     }
        //   });

        const highLevelCategories = Array.from(new Set(HIGHT_LEVEL_CATEGORIES.values()));
        const BUs = Array.from(new Set(businessData.map(i => i.n2)));
        const cities = Array.from(new Set(businessData.map(i => i.city)));
        const countries = Array.from(new Set(businessData.map(i => i.country)));
        const markets = Array.from(new Set(businessData.map(i => i.market)));
        const totalN3: any = [];
        const totalMNs: any = [];

        console.time();
        cities.forEach((city) => {
          highLevelCategories.forEach((category) => {
            let totalMN: any = null;
            BUs.forEach((n2) => {
              const bu = sumData(businessData, category, n2, city);
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
        console.timeEnd();
        const citieTotals = [...totalN3, ...totalMNs];
        const countryTotals: any[] = [];


        BUs.push('Total');
        highLevelCategories.push('Total');

        countries.forEach((country) => {
          highLevelCategories.forEach((category) => {
            BUs.forEach((n2) => {
              const group = citieTotals
                .filter((item) => item)
                .filter((item) => item['resourceType'] === 'Internals')
                .filter((item) => item['n2'] === n2)
                .filter((item) => item['highLevelCategory'] === category);

              const countries = group.filter((item) => item['country'] === country);

              // const virtualOffices: any[] = group.filter((item) => {
              //   return (item['city'] === 'Virtual Office' && item['country'] === country) ||
              //     (item['city'] === 'Non Nokia Site' && item['country'] === country);
              // });

              // const virtualOffices = businessData
              // .filter(item => item['country'] === country)
              // .filter(item => item['city'] === 'Virtual Office' || item['city'] === 'Non Nokia Site');

              // ...virtualOffices

              const all = [...countries];

              if (group.length) {
                const countryTotal = all.reduce((acc, item) => {
                  acc.periods['actual'] = +acc.periods['actual'] + +item.periods['actual'];
                  acc.periods['2017'] = +acc.periods['2017'] + +item.periods['2017'];
                  acc.periods['2018'] = +acc.periods['2018'] + +item.periods['2018'];
                  return acc;
                }, Object.assign({}, all[0], {
                  periods: {
                    'actual': 0,
                    '2017': 0,
                    '2018': 0
                  }
                }));

                countryTotal['city'] = 'Total';
                countryTotal['metropolis'] = 'Total';

                countryTotals.push(countryTotal);
              }
            });
          });
        });



        console.log(countryTotals);

        resolve();

        // Meteor.call(methodName as string, {
        //   fileData: reader.result
        // }, (err: Meteor.Error, res: string) => {
        //   const end = new Date();
        //   if (err) {
        //     reject(err);
        //   } else {
        //     resolve(res);
        //   }
        // });
      };

      reader.readAsText(file);
    });
  }
}
