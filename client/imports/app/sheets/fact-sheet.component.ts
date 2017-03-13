import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  NgZone
} from '@angular/core';

import { DataProvider, SumBusinessUnitsPipe } from '../data-management';
import { BusinessDataUnit } from '../../../../both/data-management';
import { OverviewSheetComponent } from './overview-sheet.component';

import template from './fact-sheet.component.html';
import styles from './sheets.styles.scss';
import componentStyles from './fact-sheet.component.scss';

@Component({
  selector: 'fact-sheet',
  template,
  styles: [styles, componentStyles],
  providers: [DataProvider],
  encapsulation: ViewEncapsulation.None
})
export class FactSheetComponent {
  @Input() selectedItem: any;
  @Input() options: any;
  @Input() columnsDescs: any[];
  @Input() rowsDescs: any[];
  @Output() onClickEmitter = new EventEmitter();
  @Output() onCloseEmitter = new EventEmitter();

  public entityKey: string;
  public businessData: BusinessDataUnit[];
  public lastColumnsDesc: any;
  public periods: string[];

  constructor(private dataProvider: DataProvider, private zone: NgZone) {
    this.dataProvider.data$.subscribe((data) => {
      if (data.length) {
        this.periods = ['FC 2017', 'LE 2018'];
        this.businessData = data;
        this.initTableDescriptions();
      }
    });
  }

  ngOnInit() {
    this.getTableData();
  }

