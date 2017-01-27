import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener
} from '@angular/core';

import { DataProvider } from '../data-management';
import { BusinessDataUnit } from '../../../../both/data-management';
import { FactSheetComponent } from './fact-sheet.component';

import template from './overview-sheet.component.html';
import styles from './sheets.styles.scss';
import cmpStyles from './overview-sheet.component.scss';

@Component({
  selector: 'overview-sheet',
  template,
  styles: [styles, cmpStyles],
  providers: [DataProvider]
})
export class OverviewSheetComponent {
  @Input() selectedItem: any;
  @Input() options: any;
  @Input() rowsDescs: any[];
  @Input() excludedPeriods: number[];
  @Output() onClickEmitter = new EventEmitter();
  @Output() onCloseEmitter = new EventEmitter();

  public periods: number[];
  public entityKey: string;
  private businessData: BusinessDataUnit[];

  constructor(private dataProvider: DataProvider) {
    if (!this.rowsDescs) {
      this.rowsDescs = [
        { title: 'Opening', dataSources: ['Landing point'], color: 'row-color-3' },
        { title: 'OUT Real Ramp down', dataSources: ['Ramp down'], color: '' },
        { title: 'IN Real Ramp up', dataSources: ['Ramp up'], color: '' },
        { title: 'NET Transfer', dataSources: ['Transfer in', 'Transfer out'], color: '' },
        { title: 'NET Others', dataSources: ['Other in', 'Other out'], color: '' },
        { title: 'Landing point', dataSources: ['Landing point'], color: 'row-color-3' }
      ];
    }

    if (!this.excludedPeriods) {
      this.excludedPeriods = [2016];
    }

    this.dataProvider.data$.subscribe((data) => {
      this.businessData = data;
      this.periods = data
        .map(item => item.period)
        .filter(item => Number(item))
        .reduce((acc, item) => {
          const year = Number(item);
          if (acc.indexOf(year) === -1) {
            acc.push(Number(year));
          }
          return acc;
        }, []).sort();
    });
  }

  ngOnInit() {
    this.getTableData();
  }

  getTableData() {
    this.entityKey = this.selectedItem.identifier.toLowerCase();
    const query = {
      n2: 'Total',
      [this.entityKey]: this.selectedItem[this.entityKey],
      identifier: this.selectedItem.identifier
    };
    this.dataProvider.query(query);
  }

  openFactSheet() {
    this.onClickEmitter.emit(FactSheetComponent);
  }

  close() {
    this.onCloseEmitter.emit();
  }

  getCellValue(sources: string[], period: number, fromPrev: boolean) {
    period = fromPrev ? period - 1 : period;
    return this.businessData.reduce((acc, item) => {
      if (item.period === String(period)) {
        for (let i = 0; i < sources.length; i++) {
          if (sources[i] === item.highLevelCategory) {
            return acc + Number(item.value);
          }
        }
      }
      return acc;
    }, 0);
  }
}
