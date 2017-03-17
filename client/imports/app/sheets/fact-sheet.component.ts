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
        title: 'act P01', class: 'l-border', period: 'actual', dataSources: { highLevelCategory: 'Landing point' }
      },
      // { title: 'LP', class: 'r-border', dataSources: { period: '2016', highLevelCategory: 'Landing point' } },
      {
        title: 'RU', class: 'background-light l-border', period: '2017', dataSources: { highLevelCategory: 'Ramp up' }
      },
      {
        title: 'RD', class: 'background-light', period: '2017', dataSources: { highLevelCategory: 'Ramp down' }
      },
      {
        title: 'others',
        class: 'background-light',
        period: '2017',
        dataSources: {
          highLevelCategory: 'Others'
        }
      },
      {
        title: 'LP', class: 'r-border', period: '2017', dataSources: { highLevelCategory: 'Landing point' }
      },
      {
        title: 'RU', class: 'background-light l-border', period: '2018', dataSources: { highLevelCategory: 'Ramp up' }
      },
      {
        title: 'RD', class: 'background-light', period: '2018', dataSources: { highLevelCategory: 'Ramp down' }
      },
      {
        title: 'others',
        class: 'background-light',
        period: '2018',
        dataSources: {
          highLevelCategory: 'Others'
        }
      },
      {
        title: 'LP', class: 'r-border', period: '2018', dataSources: { highLevelCategory: 'Landing point' }
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
        if (inputs.length) {
          const r2018 = inputs[0].periods['2018'];
          const actual = inputs[0].periods['actual'];
          return (Number(r2018 - actual) / Number(actual) * 100);
        }
      }
    };


    this.rowsDescs = [
      { title: 'GS', dataSources: { n2: 'Global Services', n3: 'Total' } },
      { title: 'P', dataSources: { n2: 'MN Products-RN', n3: 'Total' } },
      { title: 'CC', dataSources: { n2: 'MN Products-CC', n3: 'Total' } },
      { title: 'AMS', dataSources: { n2: 'Advanced MN Solutions', n3: 'Total' } },
      { title: 'PPS', dataSources: { n2: 'Product Portfolio Sales', n3: 'Total' } },
      { title: 'SPS', dataSources: { n2: 'Services Portfolio Sales', n3: 'Total' } },
      { title: 'COO', dataSources: { n2: 'COO', n3: 'Total' } },
      { title: 'CM', dataSources: { n2: 'Commercial Management', n3: 'Total' } },
      { title: 'CTO', dataSources: { n2: 'CTO', n3: 'Total' } },
      { title: 'Mgmt', class: 'b-border', dataSources: { n2: 'Central Team', n3: 'Total' } },
      { title: 'MNTotal', dataSources: { n2: 'Total', n3: 'Total' } }
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

    const result = this.businessData
      .filter((item) => item.highLevelCategory === asKeys.highLevelCategory)
      .filter((item) => item.n2 === asKeys.n2)
      .filter((item) => item.n3 === asKeys.n3);

    if (calc) return calc(result, asKeys);

    if (result.length) {
      return result[0]['periods'][colDesc.period].toString();
    } else {
      return '0';
    }


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

    // if (!this.businessData.length) return '-';
    // if (!calc) return '-';
    // return calc(this.businessData, asKeys) || '-';
  }

  openOverviewSheet() {
    this.onClickEmitter.emit(OverviewSheetComponent);
  }

  public close() {
    this.onCloseEmitter.emit();
  }
}
