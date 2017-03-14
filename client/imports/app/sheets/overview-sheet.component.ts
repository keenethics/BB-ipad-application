import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
  ViewEncapsulation
} from '@angular/core';

import { DataProvider, SumBusinessUnitsPipe } from '../data-management';
import { BusinessDataUnit } from '../../../../both/data-management';
import { FactSheetComponent } from './fact-sheet.component';

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
  @Input() excludedPeriods: any[];
  @Output() onClickEmitter = new EventEmitter();
  @Output() onCloseEmitter = new EventEmitter();

  public periods: any[];
  public entityKey: string;
  private businessData: BusinessDataUnit[];

  constructor(private dataProvider: DataProvider) {
    if (!this.rowsDescs) {
      this.rowsDescs = [
        { title: 'Opening', dataSources: ['Opening'], color: 'row-color-3' },
        { title: 'OUT Real Ramp down', dataSources: ['Ramp down'], color: '' },
        { title: 'IN Real Ramp up', dataSources: ['Ramp up'], color: '' },
        { title: 'NET Transfer', dataSources: ['Transfers'], color: '' },
        { title: 'NET Others', dataSources: ['Others'], color: '' },
        { title: 'Landing point', dataSources: ['Landing point'], color: 'row-color-3' }
      ];
    }

    if (!this.excludedPeriods) {
      this.excludedPeriods = [2016, 'actual'];
    }
  }

  ngOnInit() {
    this.getTableData();
  }

  ngAfterViewInit() {
    const sum = new SumBusinessUnitsPipe().transform;
    this.dataProvider.data$.subscribe((data) => {
      if (data.length) {
        this.businessData = sum(data, 'highLevelCategory');
        this.periods = Object.keys(this.businessData[0].periods);
      }
    });
  }

  getTableData() {
    this.entityKey = this.selectedItem.identifier.toLowerCase();
    const query = {
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
    // period = fromPrev ? period - 1 : period;
    return this.businessData.reduce((acc, item) => {
      for (let i = 0; i < sources.length; i++) {
        if (sources[i] === item.highLevelCategory) {
          return acc + Number(item.periods[period]);
        }
      }
      return acc;
    }, 0);
  }
}