  initTableDescriptions() {
    this.columnsDescs = [
      {
        title: 'act P01', class: 'l-border', period: 'Actuals', dataSources: { highLevelCategory: 'Landing point' },
        calc: (inputs: any[], descs: any) => {
          let keys: any;

          if (Array.isArray(descs['n2'])) {
            keys = [
              descs['n2'][0] + 'Landing point',
              descs['n2'][1] + 'Landing point'
            ];
          } else if (!descs['n2']) {
            keys = [
              'Landing point'
            ];
          } else {
            keys = [
              descs['n2'] + 'Landing point',
            ];
          }

          const maches = inputs.reduce((acc, item) => {
            const itemKey = descs['n2'] ? item['n2'] + item['highLevelCategory'] : item['highLevelCategory'];

            keys.forEach((k: any) => {
              if (itemKey === k) acc.push(item);
            });

            return acc;
          }, []);

          const res = maches.reduce((acc: number, item: any) => acc + Number(item.periods['actual']), 0);
          return res;
        }
      },
      // { title: 'LP', class: 'r-border', dataSources: { period: '2016', highLevelCategory: 'Landing point' } },
      {
        title: 'RU', class: 'background-light l-border', period: '2017', dataSources: { highLevelCategory: 'Ramp up' },
        calc: (inputs: any[], descs: any) => {

          let keys: any;

          if (Array.isArray(descs['n2'])) {
            keys = [
              descs['n2'][0] + 'Ramp up',
              descs['n2'][1] + 'Ramp up'
            ];
          } else if (!descs['n2']) {
            keys = [
              'Ramp up'
            ];
          } else {
            keys = [
              descs['n2'] + 'Ramp up',
            ];
          }

          const maches = inputs.reduce((acc, item) => {
            const itemKey = descs['n2'] ? item['n2'] + item['highLevelCategory'] : item['highLevelCategory'];

            keys.forEach((k: any) => {
              if (itemKey === k) acc.push(item);
            });

            return acc;
          }, []);

          const res = maches.reduce((acc: number, item: any) => acc + Number(item.periods['2017']), 0);
          return res;
        }
      },
      {
        title: 'RD', class: 'background-light', period: '2017', dataSources: { highLevelCategory: 'Ramp down' },
        calc: (inputs: any[], descs: any) => {

          let keys: any;

          if (Array.isArray(descs['n2'])) {
            keys = [
              descs['n2'][0] + 'Ramp down',
              descs['n2'][1] + 'Ramp down'
            ];
          } else if (!descs['n2']) {
            keys = [
              'Ramp down'
            ];
          } else {
            keys = [
              descs['n2'] + 'Ramp down',
            ];
          }

          const maches = inputs.reduce((acc, item) => {
            const itemKey = descs['n2'] ? item['n2'] + item['highLevelCategory'] : item['highLevelCategory'];

            keys.forEach((k: any) => {
              if (itemKey === k) acc.push(item);
            });

            return acc;
          }, []);

          const res = maches.reduce((acc: number, item: any) => acc + Number(item.periods['2017']), 0);
          return res;
        }
      },
      {
        title: 'others',
        class: 'background-light',
        period: '2017',
        dataSources: {
          highLevelCategory: ['Others', 'Transfers']
        },
        calc: (inputs: any[], descs: any) => {
          // const keys = [
          //   descs['n2'] + 'Others',
          //   descs['n2'] + 'Transfers'
          // ];

          let keys: any;

          if (Array.isArray(descs['n2'])) {
            keys = [
              descs['n2'][0] + 'Ramp up',
              descs['n2'][1] + 'Ramp up'
            ];
          } else if (!descs['n2']) {
            keys = [
              'Ramp up'
            ];
          } else {
            keys = [
              descs['n2'] + 'Ramp up',
            ];
          }

          const maches = inputs.reduce((acc, item) => {
            const itemKey = descs['n2'] ? item['n2'] + item['highLevelCategory'] : item['highLevelCategory'];

            keys.forEach((k: any) => {
              if (itemKey === k) acc.push(item);
            });

            return acc;
          }, []);

          const res = maches.reduce((acc: number, item: any) => acc + Number(item.periods['2017']), 0);
          return res;
        }
      },
      {
        title: 'LP', class: 'r-border', period: '2017', dataSources: { highLevelCategory: 'Landing point' },
        calc: (inputs: any[], descs: any) => {
          let keys: any;

          if (Array.isArray(descs['n2'])) {
            keys = [
              descs['n2'][0] + 'Landing point',
              descs['n2'][1] + 'Landing point'
            ];
          } else if (!descs['n2']) {
            keys = [
              'Ramp up'
            ];
          } else {
            keys = [
              descs['n2'] + 'Landing point',
            ];
          }


          const maches = inputs.reduce((acc, item) => {
            const itemKey = descs['n2'] ? item['n2'] + item['highLevelCategory'] : item['highLevelCategory'];

            keys.forEach((k: any) => {
              if (itemKey === k) acc.push(item);
            });

            return acc;
          }, []);

          const res = maches.reduce((acc: number, item: any) => acc + Number(item.periods['2017']), 0);
          return res;
        }
      },
      {
        title: 'RU', class: 'background-light l-border', period: '2018', dataSources: { highLevelCategory: 'Ramp up' },
        calc: (inputs: any[], descs: any) => {

          let keys: any;

          if (Array.isArray(descs['n2'])) {
            keys = [
              descs['n2'][0] + 'Ramp up',
              descs['n2'][1] + 'Ramp up'
            ];
          } else if (!descs['n2']) {
            keys = [
              'Ramp up'
            ];
          } else {
            keys = [
              descs['n2'] + 'Ramp up',
            ];
          }

          const maches = inputs.reduce((acc, item) => {
            const itemKey = descs['n2'] ? item['n2'] + item['highLevelCategory'] : item['highLevelCategory'];

            keys.forEach((k: any) => {
              if (itemKey === k) acc.push(item);
            });

            return acc;
          }, []);

          const res = maches.reduce((acc: number, item: any) => acc + Number(item.periods['2018']), 0);
          return res;
        }
      },
      {
        title: 'RD', class: 'background-light', period: '2018', dataSources: { highLevelCategory: 'Ramp down' },
        calc: (inputs: any[], descs: any) => {

          let keys: any;

          if (Array.isArray(descs['n2'])) {
            keys = [
              descs['n2'][0] + 'Ramp down',
              descs['n2'][1] + 'Ramp down'
            ];
          } else if (!descs['n2']) {
            keys = [
              'Ramp down'
            ];
          } else {
            keys = [
              descs['n2'] + 'Ramp down',
            ];
          }

          const maches = inputs.reduce((acc, item) => {
            const itemKey = descs['n2'] ? item['n2'] + item['highLevelCategory'] : item['highLevelCategory'];

            keys.forEach((k: any) => {
              if (itemKey === k) acc.push(item);
            });

            return acc;
          }, []);

          const res = maches.reduce((acc: number, item: any) => acc + Number(item.periods['2018']), 0);
          return res;
        }
      },
      {
        title: 'others',
        class: 'background-light',
        period: '2018',
        dataSources: {
          highLevelCategory: ['Others', 'Transfers']
        },
        calc: (inputs: any[], descs: any) => {

          let keys: any;

          if (Array.isArray(descs['n2'])) {
            keys = [
              descs['n2'][0] + 'Others',
              descs['n2'][1] + 'Transfers',
              descs['n2'][0] + 'Transfers',
              descs['n2'][1] + 'Others'
            ];
          } else if (!descs['n2']) {
            keys = [
              'Others',
              'Transfers'
            ];
          } else {
            keys = [
              descs['n2'] + 'Others',
              descs['n2'] + 'Transfers'
            ];
          }

          const maches = inputs.reduce((acc, item) => {
            const itemKey = descs['n2'] ? item['n2'] + item['highLevelCategory'] : item['highLevelCategory'];

            keys.forEach((k: any) => {
              if (itemKey === k) acc.push(item);
            });

            return acc;
          }, []);

          const res = maches.reduce((acc: number, item: any) => acc + Number(item.periods['2018']), 0);
          return res;
        }
      },
      {
        title: 'LP', class: 'r-border', period: '2018', dataSources: { highLevelCategory: 'Landing point' },
        calc: (inputs: any[], descs: any) => {
          let keys: any;

          if (Array.isArray(descs['n2'])) {
            keys = [
              descs['n2'][0] + 'Landing point',
              descs['n2'][1] + 'Landing point'
            ];
          } else {
            keys = [
              descs['n2'] + 'Landing point',
            ];
          }


          const maches = inputs.reduce((acc, item) => {
            const itemKey = descs['n2'] ? item['n2'] + item['highLevelCategory'] : item['highLevelCategory'];

            keys.forEach((k: any) => {
              if (itemKey === k) acc.push(item);
            });

            return acc;
          }, []);

          const res = maches.reduce((acc: number, item: any) => acc + Number(item.periods['2018']), 0);
          return res;
        }
      },
      // { title: 'RU', class: 'background-light l-border', dataSources: { period: '2019', highLevelCategory: 'Ramp up' } },
      // { title: 'RD', class: 'background-light', dataSources: { period: '2019', highLevelCategory: 'Ramp down' } },
      // {
      //   title: 'OTHER',
      //   class: 'background-light',
      //   dataSources: { period: '2019', highLevelCategory: ['Other in', 'Other out', 'Transfer in', 'Transfer out'] },
      //   calc: (inputs: any[]) => {
      //     return inputs.reduce((acc, item) => {
      //       acc.value = +acc.value + +item.value;
      //       return acc;
      //     }).value;
      //   }
      // },
      // { title: 'LP', class: 'r-border', dataSources: { period: '2019', highLevelCategory: 'Landing point' } },
    ];

    this.lastColumnsDesc = {
      title: null,
      class: 'background-light', dataSources: { highLevelCategory: 'Landing point' },
      calc: (inputs: any[], descs: any) => {

        let keys: any;

        if (Array.isArray(descs['n2'])) {
          keys = [
            descs['n2'][0] + 'Landing point',
            descs['n2'][1] + 'Landing point'
          ];
        } else {
          keys = [
            descs['n2'] + 'Landing point',
          ];
        }


        const maches = inputs.reduce((acc, item) => {
          const itemKey = descs['n2'] ? item['n2'] + item['highLevelCategory'] : item['highLevelCategory'];

          keys.forEach((k: any) => {
            if (itemKey === k) acc.push(item);
          });

          return acc;
        }, []);

        const r2018 = maches.reduce((acc: number, item: any) => acc + Number(item.periods['2018']), 0);
        const actual = maches.reduce((acc: number, item: any) => acc + Number(item.periods['actual']), 0);

        // const lp = inputs.filter((item: any) => item.period === '2019')[0];
        //   const fp = inputs.filter((item: any) => item.period === 'Actuals')[0];
        return (Number(r2018 - actual) / Number(actual) * 100);
      }
    };


    this.rowsDescs = [
      { title: 'GS', dataSources: { n2: 'Global Services' } },
      { title: 'P', dataSources: { n2: 'MN Products-RN' } },
      { title: 'CC', dataSources: { n2: 'MN Products-CC' } },
      { title: 'AMS', dataSources: { n2: 'Advanced MN Solutions' } },
      { title: 'PPS', dataSources: { n2: 'Product Portfolio Sales' } },
      { title: 'SPS', dataSources: { n2: 'Services Portfolio Sales' } },
      { title: 'COO', dataSources: { n2: 'COO' } },
      { title: 'CM', dataSources: { n2: 'Commercial Management' } },
      { title: 'CTO', dataSources: { n2: 'CTO' } },
      { title: 'Mgmt', class: 'b-border', dataSources: { n2: ['Central Team', 'Business and Portfolio Integration Leadership'] } },
      { title: 'MNTotal', dataSources: { n2: null } }
    ];


  }

