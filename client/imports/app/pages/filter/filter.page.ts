import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { DataProvider } from '../../data-management';
import { FilterController, RangeFilterController } from '../../filters';
import { MeteorObservable } from 'meteor-rxjs';

import styles from './filter.page.scss';
import template from './filter.page.html';

@Component({
  selector: 'filter-page',
  template,
  styles: [styles],
  encapsulation: ViewEncapsulation.None,
  providers: [DataProvider]
})
export class FilterPage implements OnInit, OnDestroy {
  public filterForm: FormGroup;
  public range: any;
  public filter: any;
  private _sbscrs: any[] = [];

  constructor(
    private filterCtrl: FilterController,
    private fb: FormBuilder,
    private dataProvider: DataProvider,
    private rangeFilterCtrl: RangeFilterController
  ) {

  }

  ngOnInit() {
    this.subscribe();
    // this.rangeFilterCtrl.getMaxRangeState();
  }

  ngOnDestroy() {
    this.unsubscribe();
  }

  handleRangeChange(rangeValue: any) {
    this.rangeFilterCtrl.updateValue(rangeValue);
  }

  subscribe() {
    this._sbscrs.push(this.rangeFilterCtrl.rangeState$.subscribe((r) => {
      this.range = r;
    }));
  }

  unsubscribe() {
    this._sbscrs.forEach((s: any) => s.unsubscribe());
  }
};
