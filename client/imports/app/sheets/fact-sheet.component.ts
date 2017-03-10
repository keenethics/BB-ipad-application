import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  NgZone
} from '@angular/core';

import { DataProvider } from '../data-management';
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
      this.businessData = data;
      this.periods = this.getPeriods(data);
      this.initTableDescriptions();
    });
  }

  ngOnInit() {
    this.getTableData();
  }

  initTableDescriptions() {
    this.columnsDescs = [
      { title: 'P12', class: 'l-border', dataSources: { period: 'Actuals', highLevelCategory: 'Landing point' } },
      { title: 'LP', class: 'r-border', dataSources: { period: '2016', highLevelCategory: 'Landing point' } },
      { title: 'Ramp up', class: 'background-light l-border', dataSources: { period: '2017', highLevelCategory: 'Ramp up' } },
      { title: 'Ramp down', class: 'background-light', dataSources: { period: '2017', highLevelCategory: 'Ramp down' } },
      {
        title: 'Other flows',
        class: 'background-light',
        dataSources: {
          period: '2017', highLevelCategory: ['Other in', 'Other out', 'Transfer in', 'Transfer out']
        },
        calc: (inputs: any[]) => {
          return inputs.reduce((acc, item) => {
            acc.value = +acc.value + +item.value;
            return acc;
          }).value;
        }
      },
      { title: 'LP', class: 'r-border', dataSources: { period: '2017', highLevelCategory: 'Landing point' } },
      { title: 'Ramp up', class: 'background-light l-border', dataSources: { period: '2018', highLevelCategory: 'Ramp up' } },
      { title: 'Ramp down', class: 'background-light', dataSources: { period: '2018', highLevelCategory: 'Ramp down' } },
      {
        title: 'Other flows',
        class: 'background-light',
        dataSources: { period: '2018', highLevelCategory: ['Other in', 'Other out', 'Transfer in', 'Transfer out'] },
        calc: (inputs: any[]) => {
          return inputs.reduce((acc, item) => {
            acc.value = +acc.value + +item.value;
            return acc;
          }).value;
        }
      },
      { title: 'LP', class: 'r-border', dataSources: { period: '2018', highLevelCategory: 'Landing point' } },
      { title: 'Ramp up', class: 'background-light l-border', dataSources: { period: '2019', highLevelCategory: 'Ramp up' } },
      { title: 'Ramp down', class: 'background-light', dataSources: { period: '2019', highLevelCategory: 'Ramp down' } },
      {
        title: 'Other flows',
        class: 'background-light',
        dataSources: { period: '2019', highLevelCategory: ['Other in', 'Other out', 'Transfer in', 'Transfer out'] },
        calc: (inputs: any[]) => {
          return inputs.reduce((acc, item) => {
            acc.value = +acc.value + +item.value;
            return acc;
          }).value;
        }
      },
      { title: 'LP', class: 'r-border', dataSources: { period: '2019', highLevelCategory: 'Landing point' } },
      {
        title: 'LP2019 vs P122016',
        class: 'background-light', dataSources: { period: ['Actuals', '2019'], highLevelCategory: 'Landing point' },
        calc: (inputs: any[]) => {
          if (inputs.length > 1) {
            const lp = inputs.filter((item: any) => item.period === '2019')[0];
            const fp = inputs.filter((item: any) => item.period === 'Actuals')[0];
            return (Number(lp.value - fp.value) / Number(fp.value) * 100);
          }

          return Number(inputs[0].value);
        }
      }
    ];

    this.lastColumnsDesc = this.columnsDescs[this.columnsDescs.length - 1];


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
      { title: 'MNTotal', dataSources: { n2: 'Total' } }
    ];

    // if (!this.columnsDescs) {
    //   this.columnsDescs = [
    // { title: 'MN TOTAL', dataSources: { n2: 'Total' } },
    // { title: 'MN P', dataSources: { n2: 'MN Products-RN' } },
    // { title: 'MN CC', dataSources: { n2: 'MN Products-CC' } },
    // { title: 'GS', dataSources: { n2: 'Global Services' } },
    // { title: 'AMS', dataSources: { n2: 'Advanced MN Solutions' } },
    // { title: 'PPS', dataSources: { n2: 'Product Portfolio Sales' } },
    // { title: 'SPS', dataSources: { n2: 'Services Portfolio Sales' } },
    // { title: 'COO', dataSources: { n2: 'COO' } },
    // { title: 'CM', dataSources: { n2: 'Commercial Management' } },
    // { title: 'CTO', dataSources: { n2: 'CTO' } },
    // { title: 'OTHERS', dataSources: { n2: ['Central Team', 'Business and Portfolio Integration Leadership'] } }
    //   ];
    // }

    // let firstPeriod: string | number = '-';
    // let baseLineYear: string | number = '-';
    // let lastPeriod = '-';

    // if (this.periods.length) {
    //   firstPeriod = this.periods.reduce((acc, item) => acc || Number(item), null);
    //   baseLineYear = firstPeriod as number - 1;
    //   lastPeriod = this.periods.reverse().reduce((acc, item) => acc || Number(item), null);
    // }


    // this.rowsDescs = [
    //   {
    //     title: `Baseline P12/${baseLineYear}`,
    //     class: 'background-light', dataSources: { period: 'Baseline', highLevelCategory: 'Landing point' },
    //     color: ''
    //   },
    //   {
    //     title: `P12/${firstPeriod}`,
    //     class: 'background-light', dataSources: { period: String(firstPeriod), highLevelCategory: 'Landing point' },
    //     color: 'row-color-3'
    //   },
    //   {
    //     title: `Net down/up P12/${firstPeriod} - ${lastPeriod}`,
    //     class: 'background-light', dataSources: { period: [String(lastPeriod), String(firstPeriod)], highLevelCategory: 'Landing point' },
    // calc: (inputs: any[]) => {
    //   if (inputs.length > 1) {
    //     const lp = inputs.filter((item: any) => item.period === String(lastPeriod))[0];
    //     const fp = inputs.filter((item: any) => item.period === String(firstPeriod))[0];
    //     return lp.value - fp.value;
    //   }
    //   return inputs[0].value;
    // },
    //     color: ''
    //   },
    //   {
    //     title: `Landing point ${lastPeriod}`,
    //     class: 'background-light', dataSources: { period: String(lastPeriod), highLevelCategory: 'Landing point' },
    //     color: 'row-color-3'
    //   },
    //   {
    //     title: `YE${lastPeriod} vs. P12/${firstPeriod}`,
    //     class: 'background-light', dataSources: { period: [String(firstPeriod), String(lastPeriod)], highLevelCategory: 'Landing point' },
    // calc: (inputs: any[]) => {
    //   if (inputs.length > 1) {
    //     const lp = inputs.filter((item: any) => item.period === String(lastPeriod))[0];
    //     const fp = inputs.filter((item: any) => item.period === String(firstPeriod))[0];
    //     return (Number(lp.value - fp.value) / Number(fp.value) * 100);
    //   }

    //   return Number(inputs[0].value);
    // },
    //     color: 'row-color-3'
    //   }
    // ];

    // this.excludedRowsDescs = [this.rowsDescs[this.rowsDescs.length - 1]];
  }

  getPeriods(data: BusinessDataUnit[]): string[] {
    return data
      .map(item => item.period)
      .reduce((acc, item) => {
        if (acc.indexOf(item) === -1) {
          acc.push(item);
        }
        return acc;
      }, []).sort();
  }

  getTableData() {
    this.entityKey = this.selectedItem.identifier.toLowerCase();
    const query = {
      [this.entityKey]: this.selectedItem[this.entityKey],
      identifier: this.selectedItem.identifier
    };
    this.dataProvider.query(query);
  }

  getCellValue(rowDesc: any, colDesc: any) {
    const asKeys = Object.assign(rowDesc.dataSources, colDesc.dataSources);
    const calc = rowDesc.calc || colDesc.calc;

    Object.keys(asKeys)
      .forEach(key => {
        if (!Array.isArray(asKeys[key])) {
          asKeys[key] = [asKeys[key]];
        }
      });

    const maches = this.businessData.reduce((acc, item) => {
      const machItem = Object.keys(asKeys).reduce((matchArr, key) => {
        matchArr.push(asKeys[key].indexOf(item[key]) !== -1);
        return matchArr;
      }, []).indexOf(false) === -1 ? item : null;
      if (machItem) acc.push(machItem);
      return acc;
    }, []);

    if (!maches.length) return '-';
    return (calc ? calc(maches) : maches[0].value) || '-';
  }

  openOverviewSheet() {
    this.onClickEmitter.emit(OverviewSheetComponent);
  }

  public close() {
    this.onCloseEmitter.emit();
  }
}
