import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
  ViewEncapsulation
} from '@angular/core';
import { Observable } from 'rxjs';
import { DataProvider, SumBusinessUnitsPipe } from '../data-management';
import { BusinessDataUnit } from '../../../../both/data-management';
import { FactSheetComponent } from './fact-sheet.component';
import { FilterController } from '../filters';
import { DataUpdateInfo } from '../data-management/data-update-info';

import template from './overview-sheet.component.html';
import styles from './sheets.styles.scss';
import cmpStyles from './overview-sheet.component.scss';

@Component({
  selector: 'overview-sheet',
  template,
  styles: [styles, cmpStyles],
  providers: [DataProvider],
  encapsulation: ViewEncapsulation.None
})
export class OverviewSheetComponent {
  @Input() selectedItem: any;
  @Input() options: any;
  @Input() rowsDescs: any[];
  @Input() columnsDescs: any[];
  @Output() onClickEmitter = new EventEmitter();
  @Output() onCloseEmitter = new EventEmitter();

  public periods: any[];
  public entityKey: string;
  private businessData: BusinessDataUnit[];
  private chartData: any[];

  private _subs: any[];

  constructor(private dataProvider: DataProvider, private filterCtrl: FilterController, private info: DataUpdateInfo) {
    Observable
      .forkJoin(dataProvider.data$.take(2), info.info$.take(1))
      .subscribe(all => {
        this.businessData = all[0];
        this.setPeriods(all[1]);
        this.chartData = this.getRawData();
      }).unsubscribe();

    this.dataProvider.data$.subscribe((data) => {
      if (data.length) {
        this.businessData = data;
        this.initTableDescriptions();
        if (this.periods) {
          this.chartData = this.getRawData();
        }
      }
    });

    this.info.info$.subscribe(i => {
      this.setPeriods(i);
    });
  }

  setPeriods(i: any) {
    this.periods = [
      { title: 'P12 2016', colspan: '1', rowspan: '2', class: 'dark-grey' },
      { title: 'YTD 2017', colspan: '3', rowspan: '1', class: 'blue' },
      { title: i.period, colspan: '1', rowspan: '2', class: 'blue' },
      { title: 'Delta to go', colspan: '1', rowspan: '2', class: 'head-grey' },
      { title: 'LP 2017', colspan: '1', rowspan: '2', class: 'head-grey' },
      { title: 'LP 2018', colspan: '1', rowspan: '2', class: 'head-grey' },
    ];
  }

  getCellValue(rowDesc: any, colDesc: any) {
    const asKeys = Object.assign(rowDesc.dataSources, colDesc.dataSources);
    const calc = rowDesc.calc || colDesc.calc;

    const result = this.businessData
      .filter((item) => item.highLevelCategory === asKeys.highLevelCategory);

    if (calc) return calc(result, asKeys);

    if (result.length) {
      return (result.reduce((acc, item) => {
        return acc + +item.periods[colDesc.period];
      }, 0).toString());
    } else {
      return '0';
    }
  }

  initTableDescriptions() {
    this.columnsDescs = [
      {
        title: '', class: 'dark-grey', period: '2016', dataSources: { highLevelCategory: 'Landing point' }
      }, // 2017 YTD
      {
        title: 'RD', class: 'blue', period: '2017Ytd', dataSources: { highLevelCategory: 'Ramp down' }
      },
      {
        title: 'RU', class: 'blue', period: '2017Ytd', dataSources: { highLevelCategory: 'Ramp up' }
      },
      {
        title: 'Others',
        class: 'blue',
        period: '2017Ytd',
        dataSources: {
          highLevelCategory: 'Others'
        }
      },
      {
        title: '', class: 'blue', period: 'actual', dataSources: { highLevelCategory: 'Landing point' }
      },
      {
        title: '', class: 'head-grey', dataSources: { highLevelCategory: 'Landing point' },
        calc: (inputs: any) => {
          return (inputs.reduce((acc: any, item: any) => {
            return acc + (+item.periods[2017] - +item.periods['actual']);
          }, 0).toString());
        }
      }, // 2017
      {
        title: '', class: 'head-grey', period: '2017', dataSources: { highLevelCategory: 'Landing point' }
      }, // 2018
      {
        title: '', class: 'head-grey', period: '2018', dataSources: { highLevelCategory: 'Landing point' }
      },
    ];

    this.rowsDescs = [
      { title: '', class: 'clear', dataSources: {} },
    ];
  }

  ngOnInit() {
    this.filterCtrl.currentFilter$
      .subscribe((queryObj) => {
        this.getTableData(queryObj);
      });
  }

  getTableData(currentQuery: any) {
    this.entityKey = this.selectedItem.identifier.toLowerCase();
    const query = Object.assign({}, currentQuery);
    query[this.entityKey] = this.selectedItem[this.entityKey];
    query.identifier = this.selectedItem.identifier;
    delete query.highLevelCategory;
    this.dataProvider.query(query);
  }

  openFactSheet() {
    this.onClickEmitter.emit(FactSheetComponent);
  }

  close() {
    this.onCloseEmitter.emit();
  }

  getRawData() {
    const data: any[] = [];

    this.rowsDescs.forEach((row => {
      this.columnsDescs.forEach((col) => {
        data.push({ name: col.title, value: this.getCellValue(row, col) });
      });
    }));

    let pIndex = 0;
    for (let i = 0; i < data.length; i++) {
      if (!data[i].name) {
        data[i].name = this.periods[pIndex].colspan !== '3' ? this.periods[pIndex].title : this.periods[++pIndex].title;
        pIndex++;
      }
    }

    return data;
  }
}
