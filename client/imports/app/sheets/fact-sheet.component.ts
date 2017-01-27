import {
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { DataProvider } from '../data-management';
import { BusinessDataUnit } from '../../../../both/data-management';

import template from './fact-sheet.component.html';
import styles from './sheets.styles.scss';
import componentStyles from './fact-sheet.component.scss';

@Component({
  selector: 'fact-sheet',
  template,
  styles: [styles, componentStyles],
  providers: [DataProvider]
})
export class FactSheetComponent {
  @Input() selectedItem: any;
  @Input() options: any;
  @Input() columnsDescs: any[];
  @Input() rowsDescs: any[];
  @Output() onCloseEmitter = new EventEmitter();

  public entityKey: string;
  public businessData: BusinessDataUnit[];
  public excludedRowsDescs: any[];
  public periods: string[];

  constructor(private dataProvider: DataProvider) {
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
    if (!this.columnsDescs) {
      this.columnsDescs = [
        { title: 'MN TOTAL', dataSources: { n2: 'Total' } },
        { title: 'MN P', dataSources: { n2: 'MN Products-RN' } },
        { title: 'MN CC', dataSources: { n2: 'MN Products-CC' } },
        { title: 'GS', dataSources: { n2: 'Global Services' } },
        { title: 'AMS', dataSources: { n2: 'Advanced MN Solutions' } },
        { title: 'PPS', dataSources: { n2: 'Product Portfolio Sales' } },
        { title: 'SPS', dataSources: { n2: 'Services Portfolio Sales' } },
        { title: 'COO', dataSources: { n2: 'COO' } },
        { title: 'CM', dataSources: { n2: 'Commercial Management' } },
        { title: 'CTO', dataSources: { n2: 'CTO' } },
        { title: 'OTHERS', dataSources: { n2: ['Central Team', 'Business and Portfolio Integration Leadership'] } }
      ];
    }

    let firstPeriod: string | number = '-';
    let baseLineYear: string | number = '-';
    let lastPeriod = '-';

    if (this.periods.length) {
      firstPeriod = this.periods.reduce((acc, item) => acc || Number(item), null);
      baseLineYear = firstPeriod as number - 1;
      lastPeriod = this.periods.reverse().reduce((acc, item) => acc || Number(item), null);
    }


    this.rowsDescs = [
      {
        title: `Baseline P12/${baseLineYear}`,
        dataSources: { period: 'Baseline', highLevelCategory: 'Landing point' },
        color: ''
      },
      {
        title: `P12/${firstPeriod}`,
        dataSources: { period: String(firstPeriod), highLevelCategory: 'Landing point' },
        color: 'row-color-3'
      },
      {
        title: `Net down/up P12/${firstPeriod} - ${lastPeriod}`,
        dataSources: { period: [String(lastPeriod), String(firstPeriod)], highLevelCategory: 'Landing point' },
        calc: (inputs: any[]) => {
          if (inputs.length > 1) {
            const lp = inputs.filter((item: any) => item.period === String(lastPeriod))[0];
            const fp = inputs.filter((item: any) => item.period === String(firstPeriod))[0];
            return lp.value - fp.value;
          }
          return inputs[0].value;
        },
        color: ''
      },
      {
        title: `Landing point ${lastPeriod}`,
        dataSources: { period: String(lastPeriod), highLevelCategory: 'Landing point' },
        color: 'row-color-3'
      },
      {
        title: `YE${lastPeriod} vs. P12/${firstPeriod}`,
        dataSources: { period: [String(firstPeriod), String(lastPeriod)], highLevelCategory: 'Landing point' },
        calc: (inputs: any[]) => {
          if (inputs.length > 1) {
            const lp = inputs.filter((item: any) => item.period === String(lastPeriod))[0];
            const fp = inputs.filter((item: any) => item.period === String(firstPeriod))[0];
            return (Number(lp.value - fp.value) / Number(fp.value) * 100);
          }

          return Number(inputs[0].value);
        },
        color: 'row-color-3'
      }
    ];

    this.excludedRowsDescs = [this.rowsDescs[this.rowsDescs.length - 1]];
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

  public close() {
    this.onCloseEmitter.emit();
  }
}