  // getPeriods(data: BusinessDataUnit[]): string[] {
  //   return data
  //     .map(item => item.period)
  //     .reduce((acc, item) => {
  //       if (acc.indexOf(item) === -1) {
  //         acc.push(item);
  //       }
  //       return acc;
  //     }, []).sort();
  // }

  getTableData() {
    this.entityKey = this.selectedItem.identifier.toLowerCase();
    const query = {
      [this.entityKey]: this.selectedItem[this.entityKey],
      identifier: this.selectedItem.identifier
    };
    this.dataProvider.query(query);
  }

  getCellValue(rowDesc: any, colDesc: any, p: any) {
    const asKeys = Object.assign(rowDesc.dataSources, colDesc.dataSources);
    const calc = rowDesc.calc || colDesc.calc;

    // Object.keys(asKeys)
    //   .forEach(key => {
    //     if (!Array.isArray(asKeys[key])) {
    //       asKeys[key] = [asKeys[key]];
    //     }
    //   });

    // const maches = this.businessData.reduce((acc, item) => {
    //   const machItem = Object.keys(asKeys).reduce((matchArr, key) => {
    //     matchArr.push(asKeys[key].indexOf(item[key]) !== -1);
    //     return matchArr;
    //   }, []).indexOf(false) === -1 ? item : null;
    //   if (machItem) acc.push(machItem);
    //   return acc;
    // }, []);

    if (!this.businessData.length) return '-';
    if (!calc) return '-';
    return calc(this.businessData, asKeys) || '-';
  }

  openOverviewSheet() {
    this.onClickEmitter.emit(OverviewSheetComponent);
  }

  public close() {
    this.onCloseEmitter.emit();
  }
}
