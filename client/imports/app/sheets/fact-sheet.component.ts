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
import { DataUpdateInfo } from '../data-management/data-update-info';

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
  public periods: any[];
  public actualPeriodTitle: string;

  private _subs: any[];

  constructor(private dataProvider: DataProvider, private info: DataUpdateInfo) {
    this._subs = [
      this.info.info$.subscribe(i => {
        this.actualPeriodTitle = i.period;
      }),
      this.dataProvider.data$.subscribe((data) => {
        if (data.length) {
          this.periods = [
            { title: 'BU', colspan: '1', rowspan: '2', class: 'bu' },
            { title: '2015 P12', colspan: '1', rowspan: '2', class: 'dark-grey' },
            { title: '2016', colspan: '4', rowspan: '1', class: 'dark-grey' },
            { title: 'YTD 2017', colspan: '3', rowspan: '1', class: 'blue' },
            { title: this.actualPeriodTitle, colspan: '1', rowspan: '2', class: 'blue' },
            { title: 'FC 2017', colspan: '3', rowspan: '1', class: 'head-grey' },
            { title: 'LP 2017', colspan: '1', rowspan: '2', class: 'head-grey' },
            { title: 'FC 2018', colspan: '3', rowspan: '1', class: 'head-grey' },
            { title: 'LP 2018', colspan: '1', rowspan: '2', class: 'head-grey' },
            { title: 'LP 2018 vs P12\'15', colspan: '2', rowspan: '2', class: 'dark-grey' }
          ];
          this.businessData = data;
          this.initTableDescriptions();
        }
      })
    ];
  }

  ngOnInit() {
    this.getTableData();
  }

  ngOnDestroy() {
    this._unsubscribe();
  }

  initTableDescriptions() {
    this.columnsDescs = [
      {
        title: '', class: 'dark-grey', period: '201512', dataSources: { highLevelCategory: 'Landing point' }
      }, // 2016
      {
        title: 'RD', class: 'dark-grey', period: '2016', dataSources: { highLevelCategory: 'Ramp down' }
      },
      {
        title: 'RU', class: 'dark-grey', period: '2016', dataSources: { highLevelCategory: 'Ramp up' }
      },
      {
        title: 'others',
        class: 'dark-grey',
        period: '2016',
        dataSources: {
          highLevelCategory: 'Others'
        }
      },
      {
        title: 'P12', class: 'dark-grey grey', period: '2016', dataSources: { highLevelCategory: 'Landing point' }
      }, // 2017 YTD
      {
        title: 'RD', class: 'blue', period: '2017Ytd', dataSources: { highLevelCategory: 'Ramp down' }
      },
      {
        title: 'RU', class: 'blue', period: '2017Ytd', dataSources: { highLevelCategory: 'Ramp up' }
      },
      {
        title: 'others',
        class: 'blue',
        period: '2017Ytd',
        dataSources: {
          highLevelCategory: 'Others'
        }
      }, // 2017
      {
        title: '', class: 'blue grey', period: 'actual', dataSources: { highLevelCategory: 'Landing point' }
      },
      {
        title: 'RD', class: 'head-grey', period: '2017', dataSources: { highLevelCategory: 'Ramp down' }
      },
      {
        title: 'RU', class: 'head-grey', period: '2017', dataSources: { highLevelCategory: 'Ramp up' }
      },
      {
        title: 'others',
        class: 'head-grey',
        period: '2017',
        dataSources: {
          highLevelCategory: 'Others'
        }
      },
      {
        title: '', class: 'head-grey grey', period: '2017', dataSources: { highLevelCategory: 'Landing point' }
      }, // 2018
      {
        title: 'RD', class: 'head-grey', period: '2018', dataSources: { highLevelCategory: 'Ramp down' }
      },
      {
        title: 'RU', class: 'head-grey', period: '2018', dataSources: { highLevelCategory: 'Ramp up' }
      },
      {
        title: 'others',
        class: 'head-grey',
        period: '2018',
        dataSources: {
          highLevelCategory: 'Others'
        }
      },
      {
        title: '', class: 'head-grey grey', period: '2018', dataSources: { highLevelCategory: 'Landing point' }
      }
    ];

    this.lastColumnsDesc = {
      title: null,
      class: 'dark-grey', dataSources: { highLevelCategory: 'Landing point' },
      calc: (inputs: any[], descs: any) => {
        if (inputs.length) {
          const r2018 = inputs[0].periods['2018'];
          const p201512 = inputs[0].periods['201512'];
          return (+r2018 - +p201512) / +p201512 * 100;
        }
      }
    };


    this.rowsDescs = [
      { title: 'GS', class: 'clear', dataSources: { n2: 'Global Services', n3: 'Total' } },
      { title: 'P', class: 'clear', dataSources: { n2: 'MN Products-RN', n3: 'Total' } },
      { title: 'CC', class: 'clear', dataSources: { n2: 'MN Products-CC', n3: 'Total' } },
      { title: 'AMS', class: 'clear', dataSources: { n2: 'Advanced MN Solutions', n3: 'Total' } },
      { title: 'PPS', class: 'clear', dataSources: { n2: 'Product Portfolio Sales', n3: 'Total' } },
      { title: 'SPS', class: 'clear', dataSources: { n2: 'Services Portfolio Sales', n3: 'Total' } },
      { title: 'COO', class: 'clear', dataSources: { n2: 'COO', n3: 'Total' } },
      { title: 'CM', class: 'clear', dataSources: { n2: 'Commercial Management', n3: 'Total' } },
      { title: 'CTO', class: 'clear', dataSources: { n2: 'CTO', n3: 'Total' } },
      { title: 'MGMT', class: 'clear', dataSources: { n2: 'Central Team', n3: 'Total' } },
      { title: 'Total', class: 'tb-bold', dataSources: { n2: 'Total', n3: 'Total' } }
    ];
  }

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

    if (result.length === 1) {
      return (result[0]['periods'][colDesc.period] || 0).toString();
    } else if (result.length > 1) {
      console.log(`%cWARNING! Two selections in factsheet cell: ${rowDesc.title + ' ' + colDesc.title} `,
        'background-color: red; color: #fff; padding: 1px;');
      return (result[0]['periods'][colDesc.period] || 0).toString();
    } else {
      return '0';
    }
  }

  openOverviewSheet() {
    this.onClickEmitter.emit(OverviewSheetComponent);
  }

  public close() {
    this.onCloseEmitter.emit();
  }

  private _unsubscribe() {
    this._subs.forEach(s => s.unsubscribe());
  };
}
